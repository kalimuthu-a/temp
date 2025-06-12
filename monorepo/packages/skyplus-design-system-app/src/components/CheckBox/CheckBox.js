import React from 'react';

const CheckBox = ({
  containerClass = '',
  id = 'styled-checkbox-1',
  children,
  onChangeHandler,
  checked,
  disabled,
}) => {
  return (
    <div className={`skyplus-checkbox-container ${containerClass}`}>
      <input
        className="styled-checkbox"
        id={id}
        checked={checked}
        type="checkbox"
        value="value1"
        onChange={onChangeHandler}
        disabled={disabled}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default CheckBox;
