import React from 'react';
import PropTypes from 'prop-types';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import { MEMBER } from '../../../constants/index-env';

const VariationBasedComponent = ({
  onChange,
  onEnter = () => {},
  variation,
  errorObj,
  name,
  required,
  placeholder,
  value,
  countryCode,
}) => {
  if (variation === MEMBER) {
    return (
      <PhoneComponent
        phonePlaceholder={placeholder}
        className={
          Object.keys(errorObj).length == 0
            ? 'login-phone-dropdown'
            : 'login-phone-dropdown login-phone-dropdown-error'
        }
        onChangeCountryCode={(countryInitials, item) => {
          onChange(null, null, { countryInitials: item?.countryCode, countryCode: item?.phoneCode });
        }}
        onChangePhoneNumber={(value) => onChange('userId', value)}
        errors={errorObj}
        name={name}
        required={required}
        value={value}
        sanitize
        initialCountryCode={countryCode}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onEnter?.({});
          }
        }}
      />
    );
  }
  return (
    <InputField
      type="text"
      name="userId"
      register={() => {}}
      inputWrapperClass="forgot-pwd__inpt-field"
      placeholder="Enter User Id"
      onChangeHandler={(event) => onChange('userId', event.target.value)}
      errors={{}}
      value={value}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onEnter?.({});
        }
      }}
    />
  );
};

VariationBasedComponent.propTypes = {
  onChange: PropTypes.func,
  variation: PropTypes.any,
  errorObj: PropTypes.any,
  name: PropTypes.any,
  required: PropTypes.any,
  placeholder: PropTypes.any,
  value: PropTypes.any,
  countryCode: PropTypes.string,
  onEnter: PropTypes.func,
};

export default VariationBasedComponent;
