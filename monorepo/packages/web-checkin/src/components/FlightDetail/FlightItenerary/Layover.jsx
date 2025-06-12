import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { flightDurationFormatter } from '../../../utils/functions';

const Layover = ({ prev, segment }) => {
  const layover = flightDurationFormatter(
    prev.segmentDetails.arrival,
    segment.segmentDetails.departure,
  );

  return (
    <div className="d-flex justify-content-between itenarary-single__layover mx-10 my-6">
      <Text
        variation="body-medium-regular"
        mobileVariation="body-small-medium"
        containerClass="duration"
      >
        {layover} layover Bhopal
      </Text>

      <Text
        variation="body-medium-regular"
        mobileVariation="body-small-medium"
        containerClass="aircraft_change"
      >
        Change of aircraft
      </Text>
    </div>
  );
};

Layover.propTypes = {
  prev: PropTypes.shape({
    segmentDetails: PropTypes.shape({
      arrival: PropTypes.any,
    }),
  }),
  segment: PropTypes.shape({
    segmentDetails: PropTypes.shape({
      departure: PropTypes.any,
    }),
  }),
};

export default Layover;
