/* eslint-disable */

import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { Cookies } from 'react-cookie';
import cloneDeep from 'lodash/cloneDeep';
import { CONSTANTS, DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME, categoryCodes, paxTrevelType } from '../constants';
import { ANALTYTICS, GTM_ANALTYTICS, LOCATION_HASHES, AA_CONSTANTS } from '../constants/analytic';
import {
  API_ADDON_GET,
  API_ADDON_POST,
  API_PASSENGER_POST,
  USER_KEY_ADDON_GET,
  USER_KEY_ADDON_POST,
  USER_KEY_SAVE,
  DATA_ADDON_MAIN,
  DATA_ADDON_ADDITIONAL,
} from '../constants/apiEndpoint';
import { pushDataLayer } from '../functions/dataLayerEvents';
import {
  dateDiffToString,
  getDepartureDates,
  getOD,
  getFlightTime,
  getTripCode,
  getFlightNumber,
  isUnaccompaniedMinorSearch,
  makePaymentRequiredFlow,
} from '../functions/utils';
import AnalyticHelper from '../helpers/analyticHelper';
import { addonActions } from '../store/addonActions';
import eventService from './event.service';
import { addonCookies } from '../constants/cookies';
import AnalyticBuilder from '../utils/AnalyticBuilder';
import localStorageKeys from '../constants/localStorageKeys';
import LocalStorage from '../utils/LocalStorage';
import pushDDRumAction from '../utils/ddrumEvent';

const cookie = new Cookies();

const {
  NO_CODE,
  NO_DISPLAY_MESSAGE,
  NO_STATUS_CODE,
  NO_STATUS_MESSAGE,
  PAGE_LOAD,
  BE_ERROR,
  MS_API,
} = AA_CONSTANTS;

const apiResponse = 'api response';
const apiResponseInteractionType = 'API response';
const linkBtnClick = 'Link/ButtonClick';

/**
 *
 * @param {Number} startTime
 * @returns {Number}
 */
const getIsNominee = (documents) => {
  const documentNumber = documents?.[0]?.number || '';
  const documentNumberArray = documentNumber.split('|');
  if (documentNumberArray?.[0].trim() === paxTrevelType?.nominee) {
    return {
      isSelf: false,
      isNominee: true,
      NomineeId: documentNumberArray?.[1].trim(),
    };
  }
  if (documentNumberArray?.[0].trim() === paxTrevelType?.self) {
    return { isSelf: true, isNominee: false, NomineeId: '' };
  }
  return { isSelf: false, isNominee: false, NomineeId: '' };
};

const getFormattedLoyaltyInfo = (passengers) => {
  const newPassengerData = cloneDeep(passengers);

  newPassengerData.forEach((passenger, index) => {
    const travelDocuments = passenger?.travelDocuments || [];
    const ffnKey = passenger?.program?.number || null;
    const nomineeDetails = getIsNominee(travelDocuments);

    const loyaltyInfo = {
      isNominee: nomineeDetails?.isNominee || false,
      NomineeId: nomineeDetails?.NomineeId || '',
      selfTravel: nomineeDetails?.isSelf || false,
      FFN: ffnKey,
    };
    newPassengerData[index] = {
      ...cloneDeep(passenger),
      loyaltyInfo,
    };
  });
  return newPassengerData;
};

const calculateDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return Math.round(duration / 1000);
};

export const getAddonAemData = (dispatch) => {
  dispatch({
    type: addonActions.SET_ADDON_IS_LOADING,
    payload: true,
  });

  // DataDog for AEM Data
  const aemMainPayload = DD_RUM_PAYLOAD;
  const aemAdditionalPayload = DD_RUM_PAYLOAD;
  const aemMainAction = DD_RUM_EVENTS.AEM_DATA;
  const aemAdditionalAction = DD_RUM_EVENTS.AEM_ADDITIONAL_DATA;

  aemMainPayload.method = 'GET'; // request method
  aemMainPayload.mfname = MF_NAME; // MF name

  aemAdditionalPayload.method = 'GET'; // request method
  aemAdditionalPayload.mfname = MF_NAME; // MF name

  const startTimer = performance.now();

  const urls = [DATA_ADDON_MAIN, DATA_ADDON_ADDITIONAL];
  const fetchPromises = urls.map((url) => fetch(url, {
    method: 'get',
  }).then((response) => {
    aemMainPayload.statusCode = response.status;
    aemAdditionalPayload.statusCode = response.status;
    return response.json();
  }));
  return Promise.all(fetchPromises)
    .then((response) => {
      aemMainPayload.apiurl = DATA_ADDON_MAIN;
      aemAdditionalPayload.apiurl = DATA_ADDON_ADDITIONAL;

      const [mainData, additionalData] = [...response];
      const aemData = {
        mfData: { ...mainData },
        configJson: { ...additionalData },
      };
      aemMainPayload.responseTime = (performance.now() - startTimer) / 1000;
      aemAdditionalPayload.responseTime = (performance.now() - startTimer) / 1000;
      if (response?.errors) {
        let errorMessage = '';
        let errorCode = '';

        if (Array.isArray(response?.errors) && response?.errors.length > 0) {
          errorMessage = response?.errors[0]?.message;
          errorCode = response?.errors[0]?.code;
        } else {
          errorMessage = response?.errors?.message;
          errorCode = response?.errors?.code;
        }
        aemMainPayload.error = response?.errors;
        aemAdditionalPayload.error = response?.errors;
        const errorCatch = getErrorMsgForCode(errorCode);
        aemMainPayload.errorMessageForUser = errorCatch?.message || errorMessage;
        aemAdditionalPayload.errorMessageForUser = errorCatch?.message || errorMessage;
        aemMainPayload.errorMessage = errorMessage;
        aemAdditionalPayload.errorMessage = errorMessage;
      } else {
        if (mainData) {
          aemMainPayload.response = mainData;
        }
        if (additionalData) {
          aemAdditionalPayload.response = additionalData;
        }
      }
      dispatch({
        type: addonActions.ADDON_AEM_DATA,
        payload: {
          ...aemData,
        },
      });
      // push actions to Datadog event listner | page load AEM
      pushDDRumAction(aemMainAction, aemMainPayload);
      pushDDRumAction(aemAdditionalAction, aemAdditionalPayload);
      return { ...aemData };
    })
    .catch((err) => {
      let errorMessage = '';
      let errorCode = '';

      if (Array.isArray(err) && err.length > 0) {
        errorMessage = err[0]?.message;
        errorCode = err[0]?.code;
      } else {
        errorMessage = err?.message;
        errorCode = err?.code;
      }
      aemMainPayload.error = err;
      aemAdditionalPayload.error = err;
      const errorCatch = getErrorMsgForCode(errorCode);
      aemMainPayload.errorMessageForUser = errorCatch?.message || errorMessage;
      aemAdditionalPayload.errorMessageForUser = errorCatch?.message || errorMessage;
      aemMainPayload.errorMessage = errorMessage;
      aemAdditionalPayload.errorMessage = errorMessage;
      // push actions to Datadog event listner | page load AEM
      pushDDRumAction(aemMainAction, aemMainPayload);
      pushDDRumAction(aemAdditionalAction, aemAdditionalPayload);
      // eslint-disable-next-line no-console
      console.log(err?.message);
    })
    .finally(() => {
      dispatch({
        type: addonActions.SET_ADDON_IS_LOADING,
        payload: false,
      });
    });
};

const errorAnalytics = (response, startTime, url, isModifyFlow, action, component = '') => {
  const responsetime = calculateDuration(startTime);
  // const aemError = getErrorMsgForCode();
  const aemError = getErrorMsgForCode(response?.code);
  const { status } = response;

  const pageName = 'Addons Details';
  const previousPage = isModifyFlow ? 'Flight Booking Itinerary' : 'Passenger Details';
  const siteSection = isModifyFlow ? 'Modification Page' : 'Booking Page';

  pushDataLayer({
    event: GTM_ANALTYTICS.EVENTS.ERROR,
    data: {
      error_message: response.statusText || '',
      error_code: response.status || '',
      api_url: url,
      api_responsetime: responsetime,
      error_type: 'API',
      error_source: 'API',
      error_statusCode: aemError.code,
      error_statusMessage: aemError.message,
      error_displayMessage: aemError.message,
      page_name: pageName,
      previous_page: previousPage,
      error_shown: '1',
      site_section: siteSection,
    },
  });

  AnalyticBuilder()
    .setEvent(ANALTYTICS.DATA_CAPTURE_EVENTS.ERROR)
    .setPage({
      pageInfo: {
        pageName,
        siteSection,
      },
      error: {
        code: response.status,
        type: ANALTYTICS.TYPE.API,
        source: ANALTYTICS.SOURCE.API,
        apiURL: url,
        statusCode: aemError?.code,
        statusMessage: response.statusText,
        displayMessage: aemError?.message,
      },
    })
    .setInteractionType('Error')
    .send();

  AnalyticBuilder()
    .setEvent('UXerror')
    .setInteractionType('Error')

    .setPage({
      pageInfo: {
        pageName,
        siteSection,
      },
      error: {
        code: status != null
          ? String(status)
          : String(response?.request?.status || NO_CODE),
        type: BE_ERROR,
        source: MS_API,
        apiURL: url,
        statusCode: NO_STATUS_CODE,
        statusMessage: NO_STATUS_MESSAGE,
        displayMessage: aemError?.message || NO_DISPLAY_MESSAGE,
        action,
        component: action === 'Page load' ? pageName : component,
      },
    })
    .send();
};

const errorDataAnalytics = (response, startTime, url, isModifyFlow, action, component = '') => {
  const { errors, status } = response || { errors: false };
  const responsetime = calculateDuration(startTime);
  const { code, message } = getErrorMsgForCode(errors?.code);
  const pageName = 'Addons Details';
  const previousPage = isModifyFlow ? 'Flight Booking Itinerary' : 'Passenger Details';
  const siteSection = isModifyFlow ? 'Modification Page' : 'Booking Page';

  pushDataLayer({
    event: GTM_ANALTYTICS.EVENTS.API_RESPONSE,
    data: {
      error_message: response.errors.message,
      error_code: response.errors.code,
      api_responsetime: responsetime,
      api_response: errors,
      api_url: url,
      page_name: pageName,
      previous_page: previousPage,
      error_shown: '1',
      site_section: siteSection,
      api_code: 200,
    },
  });

  AnalyticBuilder()
    .setEvent(ANALTYTICS.DATA_CAPTURE_EVENTS.ERROR)
    .setInteractionType('Error')

    .setPage({
      pageInfo: {
        pageName,
        siteSection,
      },
      error: {
        code: errors?.code ?? status,
        type: 'business',
        source: 'MS-API',
        apiURL: url,
        statusCode: code,
        statusMessage: message,
        displayMessage: message,
      },
    })
    .send();

  AnalyticBuilder()
    .setEvent('UXerror')
    .setInteractionType('Error')

    .setPage({
      pageInfo: {
        pageName,
        siteSection,
      },
      error: {
        code: status ? String(status) : NO_CODE,
        type: BE_ERROR,
        source: MS_API,
        apiURL: url,
        statusCode: errors.code,
        statusMessage: errors.message,
        displayMessage: message,
        action,
        component: action === PAGE_LOAD ? pageName : component,
      },
    })
    .send();
};

const checkIfChangeFlow = (data) => {
  const hasTakenSSR = (arr) => arr?.some((item) => item?.takenssr?.length > 0);

  const ssrChangeFlow = data.ssr?.some((obj) => hasTakenSSR(obj?.journeySSRs)) ||
  data.ssr?.segments?.some((segment) => hasTakenSSR(segment?.segmentSSRs));

  const bundleChangeFlow = data.bundles?.some((bundle) => {
    return bundle.pricesByJourney?.some((journey) => {
      return journey?.includedSsrs?.some((includedSsr) => {
        return includedSsr?.upgradableSsrs?.segments?.some((segment) => {
          return hasTakenSSR(segment?.segmentSSRs);
        });
      });
    });
  });

  return ssrChangeFlow || bundleChangeFlow;
};

export const flightSrrAddon = async (
  dispatch,
  page,
  isMobile,
  isModifyFlow,
) => {
  dispatch({
    type: addonActions.SET_ADDON_IS_LOADING,
    payload: true,
  });
  const authToken = cookie.get(addonCookies.AUTH_TOKEN);
  const startTime = Date.now();
  let response = {};

  // DataDog for AEM Data
  const startTimer = performance.now();
  const flightSSRPayload = DD_RUM_PAYLOAD;
  const flightSSRAction = DD_RUM_EVENTS.FLIGHT_SSR;

  flightSSRPayload.method = 'GET';
  flightSSRPayload.mfname = MF_NAME;

  try {
    response =
    await fetch(API_ADDON_GET, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken?.token,
        user_key: USER_KEY_ADDON_GET,
      },
    });
    const res = await response.json();
    flightSSRPayload.apiurl = API_ADDON_GET;
    flightSSRPayload.statusCode = response?.status;
    if (response?.status) {
      res.status = cloneDeep(response.status);
    }
    const { metadata, data, errors } = res;
    delete res.metadata;

    const apiData = {
      code: metadata?.request.status,
      response: res,
      apiURL: metadata?.request.responseURL,
      responsetime: metadata?.duration,
    };
    flightSSRPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (data) {
      flightSSRPayload.response = data;

      if (page === CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
        const { journeyKey } = LocalStorage.getAsJson(
          localStorageKeys.checkin_passenger_details,
        );
        if (journeyKey) {
          data.ssr = [
            ...data.ssr.filter((ssr) => ssr.journeyKey === journeyKey),
            ...data.ssr.filter((ssr) => ssr.journeyKey !== journeyKey),
          ];
        }
      }
      dispatch({
        type: addonActions.SET_MEAL_COUPON_DATA,
        payload: {
          mealVoucherData: [],
        },
      });
      dispatch({
        type: addonActions.REMOVE_MEAL_FOR_COUPON,
        payload: {
          ssrMealCouponRemoveRequest: [],
        },
      });
      dispatch({
        type: addonActions.SET_PASSENGER_MEAL_DATA,
        payload: {
          passengerMealData: [],
        },
      });
      dispatch({
        type: addonActions.SET_FLIGHT_SSR_ADD_ON,
        payload: {
          getTrips: data,
          getAddonData: data,
          tripIndex: 0,
          getPassengerDetails: data?.Passengers,
          persistPassengerDetails: data?.Passengers,
          getSsrs: data?.ssrs,
          getJourneyBundlesSSR: data?.bundles,
          getDeplayListSSR: data?.ssrDisplayList,
          getJouneySsrList: data?.ssrs?.journeySSRs,
        },
      });
  
      if (checkIfChangeFlow(data)) {
        if (page !== CONSTANTS.PASSENGER_EDIT) {
          // we dont want to create separate history path if we add hashparam .
          // hence we adding this below line to replace the URL alone
          window.location.replace(window.location.pathname + window.location.search + '#addon');
        } else {
          window.location.hash = LOCATION_HASHES.ADDON;

        }
        dispatch({
          type: addonActions.IS_ADDON_CHANGE_FLOW,
          payload: true,
        });
      }
      if (!window.adobeDataLayer) window.adobeDataLayer = [];
      const airportCode = getTripCode(data);
      AnalyticHelper.addonLoad(page, isMobile, airportCode, isModifyFlow);
      AnalyticHelper.sendGetPaxSSR(page, apiData);
      const daysUntilDeparture = dateDiffToString(
        data?.ssr,
      );
      const { currencyCode } = data.bookingDetails || {};
      const departureDates = getDepartureDates(data.ssr);
      const flightTime = getFlightTime(data.ssr);
      const flightNumber = getFlightNumber(data.ssr);
      const originDest = getOD(data.ssr);
      pushDataLayer({
        data: {
          isMobile,
          originDest,
          currency_code: currencyCode,
          departureDates,
          daysUntilDeparture,
          flightTime,
          flightNumber,
        },
        event: 'page-load',
      });

      const responsetime = calculateDuration(startTime);

      AnalyticBuilder()
        .setEvent(apiResponse)
        .setInteractionType(apiResponseInteractionType)
        .setPage({
          api: {
            code: 200,
            response: res,
            responsetime,
            apiURL: API_ADDON_GET,
          },
        })
        .send();
    } else if (errors) {
      errorDataAnalytics(res, startTime, API_ADDON_GET, isModifyFlow, 'Page load');
      const error = getErrorMsgForCode(res?.code || res?.errors?.code) || {};

      flightSSRPayload.error = errors;
      flightSSRPayload.errorCode = res?.code || res?.errors?.code;
      flightSSRPayload.errorMessage = res?.errors?.message;
      flightSSRPayload.errorMessageForUser = error?.message;
      dispatch({
        type: addonActions.SET_ADDON_ERROR,
        payload: {
          active: true,
          message: error?.message,
        },
      });

      /* TD:
        dispatch({
          type: addonActions.SET_FLIGHT_SSR_ADD_ON,
          payload: {
            getAddonData: {
              Passengers: [],
              ssr: [],
            },
            getPassengerDetails: [],
          },
        }); */
      // Old Code:
      // throw new AxiosError(
      //   'Error',
      //   '',
      //   null,
      //   { responseURL: apiData.apiURL, metadata, status: apiData.code },
      //   res,
      // );
    } else {
      res.errors = cloneDeep(res);
      errorDataAnalytics(res, startTime, API_ADDON_GET, isModifyFlow, 'Page load');

      const error = getErrorMsgForCode(res?.code || res?.errors?.code) || {};

      flightSSRPayload.error = res.errors;
      flightSSRPayload.errorCode = res?.code || res?.errors?.code;
      flightSSRPayload.errorMessage = res?.errors?.message;
      flightSSRPayload.errorMessageForUser = error?.message;

      dispatch({
        type: addonActions.SET_ADDON_ERROR,
        payload: {
          active: true,
          message: error?.message,
        },
      });

      /* TD:
        dispatch({
          type: addonActions.SET_FLIGHT_SSR_ADD_ON,
          payload: {
            getAddonData: {
              Passengers: [],
              ssr: [],
            },
            getPassengerDetails: [],
          },
        }); */
    }
    // push actions to Datadog event listner | flight SSR
    pushDDRumAction(flightSSRAction, flightSSRPayload);
  } catch (err) {
    if (response?.status) {
      err.status = cloneDeep(response.status);
    }
    errorAnalytics(err, startTime, API_ADDON_GET, isModifyFlow, 'Page load');
    const apiData = {
      code: err?.request?.status,
      response: err?.response ?? {},
      apiURL: err?.request?.responseURL || err?.config?.url,
      responsetime:
          err?.metadata?.duration || err?.request?.metadata?.duration,
    };

    const error = getErrorMsgForCode(err?.code);
    AnalyticHelper.sendGetPaxSSR(page, apiData);

    flightSSRPayload.error = err;
    flightSSRPayload.errorCode = err?.code;
    flightSSRPayload.errorMessage = err?.message;
    flightSSRPayload.errorMessageForUser = error?.message;

    // push actions to Datadog event listner | flight SSR
    pushDDRumAction(flightSSRAction, flightSSRPayload);

    dispatch({
      type: addonActions.SET_ADDON_ERROR,
      payload: {
        active: true,
        message: error?.message,
        // message: err?.message,
      },
    });

    dispatch({
      type: addonActions.SET_FLIGHT_SSR_ADD_ON,
      payload: {
        getAddonData: {
          Passengers: [],
          ssr: [],
        },
        getPassengerDetails: [],
      },
    });
  } finally {
    dispatch({
      type: addonActions.SET_ADDON_IS_LOADING,
      payload: false,
    });
  }
};

export const passengerPost = async (payload, dispatch, page, isModifyFlow, isLoyaltyFlow) => {
  const startTime = Date.now();
  let addPassengerResponse = {};
  const updatedPayloadData = cloneDeep(payload);

  if (isLoyaltyFlow) {
    const newPayload = getFormattedLoyaltyInfo(payload?.data?.passengers);
    updatedPayloadData.data.passengers = newPayload;
  }

  // DataDog for AEM Data
  const passengerDetailsPayload = DD_RUM_PAYLOAD;
  const passengerDetailsAction = DD_RUM_EVENTS.PASSENGER_DETAILS;
  const startTimer = performance.now();

  passengerDetailsPayload.method = 'POST';
  passengerDetailsPayload.mfname = MF_NAME;
  passengerDetailsPayload.requestbody = updatedPayloadData;

  try {
    const authToken = cookie.get(addonCookies.AUTH_TOKEN);
    addPassengerResponse = await fetch(API_PASSENGER_POST, {
      method: 'post',
      body: JSON.stringify(updatedPayloadData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken?.token,
        user_key: USER_KEY_SAVE,
      },
      page,
    });
    return await addPassengerResponse.json().then((response) => {
      const error = getErrorMsgForCode(response?.code || response?.errors?.code) || {};

      passengerDetailsPayload.responseTime = (performance.now() - startTimer) / 1000;
      passengerDetailsPayload.apiurl = API_PASSENGER_POST;
      passengerDetailsPayload.statusCode = response?.status;

      if (!response?.data?.success) {
        passengerDetailsPayload.error = response?.errors;
        passengerDetailsPayload.errorCode = response?.errors?.code;
        passengerDetailsPayload.errorMessage = response?.errors?.message;
        passengerDetailsPayload.errorMessageForUser = error?.message;

        if (response?.code) {
          response.errors = cloneDeep(response);
        }
        if (addPassengerResponse?.status) {
          response.status = cloneDeep(addPassengerResponse.status);
        }
        errorDataAnalytics(response, startTime, API_PASSENGER_POST, isModifyFlow, linkBtnClick, 'Next');
        dispatch({
          type: addonActions.SET_ADDON_ERROR,
          payload: {
            active: true,
            message: error.message,
          },
        });

        dispatch({
          type: addonActions.IS_ADDON_SUBMITTED,
          payload: false,
        });
      } else {
        passengerDetailsPayload.response = response?.data;

        const responsetime = calculateDuration(startTime);
        localStorage.setItem(localStorageKeys.passengerPost, 'true');
        AnalyticBuilder()
          .setEvent(apiResponse)
          .setInteractionType(apiResponseInteractionType)
          .setPage({
            api: {
              code: 200,
              response,
              responsetime,
              apiURL: API_PASSENGER_POST,
            },
          })
          .send();
      }
      // push actions to Datadog event listner | page load AEM
      pushDDRumAction(passengerDetailsAction, passengerDetailsPayload);

      return response;
    });
  } catch (err) {
    const error = getErrorMsgForCode(err?.code);

    passengerDetailsPayload.error = err;
    passengerDetailsPayload.errorCode = err?.code;
    passengerDetailsPayload.errorMessage = err?.message;
    passengerDetailsPayload.errorMessageForUser = error?.message;

    // push actions to Datadog event listner | page load AEM
    pushDDRumAction(passengerDetailsAction, passengerDetailsPayload);

    dispatch({
      type: addonActions.SET_ADDON_ERROR,
      payload: {
        active: true,
        message: error?.message,
        // message: err?.message,
      },
    });

    dispatch({
      type: addonActions.IS_ADDON_SUBMITTED,
      payload: false,
    });

    if (addPassengerResponse?.status) {
      err.status = cloneDeep(addPassengerResponse.status);
    }

    errorAnalytics(err, startTime, API_PASSENGER_POST, isModifyFlow, linkBtnClick, 'Next');
    return { error: true };
  }
};

function seatMapEvent() {
  const dataToPass = {
    from: 'AddonApp',
    mfToOpen: CONSTANTS.EVENT_TOGGLE_SECTION_ACTION_SEAT,
  };
  const event = new CustomEvent(CONSTANTS.MAKE_ME_EXPAND_V2, {
    bubbles: true,
    detail: dataToPass,
  });
  // dispatching event to catch the event in seatselect component and toggle the addon
  document.dispatchEvent(event);
  // Old Code:
  // window.location.hash = LOCATION_HASHES.SEAT_SECTION;
}

function _sellSSRHandler(response) {
  const {
    getPassengerDetails,
    page,
    mfData,
    dispatch,
    isInternational,
    hasSeatAndEatBundle,
    has6ePrime,
    authToken,
  } = this;

  const {
    modificationContinueCtaPath = '/content/skyplus6e/in/en/book/itinerary.html',
    domesticCheckinContinueCtaPath = '/content/skyplus6e/in/en/check-ins/dangerous-goods.html',
    internationalCheckinContinueCtaPath = '/content/skyplus6e/in/en/check-ins/passport-visa-details.html',
    seatSelectionContinueCtaPath = '/content/skyplus6e/in/en/book/seat-selection-modification.html',
  } = mfData;

  const { INITIATE_PAYMENT, ADDON_MODIFY_PAGE_TYPE, ADDON_SEAT_SELECTION_MODIFICATION, ADDON_CHECKIN } = CONSTANTS;
  const isUnaccompaniedMinor = isUnaccompaniedMinorSearch(getPassengerDetails);
  if (page === ADDON_MODIFY_PAGE_TYPE) {
    // if it has seat and eat bundle then redirect to seat selection page
    window.location.href =
      (hasSeatAndEatBundle || has6ePrime) && !isUnaccompaniedMinor
        ? seatSelectionContinueCtaPath
        : modificationContinueCtaPath;
  } else if (page === ADDON_SEAT_SELECTION_MODIFICATION) {
    // Old code:
    // window.location.href = !isUnaccompaniedMinor ? seatSelectionContinueCtaPath : modificationContinueCtaPath;
    if (!isUnaccompaniedMinor) {
      seatMapEvent();
      dispatch({
        type: addonActions.IS_ADDON_SUBMITTED,
        payload: false,
      });
      dispatch({
        type: addonActions.IS_ADDON_EXPANDED,
        payload: false,
      });
      dispatch({
        type: addonActions.IS_ADDON_ENABLE_CHANGE,
        payload: true,
      });
    } else {
      window.location.href = modificationContinueCtaPath;
    }
  } else if (page === ADDON_CHECKIN && hasSeatAndEatBundle === false) {
    /** International >> Passport Form  -------------  Domestic >> Health Form */
    const href = isInternational
      ? internationalCheckinContinueCtaPath
      : domesticCheckinContinueCtaPath;

    makePaymentRequiredFlow(href, response.data.paymentRequired ?? true);
  } else if (isUnaccompaniedMinor) {
    const dataToPass = { from: 'AddonApp', token: authToken?.token };
    const event = new CustomEvent(INITIATE_PAYMENT, {
      bubbles: true,
      detail: dataToPass,
    });
    // dispatching event to initiate payment for unaccompanied minor
    document.dispatchEvent(event);
  } else {
    seatMapEvent();
    dispatch({
      type: addonActions.IS_ADDON_SUBMITTED,
      payload: false,
    });
    dispatch({
      type: addonActions.IS_ADDON_EXPANDED,
      payload: false,
    });
    dispatch({
      type: addonActions.IS_ADDON_ENABLE_CHANGE,
      payload: true,
    });
  }
}

export const sellSSRs = async ({
  getAddonData,
  sellAddonSsr,
  sellMealSsr,
  sellBundle,
  getPassengerDetails,
  dispatch,
  ssrRemoveRequest,
  mfData,
  page,
  isInternational,
  authToken,
  continueLabel,
  isModifyFlow,
  isMobile,
  isBackFlow,
  totalEarnPoints,
  totalBurnPoints
}) => {
  const body = {
    data: {
      ssrRemoveRequest: ssrRemoveRequest || [],
      ssrSellRequest: sellAddonSsr || [],
      mealSsrSellRequest: sellMealSsr || [],
      bundleSellRequest: sellBundle || [],
    },
  };

  const bundelSeatAndEat = sellBundle.findIndex(
    (bundle) => bundle.bundleCode === categoryCodes.mlst,
  );

  const bundle6ePrime = sellBundle.findIndex(
    (bundle) => bundle.bundleCode === categoryCodes.prim,
  );

  const successHandler = _sellSSRHandler.bind({
    hasSeatAndEatBundle: bundelSeatAndEat >= 0,
    has6ePrime: bundle6ePrime >= 0,
    getPassengerDetails,
    page,
    mfData,
    dispatch,
    isInternational,
    authToken,
  });

  /**
   * Adobe Analytic | Addon submit
   */

  const airportCode = getTripCode(getAddonData);

  let couponAvailed = '0';
  sellBundle?.forEach((trip) => {
    trip?.passengerKeys?.forEach((paxObj) => {
      if (paxObj?.couponcode && paxObj?.couponcode !== '') {
        couponAvailed = '1';
      }
    })
  })

  eventService.updateAnalytics(
    page,
    getPassengerDetails.length,
    continueLabel,
    isModifyFlow,
    airportCode,
    isMobile,
    isBackFlow,
    couponAvailed,
    totalEarnPoints,
    totalBurnPoints
  );
  // Data Layer Event
  pushDataLayer({
    data: {},
    event: 'dynx_rmkt',
  });

  if (
    body?.data?.ssrRemoveRequest.length === 0 &&
    body?.data?.ssrSellRequest.length === 0 &&
    body?.data?.mealSsrSellRequest.length === 0 &&
    body?.data?.bundleSellRequest.length === 0
  ) {
    successHandler({ data: { paymentRequired: false } });
    // Old Code:
    // dispatch({
    //   type: addonActions.IS_ADDON_SUBMITTED,
    //   payload: false,
    // });
    return;
  }
  const startTime = Date.now();
  let addonPostResponse = {};

  // DataDog for Sell SSR
  const sellSSRPayload = DD_RUM_PAYLOAD;
  const sellSSRAction = DD_RUM_EVENTS.SELL_SSR;

  sellSSRPayload.method = 'POST';
  sellSSRPayload.requestbody = body;
  sellSSRPayload.mfname = MF_NAME;

  try {
    addonPostResponse = await fetch(API_ADDON_POST, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken?.token,
        user_key: USER_KEY_ADDON_POST,
      },
      page,
    });
    await addonPostResponse.json()
      .then((response) => {
        sellSSRPayload.apiurl = API_ADDON_POST;
        sellSSRPayload.responseTime = Math.round((Date.now() - startTime) / 1000);
        sellSSRPayload.statusCode = response?.status;

        if (!response?.data?.success) {
          sellSSRPayload.error = response?.errors;

          const error = getErrorMsgForCode(response?.code || response?.errors?.code) || {};

          sellSSRPayload.error = response?.errors;
          sellSSRPayload.errorCode = response?.errors?.code;
          sellSSRPayload.errorMessage = response?.errors?.message;
          sellSSRPayload.errorMessageForUser = error?.message;

          if (response?.code) {
            response.errors = cloneDeep(response);
          }
          if (addonPostResponse?.status) {
            response.status = cloneDeep(addonPostResponse.status);
          }
          errorDataAnalytics(response, startTime, API_ADDON_POST, isModifyFlow, linkBtnClick, 'Next');
          dispatch({
            type: addonActions.SET_ADDON_ERROR,
            payload: {
              active: true,
              message: error.message,
            },
          });

          dispatch({
            type: addonActions.IS_ADDON_SUBMITTED,
            payload: false,
          });
        } else {
          const responsetime = calculateDuration(startTime);

          AnalyticBuilder()
            .setEvent(apiResponse)
            .setInteractionType(apiResponseInteractionType)
            .setPage({
              api: {
                code: 200,
                response,
                responsetime,
                apiURL: API_ADDON_POST,
              },
            })
            .send();
            
          successHandler(response);
        }
        sellSSRPayload.response = response.data;
        // push actions to Datadog event listner | sell ssr
        pushDDRumAction(sellSSRAction, sellSSRPayload);
      });
  } catch (err) {
    if (addonPostResponse?.status) {
      err.status = cloneDeep(addonPostResponse.status);
    }
    const error = getErrorMsgForCode(err?.code);
    dispatch({
      type: addonActions.IS_ADDON_SUBMITTED,
      payload: false,
    });
    dispatch({
      type: addonActions.IS_ADDON_ENABLE_CHANGE,
      payload: true,
    });
    dispatch({
      type: addonActions.SET_ADDON_ERROR,
      payload: {
        active: true,
        message: error?.message,
        // message: err?.message,
      },
    });
    errorAnalytics(err, startTime, API_ADDON_POST, isModifyFlow, linkBtnClick, 'Next');

    sellSSRPayload.error = err;
    sellSSRPayload.errorCode = err?.code;
    sellSSRPayload.errorMessage = err?.message;
    sellSSRPayload.errorMessageForUser = error?.message;
    // push actions to Datadog event listner | sell ssr
    pushDDRumAction(sellSSRAction, sellSSRPayload);
  } finally {
    // Old Code:
    // dispatch({
    //   type: addonActions.IS_ADDON_SUBMITTED,
    //   payload: false,
    // });
  }
};
