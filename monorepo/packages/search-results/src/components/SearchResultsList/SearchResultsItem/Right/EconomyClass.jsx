import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import classNames from 'classnames';
import minBy from 'lodash/minBy';
import sortBy from 'lodash/sortBy';

import { a11y } from 'skyplus-design-system-app/dist/des-system/globalConstants';

import { FARE_CLASSES, discountCodes } from '../../../../constants';
import { formatCurrency } from '../../../../utils';
import LoyaltyPoints from '../../../LoyaltyPoints/LoyaltyPoints';
import LoyaltyFarePoints from '../../../LoyaltyFarePoints/LoyaltyFarePoints';

const { DOUBLE_SEAT, TRIPLE_SEAT } = discountCodes;

const EconomyClass = ({
  onClick,
  FareClass,
  passengerFares,
  economyLabel,
  startsAtLabel,
  currencyCode,
}) => {
  const { startsAt, nextPotentialPoints, startsAtPublishFare } = useMemo(() => {
    const fares = passengerFares.filter(
      (row) => row.FareClass === FARE_CLASSES.ECONOMY,
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

  const className = classNames('economy-class-item', {
    active: FareClass === FARE_CLASSES.ECONOMY,
    'no-data': !startsAt,
  });

  const onClickHandler = (e) => {
    e?.stopPropagation();
    onClick(FARE_CLASSES.ECONOMY);
  };

  const onKeyUpHandler = (event) => {
    if (event.keyCode === a11y.keyCode.enter) {
      onClickHandler();
    }
  };

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
          <Text variation="body-small-light text-secondary economy">
            {economyLabel}
          </Text>
          <div>
            <div className="d-flex gap-8 align-items-center">
              <h5 className="starts-at">{startsAtLabel}</h5>
              <Text variation="sh3" containerClass="selected-fare__fare-price">
                <LoyaltyFarePoints
                  startsAtPublishFare={startsAtPublishFare}
                  defaultVal={startsAt}
                />
                {FareClass === FARE_CLASSES.ECONOMY ? (
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

EconomyClass.propTypes = {
  FareClass: PropTypes.any,
  onClick: PropTypes.func,
  passengerFares: PropTypes.array,
  economyLabel: PropTypes.string,
  startsAtLabel: PropTypes.string,
  currencyCode: PropTypes.string,
};

export default EconomyClass;
