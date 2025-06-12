/* eslint-disable prefer-promise-reject-errors */
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';

import pushAnalytic from './analyticEvents';
import { PAGES } from '../components/constants';

import gtmEvents from './gtmEvents';
import { GTM_ANALTYTICS } from '../constants/analytic';

/**
 *
 * @param {Number} startTime
 * @returns {Number}
 */
const calculateDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return Math.round(duration / 1000);
};

const checkinErrorAnalytics = (url, errors) => {
  if ([PAGES.WEB_CHECK_IN, PAGES.CHECK_IN_HOME].includes(window.pageType)) {
    const params = new URL(url).searchParams;
    const pnr = params.get('recordLocator');
    gtmEvents({
      event: GTM_ANALTYTICS.EVENTS.CHECKIN_ERROR,
      data: {
        journey_flow: 'WebCheckIn Flow',
        page_name: 'CheckIn View',
        previous_page: 'CheckIn Initiate',
        api_error: errors?.message,
        PNR: pnr,
        Checkin_error: '1',
      },
    });
  }
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

  try {
    return await fetch(url, requestOptions).then(async (response) => {
      const data = await response.json();
      let isError = false;
      let aemError = getErrorMsgForCode(data?.errors?.code);
      if (response.ok) {
        if (data?.errors) {
          checkinErrorAnalytics(url, aemError);
        }

        return Promise.resolve({
          ...data,
          status: response.status,
          url: response.url,
          isError: Boolean(data.errors),
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
              pageName: 'Web Check-In',
            },
          },
          event: 'error',
        });
        aemError = { message };
      }

      return Promise.reject({ ...data, isError, aemError, errors });
    });
  } catch (error) {
    let { aemError } = error;
    if (!aemError) {
      aemError = getErrorMsgForCode('');
    }

    checkinErrorAnalytics(url, error?.errors);
    return Promise.reject({ ...error, aemError, isError: true });
  }
}

export default request;
