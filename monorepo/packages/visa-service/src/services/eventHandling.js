import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import pushDDRumAction from '../utils/ddrumEvent';

/**
 *
 * @param {Number} startTime
 * @returns {Number}
 */
const calculateDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return Math.round(duration / 1000);
};

const ddRumSuccessEventHandler = (
  response,
  url,
  startTime,
  visaServicePayload,
) => {
  const payload = { ...visaServicePayload };
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

// eslint-disable-next-line sonarjs/cognitive-complexity
export const ddRumErrorEventHandler = (
  response,
  url,
  startTime,
  visaServicePload,
  aemApi,
// eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  let code = '';
  let message = '';
  if (response && response?.errors?.length > 0) {
    code = response?.errors?.length > 0
      ? response?.errors[0]?.code
      : response?.errors?.code || '';
    message = response?.errors?.length > 0
      ? response?.errors[0]?.message
      : response?.errors?.message || '';
  } else if (response?.errors) {
    code = response?.errors?.code || '';
    message = response?.errors?.message || '';
  }
  const errorMesg = getErrorMsgForCode(code);
  const responsetime = calculateDuration(startTime);
  const payload = { ...visaServicePload };
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

export const ddRumPayload = (header, requestbody, url) => {
  const visaServicePayload = { ...DD_RUM_PAYLOAD };
  visaServicePayload.method = header || 'GET';
  visaServicePayload.mfname = MF_NAME;
  visaServicePayload.requestbody = requestbody || {};
  visaServicePayload.apiurl = url;
  return visaServicePayload;
};

export const apiResponse = (
  response,
  header,
  requestbody,
  url,
  time,
  isAEM,
) => {
  const visaServicePayload = ddRumPayload(header, requestbody, url);

  if (response && response.errors) {
    ddRumErrorEventHandler(
      response,
      url || '',
      time,
      visaServicePayload,
      isAEM,
    );
    const { data } = response;
    return { data, isSuccess: false };
  }
  const { data, message } = response;
  ddRumSuccessEventHandler(response, url, time, visaServicePayload);

  return { data, message, isSuccess: true };
};
