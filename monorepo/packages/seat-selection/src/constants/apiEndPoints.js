import { getEnvObj, getSessionToken } from '../utils/index';

const token = getSessionToken();
const envObj = getEnvObj(); // taking from AEM config

let API_LIST_GET = null;
let API_LIST_POST = null;
let SEAT_MAIN_URL = '';
let SEAT_ADDITIONAL_URL = '';
let SEATS_RECOMMENDATION_URL = '';

if (Object.keys(envObj).length > 0) {
  API_LIST_GET = {
    SEATS_GET: envObj.SEATS_GET_URL,
    USER_KEY_GET: envObj.USER_KEY_SEATS_GET,
  };

  API_LIST_POST = {
    SEATS_POST: envObj.SEATS_POST_URL,
    USER_KEY_POST: envObj.USER_KEY_SEATS_POST,
  };

  SEAT_MAIN_URL = envObj.SEAT_MAIN_DATA;
  SEAT_ADDITIONAL_URL = envObj.SEAT_ADDITIONAL_DATA;
  SEATS_RECOMMENDATION_URL = envObj.SEATS_RECOMMENDATION_URL;
}

export const getConfig = {
  API_URL: API_LIST_GET?.SEATS_GET,
  REQUEST_HEADERS: {
    'Content-Type': 'application/json',
    user_key: API_LIST_GET?.USER_KEY_GET,
    Authorization: token,
  },
  REQUEST_METHOD: 'GET',
  REQUEST_BODY: null,
};

export const postConfig = {
  API_URL: API_LIST_POST?.SEATS_POST,
  REQUEST_HEADERS: {
    'Content-Type': 'application/json',
    user_key: API_LIST_POST?.USER_KEY_POST,
    Authorization: token,
  },
  REQUEST_METHOD: 'POST',
  REQUEST_BODY: null,
};

export const aemConfig = {
  SEAT_MAIN_URL,
  SEAT_ADDITIONAL_URL,
  REQUEST_OPTIONS: {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  },
};

export const recommendationsConfig = {
  url: SEATS_RECOMMENDATION_URL,
  REQUEST_OPTIONS: {
    method: 'GET',
    headers: {
      user_key: API_LIST_GET?.USER_KEY_GET,
      Authorization: token,
    },
  },
};
