export const variationCodes = ['srp', 'home', 'multicity'];

export const internationalTextVariationName =
  'AUTO_SUGGESTION_DESTINATION_INTERNATIONAL';

export const DISCOUNT_CODE_SENIOR_CITIZEN = 'SRCT';

export const INDIA_ISO_CODE = 'IN';

export const paxCodes = {
  adult: {
    code: 'ADT',
    discountCode: '',
    label: 'Adult',
  },
  seniorCitizen: {
    code: 'ADT',
    discountCode: 'SRCT',
    label: 'Senior Citizen',
  },
  children: {
    code: 'CHD',
    discountCode: '',
    label: 'Children',
  },
  infant: {
    code: 'INFT',
    discountCode: '',
    label: 'Infant',
  },
};

export const genderType = {
  1: 'Male',
  2: 'Female',
};

export const ssrCodes = {
  cpml: 'CPML',
  cptr: 'CPTR',
};

export const productClassCodes = {
  saver: 'R',
  flexi: 'J',
  super6e: 'O',
  corp: 'F',
  corpConnect: 'M',
  lite: 'B',
  promotional: 'C',
  tactical: 'T',
  next: 'BR',
  nextPlus: 'BC',
};

export const categoryCodes = {
  ffwd: 'FFWD', // Fast Forward
  prbg: 'PRBG', // 6E QuickBoard
  speq: 'SPEQ', // Sports Equipment
  bar: '6EBar', // 6E Bar / One for the skies
  lounge: 'Lounge', // Lounge
  goodNight: 'Goodnight', // Blanket, Pillow & Eye shade
  meal: 'Meal', // Tiffin / 6E Eats
  mealVoucher: '6EEatV',
  prim: 'PRIM', // 6E Prime
  mlst: 'MLST', // 6E Seat & Eat
  baggage: 'baggage', // Excess Baggage
  prot: 'PROT', // Travel Assistance
  brb: 'BRB', // Delayed and Lost Baggage Protection
  ifnr: 'IFNR', // Cancellation Insurance
  abhf: 'ABHF', // Additional Baggage
  seat: 'SEAT',
  primv: 'PRIMV', // 6E Prime voucher
  LoyaltyV : 'LoyaltyV',
};

export const documentTypeCode = {
  passport: 'P',
  visa: 'V',
};

export const tripType = {
  domestic: 'Domestic',
  international: 'International',
};

export const seatOptionCode = {
  double: 'EXT',
  triple: 'EXT2',
};

export const successCodes = [200, 201];

export const buttonVariation = {
  default: 'DEFAULT',
  loading: 'LOADING',
  secondary: 'SECONDARY',
  tertiary: 'TERTIARY',
  disabled: 'DISABLED',
};

export const ssrType = {
  journey: 'journey',
  segment: 'segment',
};

export const CONSTANTS = {
  EVENT_TOGGLE_SECTION: 'EVENT_TOGGLE_SECTION',
  EVENT_TOGGLE_SECTION_ACTION_ADDON: 'addon', // 'EVENT_TOGGLE_SECTION_ACTION_ADDON',
  EVENT_TOGGLE_SECTION_ACTION_PAX_EDIT: 'passenger-edit', // 'EVENT_TOGGLE_SECTION_ACTION_PAX_EDIT',
  EVENT_TOGGLE_SECTION_ACTION_SEAT: 'seat-selection', // 'EVENT_TOGGLE_SECTION_ACTION_SEAT',
  EVENT_TOGGLE_SECTION_ACTION_PAYMENT: 'EVENT_TOGGLE_SECTION_ACTION_PAYMENT',
  EVENT_GET_PASSENGER_DETAILS: 'EVENT_GET_PASSENGER_DETAILS',
  ADD_PASSENGER_PAYLOAD: 'ADD_PASSENGER_PAYLOAD',
  EVENT_REVIEWSUMMARY_DATA_CHANGE: 'EVENT_REVIEWSUMMARY_DATA_CHANGE',
  EVENT_REVIEWSUMMARY_OPENSLIDER: 'EVENT_REVIEWSUMMARY_OPENSLIDER',
  EVENT_REVIEWSUMMARY_ADDON_DATA: 'EVENT_REVIEWSUMMARY_ADDON_DATA',
  ADDON_MODIFY_PAGE_TYPE: 'add-on-modification',
  ADDON_SEAT_SELECTION_CHECKIN: 'add-on-seat-selection-checkin',
  ADDON_SEAT_SELECTION_MODIFICATION: 'add-on-seat-selection-modification',
  ADDON_CHECKIN: 'add-on-checkin',
  PASSENGER_EDIT: 'passenger-edit',
  EVENT_PASSENGEREDIT_TOGGLE_LOADING: 'EVENT_PASSENGEREDIT_TOGGLE_LOADING',
  EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER:
    'EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER',
  EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER_MODIFICATION:
    'EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER_MODIFICATION',
  INITIATE_PAYMENT: 'INITIATE_PAYMENT',
  EVENT_INITIATE_PAYMENT: 'INITIATE_PAYMENT',
  MAKE_ME_EXPAND_V2: 'MAKE_ME_EXPAND_V2',
  ONCLICK_NEXT_FARE_SUMMARY_V2: 'ONCLICK_NEXT_FARE_SUMMARY_V2',
  EVENT_TOGGLE_SECTION_ACTION_FARE_SUMMARY: 'faresummary',
  EVENT_FARE_SUMMARY_DATA_TRANSFER: 'EVENT_FARE_SUMMARY_DATA_TRANSFER',
  HEADER_CONTENT_UPDATE_EVENT: 'HEADER_CONTENT_UPDATE_EVENT',
  REFRESH_TOKEN_V2: 'refreshtoken-v2',
  BROWSER_STORAGE_KEYS: {
    TOKEN: 'auth_token', // cookie
    AUTH_USER: 'auth_user',
  },
  MODIFICATION_FLOW: 'Modification Flow',
};

export const DAY_PLACEHOLDER = 'DD';
export const MONTH_PLACEHOLDER = 'MM';
export const YEAR_PLACEHOLDER = 'YYYY';

export const STRING_TYPE = {
  CSS_ID: 'css_id',
};

export const CURRENCY_CODES = {
  INR: 'INR',
};

export const CLASS_PREFIX = 'skyplus';

export const FARE_TYPE = {
  SAVER_FARE: 'Saver Fare',
  SUPER_6E: 'Super 6E',
  FLEXI_FARE: 'Flexi Fare',
};

export const paxTrevelType = {
  self: 'SELF',
  nominee: 'NOMINEE',
};

export const LOGIN_SUCCESS = 'loginSuccessEvent';
export const LOGOUT_SUCCESS = 'logoutSuccessEvent';

export const LOYALTY_LOGIN_SUCCESS = 'LOYALTY_MEMBER_LOGIN_SUCCESS';

// datadog event list names
export const DD_RUM_EVENTS = {
  FLIGHT_SSR: 'flightSSRAddon',
  AEM_DATA: 'aemData',
  AEM_ADDITIONAL_DATA: 'aemAdditionalData',
  PASSENGER_DETAILS: 'passengerDetails',
  SELL_SSR: 'sellSsr',
};

export const MF_NAME = 'addon';

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

export const primeVoucherLabel = '6E Prime Voucher';
export const mealVoucherLabel = '6E Eat Voucher';
export const SAVER = 'saver';
