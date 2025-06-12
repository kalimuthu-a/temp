// services - API calls
// use only JS fetch to make API calls.
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import seatMain from '../../public/mock/aemMockData/seatMain.json';
import seatAdditional from '../../public/mock/aemMockData/seatAdditional.json';
import seatsRecommendationsMock from '../../public/mock/RecommendedSeatsData';
import seatMapDataMock from '../../public/mock/del-mum';
import { aemConfig, getConfig, postConfig, recommendationsConfig } from '../constants/apiEndPoints';
import { gtmPushAnalytic } from '../utils/gtmEvents';
import { pushAnalytic } from '../utils/analyticEvents';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import pushDDRumAction from '../utils/ddrumEvent';
// local purpose which is true only in local
const { useMock = false } = window._env_seat_select;

// eslint-disable-next-line max-len, sonarjs/cognitive-complexity
async function fetchApi(url = '', requestOptions = {}, isAemApi = false, action = '', component = '', ddrumAction = '') {
  const defaultUXErrors = {
    Code: 'No Status Code',
    Message: 'No Status Message',
  };
  const payloadDataDog = DD_RUM_PAYLOAD;
  try {
    const startTime = Date.now();
    const response = await fetch(url, { ...requestOptions });
    const statusCode = response?.status;
    const res = await response.json();

    let duration = Date.now() - startTime;
    duration = Math.round(duration / 1000);

    payloadDataDog.apiurl = url;
    payloadDataDog.requestbody = requestOptions;
    payloadDataDog.statusCode = statusCode;
    payloadDataDog.mfname = MF_NAME;
    payloadDataDog.method = requestOptions?.method;
    payloadDataDog.responseTime = duration;

    const payloadData = {
      response: {
        url,
        responseTime: duration,
        statusCode,
      },
    };

    const { data, errors } = res || {};

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
      payloadDataDog.error = errors;
      payloadDataDog.errorMessageForUser = errorCatch?.message || errorMessage;
      payloadDataDog.errorMessage = errorMessage;
      payloadDataDog.errorCode = errorCode;
    } else if (data) {
      payloadDataDog.response = data;
    }
    // push actions to Datadog event listner
    if (ddrumAction) pushDDRumAction(ddrumAction, payloadDataDog);
    if (!isAemApi) {
      pushAnalytic({
        data: {
          _event: data ? 'api' : 'error',
          response: { ...payloadData.response, responseData: data ?? errors },
        },
        event: data ? 'api' : 'error',
      });

      pushAnalytic({
        data: {
          _event: 'UXerror',
          response: { ...payloadData.response, responseData: data ?? { ...defaultUXErrors, ...errors } },
          action,
          component,
        },
      });

      gtmPushAnalytic({
        event: data ? 'api' : 'error',
        data: {
          ...payloadData,
          response: { ...payloadData.response, responseData: data ?? errors },
        },
      });
    }

    return res;
  } catch (error) {
    const response = {
      url,
      statusCode: 'No Code',
    };

    if (!isAemApi) {
      pushAnalytic({
        data: {
          _event: 'UXerror',
          response: { ...response, responseData: defaultUXErrors },
          action,
          component,
        },
      });
    }

    const errorCatch = getErrorMsgForCode(error?.code);
    payloadDataDog.error = error;
    payloadDataDog.errorMessageForUser = errorCatch?.message || error?.message;
    payloadDataDog.errorMessage = error?.message;
    payloadDataDog.errorCode = error?.code;

    // push actions to Datadog event listner
    if (ddrumAction) pushDDRumAction(ddrumAction, payloadDataDog);

    // Rethrow the error to handle it in respective jsx catch block
    throw new Error(error);
  }
}

export async function getSeatsRecommendations() {
  if (useMock) {
    return seatsRecommendationsMock;
  }

  const { url, REQUEST_OPTIONS } = recommendationsConfig;

  return fetchApi(url, REQUEST_OPTIONS, null, null, null, DD_RUM_EVENTS.AEM_SEAT_DATA);
}

// fetch getEntireSeats api
export async function getSeatMapData() {
  if (useMock) {
    return seatMapDataMock;
  }
  const { API_URL: url, REQUEST_METHOD: method, REQUEST_HEADERS: headers, REQUEST_BODY: body } = getConfig;

  return fetchApi(
    url,
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    },
    null,
    null,
    null,
    DD_RUM_EVENTS.ENTRIES_SEAT,
  );
}

// post sellSeats api
export async function postSellSeats(seatMapPostData) {
  const { API_URL: url, REQUEST_METHOD: method, REQUEST_HEADERS: headers } = postConfig;

  return fetchApi(
    url,
    {
      method,
      headers,
      body: JSON.stringify(seatMapPostData),
    },
    'ButtonClick',
    'Next',
    null,
    DD_RUM_EVENTS.POST_SEAT_DATA,
  );
}

export async function getSeatMainAemData() {
  if (useMock) {
    return seatMain;
  }

  const { SEAT_MAIN_URL, REQUEST_OPTIONS } = aemConfig;

  return fetchApi(SEAT_MAIN_URL, { REQUEST_OPTIONS }, true, null, null, DD_RUM_EVENTS.AEM_SEAT_DATA);
}

export async function getSeatAdditionalAemData() {
  if (useMock) {
    return seatAdditional;
  }

  const { SEAT_ADDITIONAL_URL, REQUEST_OPTIONS } = aemConfig;

  return fetchApi(SEAT_ADDITIONAL_URL, { REQUEST_OPTIONS }, true, null, null, DD_RUM_EVENTS.AEM_ADDITIONAL_SEAT);
}
