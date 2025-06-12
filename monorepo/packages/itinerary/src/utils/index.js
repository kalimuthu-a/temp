import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';

import { CONSTANTS } from '../constants';
import LocalStorage from './LocalStorage';

const UTIL_CONSTANTS = {
  DATE_SPACE_DDMMMYYYY: 'DD MMM YYYY',
  DATE_SLASH_DDMMYYYY: 'DD/MM/YYYY',
  DATE_HYPHEN_DDMMYYYY: 'DD-MM-YYYY',
  DATE_SLASH_DDMMMYYYY: 'DD/MMM/YYYY',
  DATE_SPACE_DDDMMMYYYYHHMM: 'DDD MMM YYYY HH:MM',
  DATE_SPACE_DDDMMMYYYY: 'DDD MMM YYYY',
  DATE_SPACE_DDDMMM: 'DDD MMM',
  DATE_BOOKEDON: 'DATE_BOOKEDON',
  DATE_BOOKINGDETAILS: 'DATE_BOOKINGDETAILS',
  DATE_BOOKINGDETAILS_PARTNER: 'DATE_BOOKINGDETAILS_PARTNER',
  DATE_SPACE_PRINTHEADER: 'DATE_SPACE_PRINTHEADER',
  DATE_CANCELFLIGHT_POPUP: 'DATE_CANCELFLIGHT_POPUP',
  DATE_CANGEFLIGHT_SRP_PAYLOADIN: 'DATE_CANGEFLIGHT_SRP_PAYLOADIN',
  DATE_HYPHEN_YYYYMMDD: 'YYYY-MM-DD',
  DATE_SPACE_DDMMMMYYYY: 'DD,MM YYYY',
  DATE_SPACE_ONHOLD: 'DATE_SPACE_ONHOLD',
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
function dateDiffToString(a, b, isTimeTwoDigit) {
  // make checks to make sure a and b are not null
  // and that they are date | integers types
  try {
    let diff = Math.abs(new Date(a) - new Date(b));

    let ms = diff % 1000;
    diff = (diff - ms) / 1000;
    let ss = diff % 60;
    diff = (diff - ss) / 60;
    let mm = diff % 60;
    diff = (diff - mm) / 60;
    let hh = diff % 24;
    let days = (diff - hh) / 24;

    if (isTimeTwoDigit) {
      days = days >= 10 ? days : `0${days}`;
      hh = hh >= 10 ? hh : `0${hh}`;
      mm = mm >= 10 ? mm : `0${mm}`;
      ss = ss >= 10 ? ss : `0${ss}`;
      ms = ms >= 10 ? ms : `0${ms}`;
    }

    return { days, hh, mm, ss, ms };
  } catch (e) {
    return {};
  }
}
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const formatDate = (date, format, isUTCTimeRequired) => {
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
      case UTIL_CONSTANTS.DATE_SPACE_ONHOLD:
        return `${timehh}:${timemm}, ${dd} ${fullMonth}, ${yyyy}`;
      default:
        return date;
    }
  } catch (error) {
    return '';
  }
};
const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    return error;
  }
};
const getSessionUserScratchCard = () => {
  try {
    const tokenObj = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.ROLE_DETAILS, true);
    return tokenObj || '';
  } catch (error) {
    return error;
  }
};
export const getSessionUser = () => {
  try {
    const authuser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    if (authuser) {
      authuser.mobileNumber = authuser?.mobileNumber?.replace(/[^0-9]/g, '');
    }
    return authuser.mobileNumber || '';
  } catch (error) {
    return error;
  }
};
const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_itinerary';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    return defaultObj;
  }
};
const isFutureDate = (dateToValidate, todate) => {
  // eg: 21-12-2022
  const today = todate ? new Date(todate).getTime() : new Date().getTime();
  let date = dateToValidate?.split('/');
  date = new Date(date[2], date[1] - 1, date[0]).getTime();
  return today - date < 0;
};

const individualPaxCount = (passengers, paxType) => {
  const paxTypes = {
    adult: { passengerTypeCode: 'ADT', discountCode: null },
    children: { passengerTypeCode: 'CHD', discountCode: null },
    seniorCitizen: { passengerTypeCode: 'ADT', discountCode: 'SRCT' },
    infant: { passengerTypeCode: 'INFT', discountCode: null },
  };

  return passengers?.filter((pax) => pax?.passengerTypeCode === paxTypes[paxType].passengerTypeCode
        && pax?.discountCode === paxTypes[paxType].discountCode).length;
};

const countGender = (passengers) => {
  if (!passengers) {
    return '';
  }
  const count = {
    male: 0,
    female: 0,
  };
  for (const pax of passengers) {
    if (pax?.name?.title?.toUpperCase() === 'MR') {
      count.male += 1;
    }
    if (pax?.name?.title.toUpperCase() === 'MRS' || pax?.name?.title.toUpperCase() === 'MS') {
      count.female += 1;
    }
  }
  return count;
};

const removeQueryParamFromUrl = (paramKeysToRemove = []) => {
  try {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    paramKeysToRemove?.forEach((paramKey) => {
      urlParams.delete(paramKey);
    });
    const newUrl = `${url.origin + url.pathname}?${urlParams.toString()}`;

    // eslint-disable-next-line no-restricted-globals
    history.replaceState({}, document.title, newUrl);
  } catch (error) { /* empty */ }
};

function getHashValue(key) {
  // eslint-disable-next-line space-infix-ops, no-restricted-globals, prefer-template
  const matches = location.hash.match(new RegExp(key+'=([^&]*)'));
  return matches ? matches[1] : null;
}

function getQueryStringByParameterName(name) {
  let out = '';
  const hashes = window.location.search.substring(1).split('&');
  for (let i = 0; i < hashes.length; i += 1) {
    if (hashes[i].startsWith(`${name}=`)) {
      out = hashes[i].replace(`${name}=`, '');
    }
  }
  return out || '';
}

/**
 * @param {{price: number, currencycode?: string}} priceObj
 * @returns {string}
 */
const formatCurrencyFunc = (priceObj) => {
  return formatCurrency(priceObj.price, priceObj.currencycode ?? 'INR', {
    minimumFractionDigits: 0,
  });
};

const getBWCntxtVal = () => {
  return LocalStorage.getAsJson(CONSTANTS.BROWSER_STORAGE_KEYS.CLEAN_KEYS_BOOKING_CONTEXT) || {};
};

const getPaxType = (pax) => {
  if (pax?.passengerTypeCode === CONSTANTS.PASSENGER_TYPE.ADULT) {
    if (pax?.infant) {
      return CONSTANTS.PASSENGER_TYPE.INFANT;
    }
    return pax.passengerDiscountCode === CONSTANTS.PASSENGER_TYPE.SENIOUR
      ? CONSTANTS.PASSENGER_TYPE.SENIOUR
      : CONSTANTS.PASSENGER_TYPE.ADULT;
  }

  if (pax?.passengerTypeCode === CONSTANTS.PASSENGER_TYPE.CHILD) {
    return CONSTANTS.PASSENGER_TYPE.CHILD;
  }
  return null;
};

const getExtraSeat = (pax) => {
  if (pax.passengerDiscountCode === CONSTANTS.EXTRASEAT_TAG.DOUBLE) {
    return CONSTANTS.EXTRASEAT_TAG.DOUBLE;
  }

  if (pax.passengerDiscountCode === CONSTANTS.EXTRASEAT_TAG.TRIPLE) {
    return CONSTANTS.EXTRASEAT_TAG.TRIPLE;
  }
  return null;
};

const getPaxAndExtraSeatCounts = (passengers) => {
  // const [{ infantCount, paxFares }] = apiData?.priceBreakdown?.journeywiseList || [{}];
  const paxCount = {};
  if (passengers?.length === 0) {
    return paxCount;
  }
  passengers?.forEach((pax) => {
    const paxType = getPaxType(pax);
    const extraSeat = getExtraSeat(pax);
    if (!paxCount[paxType]) {
      paxCount[paxType] = {};
    }
    if (extraSeat !== null) {
      paxCount[paxType][extraSeat] = 0;
    }
    paxCount[paxType].count = 0;
    if (extraSeat) {
      paxCount[paxType][extraSeat] += 1;
    } else {
      paxCount[paxType].count += 1;
    }
  });

  // if (infantCount > 0) {
  //   paxCount[CONSTANTS.PASSENGER_TYPE.INFANT] = { count: infantCount };
  // }
  const bwPax = getBWCntxtVal()?.seatWiseSelectedPaxInformation || {};
  if (bwPax?.seniorCitizenExtraDoubleSeat > 0) {
    paxCount[CONSTANTS.PASSENGER_TYPE.SENIOUR][CONSTANTS.EXTRASEAT_TAG.DOUBLE] = bwPax?.seniorCitizenExtraDoubleSeat;
  }
  if (bwPax?.seniorCitizenExtraTripleSeat > 0 && paxCount[CONSTANTS.PASSENGER_TYPE.SENIOUR]
    && paxCount[CONSTANTS.PASSENGER_TYPE.SENIOUR][CONSTANTS.EXTRASEAT_TAG.TRIPLE]) {
    paxCount[CONSTANTS.PASSENGER_TYPE.SENIOUR][CONSTANTS.EXTRASEAT_TAG.TRIPLE] = bwPax?.seniorCitizenExtraTripleSeat;
  }
  if (bwPax?.adultExtraDoubleSeat > 0 && paxCount[CONSTANTS.PASSENGER_TYPE.ADULT]
    && paxCount[CONSTANTS.PASSENGER_TYPE.ADULT][CONSTANTS.EXTRASEAT_TAG.DOUBLE]
  ) {
    paxCount[CONSTANTS.PASSENGER_TYPE.ADULT][CONSTANTS.EXTRASEAT_TAG.DOUBLE] = bwPax?.adultExtraDoubleSeat;
  }
  if (bwPax?.adultExtraTripleSeat > 0 && paxCount[CONSTANTS.PASSENGER_TYPE.ADULT]
    && paxCount[CONSTANTS.PASSENGER_TYPE.ADULT][CONSTANTS.EXTRASEAT_TAG.TRIPLE]
  ) {
    paxCount[CONSTANTS.PASSENGER_TYPE.ADULT][CONSTANTS.EXTRASEAT_TAG.TRIPLE] = bwPax?.adultExtraTripleSeat;
  }
  return paxCount;
};

const getCurrencySymbol = (locale, currency) => (0)
  .toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  .replace(/\d/g, '')
  .trim();

// eslint-disable-next-line sonarjs/cognitive-complexity
const setBwCntxtVal = (maxRecentSearchesCount) => {
  if (!maxRecentSearchesCount?.bookingDetails) {
    return;
  }
  const { bookingDetails, journeysDetail, passengers, lowFareData } = maxRecentSearchesCount || {};
  const journeys = journeysDetail?.length > 1 ? journeysDetail?.filter((journey) => {
    return journey?.journeydetail?.destination === lowFareData?.CityName;
  }) : [journeysDetail?.[0]];
  const paxInfo = passengers?.length > 0 && getPaxAndExtraSeatCounts(passengers);

  const daysUntilDeparture = new Date(journeys?.[0]?.journeydetail?.departure);
  const nextDay = new Date(daysUntilDeparture);
  const returnFlightDate = nextDay.setDate(daysUntilDeparture.getDate() + 1);
  const value = {
    nationality: '', // formData.nationality,
    seatWiseSelectedPaxInformation: {
      adultCount: passengers?.length > 0 ? individualPaxCount(passengers, 'adult') : 0,
      childrenCount: passengers?.length > 0 ? individualPaxCount(passengers, 'children') : 0,
      seniorCitizenCount: passengers?.length > 0 ? individualPaxCount(passengers, 'seniorCitizen') : 0,
      infantCount: passengers?.length > 0 ? individualPaxCount(passengers, 'infant') : 0,
      adultExtraDoubleSeat: paxInfo[CONSTANTS.PASSENGER_TYPE.ADULT]?.[CONSTANTS.EXTRASEAT_TAG.DOUBLE] || 0,
      adultExtraTripleSeat: paxInfo[CONSTANTS.PASSENGER_TYPE.ADULT]?.[CONSTANTS.EXTRASEAT_TAG.TRIPLE] || 0,
      seniorCitizenExtraDoubleSeat: paxInfo[CONSTANTS.PASSENGER_TYPE.SENIOUR]?.[CONSTANTS.EXTRASEAT_TAG.DOUBLE] || 0,
      seniorCitizenExtraTripleSeat: paxInfo[CONSTANTS.PASSENGER_TYPE.SENIOUR]?.[CONSTANTS.EXTRASEAT_TAG.TRIPLE] || 0,
      childrenExtraDoubleSeat: paxInfo[CONSTANTS.PASSENGER_TYPE.CHILD]?.[CONSTANTS.EXTRASEAT_TAG.DOUBLE] || 0,
      childrenExtraTripleSeat: paxInfo[CONSTANTS.PASSENGER_TYPE.CHILD]?.[CONSTANTS.EXTRASEAT_TAG.TRIPLE] || 0,
      totalAllowedCount: 0,
      totalCount: Number(passengers?.length) + Number(individualPaxCount(passengers, 'infant')) || 0,
    },
    selectedCurrency:
    {
      label: getCurrencySymbol(window.locale || 'en', bookingDetails?.currencyCode || 'INR'),
      value: bookingDetails?.currencyCode || 'INR',
    },
    selectedDestinationCityInfo: {
      stationCode: journeys?.[0]?.journeydetail?.origin, // 'MAA',
      inActive: false,
      allowed: true,
      icaoCode: '', // 'VOMM',
      fullName: journeys?.[0]?.journeydetail?.originCityName, // 'Chennai',
      shortName: journeys?.[0]?.journeydetail?.originCityName, // 'Chennai',
      alternateCityName: null,
      macCode: null,
      currencyCode: bookingDetails?.currencyCode, // 'INR',
      currencyName: '', // 'Indian Rupee',
      conversionCurrencyCode: null,
      cultureCode: '', // 'en-GB',
      class: '', // A,
      seoEnabled: true,
      zoneCode: '', // '33',
      countryName: '', // 'India',
      airportName: journeys?.[0]?.journeydetail?.originCityName, // 'Chennai International Airport',
      subZoneCode: '', // '330',
      countryCode: '', // 'IN',
      provinceStateCode: '', // 'TN',
      cityCode: journeys?.[0]?.journeydetail?.origin, // 'MAA',
      timeZoneCode: '', // 'IN',
      isNationalityPopup: false,
      thirdPartyControlled: false,
      customsRequiredForCrew: false,
      weightType: 2,
      destinations: null,
      popularDestination: true,
      showCAPF: false,
      isInternational: false,
      latitude: null,
      longitude: null,
    },
    selectedJourneyType: {
      value: CONSTANTS.PNR_TYPE.ONE_WAY, // oneWay
    },
    selectedPaxInformation: {
      types: [{ type: 'ADT', discountCode: '', count: 1 }],
    },
    selectedPromoInfo: '',
    selectedSourceCityInfo: {
      stationCode: journeys?.[0]?.journeydetail?.destination,
      inActive: false,
      allowed: true,
      icaoCode: '', // 'VIDP',
      fullName: journeys?.[0]?.journeydetail?.destinationCityName,
      shortName: journeys?.[0]?.journeydetail?.destinationCityName,
      alternateCityName: null,
      macCode: null,
      currencyCode: bookingDetails?.currencyCode,
      currencyName: null,
      conversionCurrencyCode: null,
      cultureCode: null,
      class: null,
      seoEnabled: true,
      zoneCode: '', // '33',
      countryName: '', // 'India',
      airportName: journeys?.[0]?.journeydetail?.destinationCityName,
      subZoneCode: null,
      countryCode: null,
      provinceStateCode: '', // 'DL',
      cityCode: journeys?.[0]?.journeydetail?.destination,
      timeZoneCode: null,
      isNationalityPopup: false,
      thirdPartyControlled: false,
      customsRequiredForCrew: false,
      weightType: '',
      destinations: null,
      popularDestination: true,
      showCAPF: false,
      isInternational: false,
      latitude: null,
      longitude: null,
    },
    selectedSpecialFare: null,
    selectedTravelDatesInfo: { startDate: formatDate(
      new Date(returnFlightDate),
      UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD,
    ),
    endDate: null },
    id: uniq(),
  };

  const previousSearches = LocalStorage.getAsJson(
    CONSTANTS.BROWSER_STORAGE_KEYS.RECENT_SEARCHES,
    [],
  );
  previousSearches.unshift(value);
  const recentSearches = previousSearches.slice(0, maxRecentSearchesCount);
  LocalStorage.set(CONSTANTS.BROWSER_STORAGE_KEYS.CLEAN_KEYS_BOOKING_CONTEXT, value);
  LocalStorage.set(CONSTANTS.BROWSER_STORAGE_KEYS.RECENT_SEARCHES, recentSearches);
};

const initChatBox = () => {
  const s6cxiframe = document.getElementById('cx-iframe');
  const s6device = 'cxgpt_device_web';
  if (s6cxiframe) {
    s6cxiframe.style.display = 'none';
    document.querySelector('.contact-us-contact-option-chat')
      ?.addEventListener('click', () => {
        s6cxiframe.style.display = 'block';
        // eslint-disable-next-line no-undef
        hideDiv('1'); hideDiv('2');
        s6cxiframe?.contentWindow.postMessage(`chat_button_click_${s6device}`, '*');
      });
  }
  return null;
};

export const mapDataWithOfferId = (data, offerIds) => {
  if (!offerIds || !data || !Array.isArray(data.partnersBrand)) return [];

  const mappedData = [];

  data.partnersBrand.forEach((brand) => {
    const filteredOffers = brand?.brandOffers?.filter((offer) => offer.offerid === offerIds.toString());

    filteredOffers.forEach((offer) => {
      mappedData.push({
        ...offer,
        partnerId: brand.partnerId,
        partnerName: brand.partnerName,
        unscratchedImage: brand?.defaultUnscratchedImage?._path,
        confettiPath: brand.confettiPath,

      });
    });
  });

  return mappedData;
};

export const hideConfetti = (setShowConfettiFunc, delay = 4000) => {
  setTimeout(() => {
    setShowConfettiFunc(false);
  }, delay);
};
export const mergeStatusIntoOffers = (offers, statuses) => {
  if (!offers || !statuses) {
    return {};
  }
  const filteredOffers = offers.find((offer) => offer.offerid === statuses.offer_id.toString());

  return { ...filteredOffers, ...statuses };
};
export const countPassengers = (passengers) => {
  const counts = {
    adult_male_count: 0,
    adult_female_count: 0,
    seniorcitizen_male_count: 0,
    seniorcitizen_female_count: 0,
    child_boy_count: 0,
    child_girl_count: 0,
    infant_boy_count: 0,
    infant_girl_count: 0,
  };

  if (Array.isArray(passengers)) {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    passengers.forEach((passenger) => {
      const { passengerTypeCode, discountCode, info, infant } = passenger;
      const gender = info?.gender;

      switch (passengerTypeCode) {
        case CONSTANTS.PASSENGER_TYPE.ADULT:
          if (discountCode === CONSTANTS.PASSENGER_TYPE.SENIOUR) {
            if (gender === CONSTANTS.SALUTATION_ADULT[1].gender) {
              counts.seniorcitizen_female_count += 1;
            } else {
              counts.seniorcitizen_male_count += 1;
            }

            if (infant) {
              if (gender === 1) {
                counts.infant_boy_count += 1;
              } else if (gender === 2) {
                counts.infant_girl_count += 1;
              }
            }
          } else if (gender === CONSTANTS.SALUTATION_ADULT[1].gender) {
            counts.adult_female_count += 1;
          } else {
            counts.adult_male_count += 1;
          }
          if (infant) {
            if (gender === 1) {
              counts.infant_boy_count += 1;
            } else if (gender === 2) {
              counts.infant_girl_count += 1;
            }
          }
          break;
        case CONSTANTS.PASSENGER_TYPE.CHILD:
          if (gender === CONSTANTS.SALUTATION_ADULT[1].gender) {
            counts.child_girl_count += 1;
          } else {
            counts.child_boy_count += 1;
          }
          break;
        default:
          break;
      }
    });
  }

  return counts;
};

const convertNumberWithCommaSep = (number) => {
  try {
    return Number(number).toLocaleString();
  } catch (error) {
    return number;
  }
};

export {
  convertZuluToSplitted,
  dateDiffToString,
  formatDate,
  UTIL_CONSTANTS,
  getSessionToken,
  getEnvObj,
  isFutureDate,
  individualPaxCount,
  countGender,
  removeQueryParamFromUrl,
  getHashValue,
  getQueryStringByParameterName,
  formatCurrencyFunc,
  setBwCntxtVal,
  getBWCntxtVal,
  initChatBox,
  getSessionUserScratchCard,
  convertNumberWithCommaSep,
};
