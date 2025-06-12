/**
* getErrorMsgForCode - Function to get the error message for a given error code
* @param {string} errCode - Error Code. Eg 'E001', 'E002' etc
* @returns Error Object
* */

import { localStorageKeys } from '../constants';

export function getErrorMsgForCode(errCode = 'default') {
  let defaultError = {
    type: 'Error',
    code: 'default',
    message: 'Something went wrong, please try later',
  };
  try {
    const localStorageObj = JSON.parse(localStorage.getItem(localStorageKeys.GENERIC_DATA_CONTAINER_APP));
    const errorList = localStorageObj ? localStorageObj[localStorageKeys.ERROR_CODE_AEM_MAPPING] : [];
    if (errorList?.items?.length > 0) { // items is an array
      const error = errorList?.items?.find((item) => item?.code?.toLowerCase() === errCode.toLowerCase());
      const defaultErrorAem = errorList?.items?.find((item) => item?.code?.toLowerCase() === 'default');
      defaultError = defaultErrorAem || defaultError;
      if (error) return error;
    } else if (errorList?.items && errorList?.items[errCode]) { // items is an object
      const error = errorList?.items[errCode];
      if (error) return error;
    }
    return defaultError;
  } catch (error) {
    console.log('---catch error:getErrorMsgForCode::::', error);
    return defaultError;
  }
}
