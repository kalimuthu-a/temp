import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @type {React.FC<{
 *  value: number,
 *  minusClickHandler: () => void,
 *  plusClickHandler: () => void,
 *  totalPaxCount?: number,
 *  maxPaxCount?: number,
 *  maxInfantCount?: number,
 *  minPaxCount?: number
 * }>}
 * @returns {React.FunctionComponentElement}
 */
const StepperInput = ({
  value,
  minusClickHandler,
  plusClickHandler,
  totalPaxCount,
  maxPaxCount,
  maxInfantCount,
  minPaxCount = 1,
}) => {
  let minusDisabled = false;
  let plusDisabled = false;

  if (value < 1) {
    minusDisabled = true;
  }
  if (totalPaxCount && totalPaxCount >= maxPaxCount) {
    plusDisabled = true;
  }

  if (totalPaxCount < minPaxCount || totalPaxCount === 1 || minPaxCount < 1) {
    minusDisabled = true;
  }

  if (maxInfantCount && value >= maxInfantCount) {
    plusDisabled = true;
  }

  // if count sent 0 disable both action buttons
  if (maxPaxCount < 1 || maxInfantCount < 1) {
    minusDisabled = true;
    plusDisabled = true;
  }

  return (
    <div className="skyplus-excess-baggage__addition-baggage-count">
      <div className="skyplus-excess-baggage__addition-baggage-count">
        <button
          key="minus-btn"
          type="button"
          disabled={minusDisabled}
          onClick={minusClickHandler}
          aria-hidden="true"
        >
          <i className={`icon-minus 
          ${minusDisabled ?
            'skyplus-excess-baggage__addition-baggage-icon--disabled' :
            'skyplus-excess-baggage__addition-baggage-icon cursor'}`}
          />
        </button>
        <span className="body-medium-medium skyplus-excess-baggage__addition-baggage-piece">{value}</span>
        <button
          key="plus-btn"
          type="button"
          className="stepper-input__btn stepper-input__btn--plus"
          disabled={plusDisabled}
          onClick={plusClickHandler}
          aria-hidden="true"
        >
          <i className={`icon-add-circle
           ${plusDisabled ?
            'skyplus-excess-baggage__addition-baggage-icon--disabled' :
            'skyplus-excess-baggage__addition-baggage-icon cursor'}`}
          />
        </button>
      </div>
    </div>
  );
};

StepperInput.propTypes = {
  value: PropTypes.number.isRequired,
  minusClickHandler: PropTypes.func,
  plusClickHandler: PropTypes.func,
  totalPaxCount: PropTypes.number,
  maxPaxCount: PropTypes.number,
  maxInfantCount: PropTypes.number,
  minPaxCount: PropTypes.number,
};

export default StepperInput;
