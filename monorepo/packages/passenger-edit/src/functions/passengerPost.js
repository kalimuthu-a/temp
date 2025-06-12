import cloneDeep from 'lodash/cloneDeep';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { AA_CONSTANTS, GTM_ANALTYTICS, localStorageKeys } from '../constants';
import passengerEditActions from '../context/actions';
import { API_LIST } from '../services';
import getSessionToken from '../utils/storage';
import { setInvalidFFNErrors } from './setInvalidFFNErrors';
import { pushDataLayer } from '../utils/dataLayerEvents';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, GST_ERROR_CODE, MF_NAME } from '../constants/constants';
import pushDDRumAction from '../utils/ddrumEvent';

const passengerPost = async (
  payload,
  dispatch,
  page,
  isModifyFlow,
  setError,
  getValues,
  duplicateNameFFNMismatchError,
  gstErrorMsg,
// eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const startTime = Date.now();
  let addPassengerResponse = {};
  let addPassengerResponseJson = {};
  const apiEventRes = 'api response';

  const {
    NO_CODE,
    NO_DISPLAY_MESSAGE,
    NO_STATUS_CODE,
    NO_STATUS_MESSAGE,
    PAGE_NAME,
    BE_ERROR,
    MS_API,
  } = AA_CONSTANTS;

  // DataDog for adding Passenger details information
  const addPassengerAction = DD_RUM_EVENTS.ADD_PASSENGER_DETAILS;
  const addPassengerPayload = DD_RUM_PAYLOAD;

  try {
    const authToken = getSessionToken();

    addPassengerPayload.method = 'POST';
    addPassengerPayload.mfname = MF_NAME;

    addPassengerResponse = await fetch(API_LIST.PASSENGER_POST, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
        user_key: API_LIST?.USER_KEY_SAVE,
      },
      page,
    });
    const resData = {
      url: addPassengerResponse.url,
      status: addPassengerResponse.status,
      responseTime: Math.round((Date.now() - startTime) / 1000),
    };

    addPassengerPayload.responseTime = Math.round((Date.now() - startTime) / 1000);

    addPassengerResponseJson = await addPassengerResponse.json();
    addPassengerPayload.apiurl = API_LIST.PASSENGER_POST;
    addPassengerPayload.statusCode = addPassengerResponse.status;
    let errorMessage = '';
    if (!addPassengerResponseJson?.data?.success) {
      let errorCode = addPassengerResponseJson?.code
        || addPassengerResponseJson?.errors?.code;
      if (Array.isArray(addPassengerResponseJson?.errors)) {
        errorCode = addPassengerResponseJson?.errors?.[0]?.code;
        errorMessage = addPassengerResponseJson?.errors?.[0]?.message;
      }

      const error = getErrorMsgForCode(errorCode) || {};

      if (errorCode === GST_ERROR_CODE) {
        error.message = gstErrorMsg;
        error.code = errorCode;
      }

      if (errorCode) {
        addPassengerPayload.errorMessageForUser = error?.message;
        addPassengerPayload.errorCode = errorCode;
        addPassengerPayload.errorMessage = errorMessage;
      }

      if (errorCode === 'E006') {
        setInvalidFFNErrors({
          getValues,
          setError,
          validationMessage: duplicateNameFFNMismatchError,
          addPassengerResponseJson,
        });
      }

      dispatch({
        type: passengerEditActions.SET_PASSENGER_EDIT_ERROR,
        payload: { flag: true, message: error?.message },
      });

      if (addPassengerResponseJson?.code) {
        addPassengerResponseJson.errors = cloneDeep(addPassengerResponseJson);
      }

      const previousPage = isModifyFlow
        ? 'Flight Booking Itinerary'
        : 'Passenger Details';
      const siteSection = isModifyFlow ? 'Modification Page' : 'Booking Page';

      pushDataLayer({
        event: GTM_ANALTYTICS.EVENTS.API_RESPONSE,
        data: {
          error_message:
            addPassengerResponseJson?.errors?.message
            || addPassengerResponseJson?.errors?.[0]?.message,
          error_code: errorCode,
          api_responsetime: resData.responseTime,
          api_response: addPassengerResponseJson?.errors,
          api_url: API_LIST?.PASSENGER_POST,
          page_name: PAGE_NAME,
          previous_page: previousPage,
          error_shown: '1',
          site_section: siteSection,
          api_code: 200,
        },
      });

      pushDataLayer({
        data: {
          _event: 'error',
          errorMesg: {
            code: addPassengerResponse?.status,
            url: API_LIST?.PASSENGER_POST,
            type: 'api',
            source: 'api',
            statusCode: errorCode,
            statusMessage:
              addPassengerResponseJson?.errors?.message
              || addPassengerResponseJson?.errors?.[0]?.message,
          },
        },
        event: 'error',
      });

      pushDataLayer({
        data: {
          _event: 'uxError',
          errorMesg: {
            code: addPassengerResponse?.status || NO_CODE,
            url: API_LIST?.PASSENGER_POST,
            type: BE_ERROR,
            source: MS_API,
            statusCode: error?.code || NO_STATUS_CODE,
            statusMessage:
              addPassengerResponseJson?.errors?.message
              || addPassengerResponseJson?.errors?.[0]?.message
              || NO_STATUS_MESSAGE,
            displayMessage: error?.message || NO_DISPLAY_MESSAGE,
            action: 'Link/ButtonClick',
            component: 'Next',
          },
        },
        event: 'UXerror',
      });
    } else {
      localStorage.setItem(localStorageKeys.passengerPost, 'true');
      pushDataLayer({
        data: {
          res: { ...resData, data: addPassengerResponseJson },
          _event: 'captureApiRes',
        },
        event: apiEventRes,
      });
      addPassengerPayload.response = addPassengerResponseJson?.data;
    }

    // push actions to Datadog event listner | save passenger details
    pushDDRumAction(addPassengerAction, addPassengerPayload);

    return addPassengerResponseJson;
  } catch (err) {
    const error = getErrorMsgForCode(err?.code);

    addPassengerPayload.errorMessageForUser = error?.message;
    addPassengerPayload.errorCode = err?.code;
    addPassengerPayload.errorMessage = err?.message;

    // push actions to Datadog event listner | save passenger details
    pushDDRumAction(addPassengerAction, addPassengerPayload);

    dispatch({
      type: passengerEditActions.SET_PASSENGER_EDIT_ERROR,
      payload: { flag: true, message: error?.message },
    });

    pushDataLayer({
      data: {
        _event: 'uxError',
        errorMesg: {
          code: NO_CODE,
          url: API_LIST?.PASSENGER_POST,
          type: BE_ERROR,
          source: MS_API,
          statusCode: NO_STATUS_CODE,
          statusMessage: NO_STATUS_MESSAGE,
          displayMessage: error?.message || NO_DISPLAY_MESSAGE,
          action: 'Link/ButtonClick',
          component: 'Next',
        },
      },
      event: 'UXerror',
    });
    return { error: true };
  }
};

export default passengerPost;
