/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const DropDown = (props) => {
  const {
    options,
    value,
    onChange,
    name,
    customerrorMsg,
    defaultValue,
    placeholder,
    disabled,
  } = props;
  const [hoveredOption, setHoveredOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState(
    value
      ? options.find((option) => option.value === value)
      : options[defaultValue],
  );
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (value) {
      setSelectedOption(options.find((option) => option.value === value));
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOptionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value, options]);
  const handleMouseOver = (option) => {
    setHoveredOption(option.value);
  };

  const handleMouseOut = () => {
    setHoveredOption(null);
  };

  const handleSelect = (option) => {
    if (!disabled) {
      setSelectedOption(option);
      onChange(option.value);
      setIsOptionsVisible(false);
    }
  };

  const toggleOptionsVisibility = () => {
    if (!disabled) {
      setIsOptionsVisible(!isOptionsVisible);
    }
  };

  return (
    <div ref={dropdownRef} className={`visa-dropdown-component ${disabled ? 'disabled' : ''}`}>
      {/* uncomment if label is required */}
      {/* <label htmlFor={name}>{label}</label> */}
      <div
        aria-hidden="true"
        className={`selected-option ${disabled ? 'disabled' : ''}`}
        onClick={toggleOptionsVisibility}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="icon-accordion-down-simple icon-size-md" />
      </div>
      {isOptionsVisible && (
        <div className="options">
          {options?.map((option) => (
            <div
              aria-hidden="true"
              name={name}
              key={option.value}
              className={`option ${
                hoveredOption === option.value ? 'hovered' : ''
              }`}
              onMouseOver={() => handleMouseOver(option)}
              onMouseOut={handleMouseOut}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {customerrorMsg && (
        <span className="invalid-feedback">{customerrorMsg}</span>
      )}
    </div>
  );
};
DropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  customerrorMsg: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};
export default DropDown;
