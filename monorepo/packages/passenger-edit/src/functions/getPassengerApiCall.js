import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { AA_CONSTANTS, GTM_CONSTANTS, localStorageKeys } from '../constants';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants/constants';
import { API_LIST } from '../services';
import pushAnalytic from '../utils/analyticEvents';
import { pushDataLayer } from '../utils/dataLayerEvents';
import pushDDRumAction from '../utils/ddrumEvent';
import LocalStorage from '../utils/LocalStorage';
import getSessionToken from '../utils/storage';
import defaultStatePaxData from './errorStateDataStructure';

// eslint-disable-next-line sonarjs/cognitive-complexity
const getPassengerApiCall = async (triggerPageloadAnalytics = false) => {
  const token = getSessionToken();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST?.USER_KEY_FETCH,
    },
  };
  let paxData = {};
  let resData = {};
  const apiEventRes = 'api response';
  const {
    NO_CODE,
    NO_DISPLAY_MESSAGE,
    NO_STATUS_CODE,
    NO_STATUS_MESSAGE,
    PAGE_LOAD,
    PAGE_NAME,
    BE_ERROR,
    MS_API,
  } = AA_CONSTANTS;
    // DataDog for Passenger list
  const action = DD_RUM_EVENTS.GET_PASSENGER_LIST;
  const payload = DD_RUM_PAYLOAD;

  try {
    const startTimer = performance.now();
    const response = await fetch(API_LIST?.PASSENGER_GET, config);

    payload.method = 'GET'; // request method
    payload.mfname = MF_NAME; // MF name
    payload.responseTime = (performance.now() - startTimer) / 1000;
    resData = {
      url: response.url,
      status: response.status,
      responseTime: (performance.now() - startTimer) / 1000,
    };
    paxData = await response.json();
    payload.apiurl = response.url;
    payload.statusCode = response.status;
    if (paxData?.errors || !response.ok) {
      payload.error = paxData?.errors;
    }
    if (paxData?.errors) {
      let errorMessage = '';
      let errorCode = '';

      if (Array.isArray(paxData.errors) && paxData.errors.length > 0) {
        errorMessage = paxData.errors[0]?.message;
        errorCode = paxData.errors[0]?.code;
      } else {
        errorMessage = paxData.errors?.message;
        errorCode = paxData.errors?.code;
      }

      const errorCatch = getErrorMsgForCode(errorCode);
      payload.errorMessageForUser = errorCatch?.message || errorMessage;
      payload.errorCode = errorCode;
      payload.errorMessage = errorMessage;
      pushAnalytic({
        data: {
          _event: 'error',
          errorMesg: {
            message: paxData?.errors?.message,
            code: paxData?.errors?.code,
            url: API_LIST.PASSENGER_GET,
            type: 'api',
            source: 'api',
            statusCode: response.status,
            statusMessage: paxData?.errors?.message,
          },
        },
        event: 'error',
      });
      pushAnalytic({
        data: {
          _event: 'uxError',
          errorMesg: {
            code: response.status || NO_CODE,
            url: API_LIST.PASSENGER_GET,
            type: BE_ERROR,
            source: MS_API,
            statusCode: paxData?.errors?.code || NO_STATUS_CODE,
            statusMessage: paxData?.errors?.message || NO_STATUS_MESSAGE,
            displayMessage: NO_DISPLAY_MESSAGE,
            action: PAGE_LOAD,
            component: PAGE_NAME,
          },
        },
        event: 'UXerror',
      });
      if (triggerPageloadAnalytics) {
        /**
        * Adobe Analytic | page load
        */
        pushAnalytic({
          data: {
            _event: 'pageload',
            errorMesg: {
              message: paxData?.errors?.message,
              code: paxData?.errors?.code,
              url: API_LIST.PASSENGER_GET,
              type: 'api',
              source: 'api',
              statusCode: response.status,
              statusMessage: paxData?.errors?.message,
            },
          },
          event: 'pageload',
        });
      }

      // tracking api response
      pushAnalytic({
        data: {
          res: { ...resData, data: paxData },
          _event: 'captureApiRes',
          errorMesg: {
            message: paxData?.errors?.message,
            code: paxData?.errors?.code,
            url: API_LIST.PASSENGER_GET,
            type: 'api',
            source: 'api',
            statusCode: response.status,
            statusMessage: paxData?.errors?.message,
          },
        },
        event: apiEventRes,
      });
    } else if (paxData?.passengerInfo) {
      payload.response = paxData?.passengerInfo;

      let modificationFlow = false;
      const { passengers } = paxData.passengerInfo;
      passengers?.forEach((pax) => {
        if (pax?.name?.first) modificationFlow = true;
        else LocalStorage.set(localStorageKeys.loyal_opt_signup_enroll, 0);
      });
      /**
       * Adobe Analytic | page load
       */
      // Google Analytic
      if (triggerPageloadAnalytics) {
        pushDataLayer({
          data: {
            _event: GTM_CONSTANTS.PAGELOAD,
            journeyFlow: modificationFlow ? 'Modification Flow' : 'Booking Flow',
            responseTime: resData.responseTime,
            specialFareCode: paxData?.passengerInfo?.configurations?.specialFareCode,
          },
          event: GTM_CONSTANTS.PAGELOAD,
          error: {},
        });

        pushAnalytic({
          data: {
            _event: GTM_CONSTANTS.PAGELOAD,
          },
          event: GTM_CONSTANTS.PAGELOAD,
          error: {},
        });
      }
    }

    // tracking api response
    pushAnalytic({
      data: {
        res: { ...resData, data: paxData },
        _event: 'captureApiRes',
      },
      event: apiEventRes,
    });
    // push actions to Datadog event listner | page load
    pushDDRumAction(action, payload);

    return paxData;
  } catch (error) {
    let errorMessage = '';
    let errorCode = '';

    if (Array.isArray(error) && error.length > 0) {
      errorMessage = error[0]?.message;
      errorCode = error[0]?.code;
    } else {
      errorMessage = error?.message;
      errorCode = error?.code;
    }

    const errorCatch = getErrorMsgForCode(errorCode);
    payload.errorMessageForUser = errorCatch?.message || errorMessage;
    payload.errorCode = errorCode;
    payload.errorMessage = errorMessage;

    // push actions to Datadog event listner | page load
    pushDDRumAction(action, payload);
    // eslint-disable-next-line no-console
    console.log('error', error);
    pushAnalytic({
      data: {
        _event: 'uxError',
        errorMesg: {
          code: NO_CODE,
          url: API_LIST?.PASSENGER_GET,
          type: BE_ERROR,
          source: MS_API,
          statusCode: NO_STATUS_CODE,
          statusMessage: NO_STATUS_MESSAGE,
          displayMessage: NO_DISPLAY_MESSAGE,
          action: PAGE_LOAD,
          component: PAGE_NAME,
        },
      },
      event: 'UXerror',
    });
    paxData = defaultStatePaxData;

    // tracking api response
    pushAnalytic({
      data: {
        res: { ...resData, data: {} },
        _event: 'captureApiRes',
      },
      event: apiEventRes,
      error: { ...error },
    });
    return {};
  }
};

export default getPassengerApiCall;
