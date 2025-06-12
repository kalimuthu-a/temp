import React from 'react';
import PropTypes from 'prop-types';

import useAppContext from '../../hooks/useAppContext';
import { formatPoints } from '../../utils';

function LoyaltyFarePoints({ startsAtPublishFare, spanClass, defaultVal }) {
  const {
    state: { isBurn, additional },
  } = useAppContext();

  if (!isBurn) {
    return defaultVal;
  }

  return (
    <>
      {startsAtPublishFare ? formatPoints(startsAtPublishFare) : startsAtPublishFare}{' '}
      <span className={`loyalty-points-label ${spanClass}`}>
        {additional?.milesLabel}
      </span>
    </>
  );
}

LoyaltyFarePoints.propTypes = {
  startsAtPublishFare: PropTypes.number.isRequired,
  spanClass: PropTypes.string,
  defaultVal: PropTypes.string.isRequired,
};

LoyaltyFarePoints.defaultProps = {
  spanClass: '',
};

export default LoyaltyFarePoints;
