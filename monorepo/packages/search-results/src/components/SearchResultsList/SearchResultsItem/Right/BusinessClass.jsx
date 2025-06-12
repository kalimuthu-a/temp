import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import classNames from 'classnames';
import { a11y } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import minBy from 'lodash/minBy';
import sortBy from 'lodash/sortBy';

import { FARE_CLASSES, discountCodes } from '../../../../constants';

import './FareClass.scss';
import { formatCurrency } from '../../../../utils';
import LoyaltyPoints from '../../../LoyaltyPoints/LoyaltyPoints';
import LoyaltyFarePoints from '../../../LoyaltyFarePoints/LoyaltyFarePoints';

const { DOUBLE_SEAT, TRIPLE_SEAT } = discountCodes;

const BusinessClass = ({
  onClick,
  FareClass,
  passengerFares,
  nextLabel,
  nextBackground,
  currencyCode,
}) => {
  const onClickHandler = (e) => {
    e?.stopPropagation();
    onClick(FARE_CLASSES.BUSINESS);
  };

  const onKeyUpHandler = (event) => {
    if (event.keyCode === a11y.keyCode.enter) {
      onClickHandler();
    }
  };

  const { startsAt, nextPotentialPoints, startsAtPublishFare } = useMemo(() => {
    const fares = passengerFares.filter(
      (row) => row.FareClass === FARE_CLASSES.BUSINESS,
    );
    const sortedPassFares = sortBy(fares, 'totalFareAmount');

    const filteredPaxFare = sortedPassFares?.[0]?.paxFares?.filter(
      (r) => ![DOUBLE_SEAT, TRIPLE_SEAT].includes(r.passengerDiscountCode),
    );

    const minFareAmount = minBy(filteredPaxFare, 'fareAmount');

    const amount = minFareAmount?.fareAmount;

    if (!amount) {
      return { startsAt: null, nextPotentialPoints: null, startsAtPublishFare: null };
    }

    const [{ PotentialPoints }] = sortedPassFares || [{}];
    const { publishedFare } = minFareAmount || {};

    return {
      startsAt: formatCurrency(minFareAmount?.fareAmount, currencyCode),
      nextPotentialPoints: PotentialPoints,
      startsAtPublishFare: publishedFare,
    };
  }, {});

  const className = classNames('business-class-item', {
    active: FareClass === FARE_CLASSES.BUSINESS,
    'no-data': !startsAt,
  });

  return (
    <div className={className}>
      {startsAt ? (
        <div
          className="selected-fare"
          tabIndex="0"
          onClick={onClickHandler}
          onKeyUp={onKeyUpHandler}
          role="button"
        >
          <figure>
            <img
              src={nextBackground?._publishUrl}
              alt="Back"
              className="bgimage"
            />
          </figure>
          <div className="selected-fare-wrapper">
            <Text variation="body-small-light text-secondary">
              <NextChip tabIndex={-1}>{nextLabel}</NextChip>
            </Text>
            <div>
              <Text variation="sh3" containerClass="selected-fare__fare-price">
                <LoyaltyFarePoints
                  startsAtPublishFare={startsAtPublishFare}
                  defaultVal={startsAt}
                />
                {FareClass === FARE_CLASSES.BUSINESS ? (
                  <span className="sky-icons icon-accordion-up-simple md" />
                ) : (
                  <span className="sky-icons icon-accordion-down-simple md" />
                )}
              </Text>
            </div>
          </div>
          <LoyaltyPoints
            popHover
            potentialPoints={nextPotentialPoints}
            className="loyalty-starts-at-points"
          />
        </div>
      ) : (
        <div className="dashes" />
      )}
    </div>
  );
};

BusinessClass.propTypes = {
  onClick: PropTypes.func,
  FareClass: PropTypes.any,
  passengerFares: PropTypes.array,
  nextLabel: PropTypes.string,
  nextBackground: PropTypes.any,
  currencyCode: PropTypes.string,
};

export default BusinessClass;
