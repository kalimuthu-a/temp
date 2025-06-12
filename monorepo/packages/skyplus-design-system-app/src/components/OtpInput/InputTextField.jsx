import React from 'react';
import PropTypes from 'prop-types';

const InputTextField = ({
  type,
  label,
  value = '',
  error,
  variation = '',
  readOnly = false,
  onChangeHandler,
  customClass = '',
  disabled = false,
  maxLength = 500,
  inputClickHandler = () => {},
  onBlurHandler = () => {},
  inputProps = {},
  hideLabel,
  placeholder,
  onFocusHandler = () => {},
  srpContactForm = false,
  onFocusPlaceholdertext = '',
  onFocusPlaceholderClass = '',
  isClearIcon,
  onEnter = () => {},
}) => {
  const changeHandler = (e) => {
    onChangeHandler(e.target.value);
  };

  let _type = type || 'text';
  let inputClasses = 'input-text-field__input';
  let labelClasses = 'input-text-field__label';
  let readOnlyInput = readOnly || false;
  let disabledProp = disabled;
  const textFieldPlaceholder = srpContactForm ? placeholder : label;

  if (variation === 'INPUT_TEXT_FIELD_DISABLED') {
    inputClasses += ' input-text-field__input--disabled';
    disabledProp = true;
  } else if (variation === 'INPUT_TEXT_FIELD_FILLED') {
    inputClasses += ' input-text-field__input--filled';
  } else if (variation === 'INPUT_TEXT_FIELD_FOCUSED') {
    inputClasses += ' input-text-field__input--focused';
  } else if (variation === 'INPUT_TEXT_FIELD_ERROR') {
    inputClasses += ' input-text-field__input--error';
    labelClasses += ' input-text-field__label--error';
  } else if (variation === 'INPUT_TEXT_FIELD_WITH_ICON') {
    inputClasses += ' input-text-field__input--with-icon';
    readOnlyInput = true;
  } else if (variation === 'INPUT_PASSWORD_FIELD') {
    _type = 'password';
  } else if (variation === 'INPUT_TEXT_FIELD_WITH_CLEAR_GREYBG') {
    inputClasses += ' input-text-field__input--with-grey-noborder';
    customClass += ' input-text-field__input--hover-grey';
    if (value !== '') {
      customClass += ' input-text-field__input--hover-grey--filled';
    }
  }

  if (value !== '') {
    inputClasses += ' input-text-field__input--filled';
  }
  if (isClearIcon) {
    inputClasses += ' input-text-field__input--with-clearIcon';
    customClass += ' input-text-field__input--widthFit';
  }

  return (
    <div className={`custom-form-control input-text-field  ${customClass}`}>
      {!hideLabel && value && <label className={labelClasses}>{label}</label>}
      {variation === 'INPUT_TEXT_FIELD_WITH_ICON' && (
        <i className="input-text-field__calendar-icon skp-iconmoon-icon" />
      )}
      <input
        type={_type}
        value={value}
        placeholder={textFieldPlaceholder}
        readOnly={readOnlyInput}
        disabled={disabledProp}
        className={inputClasses}
        onChange={changeHandler}
        maxLength={maxLength}
        onClick={inputClickHandler}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEnter(); }}
        {...inputProps}
      />
      {isClearIcon && (
        <i
          onClick={() => onChangeHandler('')}
          className="input-text-field__close-icon skp-iconmoon-icon"
        />
      )}

      {error && <p className="input-text-field__error">{error}</p>}
      {onFocusPlaceholdertext ? (
        <span
          className={`${onFocusPlaceholderClass} input-text-field__onFocusPlaceholdertext`}
        >
          {onFocusPlaceholdertext}
        </span>
      ) : null}
    </div>
  );
};

InputTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variation: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  readOnlyInput: PropTypes.bool,
  onBlurHandler: PropTypes.func,
  inputProps: PropTypes.object,
  type: PropTypes.any,
  readOnly: PropTypes.any,
  onChangeHandler: PropTypes.any,
  customClass: PropTypes.any,
  disabled: PropTypes.any,
  maxLength: PropTypes.any,
  inputClickHandler: PropTypes.func,
  hideLabel: PropTypes.any,
  placeholder: PropTypes.any,
  onFocusHandler: PropTypes.any,
  srpContactForm: PropTypes.any,
  onFocusPlaceholdertext: PropTypes.any,
  onFocusPlaceholderClass: PropTypes.any,
  isClearIcon: PropTypes.bool,
  onEnter: PropTypes.func,
};

export default InputTextField;
