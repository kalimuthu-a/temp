import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { BROWSER_STORAGE_KEYS } from '../constants';

export function getJourneyType(aemData, journeysDetail, index) {
  // TODO: AEM Integration for label
  let tripType = aemData?.flightLabel?.departing || 'Departure Flight';
  if (journeysDetail[index]?.journeydetail?.origin === journeysDetail[index - 1]?.journeydetail?.destination
    && journeysDetail[index]?.journeydetail?.destination === journeysDetail[index - 1]?.journeydetail?.origin) {
    tripType = aemData?.flightLabel?.returning || 'Return Flight';
  }
  return tripType;
}

export function getJourneyPriceBreakdown(jKey, journeyList) {
  return journeyList?.filter((item) => item.journeyKey === jKey);
}

export function getFeeForCode(feeCode, feeCodeMapping) {
  const [data] = feeCodeMapping?.filter((item) => item.feeCode === feeCode) || [];
  return data?.name;
}

export function getIsInternational(apiData) {
  return apiData?.journeysDetail?.some((jItem) => jItem?.segments?.some((sItem) => sItem?.international)) || false;
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



export function deepCloneCustom(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => deepCloneCustom(item));  // Clone array elements
  } else if (obj !== null && typeof obj === 'object') {
    let clone = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepCloneCustom(obj[key]);  // Recursively clone object properties
      }
    }
    return clone;
  } else {
    return obj;  // Return primitive values as is
  }
}