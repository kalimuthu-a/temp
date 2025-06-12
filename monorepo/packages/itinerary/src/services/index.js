/* eslint-disable no-console */
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { getEnvObj, getSessionToken } from '../utils';
import { pushAnalytic } from '../utils/analyticEvents';
import { AA_CONSTANTS } from '../constants/analytic';
import dataDogOverride from '../utils/dataDog';
import { DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import pushDDRumAction from '../utils/ddrumEvent';

const envObj = getEnvObj();

const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
let token = getSessionToken();

let API_LIST = {};
export const ENVCONFIG = {
  FLIGHT_STATUS: '/',
  AVAIL_PLANB: 'https://www.goindigo.in/plan-b.html',
  ADDBAGTAG: 'https://www.goindigo.in/check-in/addbagtag.html',
  VIEWBAGTAG: 'https://www.goindigo.in/bag-tag.html',
  SPLITPNR:
    'https://dbusinessapps.goindigo.in/WebsiteAppDigital4x/splitpnr/index',
  SEATSELECT: '/content/indigo/in/en/booking/seat-select-modification.html',

};
if (Object.keys(envObj).length > 0 && envObj.GET_ITINERARY) {
  // make sure the one mandatory key,value should be there
  API_LIST = {
    ...API_LIST,
    ...{
      ...envObj,
      UPDATE_CONTACT: envObj.UPDATE_CONTACT,
      EMAIL_ITINERARY: envObj.EMAIL_ITINERARY,
      WHATSAPP_OPT: envObj.WHATSAPP_OPT,
      CANCEL_BOOKING: envObj.CANCEL_BOOKING,
      LOGIN: envObj.LOGIN,
      GET_ITINERARY: envObj.GET_ITINERARY,
      GET_SSR_LIST_ABBREVIATION: envObj.GET_SSR_LIST_ABBREVIATION,
      GET_FEECODE_LIST_ABBREVIATION: envObj.GET_FEECODE_LIST_ABBREVIATION,
      MODIFY_RESET_BOOKING: envObj.MODIFY_RESET_BOOKING,
      EMAIL_BOARDINGPASS: envObj.EMAIL_BOARDINGPASS,
      OTP_INITIATE: envObj.OTP_INITIATE,
      FINISH_BOOKING: envObj.FINISH_BOOKING,
      USERKEY_FLIGHT: envObj.USERKEY_FLIGHT,
      USERKEY_ITINERARY_GET: envObj.USERKEY_ITINERARY_GET,
      USERKEY_ITINERARY_SAVE: envObj.USERKEY_ITINERARY_SAVE,
      USERKEY_SESSION: envObj.USERKEY_TOKEN_GET,
      USERKEY_BOOKING: envObj.USERKEY_BOOKING,
      CANCEL_FLIGHT: envObj.CANCEL_FLIGHT,
      UNDO_CHECKIN: envObj.UNDO_CHECKIN,
      NO_SHOW_REFUND: envObj.NO_SHOW_REFUND,
      PROCESS_UPDATE_CONTACT_QUERY: envObj.PROCESS_UPDATE_CONTACT_QUERY,
      GET_ITINERARY_AEM_CONTENT: envObj.GET_ITINERARY_AEM_CONTENT,
      GET_ITINERARY_ADDITIONAL_AEM_CONTENT: envObj.GET_ITINERARY_ADDITIONAL_AEM_CONTENT,
      GET_ITINERARY_CONFIRMATION_DATA_AEM_CONTENT: envObj.GET_ITINERARY_CONFIRMATION_DATA_AEM_CONTENT,
      GET_ITINERARY_CONFIRMATION_ADDITIONAL_AEM_CONTENT: envObj.GET_ITINERARY_CONFIRMATION_ADDITIONAL_AEM_CONTENT,
      EXPLORE_CITY: envObj.EXPLORE_CITY,
      API_HOTEL_SEARCH: envObj.API_HOTEL_SEARCH,
      USER_KEY_API_HOTEL_SEARCH: envObj.USER_KEY_API_HOTEL_SEARCH,
      CONFIRM_PAYMENT_API: envObj.CONFIRM_PAYMENT_API,
      CONFIRM_PAYMENT_USER_KEY: envObj.CONFIRM_PAYMENT_USER_KEY,
      REPORT_EVENT: envObj.REPORT_EVENT,
      COUPON_STATUS: envObj.COUPON_STATUS,
      SCRATCH_CARD_AEM_DATA: envObj.SCRATCH_CARD_AEM_DATA,
      USER_KEY_SCRATCH_CARD: envObj.USER_KEY_SCRATCH_CARD,
      FFNUMBER_VELIDATE: envObj.FFNUMBER_VELIDATE,
      FFNUMBER_UPDATE: envObj.FFNUMBER_UPDATE,
      FFNUMBER_UPDATE_USER_KEY: envObj.FFNUMBER_UPDATE_USER_KEY,
      FFNUMBER_AUTHKEY: envObj.FFNUMBER_AUTHKEY,
      FFNUMBER_USER_KEY: envObj.FFNUMBER_USER_KEY,
      COUPON_USE: envObj?.COUPON_USE,

    },
  };
} else if (location.origin.includes('preprod')) { // eslint-disable-line no-restricted-globals
  API_LIST.GET_ITINERARY = 'https://api-preprod-itinerary-skyplus6e.goindigo.in/v1/Itinerary';
  API_LIST.LOGIN = 'https://api-preprod-session-skyplus6e.goindigo.in/v1/token/create';
} else if (location.origin.includes('prod')) { // eslint-disable-line no-restricted-globals
  API_LIST.GET_ITINERARY = 'https://api-prod-itinerary-skyplus6e.goindigo.in/v1/Itinerary';
  API_LIST.LOGIN = 'https://api-prod-session-skyplus6e.goindigo.in/v1/token/create';
}

// API_LIST.REPORT_EVENT = 'https://api-dev-skyplus.goindigo.in/scratchcard/v1/reportevent';
// GET_ITINERARY: 'https://api-qa-itinerary-skyplus6e.goindigo.in/v1/itinerary',

// USER_KEY_SCRATCH_CARD: '',
const catchErrorMsg = 'catch block error';
/**
 *
 * @param {Number} startTime
 * @returns {Number}
 */
const calculateDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return Math.round(duration / 1000);
};

const ddRumSuccessEventHandler = (response, url, startTime, itineraryPload) => {
  const payload = { ...itineraryPload };
  const responsetime = calculateDuration(startTime);
  payload.response = response;
  payload.responseTime = responsetime;
  payload.statusCode = response?.status || 200;
  /**
     * Datadog for get Itinerary Success Event
     * Api Response tracking
  */
  pushDDRumAction(url, payload);
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ddRumErrorEventHandler = (response, url, startTime, itineraryPload, aemApi) => {
  let code = '';
  let message = '';
  if (response && (response?.errors?.length > 0)) {
    code = response?.errors?.length > 0 ? response?.errors[0]?.code : response?.errors?.code || '';
    message = response?.errors?.length > 0 ? response?.errors[0]?.message : response?.errors?.message || '';
  } else if (response?.errors) {
    code = response?.errors?.code || '';
    message = response?.errors?.message || '';
  }
  const errorMesg = getErrorMsgForCode(code);
  const responsetime = calculateDuration(startTime);
  const payload = { ...itineraryPload };
  payload.error = response?.errors || '';
  payload.responseTime = responsetime;
  payload.errorCode = response?.errors?.code || '';
  payload.errorMessage = errorMesg?.message || message;
  if (aemApi) {
    payload.errorMessageForUser = errorMesg?.message || message || '';
  }
  /**
    * Datadog for get Itinerary error
    * Api Response tracking
  */
  pushDDRumAction(url, payload);
};

export const makePNRSearch = async (pnr, lastname, plKey) => {
  // if (!token) await makeLogin(); // for local testing only
  token = getSessionToken();
  let url = API_LIST.GET_ITINERARY;
  let res = {};
  if (plKey) {
    url += `?pl=${plKey}`;
  } else if (pnr && lastname && (lastname?.indexOf('@') !== -1)) {
    url += `?recordLocator=${pnr}&email=${lastname}`;
  } else if (pnr && lastname) {
    url += `?recordLocator=${pnr}&lastName=${lastname}`;
  }
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_GET,
    },
  };
  const startTimer = performance.now();
  const response = await fetch(url, config);
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  res = {
    url: response.url,
    statusCode: response.status,
    responseTime: (performance.now() - startTimer) / 1000,
  };
  itineraryPayload.method = 'GET';
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = {};
  itineraryPayload.apiurl = url;
  // eslint-disable-next-line no-console
  console.log(res);
  const pnrResponse = await response.json();
  if (pnrResponse && pnrResponse?.data) {
    localStorage.setItem('iti-data', JSON.stringify(pnrResponse.data));
    // Data dog script
    dataDogOverride([{ key: 'pnr', value: pnrResponse?.data?.bookingDetails?.recordLocator }]);
    ddRumSuccessEventHandler(pnrResponse, API_LIST.GET_ITINERARY, startTimer, itineraryPayload);
    /**
     * Adobe Analytic
     * Api Response tracking
     */
    pushAnalytic({
      data: {
        res: { ...res, data: { ...pnrResponse } },
        _event: 'captureApiRes',
      },
      event: 'api response',
    });
    /**
     * Datadog for get Itinerary Data
     * Api Response tracking
     */
    pushDDRumAction(API_LIST.GET_ITINERARY, itineraryPayload);
    return pnrResponse.data;
  }

  if (pnrResponse && pnrResponse?.errors) {
    const { code, message } = pnrResponse?.errors?.length > 0
      ? pnrResponse?.errors[0] : pnrResponse?.errors; // eslint-disable-line no-unsafe-optional-chaining
    const errorMesg = getErrorMsgForCode(code);
    ddRumErrorEventHandler(pnrResponse, url, itineraryPayload.responseTime, itineraryPayload);
    /**
     * Adobe Analytic
     * Api Response tracking
     */
    pushAnalytic({
      data: {
        res: { ...res, data: { ...pnrResponse.data } },
        _event: 'captureApiRes',
        errorMesg: {
          ...errorMesg,
          code,
          url: res.url,
          type: 'api',
          source: 'api',
          statusCode: res.statusCode,
          statusMessage: message || '',
        },
      },
      event: 'api response',
    });
    pushAnalytic({
      data: {
        _event: 'UXerror',
      },
      error: {
        code: res?.statusCode,
        type: AA_CONSTANTS.BE_ERROR,
        source: AA_CONSTANTS.MS_API,
        apiUrl: res.url,
        statusCode: code,
        statusMessage: message,
        displayMessage: errorMesg.message,
        action: `${AA_CONSTANTS.POP_UP} /${AA_CONSTANTS.PAGE_LOAD}`,
        component: 'Retrieve Another Itinerary',
      },
    });
    return { error: true, errorCode: code };
  }
  return pnrResponse;
};

export const updateContact = async (contactDetails) => {
  const url = API_LIST.UPDATE_CONTACT;
  const startTime = Date.now();
  const config = {
    body: JSON.stringify(contactDetails),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_SAVE,
    },
  };

  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  itineraryPayload.method = config?.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = config?.body;
  itineraryPayload.apiurl = url;
  const response = await (await fetch(url, config)).json();
  if (response && response.data) {
    ddRumSuccessEventHandler(response, API_LIST.UPDATE_CONTACT, startTime, itineraryPayload);
    return response.data;
  }
  if (response && response.errors) {
    const { code, message } = response?.errors?.length > 0
      ? response?.errors[0] : response?.errors; // eslint-disable-line no-unsafe-optional-chaining
    const errorMesg = getErrorMsgForCode(code);
    ddRumErrorEventHandler(response, API_LIST.UPDATE_CONTACT, startTime, itineraryPayload);
    pushAnalytic({
      data: {
        _event: 'UXerror',
      },
      error: {
        code: response?.status,
        type: AA_CONSTANTS.BE_ERROR,
        source: AA_CONSTANTS.MS_API,
        apiUrl: url,
        statusCode: code,
        statusMessage: message,
        displayMessage: errorMesg.message,
        action: AA_CONSTANTS.POP_UP,
        component: 'Update Contact',
      },
    });

    return {
      error: true,
      message: response.message,
      errorCode: response?.errors?.code,
    };
  }
  return response;
};

export const emailItineraryReq = async (payload) => { // eslint-disable-line consistent-return
  const url = API_LIST.EMAIL_ITINERARY;
  const startTime = Date.now();
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_SAVE,
    },
  };
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  itineraryPayload.method = config.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = config?.body || {};
  itineraryPayload.apiurl = url;
  try {
    const response = await (await fetch(url, config)).json();
    pushAnalytic({
      data: {
        _event: 'emailItinerarySubmit',
        _eventInfoName: 'Send itinerary',
      },
      event: 'click',
      error: {},
    });
    ddRumSuccessEventHandler(response, API_LIST.EMAIL_ITINERARY, startTime, itineraryPayload);
    return response;
  } catch (err) {
    console.log(err, 'erro');
    const { code, message } = err?.errors?.length > 0
      ? err?.errors[0] : err?.errors; // eslint-disable-line no-unsafe-optional-chaining
    const errorMesg = getErrorMsgForCode(code);
    ddRumErrorEventHandler(err, API_LIST.EMAIL_ITINERARY, startTime, itineraryPayload);
    pushAnalytic({
      data: {
        _event: 'emailItinerarySubmit',
        _eventInfoName: 'Send itinerary',
      },
      event: 'click',
      error: Object.create(null, {
        code: { value: code, enumerable: true },
        message: { value: errorMesg?.message, enumerable: true },
      }),
    });
    pushAnalytic({
      data: {
        _event: 'UXerror',
      },
      error: {
        code: err?.status,
        type: AA_CONSTANTS.BE_ERROR,
        source: AA_CONSTANTS.MS_API,
        apiUrl: url,
        statusCode: code,
        statusMessage: message,
        displayMessage: errorMesg.message,
        action: AA_CONSTANTS.POP_UP,
        component: 'emailItinerary',
      },
    });
  }
};

export const whatsAppOptReq = async (payload) => {
  const url = API_LIST.WHATSAPP_OPT;
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_FLIGHT,
    },
  };
  // eslint-disable-next-line no-return-await
  return await (await fetch(url, config)).json();
};

export const makeCancelBookingReq = async () => {
  const url = API_LIST.CANCEL_BOOKING;
  const startTime = Date.now();
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_SAVE,
    },
  };
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  itineraryPayload.method = config.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = {};
  itineraryPayload.apiurl = url;
  const response = await (await fetch(url, config)).json();
  if (response?.data?.success) {
    ddRumSuccessEventHandler(response, API_LIST.CANCEL_BOOKING, startTime, itineraryPayload);
    return { response, isSuccess: true };
  }
  if (response && response.errors) {
    const { code, message } = response?.errors?.length > 0
      ? response?.errors[0] : response?.errors; // eslint-disable-line no-unsafe-optional-chaining
    const errorMesg = getErrorMsgForCode(code);
    ddRumErrorEventHandler(response, API_LIST.CANCEL_BOOKING, startTime, itineraryPayload);
    pushAnalytic({
      data: {
        _event: 'UXerror',
      },
      error: {
        code: response?.status,
        type: AA_CONSTANTS.BE_ERROR,
        source: AA_CONSTANTS.MS_API,
        apiUrl: url,
        statusCode: code,
        statusMessage: message,
        displayMessage: errorMesg.message,
        action: AA_CONSTANTS.LINK_BUTTON_CLICK,
        component: 'Cancel Booking',
      },
    });
    pushDDRumAction(url, itineraryPayload);
  }
  return { response, isSuccess: false };
};

export const makeGetSSRListReq = async () => {
  token = getSessionToken();
  if (!token) {
    // to avoid the search api call being called without authtoken
    await delay(2000);
    token = getSessionToken();
  }
  const url = API_LIST.GET_SSR_LIST_ABBREVIATION;
  const startTime = Date.now();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_BOOKING,
    },
  };
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  itineraryPayload.method = config.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = {};
  itineraryPayload.apiurl = url;
  const response = await (await fetch(url, config)).json();
  if (response.data && response.data.length > 0) {
    ddRumSuccessEventHandler(response, API_LIST.GET_SSR_LIST_ABBREVIATION, startTime, itineraryPayload);
    return response.data;
  }
  if (response && response.errors) {
    ddRumErrorEventHandler(response, API_LIST.GET_SSR_LIST_ABBREVIATION, startTime, itineraryPayload);
  }
  return [];
};

export const makeGetFeeCodeListReq = async () => {
  token = getSessionToken();
  const url = API_LIST.GET_FEECODE_LIST_ABBREVIATION;
  const startTime = Date.now();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_BOOKING,
    },
  };
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  itineraryPayload.method = config.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = {};
  itineraryPayload.apiurl = url;
  const response = await (await fetch(url, config)).json();
  if (response.data && response.data.length > 0) {
    ddRumSuccessEventHandler(response, API_LIST.GET_FEECODE_LIST_ABBREVIATION, startTime, itineraryPayload);
    return response.data;
  }
  if (response && response.errors) {
    ddRumErrorEventHandler(response, API_LIST.GET_FEECODE_LIST_ABBREVIATION, startTime, itineraryPayload);
  }
  return [];
};

export const otpInitiateReq = async (updateContact = false) => { // eslint-disable-line no-shadow
  let url = API_LIST.OTP_INITIATE;
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  if (updateContact && API_LIST.PROCESS_UPDATE_CONTACT_QUERY) {
    url += API_LIST.PROCESS_UPDATE_CONTACT_QUERY;
  }

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_SESSION,
    },
    credentials: 'include'
  };
  itineraryPayload.method = config.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = {};
  itineraryPayload.apiurl = url;
  const response = await (await fetch(url, config)).json();
  if (response?.data?.success) {
    ddRumSuccessEventHandler(response, API_LIST.OTP_INITIATE, startTime, itineraryPayload);
    return { response, isSuccess: true };
  }
  if (response && response.errors) {
    const { code, message } = response?.errors?.length > 0
      ? response?.errors[0] : response?.errors; // eslint-disable-line no-unsafe-optional-chaining
    const errorMesg = getErrorMsgForCode(code);
    ddRumErrorEventHandler(response, API_LIST.OTP_INITIATE, startTime, itineraryPayload);
    pushAnalytic({
      data: {
        _event: 'UXerror',
      },
      error: {
        code: response?.status,
        type: AA_CONSTANTS.BE_ERROR,
        source: AA_CONSTANTS.MS_API,
        apiUrl: url,
        statusCode: code,
        statusMessage: message,
        displayMessage: errorMesg.message,
        action: AA_CONSTANTS.POP_UP,
        component: 'OTP',
      },
    });
  }
  return { response, isSuccess: false };
};

export const makeResetBookingReq = async (payload = {}) => { // eslint-disable-line no-unused-vars
  const url = API_LIST.MODIFY_RESET_BOOKING;
  const startTime = Date.now();
  const config = {
    // body: JSON.stringify(payload),
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_SAVE,
    },
  };
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  itineraryPayload.method = config.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = {};
  itineraryPayload.apiurl = url;
  const response = await (await fetch(url, config)).json();
  if (response?.data?.success) {
    ddRumSuccessEventHandler(response, API_LIST.MODIFY_RESET_BOOKING, startTime, itineraryPayload);
    return { response, isSuccess: true };
  }
  if (response && response.errors) {
    ddRumErrorEventHandler(response, API_LIST.MODIFY_RESET_BOOKING, startTime, itineraryPayload);
  }
  return { response, isSuccess: false };
};

export const makeEmailBoardingPassReq = async (payload) => {
  const url = API_LIST.EMAIL_BOARDINGPASS;
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_SAVE,
    },
  };
  // eslint-disable-next-line no-return-await
  return await (await fetch(url, config)).json();
};

export const makeFinishBookingReq = async (payload) => {
  const url = API_LIST.FINISH_BOOKING;
  const startTime = Date.now();
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_SAVE,
    },
  };
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  itineraryPayload.method = config.method;
  itineraryPayload.mfname = MF_NAME;
  itineraryPayload.requestbody = config?.body || {};
  itineraryPayload.apiurl = url;
  const response = await (await fetch(url, config)).json();
  if (response?.data?.success) {
    ddRumSuccessEventHandler(response, API_LIST.FINISH_BOOKING, startTime, itineraryPayload);
    return { response, isSuccess: true };
  }
  if (response && response.errors) {
    ddRumErrorEventHandler(response, API_LIST.FINISH_BOOKING, startTime, itineraryPayload);
  }
  return { response, isSuccess: false };
};

export const makeCancelFlightReq = async (payload) => {
  const url = API_LIST.CANCEL_FLIGHT;
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const config = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USERKEY_ITINERARY_SAVE,
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = config?.body || {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      ddRumSuccessEventHandler(response, API_LIST.CANCEL_FLIGHT, startTime, itineraryPayload);
      return { response, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(response, API_LIST.CANCEL_FLIGHT, startTime, itineraryPayload);
    }
    return { response, isSuccess: false };
  } catch (error) {
    const { code, message } = error?.errors?.length > 0
      ? error?.errors[0] : error?.errors; // eslint-disable-line no-unsafe-optional-chaining
    const errorMesg = getErrorMsgForCode(code);
    ddRumErrorEventHandler(error, API_LIST.CANCEL_FLIGHT, startTime, itineraryPayload);
    pushAnalytic({
      data: {
        _event: 'UXerror',
      },
      error: {
        code: error?.status,
        type: AA_CONSTANTS.BE_ERROR,
        source: AA_CONSTANTS.MS_API,
        apiUrl: url,
        statusCode: code,
        statusMessage: message,
        displayMessage: errorMesg.message,
        action: AA_CONSTANTS.POP_UP,
        component: 'Cancel Flight',
      },
    });
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// Explore city api request
export const makeExploreCityReq = async (cityCode) => {
  const url = API_LIST.EXPLORE_CITY.replace('${cityCode}', cityCode); // eslint-disable-line no-template-curly-in-string,max-len
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USERKEY_ITINERARY_SAVE,
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      ddRumSuccessEventHandler(response, API_LIST.EXPLORE_CITY, startTime, itineraryPayload);
      return { response, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(response, API_LIST.EXPLORE_CITY, startTime, itineraryPayload, true);
    }
    return { response, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(error, API_LIST.EXPLORE_CITY, startTime, itineraryPayload, true);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const makeUndoCheckInReq = async (payload) => {
  const url = API_LIST.UNDO_CHECKIN;
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const config = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USERKEY_ITINERARY_SAVE,
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      ddRumSuccessEventHandler(response, API_LIST.UNDO_CHECKIN, startTime, itineraryPayload);
      return { response, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(response, API_LIST.UNDO_CHECKIN, startTime, itineraryPayload);
    }
    return { response, isSuccess: false };
  } catch (error) {
    const { code, message } = error?.errors?.length > 0
      ? error?.errors[0] : error?.errors; // eslint-disable-line no-unsafe-optional-chaining
    const errorMesg = getErrorMsgForCode(code);
    ddRumErrorEventHandler(error, API_LIST.UNDO_CHECKIN, startTime, itineraryPayload);
    pushAnalytic({
      data: {
        _event: 'UXerror',
      },
      error: {
        code: error?.status,
        type: AA_CONSTANTS.BE_ERROR,
        source: AA_CONSTANTS.MS_API,
        apiUrl: url,
        statusCode: code,
        statusMessage: message,
        displayMessage: errorMesg.message,
        action: AA_CONSTANTS.LINK_BUTTON_CLICK,
        component: 'UndoCheckIn',
      },
    });
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const makeNoShowReq = async (payload) => {
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.NO_SHOW_REFUND;
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USERKEY_ITINERARY_SAVE,
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = config?.body || {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      ddRumSuccessEventHandler(response, API_LIST.NO_SHOW_REFUND, startTime, itineraryPayload);
      return { response, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(response, API_LIST.NO_SHOW_REFUND, startTime, itineraryPayload);
    }
    return { response, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(error, API_LIST.NO_SHOW_REFUND, startTime, itineraryPayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const getAemContent = async () => {
  // const authToken = cookies ? cookies.get('auth_token') : ''; // NOSONAR,  keeping the line for furture usecases
  // const USER_KEY_FETCH = ''; // NOSONAR keeping the line for furture usecases
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.GET_ITINERARY_AEM_CONTENT;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      const { data } = response;
      ddRumSuccessEventHandler(response, API_LIST.GET_ITINERARY_AEM_CONTENT, startTime, itineraryPayload);
      return { data, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(response, API_LIST.GET_ITINERARY_AEM_CONTENT, startTime, itineraryPayload, true);
    }
    const { data } = response;
    return { data, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(error, API_LIST.GET_ITINERARY_AEM_CONTENT, startTime, itineraryPayload, true);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const getAemAdditionalContent = async () => {
  // const authToken = cookies ? cookies.get('auth_token') : ''; // NOSONAR keeping the line for furture usecases
  // const USER_KEY_FETCH = ''; // NOSONAR keeping the line for furture usecases
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.GET_ITINERARY_ADDITIONAL_AEM_CONTENT;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      const { data } = response;
      ddRumSuccessEventHandler(response, API_LIST.GET_ITINERARY_ADDITIONAL_AEM_CONTENT, startTime, itineraryPayload);
      return { data, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        API_LIST.GET_ITINERARY_ADDITIONAL_AEM_CONTENT,
        startTime,
        itineraryPayload,
        true,
      );
    }
    const { data } = response;
    return { data, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.GET_ITINERARY_ADDITIONAL_AEM_CONTENT,
      startTime,
      itineraryPayload,
      true,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};
export const getMfConfirmationContent = async () => {
  // const authToken = cookies ? cookies.get('auth_token') : ''; // NOSONAR keeping the line for furture usecases
  // const USER_KEY_FETCH = ''; // NOSONAR keeping the line for furture usecases
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.GET_ITINERARY_CONFIRMATION_DATA_AEM_CONTENT;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      const { data } = response;
      ddRumSuccessEventHandler(
        response,
        API_LIST.GET_ITINERARY_CONFIRMATION_DATA_AEM_CONTENT,
        startTime,
        itineraryPayload,
      );
      return { data, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        API_LIST.GET_ITINERARY_CONFIRMATION_DATA_AEM_CONTENT,
        startTime,
        itineraryPayload,
        true,
      );
    }
    const { data } = response;
    return { data, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.GET_ITINERARY_CONFIRMATION_DATA_AEM_CONTENT,
      startTime,
      itineraryPayload,
      true,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};
export const getMfConfirmationAdditionalContent = async () => {
  // const authToken = cookies ? cookies.get('auth_token') : ''; // NOSONAR keeping the line for furture usecases
  // const USER_KEY_FETCH = ''; // NOSONAR keeping the line for furture usecases
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.GET_ITINERARY_CONFIRMATION_ADDITIONAL_AEM_CONTENT;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      const { data } = response;
      ddRumSuccessEventHandler(
        response,
        API_LIST.GET_ITINERARY_CONFIRMATION_ADDITIONAL_AEM_CONTENT,
        startTime,
        itineraryPayload,
      );
      return { data, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        API_LIST.GET_ITINERARY_CONFIRMATION_ADDITIONAL_AEM_CONTENT,
        startTime,
        itineraryPayload,
        true,
      );
    }
    const { data } = response;
    return { data, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.GET_ITINERARY_CONFIRMATION_ADDITIONAL_AEM_CONTENT,
      startTime,
      itineraryPayload,
      true,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const getHotelsList = async (queryParm = '') => {
  const token = getSessionToken();
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    let url = API_LIST.API_HOTEL_SEARCH;
    if (queryParm) {
      url += `?${queryParm}`;
    }
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        user_key: API_LIST.USER_KEY_API_HOTEL_SEARCH,
        Authorization: token,
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      const { data } = response;
      ddRumSuccessEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
      return { data, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    const { data } = response;
    return { data, isSuccess: false };
  } catch (error) {
    console.log(error, 'error');
    ddRumErrorEventHandler(
      error,
      API_LIST.API_HOTEL_SEARCH,
      startTime,
      itineraryPayload,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};
export const confirmPayment = async () => {
  const orderId = new URLSearchParams(window.location.search).get('order_id');
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    itineraryPayload.method = 'POST';
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = JSON.stringify({ order_id: orderId }) || {};
    itineraryPayload.apiurl = API_LIST.CONFIRM_PAYMENT_API;
    const response = await fetch(`${API_LIST.CONFIRM_PAYMENT_API}`, {
      method: 'POST',
      body: JSON.stringify({
        order_id: orderId,
      }),
      headers: {
        Authorization: token,
        user_key: API_LIST.CONFIRM_PAYMENT_USER_KEY,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const apiResponse = await response.json();
    if (apiResponse?.data?.success) {
      ddRumSuccessEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    return apiResponse;
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.CONFIRM_PAYMENT_API,
      startTime,
      itineraryPayload,
    );
    console.error('Error confirming payment:', error);
    console.log('Payment status: Pending');
    return null;
  }
};
export const scratchCardAPIData = async (encryptedPayload) => { // eslint-disable-line consistent-return
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.REPORT_EVENT;

    const headers = new Headers();
    headers.append('Authorization', token);
    headers.append('User_Key', API_LIST.USER_KEY_SCRATCH_CARD);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('EncryptedPayload', encryptedPayload);
    const config = {
      method: 'POST',
      headers,
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = config?.body || {};
    itineraryPayload.apiurl = url;
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error('Failed to update scratched status');
    }
    const apiResponse = await response.json();
    if (apiResponse?.data?.success) {
      ddRumSuccessEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    return apiResponse;
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.REPORT_EVENT,
      startTime,
      itineraryPayload,
    );
    console.log(error, '8299500600');
  }
};

export const scratchCardAEMData = async () => { // eslint-disable-line consistent-return
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.SCRATCH_CARD_AEM_DATA;
    const TOKEN = getSessionToken();
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: TOKEN,
        User_key: API_LIST.USER_KEY_SCRATCH_CARD,
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const apiResponse = await response.json();
    if (apiResponse?.data?.success) {
      ddRumSuccessEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
        true,
      );
    }
    return apiResponse;
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.SCRATCH_CARD_AEM_DATA,
      startTime,
      itineraryPayload,
      true,
    );
    console.log(error);
  }
};

export const cardScratched = async (payload) => { // eslint-disable-line consistent-return
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.COUPON_STATUS;
    const headers = new Headers();
    headers.append('Authorization', token);
    headers.append('User_Key', API_LIST.USER_KEY_SCRATCH_CARD);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlencoded = new URLSearchParams();
    urlencoded.append('EncryptedPayload', payload);
    const config = {
      body: urlencoded.toString(),
      headers,
      method: 'POST',
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = config?.body || {};
    itineraryPayload.apiurl = url;
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error('Failed to update scratched status');
    }

    const apiResponse = await response.json();
    if (apiResponse?.data?.success) {
      ddRumSuccessEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.COUPON_STATUS,
      startTime,
      itineraryPayload,
    );
    console.log(error);
  }
};

export const getValidateFFN = async (ffn, fName, lName) => {
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    let url = API_LIST.FFNUMBER_VELIDATE;
    url += `?FFN=${ffn}&FName=${fName}&LName=${lName}`;
    const config = {
      method: 'GET',
      headers: {
        Authorization: token,
        AuthKey: API_LIST.FFNUMBER_AUTHKEY,
        user_key: API_LIST.FFNUMBER_USER_KEY,
        'Content-Type': 'application/json',
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      const { data } = response;
      ddRumSuccessEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
      return { data, isSuccess: true };
    }
    const { data } = response;
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    return { data, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.FFNUMBER_VELIDATE,
      startTime,
      itineraryPayload,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const postUpdateFFN = async (payload) => {
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    const url = API_LIST.FFNUMBER_UPDATE;
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        Authorization: token,
        user_key: API_LIST.FFNUMBER_UPDATE_USER_KEY,
        'Content-Type': 'application/json',
      },
    };
    itineraryPayload.method = config.method;
    itineraryPayload.mfname = MF_NAME;
    itineraryPayload.requestbody = config?.body || {};
    itineraryPayload.apiurl = url;
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      ddRumSuccessEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
      return { response, isSuccess: true };
    }
    if (response && response.errors) {
      ddRumErrorEventHandler(
        response,
        itineraryPayload.apiurl,
        startTime,
        itineraryPayload,
      );
    }
    return { response, isSuccess: false };
  } catch (error) {
    ddRumErrorEventHandler(
      error,
      API_LIST.FFNUMBER_UPDATE,
      startTime,
      itineraryPayload,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const couponUseApi = async (payload) => {
  try {
    const url = API_LIST.COUPON_USE;
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USER_KEY_SCRATCH_CARD,
      },
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error('Failed to update scratched status');
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};
