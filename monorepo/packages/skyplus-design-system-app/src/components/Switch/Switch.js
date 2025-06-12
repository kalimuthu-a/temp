/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import React from 'react';

const Switch = ({ checked, onChange, size = 'sm' }) => {
  return (
    <label className={`skyplus-switch ${size}`} htmlFor="skyplus-switch">
      <input type="checkbox" checked={checked} />
      <span className="slider round" onClick={onChange} role="presentation" />
    </label>
  );
};

Switch.propTypes = {
  checked: PropTypes.any,
  onChange: PropTypes.func,
  size: PropTypes.string,
};

export default Switch;
