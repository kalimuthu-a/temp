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
  inputProps = {},
  variant,
}) => {
  const variantClass = variant ? `form-checkbox-${variant}` : '';

  return (
    <label htmlFor={id} className={`form-checkbox ${variantClass} ${containerClass}`}>
      <input
        className="d-flex justify-content-center align-items-center"
        id={id}
        type="checkbox"
        {...register(registerKey, registerOptions)}
        {...inputProps}
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
