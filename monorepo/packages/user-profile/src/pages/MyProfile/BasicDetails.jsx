/* eslint-disable default-param-last */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useContext, useState, useEffect, useRef } from 'react';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import DropDown from 'skyplus-design-system-app/dist/des-system/DropDown';
import PropTypes from 'prop-types';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { ProfileContext } from './ProfileContext';
import { profileActions } from './ProfileReducer';
import regexConstant from '../../constants/regex';
import { dateInputFormat } from '../../utils/utilFunctions';
import { BROWSER_STORAGE_KEYS, dateFormats } from '../../constants';
import { myProfileItems, SME_USER } from '../../constants/common';

const moment = require('moment');

const BasicDetails = ({
  data,
  onChange,
  validateField,
  isMember,
  isAgent,
  enableEditing,
  userType,
}) => {
  const { state, dispatch } = useContext(ProfileContext);
  const [inputValue, setInputValue] = useState({
    expirationDate: '',
    issuedDate: '',
    dateOfBirth: '',
  });
  const {
    countryList,
    stateList,
    error,
    showStateAndNationality,
    showPassportDetails,
    myProfileAemData,
  } = state;
  const countryInputRef = useRef(null);

  const authUser = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
  const isLoyaltyMember = !!(
    authUser?.loyaltyMemberInfo
    && (authUser.loyaltyMemberInfo.FFN || authUser.loyaltyMemberInfo.ffn)
  );
  // check is 6e user
  const is6Euser = !authUser?.loyaltyMemberInfo?.FFN;
  const addressIndex = data?.addresses?.findIndex(
    (item) => item.Default === true,
  );

  useEffect(() => {
    if (enableEditing && Object.keys(data)?.length > 0) {
      const travelDocument = data?.travelDocuments?.[0];
      const { dateOfBirth = '' } = data?.details || '';

      const expirationDate = travelDocument?.expirationDate
        ? moment(travelDocument.expirationDate).format(dateFormats.DDMMYYYY)
        : '';
      const issuedDate = travelDocument?.issuedDate
        ? moment(travelDocument.issuedDate).format(dateFormats.DDMMYYYY)
        : '';
      const dobDate = dateOfBirth ? moment(dateOfBirth).format(dateFormats.DDMMYYYY) : '';

      setInputValue({
        expirationDate,
        issuedDate,
        dateOfBirth: dobDate,
      });
    }
  }, [data]);

  const setShowStateAndNationality = () => {
    dispatch({
      type: profileActions.SHOW_STATE_AND_NATIONALITY,
      payload: !showStateAndNationality,
    });
  };
  const setShowPassportDetails = () => {
    dispatch({
      type: profileActions.SHOW_PASSPORT_DETAILS,
      payload: !showPassportDetails,
    });
  };

  const toggleIsOpened = () => {
    dispatch({
      type: profileActions.SET_IS_OPENED,
      payload: !state.isOpened,
    });
  };
  const handleFieldChange = (field, subfield, value, index) => {
    if (field === 'name' && (subfield === 'First' || subfield === 'Last')) {
      if (value?.match(regexConstant.NAME_ONLY_ALPHABET_SPACE_NEW)) {
        onChange(field, subfield, value, index);
      }
    } else if (subfield === 'postalCode') {
      if (value?.match(regexConstant.ONLYDIGIT)) {
        onChange(field, subfield, value, index);
      }
    } else if (
      subfield === 'lineOne'
      || subfield === 'lineTwo'
      || subfield === 'city'
    ) {
      if (
        value?.length === 0
        || value?.match(regexConstant.ALPHA_NUMERIC_SPACE)
      ) {
        onChange(field, subfield, value, index);
      }
    } else {
      onChange(field, subfield, value, index);
    }
    validateField(field, subfield, value, index);
  };
  const stateListArray = stateList?.data?.indianStatesByPath?.item?.indianStatesCountryCode || [];
  const getDropdownValue = (subfield) => {
    if (subfield === 'provinceState') {
      const filterStateDetails = stateListArray?.find(
        (item) => item?.key === data?.addresses?.[addressIndex]?.provinceState,
      );
      return filterStateDetails?.value;
    }
    if (subfield === 'countryCode') {
      const filterCountryDetails = countryList?.countries?.find(
        (item) => item?.countryCode === data?.addresses?.[addressIndex]?.countryCode,
      );
      return filterCountryDetails?.name;
    }
    return '';
  };
  const getDropdownElement = (placeholder, field, subfield = null, iRef) => (
    <div
      className="design-system-input-field position-relative mb-6 profile-input-container select"
      onClick={toggleIsOpened}
    >
      <input
        className={`my-profile-input ${isMember && 'bg-btn-disabled-background-light'}`}
        placeholder={placeholder}
        readOnly
        ref={iRef}
        value={getDropdownValue(subfield)}
      />
      <i className="icon icon-accordion-down-simple arrow-down-icon" ref={iRef} />
    </div>
  );

  const getDropdownElement1 = (
    value,
    field,
    subfield = null,
    label = null,
    isActive = '',
  ) => {
    return (
      <div
        className={`feedback-dropdown__item ${isActive && 'feedback-dropdown__item--active'}`}
        key={value}
        onClick={() => {
          onChange(field, subfield, value, addressIndex);
          toggleIsOpened();
        }}
      >
        {label}
      </div>
    );
  };

  const memberEditable = enableEditing ? true : isMember;
  const loyaltyMemberEditable = enableEditing ? true : (isLoyaltyMember || isMember);

  const countryClasses = [
    'nationality-dropdown-desktop',
    'travelling-reason-dropdown',
    'body-small-light',
    'max-height',
    memberEditable ? 'disabled-bg' : '',
  ].join(' ');

  const handleDateChange = (e, field, subfield, index) => {
    const { value } = e.target;
    const formattedValue = dateInputFormat(value);

    if (formattedValue.length > 10) return;

    const [date = '', month = '', year = ''] = formattedValue.split('-');

    // Construct the final date in YYYY-MM-DD format, ensuring components are present
    const finalDate = [
      year,
      month && `-${month}`,
      date && `-${date}`,
    ].join('');

    handleFieldChange(field, subfield, finalDate, index);

    setInputValue({
      ...inputValue,
      [subfield]: formattedValue,
    });
  };
  return (
    <div className="shadow shadow-specific rounded m-9 mt-12 p-6 p-md-8 bg-white">
      <div className="mb-6 text-primary m-fs-14">{myProfileAemData?.basicDetails}</div>

      <RadioBoxGroup
        items={myProfileItems}
        onChange={(val) => onChange('details', 'gender', val)}
        selectedValue={data?.details?.gender}
        containerClassName={`
          revamp-user-profile-profile-form-gender-checkboxes ${memberEditable ? 'editting-disabled' : ''}
        `}
        disableRadios={memberEditable}
      />

      <div className="body-small-regular text-secondary my-8 m-fs-12">
        {myProfileAemData?.govtIdDescription}
      </div>

      <Input
        placeholder={myProfileAemData?.firstNameLabel}
        className="body-small-light p-6"
        onChange={(e) => handleFieldChange('name', 'First', e.target.value)}
        value={data?.name?.First}
        customErrorMsg={error && error?.First}
        disabled={loyaltyMemberEditable}
        maxLength={32}
      />
      <Input
        placeholder={myProfileAemData?.lastNameLabel}
        className="body-small-light p-6"
        onChange={(e) => handleFieldChange('name', 'Last', e.target.value)}
        value={data?.name?.Last}
        customErrorMsg={error && error?.Last}
        disabled={loyaltyMemberEditable}
        maxLength={32}
      />

      <Input
        placeholder={
          userType === SME_USER
            ? myProfileAemData?.dateOfBirthLabelWithOutOption
            : myProfileAemData?.dateOfBirthLabel
        }
        className="body-small-light p-6"
        onChange={(e) => handleDateChange(e, 'details', 'dateOfBirth')}
        value={inputValue?.dateOfBirth}
        customErrorMsg={error && error?.dateOfBirth}
        type="text"
        disabled={memberEditable}
        showCrossIcon={!memberEditable}
        setValue={() => setInputValue({
          ...inputValue,
          dateOfBirth: '',
        })}
      />

      {(isAgent || isMember) && (
        <>
          <div className="dashed-line" />
          <div className="d-flex justify-content-between sub-header">
            <div className="body-medium text-secondary mb-8">
              {myProfileAemData?.addressLabels?.addressLabel}
            </div>
            <div>
              <i
                onClick={setShowStateAndNationality}
                className={
                  showStateAndNationality
                    ? 'icon-accordion-up-simple'
                    : 'icon-accordion-down-simple'
                }
              />
            </div>
          </div>
          {showStateAndNationality && (
            // As per current scope this field is not required so commenting it
            <>
              <Input
                placeholder={myProfileAemData?.addressLabels?.street1}
                className="body-small-light p-6"
                value={data?.addresses?.[addressIndex]?.lineOne}
                onChange={(e) => handleFieldChange(
                  'addresses',
                  'lineOne',
                  e.target.value,
                  addressIndex,
                )}
                customErrorMsg=""
                disabled={memberEditable}
              />
              <Input
                placeholder={myProfileAemData?.addressLabels?.street2}
                className="body-small-light p-6"
                value={data?.addresses?.[addressIndex]?.lineTwo}
                onChange={(e) => handleFieldChange(
                  'addresses',
                  'lineTwo',
                  e.target.value,
                  addressIndex,
                )}
                customErrorMsg=""
                disabled={memberEditable}
              />
              <Input
                placeholder={myProfileAemData?.addressLabels?.zipcode}
                className="body-small-light p-6"
                value={data?.addresses?.[addressIndex]?.postalCode}
                onChange={(e) => handleFieldChange(
                  'addresses',
                  'postalCode',
                  e.target.value,
                  addressIndex,
                )}
                customErrorMsg=""
                disabled={memberEditable}
              />
              <DropDown
                renderElement={() => getDropdownElement(
                  myProfileAemData?.nationalityLabel,
                  'addresses',
                  'countryCode',
                  countryInputRef,
                )}
                inputRef={countryInputRef}
                containerClass={countryClasses}
                items={
                  Array.isArray(countryList?.countries)
                    && countryList?.countries?.length > 0
                    ? countryList?.countries
                    : []
                } // Safe fallback to an empty array
                renderItem={(item) => {
                  if (!item) return null;
                  const { countryCode, name } = item;
                  const isActive = data?.addresses['-1']?.countryCode === countryCode;
                  return getDropdownElement1(
                    countryCode,
                    'addresses',
                    'countryCode',
                    name,
                    isActive,
                  );
                }}
                setToggleModal={() => { }}
                disabled={memberEditable}
              />
              <Input
                placeholder={myProfileAemData?.addressLabels?.city}
                className="body-small-light p-6"
                value={data?.addresses?.[addressIndex]?.city}
                onChange={(e) => handleFieldChange(
                  'addresses',
                  'city',
                  e.target.value,
                  addressIndex,
                )}
                customErrorMsg=""
                disabled={memberEditable}
              />

              <div className="body-extra-small-regular text-tertiary mb-6">
                {myProfileAemData?.stateGstDescription ? `* ${myProfileAemData?.stateGstDescription}` : ''}
              </div>
            </>
          )}

          {/* passport secton */}
          {
            !isAgent && (
            <>
              <div className="dashed-line" />
              <div className="d-flex justify-content-between">
                <div className="text-secondary mb-8 sub-header">
                  {myProfileAemData?.passportDetailsLabel}
                </div>
                <div>
                  <i
                    onClick={setShowPassportDetails}
                    className={
                      showPassportDetails
                        ? 'icon-accordion-up-simple'
                        : 'icon-accordion-down-simple'
                    }
                  />
                </div>
              </div>

              {showPassportDetails && (
              <>
                <Input
                  placeholder={myProfileAemData?.passportNumber}
                  className="body-small-light p-6"
                  onChange={(e) => e.target.value.match(regexConstant.ALPHA_NUMERIC)
                      && handleFieldChange(
                        'travelDocuments',
                        'number',
                        e.target.value,
                        0,
                      )}
                  value={data?.travelDocuments?.[0]?.number}
                  customErrorMsg={error && error?.number?.[0]}
                  disabled={memberEditable}
                />
                <Input
                  placeholder={myProfileAemData?.expiry}
                  className="body-small-light p-6"
                  onChange={(e) => handleDateChange(e, 'travelDocuments', 'expirationDate', 0)}
                  value={inputValue?.expirationDate}
                  customErrorMsg={error && error?.expirationDate?.[0]}
                  type="text"
                  disabled={memberEditable}
                />
                {!is6Euser && (
                <Input
                  placeholder={myProfileAemData?.issueDateLabel}
                  className="body-small-light p-6"
                  onChange={(e) => handleDateChange(e, 'travelDocuments', 'issuedDate', 0)}
                  value={inputValue?.issuedDate}
                  customErrorMsg={error && error?.issuedDate?.[0]}
                  type="text"
                  max={new Date().toISOString().split('T')[0]}
                  disabled={memberEditable}
                />
                )}
                <Input
                  placeholder={myProfileAemData?.name}
                  className="body-small-light p-6"
                  onChange={(e) => handleFieldChange(
                    'travelDocuments',
                    'name',
                    e.target.value,
                    0,
                  )}
                  value={data?.travelDocuments?.[0]?.name}
                  customErrorMsg={error && error?.name?.[0]}
                  disabled={memberEditable}
                />
              </>
              )}
            </>
            )
          }
        </>
      )}
    </div>
  );
};

export default BasicDetails;

BasicDetails.propTypes = {
  data: PropTypes.shape({
    gender: PropTypes.string.isRequired,
    setGender: PropTypes.func.isRequired,
    name: PropTypes.shape({
      First: PropTypes.string,
      Last: PropTypes.string,
    }),
    details: PropTypes.shape({
      gender: PropTypes.string,
      dateOfBirth: PropTypes.string,
      street1: PropTypes.string,
      street2: PropTypes.string,
      zipCode: PropTypes.string,
    }),
    travelDocuments: PropTypes.array,
    addresses: PropTypes.array,
    setName: PropTypes.func.isRequired,
    surname: PropTypes.string.isRequired,
    setSurname: PropTypes.func.isRequired,
    dob: PropTypes.string.isRequired,
    setDOB: PropTypes.func.isRequired,
    state: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    nationality: PropTypes.string.isRequired,
    setNationality: PropTypes.func.isRequired,
    passportNumber: PropTypes.string.isRequired,
    setPassportNumber: PropTypes.func.isRequired,
    passportExpiry: PropTypes.string.isRequired,
    setPassportExpiry: PropTypes.func.isRequired,
    passportName: PropTypes.string.isRequired,
    setPassportName: PropTypes.func.isRequired,
  }),
  onChange: PropTypes.func,
  validateField: PropTypes.func,
  isMember: PropTypes.bool,
  isAgent: PropTypes.bool,
  enableEditing: PropTypes.bool,
  userType: PropTypes.string,
};
