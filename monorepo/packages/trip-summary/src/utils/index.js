import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import {
  BOOKING_WIDGET_CONTXT,
  BROWSER_STORAGE_KEYS,
  EXTRASEAT_TAG,
  PASSENGER_TYPE,
} from '../constants';

export const UTIL_CONSTANTS = {
  DATE_SPACE_DAYDDMMMYYYY: 'DAY,DD MMM YYYY',
  DATE_FLIGHT_SUMMARY: 'dd',
  DATE_SLIDER_FLIGHT_DETAIL_TIME: 'TIME',
  DATE_SLIDER_FLIGHT_DETAIL_DATE: 'DATE_SLIDER_FLIGHT_DETAIL_DATE',
  DATE_HEADER_PNRDEATAILS: 'DD-MM-YYYY',
};

export function getJourneyType(aemData, journeysDetail, index) {
  // TODO: AEM Integration for labels
  let tripType = aemData?.departReturnLabel?.departing || 'Departure Flight';
  if (
    journeysDetail[index]?.journeydetail?.origin
      === journeysDetail[index - 1]?.journeydetail?.destination
    && journeysDetail[index]?.journeydetail?.destination
      === journeysDetail[index - 1]?.journeydetail?.origin
  ) {
    tripType = aemData?.departReturnLabel?.returning || 'Return Flight';
  }
  return tripType;
}

export function getJourneyPriceBreakdown(jKey, journeyList) {
  return journeyList?.filter((item) => item.journeyKey === jKey) || [];
}

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
}

const MONTH_NAMES = [
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
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const convertZuluToSplitted = (date, isUtcRequired) => {
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
    const { dd, mm, yyyy, timehh, timemm, day } = convertZuluToSplitted(
      date,
      isUTCTimeRequired,
    );
    const monthStr = MONTH_NAMES[Number(mm)]
      ? MONTH_NAMES[Number(mm)].slice(0, 3)
      : '';
    const dayStr = DAYS[Number(day)] ? DAYS[Number(day)].slice(0, 3) : '';
    const monthNumber = String(Number(mm) + 1).padStart(2, '0');
    switch (format) {
      case UTIL_CONSTANTS.DATE_SPACE_DAYDDMMMYYYY:
        return `${dayStr}, ${dd} ${monthStr} ${yyyy}`;
      case UTIL_CONSTANTS.DATE_SPACE_MMM:
        return `${dayStr}, ${monthStr} ${dd}`;
      case UTIL_CONSTANTS.DATE_SLIDER_FLIGHT_DETAIL_TIME:
        return `${timehh}:${timemm}`;
      case UTIL_CONSTANTS.DATE_SLIDER_FLIGHT_DETAIL_DATE:
        return `${dayStr}, ${monthStr} ${dd}`;
      case UTIL_CONSTANTS.DATE_HEADER_PNRDEATAILS:
        return `${dd}-${monthNumber}-${yyyy}`;
      default:
        return date;
    }
  } catch (error) {
    return '';
  }
};

export const getTravelTime = (from, to, aem, isShortFormat = false) => {
  const startDate = new Date(from);
  // Do your operations
  const endDate = new Date(to);
  const { hh, mm, days } = dateDiffToString(startDate, endDate);
  let travelHrUpdated = hh;
  if (days > 0) {
    // if we have time difference in days then we have add those to hours count
    travelHrUpdated = Number(travelHrUpdated) + Number(days) * 24;
  }
  if (isShortFormat) {
    travelHrUpdated = travelHrUpdated < 10 ? `0${travelHrUpdated}` : travelHrUpdated;
    const min = mm < 10 ? `0${mm}` : mm;
    return `${travelHrUpdated}h ${min}m`;
  }
  return `${travelHrUpdated} ${aem?.hourLabel || 'Hour'}(s) ${mm} ${
    aem?.minuteLabel || 'min'
  }`;
};

const getEquipmentType = (code, mfAdditionalDataCodeshareList, carrierCode) => {
  const currentEquipmentData = mfAdditionalDataCodeshareList?.find(
    (i) => i?.equipmentType === code && i?.carrierCode === carrierCode,
  );
  return currentEquipmentData?.equipmentTypeLabel || code;
};

export function getFlightListStr(
  journey,
  mfAdditionalDataCodeshareList,
  segIndex = 0,
) {
  const flightListStr = [];
  journey?.segments?.forEach((sItem, sIndex) => {
    const segDetailsIdentifier = sItem?.segmentDetails?.identifier || {};
    if (segDetailsIdentifier && sIndex === segIndex) {
      // we need to show only first flight from multistop
      const equipementype = sItem.legs[0]?.legDetails?.equipmentType;
      const carrierCode = sItem?.externalIdentifier?.carrierCode
        && sItem.legs[0]?.legDetails?.operatingCarrier
        ? sItem?.externalIdentifier?.carrierCode
        : segDetailsIdentifier?.carrierCode;
      const equipCode = equipementype
        && getEquipmentType(
          equipementype,
          mfAdditionalDataCodeshareList,
          carrierCode,
        );
      let temp = `${carrierCode} ${segDetailsIdentifier.identifier}`;

      if (equipCode) {
        temp += `, ${equipCode}`;
      }
      flightListStr.push(temp);
    }
  });
  return flightListStr.join(',');
}
export function getFlightEquipmentAem(
  journey,
  mfAdditionalDataCodeshareList,
  segIndex = 0,
) {
  const equipData = [];
  journey?.segments?.forEach((sItem, sIndex) => {
    const segDetailsIdentifier = sItem?.segmentDetails?.identifier || {};
    if (segDetailsIdentifier && sIndex === segIndex) {
      const equipementype = sItem.legs[0]?.legDetails?.equipmentType;
      const carrierCode = sItem?.externalIdentifier?.carrierCode
        && sItem.legs[0]?.legDetails?.operatingCarrier
        ? sItem?.externalIdentifier?.carrierCode
        : segDetailsIdentifier?.carrierCode;

      const currentEquipmentData = mfAdditionalDataCodeshareList?.find(
        (i) => i?.equipmentType === equipementype && i?.carrierCode === carrierCode,
      );

      equipData.push(currentEquipmentData);
    }
  });
  return equipData[0] || {};
}

export function getBookingContext() {
  return JSON.parse(localStorage.getItem(BOOKING_WIDGET_CONTXT));
}

function getPaxType(pax) {
  const passengerType = pax?.passengerType || pax?.passengerTypeCode;
  const passengerDiscount = pax?.passengerDiscountCode || pax?.discountCode;
  if (passengerType === PASSENGER_TYPE.ADULT) {
    return passengerDiscount === PASSENGER_TYPE.SENIOUR
      ? PASSENGER_TYPE.SENIOUR
      : PASSENGER_TYPE.ADULT;
  }

  if (passengerType === PASSENGER_TYPE.CHILD) {
    return PASSENGER_TYPE.CHILD;
  }
  return null;
}

function getExtraSeat(pax) {
  if (pax.passengerDiscountCode === EXTRASEAT_TAG.DOUBLE) {
    return EXTRASEAT_TAG.DOUBLE;
  }
  if (pax.passengerDiscountCode === EXTRASEAT_TAG.TRIPLE) {
    return EXTRASEAT_TAG.TRIPLE;
  }
  if (pax.discountCode?.toLowerCase() === 'double') {
    return EXTRASEAT_TAG.DOUBLE;
  }
  if (pax.discountCode?.toLowerCase() === 'triple') {
    return EXTRASEAT_TAG.TRIPLE;
  }
  return null;
}

const getPaxExtraSeatInfoFromPaxArr = (paxArray) => {
  const obj = {
    seniorCitizenExtraDoubleSeat: 0,
    seniorCitizenExtraTripleSeat: 0,
    adultExtraDoubleSeat: 0,
    adultExtraTripleSeat: 0,
  };
  paxArray?.forEach((pItem) => {
    if (
      pItem.passengerTypeCode === PASSENGER_TYPE.ADULT
      && pItem.discountCode === PASSENGER_TYPE.SENIOUR
    ) {
      if (pItem.extraSeatTag?.toLowerCase() === 'triple') {
        obj.seniorCitizenExtraTripleSeat += 1;
      } else if (pItem.extraSeatTag?.toLowerCase() === 'double') {
        obj.seniorCitizenExtraDoubleSeat += 1;
      }
    } else if (pItem.passengerTypeCode === PASSENGER_TYPE.ADULT) {
      if (pItem.extraSeatTag?.toLowerCase() === 'triple') {
        obj.adultExtraTripleSeat += 1;
      } else if (pItem.extraSeatTag?.toLowerCase() === 'double') {
        obj.adultExtraDoubleSeat += 1;
      }
    }
  });
  return { seatWiseSelectedPaxInformation: obj };
};

const getPaxAndExtraSeatCountsFromPaxArray = (passengers) => {
  const paxCount = {};
  let infantCount = 0;
  passengers?.forEach((pItem) => {
    const paxType = getPaxType(pItem);
    const extraSeat = getExtraSeat(pItem);
    if (!paxCount[paxType]) {
      paxCount[paxType] = {};
    }
    if (!extraSeat) {
      paxCount[paxType].count = paxCount[paxType].count || 0;
      paxCount[paxType].count += 1;
    }
    const isInfantFoundInPax = pItem?.infant?.name?.first || false;
    if (isInfantFoundInPax) {
      infantCount += 1;
    }
  });

  if (infantCount > 0) {
    paxCount[PASSENGER_TYPE.INFANT] = { count: infantCount };
  }
  const { seatWiseSelectedPaxInformation: bwPax } = getPaxExtraSeatInfoFromPaxArr(passengers) || {};
  if (bwPax?.seniorCitizenExtraDoubleSeat > 0) {
    paxCount[PASSENGER_TYPE.SENIOUR][EXTRASEAT_TAG.DOUBLE] = bwPax?.seniorCitizenExtraDoubleSeat;
  }
  if (bwPax?.seniorCitizenExtraTripleSeat > 0) {
    paxCount[PASSENGER_TYPE.SENIOUR][EXTRASEAT_TAG.TRIPLE] = bwPax?.seniorCitizenExtraTripleSeat;
  }
  if (bwPax?.adultExtraDoubleSeat > 0) {
    paxCount[PASSENGER_TYPE.ADULT][EXTRASEAT_TAG.DOUBLE] = bwPax?.adultExtraDoubleSeat;
  }
  if (bwPax?.adultExtraTripleSeat > 0) {
    paxCount[PASSENGER_TYPE.ADULT][EXTRASEAT_TAG.TRIPLE] = bwPax?.adultExtraTripleSeat;
  }
  return paxCount;
};

export function getPaxAndExtraSeatCounts(apiData) {
  const [{ infantCount, paxFares }] = apiData?.priceBreakdown
    ?.journeywiseList || [{}];
  if (!apiData?.priceBreakdown && apiData?.passengers) {
    return getPaxAndExtraSeatCountsFromPaxArray(apiData.passengers);
  }
  const paxCount = {};
  if (!paxFares) {
    return paxCount;
  }
  paxFares?.forEach((pax) => {
    const paxType = getPaxType(pax);
    const extraSeat = getExtraSeat(pax);
    if (!paxCount[paxType]) {
      paxCount[paxType] = {};
    }
    if (!extraSeat) {
      paxCount[paxType].count = pax.multiplier;
    }
  });

  if (infantCount > 0) {
    paxCount[PASSENGER_TYPE.INFANT] = { count: infantCount };
  }
  const { seatWiseSelectedPaxInformation: bwPax } = getBookingContext() || {};
  if (bwPax?.seniorCitizenExtraDoubleSeat > 0) {
    paxCount[PASSENGER_TYPE.SENIOUR][EXTRASEAT_TAG.DOUBLE] = bwPax?.seniorCitizenExtraDoubleSeat;
  }
  if (bwPax?.seniorCitizenExtraTripleSeat > 0) {
    paxCount[PASSENGER_TYPE.SENIOUR][EXTRASEAT_TAG.TRIPLE] = bwPax?.seniorCitizenExtraTripleSeat;
  }
  if (bwPax?.adultExtraDoubleSeat > 0) {
    paxCount[PASSENGER_TYPE.ADULT][EXTRASEAT_TAG.DOUBLE] = bwPax?.adultExtraDoubleSeat;
  }
  if (bwPax?.adultExtraTripleSeat > 0) {
    paxCount[PASSENGER_TYPE.ADULT][EXTRASEAT_TAG.TRIPLE] = bwPax?.adultExtraTripleSeat;
  }
  return paxCount;
}

export const getFareTypeLabel = (aemData, apiData) => {
  let text = '';
  const specialFareCode = apiData?.bookingDetails?.specialFareCode || '';
  if (specialFareCode) {
    const foundSpecialFareObj = aemData?.specialFaresList.find(
      (i) => i.specialFareCode === specialFareCode,
    ) || {};
    text = foundSpecialFareObj?.specialFareBadge
      || foundSpecialFareObj?.specialFareLabel;
  }
  // TD:OLD CODE
  // const pClass = apiData?.journeysDetail?.[0]?.segments?.[0]?.productClass || '';
  // const fareObj = fareListAem.find((fItem) => fItem?.productClass === pClass) || {};

  const fareListAem = aemData?.fareType || aemData?.fareTypeList || aemData?.fareTypesList || [];

  const pClasses = apiData?.journeysDetail?.map(
    (jDetail) => jDetail.segments[0].productClass || '',
  );
  const fareObj = [];

  pClasses?.forEach((pClass) => {
    fareListAem?.forEach((fListItem) => {
      if (pClass === fListItem.productClass) {
        if (
          fListItem.productClass !== 'BR'
          && fListItem.productClass !== 'BC'
          && text
          && specialFareCode
        ) {
          // eslint-disable-next-line no-param-reassign
          fListItem.fareLabel = text;
        }
        fareObj.push(fListItem);
      }
    });
  });

  // if (!text) {
  //   text = fareObj?.fareLabel || pClass;
  // }
  return [fareObj, text];
};

export function getIsInternational(journey) {
  return journey?.segments?.some((sItem) => sItem?.international) || false;
}

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_review_summary';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    return defaultObj;
  }
};
export const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    return '';
  }
};
