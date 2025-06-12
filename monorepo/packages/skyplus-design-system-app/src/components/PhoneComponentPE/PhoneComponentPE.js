import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField';
import regexConstant from '../../common/Constants/regex';

import {
  PHONE_INTERNATIONAL_LENGTH_LIMIT,
  PHONE_LENGTH_LIMIT, PREFFERED_COUNTRY_CODE, PRIMARY_CONTACT_ELEMENT_NAME,
} from '../../common/Constants/constants';
import CountryDropDown from '../CountryDropDown/CountryDropDown';

const PhoneComponentPE = (props) => {
  const {
    name,
    errors,
    register = () => {},
    getValues = () => { },
    className,
    isAltContact,
    countryCodeName,
    phonePlaceholder,
    onChangeCountryCode,
    onChangePhoneNumber,
    invalidPhoneMsg = '',
    invalidAltPhoneMsg = '',
    required,
    value,
    isDisabled,
    selectedCode,
    setContactValues,
    sanitize = false,
    initialCountryCode,
  } = props;
  // const [phone, setPhone] = useState('');
  const primaryContact = getValues(PRIMARY_CONTACT_ELEMENT_NAME);
  const [customErrorMsg, setCustomErrorMsg] = useState('');
  const [isInternational, setIsInternational] = useState(false);

  const maxLength = isInternational ? PHONE_INTERNATIONAL_LENGTH_LIMIT : PHONE_LENGTH_LIMIT;

  const onChangeHandler = (val) => {
    const input = val?.slice(0, maxLength);
    setCustomErrorMsg(invalidPhoneMsg);
    if (input.match(regexConstant.ONLYDIGIT)) {
      if ((isInternational && input?.match(regexConstant.PHONE_INTERNATIONAL))
      || (!isInternational && input?.match(regexConstant.PHONE))) {
        setCustomErrorMsg('');
      }
      if (isAltContact
        && input.length === maxLength
        && input === primaryContact) {
        setCustomErrorMsg(invalidAltPhoneMsg);
      }
      if (typeof onChangePhoneNumber === 'function')onChangePhoneNumber(input, isInternational);
      setContactValues(name, input);
    }
  };

  // useEffect(() => {
  //   if (value && isDisabled) {
  //     setPhone(value);
  //   }
  // }, [value]);

  useEffect(() => {
    if (!isInternational && selectedCode) setIsInternational(selectedCode !== PREFFERED_COUNTRY_CODE);
  }, [selectedCode]);

  const sanitizeNumericInput = (event) => {
    const input = event.target;
    const { value } = input;
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    if (value !== sanitizedValue) {
      input.value = sanitizedValue;
    }
    return input;
  };

  return (
    <div className={`design-system-phone-component ${className}`}>
      <div className="d-flex gap-4">
        <CountryDropDown
          useRegisterInput
          isDisabled={isDisabled}
          setIsInternational={setIsInternational}
          inputRegisterProps={{ countryCodeName, ...props }}
          onChangeCountryCode={onChangeCountryCode}
          defaultValue={initialCountryCode}
        />
        {sanitize
          ? (
            <InputField
              type="text"
              name={name}
              value={value}
              errors={errors}
              disabled={isDisabled}
              register={register}
              setValue={setContactValues}
              customErrorMsg={customErrorMsg}
              placeholder={phonePlaceholder}
              inputWrapperClass={`${className} w-100`}
              onInputHandler={sanitizeNumericInput}
              onChangeHandler={(e) => onChangeHandler(e?.target?.value)}
              required={required}
            />
          )
          : (
            <InputField
              type="text"
              name={name}
              value={value}
              errors={errors}
              disabled={isDisabled}
              register={register}
              setValue={setContactValues}
              customErrorMsg={customErrorMsg}
              placeholder={phonePlaceholder}
              inputWrapperClass={`${className} w-100`}
              onInputHandler={(e) => onChangeHandler(e?.target?.value)}
              required={required}
            />
          )}
      </div>
    </div>
  );
};

PhoneComponentPE.propTypes = {
  register: PropTypes.any,
  className: PropTypes.string,
  phonePlaceholder: PropTypes.string,
  setContactValues: PropTypes.func,
  getValues: PropTypes.func,
  name: PropTypes.string.isRequired,
  errors: PropTypes.shape({}),
  isAltContact: PropTypes.bool,
  countryCodeName: PropTypes.string,
  invalidPhoneMsg: PropTypes.string,
  invalidAltPhoneMsg: PropTypes.string,
  onChangeCountryCode: PropTypes.func,
  onChangePhoneNumber: PropTypes.func,
  required: PropTypes.any,
  value: PropTypes.any,
  isDisabled: PropTypes.bool,
  selectedCode: PropTypes.string,
  sanitize: PropTypes.bool,
  initialCountryCode: PropTypes.string,
};

export default PhoneComponentPE;
