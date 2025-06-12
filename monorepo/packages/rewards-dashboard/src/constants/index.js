/* eslint-disable guard-for-in */
import apiEnv from './index-env';
import common from './common';

const result = apiEnv;
for (const key in common) {
  result[key] = common[key];
}

export default result;

export const SCREEN_TYPE = {
  HELP: 'HELP',
  SETTINGS: 'SETTNGS',
  SAVED_PAYMENTS: 'SAVED_PAYMENTS',
  SAVED_PASSENGERS: 'SAVED_PASSENGERS',
  PROFILE: 'PROFILE',
  WISHLIST: 'WISHLIST',
  DELETE: 'DELETE',
  CASH: 'CASH',
  NOMINEE: 'NOMINEE',
};

export const REGEX_LIST = {
  INDIAN_MOBILE_NUMBER: /^[6-9]\d{9}$/,
  EXCEPT_INDIAN_MOBILE_NUMBER: /^\d{7,14}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/,
  NAME_ONLY_ALPHABET_SPACE: /[^a-zA-Z\s]/g,
};

export const URLS = {
  ...window?._user_profile,
};

export const BROWSER_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
};

export const dateFormats = {
  ddMMM: 'dd MMM',
  doMMM: 'do MMM',
  yyyyMMdd: 'yyyy-MM-dd',
  ddMMYYYY: 'dd-MM-yyyy',
  MMMMyyyy: 'MMMM yyyy',
  dob: 'dd-mm-yyyy',
};

export const ANALTYTICS = {
  INTERACTION: {
    PAGELOAD: 'Pageload',
    LINK_BUTTON_CLICK: 'Link/ButtonClick',
    POPUP_SHOWN: 'Pop Up Shown',
    COMPONENT_LOAD: 'Component Load',
  },
  EVENTS: {
    SECONDARY_CLICK: 'secondaryClick',
    CLICK: 'click',
    SEARCH_FLIGHT: 'searchFlight',
    ERROR: 'error',
  },
  DATA_CAPTURE_EVENTS: {
    BOOK_A_FLIGHT_CLICK: 'bookaflight',
    BOOK_A_STAY_CLICK: 'bookastay',
    RECENT_SEARCH_CLICK: 'recentsearchclick',
    SEARCH_FLIGHT_CLICK: 'searchflightclick',
    MODIFY_FLIGHT_CLICK: 'modifyflightclick',
    ENTER_PROMO_CODE: 'enterpromocode',
    POPUPLOAD_PROMO_CODE: 'popuploadpromocode',
    ENTER_PROMO_CONTINUE: 'enterpromocontinue',
    BOOKING_WIDGET_LOAD: 'bookingwidgetload',
    ERROR: 'error',
    API_RESPONSE: 'apiresonse',
  },
  TYPE: {
    API: 'api',
  },
  SOURCE: {
    API: 'api',
  },
};

export const GTM_ANALTYTICS = {
  EVENTS: {
    SEARCH_FLIGHT: 'search_flight',
    RECENT_SEARCH: 'recent_search',
    MODIFY_SEARCH: 'modify_search',
    BOOK_A_FLIGHT_CLICK: 'bookaflight',
    BOOK_A_STAY_CLICK: 'bookastay',
    ERROR: 'error',
    API_RESPONSE: 'api response',
  },
};

export const CONSTANTS = {
  LOYALTY_NOMINEE_DETAILS_UPDATED: 'LOYALTY_NOMINEE_DETAILS_UPDATED',
};
