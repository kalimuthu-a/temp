import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import pushGTMAnalytics from './gtmEvents';

import { flightDurationFormatter, flightDurationFormatterUnits } from '.';
import { GTM_ANALTYTICS, dateFormats } from '../constants';

export const getAnalyticsItemId = (aircrafts, separator = ':') => {
  return aircrafts
    .map(({ carrierCode, identifier }) => `${carrierCode} ${identifier}`)
    .join(separator);
};

export const getAnalyticsItemName = (segments, separator = ':') => {
  return segments
    .map(({ designator }) => `${designator.origin}-${designator.destination}`)
    .join(separator);
};

export const getAnalyticsItemNameJourneyWise = (designator) => {
  const { destination, origin } = designator;
  return [origin, destination].join('-');
};

export const getAnalyticsBrand = (aircrafts, separator = ':') => {
  return aircrafts.map(({ carrierCode }) => `${carrierCode}`).join(separator);
};

export const getIsInternational = (segments) => {
  return segments.some(({ international }) => Boolean(international));
};

export const getItemCategory = (segments) => {
  return getIsInternational(segments) ? 'International' : 'Domestic';
};

export const getFlightOption = (segments) => {
  return getIsInternational(segments) ? 'International' : 'Domestic';
};

export const getFlightDuration = (segments, separator = ':') => {
  return segments
    .map(({ designator }) =>
      flightDurationFormatter(designator.utcDeparture, designator.utcArrival),
    )
    .join(separator);
};

export const getFlightTime = (segments, separator = ':') => {
  return segments
    .map(({ designator }) => {
      const departureF = format(
        new Date(designator.departure),
        dateFormats.HHMM,
      );
      const arrivalF = format(new Date(designator.arrival), dateFormats.HHMM);

      return [departureF, arrivalF].join('-');
    })
    .join(separator);
};

export const getFlightType = (tripType, index) => {
  return tripType === 'RoundTrip' && index === 1 ? 'Returning' : 'Departing';
};

export const getPageLoadTime = () => {
  const entries = performance.getEntriesByType('navigation');
  entries.forEach((entry) => {
    return entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
  });
};

export const setViewItemListGtm = (
  rows,
  googleAnalyticsContext,
  selectedTripIndex,
  selectedDate,
) => {
  const tripType = googleAnalyticsContext.trip_type;

  const ecommerceItems = rows.map(
    (
      { aircrafts, segments, startsAt, flightType, designator, fareTag },
      index,
    ) => ({
      item_id: getAnalyticsItemId(aircrafts, '~'),
      item_brand: getAnalyticsBrand(aircrafts, '~'),
      item_name: getAnalyticsItemNameJourneyWise(designator),
      item_category4: getAnalyticsItemName(segments, '~'),
      days_until_departure: differenceInCalendarDays(
        designator.departure,
        new Date(),
      ), // how many days until departure
      discount: '', // if there is any discount in flight fare
      item_category: getFlightOption(segments), // Flight search type
      index: index + 1,
      item_category2:
        selectedTripIndex === 1 && tripType === 'RoundTrip'
          ? 'Returning'
          : 'Departing',
      item_category3: fareTag,
      price: startsAt,
      flight_option: flightType,
      flight_time: getFlightTime(segments, '~'),
      flight_duration: getFlightDuration(segments, '~'),
    }),
  );

  pushGTMAnalytics({
    event: GTM_ANALTYTICS.EVENTS.VIEW_ITEM_LIST,
    data: {
      ...googleAnalyticsContext,
      ecommerce: {
        items: ecommerceItems,
      },
      departure_date: format(selectedDate, dateFormats.ddMMyyyy),
    },
  });
};

export const getFlightNumberAndDuration = (segments) => {
  const flightNumbers = [];
  const tripDuration = [];

  segments.forEach((segment) => {
    const { carrierCode, identifier } = segment.identifier;
    flightNumbers.push(`${carrierCode}${identifier}`);

    const { arrival, departure } = segment.designator;
    tripDuration.push(
      flightDurationFormatterUnits(new Date(departure), new Date(arrival)),
    );
  });

  return { flightNumbers, tripDuration };
};

export const getAppliedFilters = (filters) => {
  const filtersLabels = [...filters.aircrafts.active];

  for (const key of filters.stops.active) {
    if (key === 0) {
      filtersLabels.push('Non-Stop');
    } else if (key === 1) {
      filtersLabels.push('1-Stop');
    } else {
      filtersLabels.push('1+Stops');
    }
  }

  for (const key of filters.departureTime.active) {
    if (key === '360-720') {
      filtersLabels.push('Morning');
    } else if (key === '720-960') {
      filtersLabels.push('Noon');
    } else if (key === '960-1200') {
      filtersLabels.push('Evening');
    } else if (key === '1200-120') {
      filtersLabels.push('Night');
    } else {
      filtersLabels.push('Midnight');
    }
  }

  return filtersLabels.join(', ');
};
