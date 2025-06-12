import PropTypes from 'prop-types';
import React from 'react';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import {
  scrollBookingDropdownsIntoView,
  triggerClosePopup,
} from '../../../utils';

const MobileBottom = ({
  middleLabel,
  extra,
  selectedSpecialFare,
  extraSeatsLabel,
  continueCtaLabel,
}) => {
  const onClickContinue = () => {
    scrollBookingDropdownsIntoView();
    triggerClosePopup();
  };
  return (
    <div className="pax-fare-selection-popover--mobile-bottom">
      <div>
        <div className="left">
          <div className="d-flex gap-2 flex-column">
            <Text
              containerClass="text-primary-main"
              mobileVariation="body-medium-medium"
            >
              {middleLabel}
            </Text>
            <div className="d-flex gap-2">
              {selectedSpecialFare?.specialFareLabel && (
                <Chip variant="filled" color="primary-main" size="sm">
                  {selectedSpecialFare.specialFareLabel}
                </Chip>
              )}
              {extra > 0 && (
                <Chip variant="filled" color="primary-main" size="sm">
                  {`+${extra} ${extraSeatsLabel}`}
                </Chip>
              )}
            </div>
          </div>
        </div>
        <div className="right">
          <Button onClick={onClickContinue}>{continueCtaLabel}</Button>
        </div>
      </div>
    </div>
  );
};

MobileBottom.propTypes = {
  extra: PropTypes.number,
  middleLabel: PropTypes.any,
  selectedSpecialFare: PropTypes.any,
  extraSeatsLabel: PropTypes.string,
  continueCtaLabel: PropTypes.string,
};

export default MobileBottom;
