import get from 'lodash/get';
import getMyBookingsEnvObj from '../utils/getEnvObj';
import { pageTypes } from '../constants/common';

const envKeys = {
  myBookings: '_env_my_bookings',
  myProfile: '_env_my_profile',
  helpPage: '_env_help_page',
  eWalletPage: '_env_your_transaction',
};

const { pageType } = window;

const aemService = async (url, key, defaultValue = {}) => {
  let data = {};
  try {
    data = await fetch(url).then((response) => response.json());
  } catch (error) {
    // Error Handling
  }
  return get(data, key, defaultValue);
};

export default aemService;

let API_LIST;
let envObj;
switch (pageType) {
  case pageTypes.myProfile:
    envObj = getMyBookingsEnvObj(envKeys.myProfile);
    break;
  case pageTypes.myBookings:
    envObj = getMyBookingsEnvObj(envKeys.myBookings);
    break;
  case pageTypes.helpPage:
    envObj = getMyBookingsEnvObj(envKeys.helpPage);
    break;
  case pageTypes.transactions:
    envObj = getMyBookingsEnvObj(envKeys.myProfile);
    break;
  default:
    envObj = getMyBookingsEnvObj();
    break;
}

if (pageType === pageTypes.myBookings && Object.keys(envObj).length > 0) {
  // make sure the one mandatory key,value should be there
  API_LIST = {
    AEM_MY_BOOKINGS: envObj.AEM_MY_BOOKINGS,
    GET_MY_BOOKINGS: envObj.GET_MY_BOOKINGS,
    GET_MY_HOTEL_BOOKINGS: envObj.GET_MY_HOTEL_BOOKINGS,
    USER_KEY_GET_MY_BOOKINGS: envObj.USER_KEY_GET_MY_BOOKINGS,
    USER_KEY_GET_MY_HOTEL_BOOKINGS: envObj.USER_KEY_GET_MY_HOTEL_BOOKINGS,
  };
}

if (pageType === pageTypes.helpPage && Object.keys(envObj).length > 0) {
  // make sure the one mandatory key,value should be there
  API_LIST = {
    AEM_MY_BOOKINGS: envObj.AEM_MY_BOOKINGS,
    GET_MY_BOOKINGS: envObj.GET_MY_BOOKINGS,
    USER_KEY_GET_MY_BOOKINGS: envObj.USER_KEY_GET_MY_BOOKINGS,
  };
}

if (Object.keys(envObj).length > 0 && pageType === pageTypes.myProfile) {
  // make sure the one mandatory key,value should be there
  API_LIST = {
    AEM_MY_PROFILE_MEMBER: envObj.AEM_MY_PROFILE_MEMBER,
    AEM_MY_PROFILE_AGENT: envObj.AEM_MY_PROFILE_AGENT,
    AEM_MY_PROFILE_SME_ADMIN: envObj.AEM_MY_PROFILE_SME_ADMIN,
    AEM_MY_PROFILE_SME_USER: envObj.AEM_MY_PROFILE_SME_USER,
    AEM_DELETE_ACCOUNT: envObj.AEM_DELETE_ACCOUNT,
    AEM_SETTINGS_MEMBER: envObj.AEM_SETTINGS_MEMBER,
    AEM_SETTINGS_AGENT: envObj.AEM_SETTINGS_AGENT,
    AEM_SETTINGS_SME_ADMIN: envObj.AEM_SETTINGS_SME_ADMIN,
    AEM_SAVED_PASSENGER_MEMBER: envObj.AEM_SAVED_PASSENGER_MEMBER,
    AEM_CORP_CONNECT: envObj.AEM_CORP_CONNECT,
    AEM_GST_MEMBER: envObj.AEM_GST_MEMBER,
    AEM_GST_SME_USER: envObj.AEM_GST_SME_USER,
    AEM_HELP_MEMBER: envObj.AEM_HELP_MEMBER,
    AEM_HELP_GUEST: envObj.AEM_HELP_GUEST,
    AEM_INDIGO_CASH: envObj.AEM_INDIGO_CASH,
    GET_MY_PROFILE: envObj.GET_MY_PROFILE,
    USER_KEY_GET_MY_PROFILE: envObj.USER_KEY_GET_MY_PROFILE,
    UPDATE_MY_PROFILE: envObj.UPDATE_MY_PROFILE,
    USER_KEY_UPDATE_MY_PROFILE: envObj.USER_KEY_UPDATE_MY_PROFILE,
    DELETE_ACCOUNT: envObj.DELETE_ACCOUNT,
    USER_KEY_DELETE_ACCOUNT: envObj.USER_KEY_DELETE_ACCOUNT,
    COUNTRY_LIST: envObj.COUNTRY_LIST,
    STATE_LIST: envObj.STATE_LIST,
    USER_KEY_COUNTRY_LIST: envObj.USER_KEY_COUNTRY_LIST,
    CORP_CONNECT: envObj.CORP_CONNECT,
    USER_KEY_CORP_CONNECT: envObj.USER_KEY_CORP_CONNECT,
    INDIGO_CASH: envObj.INDIGO_CASH,
    USER_KEY_INDIGO_CASH: envObj.USER_KEY_INDIGO_CASH,
  };
}

if ((pageType === pageTypes.transactions || pageType.length === 0)) {
  // make sure the one mandatory key,value should be there
  API_LIST = {
    SIX_EWALLET_AEMDATA: envObj.SIX_EWALLET_AEMDATA,
    GET_BALANCE: envObj.GET_BALANCE,
    GET_HISTORY: envObj.GET_HISTORY,
    USER_KEY: envObj.USER_KEY,
    CREATE_WALLET: envObj.CREATE_WALLET,
  };
}
export { API_LIST };
