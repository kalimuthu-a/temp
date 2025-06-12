import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import UserIdentity from 'skyplus-design-system-app/src/functions/UserIdentity';
import get from 'lodash/get';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import isFuture from 'date-fns/isFuture';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';

import { catchErrorMsg, DATE_CONSTANTS, DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME, URLS } from '../constants';
import request from '../utils/request';
import pushDDRumAction from '../utils/ddrumEvent';
import { formatDate, getSessionToken } from '../utils/functions';

const { UTIL_CONSTANTS } = DATE_CONSTANTS;

const {
  CHECK_IN_MASTER,
  CHECK_IN_BOARDING_PASS,
  CHECK_IN_DANGEROUS_GOOD,
  CHECK_IN_PASSPORT_VISA,
  WEB_CHECK_IN,
  UNDO_WEB_CHECKIN,
} = Pages;

export const aemAdditionalData = () => {
  return request(URLS.BW_ADDITIONAL, {}, null, DD_RUM_EVENTS.GET_AEM_DATA).then(
    (res) => res.data.bookingWidgetAdditionalByPath.item,
  );
};

export const getSSR = () => {
  return request(
    URLS.GET_SSR,
    {
      headers: {
        user_key: URLS.USER_KEY_GET_COUNTRY,
      },
    },
    {
      errorAction: 'Pageload',
    },
    DD_RUM_EVENTS.GET_SSR_DATA,
  ).then((res) => res.data);
};

export const getJournies = () => {
  let apiResponse = {};
  try {
    apiResponse = request(
      URLS.GET_JOURNEYS,
      {
        headers: {
          user_key: URLS.USER_KEY_GET_JOURNEY,
        },
      },
      {
        errorAction: 'Pageload',
      },
      DD_RUM_EVENTS.GET_JOURNIES_DATA,
    );
  } catch (error) {
    // Error Handlimg
  }

  return apiResponse;
};

export const getPassengerHealthForm = () => {
  return request(
    URLS.TRAVEL_DOCUMENTS,
    {
      headers: {
        user_key: URLS.TRAVEL_DOCUMENTS_USER_KEY,
      },
    },
    {
      errorAction: 'Pageload',
    },
    DD_RUM_EVENTS.GET_PASSENGER_HEALTH_FORM,
  );
};

export const getItinerary = (data) => {
  const url = new URL(URLS.GET_ITINERARY);

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      url.searchParams.append(key, element);
    }
  }

  return request(
    url.href,
    {
      headers: {
        user_key: URLS.USER_KEY_GET_ITINERARY,
      },
    },
    {
      errorAction: 'Click',
    },
    DD_RUM_EVENTS.GET_ITINERARY_DATA,
  );
};

export const aemCheckinDangerousGoods = () => {
  return request(
    URLS.AEM_DANGEROURS_GOODS,
    {},
    null,
    DD_RUM_EVENTS.GET_DANGEROUS_GOODS,
  ).then((res) => ({
    dangerousGoods: res.data.checkinDangerousGoodsByPath.item,
  }));
};

export const aemCheckinBoardingPass = () => {
  return request(
    URLS.AEM_BOARDING_PASS,
    {},
    null,
    DD_RUM_EVENTS.CHECKING_BOARDPASS_AEM,
  ).then((res) => ({
    boardingPass: res.data.checkinBoardingPassByPath.item,
  }));
};

export const aemCheckinHomeByPath = () => {
  return request(
    URLS.AEM_CHECK_IN_MASTER,
    {},
    null,
    DD_RUM_EVENTS.AEM_CHECKIN_MASTER,
  ).then((res) => ({
    checkinHome: res.data.checkinHomeByPath.item,
  }));
};

export const aemCheckinPassenger = () => {
  return request(
    URLS.AEM_CHECK_IN_PASSENGER_DETAILS,
    {},
    null,
    DD_RUM_EVENTS.AEM_CHECKIN_PASSENGER,
  ).then((res) => ({
    checkinPassenger: res.data.checkinPassengerByPath.item,
  }));
};

export const aemCheckin = () => {
  return request(URLS.AEM_RETRIVE_PNR, {}, null, DD_RUM_EVENTS.GET_PNR).then(
    (res) => ({
      checkin: res.data.retrievePnrByPath.item,
    }),
  );
};

export const getAemData = (pageType) => {
  switch (pageType) {
    case CHECK_IN_BOARDING_PASS: {
      return [aemCheckinBoardingPass()];
    }

    case CHECK_IN_DANGEROUS_GOOD: {
      return [aemCheckinDangerousGoods()];
    }

    case UNDO_WEB_CHECKIN:
    case CHECK_IN_MASTER: {
      return [aemCheckinHomeByPath()];
    }

    case CHECK_IN_PASSPORT_VISA: {
      return [aemCheckinPassenger()];
    }

    case WEB_CHECK_IN: {
      return [aemCheckin()];
    }
    default:
      return [];
  }
};

export const getBoardingPass = (data) => {
  return request(
    URLS.GET_BOARDING_PASS_DETAILS,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        user_key: URLS.USER_KEY_GET_JOURNEY,
      },
    },
    {
      errorAction: 'Pageload',
    },
    DD_RUM_EVENTS.GET_BOARDING_PASS,
  );
};

export const getCountriesData = () => {
  return request(
    URLS.GET_COUNTRY,
    {
      headers: {
        user_key: URLS.USER_KEY_GET_COUNTRY,
      },
    },
    {
      errorAction: 'Pageload',
    },
    DD_RUM_EVENTS.GET_COUNTRIES_PAYLOAD,
  );
};

export const policyConsent = (pnr, journey, minorConsentSelection) => {
  let token = '';
  try {
    ({ token } = JSON.parse(Cookies.get('auth_token') ?? '{}'));
  } catch (e) {
    // @todo
  }

  const policyPayload = {
    data: {
      passengerInfos: [
      ],
    },
  };

  const data = journey?.journeysDetail?.passengers?.map((pItem) => {
    let minorConsent = false;
    if (pItem?.passengerTypeCode === paxCodes.children.code || pItem?.passengerTypeCode === paxCodes?.infant?.code) {
      minorConsent = true;
    }
    return {
      userId: '',
      ip: '',
      formName: 'DangerousGoodsForm',
      privacyPolicyConsent: true,
      genericConsent: false,
      umnrConsent: false,
      infantConsent: false,
      minorConsent,
      pnr,
      sessionToken: token,
      adultConsent: minorConsentSelection.size > 0 && minorConsentSelection.has(pItem?.passengerKey),
      seniorConsent: false,
      passengerName: `${pItem?.name?.first} ${pItem?.name?.last}`,
      passengerKey: pItem?.passengerKey,
      passengerType: pItem?.passengerTypeCode,
    };
  });
  policyPayload.data.passengerInfos = data;

  return request(
    URLS.POLICY_CONSENT,
    {
      method: 'POST',
      body: JSON.stringify(policyPayload),
      headers: {
        user_key: URLS.USER_KEY_POLICY_CONSENT,
      },
    },
    {
      errorAction: 'Click',
    },
    DD_RUM_EVENTS.POST_POLICY_CONSENT,
  );
};

export const postPassengerhealthform = (data) => {
  return request(
    URLS.PASSENGER_HEALTH_FORM,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        user_key: URLS.PASSENGER_HEALTH_FORM_USER_KEY,
      },
    },
    {
      errorAction: 'Click',
    },
    DD_RUM_EVENTS.POST_PASSENGER_HEALTH_FORM,
  );
};

export const postManualCheckin = (data) => {
  return request(
    URLS.MANUAL_CHECKIN,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        user_key: URLS.USER_KEY_MANUAL_CHECKIN,
      },
    },
    {
      errorAction: 'Click',
    },
    DD_RUM_EVENTS.POST_MANUAL_CHECKIN,
  );
};

export const postUnDoWebCheckin = (data) => {
  return request(
    URLS.UNDO_WEB_CHECKIN,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        user_key: URLS.UNDO_WEB_CHECKIN_USER_KEY,
      },
    },
    {
      errorAction: 'Click',
    },
    DD_RUM_EVENTS.UNDO_MANUAL_CHECKIN,
  );
};

export const postTravelDocuments = (data) => {
  
  return request(
    URLS.TRAVEL_DOCUMENTS,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        user_key: URLS.TRAVEL_DOCUMENTS_USER_KEY,
      },
    },
    {
      errorAction: 'Click',
    },
    DD_RUM_EVENTS.TRAVEL_DOCUMENTS,
  );
};

export const emailBoardinPass = (data) => {
  return request(
    URLS.EMAIL_BOARDING_PASS,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        user_key: URLS.EMAIL_BOARDING_PASS_USER_KEY,
      },
    },
    {
      errorAction: 'Click',
    },
    DD_RUM_EVENTS.SEND_EMAIL_BOARDING_PASS,
  );
};

export const getBookings = () => {
  if (UserIdentity.isAnonymousUser()) {
    return Promise.resolve({ data: [] });
  }

  return request(
    URLS.GET_BOOKINGS,
    {
      headers: {
        user_key: URLS.USER_KEY_GET_BOOKINGS,
      },
    },
    { errorAction: 'Pageload' },
    DD_RUM_EVENTS.GET_BOOKING_LIST,
  ).then((res) => {
    const { currentJourney = [] } = res.data || {};

    const bookings = [];

    currentJourney.forEach((row) => {
      const {
        recordLocator,
        journey,
        lastName,
        numberOfPassengers,
        bookingStatus,
        paymentStatus,
      } = row;
      journey.forEach((booking) => {
        const { webCheckinInfo } = booking;
        const { checkinStartTime, isWebCheckinStatus } = webCheckinInfo;

        if (UserIdentity.isSMEUser || UserIdentity.isSMEAdmin) {
          if (isWebCheckinStatus === 'OPEN') {
            bookings.push({
              ...booking,
              recordLocator,
              lastName,
              numberOfPassengers,
              bookingStatus,
              paymentStatus,
            });
          }
        } else if (
          (isFuture(new Date(checkinStartTime)) &&
            isWebCheckinStatus === 'CLOSE') ||
          isWebCheckinStatus === 'OPEN'
        ) {
          bookings.push({
            ...booking,
            recordLocator,
            lastName,
            numberOfPassengers,
            bookingStatus,
            paymentStatus,
          });
        }
      });
    });

    return { data: bookings };
  });
};

export const getPrivacyPolicyData = async () => {
  const token = getSessionToken();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      user_key: URLS.USER_KEY_POLICY_CONSENT,
      Authorization: token,
    },
  };
  return fetch(`${URLS.POLICY_CONSENT}?FormName=DangerousGoodsForm`, config).then((response) => response.json());
};

const aemService = async (url, key, defaultValue = {}) => {
  let data = {};
  try {
    data = await fetch(url).then((response) => response.json());
  } catch (error) {
    // Error Handling
  }
  return get(data, key, defaultValue);
};

export default aemService;

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

const getHotelsList = async (queryParm = '') => {
  const token = getSessionToken();
  const startTime = Date.now();
  const itineraryPayload = { ...DD_RUM_PAYLOAD };
  try {
    let url = URLS.API_HOTEL_SEARCH;
    if (queryParm) {
      url += `?${queryParm}`;
    }
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        user_key: URLS.USER_KEY_API_HOTEL_SEARCH,
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
    ddRumErrorEventHandler(
      error,
      URLS.API_HOTEL_SEARCH,
      startTime,
      itineraryPayload,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const getHotelData = async (boardingPasses, setHotelList) => {
  let date = '';
  let arrivalcity = '';
  let arrivalCityName = '';
  boardingPasses?.forEach((boardingPassItem) => {
    const isNearestJourneyDate = new Date(boardingPassItem?.segments?.designator?.arrival) > new Date();

    if (isNearestJourneyDate && !date) {
      date = formatDate(boardingPassItem?.segments?.designator?.arrival, UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD);
      arrivalcity = boardingPassItem?.segments?.designator?.destination;
      arrivalCityName = boardingPassItem?.segments?.designator?.destinationStationName;
    }
  });
  if (!date) {
    return;
  }

  const queryStrin = `arrivalDate=${date}&arrival=${arrivalcity}`; // arrivalDate=2024-05-31&arrival=MAA
  const { data } = await getHotelsList(queryStrin);
  const showMoreUrl = data?.data?.search_page_url;
  if (data?.data?.response?.length > 0) {
    setHotelList({ data: data.data.response, arrivalCityName, showMoreUrl });
  }
};
