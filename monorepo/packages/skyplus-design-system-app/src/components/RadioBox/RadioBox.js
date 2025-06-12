import PropTypes from 'prop-types';
import React from 'react';
import { a11y } from '../../functions/globalConstants';

const RadioBox = ({
  id,
  name,
  onChange,
  checked = false,
  children,
  value,
  ariaLabel,
  className = '',
  disabled = false,
  register = () => {},
  required = 'This field is required',
  ...radioProps
}) => {
  const onChangeHandler = () => {
    onChange(value);
  };

  const onKeyDown = (e) => {
    if (e.key === a11y.key.enter) {
      onChange(value);
    }
  };

  return (
    <label
      htmlFor={id}
      className={`radio-label ${className} ${checked ? 'checked' : ''}`}
    >
      <input
        className="radio-input"
        type="radio"
        id={id}
        value={value}
        name={name}
        onChange={onChangeHandler}
        checked={checked}
        disabled={disabled}
        {...register(name, { onChange, required })}
        {...radioProps}
      />
      <span
        className={`custom-radio ${disabled ? 'input-radio-disabled' : ''}`}
        role="radio"
        aria-checked={checked}
        aria-label={ariaLabel || value}
        tabIndex={0}
        onKeyDown={onKeyDown}
      />
      {children}
    </label>
  );
};

RadioBox.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.any,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.string,
  name: PropTypes.string,
  errors: PropTypes.shape([]),
  register: PropTypes.func,
};
export default RadioBox;
