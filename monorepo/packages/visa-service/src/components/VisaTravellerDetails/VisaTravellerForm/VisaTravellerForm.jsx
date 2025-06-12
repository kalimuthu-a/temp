import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { addDays, addYears } from 'date-fns';
import InputField from './PaxInput/PaxInput';
import DropDown from '../../commonComponents/DropDown/DropDown';
import { paxFieldData, paxPassportData } from '../PaxFieldData/PaxFieldData';
import GenderRadios from './GenderRadio/GenderRadio';
import { CONSTANTS, PAGES, TOAST_VARIATION } from '../../../constants';
import validateField, { isFormValid } from '../../../functions/ValidateField';
import DateRangePicker from '../../commonComponents/Calender/DateRangePicker';
import { getOccupationList } from '../../../services';
import { AppContext } from '../../../context/AppContext';
import VisaToast from '../../commonComponents/Toast/Toast';

const VisaTravellerForm = ({
  setIsButtonDisabled,
  index,
  formData,
  setFormData,
  isAgree,
  pageType,
// eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [showDobCalendar, setShowDobCalendar] = useState(false);
  const [showPassportDateCalendar, setShowPassportDateCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState('');
  const [allOccupation, setAllOccupation] = useState([]);
  const [isDob, setIsDob] = useState(false);
  const [alert, setAlert] = useState('');
  const datepickerRef = useRef(null);
  const {
    state: {
      visaTravelerDetailByPath,
      visaPageSectionType,
    },
  } = React.useContext(AppContext);
  const { personalDetailsFormPlaceholders, setPrimaryTravellerCheckboxInfo } = visaTravelerDetailByPath || {};
  const checkDuplicatePassportNumber = (passportNumber) => {
    return formData.some((formItem, idx) => {
      if (idx === index) return false;
      return formItem.passportNumber === passportNumber;
    });
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onChangeForm = (fieldName, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [fieldName]: value,
      errors: { ...updatedFormData[index]?.errors, [fieldName]: '' },
    };

    const errorMessages = personalDetailsFormPlaceholders?.errorMessagesList;
    const DuplicatePasportMsg = errorMessages?.find(
      (msg) => msg.key === CONSTANTS.DUPLICATE_PASSPORT_NUMBER,
    );
    if (fieldName === CONSTANTS.PASSPORT_NUMBER && checkDuplicatePassportNumber(value)) {
      updatedFormData[index].errors.passportNumber = DuplicatePasportMsg?.value;
      setFormData(updatedFormData);
      setIsButtonDisabled(true);
      return;
    }

    if (fieldName === CONSTANTS.IS_PRIMARY) {
      if (formData[index]?.dateOfBirth) {
        const dob = new Date(formData[index]?.dateOfBirth || null);
        const age = new Date().getFullYear() - dob.getFullYear();
        const month = new Date().getMonth() - dob.getMonth();
        const isOver18 = age > 18 || (age === 18 && month >= 0);
        if (!isOver18) {
          const primageAgeError = errorMessages?.find(
            (msg) => msg.key === CONSTANTS.INVALID_AGE,
          );
          updatedFormData[index].errors.dateOfBirth = primageAgeError?.value;
          updatedFormData[index][CONSTANTS.IS_PRIMARY] = false;
          setFormData(updatedFormData);
          setIsButtonDisabled(true);
        } else {
          const validationErrors = validateField(
            updatedFormData[index],
            errorMessages,
          );
          updatedFormData[index].errors = validationErrors;
          // remove all the dateofbirth error when primary is checked
          updatedFormData.forEach((item, idx) => {
            if (idx !== index) {
              updatedFormData[idx].errors.dateOfBirth = '';
            }
          });
          setFormData(updatedFormData);
          const validForm = isFormValid(updatedFormData);
          setIsButtonDisabled(!(validForm && isAgree));
          const isPrimageError = errorMessages?.find(
            (msg) => msg.key === CONSTANTS.PRIMARY_USER,
          );
          if (value) { setAlert(isPrimageError?.value); }
        }
        return;
      }
      updatedFormData.forEach((item, idx) => {
        if (idx !== index) {
          updatedFormData[idx][CONSTANTS.IS_PRIMARY] = false;
        }
      });
      updatedFormData[index] = {
        ...updatedFormData[index],
        [fieldName]: value,
        errors: { ...updatedFormData[index]?.errors, [fieldName]: '' },
      };
    }

    const validationErrors = validateField(
      updatedFormData[index],
      errorMessages,
    );
    updatedFormData[index].errors = validationErrors;
    setFormData(updatedFormData);
    const validForm = isFormValid(updatedFormData);
    setIsButtonDisabled(!(validForm && isAgree));
  };

  const handleDateChange = (startDate) => {
    const formattedDate = `${startDate.toLocaleDateString()}`;
    const updatedFormData = [...formData];
    const errorMessages = personalDetailsFormPlaceholders?.errorMessagesList;
    if (formData[index]?.primary && isDob) {
      const dob = new Date(formattedDate || null);
      const age = new Date().getFullYear() - dob.getFullYear();
      const month = new Date().getMonth() - dob.getMonth();
      const isOver18 = age > 18 || (age === 18 && month >= 0);
      if (!isOver18 && updatedFormData[index]) {
        const primageAgeError = errorMessages?.find(
          (msg) => msg.key === CONSTANTS.INVALID_AGE,
        );
        updatedFormData[index].errors.dateOfBirth = primageAgeError?.value;
        updatedFormData[index][CONSTANTS.IS_PRIMARY] = false;
        updatedFormData[index].dateOfBirth = formattedDate;
        setFormData(updatedFormData);
        setIsButtonDisabled(true);
        setShowDobCalendar(false);
        return;
      }
    }
    updatedFormData[index] = {
      ...updatedFormData[index],
      [calendarTarget]: formattedDate,
      errors: { ...updatedFormData[index]?.errors, [calendarTarget]: '' },
    };
    const validationErrors = validateField(
      updatedFormData[index],
      errorMessages,
    );
    if (
      calendarTarget === CONSTANTS.DOB
      || calendarTarget === CONSTANTS.PASSPORT_EXPIRY
    ) {
      updatedFormData[index].errors = validationErrors;
      setFormData(updatedFormData);
    } else {
      setFormData(updatedFormData);
    }
    const validForm = isFormValid(updatedFormData);
    setIsButtonDisabled(!(validForm && isAgree));
    setShowDobCalendar(false);
    setShowPassportDateCalendar(false);
  };

  const handleCalendarIconClick = (e, field) => {
    if (field === CONSTANTS.DOB) {
      setIsDob(true);
      if (showDobCalendar) return;
      setShowDobCalendar(true);
      setShowPassportDateCalendar(false);
    } else if (field === CONSTANTS.PASSPORT_EXPIRY) {
      setIsDob(false);
      if (showPassportDateCalendar) return;
      setShowPassportDateCalendar(true);
      setShowDobCalendar(false);
    }
    setCalendarTarget(field);
  };

  const handleFocus = (e, field) => {
    handleCalendarIconClick(e, field);
  };

  const ALL_TITLES = Object.keys(personalDetailsFormPlaceholders?.genderList).map((key) => ({
    label: personalDetailsFormPlaceholders?.genderList[key],
    value: key.toUpperCase(),
  }));

  const disableCalender = pageType === CONSTANTS.PAGE_TYPE_PROP
    || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
    ? 'disable-visa-calender'
    : '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datepickerRef.current
        && !datepickerRef.current.contains(event.target)
      ) {
        setShowDobCalendar(false);
        setShowPassportDateCalendar(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Tab' && !datepickerRef.current.contains(document.activeElement)) {
        setShowDobCalendar(false);
        setShowPassportDateCalendar(false);
      }
    };

    if (showDobCalendar || showPassportDateCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // Return an empty cleanup function when neither calendar is shown
    return () => { };
  }, [showDobCalendar, showPassportDateCalendar]);

  useEffect(() => {
    const getOccupation = async () => {
      const response = await getOccupationList();
      const occupationListDetails = response?.data?.map((occupation) => ({
        value: occupation.occupation,
        label: occupation.occupation,
      }));
      setAllOccupation(occupationListDetails);
    };
    getOccupation();
  }, []);

  let ChkPrimaryclassName;
  if (formData[index].primary) {
    ChkPrimaryclassName = 'visa-chk-wrapper visa-chk-primary-enabled';
  } else if (
    visaPageSectionType === PAGES.VISA_TRAVELLER_DETAILS
      ? formData?.some((item) => item.primary)
      : Object.keys(formData)?.some((item) => item.primary)
  ) {
    ChkPrimaryclassName = 'visa-chk-wrapper visa-chk-primary-disabled';
  } else {
    ChkPrimaryclassName = 'visa-chk-wrapper';
  }
  return (
    <div className="visa_traveller_details">
      {showDobCalendar || showPassportDateCalendar ? (
        <div
          className="visa-calendar-overlay"
          role="button"
          tabIndex="0"
          onClick={() => {
            setShowDobCalendar(false);
            setShowPassportDateCalendar(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              setShowDobCalendar(false);
              setShowPassportDateCalendar(false);
            }
          }}
          aria-label="Close calendar overlay"
        />
      ) : null}
      {alert && (
      <VisaToast
        alert={alert}
        setAlert={setAlert}
        variation={TOAST_VARIATION.SUCCESS}
        timer={3000}
      />
      )}
      <div className="visa-personel-details">
        <span className="personel-details">
          {personalDetailsFormPlaceholders?.personalDetailsLabel}
        </span>
        {visaPageSectionType === PAGES.VISA_TRAVELLER_DETAILS ? (
          <GenderRadios
            items={ALL_TITLES}
            name={`${CONSTANTS.TITLE}-${index}`}
            value={formData?.[index]?.title}
            disabled={
              pageType === CONSTANTS.PAGE_TYPE_PROP
            }
            onChange={(e) => onChangeForm(CONSTANTS.TITLE, e.target.value)}
          />
        ) : null}
        <div className="visa-field-container">
          {paxFieldData?.length
            ? paxFieldData?.map((pax) => (
              <InputField
                key={pax?.fieldName}
                fieldname={pax?.fieldName}
                placeholder={pax?.placeholder}
                name={pax?.fieldName}
                customErrorMsg={formData[index]?.errors?.[pax?.fieldName]}
                onChange={(e) => onChangeForm(pax?.fieldName, e.target.value)}
                value={formData[index][pax?.fieldName]}
                type={pax?.type}
                // disabled={
                //   pageType === CONSTANTS.PAGE_TYPE_PROP
                //   || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
                // }
                disabled
                maxLength={32}
              />
            ))
            : null}
          <div className={`input-with-icon ${disableCalender}`}>
            <InputField
              fieldname={CONSTANTS.DOB}
              placeholder={
                personalDetailsFormPlaceholders?.dataOfBirthPlaceholder
              }
              name={CONSTANTS.DOB}
              customErrorMsg={formData?.[index]?.errors?.dateOfBirth}
              value={formData?.[index]?.dateOfBirth}
              type="text"
              disabled={
                pageType === CONSTANTS.PAGE_TYPE_PROP
                || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
              }
              onClick={(e) => handleCalendarIconClick(e, CONSTANTS.DOB)}
              onFocus={(e) => handleFocus(e, CONSTANTS.DOB)}
              autoComplete="off"
            />
            <div
              className="visa-calendar-icon-container"
              role="button"
              tabIndex="0"
              onClick={(e) => handleCalendarIconClick(e, CONSTANTS.DOB)}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  handleCalendarIconClick(e, CONSTANTS.DOB);
                }
              }}
              aria-label="Close calendar"
            >
              <span className="icon-calender" />
            </div>
            {showDobCalendar && (
              <div className="visa-dob-calendar-container">
                <div
                  className="visa-calendar-close-icon"
                  onClick={() => setShowDobCalendar(false)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      setShowDobCalendar(false);
                    }
                  }}
                  aria-label="Close calendar"
                >
                  <span className="icon-close-simple" />
                </div>
                <div ref={datepickerRef}>
                  {showDobCalendar && (
                    <DateRangePicker
                      startDate={
                        formData?.[index]?.dateOfBirth === ''
                          ? new Date()
                          : new Date(formData?.[index]?.dateOfBirth)
                      }
                      endDate={
                        formData?.[index]?.dateOfBirth === ''
                          ? new Date()
                          : new Date(formData?.[index]?.dateOfBirth)
                      }
                      onDateChange={handleDateChange}
                      minDate={new Date('1900-01-01')}
                      maxDate={new Date()}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="visa_traveller_Visa_type">
            <DropDown
              options={allOccupation}
              value={formData?.[index]?.occupation}
              onChange={(value) => onChangeForm(CONSTANTS.OCCUPATION, value)}
              label={CONSTANTS.OCCUPATION}
              name={CONSTANTS.OCCUPATION}
              defaultValue={formData?.[index]?.occupation}
              customerrorMsg={formData?.[index]?.errors?.occupation}
              placeholder={
                personalDetailsFormPlaceholders?.occupationPlaceholder
              }
              disabled={
                pageType === CONSTANTS.PAGE_TYPE_PROP
                || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
              }
            />
          </div>
        </div>
        <div className="visa-field-container phone-component">
          <PhoneComponent
            phonePlaceholder={
              personalDetailsFormPlaceholders?.mobileNumberPlaceholder
            }
            getValues={() => {}}
            register={() => {}}
            className={`alt-num ${
              pageType === CONSTANTS.PAGE_TYPE_PROP
              || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
                ? 'custom-bottom-review'
                : 'custom-bottom'
            }`}
            onChangeCountryCode={(value) => onChangeForm(CONSTANTS.COUNTRYCODE, value)}
            onChangePhoneNumber={(value) => onChangeForm(CONSTANTS.CELL, value)}
            errors={{
              otherPhone: { message: formData?.[index]?.errors?.cell },
            }}
            name="otherPhone"
            required
            showFlag="true"
            value={formData?.[index]?.cell}
            disabled={
              pageType === CONSTANTS.PAGE_TYPE_PROP
              || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
            }
          />
          <InputField
            fieldname={CONSTANTS.EMAIL}
            placeholder={personalDetailsFormPlaceholders?.emailIdPlaceholder}
            name={CONSTANTS.EMAIL}
            customErrorMsg={formData?.[index]?.errors?.emailId}
            onChange={(e) => onChangeForm(CONSTANTS.EMAIL, e.target.value)}
            value={formData?.[index].emailId}
            type="text"
            disabled={
              pageType === CONSTANTS.PAGE_TYPE_PROP
              || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
            }
          />

          <div className="passport-heading">
            {' '}
            {personalDetailsFormPlaceholders?.passportDetailsLabel}
          </div>

          {paxPassportData.length ? (
            <>
              {paxPassportData.map((pax) => (
                <InputField
                  key={pax?.fieldName}
                  fieldname={pax?.fieldName}
                  placeholder={pax?.placeholder}
                  name={pax?.fieldName}
                  customErrorMsg={formData?.[index]?.errors?.[pax?.fieldName]}
                  onChange={(e) => onChangeForm(pax?.fieldName, e.target.value)}
                  value={formData?.[index]?.[pax?.fieldName]}
                  type={pax?.type}
                  disabled={
                    pageType === CONSTANTS.PAGE_TYPE_PROP
                    || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
                      ? true
                      : pax?.disabled
                  }
                  maxLength={8}
                />
              ))}
            </>
          ) : null}
          <div className={`input-with-icon ${disableCalender}`}>
            <InputField
              fieldname={CONSTANTS.PASSPORT_EXPIRY}
              placeholder={
                personalDetailsFormPlaceholders?.passportExpiryPlaceholder
              }
              name={CONSTANTS.PASSPORT_EXPIRY}
              customErrorMsg={formData?.[index]?.errors?.passportExpiry}
              value={formData?.[index]?.passportExpiry}
              type="text"
              disabled={
                pageType === CONSTANTS.PAGE_TYPE_PROP
                || pageType === CONSTANTS.PAGE_TYPE_CONFIRM
              }
              onClick={(e) => handleCalendarIconClick(e, CONSTANTS.PASSPORT_EXPIRY)}
              onFocus={(e) => handleFocus(e, CONSTANTS.PASSPORT_EXPIRY)}
              autoComplete="off"
            />
            <div
              className="visa-calendar-icon-container"
              onClick={(e) => handleCalendarIconClick(e, CONSTANTS.PASSPORT_EXPIRY)}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  handleCalendarIconClick(e, CONSTANTS.PASSPORT_EXPIRY);
                }
              }}
              aria-label="Close calendar"
            >
              <span className="icon-calender" />
            </div>
            {showPassportDateCalendar && (
              <div className="visa-pass-calendar-container">
                <div
                  className="visa-calendar-close-icon"
                  role="button"
                  tabIndex="0"
                  onClick={() => setShowPassportDateCalendar(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      setShowPassportDateCalendar(false);
                    }
                  }}
                  aria-label="Close calendar"
                >
                  <span className="icon-close-simple" />
                </div>
                <div ref={datepickerRef}>
                  {showPassportDateCalendar && (
                    <DateRangePicker
                      startDate={
                        formData?.[index]?.passportExpiry === ''
                          ? new Date()
                          : new Date(formData?.[index]?.passportExpiry)
                      }
                      endDate={
                        formData?.[index]?.passportExpiry === ''
                          ? new Date()
                          : new Date(formData?.[index]?.passportExpiry)
                      }
                      onDateChange={handleDateChange}
                      minDate={addDays(new Date(), -1)}
                      maxDate={addYears(new Date(), 10)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {visaPageSectionType === PAGES.VISA_TRAVELLER_DETAILS ? (
          <div className={ChkPrimaryclassName}>
            <Checkbox
              fieldname={CONSTANTS.IS_PRIMARY}
              checked={formData?.[index].primary}
              onChangeHandler={(e) => onChangeForm(CONSTANTS.IS_PRIMARY, e.target.checked)}
              key={uniq()}
              id={index}
              className="checkbox-wrapper"
            />
            <span className="visa-chk-content">
              {setPrimaryTravellerCheckboxInfo}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
VisaTravellerForm.propTypes = {
  setIsButtonDisabled: PropTypes.func,
  index: PropTypes.number,
  formData: PropTypes.any,
  setFormData: PropTypes.func,
  isAgree: PropTypes.bool,
  pageType: PropTypes.string,
};
export default VisaTravellerForm;
