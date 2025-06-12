import React, { useState, useContext } from 'react';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import PropTypes from 'prop-types';
// import { passengerActions } from './PassengerReducer';
import { PassengerContext } from './PassengerContext';
import { items } from '../../../constants/common';
import regexConstant from '../../../constants/regex';
import { dateInputFormat } from '../../../utils/utilFunctions';

const BasicDetails = ({ data, onChange, validateField }) => {
  const { state } = useContext(PassengerContext);
  // Date of birth
  let dob = '';
  if (data.dobYear && data.dobMonth && data.dobDay) {
    dob = `${data.dobDay}-${data.dobMonth}-${data.dobYear}`;
  }

  const [inputValue, setInputValue] = useState({
    dateOfBirth: dob,
  });
  const { savedPassengerAemData, error } = state;

  const editPassengerDetails = savedPassengerAemData?.editPassengerDetailsOptions;

  // dispatch function get from useContext(PassengerContext)
  // const setShowStateAndNationality = () => {
  //   dispatch({
  //     type: passengerActions.SHOW_STATE_AND_NATIONALITY,
  //     payload: !showStateAndNationality,
  //   });
  // };

  // const setShowPassportDetails = () => {
  //   dispatch({
  //     type: passengerActions.SHOW_PASSPORT_DETAILS,
  //     payload: !showPassportDetails,
  //   });
  // };

  // const toggleIsOpened = () => {
  //   dispatch({
  //     type: passengerActions.SET_IS_OPENED,
  //     payload: !state.isOpened,
  //   });
  // };

  const handleFieldChange = (field, val) => {
    let value = '';
    if (field === 'firstname' || field === 'lastname') {
      const alphanumericVal = val.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 32);
      value = alphanumericVal.charAt(0).toUpperCase() + alphanumericVal.slice(1);
    } else {
      value = val;
    }
    onChange(field, null, value);
    validateField(field, value);
  };

  const handleDateChange = (e, field) => {
    const input = e.target;
    const { value } = input;
    const formattedValue = dateInputFormat(value);

    if (formattedValue.length > 10) return;

    handleFieldChange(field, formattedValue);

    setInputValue({
      ...inputValue,
      [field]: formattedValue,
    });

    // for API
    const [day = '', month = '', year = ''] = formattedValue.split('-');
    const dateParts = {
      dobYear: year,
      dobMonth: month,
      dobDay: day,
    };
    onChange('dateOfBirth', null, dateParts);
  };

  // const getDropdownElement = (placeholder, field) => (
  //   <div
  //     className="design-system-input-field position-relative mb-6 profile-input-container select"
  //     onClick={toggleIsOpened}
  //   >
  //     <input
  //       className="my-profile-input"
  //       placeholder={placeholder}
  //       readOnly
  //       value={data[field] || ''}
  //     />
  //     <i className="icon icon-accordion-down-simple arrow-down-icon" />
  //   </div>
  // );

  // const getDropdownElement1 = (value = '1', field, label = null) => (
  //   state.isOpened && (
  //     <div
  //       className="feedback-dropdown__item"
  //       key={value}
  //       onClick={() => { onChange(field, null, value); toggleIsOpened(); }}
  //     >
  //       {label || value}
  //     </div>
  //   )
  // );

  return (
    <div className="shadow rounded mt-12 p-6 p-md-8 bg-white">
      <div className="mb-6 text-primary">
        {editPassengerDetails?.basicDetails}
      </div>

      <RadioBoxGroup
        items={items}
        onChange={(val) => onChange('gender', null, val)}
        selectedValue={(data?.gender)}
        containerClassName="revamp-user-profile-profile-form-gender-checkboxes"
      />

      <div className="body-small-regular text-secondary my-8">
        {editPassengerDetails?.govtIdDescription}
      </div>

      <Input
        placeholder={editPassengerDetails?.firstNameLabel}
        className="body-small-light p-6"
        onChange={(e) => e.target.value.match(regexConstant.NAME_ONLY_ALPHABET_SPACE_NEW)
          && handleFieldChange('firstname', e.target.value)}
        value={data?.firstname || ''}
        customErrorMsg={error?.firstname}
      />
      <Input
        placeholder={editPassengerDetails?.lastNameLabel}
        className="body-small-light p-6"
        onChange={(e) => handleFieldChange('lastname', e.target.value)}
        value={data?.lastname || ''}
        customErrorMsg={error?.lastname}
      />
      <Input
        placeholder={editPassengerDetails?.dateOfBirthLabel}
        className="body-small-light p-6"
        onChange={(e) => { handleDateChange(e, 'dateOfBirth'); }}
        value={inputValue?.dateOfBirth}
        customErrorMsg={error?.dateOfBirth}
        type="text"
      />

      {/*
      PLEASE DO NOT REMOVE THIS CODE, CURRENTLY API DOES NOT INCLUDE THESE
      FIELDS SO THEY ARE COMMENTED OUT
      */}
      {/* userType we get from props ,
      [countryList,showStateAndNationality,showPassportDetails]
      we can get from state */}
      {/* {[USER_TYPES.USER, USER_TYPES.SME_USER]?.includes(userType) && (
        <>
          <div className="dashed-line" />
          <div className='d-flex justify-content-between sub-header'>
            <div className="body-medium text-secondary mb-8">
              {AEM_STATIC_DATA?.STATE_AND_NATIONALITY}
            </div>
            <div>
              <i
              onClick={setShowStateAndNationality}
              className={showStateAndNationality ? 'icon-accordion-up-simple' : 'icon-accordion-down-simple'}
               />
            </div>
          </div>
          {showStateAndNationality && (
            <>
              <DropDown
                renderElement={() =>
                  getDropdownElement(AEM_STATIC_DATA?.NATIONALITY, 'nationality')
                }
                containerClass="travelling-reason-dropdown body-small-light max-height"
                items={Array.isArray(countryList) && countryList.length > 0 ? countryList : []}
                renderItem={(item) => {
                  if (!item) return null;
                  const { countryCode, name } = item;
                  return getDropdownElement1(countryCode, 'nationality', name);
                }}
                setToggleModal={() => { }}
              />

              <div className="body-extra-small-regular text-tertiary mb-6">
                <i className='icon-star' />
                {editPassengerDetails?.govtIdDescription}
              </div>
            </>
          )}
        </>
      )}

      {[USER_TYPES.USER, USER_TYPES.SME_USER]?.includes(userType) && (
        <>
          <div className="dashed-line" />
          <div className='d-flex justify-content-between'>
            <div className="text-secondary mb-8 sub-header">
              {AEM_STATIC_DATA?.PASSPORT_DETAILS}
            </div>
            <div>
              <i
              onClick={setShowPassportDetails}
              className={showPassportDetails ? 'icon-accordion-up-simple' : 'icon-accordion-down-simple'}
              />
            </div>
          </div>
          {showPassportDetails && (
            <>
              <Input
                placeholder={AEM_STATIC_DATA?.PASSPORT_NUMBER}
                className="body-small-light p-6"
                onChange={(e) => handleFieldChange('passportNumber', e.target.value)}
                value={data?.passportNumber || ''}
                customErrorMsg={error?.passportNumber}
              />
              <Input
                placeholder={AEM_STATIC_DATA?.EXPIRY_DATE}
                className="body-small-light p-6"
                onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
                value={data?.expiryDate || ''}
                customErrorMsg={error?.expiryDate}
              />
              <Input
                placeholder={AEM_STATIC_DATA?.NAME}
                className="body-small-light p-6"
                onChange={(e) => handleFieldChange('passportName', e.target.value)}
                value={data?.passportName || ''}
                customErrorMsg={error?.passportName}
              />
            </>
          )}
        </>
      )} */}
    </div>
  );
};

BasicDetails.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  validateField: PropTypes.func.isRequired,
};

export default BasicDetails;
