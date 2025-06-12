/* eslint-disable prefer-promise-reject-errors */
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { BROWSER_STORAGE_KEYS } from '../constants';
import pushAnalytic from './analyticEvents';

/**
 *
 * @param {Number} startTime
 * @returns {Number}
 */
const calculateDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return Math.round(duration / 1000);
};

/**
 *
 * @param {*} url
 * @param {*} param1
 * @returns {*}
 */
async function request(url, { headers, ...options }) {
  let token = '';
  const startTime = Date.now();

  try {
    ({ token } = JSON.parse(Cookies.get(BROWSER_STORAGE_KEYS.AUTH_TOKEN) ?? '{}'));
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

  try {
    return await fetch(url, requestOptions).then(async (response) => {
      const data = await response.json();
      let isError = false;
      let aemError = getErrorMsgForCode('');
      if (response.ok) {
        return Promise.resolve({
          ...data,
          status: response.status,
          url: response.url,
          isError,
          aemError,
        });
      }
      const { errors } = data || { errors: false };
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
              pageName: 'Refund Summary',
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
    if (!aemError) {
      aemError = getErrorMsgForCode('');
    }
    return Promise.reject({ ...error, aemError, isError: true });
  }
}

export default request;
