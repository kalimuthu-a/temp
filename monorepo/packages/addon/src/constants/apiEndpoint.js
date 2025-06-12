import { getEnvObj } from '../functions/utils';

const envObj = getEnvObj();

// TD: let API_ADDON_GET = 'https://api-dev-fetch-addons-skyplus6e.goindigo.in/v1/passenger/getpaxssr'; // for get addon ssr
let API_ADDON_GET = '/getpaxssr.json'; // for get addon ssr
let API_ADDON_POST = ''; // for POST addon ssr
let API_PASSENGER_POST = '';
let USER_KEY_ADDON_GET = '';
let USER_KEY_ADDON_POST = '';
let USER_KEY_SAVE = '';
// TD:
// let DATA_ADDON_MAIN = 'https://aem-dev-skyplus6e.goindigo.in/content/api/s6web/in/en/v1/addon-main.json';
// let DATA_ADDON_ADDITIONAL = 'https://aem-dev-skyplus6e.goindigo.in/content/api/s6web/in/en/v1/addon-additional.json';
let DATA_ADDON_MAIN = '/addonMain.json';
let DATA_ADDON_ADDITIONAL = '/addonAdditional.json';

if (Object.keys(envObj).length > 0 && envObj.API_ADDON_GET) {
  ({
    API_ADDON_GET,
    API_ADDON_POST,
    API_PASSENGER_POST,
    USER_KEY_ADDON_GET,
    USER_KEY_ADDON_POST,
    USER_KEY_SAVE,
    DATA_ADDON_MAIN,
    DATA_ADDON_ADDITIONAL,
  } = envObj);
}

export {
  API_ADDON_GET,
  API_ADDON_POST,
  API_PASSENGER_POST,
  USER_KEY_ADDON_GET,
  USER_KEY_ADDON_POST,
  USER_KEY_SAVE,
  DATA_ADDON_MAIN,
  DATA_ADDON_ADDITIONAL,
};
