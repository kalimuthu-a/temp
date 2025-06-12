import React from 'react';
import PropTypes from 'prop-types';
import './FormRadio.scss';

const FormRadio = ({
  id,
  register,
  registerKey,
  registerOptions,
  children,
  containerClass,
  value,
}) => {
  return (
    <label
      htmlFor={id}
      className={`form-radio body-small-regular text-secondary d-inline-flex py-5 align-items-center ${containerClass}`}
    >
      <input
        className="rounded-circle"
        id={id}
        type="radio"
        value={value}
        {...register(registerKey, registerOptions)}
      />
      {children}
    </label>
  );
};

FormRadio.propTypes = {
  id: PropTypes.string,
  register: PropTypes.func,
  registerKey: PropTypes.string,
  registerOptions: PropTypes.object,
  children: PropTypes.any,
  containerClass: PropTypes.string,
  value: PropTypes.string,
};

export default FormRadio;
