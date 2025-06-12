import React from 'react';
import PropTypes from 'prop-types';

const GenderRadios = (props) => {
  const { items, name, disabled, onChange, value } = props;
  return (
    <div className="radio-group">
      {items?.map((item) => (
        <div key={item?.value} className="radio-container">
          <input
            type="radio"
            value={item?.value}
            name={name}
            checked={value === item?.value}
            onChange={onChange}
            disabled={disabled}
            className="custom-radio-btn"
          />
          <label
            htmlFor={item?.value}
            className="custom-radio-label body-small-regular text-capitalize"
          >
            {item?.label}
          </label>
        </div>
      ))}
    </div>
  );
};
GenderRadios.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
export default GenderRadios;
