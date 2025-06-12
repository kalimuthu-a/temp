import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

const regexConstant = {
  DOB_LENGTH_WITH_HYPHENS: 10,
  ONLYDIGIT: /^\d+$/,
};

const dobFormat = (input, eventKey) => {
  let formattedInput = input;
  if (eventKey !== 'Backspace') {
    if (input.length >= 4 && input.length <= 6) {
      formattedInput = `${input.slice(0, 4)}-${input.slice(4)}`;
    } else if (input.length > 6) {
      formattedInput = `${input.slice(0, 4)}-${input.slice(4, 6)}-${input.slice(
        6,
      )}`;
    }
  }
  return formattedInput;
};

const Input = (props) => {
  const {
    type = 'text',
    name,
    fieldName,
    maxLength,
    placeholder,
    onChangeHandler,
    className,
    inputWrapperClass,
    customErrorMsg,
    value,
    errors,
    icon = '',
    suggestionField,
    ...otherProps
  } = props;
  const classes = () => {
    const inputClasses = [className];
    if (customErrorMsg) {
      inputClasses.push('border-error');
    }

    return inputClasses.join(' ');
  };

  const handleDOBChange = (event) => {
    let input = event.target.value.slice(
      0,
      regexConstant.DOB_LENGTH_WITH_HYPHENS,
    );
    if (input.length === regexConstant.DOB_LENGTH_WITH_HYPHENS) {
      onChangeHandler(input);
    } else {
      input = input.replaceAll('-', '');
      if (input.match(regexConstant.ONLYDIGIT)) {
        input = dobFormat(input, event.nativeEvent.data);
        onChangeHandler(input);
      }
    }
  };

  const handleChange = (event) => {
    if (type === 'date') {
      handleDOBChange(event);
    } else {
      onChangeHandler(event.target.value);
    }
  };

  return (
    <div
      className={`design-system-input-field position-relative ${inputWrapperClass}`}
    >
      <input
        value={value}
        maxLength={maxLength}
        className={classes()}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        type={type === 'date' ? 'text' : type}
        {...otherProps}
      />
      {icon ? (
        <Icon className={`position-absolute input-field-cross-btn ${icon}`} />
      ) : null}
      {customErrorMsg ? (
        <div className="error-msg">{customErrorMsg}</div>
      ) : null}
      {!customErrorMsg && suggestionField ? (
        <div className="suggestion-msg">{suggestionField}</div>
      ) : null}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.any,
  className: PropTypes.any,
  placeholder: PropTypes.any,
  onChangeHandler: PropTypes.any,
  value: PropTypes.any,
  maxLength: PropTypes.any,
  type: PropTypes.any,
  inputWrapperClass: PropTypes.any,
  customErrorMsg: PropTypes.any,
  fieldName: PropTypes.string,
  icon: PropTypes.any,
  errors: PropTypes.any,
};

export default Input;
