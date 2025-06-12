import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField';

function DateField({
  Datevalue = '',
  required,
  customError,
  onChangeHandler,
  inputWrapperClass,
  placeholder,
  showError = true,
  showDateIcon = true,
  minAge = 12,
  maxAge = 120,
  showInfoOnError = false,
  showInfoAlways = false,
  customInfoMessage = '* Enter date of birth in (DD-MM-YYYY) format',
  editable = true,
  disabled = false,
  customErrorObj = {},
  dateViewSeparator = '/',
  outputDateSeparator = '-',

}) {
  const [value, setValue] = useState(Datevalue);
  const [error, setError] = useState('');

  const isValidDate = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year
      && date.getMonth() === month - 1
      && date.getDate() === day
    );
  };

  const calculateAge = (day, month, year) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0
      || (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleValidation = (inputValue) => {
    const [day, month, year] = inputValue.split(dateViewSeparator).map(Number);

    if (inputValue.length === 10 && isValidDate(day, month, year)) {
      const age = calculateAge(day, month, year);
      if (age >= minAge && age <= maxAge) {
        const formattedDate = `${String(year).padStart(4, '0')}${outputDateSeparator}${String(
          month,
        ).padStart(2, '0')}${outputDateSeparator}${String(day).padStart(2, '0')}`;
        onChangeHandler(formattedDate);
        setError('');
      } else if (age < 0) {
        setError(customErrorObj?.presentDate || 'Date cannot be greater than present date');
      } else if (age > 0 && age < minAge) {
        setError(customErrorObj?.minAge || `Minimum age is ${minAge} years`);
      } else if (age > maxAge) {
        setError(customErrorObj?.maxAge || `Maximum age allowed is ${maxAge} years`);
      }
    } else {
      setError(customErrorObj?.invalidDate || 'Invalid date');
    }
  };

  const handleChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '');

    if (inputValue.length > 2 && inputValue.length <= 4) {
      inputValue = `${inputValue.slice(0, 2)}${dateViewSeparator}${inputValue.slice(2)}`;
    } else if (inputValue.length > 4) {
      inputValue = `${inputValue.slice(0, 2)}${dateViewSeparator}${inputValue.slice(
        2,
        4,
      )}${dateViewSeparator}${inputValue.slice(4, 8)}`;
    }

    setValue(inputValue);
    onChangeHandler(null);
    setError(''); // Clear error while typing
  };

  const handleBlur = (e) => {
    // firing event to check validation  for parent component
    handleChange(e);
    if (value.length === 10) {
      handleValidation(value);
    } else {
      setError(customErrorObj?.invalidDate || 'Incomplete date');
    }
  };

  return (
    <div>
      <InputField
        type="text"
        fieldName="dob"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={10}
        errors={
          showError && { dob: { message: error && (customError || error) } }
        }
        required={required}
        showDateIcon={showDateIcon}
        inputWrapperClass={inputWrapperClass}
        editable={editable}
        disabled={disabled}
      />
      {((showInfoOnError && error) || showInfoAlways) && (
        <div className="date-info-msg info-msg body-small-light text-tertiary mb-6">
          {customInfoMessage}
        </div>
      )}
    </div>
  );
}

DateField.propTypes = {
  Datevalue: PropTypes.string,
  required: PropTypes.bool,
  customError: PropTypes.any,
  onChangeHandler: PropTypes.func,
  inputWrapperClass: PropTypes.string,
  placeholder: PropTypes.string,
  showError: PropTypes.string,
  showDateIcon: PropTypes.bool,
  minAge: PropTypes.number,
  maxAge: PropTypes.number,
  showInfoOnError: PropTypes.bool,
  showInfoAlways: PropTypes.bool,
  customInfoMessage: PropTypes.string,
  editable: PropTypes.bool,
  disabled: PropTypes.bool,
  customErrorObj: PropTypes.object,

};

export default DateField;
