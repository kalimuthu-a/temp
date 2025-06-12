import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

import useAppContext from '../../../hooks/useAppContext';
import { srpActions } from '../../../context/reducer';
import { formatCurrency } from '../../../utils';

const UpgradeCard = ({
  totalFirstJourneyAmount,
  totalJourneyAmount,
  otherFlight,
  productClass,
  Product,
  pClassList,
}) => {
  const {
    dispatch,
    state: { additional, flightSearchData, searchContext, selectedTripIndex },
  } = useAppContext();

  const onClickUpgrade = () => {
    let toastMsg =
      searchContext.isRoundTrip() && selectedTripIndex === 1
        ? additional?.arrivalFlightUpgradedlabel
        : additional?.departureFlightUpgradedlabel;

    toastMsg = formattedMessage(toastMsg, { fareType: Product });

    dispatch({
      type: srpActions.UPGRADE_FARES,
      payload: { productClass, toastMsg },
    });
  };

  const amount = totalFirstJourneyAmount - totalJourneyAmount;

  return (
    <div className="upgrade-card">
      <div className="upgrade-card__note d-none d-md-flex">
        <Text variation="body-extra-small-regular">
          {formattedMessage(additional?.upgradeTitle, {
            fareType: Product,
          })}
        </Text>
      </div>
      <div className="upgrade-card__body d-md-flex align-items-end justify-content-between gap-2">
        <div className="upgrade-card__body__text">
          <Heading
            heading="h5"
            mobileHeading="h4"
            containerClass="upgrade-title"
          >
            {amount > 0
              ? additional?.upgradeDescription
              : additional?.savedDescription}
            <span>
              {formatCurrency(Math.abs(amount), flightSearchData?.currencyCode)}
            </span>
          </Heading>
        </div>
        <div className="upgrade-card__body__cta">
          <Button size="small" onClick={onClickUpgrade}>
            {amount > 0
              ? additional?.upgradeLabel
              : additional?.changeButtonLabel}
          </Button>
        </div>
      </div>

      {Object.entries(otherFlight).map((flight) => {
        const [key, value] = flight;
        const [ori, des, jKey] = key.split('-');

        const productClassAmount = value[pClassList];

        if (!productClassAmount) return null;

        return (
          <div
            className="upgrade-card__footer d-none d-md-flex align-items-start justify-content-between"
            key={jKey}
          >
            <div className="upgrade-card__footer_fare-text">
              <Text variation="body-extra-small-regular">
                {formattedMessage(additional?.newFareLabel, {
                  from: ori,
                  to: des,
                  newFare: Product,
                })}
              </Text>
            </div>
            <div className="upgrade-card__footer_fare-amt">
              <Text variation="body-medium-regular">
                {formatCurrency(
                  productClassAmount,
                  flightSearchData?.currencyCode,
                )}
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};

UpgradeCard.propTypes = {
  totalFirstJourneyAmount: PropTypes.any,
  totalJourneyAmount: PropTypes.any,
  otherFlight: PropTypes.any,
  productClass: PropTypes.string,
  Product: PropTypes.string,
  pClassList: PropTypes.string,
};

export default UpgradeCard;
