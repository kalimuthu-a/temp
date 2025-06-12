import cockpit3x3 from '../images/3X3.png';
import cockpit2x2 from '../images/2X2.png';
import cockpit3x4x3 from '../images/3x4x3.png';

// create constants related to MF
export const CONSTANTS = {
  MEMBER: 'Member',
  ANONYMOUS: 'Anonymous',
  TOGGLE_LOGIN_POPUP: 'toggleLoginPopupEvent',
  LOGIN_POPUP: 'loginSSOPopup',
  ENROLL_SSO_LOYALTY_POPUP: 'EnrollSSOloyalty',
  BROWSER_STORAGE_KEYS: {
    TOKEN: 'auth_token', // cookie
  },
  SLIDER_TAB_KEYS: {
    FLIGHT: 'flight',
    FARE: 'Fare',
    BAGGAGE: 'baggage',
    CANCEL: 'cancel',
  },
  SAVER_FARE_TYPES: ['R', 'N', 'A', 'S', ''],
  BOEING_FLIGHT: '77W',
  FREE_MEAL_HIGHLIGHTER_CLASS: 'free-meal-highlighter',
  SEAT_WRAPPER: 'seats-wrapper',
  SEAT: 'seat',
  SEAT_SELECT_STRING: 'Seat-Select',
  EVENT_TOGGLE_SECTION: 'EVENT_TOGGLE_SECTION',
  EVENT_TOGGLE_SECTION_ACTION_ADDON: 'EVENT_TOGGLE_SECTION_ACTION_ADDON',
  EVENT_TOGGLE_SECTION_ACTION_PAX_EDIT: 'EVENT_TOGGLE_SECTION_ACTION_PAX_EDIT',
  EVENT_TOGGLE_SECTION_ACTION_SEAT: 'EVENT_TOGGLE_SECTION_ACTION_SEAT',
  EVENT_TOGGLE_SECTION_ACTION_PAYMENT: 'EVENT_TOGGLE_SECTION_ACTION_PAYMENT',
  EVENT_GET_PASSENGER_DETAILS: 'EVENT_GET_PASSENGER_DETAILS',
  ADD_PASSENGER_PAYLOAD: 'ADD_PASSENGER_PAYLOAD',
  EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER:
    'EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER',
  EVENT_REVIEWSUMMARY_OPENSLIDER: 'EVENT_REVIEWSUMMARY_OPENSLIDER',
  EVENT_REVIEWSUMMARY_DATA_CHANGE: 'EVENT_REVIEWSUMMARY_DATA_CHANGE',
  HEADER_CONTENT_UPDATE_EVENT: 'HEADER_CONTENT_UPDATE_EVENT',
  EXTRASEATTAG_DOUBLE: 'DOUBLE',
  EXTRASEATTAG_TRIPLE: 'TRIPLE',
  SEATTYPE_MIDDLE: 'middle',
  SEATTYPE_AISLE: 'aisle',
  SEATTYPE_WINDOW: 'window',
  STRING_TRUE: 'true',
  STRING_FALSE: 'false',
  SEATTYPE_WING: 'wing',
  SEATTYPE_EXITROW: 'exitrow',
  SEATTYPE_LEGROOM: 'legroom',
  SEATTYPE_RECLINE: 'recline',
  SEATTYPE_CHILD: 'child',
  SEATTYPE_INFANT: 'infant',
  SEATTYPE_BASSINET: 'bassinet',
  SEAT_SELECTION_MODIFY_PAGE_TYPE: 'seat-selection-modification',
  ADDON_SEAT_SELECTION_MODIFICATION: 'add-on-seat-selection-modification',
  SEAT_SELECTION_ADDON_CHECKIN: 'add-on-seat-selection-checkin',
  EVENT_PASSENGEREDIT_TOGGLE_LOADING: 'EVENT_PASSENGEREDIT_TOGGLE_LOADING',
  CHECKIN_ACTIVE_JOURNEY_KEY: 'a_j',
  ADDON_CHECKIN: 'add-on-checkin',

  SEAT_SELECT_ERRORS: {
    JOURNEY_REGEX: /{journey}/g,
    ERROR_CATEGORY_SEAT_SELECT_CHECK_IN: 'Checkin',
    ERROR_CODE_SEAT_SELECT_CHECK_IN: 'connectingFlight',
  },

  LEGEND_COLORS: {
    XL_COLORS_ARRAY: ['#583079', '#5900a1'],
    PAID_COLORS_ARRAY: [
      '#0f388e',
      '#1565c0',
      '#056ae8',
      '#0072ff',
      '#3187f2',
      '#1565c0',
    ],
    0: {
      backgroundColor: '#badef8',
    },
    Assigned: {
      backgroundColor: '#15b06d',
    },
    Occupied: {
      backgroundColor: '#ededed',
    },
    'Non-reclining-seat': {
      backgroundColor: '#dbdbdb',
      'border-right': '3px solid red',
    },
  },
  FLIGHT_TYPE: {
    CONNECT: 'Connect',
  },
  EXTRASEATTAG: ['EXTRASEAT', 'EXTRASEAT2'],
  MAKE_ME_EXPAND_V2: 'MAKE_ME_EXPAND_V2',
  ADDON: 'addon',
  SEAT_SELECTION_MF: 'seat-selection',
  SEAT_CLASS_PREMIUM: 'premium',
  SEAT_CLASS_XL: 'xl',
  SEAT_CLASS_FREE: 'free',
  SEAT_CLASS_FEMALE: 'female',
  SEAT_CLASS_FEMALE_SELECTED: 'female-selected',
  SEAT_CLASS_NON_RECLINE: 'non-recline',
  SEAT_CLASS_BASINET: 'basinet',
  SEAT_CLASS_DISABLED: ' disabled',
  SEAT_CLASS_NEXT: ' next',
  XL_SEAT: 'xlSeat',
  PREMIUM_SEAT: 'premiumSeat',
  FREE_SEAT: 'freeSeat',
  ALL_SEAT: 'allSeats',
  STANDARd_SEAT: 'standardSeat',
  EXIT_ROW: 'EXIT',
};

const cockpitImageMap = {
  '3x3': cockpit3x3,
  '2x2': cockpit2x2,
  '3x4x3': cockpit3x4x3,
};

const getAircraftCockpitImages = (aircraftImageMapping) => {
  return Object.entries(aircraftImageMapping).reduce((acc, [aircraft, imageType]) => {
    acc[aircraft] = cockpitImageMap[imageType] || cockpit3x3;
    return acc;
  }, { default: cockpit3x3 });
};

export const AIRCRAFT_COCKPIT_IMAGES = getAircraftCockpitImages(
  window._env_seat_select?.AIRCRAFT_COCKPIT_IMAGES
);

export const M_AIRCRAFT_PREVIEW_SCALES = window._env_seat_select?.M_AIRCRAFT_PREVIEW_SCALES;
export const AIRCRAFT_PREVIEW_SCALES = window._env_seat_select?.AIRCRAFT_PREVIEW_SCALES;
export const M_AIRCRAFT_PREVIEW_SCALES_FIGMA = window._env_seat_select?.M_AIRCRAFT_PREVIEW_SCALES_FIGMA;
export const AIRCRAFT_PREVIEW_SCALES_FIGMA = window._env_seat_select?.AIRCRAFT_PREVIEW_SCALES_FIGMA;

export const SCALE_10_COL_AIRCRAFT = 0.10;
export const AIRCRAFT_BORDER_RIGHT = 100;

export const SEATMAP_WRAPPER_CLASS = 'seat-map-wrapper';
export const SEATMAP_WRAPPER_ORIGINAL_CLASS = 'original';

export const SELL_SEAT_CUSTOM_EVENT = 'ONCLICK_NEXT_FARE_SUMMARY_V2';
export const SEND_SELECTED_SEATS_INFO_TO_REVIEW_SUMMARY = 'EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER';
export const FARE_SUMMARY_LOADING_EVENT = 'EVENT_FARE_SUMMARY_DATA_TRANSFER';
export const dateFormats = {
  ddMMM: 'dd MMM',
  doMMM: 'do MMM',
  yyyyMMdd: 'yyyy-MM-dd',
  ddMMYYYY: 'dd-MM-yyyy',
  MMMMyyyy: 'MMMM yyyy',
};

export const PASSENGER_TYPE = {
  ADULT: 'ADT',
};

export const SEAT_SELECTION_KEYS = {
  DEFAULT: 'default',
  SELECTED: 'selected',
  UNSELECTED: 'unselected',
};

export const modificationPageTypes = [
  CONSTANTS.ADDON_SEAT_SELECTION_MODIFICATION,
  CONSTANTS.SEAT_SELECTION_MODIFY_PAGE_TYPE,
];

export const LOGIN_SUCCESS = 'loginSuccessEvent';
export const LOGOUT_SUCCESS = 'logoutSuccessEvent';
export const LOYALTY_LOGIN_SUCCESS = 'LOYALTY_MEMBER_LOGIN_SUCCESS';

export const webCheckInPageTypes = [CONSTANTS.SEAT_SELECTION_ADDON_CHECKIN, CONSTANTS.ADDON_CHECKIN];

export const localStorageKeys = {
  c_p_d: 'c_p_d',
};

// datadog event list names
export const DD_RUM_EVENTS = {
  AEM_SEAT_DATA: 'aemSeatData',
  AEM_ADDITIONAL_SEAT: 'aemAdditionalSeatData',
  ENTRIES_SEAT: 'seatEntries',
  POST_SEAT_DATA: 'postSeatData',
};

export const MF_NAME = 'seat-selection';

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
