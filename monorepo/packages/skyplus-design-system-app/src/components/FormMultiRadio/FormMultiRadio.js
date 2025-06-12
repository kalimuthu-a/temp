import React from 'react';
import PropTypes from 'prop-types';
import './FormMultiRadio.scss';

const FormMultiRadio = ({
  id,
  register,
  registerKey,
  registerOptions,
  children,
  containerClass,
  value,
  defaultChecked,
}) => {
  return (
    <label htmlFor={id} className={`form-multi-radio ${containerClass}`}>
      <input
        className="d-flex justify-content-center align-items-center"
        id={id}
        type="checkbox"
        value={value}
        checked={defaultChecked}
        {...register(registerKey, registerOptions)}
      />
      {children || ''}
    </label>
  );
};

FormMultiRadio.propTypes = {
  id: PropTypes.string,
  register: PropTypes.func,
  registerKey: PropTypes.string,
  registerOptions: PropTypes.object,
  children: PropTypes.any,
  containerClass: PropTypes.string,
  value: PropTypes.string,
  defaultChecked: PropTypes.bool,
};

export default FormMultiRadio;
