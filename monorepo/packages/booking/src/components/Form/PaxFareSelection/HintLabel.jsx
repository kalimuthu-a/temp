import PropTypes from 'prop-types';
import React from 'react';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';

const HintLabel = ({
  selectedSpecialFare,
  extra,
  defaultLabel,
  extraSeatsLabel,
}) => {
  const chipProps = {
    size: 'sm',
    variant: 'filled',
    color: 'secondary-light',
    txtcol: 'system-information',
  };
  return selectedSpecialFare || extra ? (
    <div className="d-flex gap-1">
      {selectedSpecialFare && selectedSpecialFare.specialFareLabel && (
        <Chip {...chipProps}>{selectedSpecialFare.specialFareLabel}</Chip>
      )}
      {extra > 0 && (
        <Chip {...chipProps}>{`+${extra} ${extraSeatsLabel}`}</Chip>
      )}
    </div>
  ) : (
    defaultLabel
  );
};

HintLabel.propTypes = {
  defaultLabel: PropTypes.any,
  extra: PropTypes.number,
  selectedSpecialFare: PropTypes.shape({
    specialFareLabel: PropTypes.any,
  }),
  extraSeatsLabel: PropTypes.string,
};

export default HintLabel;
