import React, { memo } from 'react';
import PropTypes from 'prop-types';

const JourneyInfo = ({ journeyDetailFlightDate, passengerListArray, paxLabel }) => (
  <div className="journey-details">
    {!!journeyDetailFlightDate?.length && (
      <div className="journey-dates">
        <i className="icon-calender" />
        <span>{journeyDetailFlightDate?.join('-')}</span>
      </div>
    )}

    {!!passengerListArray?.length && (
      <div className="journey-pax-info">
        <i className="icon-Passenger" />
        <span>{`${passengerListArray?.length} ${paxLabel}`}</span>
      </div>
    )}
  </div>
);

JourneyInfo.propTypes = {
  journeyDetailFlightDate: PropTypes.array,
  passengerListArray: PropTypes.array,
  paxLabel: PropTypes.string,
};

export default memo(JourneyInfo);
