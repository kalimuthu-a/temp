import React from 'react';
import PropTypes from 'prop-types';
import './FlightDetailsBanner.scss';

const FlightDetailsBanner = (props) => {
  const {
    journeys = [],
  } = props;
  return journeys.length ? (
    <div className="flight-details-banner">
      {journeys?.map((journey) => (
        <div key={journey.destination}>
          <span>{journey.source}</span>
          <span>.............</span>
          <span>{journey.destination}</span>
        </div>
      ))}
    </div>
  ) : null;
};

FlightDetailsBanner.propTypes = {
  journeys: PropTypes.shape([]),
};

export default FlightDetailsBanner;
