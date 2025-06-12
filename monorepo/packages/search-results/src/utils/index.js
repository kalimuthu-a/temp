import { formatDuration, intervalToDuration } from 'date-fns';
import parse from 'date-fns/parse';

import { dateFormats, LOYALTY_FLOWS, DEFAULT_TIER } from '../constants';

/**
 *
 * @description A utility function to convert placeholder into values within string
 *
 * @example
 * formattedMessage("{name} and age is {age}" , {name: "Name", age: 1000})
 *
 * @param {string} rawString
 * @param {{[key: string]: string}} value
 * @returns {string}
 */
export const formattedMessage = (rawString, value) => {
  const entries = Object.entries(value);
  let outputString = rawString;
  entries.forEach(([key, v]) => {
    const find = `{${key}}`;
    const regExp = new RegExp(find, 'g');
    outputString = outputString.replace(regExp, v);
  });
  return outputString;
};

/**
 *
 * Currency Formatter Function
 *
 * @param {number|bigint} amountToFormat
 * @param {Intl.NumberFormatOptions} intlOptions
 * @param {string} currency
 * @param {string} locale
 * @returns {string}
 */
export const formatCurrency = function (
  amountToFormat,
  currency = 'INR',
  intlOptions = {
    minimumFractionDigits: 0,
  },
  locale = 'en-IN',
) {
  const options = {
    style: 'currency',
    currency: currency ?? 'INR',
    ...intlOptions,
  };

  const formatter = new Intl.NumberFormat(locale, options);

  return formatter.format(amountToFormat);
};

export const flightDurationFormatter = (
  start,
  end,
  formatDistanceLocale = {
    xMinutes: '{{count}}m',
    xHours: '{{count}}h',
    xDays: '{{count}}d',
  },
) => {
  const shortEnLocale = {
    formatDistance: (token, count) =>
      formatDistanceLocale[token].replace(
        '{{count}}',
        String(count).padStart(2, '0'),
      ),
  };

  return formatDuration(intervalToDuration({ start, end }), {
    locale: shortEnLocale,
    format: ['days', 'hours', 'minutes'],
  });
};

export const flightDurationFormatterUnits = (start, end) => {
  const interval = intervalToDuration({ start, end });

  return formattedMessage('{DD}{HH}:{II}:{SS}', {
    DD: interval.days ? `${String(interval.days).padStart(2, '0')}:` : '',
    HH: interval.hours ? String(interval.hours).padStart(2, '0') : '00',
    II: interval.minutes ? String(interval.minutes).padStart(2, '0') : '00',
    SS: interval.seconds ? String(interval.seconds).padStart(2, '0') : '00',
  });
};

export const getCityName = (cityObj) => {
  return cityObj ? cityObj.city || cityObj.fullName || cityObj.shortName : '';
};

/**
 *
 * @param {*} segment
 * @param {import("../models/AEMAdditional")} additionalData
 * @returns
 */
export const getDynamicFlightIdentifier = (segment, additionalData) => {
  const equipmentType = segment?.identifier?.equipmentType;

  const carrierCode =
    segment?.externalIdentifier?.carrierCode &&
    segment?.legs?.[0]?.legInfo?.operatingCarrier
      ? segment?.externalIdentifier?.carrierCode
      : segment?.identifier?.carrierCode;

  return additionalData.codeShareIcon({ equipmentType, carrierCode });
};

export const convertToDate = (dateStr) => {
  if (!dateStr) {
    return new Date();
  }

  if (dateStr instanceof Date) {
    return dateStr;
  }

  const dateWithoutTime = dateStr?.split('T')?.[0];
  return parse(dateWithoutTime, dateFormats.yyyyMMdd, new Date());
};

export const isLoyalty = () => !(window.disableLoyalty ?? true);

export const isBurn = (payWith) => payWith?.toLowerCase?.() !== LOYALTY_FLOWS.cash;

export const formatPoints = function (
  points = 0,
  locale = 'en-IN',
  intlOptions = {
    minimumFractionDigits: 0,
  },
) {
    const formatter = new Intl.NumberFormat(locale, intlOptions);

    return points ? formatter.format(points) : points;
};

// loyalty points based on tier
export const getPotentialLoyaltyPoints = (potentialPoints, authUser) => {
  if (!potentialPoints) return null;

  const tier = authUser?.loyaltyMemberInfo?.tier?.trim?.() || DEFAULT_TIER;
  const points = potentialPoints?.[tier];
  if (!points) return null;

  let totalPoints = Number(points);

  const bonusPoints = potentialPoints?.[`${tier}Bonus`];
  if (bonusPoints) totalPoints += Number(bonusPoints);

  return totalPoints;
 };

//  initial loyalty analytics data structure
 export const getLoyaltyAnalyticsData = (payWith) => {
  const _isBurn = isBurn(payWith);

  return {
    loyalty: {
      earn: !_isBurn ? '1' : '0',
      burn: _isBurn ? '1' : '0',
      pointsEarned: '',
      pointsBurned: '',
    },

    productInfo: {
      payType: payWith,
      percentagePointsBurned: '',
    },
  };
 };
