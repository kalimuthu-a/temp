import React from 'react';
import PropTypes from 'prop-types';

const SectorDetails = ({ flightDestinationCode, flightOriginCode,
  fromDestination, flightType, toDestination, flightTime, flightTerminal }) => {
  let arrivalTerminal = '';
  let departureTerminal = '';

  flightTerminal?.forEach((item) => {
    if (item?.arrivalTerminal) {
      arrivalTerminal = `(T${item?.arrivalTerminal})`;
    }
    if (item?.departureTerminal) {
      departureTerminal = `(T${item?.departureTerminal})`;
    }
  });

  const flightDetailTime = flightTime();
  return (
    <div className="flight-details__content-segment">
      <div className="flight-details__left-content">
        <div className="flight-departure-code">{flightOriginCode}</div>
        <div className="flight-fullName">{`${fromDestination} ${departureTerminal}`}</div>
      </div>
      <div className="flight-details__middle-content">
        <div className="flight-duration">{flightDetailTime}</div>
        <div className="flight-stops">{flightType}</div>
      </div>
      <div className="flight-details__right-content">
        <div className="flight-departure-code">{flightDestinationCode}</div>
        <div className="flight-fullName">{`${toDestination} ${arrivalTerminal}`}</div>
      </div>
    </div>
  );
};

SectorDetails.propTypes = {
  flightDestinationCode: PropTypes.string,
  flightOriginCode: PropTypes.string,
  fromDestination: PropTypes.string,
  flightType: PropTypes.string,
  toDestination: PropTypes.string,
  flightTime: PropTypes.func,
  flightTerminal: PropTypes.array,
};

export default SectorDetails;
