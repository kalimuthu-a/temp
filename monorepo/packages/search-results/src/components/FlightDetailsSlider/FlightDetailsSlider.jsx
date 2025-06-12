import PropTypes from 'prop-types';
import React from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import FlightDetails from './FlightDetails/FlightDetails';
import FareDetails from './FareDetails/FareDetails';

const FlightDetailsSlider = ({
  onClose,
  flightData,
  selectedJounery,
  isInternational,
}) => {
  const { fare } = selectedJounery;
  return (
    <OffCanvas onClose={onClose} containerClassName="flight-details-slider">
      <FlightDetails
        flightData={flightData}
        selectedJounery={selectedJounery}
        isInternational={isInternational}
      />
      <FareDetails fare={fare} isInternational={isInternational} flightData={flightData} />
    </OffCanvas>
  );
};

FlightDetailsSlider.propTypes = {
  onClose: PropTypes.any,
  selectedJounery: PropTypes.any,
  flightData: PropTypes.object,
  isInternational: PropTypes.bool,
};

export default FlightDetailsSlider;
