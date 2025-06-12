import PropTypes from 'prop-types';
import React, { useMemo, useRef } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import map from 'lodash/map';
import find from 'lodash/find';
import classNames from 'classnames';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import {
  a11y,
  specialFareCodes,
} from 'skyplus-design-system-app/dist/des-system/globalConstants';

import { formatCurrency } from '../../utils';
import UpgradeCard from './UpgradeCard/UpgradeCard';
import useAppContext from '../../hooks/useAppContext';
import FareDetailsSingle from './FareType/FareDetailsSingle';
import ServicesSection from './ServicesSection';
import { ANALTYTICS, FARE_CLASSES, discountCodes } from '../../constants';
import { srpActions } from '../../context/reducer';
import { fareTypeUpgradeCard, isCombinableClass } from './searchResultsUtils';
import { isDoubleTripleSeatsNotAllowed } from '../../utils/continueHandler';
import LoyaltyPoints from '../LoyaltyPoints/LoyaltyPoints';
import LoyaltyFarePoints from '../LoyaltyFarePoints/LoyaltyFarePoints';
import { handleNorseFlights } from '../../utils/norseFlights';

const { DOUBLE_SEAT, TRIPLE_SEAT } = discountCodes;

const FareType = ({
  selected = false,
  journeyKey,
  onClick,
  services,
  specialFare,
  isInternational,
  hideChip,
  segments,
  ...item
}) => {
  const {
    state: {
      selectedFares,
      additional,
      main,
      flightSearchData,
      selectedTripIndex,
      searchContext,
      isBurn,
    },
    dispatch,
  } = useAppContext();
  const {
    paxFares,
    baggageData,
    productClass,
    FareClass,
    isActive,
    pClassList,
    PotentialPoints,
  } = item;

  const ref = useRef(null);

  /**
   * @param {React.SyntheticEvent<HTMLDivElement>} e
   */
  const onClickFareType = (e) => {
    e.stopPropagation();

    if (
      searchContext.payloadPromotionCode === specialFareCodes.UMNR &&
      FareClass === FARE_CLASSES.BUSINESS
    ) {
      dispatch({
        type: srpActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: formattedMessage(main.nextDisableForUMNR, {
            fareLabel: item?.aemFare?.fareLabel,
          }),
          analyticsData: {
            component: 'Select',
            action: 'Link/ButtonClick',
          },
        },
      });

      return;
    }

    if (FareClass === FARE_CLASSES.BUSINESS && !isActive) {
      dispatch({
        type: srpActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: main.doubleOrTripleSeatNote,
          analyticsData: {
            component: 'Select',
            action: ANALTYTICS.INTERACTION.LINK_BUTTON_CLICK,
          },
        },
      });
      return;
    }

    const { selectedPaxInformation, selectedSpecialFare } = searchContext;

    const { variation, error } = isDoubleTripleSeatsNotAllowed(
      selectedPaxInformation.types,
      { segments },
      selectedSpecialFare,
      additional,
    );

    if (error) {
      dispatch({
        type: srpActions.SET_TOAST,
        payload: {
          variation,
          show: true,
          description: error,
          analyticsData: {
            component: 'Select',
            action: ANALTYTICS.INTERACTION.LINK_BUTTON_CLICK,
          },
        },
      });
      return;
    }

    onClick(item);
    ref?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const {
    totalFirstJourneyAmount,
    totalJourneyAmount,
    selectedFaresCombinability,
    otherFlight,
  } = fareTypeUpgradeCard({
    selectedFares,
    selectedTripIndex,
    journeyKey,
    pClassList,
  });

  const groupFarePrice = useMemo(() => {
    if (isBurn) {
      return [];
    }

    const prices = paxFares
      .filter(
        (row) =>
          ![DOUBLE_SEAT, TRIPLE_SEAT].includes(row.passengerDiscountCode),
      )
      .map((paxFare) => ({
        amount: formatCurrency(
          paxFare?.fareAmount,
          flightSearchData.currencyCode,
        ),
        label: `/${
          find(additional?.paxDescription, {
            discountCode: paxFare?.passengerDiscountCode || null,
            typeCode: paxFare?.passengerType,
          })?.paxLabel
        }`,
      }));

    return prices.length > 1 ? prices : [];
  }, []);

  const fareType = additional.fareTypeMap.get(productClass);

  const servicesToDisplay = useMemo(() => {
    const servicesinOrder = {};
    const { values = [], secondaryValues = [] } = handleNorseFlights(segments[0], fareType?.servicesWithFleetType);
    const fareTypeServices = values?.length > 0 ? values : fareType?.services;
    const fleetFareType = secondaryValues?.reduce((acc, element) => {
      acc[element?.key] = element?.value;
      return acc;
    }, {}) || {};

    for (const service of services) {
      const filteredServices = [];
      const { handBaggageWeight, checkinBaggageWeight } = baggageData;

      const interpolationObj = {
        ...fareType,
        checkinBaggage: checkinBaggageWeight,
        cabinBaggage: handBaggageWeight,
        changeCharges1: isInternational
          ? fareType?.internationalChangeCharges1
          : fareType?.domesticChangeCharges1,
        cancellationCharges1: isInternational
          ? fareType?.internationalCancellationCharges1
          : fareType?.domesticCancellationCharges1,
      };

      const fleetTypeInterpolationObj = {
        ...fareType,
        checkinBaggage: checkinBaggageWeight,
        cabinBaggage: handBaggageWeight,
        changeCharges1: isInternational
          ? fleetFareType?.internationalChangeCharges1
          : fleetFareType?.domesticChangeCharges1,
        cancellationCharges1: isInternational
          ? fleetFareType?.internationalCancellationCharges1
          : fleetFareType?.domesticCancellationCharges1,
      };

      fareTypeServices.forEach((fareItem) => {
        const { key, icon, description } = fareItem;
        if (key === service) {
          let value =
          formattedMessage(description?.html ?? '', values?.length > 0 ? fleetTypeInterpolationObj : interpolationObj);
          if (
            (icon === 'icon-cabin-bag' && handBaggageWeight === 0) ||
            (icon === 'icon-checkin-bag' && checkinBaggageWeight === 0)
          ) {
            value = '';
          }
          filteredServices.push({ ...fareItem, value });
        }
      });

      if (filteredServices.length > 0) {
        servicesinOrder[service] = filteredServices;
      }
    }

    return servicesinOrder;
  }, []);

  const className = classNames('fare-type__single', {
    selected,
    disabled: !isActive && FareClass !== FARE_CLASSES.BUSINESS,
  });
  const { minPaxAmount, minPaxPublishFare } = useMemo(() => {
    const filteredPaxFare = paxFares.filter(
      (r) => ![DOUBLE_SEAT, TRIPLE_SEAT].includes(r.passengerDiscountCode),
    );
    const minAmount = Math.min(...filteredPaxFare.map((pax) => pax.fareAmount));
    const minPublishFare = Math.min(
      ...filteredPaxFare.map((pax) => pax.publishedFare),
    );
    return { minPaxAmount: minAmount, minPaxPublishFare: minPublishFare };
  }, {});

  const onKeyDownHandler = (e) => {
    if (e.keyCode === a11y.keyCode.enter) {
      onClickFareType(e);
    }
  };

  return (
    <div
      className={className}
      onClick={onClickFareType}
      role="checkbox"
      aria-checked={selected}
      ref={ref}
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
    >
      <Text variation="body-extra-small-regular" containerClass="title">
        {fareType.fareLabel}
      </Text>

      <div className="d-flex justify-content-between align-items-center gap-2">
        <Text variation="sh3" containerClass="justify-content-between price">
          <LoyaltyFarePoints
            startsAtPublishFare={minPaxPublishFare}
            defaultVal={formatCurrency(
              minPaxAmount,
              flightSearchData.currencyCode,
            )}
          />
        </Text>
        {specialFare && !hideChip && (
          <Chip
            txtcol="system-information"
            color="secondary-light"
            variant="filled"
            size="sm"
            containerClass="f-w-500 white-space-pre special-fare"
          >
            {specialFare?.specialFareLabel}
          </Chip>
        )}
      </div>
      <LoyaltyPoints potentialPoints={PotentialPoints} />

      <div className="fare-details">
        {groupFarePrice.length > 0 && (
          <>
            <div className="line-bg" />
            {groupFarePrice.map((row) => (
              <FareDetailsSingle
                key={row.label}
                label={`${row.amount} ${row.label}`}
              />
            ))}
          </>
        )}

        {map(servicesToDisplay, (value, key) => {
          return (
            <ServicesSection serviceKey={key} services={value} key={key} />
          );
        })}
      </div>
      {selected &&
        searchContext.isOnewayTrip() &&
        !isCombinableClass(selectedFaresCombinability, productClass) && (
          <UpgradeCard
            totalFirstJourneyAmount={totalFirstJourneyAmount}
            totalJourneyAmount={totalJourneyAmount}
            otherFlight={otherFlight}
            productClass={productClass}
            Product={item?.aemFare?.fareLabel}
            pClassList={pClassList}
          />
        )}
    </div>
  );
};

FareType.propTypes = {
  journeyKey: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  isInternational: PropTypes.bool,
  hideChip: PropTypes.bool,
  services: PropTypes.array,
  specialFare: PropTypes.any,
  totalFareAmount: PropTypes.any,
  segments: PropTypes.any,
};

export default FareType;
