import { Cookies } from 'react-cookie';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import get from 'lodash/get';
import moment from 'moment';
// eslint-disable-next-line import/no-cycle
import eventService from '../services/event.service';
import { CONSTANTS, paxCodes, ssrType, tripType } from '../constants/index';

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_addon';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    return defaultObj;
  }
};

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
  let rawStr = rawString;
  const entries = Object.entries(value);
  entries.forEach(([key, val]) => {
    const find = `{${key}}`;
    const regExp = new RegExp(find, 'g');
    rawStr = rawStr.replace(regExp, val);
  });
  return rawStr;
};

/**
 *
 * @param {Array<*>} getTrips
 * @returns {Boolean}
 */
export const isInternationlFlightSearch = (getTrips) => {
  return getTrips.some((journey) => {
    const { segments } = journey;
    return segments.some((segment) => {
      const { journeyType } = segment;
      return journeyType === tripType.international;
    });
  });
};

/**
 *
 * @param {number} start
 * @param {number} end
 * @param {boolean} reverse
 * @returns {Array<number>}
 */
export const generateNumbers = (start, end, reverse = false) => {
  const dateArr = [];
  for (let i = start; i <= end; i += 1) {
    dateArr.push(i);
  }
  return reverse ? dateArr.reverse() : dateArr;
};

export const parseDataOfBirth = (date) => {
  const d = new Date(date);

  return {
    mm: String(d.getMonth() + 1),
    yy: d.getFullYear().toString(),
    dd: d.getDate().toString(),
  };
};

/**
 *
 * Based on [bw_cntxt_val] localStorage key it will itentify wheather is a multicity flight search
 *
 * @returns {Boolean}
 */
export const isMulticityFlightSearch = (journeyList) => {
  if (journeyList.length < 2) {
    return false;
  }

  return !(
    journeyList.length === 2 &&
    journeyList[0]?.journeydetail?.destination ===
      journeyList[1]?.journeydetail?.origin
  );
};

/**
 *
 * Function to get updated `removedAddonSsr` context if Addon remove
 *
 * @param {import("../../types/context").RemovedAddonSSR[]} removedAddonSsr
 * @param {string[]} ssrCategories
 * @param {{ssr?: {journeySSRs: {category: string, takenssr:
 * {takenCount: number, passengerKey: string, ssrKey: string, canBeRemoved: boolean}[]}[]}[]}} getAddonData
 * @param {number} tripIndex
 * @param {import("../../types").PassengerDetails[]} passengers
 *
 * @returns {import("../../types/context").RemovedAddonSSR[]}
 */
export const getRemoveAddonSsrContext = (
  removedAddonSsr,
  ssrCategories,
  getAddonData,
  tripIndex,
  passengers,
) => {
  const passengerKeys = passengers.map((item) => item.passengerKey);
  const ssr = getAddonData?.ssr?.[tripIndex];
  if (!ssr) {
    return removedAddonSsr;
  }

  const { journeySSRs } = ssr;

  ssrCategories.forEach((ssrCategory) => {
    const ssrJourneyCategory = journeySSRs.find(
      (row) => row.category === ssrCategory,
    );

    if (ssrJourneyCategory) {
      for (const passengerKey of passengerKeys) {
        const takenSsr = ssrJourneyCategory?.takenssr?.find(
          (row) => row.passengerKey === passengerKey,
        );
        if (takenSsr && takenSsr?.canBeRemoved) {
          removedAddonSsr.push({
            passengerKey,
            ssrKey: takenSsr?.ssrKey,
            categoryBundleCode: ssrCategory,
          });
        }
      }
    }
  });

  return removedAddonSsr;
};

/**
 * @param {{price: number, currencycode?: string}} priceObj
 * @returns {string}
 */
export const formatCurrencyFunc = (priceObj) => {
  return formatCurrency(priceObj.price, priceObj.currencycode ?? 'INR', {
    minimumFractionDigits: 0,
  });
};

export const formatPoints = (
  points = 0,
  locale = 'en-IN',
  intlOptions = {
    minimumFractionDigits: 0,
  },
) => {
  const formatter = new Intl.NumberFormat(locale, intlOptions);

  return points ? formatter.format(points) : points;
};

/**
 * @returns {void}
 */
export const emptyFn = () => {
  // This is intentional
};

export const updateSelectedAddonData = (
  tripIndex,
  setGetSelectedAddon,
  addonData,
  addonKeyDataList,
  dispatch,
  addonActions,
) => {
  let selectedAddonData = [];
  const setGetSelectedAddons = setGetSelectedAddon;
  if (
    setGetSelectedAddons &&
    setGetSelectedAddons[tripIndex] &&
    setGetSelectedAddons[tripIndex].selectedAddone.length > 0
  ) {
    selectedAddonData = { ...setGetSelectedAddons };
    setGetSelectedAddons[tripIndex].selectedAddone = setGetSelectedAddons[
      tripIndex
    ].selectedAddone.filter(
      (addonItem) => addonItem?.addonName !== addonData?.title,
    );

    addonKeyDataList.forEach((keyObj) => {
      selectedAddonData[tripIndex].selectedAddone.push(keyObj);
    });
  } else {
    selectedAddonData = { ...setGetSelectedAddons };
    if (!selectedAddonData[tripIndex]) {
      selectedAddonData[tripIndex] = [];
    }
    if (!selectedAddonData[tripIndex].selectedAddone) {
      selectedAddonData[tripIndex].selectedAddone = [];
    }

    addonKeyDataList.forEach((keyObj) => {
      selectedAddonData[tripIndex].selectedAddone.push(keyObj);
    });
  }

  dispatch({
    type: addonActions.SET_GET_SELECTED_ADDON,
    payload: selectedAddonData,
  });
};

/**
 *
 * @example
 * import {newAddonData} from "../utils"
 *
 * let newData = newAddonData(setGetSelectedAddon,
 *  ["BRB"] , [0,1,2], [{passengerKey: "" , addonName: "Excess Baggage"}])
 *
 * @param {Array<*>} setGetSelectedAddon
 * @param {Array<string>} ssrCategories
 * @param {Array<number|string>} tripIndexs
 * @param {Array<*>} newData
 * @param {Array<string>} passengerKeys
 * @returns {Array<*>}
 */
export const newAddonData = (
  setGetSelectedAddon,
  ssrCategories,
  tripIndexs,
  newData = [],
  passengerKeys = [],
) => {
  const data = setGetSelectedAddon;

  for (const key of tripIndexs) {
    if (!data[key]) {
      data[key] = [];
      data[key].selectedAddone = [];
    }

    // Removing previous all data related to ssrCategories
    data[key].selectedAddone = setGetSelectedAddon[key].selectedAddone.filter(
      (item) => {
        const passFilter =
          passengerKeys.length > 0 &&
          !passengerKeys.includes(item.passengerKey);
        return passFilter ? true : !ssrCategories.includes(item.addonName);
      },
    );

    newData.forEach((row) => {
      eventService.add(row);
      data[key].selectedAddone.push(row);
    });
  }

  return data;
};

/**
 *
 * @param {import("../../types").PassengerDetails[]} passengerDetails
 * @returns {boolean}
 */
export const ifAbove70Years = (passengerDetails) => {
  return passengerDetails.some((passenger) => {
    const today = moment();
    const age = get(passenger, ['info', 'dateOfBirth'], undefined);
    return today.diff(age, 'years') >= 70;
  });
};

/**
 *
 * @param {string} passengerKey
 * @param {string} addonName
 * @param {string} journeyKey
 * @returns {{addOnCanbeRemoved: boolean, isSuper6Efare: boolean}}
 */
export const addonCanRemove = (passengerKey, addonName, journeyKey) => {
  const obj = { addOnCanbeRemoved: false, isSuper6Efare: false };
  const ssr = eventService.findOneSSr({
    passengerKey,
    addonName,
    journeyKey,
  });

  if (ssr) {
    obj.isSuper6Efare = true;
    obj.addOnCanbeRemoved = ssr.canBeRemoved ?? true;
  }

  return obj;
};

export const removeSpacesAndToLowerCase = (str) => {
  let stringLiteral = str;
  if (!stringLiteral) return '';
  stringLiteral = stringLiteral.replace(/\s/g, '');
  return stringLiteral.toLowerCase();
};

export const getSsrObj = (
  addonSsrData,
  getAddonData,
  ssrTypeValue,
  ssrCategory,
  addonName,
) => {
  const ssrObjList = [];

  if (ssrTypeValue === ssrType.journey) {
    getAddonData?.ssr?.forEach((tripSsr) => {
      const journeySSRItem = tripSsr.journeySSRs.filter(
        (ssr) => ssr.category === ssrCategory,
      );

      journeySSRItem[0]?.ssrs?.forEach((ssrItem) => {
        ssrItem?.passengersSSRKey.forEach((paxItem) => {
          addonSsrData?.forEach((addonSsrItem) => {
            if (addonSsrItem?.ssrKey === paxItem?.ssrKey) {
              const ssrObj = {
                addonName,
                passengerKey: paxItem?.passengerKey,
                multiplier: addonSsrItem?.count || 1,
                ssrCode: ssrItem?.ssrCode,
                price: ssrItem?.price,
                journeyKey: tripSsr?.journeyKey,
                name: ssrItem?.name,
                category: journeySSRItem[0]?.category,
                segmentKey: '',
                earnPoints: ssrItem?.potentialPoints || 0,
                discountPercentage: ssrItem?.discountper || 0,
                originalPrice: ssrItem?.originalPrice || 0,
                action: 'add',
              };
              ssrObjList.push(ssrObj);
            }
          });
        });
      });
    });
  } else if (ssrTypeValue === ssrType.segment) {
    getAddonData?.ssr?.forEach((tripSsr) => {
      tripSsr?.segments.forEach((segment) => {
        const segmentSSRItem = segment.segmentSSRs.filter(
          (ssr) => ssr.category === ssrCategory,
        );

        segmentSSRItem[0]?.ssrs?.forEach((ssrItem) => {
          ssrItem?.passengersSSRKey.forEach((paxItem) => {
            addonSsrData?.forEach((addonSsrItem) => {
              if (addonSsrItem?.ssrKey === paxItem?.ssrKey) {
                const ssrObj = {
                  addonName,
                  passengerKey: paxItem?.passengerKey,
                  multiplier: addonSsrItem?.count || 1,
                  ssrCode: ssrItem?.ssrCode,
                  price: ssrItem?.price,
                  journeyKey: tripSsr?.journeyKey,
                  name: ssrItem?.name,
                  category: segmentSSRItem[0]?.category,
                  segmentKey: segment?.segmentKey,
                  action: 'add',
                };
                ssrObjList.push(ssrObj);
              }
            });
          });
        });
      });
    });
  }
  return ssrObjList;
};

/**
 *
 * @param {Array<import("../../types").PassengerDetails>} passengers
 * @returns {boolean}
 */
export function isUnaccompaniedMinorSearch(passengers = []) {
  const typeCodeList = new Set();
  passengers?.forEach((element) => {
    typeCodeList.add(element.passengerTypeCode);
  });

  // taking all the passengerType and checking only CHD passenger there

  return typeCodeList.size === 1 && typeCodeList.has(paxCodes.children.code);
}

const getSessionToken = () => {
  try {
    const cookie = new Cookies();
    const tokenObj = cookie.get(CONSTANTS.BROWSER_STORAGE_KEYS.TOKEN);
    return tokenObj.token || '';
  } catch (err) {
    return '';
  }
};

/**
 * @param {string} refUrl
 * @param {boolean} paymentRequired
 * @returns {void}
 */
export const makePaymentRequiredFlow = (refUrl, paymentRequired) => {
  if (paymentRequired) {
    const token = getSessionToken();
    const dataToPass = { from: 'Addon Quick Checkin', token, refUrl };
    const event = new CustomEvent(CONSTANTS.EVENT_INITIATE_PAYMENT, {
      bubbles: true,
      detail: dataToPass,
    });
    document.dispatchEvent(event);
  } else {
    window.location.href = refUrl;
  }
};

export const getTripCode = (addonData) => {
  if (addonData) {
    let tripCode = '';
    addonData.ssr.forEach((ssr, index) => {
      const { origin, destination } = ssr.journeydetail;
      if (origin < destination) {
        tripCode += `${origin}-${destination}`;
      } else {
        tripCode += `${destination}-${origin}`;
      }

      if (index < addonData.ssr.length - 1) {
        tripCode += '|';
      }
    });
    return tripCode;
  }
  return null;
};

export function getOD(ssr) {
  let originDest = '';
  ssr.forEach((obj, index) => {
    const { origin, destination } = obj.journeydetail || {};
    originDest += `${origin}-${destination}`;

    if (index < ssr.length - 1) originDest += '|';
  });
  return originDest;
}

export const getDepartureDates = (ssr) => {
  let departureDates = '';
  ssr.forEach((ssrObj, index) => {
    const { segments } = ssrObj || {};
    segments.forEach((segment, i) => {
      const { segmentDetails } = segment || {};
      departureDates += moment(segmentDetails?.departure).format('DD-MM-YYYY');
      if (i < segments.length - 1) departureDates += '~';
    });
    if (index < ssr.length - 1) departureDates += '|';
  });
  return departureDates;
};

/* TD: old code
export function dateDiffToString(a, b, isTimeTwoDigit) {
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
} */

export function dateDiffToString(ssr) {
  let datDiff = '';
  ssr.forEach((ssrData, index) => {
    const { segments } = ssrData || {};
    segments.forEach((segment, segmentIndex) => {
      const { segmentDetails } = segment || {};
      const today = new Date();
      const departureDate = new Date(segmentDetails?.departure.split('T')[0]);
      const differenceInTime = departureDate.getTime() - today.getTime();
      const differenceInDays = Math.round(
        differenceInTime / (1000 * 3600 * 24),
      );
      datDiff += differenceInDays;
      if (segmentIndex < segments.length - 1) datDiff += '~';
    });
    if (index < ssr.length - 1) datDiff += '|';
  });
  return datDiff;
}

export const calculateYearsFromDate = (year, month, day, arrivalDate) => {
  // Parse the date string into a Date object
  if (year && month && day) {
    const givenDate = new Date(year, month - 1, day);

    // Get the current date
    const currentDate = new Date(arrivalDate);
    // currentDate.setHours(0, 0, 0, 0);

    // Calculate the difference in years
    const diffInMilliseconds = currentDate - givenDate;
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Average milliseconds in a year
    const diffInYears = diffInMilliseconds / millisecondsPerYear;

    // Round the difference to get whole years
    return Math.floor(diffInYears);
  }
  return null;
};

export function getFlightTime(ssr) {
  let flightTime = '';
  ssr.forEach((ssrObj, index) => {
    const { segments } = ssrObj || {};
    segments.forEach((segment, segmentIndex) => {
      const { arrival, departure } = segment?.segmentDetails || {};
      const arrivalDate = new Date(arrival);
      const departureDate = new Date(departure);
      flightTime += `${departureDate.getHours()}:${departureDate.getMinutes()}-${arrivalDate.getHours()}:${arrivalDate.getMinutes()}`;
      if (segmentIndex < segments.length - 1) flightTime += '~';
    });
    if (index < ssr.length - 1) flightTime += '|';
  });
  return flightTime;
}

export function getFlightNumber(ssr) {
  let flightNumber = '';
  ssr.forEach((ssrObj, index) => {
    const { segments } = ssrObj || {};
    segments.forEach((segment, i) => {
      const { carrierCode, identifier } =
        segment.segmentDetails.identifier || {};
      flightNumber += `${carrierCode} ${identifier}`;

      if (i < segments.length - 1) flightNumber += '~';
    });
    if (index < ssr.length - 1) flightNumber += '|';
  });
  return flightNumber;
}

export function getPaxDetailsforGTM(seatWiseSelectedPaxInformation) {
  const {
    totalCount,
    adultCount,
    childrenCount,
    infantCount,
    seniorCitizenCount,
  } = seatWiseSelectedPaxInformation;
  const values = [totalCount];

  if (seniorCitizenCount > 0) {
    values.push(`${seniorCitizenCount} SS`);
  }
  if (adultCount > 0) {
    values.push(`${adultCount} ADT`);
  }
  if (childrenCount > 0) {
    values.push(`${childrenCount} CHD`);
  }
  if (infantCount > 0) {
    values.push(`${infantCount} INF`);
  }

  return values.join('|');
}
