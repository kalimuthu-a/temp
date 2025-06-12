import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

import './DragHandleInputRange.scss';

const DragHandleInputRange = ({ value, onChange, onKeyDown, isNext = false, isFlightHavingNext = false }) => {
  const [arialLabel, setArialLabel] = useState('');
  const [scrollValue, setScrollValue] = useState(value);
  const [isMobile] = useIsMobile();

  useEffect(() => {
    if (isNext && isFlightHavingNext) {
      const initialScrollValue = isMobile ? 12 : 0;
      const e = {
        target: { value: initialScrollValue },
      };
      setScrollValue(initialScrollValue);
      onChange(e);
    } else {
      setScrollValue(value);
    }
  }, [isNext, isFlightHavingNext, isMobile]);

  useEffect(() => {
    let ariaLabel = 'You are viewing';

    if (value < 35) {
      ariaLabel += 'front portion of aircraft';
    } else if (value < 60) {
      ariaLabel += 'middle portion of aircraft';
    } else {
      ariaLabel += 'rear portion of aircraft';
    }
    ariaLabel += `which ${value}% of aircraft from the start.`;
    setArialLabel(ariaLabel);
    setScrollValue(value);
  }, [value]);

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      // Allow the default tab behavior
      return;
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  return (
    <input
      type="range"
      className={`drag-handle-range ${isNext && isFlightHavingNext ? 'disabled' : ''}`}
      value={scrollValue}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      aria-live="polite"
      aria-atomic="true"
      aria-label="Seat Navigation Slider"
      aria-relevant="all"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={arialLabel}
      disabled={isNext && isFlightHavingNext}
    />
  );
};

DragHandleInputRange.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  isNext: PropTypes.bool,
  isFlightHavingNext: PropTypes.bool,
};

export default DragHandleInputRange;
