import React from 'react';
import PropTypes from 'prop-types';
import './FormText.scss';

export default function FormText({
  register,
  registerKey,
  registerOptions,
  containerClass,
  placeholder,
}) {
  return (
    <input
      className={`form-text w-100 body-medium-light
      p-6 ${containerClass}`}
      type="text"
      placeholder={placeholder}
      {...register(registerKey, registerOptions)}
    />
  );
}

FormText.propTypes = {
  register: PropTypes.func,
  registerKey: PropTypes.string,
  registerOptions: PropTypes.object,
  containerClass: PropTypes.string,
  placeholder: PropTypes.string,
};
