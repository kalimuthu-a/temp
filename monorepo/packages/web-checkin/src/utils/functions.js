import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import sub from 'date-fns/sub';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { COOKIE_KEYS, DATE_CONSTANTS, PAX_SHORT_NAME } from '../constants';

const { monthNames, days, UTIL_CONSTANTS } = DATE_CONSTANTS;

export const cityWithTerminal = (city, terminal) => {
  return terminal ? `${city}, T${terminal}` : city;
};

/**
 *
 * @param {import("../../types").PassengerDetails} passenger
 * @returns {string}
 */
export const getPassengerName = (passenger) => {
  const {
    title = '',
    first = '',
    middle = '',
    last = '',
  } = passenger.name ?? { name: {} };
  return [title, first, middle, last].filter(Boolean).join(' ');
};

export const getFlightName = (identifier) => {
  return `${identifier.carrierCode} ${identifier.identifier}`;
};

export const flightDurationFormatter = (start, end) => {
  const formatDistanceLocale = {
    xMinutes: '{{count}}m',
    xHours: '{{count}}h',
    xDays: '{{count}}d',
  };
  const shortEnLocale = {
    formatDistance: (token, count) => {
      return formatDistanceLocale[token].replace(
        '{{count}}',
        String(count).padStart(2, '0'),
      );
    },
  };

  return formatDuration(intervalToDuration({ start, end }), {
    locale: shortEnLocale,
    format: ['days', 'hours', 'minutes'],
  });
};

/**
 *
 * @param {Array<*>} segments
 * @returns {string}
 */
export const getStopString = (segments) => {
  return segments.length > 1 ? `${segments.length - 1} Stop` : 'NonStop';
};

/**
 *
 * @param {string} date
 * @returns {string}
 */
export const checkInClosesTime = (date) => {
  return sub(new Date(date), { hours: 1, minutes: 30 });
};

/**
 *
 * @param {string} date
 * @returns {string}
 */
export const getPassengerSegmentInfo = (segment) => {
  if (segment.length < 1) return '';
  const firstSegment = segment[0];
  const lastSegment = segment[segment.length - 1];

  const { origin } = firstSegment.designator;
  const { destination } = lastSegment.designator;

  return `${origin} - ${destination}`;
};

export const getPaxTitle = (aemPaxDetails, passenger) => {
  const { passengerTypeCode, discountCode } = passenger;
  const paxDetail = aemPaxDetails.find((pax) => {
    return (
      pax.typeCode === passengerTypeCode && pax.discountCode === discountCode
    );
  });

  const gender = passenger?.info?.gender === 1 ? 'Male' : 'Female';

  return passengerTypeCode === PAX_SHORT_NAME.INFT ? passenger?.subTitle : `${gender} | ${paxDetail?.paxLabel}` ?? '';
};

export const isAdult = (passenger) => {
  const { passengerTypeCode, discountCode } = passenger;
  return passengerTypeCode === paxCodes.adult.code && discountCode === null;
};

export const isSeniorCitizen = (passenger) => {
  const { passengerTypeCode, discountCode } = passenger;
  return (
    passengerTypeCode === paxCodes.seniorCitizen.code &&
    discountCode === paxCodes.seniorCitizen.discountCode
  );
};

export const isChildren = (passenger) => {
  const { passengerTypeCode } = passenger;
  return passengerTypeCode === paxCodes.children.code;
};

export const isInfant = (passenger) => {
  const {passengerTypeCode} = passenger;
  return passengerTypeCode === paxCodes.infant.code;
}

export const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(COOKIE_KEYS.AUTH, true);
    return tokenObj.token || '';
  } catch (error) {
    return error;
  }
};

const convertZuluToSplitted = (date, isUtcRequired) => {
  const dateOut = new Date(date);
  try {
    const obj = {
      dd: isUtcRequired ? dateOut.getUTCDate() : dateOut.getDate(),
      mm: isUtcRequired ? dateOut.getUTCMonth() : dateOut.getMonth(),
      yyyy: isUtcRequired ? dateOut.getUTCFullYear() : dateOut.getFullYear(),
      timehh: isUtcRequired ? dateOut.getUTCHours() : dateOut.getHours(),
      timemm: isUtcRequired ? dateOut.getUTCMinutes() : dateOut.getMinutes(),
      timesec: isUtcRequired ? dateOut.getUTCSeconds() : dateOut.getSeconds(),
      day: isUtcRequired ? dateOut.getUTCDay() : dateOut.getDay(),
      yy: ((isUtcRequired ? dateOut.getUTCFullYear() : dateOut.getFullYear()) % 100)?.toString()?.padStart(2, '0'),
    };
    obj.dd = obj.dd >= 10 ? obj.dd : `0${obj.dd}`;
    obj.mm = obj.mm >= 10 ? obj.mm : `0${obj.mm}`;
    obj.timehh = obj.timehh >= 10 ? obj.timehh : `0${obj.timehh}`;
    obj.timemm = obj.timemm >= 10 ? obj.timemm : `0${obj.timemm}`;
    obj.timesec = obj.timesec >= 10 ? obj.timesec : `0${obj.timesec}`;
    return { ...obj };
  } catch (error) {
    return {};
  }
};

export const formatDate = (date, format, isUTCTimeRequired) => {
  try {
    const { dd, mm, yyyy, yy, timehh, timemm, day, timesec } = convertZuluToSplitted(
      date,
      isUTCTimeRequired,
    );
    const monthStr = monthNames[Number(mm)]
      ? monthNames[Number(mm)].slice(0, 3)
      : '';
    const monthNumber = String(Number(mm) + 1).padStart(2, '0');
    const dayStr = days[Number(day)] ? days[Number(day)].slice(0, 3) : '';
    switch (format) {
      case UTIL_CONSTANTS.DATE_SLASH_DDMMYYYY:
        return `${dd}/${monthNumber}/${yyyy}`;
      case UTIL_CONSTANTS.DATE_SLASH_DDMMMYYYY:
        return `${dd}/${monthStr}/${yyyy}`;
      case UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY:
        return `${dd}-${monthNumber}-${yyyy}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY:
        return `${dd} ${monthStr} ${yyyy}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDDMMMYYYYHHMM:
        return `${dayStr}, ${dd} ${monthStr} ${yyyy} ${timehh}:${timemm}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDDMMMYYYY:
        return `${dayStr}, ${dd} ${monthStr} ${yyyy}`;
      case UTIL_CONSTANTS.DATE_BOOKEDON:
        return `${dd} ${monthStr} ${yyyy} ${timehh}:${timemm}`;
      case UTIL_CONSTANTS.DATE_BOOKINGDETAILS:
        return `${dd} ${monthStr} ${yyyy} at ${timehh}:${timemm} hours`;
      case UTIL_CONSTANTS.DATE_BOOKINGDETAILS_PARTNER:
        return `${dd} ${monthStr} ${yyyy}`;
      case UTIL_CONSTANTS.DATE_BOOKINGDETAILS_SUCCESS:
        return `${dd} ${monthStr} `;
      case UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER:
        return `${dd} ${monthStr} ${yyyy} ${timehh}:${timemm}`;
      case UTIL_CONSTANTS.DATE_CANCELFLIGHT_POPUP:
        return `${yyyy}-${monthNumber}-${dd} ${timehh}:${timemm}:${timesec}`;
      case UTIL_CONSTANTS.DATE_CANGEFLIGHT_SRP_PAYLOADIN:
        return `${yyyy}-${monthNumber}-${dd}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDDMMM:
        return `${dayStr}, ${dd} ${monthStr}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDMMMMYYYY:
        return `${dd} ${monthStr}, ${yy}`;
      case UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD:
        return `${yyyy}-${monthNumber}-${dd}`;
      default:
        return date;
    }
  } catch (error) {
    return '';
  }
};
