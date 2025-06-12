import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Button, {
  PRIMARY,
  SUCCESS,
} from 'skyplus-design-system-app/dist/des-system/Button';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

import get from 'lodash/get';
import minBy from 'lodash/minBy';

import JourneyLap from '../common/JourneyLap/JourneyLap';
import useAppContext from '../../hooks/useAppContext';
import LoyaltyPoints from '../LoyaltyPoints/LoyaltyPoints';
import LoyaltyFarePoints from '../LoyaltyFarePoints/LoyaltyFarePoints';
import { srpActions } from '../../context/reducer';
import { isDoubleTripleSeatsNotAllowed } from '../../utils/continueHandler';
import { isCombinableClass } from '../SearchResultsList/searchResultsUtils';
import { SAVER_COMBINABILITY_MATRIX, discountCodes } from '../../constants';
import { formatCurrency } from '../../utils';

const { DOUBLE_SEAT, TRIPLE_SEAT } = discountCodes;

const RecommendedItem = ({ tag = '', item, onSelect }) => {
  const {
    designator: { arrivalF, departureF, duration },
    stops,
    flightNumbers,
    passengerFares,
    startsAtLoyaltyPoints,
    highestLoyaltyPoints,
    highestFareFormatted,
    startsAtPublishFare,
    highestPassengerFare,
  } = item;

  const {
    state: {
      additional,
      main,
      selectedTripIndex,
      selectedFares,
      searchContext,
    },
    dispatch,
  } = useAppContext();

  const [isMobile] = useIsMobile();
  const isHighestPoints = tag === main?.travelRecommendationLabel?.highestpoints;
  const potentialPoints = !isHighestPoints ? startsAtLoyaltyPoints : highestLoyaltyPoints;

  const startsAtFare = passengerFares?.find?.((_fare) =>
    SAVER_COMBINABILITY_MATRIX.includes(_fare?.productClass),
  );

  const minPrices = startsAtFare?.paxFares?.filter?.(
    (r) => ![DOUBLE_SEAT, TRIPLE_SEAT].includes(r?.passengerDiscountCode),
  );

  const startsAtObj = minBy(minPrices, 'fareAmount');

  const startsAtFormatted = formatCurrency(
    startsAtObj?.fareAmount,
    searchContext?.selectedCurrency?.value,
  );

  const fare = !isHighestPoints ? startsAtFare : highestPassengerFare;
  const formattedPrice = !isHighestPoints ? startsAtFormatted : highestFareFormatted;

  const fareLabel = useMemo(() => {
    const fareType = additional?.fareTypeMap?.get(fare?.productClass);
    return fareType?.fareLabel;
  }, []);

  const selectedFareAvailabilityKey = get(
    selectedFares,
    [selectedTripIndex, 'fare', 'fareAvailabilityKey'],
    null,
  );

  const selectedJourneyKey = get(
    selectedFares,
    [selectedTripIndex, 'journeyKey'],
    null,
  );

  const buttonColor =
    selectedFareAvailabilityKey === fare?.fareAvailabilityKey &&
    selectedJourneyKey === item?.journeyKey
      ? SUCCESS
      : PRIMARY;

  const onClick = () => {
    const { selectedPaxInformation, selectedSpecialFare } = searchContext;

    const { variation, error } = isDoubleTripleSeatsNotAllowed(
      selectedPaxInformation.types,
      item,
      selectedSpecialFare,
      additional,
    ) || {};

    if (error) {
      dispatch({
        type: srpActions?.SET_TOAST,
        payload: {
          variation,
          show: true,
          description: error,
          analyticsData: {
            component: 'Select',
            action: 'Link/ButtonClick',
          },
        },
      });

      return;
    }

    if (buttonColor === SUCCESS) {
      return;
    }

    const otherFares = [
      ...selectedFares.slice(0, selectedTripIndex),
      ...selectedFares.slice(selectedTripIndex + 1),
    ].filter((row) => Boolean(row));

    const selectedFaresPrices = otherFares?.filter((row) => Boolean(row));
    const selectedFaresCombinability = selectedFaresPrices?.map(
      (row) => row?.fare?.combinabilityData,
    );

    const anyOtherUpgrade = otherFares.some(
      () => !isCombinableClass(selectedFaresCombinability, fare?.productClass),
    );

    if (anyOtherUpgrade) {
      dispatch({
        type: srpActions.SET_TOAST,
        payload: {
          show: true,
          description: formattedMessage(
            additional?.yourDepartureFlightUpgraded,
            { fareType: fareLabel },
          ),
          variation: 'Success',
        },
      });
    }

    onSelect({ ...item, fare, fareTag: tag });
  };

  return (
    <div className="srp-flight-carousel-container__item rounded-1">
      <div className="d-flex justify-content-between align-items-center">
        <Chip
          containerClass="recommended-chip"
          size="xs"
          variant="filled"
          color="secondary-light"
          border="system-success"
          txtcol="system-success"
        >
          {tag}
        </Chip>
        <HtmlBlock
          html={flightNumbers}
          className="tags-small text-tertiary d-flex justify-content-center align-items-center srp__flight-num"
          tagName="p"
        />
      </div>
      <div className={`d-flex align-items-center gap-8 ${isMobile ? 'mt-6' : 'mt-2'}`}>
        <div>
          <p className="sh4 time">{departureF}</p>
          <p className="airport price-regular-stroked text-decoration-none text-secondary">
            {item.getDeparture()}
          </p>
        </div>

        <JourneyLap
          containerClass="flex-grow-1 srp__journey-lap"
          duration={duration}
          stops={stops}
        />

        <div>
          <p className="sh4">{arrivalF}</p>
          <p className="airport price-regular-stroked text-decoration-none text-secondary">
            {item.getArrival()}
          </p>
        </div>
      </div>
      <div className={`line-bg ${!isMobile ? 'my-4' : 'my-8'}`} />
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="body-light text-tertiary lh-1-5">{fareLabel}</h4>
          <h4 className="body-medium-medium text-primary-main">
            <LoyaltyFarePoints
              startsAtPublishFare={startsAtPublishFare}
              defaultVal={formattedPrice}
            />
          </h4>
          <LoyaltyPoints className="loyalty-recommended-card-points" potentialPoints={potentialPoints} />
        </div>
        <Button
          onClick={onClick}
          color={buttonColor}
          classNames="body-medium-medium py-3 px-6"
          aria-label={`Select ${tag} Flight starting at ${startsAtFormatted}`}
        >
          {buttonColor === SUCCESS ? 'Selected' : main.selectFlightLabel}
        </Button>
      </div>
    </div>
  );
};

RecommendedItem.propTypes = {
  item: PropTypes.any,
  tag: PropTypes.string,
  onSelect: PropTypes.func,
};

export default RecommendedItem;
