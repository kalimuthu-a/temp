import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { BROWSER_STORAGE_KEYS, CONSTANTS, LOYALTY_UPDATE_POINTS } from '../constants';
// eslint-disable-next-line import/no-cycle
import { makePnrSearchReq } from '../services';

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_loyalty_dashboard';
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

const {
  REGEX_LIST: { ONLY_CHARS_FIELD, EMAIL },
} = CONSTANTS;

function validatePNR(pnr) {
  // Check if PNR matches the expected format (e.g., 6 alphanumeric characters)
  return /^[A-Z0-9]{6}$/i.test(pnr);
}

export const submitHandler = async (pnr, lastname, flag = 'checkin') => {
  return makePnrSearchReq(pnr, lastname, flag);
};

export const validateForm = (formData) => {
  const obj = {};

  if (!validatePNR(formData.pnr)) {
    obj.pnr = true;
  }

  if (!ONLY_CHARS_FIELD.test(formData?.email) && !EMAIL.test(formData?.email)) {
    obj.email = true;
  }

  return obj;
};

export const formatNumber = (number = 0) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

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
};

const PAGE_VIEW_TYPE = {
  TRANSACTION_HISTORY: 'loyalty-transaction-history',
  VOUCHER_HISTORY: 'loyalty-voucher-history',
  RETRO_CLAIM_PAGE: 'loyalty-retro-claim',
};

const localStorageKeys = {
  GENERIC_DATA: 'generic_data_container_app',
  baggage_declaration: 'loyaltyTierLabel',
  voucherHistoryFilter: 'voucherHistoryFilter',
};

// function to catch errors for data dog
const ddRumErrorPayload = (payload, errorData) => {
  let errorMessage = '';
  let errorCode = '';
  const errorPayload = payload;

  if (Array.isArray(errorData) && errorData.length > 0) {
    errorMessage = errorData[0]?.message;
    errorCode = errorData[0]?.code;
  } else {
    errorMessage = errorData?.message;
    errorCode = errorData?.code;
  }
  const errorCatch = errorCode && getErrorMsgForCode(errorCode);
  errorPayload.error = errorData;
  errorPayload.errorMessageForUser = errorCatch?.message || errorMessage;
  errorPayload.errorMessage = errorMessage;
  errorPayload.errorCode = errorCode;

  return errorPayload;
};

export const getPointsToUpdateCookie = () => {
  // this event will be catched in common-logic-container and update auth_userfor cookie
  const updateCookieLoyaltyPointsMessageEvent = (eventData) => {
    return new CustomEvent(LOYALTY_UPDATE_POINTS, eventData);
  };
  document.dispatchEvent(
    updateCookieLoyaltyPointsMessageEvent({
      bubbles: true,
      detail: {},
    }),
  );
};

function getUpdatedPathWithQueryParam(inputUrl, name, value) {
  const url = inputUrl?.startsWith('http')
    ? new URL(inputUrl)
    : new URL(inputUrl, window.location.origin);

  url.searchParams.set(name, value);

  // Build the path + query + hash
  const pathAndQuery = url.pathname + (url.search ? `?${url.searchParams.toString()}` : '');
  const hash = url.hash || '';

  return pathAndQuery + hash;
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

export {
  UTIL_CONSTANTS,
  PAGE_VIEW_TYPE,
  localStorageKeys,
  ddRumErrorPayload,
  getUpdatedPathWithQueryParam,
  getQueryStringByParameterName,
};
