import React from 'react';
import PropTypes from 'prop-types';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';

const InputField = (props) => {
  const {
    fieldname,
    placeholder,
    name,
    customErrorMsg,
    onChange,
    value,
    type,
    disabled,
    onFocus,
    onClick,
    onBlur,
    autoComplete,
    maxLength,
  } = props;
  return (
    <Input
      fieldname={fieldname}
      placeholder={placeholder}
      name={name}
      customErrorMsg={customErrorMsg}
      onChange={onChange}
      inputWrapperClass="custom-bottom"
      value={value}
      type={type}
      disabled={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      autoComplete={autoComplete}
      maxLength={maxLength}
    />
  );
};

InputField.propTypes = {
  fieldname: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  customErrorMsg: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  autoComplete: PropTypes.string,
  maxLength: PropTypes.number,
};
export default InputField;
