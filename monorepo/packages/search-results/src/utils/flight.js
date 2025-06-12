import differenceInSeconds from 'date-fns/differenceInSeconds';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import getHours from 'date-fns/getHours';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import addDays from 'date-fns/addDays';
import getMinutes from 'date-fns/getMinutes';
import sub from 'date-fns/sub';
import inRange from 'lodash/inRange';
import orderBy from 'lodash/orderBy';

import JourneyItemModel from '../models/JourneyItemModel';
import { SAVER_COMBINABILITY_MATRIX } from '../constants';

const sortingMap = {
  lowCostFirst: {
    key: ['startsAt'],
    order: ['asc'],
  },
  duration: {
    key: ['flightDurationInSec'],
    order: ['asc'],
  },
  earlyDeparture: {
    key: ['designator.utcDeparture'],
    order: ['asc'],
  },
  lateDeparture: {
    key: ['designator.utcDeparture'],
    order: ['desc'],
  },
  noOfStops: {
    key: ['stops'],
    order: ['asc'],
  },
  highestPoints: {
    key: ['highestFare'],
    order: ['desc'],
  },
};

export const flightDurationInSec = (start, end) => {
  return differenceInSeconds(new Date(start), new Date(end));
};

export const isDirectFlight = (journey) => journey.stops === 0;

export const isLayerOverFlight = (journey) => {
  return journey.segments.some((segment) => segment.legs.length > 1);
};

// Fatest Recommendation
export const fastestRecommendation = (journeyItem, recommended) => {
  let { fastest } = recommended;
  if (
    journeyItem.flightDurationInSec <= recommended.fastest.flightDurationInSec
  ) {
    if (
      journeyItem.flightDurationInSec ===
      recommended.fastest.flightDurationInSec
    ) {
      const isDirectFlightType = isDirectFlight(journeyItem);
      const isLayerOverFlightType = isLayerOverFlight(journeyItem);
      const isDirectFlightTypeRec = isDirectFlight(recommended.fastest);
      const isLayerOverFlightTypeRec = isLayerOverFlight(recommended.fastest);
      if (isDirectFlightTypeRec) {
        return fastest;
      }
      if (isDirectFlightType) {
        return journeyItem;
      }
      if (isLayerOverFlightType && !isLayerOverFlightTypeRec) {
        fastest = journeyItem;
      }
    } else {
      fastest = journeyItem;
    }
  }
  return fastest;
};

// highest loyaltyPoints Recommendation
const highestLoyaltyPointsRecommendation = (
  journeyItem,
  recommended,
  flightIsEarlier,
) => {
  if (!recommended.highestLoyaltyPoints) {
    return journeyItem;
  }
  // highest Fare will have the highest loyalty points
  const { highestFare } = recommended.highestLoyaltyPoints;

  if (
    journeyItem?.highestFare > highestFare ||
    (journeyItem?.highestFare === highestFare && flightIsEarlier)
  ) {
    return journeyItem;
  }

  return recommended.highestLoyaltyPoints;
};

/**
 *
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Array<Date>}
 */
export const getAllDatesBetweenInterval = (minDate) => {
  const dates = [];

  if (!minDate) {
    return dates;
  }

  let i;
  for (i = 0; i <= 14; i += 1) {
    const newDate = addDays(minDate, i);
    dates.push({ d: newDate, disabled: false });
  }

  const newElements = Array.from({
    length: 30,
  });

  const lastElement = dates.at(-1);

  newElements.forEach((v, j) => {
    dates.push({
      d: addDays(lastElement?.d || new Date(minDate), j + 1),
      disabled: false,
    });
  });

  return dates.slice(0, 30);
};

/**
 *
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Array<Date>}
 */
export const getAllDatesBetweenWithRestriction = (
  minDate,
  maxDate,
  departureDate,
) => {
  const dates = [];

  if (!minDate) {
    return dates;
  }

  const futureDays = differenceInCalendarDays(maxDate, departureDate);
  const pastDays = differenceInCalendarDays(departureDate, minDate);

  const pastDaysCardLength = Math.min(29 - Math.min(futureDays, 14), pastDays);
  const futureDaysCardLength = 29 - pastDaysCardLength;

  let i;
  for (i = pastDaysCardLength; i > 0; i -= 1) {
    const newDate = sub(departureDate, { days: i });

    let disabled = false;

    if (maxDate && differenceInCalendarDays(newDate, maxDate) >= 0) {
      disabled = true;
    }

    dates.push({ d: newDate, disabled });
  }

  dates.push({ d: departureDate, disabled: false });

  const newElements = Array.from({
    length: futureDaysCardLength,
  });

  const lastElement = dates[dates.length - 1];

  newElements.forEach((v, j) => {
    let disabled = false;
    const newDate = addDays(lastElement?.d || new Date(minDate), j + 1);

    if (maxDate && differenceInCalendarDays(newDate, maxDate) > 0) {
      disabled = true;
    }
    dates.push({
      d: newDate,
      disabled,
    });
  });

  return dates;
};

const sortJournies = (journies, sort) => {
  const sortingOrder = sortingMap[sort?.keyProp];

  if (sortingOrder) {
    return orderBy(journies, sortingOrder.key, sortingOrder.order);
  }

  return orderBy(journies, 'priority', 'asc');
};

const processRecommendedSection = (journeyItem, recommendedObj, isEarn) => {
  const { passengerFares } = journeyItem;
  const isSaverExist = passengerFares.some(
    (fare) =>
      SAVER_COMBINABILITY_MATRIX.includes(fare.productClass) && fare.isActive,
  );

  if (!isSaverExist && !isEarn) {
    return { recommended: recommendedObj };
  }
  const recommended = recommendedObj;

  if (!recommended.value) {
    recommended.value = journeyItem;
    recommended.fastest = journeyItem;
  }

  const flightIsEarlier =
    differenceInSeconds(
      recommended.value.designator.departure,
      journeyItem.designator.departure,
    ) > 0;

  // Price Recommendation
  if (
    journeyItem.startsAt < recommended.value.startsAt ||
    (journeyItem.startsAt === recommended.value.startsAt && flightIsEarlier)
  ) {
    recommended.value = journeyItem;
  }

  recommended.fastest = fastestRecommendation(journeyItem, recommended);

  if (isEarn) {
    recommended.highestLoyaltyPoints = highestLoyaltyPointsRecommendation(
      journeyItem,
      recommended,
      flightIsEarlier,
    );
  }

  return {
    recommended,
  };
};

const createItemsForJourney = (
  journiesAvailable,
  filters,
  additional,
  currencyCode,
  combinabilityMap,
  firstTimeLoad,
  selectedTripIndex,
  isEarn,
) => {
  const journies = [];
  let appliedSpecialfareCount = 0;
  let appliedSpecialFare = null;
  let recommended = {
    target: null,
    value: null,
    fastest: null,
    highestLoyaltyPoints: null,
  };
  const isProjectNext = journiesAvailable.some((item) => item.isNext);

  journiesAvailable.forEach((item) => {
    const journeyItem = new JourneyItemModel(
      item,
      additional,
      currencyCode,
      combinabilityMap,
      firstTimeLoad,
      selectedTripIndex,
    );

    ({ recommended } = processRecommendedSection(
      journeyItem,
      recommended,
      isEarn,
    ));

    const {
      stops,
      designator: { departure },
      isNext,
    } = item;

    // Stops Filter
    if (filters.stops.active.size > 0 && !filters.stops.active.has(stops)) {
      return;
    }

    // Departure Time
    if (filters.departureTime.active.size > 0) {
      const activeDepartureTimes = [...filters.departureTime.active];

      const foundInTimeFilter = activeDepartureTimes.some((duration) => {
        const [start, end] = duration.split('-').map((i) => parseInt(i, 10));
        const totalMinutes = getHours(departure) * 60 + getMinutes(departure);

        if (start > end) {
          return (
            inRange(totalMinutes, start, 1440) || inRange(totalMinutes, 0, end)
          );
        }

        return inRange(totalMinutes, start, end);
      });

      if (!foundInTimeFilter) {
        return;
      }
    }

    // Aircrafts
    if (filters.aircrafts.active.size > 0) {
      const activeAircrafts = [...filters.aircrafts.active];
      const aircraftIndex = journeyItem.aircrafts.findIndex((aircraft) =>
        activeAircrafts.includes(aircraft.equipmentTypeLabel),
      );
      if (aircraftIndex < 0) {
        return;
      }
    }

    // IS Next Filter
    if (filters.isNext && !isNext) {
      return;
    }

    journies.push(journeyItem);

    if (journeyItem.specialFare) {
      appliedSpecialFare = journeyItem.specialFare;
      appliedSpecialfareCount += 1;
    }
  });

  return {
    journies,
    recommended,
    appliedSpecialFare,
    appliedSpecialfareCount,
    isProjectNext,
  };
};

export const selectedTripAvailableJourney = (
  journiesAvailable,
  sort,
  filters,
  additional,
  currencyCode,
  combinabilityMap,
  firstTimeLoad,
  selectedTripIndex,
  isEarn,
) => {
  // Show all filghts
  // const journiesToShow = journiesAvailable.filter(
  //   (row) => row.passengerFares.length > 0,
  // );

  const journiesToShow = journiesAvailable;

  let recommended = null;

  const itemsObj = createItemsForJourney(
    journiesToShow,
    filters,
    additional,
    currencyCode,
    combinabilityMap,
    firstTimeLoad,
    selectedTripIndex,
    isEarn,
  );

  const journies = sortJournies(itemsObj.journies, sort);

  if (journiesToShow.length >= 5) {
    recommended = itemsObj.recommended;
  }

  const sortedSoldFlights = orderBy(journies, 'isSold', 'asc');

  return {
    ...itemsObj,
    journies: sortedSoldFlights,
    recommended,
  };
};

export const cityWithTerminal = (city, terminal, enclosed = true) => {
  const format = enclosed ? '{city} (T{terminal})' : '{city}, T{terminal}';
  return terminal
    ? formattedMessage(format, { city: city ?? '', terminal })
    : city;
};

export const flightwithCarrierInfo = (icon) => {
  const { carrierCode, equipmentType, identifier, image, equipmentTypeLabel } =
    icon;

  return formattedMessage(
    '<img src="{icon}" alt="Aircraft Icon" class="codeshare-icon"/> {carrierCode} {identifier}. {equipmentType}',
    {
      icon: image,
      carrierCode,
      identifier,
      equipmentType: equipmentTypeLabel || equipmentType,
    },
  );
};
