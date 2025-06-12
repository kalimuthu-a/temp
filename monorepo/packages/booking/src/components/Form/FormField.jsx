import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import useAppContext from '../../hooks/useAppContext';

const { XPLORE } = Pages;

const FormField = ({
  containerClass,
  topLabel,
  middleLabel,
  hintLabel,
  inputProps = {},
  airportName,
  filled = false,
  accessiblityProps = {},

}) => {
  /**
   * @type {import('react').MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef();

  const [isMobile] = useIsMobileBooking();

  const {
    state: { additional, pageType },
  } = useAppContext();

  const listener = (e) => {
    const { parentElement } = ref.current;
    const targetElement = e.target;
    if (
      parentElement.contains(e.target) ||
      parentElement.isSameNode(targetElement)
    ) {
      parentElement.querySelector('input')?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('click', listener);
    };
  }, []);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.click();
    }
  };

  return (
    <div
      className={`${containerClass} booking-widget-field`}
      ref={ref}
      tabIndex={0}
      role="textbox"
      onKeyDown={handleKeyDown}
      {...accessiblityProps}
    >
      <span className="label_top">{pageType === XPLORE ? topLabel.split(' ')[0] : topLabel}</span>
      {!isMobile && (
        <input
          placeholder={additional.startTypingLabel}
          {...inputProps}
          tabIndex={-1}
          maxLength={20}
        />
      )}
      <div className="value-wrapper">
        <span className={`label_middle ${filled ? 'filled' : ''}`}>
          {middleLabel}
        </span>
      </div>
      <span className="label_hint form-hint-value">
        {airportName || hintLabel}
      </span>
      <span className="label_hint show-on-hover">{hintLabel}</span>
    </div>
  );
};

FormField.propTypes = {
  containerClass: PropTypes.string,
  hintLabel: PropTypes.any,
  middleLabel: PropTypes.string,
  topLabel: PropTypes.string,
  inputProps: PropTypes.any,
  airportName: PropTypes.string,
  filled: PropTypes.bool,
  role: PropTypes.string,
  accessiblityProps: PropTypes.object,
};

export default FormField;
