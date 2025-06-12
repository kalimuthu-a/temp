import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { emptyFn } from '../../functions/utils';
import { a11y } from '../../functions/globalConstants';

const FlightJourneyTabItem = ({
  origin,
  destination,
  active,
  onClick,
  index,
  ...props
}) => {
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef();

  const onClickHandler = () => {
    ref.current?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center',
    });
    onClick(index);
  };

  const onKeyUpHandler = (e) => {
    if (e.keyCode === a11y.keyCode.enter || e.keyCode === a11y.keyCode.space) {
      onClickHandler();
    }
  };

  return (
    <div
      className={`flight-journey-tab-container__outer${
        active ? ' active' : ''
      }`}
      onClick={onClickHandler}
      role="tab"
      tabIndex={0}
      {...props}
      ref={ref}
      onKeyUp={onKeyUpHandler}
      aria-selected={active}
    >
      <div className="flight-journey-tab-container__leg">
        <span>{origin}</span>
        <span>{destination}</span>
      </div>
    </div>
  );
};

FlightJourneyTabItem.propTypes = {
  active: PropTypes.any,
  destination: PropTypes.any,
  index: PropTypes.any,
  onClick: PropTypes.func,
  origin: PropTypes.any,
};

export default FlightJourneyTabItem;
