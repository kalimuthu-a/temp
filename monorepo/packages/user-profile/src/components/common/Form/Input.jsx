import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const Input = (props) => {
  const {
    type,
    name,
    disabled,
    maxLength,
    placeholder,
    onChangeHandler,
    className,
    onInputHandler,
    inputWrapperClass,
    customErrorMsg,
    value,
    editable = true,
    ...otherProps
  } = props;

  const classes = useMemo(() => {
    const inputClasses = [className];
    if (customErrorMsg) {
      inputClasses.push('border-error');
    }
    if (disabled) {
      inputClasses.push('bg-btn-disabled-background-light');
    }
    if (!disabled && !editable) {
      inputClasses.push('bg-secondary-light');
    }

    return inputClasses.join(' ');
  }, [className, customErrorMsg, disabled, editable]);

  return (
    <div
      className={`design-system-input-field position-relative mb-6 ${inputWrapperClass}`}
    >
      <input
        value={value}
        disabled={disabled || !editable}
        maxLength={maxLength}
        className={classes}
        placeholder={placeholder}
        onChange={onChangeHandler}
        onInput={onInputHandler}
        name={name}
        {...otherProps}
        autoComplete="off"
      />
      {customErrorMsg ? (
        <div className="error-msg">{customErrorMsg}</div>
      ) : null}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onInputHandler: PropTypes.func,
  value: PropTypes.any,
  maxLength: PropTypes.number,
  type: PropTypes.string,
  inputWrapperClass: PropTypes.string,
  disabled: PropTypes.bool,
  customErrorMsg: PropTypes.string,
  editable: PropTypes.bool,
};

export default Input;
