/* eslint-disable no-console */
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import map from 'lodash';

export const validator = (regEx) => (value) => {
  if (!value) {
    return false; // Always return false for falsy values
  }
  const stringifiedValue = `${value}`;
  return !!regEx.exec(stringifiedValue); // Use exec() method instead
};

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_login_sso';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    console.error(error);
    return defaultObj;
  }
};

export const formatDate = (dateString, separator = '/') => {
  // "1994-09-14T00:00:00" to 14/09/1994 or 14-09-1994 if separator is '-'
  // "1994-09-14" to 14/09/1994 or 14-09-1994 if separator is '-'
  // "14/09/1994" to 14/09/1994 or 14-09-1994 if separator is '-'
  // "14-09-1994" to 14/09/1994 or 14-09-1994 if separator is '-'

  // If the dateString is empty, return an empty string
  if (!dateString) {
    return '';
  }

  const ddMmYyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  const ddMmYyyyDashRegex = /^\d{2}-\d{2}-\d{4}$/;

  if (ddMmYyyyRegex.test(dateString)) {
    return dateString.replace(/\//g, separator);
  }

  if (ddMmYyyyDashRegex.test(dateString)) {
    return dateString.replace(/-/g, separator);
  }

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}${separator}${month}${separator}${year}`;
};

export const formatDatePayload = (inputDate) => {
  const [year, month, day] = inputDate.split('-');
  return `${day}-${month}-${year}`;
};

export const getParameterValue = (urlString, parameterName) => {
  const url = new URL(urlString);
  const { searchParams } = url;
  return searchParams.get(parameterName);
};

export const loyaltyMemberInfoWithFFN = (loyaltyMemberInfo = {}) => {
  // If FFN is not present, assign ffn to FFN
  if (!loyaltyMemberInfo) {
    return {};
  }
  const updatedLoyaltyMemberInfo = { ...loyaltyMemberInfo };
  updatedLoyaltyMemberInfo.FFN = updatedLoyaltyMemberInfo.FFN || updatedLoyaltyMemberInfo.ffn;
  return updatedLoyaltyMemberInfo;
};

// function to catch errors for data dog
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

export const maskName = (name) => {
  if (!name || name.length <= 2) {
    return '*'.repeat(name.length);
  }
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

export const maskString = (array) => {
  const size = array?.length;
  const masked = array.substring(0, 1) +
    'x'.repeat(size - 2) +
    array.substring(size - 1, size);
  return masked;
};

export const maskEmail = (array) => {
  const dividedArray = array?.split('@');
  if (dividedArray?.length < 1) {
    console.error("Email is invalid");
  }
  return maskString(dividedArray[0]);
};
 