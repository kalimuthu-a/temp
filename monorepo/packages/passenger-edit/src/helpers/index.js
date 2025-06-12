import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import { PASSENGER_TYPE, PASSENGER_TYPE_NAME, ageLimitUtil, dateFormats, fareTypeList } from '../constants/constants';

/* eslint-disable operator-linebreak */
export const getTypeString = (type) => {
  const str = {
    ADT: 'adult',
    SRCT: 'senior citizen',
    CHD: 'children',
    INFT: 'infant',
  };

  return str[type];
};

export const toCamelCase = (str) => {
  return str.replace(/\s+(\w)/g, (_, c) => c.toUpperCase());
};

export const getDeepCopyOfObjectByStr = (array, key, str) => {
  const objectToCopy = array.find((obj) => obj[key] === str);
  if (objectToCopy) {
    return cloneDeep(objectToCopy);
  }
  return null; // Object not found
};

export const getCountString = (type) => {
  const str = {
    adultCount: 'adult',
    srctCount: 'senior citizen',
    childCount: 'children',
    infantCount: 'infant',
  };

  return str[type];
};

export const getUniqueArray = (obj, arr) => {
  return arr.flatMap((key) => {
    const count = obj[key];
    if (count > 0) {
      return Array.from({ length: count }, () => key);
    }
    return [];
  });
};

export const isObjEmpty = (obj, keysToIgnore) => {
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !keysToIgnore.includes(key) &&
      obj[key]
    ) {
      return false;
    }
  }
  return true;
};

export const isObjFilled = (obj, keysToIgnore) => {
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !keysToIgnore.includes(key) &&
      (!obj[key] || obj[key].toString().trim().length === 0)
    ) {
      return false;
    }
  }
  return true;
};

export const getDayMonthAndYear = (dateString) => {
  if (dateString) {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JavaScript
    const day = parseInt(dateParts[0], 10);
    return { year, month, day };
  }
  return {};
};

export const calculateYearsFromDate = (dateString, travelDate = null) => {
  // Parse the date string into a Date object
  let fromDate = new Date();
  if (travelDate) {
    fromDate = new Date(travelDate);
  }
  if (dateString) {
    const { year, month, day } = getDayMonthAndYear(dateString);
    const givenDate = moment({ year, month, day });

    // Get the current date

    // Calculate the difference in years
    const diffInMilliseconds = fromDate - givenDate;
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Average milliseconds in a year
    const diffInYears = diffInMilliseconds / millisecondsPerYear;

    // Round the difference to get whole years
    return Math.floor(diffInYears);
  }
  return null;
};

export const isOlderThanDays = (dateString, travelDate) => {
  if (!moment(dateString, dateFormats.USER_FRIENDLY_FORMAT, true).isValid()) {
    return null;
  }
  const parsedDate = moment(dateString, dateFormats.USER_FRIENDLY_FORMAT);
  const fromDate = moment(travelDate);
  const daysDifference = fromDate.diff(parsedDate, 'days');
  return daysDifference > ageLimitUtil.INFANT_START_DAYS;
};

export const getPassengerType = (passengerTypeCode, discountCode) => {
  if (
    passengerTypeCode === PASSENGER_TYPE.ADULT &&
    discountCode === PASSENGER_TYPE.SENIOUR
  ) {
    return PASSENGER_TYPE_NAME.SENIOUR;
  }
  if (passengerTypeCode === PASSENGER_TYPE.ADULT && !discountCode) {
    return PASSENGER_TYPE_NAME.ADULT;
  }
  if (passengerTypeCode === PASSENGER_TYPE.CHILD) {
    return PASSENGER_TYPE_NAME.CHILD;
  }
  if (passengerTypeCode === PASSENGER_TYPE.INFANT) {
    return PASSENGER_TYPE_NAME.INFANT;
  }
  return '';
};

export const getPassengerTypeCode = (passengerTypeCode, discountCode) => {
  if (
    passengerTypeCode === PASSENGER_TYPE.ADULT &&
    discountCode === PASSENGER_TYPE.SENIOUR
  ) {
    return PASSENGER_TYPE.SENIOUR;
  }
  if (passengerTypeCode === PASSENGER_TYPE.ADULT && !discountCode) {
    return PASSENGER_TYPE.ADULT;
  }
  if (passengerTypeCode === PASSENGER_TYPE.CHILD) {
    return PASSENGER_TYPE.CHILD;
  }
  if (passengerTypeCode === PASSENGER_TYPE.INFANT) {
    return PASSENGER_TYPE.INFANT;
  }
  return '';
};

export const transformStr = (str) => str.toLowerCase().replace(' ', '');
export const getPaxName = (paxTypeName, paxNumber, name = {}) => {
  const { first = '', middle = '', last = '' } = name || {};
  const isName = !!first;
  const jointName = `${first || ''} ${middle || ''} ${last || ''}`;
  return isName ? jointName : `${paxTypeName} ${paxNumber}`;
};

export const dobFormat = (fieldValue, keyPressed) => {
  const value = [];
  const field = fieldValue.split('');
  if (keyPressed) {
    if (field[2] > 1) field.splice(2, 0, 0);
    field.forEach((digit, index) => {
      if (index === 1 || index === 3) {
        value.push(digit);
        value.push('-');
      } else value.push(digit);
    });

    return value.join('');
  }
  if (!keyPressed) {
    if (field.length === 2) {
      return fieldValue;
    }
    field.forEach((digit, index) => {
      if (index === 1 || (field.length > 4 && index === 3)) {
        value.push(digit);
        value.push('-');
      } else value.push(digit);
    });

    return value?.join('');
  }
  return fieldValue;
};

export const journeyDetailsOriginDestination = (ssrs) => {
  return ssrs?.map((ssr) => {
    const { origin, destination } = ssr.journeydetail;
    return `${origin}-${destination}`;
  }).join('|');
};

export const journeyDetailsAlphabetically = (ssrs) => {
  return ssrs?.map((ssr) => {
    let { origin, destination } = ssr.journeydetail;
    // Ensure the pair is sorted alphabetically
    if (origin > destination) {
      [origin, destination] = [destination, origin];
    }
    return `${origin}-${destination}`;
  }).join('|');
};

export const getCategoryFare = (ssrs) => {
  return ssrs?.map((ssr) => fareTypeList[ssr.productClass]).join('|');
};

// Add 0 at start if number length is smaller than defined length
export const padNumber = (number, length = 2) => {
  return number.toString().padStart(length, '0');
};

export const getPageNameFromUrl = (urlString) => {
  const path = urlString.split('?')[0];
  const fileName = path.split('/').pop();
  return fileName.replace('.html', '').replace('-', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
};

// Function to check if the date string matches the expected format
export const ISOtoUserFriendly = (dateStr) => {
  const isValidDate = moment(dateStr, moment.ISO_8601, true).isValid();
  if (isValidDate) {
    return moment(dateStr).format('DD-MM-YYYY');
  }
  return false;
};

export const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const stripCountryCode = (mobileNumber, countryCode) => {
  const countryCodePattern = new RegExp(`^\\+${countryCode}`);
  return mobileNumber.replace(countryCodePattern, '');
};
