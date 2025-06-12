import React from 'react';
import PropTypes from 'prop-types';
import './FormCheckBox.scss';

const FormCheckBox = ({
  id,
  register,
  registerKey,
  registerOptions,
  children,
  containerClass,
  variant,
}) => {
  const isDisabled = registerOptions?.disabled;
  const variantClass = variant ? `form-checkbox__${variant}` : '';
  return (
    <label
      htmlFor={id}
      className={`form-checkbox ${variantClass} ${containerClass} ${
        isDisabled ? 'form-checkbox--disabled' : ''
      }`}
    >
      <input
        className="d-flex justify-content-center align-items-center"
        id={id}
        type="checkbox"
        {...register(registerKey, {
          value: registerOptions?.value,
        })}
        defaultChecked={isDisabled}
      />
      {children || ''}
    </label>
  );
};

FormCheckBox.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string,
  register: PropTypes.func,
  registerKey: PropTypes.string,
  registerOptions: PropTypes.object,
  children: PropTypes.any,
  containerClass: PropTypes.string,
  inputProps: PropTypes.object,
  variant: PropTypes.string,
};

export default FormCheckBox;
