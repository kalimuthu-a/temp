/* eslint-disable implicit-arrow-linebreak */
import { PayWithModes } from 'skyplus-design-system-app/src/functions/globalConstants';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import isSameDay from 'date-fns/isSameDay';

import { ANALTYTICS, COUNTRY_CODE, GTM_ANALTYTICS, dateFormats } from '../constants';
import analyticsEvent from './analyticsEvent';
import gtmPushAnalytic from './gtmEvents';
import { getPaxDetailsforGTM } from './searchResultsUtils';
import pushDDRumAction from './ddrumEvent';

/**
 *
 * @param {string} locale
 * @param {string} currency
 * @returns {string}
 */
export const getCurrencySymbol = (currency, locale = window.locale || 'en') =>
  (0)
    .toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();

/* Calculate distance between 2 places, given their latitude & longitude : START */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
function searchKeys(searchString, data) {
  const lowercasedKeywords = searchString
    .toLowerCase()
    .split(/\s*,\s*|\s+/);

  return data
    .filter((item) => {
      const lowercasedValue = item.value.toLowerCase();
      return lowercasedKeywords.every((keyword) => lowercasedValue.includes(keyword));
    });
}

const findKeyByValue = (searchValue, additional) => {
  const { landmarkMapping, cityMapping } = additional;
  const searchKeysMapping = [...landmarkMapping, ...cityMapping];
  return searchKeys(searchValue, searchKeysMapping);
};

export function getSourceStationFromGeolocation(position, stations) {
  const { latitude, longitude } = position.coords;
  let nearestStation = null;
  try {
    let leastDist = 6371;

    if (stations && latitude && longitude) {
      let currentDist;

      for (const element of stations) {
        if (element.latitude && element.longitude) {
          currentDist = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            element.latitude,
            element.longitude,
          );

          if (currentDist < leastDist) {
            nearestStation = element;
            leastDist = currentDist;
          }
        }
      }
    }

    if (nearestStation && leastDist && leastDist > 0 && leastDist <= 150) {
      return nearestStation;
    }
  } catch (err) {
    // Error handling
  }
  return nearestStation;
}

export function validateBookingForm(formData) {
  const { triptype, journies, nationality } = formData;

  if (triptype.value === TripTypes.MULTI_CITY && journies.length <= 1) {
    return false;
  }

  const cityAndDateNotExist = journies.some((row) => {
    const { destinationCity, sourceCity, departureDate, arrivalDate } = row;

    if (triptype.value === TripTypes.ROUND && !arrivalDate) {
      return true;
    }

    return !destinationCity || !sourceCity || !departureDate;
  });

  if (cityAndDateNotExist) {
    return false;
  }

  if (triptype.value === TripTypes.MULTI_CITY) {
    const isNotUnqiue = journies.some((row, index, all) => {
      const others = [...all.slice(0, index), ...all.slice(index + 1)];

      return others.some((nextRow) => {
        return (
          nextRow &&
          row?.sourceCity?.stationCode === nextRow?.sourceCity?.stationCode &&
          row?.destinationCity?.stationCode ===
            nextRow?.destinationCity?.stationCode &&
          isSameDay(row.departureDate, nextRow.departureDate)
        );
      });
    });

    if (isNotUnqiue) {
      return false;
    }
  }

  const isNationalityRequired = journies.some((row) => {
    const { sourceCity, destinationCity } = row;

    if (triptype.value === TripTypes.ROUND) {
      return (
        destinationCity?.isNationalityPopup ||
        sourceCity?.isNationalityPopup ||
        false
      );
    }

    return sourceCity?.isNationalityPopup || false;
  });

  return !(isNationalityRequired && !nationality.name);
}

export function submitFormHandler({ redirectUrl }) {
  window.location.href = redirectUrl;
}
function getCurrentCountryCode() {
  return localStorage.getItem('currentCountryCode');
}

function setCurrentCountryCode(code) {
  localStorage.setItem('currentCountryCode', code);
}

export function searchAirportCity(value, cities = [], additional = {}, currentCountryCode = '') {
  if (currentCountryCode) {
    setCurrentCountryCode(currentCountryCode);
  }

  const storedCountryCode = getCurrentCountryCode();
  const defaultCountry = COUNTRY_CODE;
  let filteredList = [];
  let popularDestination = [];
  let search = value.trim().toLowerCase();
  search = search.replace(/ *\([^)]*\) */g, '');

  if (!value) {
    return { filteredList: [], popularDestination: cities };
  }

  const keys = findKeyByValue(search, additional);
  if (cities.length) {
    const LandmarkName = keys.map((item) => item.key.toLowerCase());
    filteredList = cities
      .map((item) => {
        const { stationCode, airportName, fullName, countryCode, alternateCityName } = item;

        let priority = 0;
        if (fullName.toLowerCase().startsWith(search)) {
          priority = 1;
        } else if (stationCode.toLowerCase().startsWith(search)) {
          priority = 2;
        } else if (airportName.toLowerCase().startsWith(search)) {
          priority = 3;
        } else if (LandmarkName.includes(stationCode.toLowerCase())) {
          priority = 4;
        } else if (alternateCityName && alternateCityName.toLowerCase().startsWith(search)) {
          priority = 5;
        } else {
          return null;
        }
        if (countryCode === (storedCountryCode || defaultCountry)) {
          priority -= 0.5;
        }
        return { item, priority, countryCode };
      })
      .filter((entry) => entry !== null)
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .map((entry) => entry.item);
    popularDestination = cities;
  }
  return { filteredList, popularDestination };
}

export function analyticpushData(formData, modify, isXplore, isLoyaltyEnabled) {
  const {
    triptype,
    journies,
    travellingFor,
    payWith,
    currency,
    selectedSpecialFare,
    paxInfo,
    promocode,
  } = formData;
  const earnValue = payWith === PayWithModes.CASH ? '1' : '0';
  const burnValue = payWith !== PayWithModes.CASH ? '1' : '0';
  const departureDates = [];
  const airportCodePairs = [];
  const sectors = [];
  let marketTypes = [];
  const daysUntilDeparture = [];

  journies.forEach((journery) => {
    const { departureDate, destinationCity, sourceCity, arrivalDate } =
      journery;
    const sourceAirportCode = sourceCity.stationCode;
    const destinationAirportCode = destinationCity.stationCode;

    daysUntilDeparture.push(
      differenceInCalendarDays(departureDate, new Date()),
    );
    departureDates.push(format(departureDate, dateFormats.ddMMYYYY));
    sectors.push(`${sourceAirportCode}-${destinationAirportCode}`);

    if (sourceAirportCode > destinationAirportCode) {
      airportCodePairs.push(`${destinationAirportCode}-${sourceAirportCode}`);
    } else {
      airportCodePairs.push(`${sourceAirportCode}-${destinationAirportCode}`);
    }

    const isInternational =
      destinationCity.isInternational || sourceCity.isInternational;
    marketTypes.push(isInternational ? 'International' : 'Domestic');

    if (triptype.value === TripTypes.ROUND) {
      daysUntilDeparture.push(
        differenceInCalendarDays(arrivalDate, new Date()),
      );
      departureDates.push(format(arrivalDate, dateFormats.ddMMYYYY));
      sectors.push(`${destinationAirportCode}-${sourceAirportCode}`);
      airportCodePairs.push(airportCodePairs[0]);
      marketTypes = [isInternational ? 'International' : 'Domestic'];
    }
  });

  const { ADT, SRCT, CHD, INFT } = paxInfo;

  const totalPax = ADT.Count + SRCT.Count + CHD.Count;
  const adultPax = ADT.Count;
  const childPax = CHD.Count;
  const infantPax = INFT.Count;
  const seniorPax = SRCT.Count;
  const doubleSeatSelected =
    ADT.ExtraDoubleSeat + SRCT.ExtraDoubleSeat + CHD.ExtraDoubleSeat;
  const tripleSeatSelected =
    ADT.ExtraTripleSeat + SRCT.ExtraTripleSeat + CHD.ExtraTripleSeat;

  function getLoyaltyAnalytics() {
    if (isLoyaltyEnabled) {
      if (modify) {
        return {
          pointsEarned: '',
          pointsBurned: '',
          earn: earnValue,
          burn: burnValue,
        };
      }
      return {
        earn: earnValue,
        burn: burnValue,
      };
    }
    return null;
  }
  function getAdobeLoyaltyDataModify() {
    if (modify && isLoyaltyEnabled) {
      return {
        percentagePointsBurned: '',
      };
    }
    return {};
  }
  function getPayType() {
    if (isLoyaltyEnabled) {
      return {
        payType: payWith,
      };
    }
    return null;
  }
  const adobeAnalytics = {
    tripType: triptype.journeyTypeCode,
    airportCodePair: isXplore
      ? journies[0]?.sourceCity?.stationCode
      : airportCodePairs.join('|'),
    sector: isXplore ? journies[0]?.sourceCity?.stationCode : sectors.join('|'),
    departureDates: departureDates.join('|'),
    daysUntilDeparture: daysUntilDeparture.join('|'),
    currencyCode: currency?.currencyCode || '',
    specialFare: selectedSpecialFare?.specialFareLabel || '',
    totalPax: totalPax.toString(),
    adultPax: adultPax.toString(),
    childPax: childPax.toString(),
    infantPax: infantPax.toString(),
    seniorPax: seniorPax.toString(),
    doubleSeatSelected: doubleSeatSelected.toString(),
    tripleSeatSelected: tripleSeatSelected.toString(),
    bookingPurpose: travellingFor,
    ...getPayType(),
    promotionalCode: promocode ? promocode.card || promocode.code : '',
    marketType: marketTypes.join('|'),
    ...getAdobeLoyaltyDataModify(),
  };

  const loyaltyAnalytics = getLoyaltyAnalytics();

  const gtmAnalytics = {
    pax_details: getPaxDetailsforGTM({
      totalCount: totalPax,
      adultCount: adultPax,
      childrenCount: childPax,
      infantCount: infantPax,
      seniorCitizenCount: seniorPax,
    }),
    departure_date: adobeAnalytics.departureDates,
    special_fare: adobeAnalytics.specialFare,
    currency_code: adobeAnalytics.currencyCode,
    flight_sector: adobeAnalytics.marketType,
    coupon_code: adobeAnalytics.promotionalCode,
    days_until_departure: adobeAnalytics.daysUntilDeparture,
    double_seat_selected: doubleSeatSelected,
    triple_seat_selected: tripleSeatSelected,
    booking_purpose: adobeAnalytics.bookingPurpose,
    booking_mode: adobeAnalytics.bookingMode,
    trip_type: adobeAnalytics.tripType,
    OD: adobeAnalytics.sector,
  };

  const { SEARCH_FLIGHT_CLICK, MODIFY_FLIGHT_CLICK, MODIFY_DEAL } =
    ANALTYTICS.DATA_CAPTURE_EVENTS;
  const { SEARCH_FLIGHT, MODIFY_SEARCH } = GTM_ANALTYTICS.EVENTS;

  if (isXplore) {
    analyticsEvent({
      event: MODIFY_DEAL,
      data: {
        productInfo: adobeAnalytics,
      },
    });
  } else {
    analyticsEvent({
      event: modify ? MODIFY_FLIGHT_CLICK : SEARCH_FLIGHT_CLICK,
      data: {
        productInfo: adobeAnalytics,
        ...(isLoyaltyEnabled ? { points: loyaltyAnalytics } : null),
      },
    });
  }

  // Datadog RUM custom action
  pushDDRumAction('onBWSubmit', adobeAnalytics);

  gtmPushAnalytic({
    event: modify ? MODIFY_SEARCH : SEARCH_FLIGHT,
    data: gtmAnalytics,
  });
}

export const convertToDate = (dateStr) => {
  if (!dateStr) {
    return new Date();
  }

  const dateWithoutTime = dateStr.split('T')?.[0];
  return parse(dateWithoutTime, dateFormats.yyyyMMdd, new Date());
};
