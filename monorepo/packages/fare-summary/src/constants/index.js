export const PASSENGER_TYPE = {
  ADULT: 'ADT',
  SENIOUR: 'SRCT',
  CHILD: 'CHD',
  INFANT: 'INFT',
};

export const EXTRASEAT_TAG = {
  DOUBLE: 'EXT',
  TRIPLE: 'EXT2',
};

export const EVENTS = {
  REVIEW_SUMMARY_API_DATA: 'REVIEW_SUMMARY_API_DATA',
  ADDED_TO_FARE: 'ADDED_TO_FARE',
  MAKE_ME_EXPAND_V2: 'MAKE_ME_EXPAND_V2',
  ONCLICK_NEXT_FARE_SUMMARY_V2: 'ONCLICK_NEXT_FARE_SUMMARY_V2',
  EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER:
    'EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER',
  EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER:
    'EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER',
  EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER_MODIFICATION:
    'EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER_MODIFICATION',
  EVENT_FARE_SUMMARY_DATA_TRANSFER: 'EVENT_FARE_SUMMARY_DATA_TRANSFER',
  EVENT_TOGGLE_SECTION_ACTION_ADDON: 'addon', // 'EVENT_TOGGLE_SECTION_ACTION_ADDON',
  EVENT_TOGGLE_SECTION_ACTION_PAX_EDIT: 'passenger-edit', // 'EVENT_TOGGLE_SECTION_ACTION_PAX_EDIT',
  EVENT_TOGGLE_SECTION_ACTION_SEAT: 'seat-selection',
  AUTH_LOGIN_SUCCESS: 'loginSuccessEvent',
  AUTH_TOKEN_LOGOUT_SUCCESS: 'logoutSuccessEvent',
  LOYALTY_MEMBER_LOGIN_SUCCESS: 'LOYALTY_MEMBER_LOGIN_SUCCESS',
  INITIATE_PAYMENT: 'INITIATE_PAYMENT',
  EVENT_INITIATE_PAYMENT: 'INITIATE_PAYMENT',
  PASSENGER_ADDED: 'PASSENGER_ADDED',
  GET_PASSENGER_DATA_FROM_FARE: 'GET_PASSENGER_DATA_FROM_FARE',
  SKIP_PAYMENT: 'skipPayment',
  SKIP_SEAT: 'skipSeat',
  TRACK_DOM_CHANGE: 'TRACK_DOM_CHANGE',
  EVENT_FARE_SUMMARY_FARE_SPLIT: 'EVENT_FARE_SUMMARY_FARE_SPLIT',
};

export const BROWSER_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
};

export const CONSTANTS = {
  PASSENGER_PAGETYPE: 'passenger-edit',
  PAYWITH_CASH_LOWER: 'cash',
  MAKE_ME_EXPAND_V21: 'MAKE_ME_EXPAND_V21',
  PAYMENT_PATH: '/content/skyplus6e/in/en/book/itinerary.html',
  PRODUCT_CLASS_PROP_NAME: 'productClass',
  EXPRESS_CHECKOUT_FARE_TYPES: ['R', 'N', 'A', 'S'],
  ADD_ON_SEAT_SELECTION_CHECKIN: 'add-on-seat-selection-checkin',
  SEAT_SELECTION_MODIFY_PAGE_TYPE: 'seat-selection-modification',
  ADDON_SEAT_SELECTION_MODIFICATION: 'add-on-seat-selection-modification',
  SEAT_SELECTION_ADDON_CHECKIN: 'add-on-seat-selection-checkin',
  UMNR_LABEL: 'UMNR',
  PASSENGER_PATHNAME: '/book/passenger-edit.html',
  CPML: 'CPML',
  PRIME_VOCHER_SSRCODE: 'PRIMV',
  MEAL_VOUCHER_SSRCODE: '6EEatV',
  PRIME_SSRCODE: 'PRIM',
  LoyaltyV: 'LoyaltyV',
  ADDON_MODIFICATION_PAGE: 'add-on-modification',
  REGULAR_FARE: 'Regular Fare',
};

// datadog event list names
export const DD_RUM_EVENTS = {
  FARE_SUMMARY_DATA: 'fareSummaryData',
  FARE_CODE_MAPPING: 'fareCodeMapping',
  SSR_CODE_MAPPING: 'ssrCodeMapping',
  AEM_DATA: 'aemData',
};

export const MF_NAME = 'fare-summary';

// datadog event payload
export const DD_RUM_PAYLOAD = {
  apiurl: '', // api / aem url
  method: '', // request method
  mfname: '', // MF name
  requestbody: {}, // request body object
  response: {}, // response body
  responseTime: '',
  error: '', // error if any
  statusCode: '', // from the request
  errorCode: '', // if error then add the error code
  errorMessage: '', // from the API,
  errorMessageForUser: '', // error we are showing to the user
};

export const ENCRYPT_VALUE = 256;

export const WHATSAPP_COMPONENT = {
  DEFAULT: 'Whatsapp Pre Opted',
  SELECTED: 'Whatsapp new opted',
  UNSELECTED: 'Whatsapp not opted',
};

export const localStorageKeys = {
  bw_cntxt_val: 'bw_cntxt_val',
  journeyReview: 'journeyReview',
};

const SAVER_FARE = 'Saver fare';

export const fareTypeList = {
  F: 'Corporate fare',
  A: SAVER_FARE,
  O: 'Super 6E fare',
  N: SAVER_FARE,
  S: 'Sale fare',
  B: 'Zero bag fare',
  T: 'Tactical Fare',
  C: 'Promo Fare',
  J: 'Flexi plus fare',
  M: 'SME fare',
  R: SAVER_FARE,
};
