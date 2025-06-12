import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { getDynamicPageInfo } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';

import pushGTMAnalytics from './gtmEvents';
import pushAdobeAnalytics from './analyticEvents';
import { ANALTYTICS, GTM_ANALTYTICS } from '../constants';

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

  const { siteSection, pageName } = getDynamicPageInfo();
  const previousPage = pageName === 'Homepage';

  try {
    ({ token } = JSON.parse(Cookies.get('auth_token') ?? '{}'));
  } catch (e) {
    // handling
  }

  const requestOptions = {
    ...options,
    headers: {
      ...(token && { Authorization: token }),
      'Content-Type': 'application/json',
      ...headers,
    },
    mode: 'cors',
  };

  try {
    return await fetch(url, requestOptions)
      .then(async (response) => {
        const responsetime = calculateDuration(startTime);

        if (response.ok) {
          const data = await response.json();
          return Promise.resolve({
            ...data,
            status: response.status,
            apiURL: response.url,
            responsetime,
          });
        }

        const aemError = getErrorMsgForCode();

        pushGTMAnalytics({
          event: GTM_ANALTYTICS.EVENTS.ERROR,
          data: {
            error_message: response.statusText, // error text
            error_code: response.status,
            api_url: response.url,
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

        pushAdobeAnalytics({
          event: ANALTYTICS.DATA_CAPTURE_EVENTS.ERROR,
          data: {
            errorObj: {
              code: response.status,
              type: ANALTYTICS.TYPE.API,
              source: ANALTYTICS.SOURCE.API,
              apiURL: response.url,
              statusCode: aemError?.code,
              statusMessage: response.statusText,
              displayMessage: aemError?.message,
            },
          },
        });

        const error = new Error(response.statusText);
        error.aemError = aemError;
        error.response = response;
        error.success = false;

        return Promise.reject(error);
      })
      .then((response) => {
        const { errors } = response || { errors: false };
        const { status, apiURL, responsetime, ...data } = response;
        let success = true;
        let aemError = getErrorMsgForCode('');

        if (errors) {
          success = false;
          const { code, message } = getErrorMsgForCode(errors?.code);
          aemError = { code, message };

          pushGTMAnalytics({
            event: GTM_ANALTYTICS.EVENTS.API_RESPONSE,
            data: {
              error_message: response.errors.message, // error text
              error_code: response.errors.code,
              api_responsetime: response.responsetime,
              api_response: errors,
              api_url: url,
              page_name: pageName,
              previous_page: previousPage,
              error_shown: '1',
              site_section: siteSection,
              api_code: 200,
            },
          });

          pushAdobeAnalytics({
            event: ANALTYTICS.DATA_CAPTURE_EVENTS.ERROR,
            data: {
              errorObj: {
                code: errors?.code ?? status,
                type: 'business',
                source: 'MS-API',
                apiURL,
                statusCode: code,
                statusMessage: message,
                displayMessage: message,
              },
            },
          });
        }
        pushAdobeAnalytics({
          event: ANALTYTICS.DATA_CAPTURE_EVENTS.API_RESPONSE,
          data: {
            apiresponse: {
              code: status,
              response: data,
              responsetime,
              apiURL,
            },
          },
        });

        return Promise.resolve({ ...data, success, aemError });
      });
  } catch (error) {
    const aemError = getErrorMsgForCode();
    error.aemError = aemError;
    error.success = false;

    return Promise.reject(error);
  }
}

export default request;
