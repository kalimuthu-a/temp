// services - API calls
// use only JS fetch to make API calls.

import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import { getEnvObj, getSessionToken } from '../utils';
import analyticEvents from '../utils/analyticEvents';
import pushDDRumAction from '../utils/ddrumEvent';

let API_LIST = {
  GET_REVIEW_SUMMARY: '',
  USER_KEY_GET_REVIEW_SUMMARY: '',
  USERKEY_BOOKING: '',
  GET_SSR_LIST_ABBREVIATION: '',
  GET_FEECODE_LIST_ABBREVIATION: '',
  AEM_FARESUMMARY_DATA: '/content/api/s6web/in/en/v1/fs-main.json',
};

const CONSTANTS = {
  ERROR: 'error',
  API_RESPONSE: 'api response',
  API: 'api',
};
const envObj = getEnvObj();
// make sure the one mandatory key,value should be there
if (Object.keys(envObj).length > 0 && envObj.API_REVIEWSUMMARY_GET) {
  API_LIST = {
    GET_REVIEW_SUMMARY: envObj.API_REVIEWSUMMARY_GET,
    USER_KEY_GET_REVIEW_SUMMARY: envObj.USER_KEY_REVIEWSUMMARY_GET,
    GET_SSR_LIST_ABBREVIATION: envObj.GET_SSR_LIST_ABBREVIATION,
    GET_FEECODE_LIST_ABBREVIATION: envObj.GET_FEECODE_LIST_ABBREVIATION,
    USERKEY_BOOKING: envObj.USERKEY_BOOKING,
    AEM_FARESUMMARY_DATA: envObj.AEM_FARESUMMARY_DATA,
  };
}

export async function getFareSummaryApiData() {
  const startTime = Date.now();
  const token = getSessionToken();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USER_KEY_GET_REVIEW_SUMMARY,
    },
  };

  // DataDog for Getting fare summary data
  const fareSummaryPayload = DD_RUM_PAYLOAD;
  const fareSummaryAction = DD_RUM_EVENTS.FARE_SUMMARY_DATA;
  const startTimer = performance.now();

  fareSummaryPayload.method = 'GET';
  fareSummaryPayload.mfname = MF_NAME;

  try {
    const response = await fetch(API_LIST.GET_REVIEW_SUMMARY, config);
    const statusCode = response?.status;
    const getReviewData = await response.json();

    let duration = Date.now() - startTime;
    duration = Math.round(duration / 1000);

    fareSummaryPayload.responseTime = (performance.now() - startTimer) / 1000;
    fareSummaryPayload.statusCode = statusCode;
    fareSummaryPayload.apiurl = API_LIST.GET_REVIEW_SUMMARY;

    const payloadData = {
      response: {
        url: API_LIST.GET_REVIEW_SUMMARY,
        responseTime: duration,
        statusCode,
      },
    };

    const { data, errors } = getReviewData || {};
    if (errors || !response.ok) {
      let errorMessage = '';
      let errorCode = '';

      if (Array.isArray(errors) && errors.length > 0) {
        errorMessage = errors[0]?.message;
        errorCode = errors[0]?.code;
      } else {
        errorMessage = errors?.message;
        errorCode = errors?.code;
      }
      const errorCatch = getErrorMsgForCode(errorCode);
      fareSummaryPayload.error = errors;
      fareSummaryPayload.errorMessageForUser = errorCatch?.message || errorMessage;
      fareSummaryPayload.errorMessage = errorMessage;
      fareSummaryPayload.errorCode = errorCode;
    } else if (data) {
      fareSummaryPayload.response = data;
    }

    analyticEvents({
      data: {
        _event: data ? CONSTANTS.API : CONSTANTS.ERROR,
        response: { ...payloadData.response, responseData: data ?? errors },
      },
      event: data ? CONSTANTS.API_RESPONSE : CONSTANTS.ERROR,
    });

    // push actions to Datadog event listner | fare summary data
    pushDDRumAction(fareSummaryAction, fareSummaryPayload);

    return getReviewData.data;
  } catch (errors) {
    const errorCatch = getErrorMsgForCode(errors?.code);
    fareSummaryPayload.error = errors;
    fareSummaryPayload.errorMessageForUser = errorCatch?.message || errors?.message;
    fareSummaryPayload.errorMessage = errors?.message;
    fareSummaryPayload.errorCode = errors?.code;
    // push actions to Datadog event listner | fare summary data
    pushDDRumAction(fareSummaryAction, fareSummaryPayload);
    return {};
  }
}

export async function getFeeCodeMapping() {
  const startTime = Date.now();
  const token = getSessionToken();
  const url = API_LIST.GET_FEECODE_LIST_ABBREVIATION;
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_BOOKING,
    },
  };
  // DataDog for fee mapping
  const codeMappingPayload = DD_RUM_PAYLOAD;
  const codeMappingAction = DD_RUM_EVENTS.FARE_CODE_MAPPING;
  const startTimer = performance.now();
  codeMappingPayload.method = 'GET';
  codeMappingPayload.mfname = MF_NAME;

  let responseData;
  try {
    const response = await fetch(url, config);
    const statusCode = response?.status;
    const getReviewData = await response.json();

    let duration = Date.now() - startTime;
    duration = Math.round(duration / 1000);

    codeMappingPayload.responseTime = (performance.now() - startTimer) / 1000;
    codeMappingPayload.statusCode = statusCode;
    codeMappingPayload.apiurl = url;

    const payloadData = {
      response: {
        url,
        responseTime: duration,
        statusCode,
      },
    };

    const { data, errors } = getReviewData || {};
    if (errors || !response.ok) {
      let errorMessage = '';
      let errorCode = '';
      if (Array.isArray(errors) && errors.length > 0) {
        errorMessage = errors[0]?.message;
        errorCode = errors[0]?.code;
      } else {
        errorMessage = errors?.message;
        errorCode = errors?.code;
      }
      const errorCatch = getErrorMsgForCode(errorCode);
      codeMappingPayload.error = errors;
      codeMappingPayload.errorMessageForUser = errorCatch?.message || errorMessage;
      codeMappingPayload.errorMessage = errorMessage;
      codeMappingPayload.errorCode = errorCode;
    } else if (data) {
      codeMappingPayload.response = data;
    }
    analyticEvents({
      data: {
        _event: data ? CONSTANTS.API : CONSTANTS.ERROR,
        response: { ...payloadData.response, responseData: data ?? errors },
      },
      event: data ? CONSTANTS.API_RESPONSE : CONSTANTS.ERROR,
    });
    if (getReviewData.data && getReviewData.data.length > 0) {
      responseData = getReviewData.data;
    }
  } catch (error) {
    responseData = [];
    const errorCatch = getErrorMsgForCode(error?.code);
    codeMappingPayload.error = error;
    codeMappingPayload.errorMessageForUser = errorCatch?.message || error?.message;
    codeMappingPayload.errorMessage = error?.message;
    codeMappingPayload.errorCode = error?.code;
  }
  // push actions to Datadog event listner | fare summary data
  pushDDRumAction(codeMappingAction, codeMappingPayload);
  return responseData;
}

export async function getSsrCodeMapping() {
  const startTime = Date.now();
  const token = getSessionToken();
  const url = API_LIST.GET_SSR_LIST_ABBREVIATION;
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_BOOKING,
    },
  };
  let responseData;

  // DataDog for SSR code mapping
  const ssrCodeMappingPayload = DD_RUM_PAYLOAD;
  const ssrCodeMappingAction = DD_RUM_EVENTS.SSR_CODE_MAPPING;
  const startTimer = performance.now();

  ssrCodeMappingPayload.method = 'GET';
  ssrCodeMappingPayload.mfname = MF_NAME;

  try {
    const response = await fetch(url, config);
    const statusCode = response?.status;
    const getReviewData = await response.json();

    let duration = Date.now() - startTime;
    duration = Math.round(duration / 1000);

    ssrCodeMappingPayload.responseTime = (performance.now() - startTimer) / 1000;
    ssrCodeMappingPayload.statusCode = statusCode;
    ssrCodeMappingPayload.apiurl = url;

    const payloadData = {
      response: {
        url,
        responseTime: duration,
        statusCode,
      },
    };

    const { data, errors } = getReviewData || {};
    if (errors || !response.ok) {
      let errorMessage = '';
      let errorCode = '';
      if (Array.isArray(errors) && errors.length > 0) {
        errorMessage = errors[0]?.message;
        errorCode = errors[0]?.code;
      } else {
        errorMessage = errors?.message;
        errorCode = errors?.code;
      }

      const errorCatch = getErrorMsgForCode(errorCode);
      ssrCodeMappingPayload.error = errors;
      ssrCodeMappingPayload.errorMessageForUser = errorCatch?.message || errorMessage;
      ssrCodeMappingPayload.errorMessage = errorMessage;
      ssrCodeMappingPayload.errorCode = errorCode;
    } else if (data) {
      ssrCodeMappingPayload.response = data;
    }

    analyticEvents({
      data: {
        _event: data ? CONSTANTS.API : CONSTANTS.ERROR,
        response: { ...payloadData.response, responseData: data ?? errors },
      },
      event: data ? CONSTANTS.API_RESPONSE : CONSTANTS.ERROR,
    });

    if (getReviewData.data && getReviewData.data.length > 0) {
      responseData = getReviewData.data;
    }
  } catch (error) {
    const errorCatch = getErrorMsgForCode(error?.code);
    ssrCodeMappingPayload.error = error;
    ssrCodeMappingPayload.errorMessageForUser = errorCatch?.message || error?.message;
    ssrCodeMappingPayload.errorMessage = error?.message;
    ssrCodeMappingPayload.errorCode = error?.code;

    responseData = [];
  }
  // push actions to Datadog event listner | fare summary data
  pushDDRumAction(ssrCodeMappingAction, ssrCodeMappingPayload);
  return responseData;
}

export async function getAEMData() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // DataDog for getting AEM data
  const aemDataPayload = DD_RUM_PAYLOAD;
  const aemDataAction = DD_RUM_EVENTS.AEM_DATA;
  const startTimer = performance.now();

  aemDataPayload.method = 'GET';
  aemDataPayload.mfname = MF_NAME;

  try {
    const response = await fetch(API_LIST.AEM_FARESUMMARY_DATA, config);
    const getReviewData = await response.json();

    aemDataPayload.responseTime = (performance.now() - startTimer) / 1000;
    aemDataPayload.statusCode = response?.status;
    aemDataPayload.apiurl = API_LIST.AEM_FARESUMMARY_DATA;

    if (getReviewData?.errors || !response.ok) {
      let errorMessage = '';
      let errorCode = '';
      if (Array.isArray(getReviewData?.errors) && getReviewData?.errors.length > 0) {
        errorMessage = getReviewData?.errors[0]?.message;
        errorCode = getReviewData?.errors[0]?.code;
      } else {
        errorMessage = getReviewData?.errors?.message;
        errorCode = getReviewData?.errors?.code;
      }

      const errorCatch = getErrorMsgForCode(errorCode);
      aemDataPayload.error = getReviewData?.errors;
      aemDataPayload.errorMessageForUser = errorCatch?.message || errorMessage;
      aemDataPayload.errorMessage = errorMessage;
      aemDataPayload.errorCode = getReviewData?.errors?.code;
    } else if (getReviewData) {
      aemDataPayload.response = getReviewData;
    }

    // push actions to Datadog event listner | fare summary data
    pushDDRumAction(aemDataAction, aemDataPayload);

    return getReviewData.data?.fareSummaryByPath?.item;
  } catch (error) {
    const errorCatch = getErrorMsgForCode(error?.code);
    aemDataPayload.error = error;
    aemDataPayload.errorMessageForUser = errorCatch?.message || error?.message;
    aemDataPayload.errorMessage = error?.message;
    aemDataPayload.errorCode = error?.code;
    // push actions to Datadog event listner | fare summary data
    pushDDRumAction(aemDataAction, aemDataPayload);
    return {};
  }
}
