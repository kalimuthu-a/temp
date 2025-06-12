import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import LoyaltyPoints from '../../../LoyaltyPoints/LoyaltyPoints';
import LoyaltyFarePoints from '../../../LoyaltyFarePoints/LoyaltyFarePoints';

import { SALE_TAG } from '../../../../constants';

const Normal = ({
  startsAtFormatted,
  startsAtLabel,
  fillingFast,
  fillingFastLabel,
  passengerFares,
  additional,
  startsAtLoyaltyPoints,
  startsAtPublishFare,
}) => {
  return (
    <div
      className="fare-accordion__head__flight-info-sec"
      role="button"
      tabIndex={0}
    >
      <div className="flight-seats">
        {fillingFast && (
          <Text variation="body-small-medium text-system-warning">
            {fillingFastLabel}
          </Text>
        )}
      </div>

      <div className="selected-fare">
        {passengerFares?.some((fares) => fares?.productClass === SALE_TAG) && (
          <Text variation="body-small-light text-secondary">
            {additional?.fareTypeMap?.get(SALE_TAG)?.fareLabel}
          </Text>
        )}
      </div>

      <div className="selected-fare">
        <Text variation="body-small-light text-secondary">{startsAtLabel}</Text>
        <Text variation="sh3" containerClass="selected-fare__fare-price">
          <LoyaltyFarePoints
            startsAtPublishFare={startsAtPublishFare}
            defaultVal={startsAtFormatted}
          />
        </Text>
      </div>

      <LoyaltyPoints
        popHover
        potentialPoints={startsAtLoyaltyPoints}
        className="loyalty-starts-at-points"
      />
    </div>
  );
};

Normal.propTypes = {
  additional: PropTypes.any,
  fillingFast: PropTypes.any,
  fillingFastLabel: PropTypes.any,
  passengerFares: PropTypes.array,
  startsAtFormatted: PropTypes.any,
  startsAtLabel: PropTypes.any,
  startsAtLoyaltyPoints: PropTypes.any,
  startsAtPublishFare: PropTypes.any,
};

export default Normal;
