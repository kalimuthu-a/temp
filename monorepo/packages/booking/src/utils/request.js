import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { getDynamicPageInfo } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';

import pushGTMAnalytics from './gtmEvents';
import pushAdobeAnalytics from './analyticsEvent';
import { ANALTYTICS, DD_RUM_PAYLOAD, GTM_ANALTYTICS, MF_NAME } from '../constants';
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

/**
 *
 * @param {*} url
 * @param {*} param1
 * @returns {*}
 */
async function request(url, { headers, ...options }, analyticsData, ddRumAction = '') {
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
  };

  const bookingDataDogPayload = DD_RUM_PAYLOAD;

  try {
    return await fetch(url, requestOptions)
      .then(async (response) => {
        const responsetime = calculateDuration(startTime);
        bookingDataDogPayload.apiurl = url;
        bookingDataDogPayload.method = requestOptions?.method || 'GET';
        bookingDataDogPayload.mfname = MF_NAME;
        bookingDataDogPayload.requestbody = options?.body || options;
        bookingDataDogPayload.responseTime = responsetime;
        bookingDataDogPayload.statusCode = response?.status;

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

        pushAdobeAnalytics({
          event: ANALTYTICS.DATA_CAPTURE_EVENTS.UX_ERROR,
          data: {
            errorObj: {
              code: response.status?.toString(),
              type: 'BE Error',
              source: 'MS API',
              url,
              statusCode: 'No Status Code',
              statusMessage: 'No Status Message',
              displayMessage: 'No Message Displayed',
              ...analyticsData,
            },
          },
        });

        throw new Error('apierror');
      })
      .then((response) => {
        const { errors } = response || { errors: false };
        const { status, apiURL, responsetime, ...data } = response;

        if (errors) {
          const { code, message } = getErrorMsgForCode(errors?.code);

          bookingDataDogPayload.error = errors;
          bookingDataDogPayload.errorCode = errors?.code;
          bookingDataDogPayload.errorMessage = errors?.message;
          bookingDataDogPayload.errorMessageForUser = message;

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

          pushAdobeAnalytics({
            event: ANALTYTICS.DATA_CAPTURE_EVENTS.UX_ERROR,
            data: {
              errorObj: {
                code: status?.toString(),
                type: 'BE Error',
                source: 'MS API',
                apiURL,
                statusCode: errors?.code,
                statusMessage: errors?.message,
                displayMessage: message,
                ...analyticsData,
              },
            },
          });
        }

        bookingDataDogPayload.response = data;
    // push actions to Datadog event listner
    pushDDRumAction(ddRumAction, bookingDataDogPayload);

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

        return Promise.resolve(response);
      });
  } catch (error) {
    const aemError = getErrorMsgForCode();

    const responsetime = calculateDuration(startTime);

    bookingDataDogPayload.error = error;
    bookingDataDogPayload.errorCode = aemError.code;
    bookingDataDogPayload.errorMessage = error?.message || aemError?.message;
    bookingDataDogPayload.errorMessageForUser = aemError?.message;

    // push actions to Datadog event listner
    pushDDRumAction(ddRumAction, bookingDataDogPayload);

    pushGTMAnalytics({
      event: GTM_ANALTYTICS.EVENTS.ERROR,
      data: {
        error_message: 'Not Reachable', // error text
        error_code: '0',
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

    pushAdobeAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.ERROR,
      data: {
        errorObj: {
          code: 0,
          type: ANALTYTICS.TYPE.API,
          source: ANALTYTICS.SOURCE.API,
          apiURL: url,
          statusCode: aemError?.code,
          statusMessage: 'Not Reachable',
          displayMessage: aemError?.message,
        },
      },
    });

    pushAdobeAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.UX_ERROR,
      data: {
        errorObj: {
          code: 'No Code',
          type: 'BE Error',
          source: 'MS API',
          url,
          statusCode: 'No Status Code',
          statusMessage: 'No Status Message',
          displayMessage: 'No Message Displayed',
          ...analyticsData,
        },
      },
    });

    return Promise.reject(error);
  }
}

export default request;
