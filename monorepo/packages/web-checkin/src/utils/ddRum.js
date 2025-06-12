// function to catch errors for data dog

import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';

// eslint-disable-next-line import/prefer-default-export
export const ddRumErrorPayload = (payload, errorData) => {
  let errorMessage = '';
  let errorCode = '';
  const errorPayload = payload;

  if (Array.isArray(errorData) && errorData.length > 0) {
    errorMessage = errorData[0]?.message;
    errorCode = errorData[0]?.code;
  } else {
    errorMessage = errorData?.message;
    errorCode = errorData?.code;
  }
  const errorCatch = errorCode && getErrorMsgForCode(errorCode);
  errorPayload.error = errorData;
  errorPayload.errorMessageForUser = errorCatch?.message || errorMessage;
  errorPayload.errorMessage = errorMessage;
  errorPayload.errorCode = errorCode;

  return errorPayload;
};
