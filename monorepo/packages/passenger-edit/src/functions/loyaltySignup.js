import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import cloneDeep from 'lodash/cloneDeep';
import { AA_CONSTANTS, GTM_ANALTYTICS, localStorageKeys } from '../constants';
import { API_LIST } from '../services';
import getSessionToken from '../utils/storage';
import passengerEditActions from '../context/actions';
import { pushDataLayer } from '../utils/dataLayerEvents';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants/constants';
import pushDDRumAction from '../utils/ddrumEvent';

const loyaltySignup = async (
  payload,
  page,
  isModifyFlow,
  dispatch,
) => {
  const startTime = Date.now();
  let loyaltySignupResponse = {};
  let loyaltySignupResponseJson = {};
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

  // DataDog for Loyalty sign up
  const action = DD_RUM_EVENTS.LOYALTY_SIGNUP;
  const loyaltyPayload = DD_RUM_PAYLOAD;

  try {
    const authToken = getSessionToken();

    loyaltyPayload.method = 'POST';
    loyaltyPayload.requestbody = payload;
    loyaltyPayload.mfname = MF_NAME;

    loyaltySignupResponse = await fetch(API_LIST?.LOYALTY_SIGNUP, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
        user_key: API_LIST?.USER_KEY_LOYALTY,
      },
      page,
    });
    const resData = {
      url: loyaltySignupResponse.url,
      status: loyaltySignupResponse.status,
      responseTime: Math.round((Date.now() - startTime) / 1000),
    };
    loyaltyPayload.responseTime = Math.round((Date.now() - startTime) / 1000);

    loyaltySignupResponseJson = await loyaltySignupResponse.json();

    loyaltyPayload.statusCode = loyaltySignupResponse.status;
    loyaltyPayload.apiurl = API_LIST.LOYALTY_SIGNUP;

    if (!loyaltySignupResponseJson?.data?.success) {
      const error = getErrorMsgForCode(
        loyaltySignupResponseJson?.code
          || loyaltySignupResponseJson?.errors?.code,
      ) || {};
      if (loyaltySignupResponseJson?.code) {
        loyaltySignupResponseJson.errors = cloneDeep(loyaltySignupResponseJson);
      }

      loyaltyPayload.errorMessageForUser = error?.message;
      loyaltyPayload.errorCode = loyaltySignupResponseJson?.code
      || loyaltySignupResponseJson?.errors?.code;
      loyaltyPayload.errorMessage = loyaltySignupResponseJson.errors?.message;

      dispatch({
        type: passengerEditActions.SET_PASSENGER_EDIT_ERROR,
        payload: {
          flag: true,
          message: error?.message,
        },
      });

      const previousPage = isModifyFlow
        ? 'Flight Booking Itinerary'
        : 'Passenger Details';
      const siteSection = isModifyFlow ? 'Modification Page' : 'Booking Page';

      pushDataLayer({
        event: GTM_ANALTYTICS.EVENTS.API_RESPONSE,
        data: {
          error_message: loyaltySignupResponseJson?.errors?.message,
          error_code: loyaltySignupResponseJson?.errors?.code,
          api_responsetime: resData.responseTime,
          api_response: loyaltySignupResponseJson?.errors,
          api_url: API_LIST.LOYALTY_SIGNUP,
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
            code: loyaltySignupResponse?.status,
            url: API_LIST.PASSENGER_POST,
            type: 'api',
            source: 'api',
            statusCode: loyaltySignupResponseJson?.errors?.code,
            statusMessage: loyaltySignupResponseJson?.errors?.message,
          },
        },
        event: 'error',
      });

      pushDataLayer({
        data: {
          _event: 'uxError',
          errorMesg: {
            code: loyaltySignupResponse?.status || NO_CODE,
            url: API_LIST.LOYALTY_SIGNUP,
            type: BE_ERROR,
            source: MS_API,
            statusCode: error?.code || NO_STATUS_CODE,
            statusMessage:
              loyaltySignupResponseJson?.errors?.message || NO_STATUS_MESSAGE,
            displayMessage: error?.message || NO_DISPLAY_MESSAGE,
            action: 'Link/ButtonClick',
            component: 'Next',
          },
        },
        event: 'UXerror',
      });
      loyaltyPayload.error = loyaltySignupResponseJson?.errors;
    } else {
      localStorage.setItem(localStorageKeys.passengerPost, 'true');
      pushDataLayer({
        data: {
          res: { ...resData, data: loyaltySignupResponseJson },
          _event: 'captureApiRes',
        },
        event: apiEventRes,
      });
      loyaltyPayload.response = loyaltySignupResponseJson;
    }

    // push actions to Datadog event listner | Loyalty sign up
    pushDDRumAction(action, loyaltyPayload);

    return loyaltySignupResponseJson;
  } catch (err) {
    const error = getErrorMsgForCode(err?.code);

    loyaltyPayload.errorMessageForUser = error?.message;
    loyaltyPayload.errorCode = err?.code;
    loyaltyPayload.errorMessage = err.message;

    dispatch({
      type: passengerEditActions.SET_PASSENGER_EDIT_ERROR,
      payload: {
        flag: true,
        message: error?.message,
      },
    });

    pushDataLayer({
      data: {
        _event: 'uxError',
        errorMesg: {
          code: NO_CODE,
          url: API_LIST?.LOYALTY_SIGNUP,
          type: BE_ERROR,
          source: MS_API,
          statusCode: NO_STATUS_CODE,
          statusMessage: NO_STATUS_MESSAGE,
          displayMessage: NO_DISPLAY_MESSAGE,
          action: 'Link/ButtonClick',
          component: 'Next',
        },
      },
      event: 'UXerror',
    });

    return { error: true };
  }
};

export default loyaltySignup;
