/* eslint-disable prefer-promise-reject-errors */
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';

import pushAnalytic from './analyticEvents';
import { DD_RUM_PAYLOAD, MF_NAME } from '../constants';
// eslint-disable-next-line import/no-cycle
import { ddRumErrorPayload } from '.';
import pushDDRumAction from './ddrumEvent';

/**
 *
 * @param {Number} startTime
 * @returns {Number}
 */
const calculateDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return Math.round(duration / 1000);
};
export const calculateDaysSince = (pastDate) => {
  const currentDate = new Date();
  const timeDifference = new Date(pastDate) - currentDate;
  return Math.round(timeDifference / (1000 * 60 * 60 * 24));
};
/**
 *
 * @param {*} url
 * @param {*} param1
 * @returns {*}
 */
async function request(url, { headers, ...options }, ddRumAction) {
  let token = '';
  const startTime = Date.now();

  try {
    ({ token } = JSON.parse(Cookies.get('auth_token') ?? '{}'));
  } catch (e) {
    // Error Handling
  }

  const requestOptions = {
    ...options,
    headers: {
      ...(token && { Authorization: token }),
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  let ddRumRequestPayload = DD_RUM_PAYLOAD;
  const startTimer = performance.now();

  try {
    return await fetch(url, requestOptions).then(async (response) => {
      const data = await response.json();

      ddRumRequestPayload.apiurl = url;
      ddRumRequestPayload.method = 'GET';
      ddRumRequestPayload.mfname = MF_NAME;
      ddRumRequestPayload.responseTime = (performance.now() - startTimer) / 1000;
      ddRumRequestPayload.statusCode = response?.status;

      let isError = false;
      let aemError = getErrorMsgForCode('');
      if (response.ok) {
        ddRumRequestPayload.response = data;
        // push actions to Datadog event listner
        pushDDRumAction(ddRumAction, ddRumRequestPayload);

        return Promise.resolve({
          ...data,
          status: response.status,
          url: response.url,
          isError,
          aemError,
        });
      }
      const { errors } = data || { errors: false };
      if (errors || !response.ok) {
        ddRumRequestPayload = ddRumErrorPayload(ddRumRequestPayload, errors);
        // push actions to Datadog event listner
        pushDDRumAction(ddRumAction, ddRumRequestPayload);
      }

      if (errors) {
        isError = true;
        const { code, message } = getErrorMsgForCode(errors?.code);
        const responsetime = calculateDuration(startTime);

        const errorMesg = {
          apiURL: response.url,
          code,
          displayMessage: message,
          source: 'MS-API',
          statusCode: response.status,
          statusMessage: response.statusText,
          type: 'business',
          responsetime,
        };

        pushAnalytic({
          data: {
            _event: 'error',
            errorMesg,
            pageInfo: {
              pageName: 'Web Check-In',
            },
          },
          event: 'error',
        });
        aemError = { message };
      }

      return Promise.reject({ ...data, isError, aemError });
    });
  } catch (error) {
    let { aemError } = error;

    ddRumRequestPayload = ddRumErrorPayload(ddRumRequestPayload, aemError);
    // push actions to Datadog event listner
    pushDDRumAction(ddRumAction, ddRumRequestPayload);

    if (!aemError) {
      aemError = getErrorMsgForCode('');
    }
    return Promise.reject({ ...error, aemError, isError: true });
  }
}

export default request;
