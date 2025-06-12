import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import useAppContext from '../../hooks/useAppContext';

function RangeSlider({ value, setValue, totalVal, pointsBalance }) {
  const {
    state: { main, additional, isChangeFlightFlow },
  } = useAppContext();

  const calculatePoints = useCallback((totalValue, val) => {
    if (!val || !totalValue) {
      return 0;
    }

    return Math.round((val / 100) * totalValue);
  }, []);

  const { pointsSelected, avlPoints } = useMemo(
    () => {
      const selectedPoints = calculatePoints(totalVal, value);

      return {
        pointsSelected: selectedPoints,
        avlPoints: pointsBalance ? (pointsBalance - selectedPoints) : pointsBalance,
      };
    },
    [totalVal, value, pointsBalance],
  );

  useEffect(() => {
    function getMaxAllowedPercentageVal(totalValue, maxAllowedValue) {
      const percentages = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
      const allowedPercentages = percentages.filter(
        (percentage) =>
          Math.round((totalValue * percentage) / 100) <= maxAllowedValue,
      );

      return !allowedPercentages.length ? 0 : Math.max(...allowedPercentages);
    }

    if (pointsBalance || pointsBalance === 0) {
      setValue(getMaxAllowedPercentageVal(totalVal, pointsBalance));
    }
  }, [totalVal]);

  const handleChange = useCallback(
    (e) => {
      const sliderVal = Number(e?.target?.value);
      const points = calculatePoints(totalVal, sliderVal);

      if (
        ((!pointsBalance && pointsBalance !== 0) || points <= pointsBalance) &&
        sliderVal >= 10
      ) {
        setValue(sliderVal);
      }
    },
    [totalVal, pointsBalance],
  );

  const className = 'loyalty-points--custom-slider';
  const id = 'loyalty-points-redemption';
  const disabled = isChangeFlightFlow;
  const bg = disabled ? '#9BA4B8' : '#000099';

  return (
    <div className={`${className}-wrapper`}>
      <div className={className}>
        <label htmlFor={id} className={`${className}--label`}>
          {main?.mileRedemptionLabel}({pointsSelected})
        </label>
        <div className={`${className}-container`}>
          <input
            type="range"
            id={id}
            className={`${className}--input`}
            min={0}
            max={100}
            step={10}
            value={value}
            onChange={handleChange}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-label="loyalty Points Redemption Slider"
            disabled={disabled}
          />
          <div
            className="slider-step"
            style={{
              background: `linear-gradient(to right, ${bg} ${value}%, #D7E1E9 ${value}%)`,
            }}
          >
            {[...Array(11)].map(() => (
              <span key={uniq()} className="slider-step-point" />
            ))}
          </div>
        </div>
        <div className={`${className}--value`}>{value}%</div>
      </div>

      {(avlPoints || avlPoints === 0) && (
        <div className="loyalty-points-balance">
          {additional?.availableMilesLabel} <span>{avlPoints}</span>
        </div>
      )}
      <div />
    </div>
  );
}

RangeSlider.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func.isRequired,
  totalVal: PropTypes.number,
  pointsBalance: PropTypes.number,
};

RangeSlider.defaultProps = {
  value: 10,
  totalVal: 100,
};

export default RangeSlider;
