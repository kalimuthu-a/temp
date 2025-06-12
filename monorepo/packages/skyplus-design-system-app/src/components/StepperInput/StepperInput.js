import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon/Icon';

const StepperInput = ({ value = 0, maxValue = 10, minValue = 0, onChange }) => {
  const onClickAdd = () => {
    if (maxValue > value) {
      onChange(value + 1);
    }
  };

  const onClickMinus = () => {
    if (minValue < value) {
      onChange(value - 1);
    }
  };

  return (
    <div className={`stepper-input ${value > 0 ? 'highlight' : ''}`}>
      <Icon
        className={`stepper-input--left icon-minus ${
          minValue === value ? 'disabled' : ''
        }`}
        onClick={onClickMinus}
      />
      <div className="stepper-input--counter">{value}</div>
      <Icon
        className={`stepper-input--right icon-add-circle ${
          maxValue === value ? 'disabled' : ''
        }`}
        onClick={onClickAdd}
      />
    </div>
  );
};

StepperInput.propTypes = {
  maxValue: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default StepperInput;
