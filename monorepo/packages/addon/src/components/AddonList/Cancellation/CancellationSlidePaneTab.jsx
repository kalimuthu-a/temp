import React, { useState, useEffect } from 'react';
// Old Code:
// import DateOfBirth from 'skyplus-design-system-app/dist/des-system/DateOfBirth';
import PropTypes from 'prop-types';
import { paxCodes } from '../../../constants/index';
// import { calculateYearsFromDate } from '../../../functions/utils';

// Old Code:
// import { DAY_PLACEHOLDER, MONTH_PLACEHOLDER, YEAR_PLACEHOLDER, DateFormatError } from '../../../constants/index';
// import { generateNumbers } from '../../../functions/utils';

// const currentYear = new Date().getFullYear();

// 12 Years Atleast
// const dobYears = generateNumbers(currentYear - 70, currentYear - 12, true);
// After 70 Yeays Expiry
// const month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
// const childYears = generateNumbers(currentYear - 12, currentYear - 2);
/**
 * @type {React.FC<import("../../../../types/AddOnList").CancellationSlidePaneTabProps>}
 * @returns {React.FunctionComponentElement}
 */
const CancellationSlidePaneTab = ({
  AEMData,
  onChangeTabDataHandler,
  dob,
  type,
  segmentData,
  // errors,
}) => {
  // Old Code:
  // const [day] = useState(() => generateNumbers(1, 31));

  /* TD:
  const dateProps = {
    day,
    locale: window?.locale || 'en',
    format: AEMData.monthFormat || 'short',
    disableDayOption: AEMData?.datePlaceholder ?? DAY_PLACEHOLDER,
    disableMonthOption: AEMData?.monthPlaceholder ?? MONTH_PLACEHOLDER,
    disableYearOption: AEMData?.yearPlaceholder ?? YEAR_PLACEHOLDER,
    month,
  }; */
  /* Old Code:
  const years = useMemo(() => {
    if (paxCodes.seniorCitizen.discountCode === type) {
      return [dob.yy];
    }

    if (paxCodes.children.code === type) {
      return childYears;
    }
    return dobYears;
  }, [type, dob]); */

  // New code
  // const [isError, setIsError] = useState(false);
  // const [isAdultError, setIsAdultError] = useState(false);
  // const [isChildError, setIsChildError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    if (!isValid || !inputValue) {
      return false;
    }
    // setIsError(false);
    // setIsAdultError(false);
    // setIsChildError(false);
    const dobObj = {
      dd: inputValue.split('-')[0],
      mm: inputValue.split('-')[1],
      yy: inputValue.split('-')[2],
    };
    onChangeTabDataHandler('dob', dobObj, type);
    // const paxAge = calculateYearsFromDate(dobObj.yy, dobObj.mm, dobObj.dd, segmentData.journeydetail.arrival);
    // if (paxAge > 70) {
    //   setIsError(true);
    // } else if (paxCodes.adult.code === type && !(paxAge >= 12)) {
    //   setIsAdultError(true);
    // } else if (paxCodes.children.code === type && !(paxAge >= 3 && paxAge < 12)) {
    //   setIsChildError(true);
    // } else {
    //   onChangeTabDataHandler('dob', dobObj, type);
    // }
  };

  const handleDateChange = (e) => {
    const input = e.target;
    const { value } = input;

    let formattedValue = value.replace(/\D/g, '');

    // Add "-" after the second character for day and month
    if (formattedValue.length > 2 && formattedValue.charAt(2) !== '-') {
      formattedValue = `${formattedValue.slice(0, 2)}-${formattedValue.slice(2)}`;
    }

    // Add "-" after the fifth character for year
    if (formattedValue.length > 5 && formattedValue.charAt(5) !== '-') {
      formattedValue = `${formattedValue.slice(0, 5)}-${formattedValue.slice(5)}`;
    }
    setInputValue(formattedValue);

    // Validate the date format (dd-mm-yyyy)g
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    setIsValid(regex.test(formattedValue));
  };

  useEffect(() => {
    if (dob?.dd && dob?.mm && dob?.yy) {
      const dobDate = dob.dd.length < 2 ? `0${dob.dd}` : `${dob.dd}`;
      const dobMonth = dob.mm.length < 2 ? `0${dob.mm}` : `${dob.mm}`;
      const dobYear = dob.yy;
      const inputDate = `${dobDate}-${dobMonth}-${dobYear}`;
      // Validate the date format (dd-mm-yyyy)
      const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      if (regex.test(inputDate)) setInputValue(inputDate);
    }
  }, []);

  useEffect(() => {
    // if (isValid || inputValue !== '') handleBlur();
    // Validate the date format (dd-mm-yyyy)
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    (isValid || regex.test(inputValue)) ? handleBlur() : onChangeTabDataHandler('dob', inputValue, type);
  }, [isValid, inputValue]);

  return (
    <div className="skyplus-cancellation__content">
      {/* TD: updated based on product requirment */}
      {/* <h5 className="skyplus-cancellation__content-datelabel">
        {`${AEMData?.dateOfBirthLabel}*`}
      </h5> */}

      <input
        type="text"
        id="dateInput"
        name="dateInput"
        className={`skyplus-cancellation__date-field 
          ${!isValid ? 'skyplus-cancellation__date-field--input-error' : ''}`}
        value={inputValue}
        placeholder={AEMData?.dateOfBirthLabel}
        onChange={handleDateChange}
        onBlur={handleBlur}
        maxLength={10}
        readOnly={paxCodes.seniorCitizen.discountCode === type}
      />
      {!isValid && (
      <p className="skyplus-cancellation__date-field--error body-extra-small-regular">
        {AEMData?.dateFormatErrorValidation || 'Invalid date format. Please use dd-mm-yyyy.'}
      </p>
      )}
      {/* TD: <DateOfBirth
        {...dateProps}
        value={dob}
        onChangeHandler={(value) => {
          onChangeTabDataHandler('dob', value, type);
        }}
        day={type === paxCodes.seniorCitizen.discountCode ? [dob.dd] : day}
        month={type === paxCodes.seniorCitizen.discountCode ? [dob.mm] : month}
        year={years}
      /> */}
      {/* {isError && (
        <p className="skyplus-cancellation__date-field--error body-extra-small-regular">
          {AEMData?.dateErrorLabel || 'Age should not be more than 70 years'}
        </p>
      )}
      {isAdultError && (
        <p className="skyplus-cancellation__date-field--error body-extra-small-regular">
          {AEMData?.adultErrorValidation || 'Age should be greater than or equal to 12 years.'}
        </p>
      )}
      {isChildError && (
        <p className="skyplus-cancellation__date-field--error body-extra-small-regular">
          {AEMData?.childErrorValidation || 'Age should be between 3 to 12 years.'}
        </p>
      )} */}
    </div>
  );
};

CancellationSlidePaneTab.propTypes = {
  AEMData: PropTypes.any,
  onChangeTabDataHandler: PropTypes.func,
  dob: PropTypes.any,
  passportExpiry: PropTypes.any,
  passportNumber: PropTypes.string,
  visaNumber: PropTypes.string,
  visaExpiry: PropTypes.any,
  isInternational: PropTypes.bool,
  type: PropTypes.oneOf(['ADT', 'SRCT']),
  errors: PropTypes.any,
  configData: PropTypes.any,
  segmentData: PropTypes.any,
};

export default CancellationSlidePaneTab;
