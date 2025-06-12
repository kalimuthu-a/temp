/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const InputField = (props) => {
  const {
    type,
    name,
    fieldName,
    disabled,
    minLength,
    maxLength,
    placeholder,
    onChangeHandler,
    className,
    onInputHandler,
    inputWrapperClass,
    customErrorMsg,
    value,
    errors,
    infoMsg,
    register = () => {},
    showCrossIcon = false,
    showDateIcon = false,
    showEyeIcon = false,
    setValue = () => { },
    editable = true,
    iconType = '',
    required = 'This field is required',
    extraValidation = {},
    ...otherProps
  } = props;
  const [useFormErrorMsg, setErrors] = useState('');
  const [_type, setType] = useState(type);

  const togglePasswordVisibility = () => ((_type === type) ? setType('text') : setType(type));

  const classes = () => {
    const inputClasses = [className];
    if (useFormErrorMsg || customErrorMsg) {
      inputClasses.push('border-error');
    }
    if (disabled) {
      inputClasses.push('bg-btn-disabled-background-light');
    }
    if (!disabled && !editable) {
      inputClasses.push('bg-secondary-light');
    }
    if (required) {
      inputClasses.push('required');
    }
    return inputClasses.join(' ');
  };
  const fieldKey = fieldName || name;
  useEffect(() => {
    let formError = '';
    formError = errors?.[fieldKey]?.message;
    setErrors(formError);
  }, [errors?.[fieldKey] || value]);

  // useEffect(() => {
  //   setValue(name, value);
  // }, [value]);

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setValue(name, '');
    }
  };

  const isRequired = value ? '' : required;
  return (
    <div className={`design-system-input-field position-relative mb-6 ${inputWrapperClass}`}>
      <input
        type={_type}
        name={name}
        value={value}
        disabled={disabled || !editable}
        min={minLength}
        max={maxLength}
        maxLength={maxLength}
        className={classes()}
        placeholder={placeholder}
        onChange={onChangeHandler}
        onInput={onInputHandler}
        aria-label={useFormErrorMsg || ''}
        {...register(name, {
          value,
          required: isRequired,
          validate: {
            ...extraValidation,
          },
        })}
        {...otherProps}
      />
      {showCrossIcon
        ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="cross"
            onKeyDown={onKeyDown}
            onClick={() => setValue(name, '')}
            className="icon-close-circle position-absolute input-field-cross-btn"
          />
        )
        : null}

      {showDateIcon && (<span className="icon-calender position-absolute input-field-calendar" />)}

      {showEyeIcon
        ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="show password"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') togglePasswordVisibility(); }}
            onClick={togglePasswordVisibility}
            className="position-absolute input-field-eye-btn"
          >
            {_type === 'text'
              ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.1668 8.00008L14.6444 8.14828C14.6743 8.05175 14.6743 7.94841 14.6444 7.85188L14.1668 8.00008ZM1.8335 8.00008L1.35596 7.85188C1.32601 7.94841 1.32601 8.05175 1.35596 8.14828L1.8335 8.00008ZM14.1668 8.00008C13.6893 7.85188 13.6894 7.85169 13.6894 7.85153C13.6894 7.85149 13.6895 7.85134 13.6895 7.85128C13.6895 7.85115 13.6895 7.85109 13.6895 7.85111C13.6895 7.85114 13.6894 7.85146 13.6892 7.85206C13.6889 7.85326 13.6881 7.85559 13.687 7.85901C13.6848 7.86585 13.6811 7.87706 13.6758 7.89234C13.6654 7.92291 13.6488 7.96971 13.6258 8.03044C13.5797 8.15198 13.5078 8.3287 13.4072 8.54214C13.2055 8.97026 12.8912 9.53936 12.4417 10.1061C11.5454 11.2363 10.1348 12.3334 8.00016 12.3334V13.3334C10.5322 13.3334 12.205 12.0139 13.2252 10.7274C13.7341 10.0858 14.0865 9.44657 14.3118 8.96844C14.4248 8.72876 14.5066 8.52787 14.5608 8.38509C14.5879 8.31365 14.6081 8.25662 14.6219 8.21639C14.6288 8.19626 14.634 8.18033 14.6378 8.16888C14.6396 8.16316 14.6411 8.15856 14.6422 8.15511C14.6428 8.15339 14.6432 8.15195 14.6436 8.15081C14.6437 8.15024 14.6439 8.14975 14.644 8.14933C14.6441 8.14911 14.6442 8.14885 14.6442 8.14875C14.6443 8.14851 14.6444 8.14828 14.1668 8.00008ZM8.00016 12.3334C5.86553 12.3334 4.45495 11.2363 3.55858 10.1061C3.10913 9.53936 2.79483 8.97026 2.59308 8.54214C2.49249 8.3287 2.42066 8.15198 2.37456 8.03044C2.35153 7.96971 2.33497 7.92291 2.3245 7.89234C2.31927 7.87706 2.31556 7.86585 2.31333 7.85901C2.31222 7.85559 2.31147 7.85326 2.31109 7.85206C2.3109 7.85146 2.3108 7.85114 2.31079 7.85111C2.31078 7.85109 2.3108 7.85115 2.31084 7.85128C2.31086 7.85134 2.31091 7.85149 2.31092 7.85153C2.31097 7.85169 2.31103 7.85188 1.8335 8.00008C1.35596 8.14828 1.35603 8.14851 1.35611 8.14875C1.35614 8.14885 1.35622 8.14911 1.35629 8.14933C1.35642 8.14975 1.35658 8.15024 1.35676 8.15081C1.35711 8.15195 1.35757 8.15339 1.35811 8.15511C1.35921 8.15856 1.36069 8.16316 1.36255 8.16888C1.36628 8.18033 1.37157 8.19626 1.37846 8.21639C1.39224 8.25662 1.41247 8.31365 1.43957 8.38509C1.49372 8.52787 1.57554 8.72876 1.6885 8.96844C1.91382 9.44657 2.26619 10.0858 2.77508 10.7274C3.79537 12.0139 5.46813 13.3334 8.00016 13.3334V12.3334ZM1.8335 8.00008C2.31103 8.14828 2.31097 8.14847 2.31092 8.14864C2.31091 8.14867 2.31086 8.14882 2.31084 8.14888C2.3108 8.14901 2.31078 8.14907 2.31079 8.14905C2.3108 8.14902 2.3109 8.14871 2.31109 8.1481C2.31147 8.1469 2.31222 8.14458 2.31333 8.14115C2.31556 8.13431 2.31927 8.1231 2.3245 8.10782C2.33497 8.07726 2.35153 8.03045 2.37456 7.96973C2.42066 7.84819 2.49249 7.67147 2.59308 7.45802C2.79483 7.02991 3.10913 6.4608 3.55858 5.89411C4.45495 4.7639 5.86553 3.66675 8.00016 3.66675V2.66675C5.46813 2.66675 3.79537 3.98626 2.77508 5.27272C2.26619 5.91436 1.91382 6.55359 1.6885 7.03172C1.57554 7.2714 1.49372 7.47229 1.43957 7.61507C1.41247 7.68651 1.39224 7.74354 1.37846 7.78378C1.37157 7.8039 1.36628 7.81983 1.36255 7.83128C1.36069 7.837 1.35921 7.84161 1.35811 7.84505C1.35757 7.84678 1.35711 7.84821 1.35676 7.84935C1.35658 7.84992 1.35642 7.85041 1.35629 7.85084C1.35622 7.85105 1.35614 7.85131 1.35611 7.85142C1.35603 7.85166 1.35596 7.85188 1.8335 8.00008ZM8.00016 3.66675C10.1348 3.66675 11.5454 4.7639 12.4417 5.89411C12.8912 6.4608 13.2055 7.02991 13.4072 7.45802C13.5078 7.67147 13.5797 7.84819 13.6258 7.96973C13.6488 8.03045 13.6654 8.07726 13.6758 8.10782C13.6811 8.1231 13.6848 8.13431 13.687 8.14115C13.6881 8.14458 13.6889 8.1469 13.6892 8.1481C13.6894 8.14871 13.6895 8.14902 13.6895 8.14905C13.6895 8.14907 13.6895 8.14901 13.6895 8.14888C13.6895 8.14882 13.6894 8.14867 13.6894 8.14864C13.6894 8.14847 13.6893 8.14828 14.1668 8.00008C14.6444 7.85188 14.6443 7.85166 14.6442 7.85142C14.6442 7.85131 14.6441 7.85105 14.644 7.85084C14.6439 7.85041 14.6437 7.84992 14.6436 7.84935C14.6432 7.84821 14.6428 7.84678 14.6422 7.84505C14.6411 7.84161 14.6396 7.837 14.6378 7.83128C14.634 7.81983 14.6288 7.8039 14.6219 7.78378C14.6081 7.74354 14.5879 7.68651 14.5608 7.61507C14.5066 7.47229 14.4248 7.2714 14.3118 7.03172C14.0865 6.55359 13.7341 5.91436 13.2252 5.27272C12.205 3.98626 10.5322 2.66675 8.00016 2.66675V3.66675Z" fill="#000099" />
                  <path d="M7.99984 10.3334C9.2885 10.3334 10.3332 9.28875 10.3332 8.00008C10.3332 6.71142 9.2885 5.66675 7.99984 5.66675C6.71117 5.66675 5.6665 6.71142 5.6665 8.00008C5.6665 9.28875 6.71117 10.3334 7.99984 10.3334Z" stroke="#000099" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.4832 4.62333C14.467 4.23554 13.3102 4 12 4C8.20195 4 5.69282 5.97927 4.16238 7.90895C3.39904 8.87142 2.87049 9.83026 2.5325 10.5475C2.36307 10.907 2.24034 11.2083 2.1591 11.4225C2.11846 11.5296 2.08812 11.6152 2.06745 11.6755C2.05711 11.7057 2.04918 11.7296 2.04359 11.7468L2.03693 11.7675L2.03489 11.7739L2.03419 11.7761C2.03408 11.7765 2.0337 11.7777 2.75 12L2.0337 11.7777C1.98877 11.9225 1.98877 12.0775 2.0337 12.2223L2.75 12C2.0337 12.2223 2.03359 12.2219 2.0337 12.2223L2.03419 12.2239L2.03489 12.2261L2.03693 12.2325L2.04359 12.2532C2.04918 12.2704 2.05711 12.2943 2.06745 12.3245C2.08812 12.3848 2.11846 12.4704 2.1591 12.5775C2.24034 12.7917 2.36307 13.093 2.5325 13.4525C2.86086 14.1493 3.36909 15.0742 4.09772 16.0088L5.16759 14.9389C4.58334 14.1632 4.16589 13.3998 3.88937 12.8131C3.73849 12.4929 3.63075 12.2278 3.5616 12.0455L3.54448 12L3.5616 11.9545C3.63075 11.7722 3.73849 11.5071 3.88937 11.1869C4.19201 10.5447 4.66346 9.69108 5.33762 8.84105C6.68218 7.14573 8.79805 5.5 12 5.5C12.8382 5.5 13.6019 5.61277 14.2969 5.80967L15.4832 4.62333Z" fill="#000099" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.51837 16.4166C7.8287 17.5849 9.61241 18.5 12 18.5C15.202 18.5 17.3178 16.8543 18.6624 15.159C19.3365 14.3089 19.808 13.4553 20.1106 12.8131C20.2615 12.4929 20.3692 12.2278 20.4384 12.0455L20.4555 12L20.4384 11.9545C20.3692 11.7722 20.2615 11.5071 20.1106 11.1869C19.808 10.5447 19.3365 9.69108 18.6624 8.84105C18.0387 8.05462 17.249 7.27886 16.2619 6.6731L17.3474 5.5876C18.3681 6.26795 19.1904 7.09289 19.8376 7.90895C20.601 8.87142 21.1295 9.83026 21.4675 10.5475C21.6369 10.907 21.7597 11.2083 21.8409 11.4225C21.8815 11.5296 21.9119 11.6152 21.9326 11.6755C21.9429 11.7057 21.9508 11.7296 21.9564 11.7468L21.9631 11.7675L21.9651 11.7739L21.9658 11.7761C21.9659 11.7765 21.9663 11.7777 21.25 12C21.9663 12.2223 21.9662 12.2226 21.9661 12.223L21.9651 12.2261L21.9631 12.2325L21.9564 12.2532C21.9508 12.2704 21.9429 12.2943 21.9326 12.3245C21.9119 12.3848 21.8815 12.4704 21.8409 12.5775C21.7597 12.7917 21.6369 13.093 21.4675 13.4525C21.1295 14.1697 20.601 15.1286 19.8376 16.091C18.3072 18.0207 15.798 20 12 20C9.12541 20 6.98915 18.8662 5.45674 17.4782L6.51837 16.4166ZM21.25 12L21.9663 11.7777C22.0112 11.9225 22.011 12.0782 21.9661 12.223L21.25 12Z" fill="#000099" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.3429 7.76363C12.2298 7.7546 12.1154 7.75 12 7.75C9.65279 7.75 7.75 9.65279 7.75 12C7.75 12.1154 7.7546 12.2298 7.76363 12.3429L12.3429 7.76363ZM8.50957 14.4254C9.27733 15.5282 10.5544 16.25 12 16.25C14.3472 16.25 16.25 14.3472 16.25 12C16.25 10.5544 15.5282 9.27733 14.4254 8.50957L13.3381 9.59691C14.1804 10.0669 14.75 10.9669 14.75 12C14.75 13.5188 13.5188 14.75 12 14.75C10.9669 14.75 10.0669 14.1804 9.59691 13.3381L8.50957 14.4254Z" fill="#000099" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.5303 2.46967C21.8232 2.76256 21.8232 3.23744 21.5303 3.53033L3.53033 21.5303C3.23744 21.8232 2.76256 21.8232 2.46967 21.5303C2.17678 21.2374 2.17678 20.7626 2.46967 20.4697L20.4697 2.46967C20.7626 2.17678 21.2374 2.17678 21.5303 2.46967Z" fill="#000099" />
                </svg>

              )}
          </span>
        )
        : null}
      <span className="error-msg body-extra-small-regular" aria-label={useFormErrorMsg}>{useFormErrorMsg} </span>
      {!useFormErrorMsg && customErrorMsg ? <span className="error-msg body-extra-small-regular">{customErrorMsg}</span> : null}
      {infoMsg ? (
        <div className={`d-flex mt-2 info-msg me-2 ${disabled && 'text-disabled'}`}>
          <span className={`${iconType || 'icon-check icon-size-sm'} ${'body-extra-small-regular'}`} />
          <span className="body-extra-small-regular">{infoMsg}</span>
        </div>
      ) : null}
    </div>
  );
};

InputField.propTypes = {
  name: PropTypes.string,
  register: PropTypes.any,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onInputHandler: PropTypes.func,
  value: PropTypes.any,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  type: PropTypes.string,
  inputWrapperClass: PropTypes.string,
  disabled: PropTypes.bool,
  customErrorMsg: PropTypes.string,
  showCustomError: PropTypes.bool,
  showCrossIcon: PropTypes.bool,
  showDateIcon: PropTypes.bool,
  setValue: PropTypes.func,
  required: PropTypes.bool,
  infoMsg: PropTypes.string,
  showEyeIcon: PropTypes.bool,
  fieldName: PropTypes.string,
  editable: PropTypes.bool,
  iconType: PropTypes.string,
  extraValidation: PropTypes.object,
  errors: PropTypes.shape({ primaryContact: { message: '' }, userFields: [] }),
};

export default InputField;
