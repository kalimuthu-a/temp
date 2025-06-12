/* eslint-disable max-len */
// eslint-disable-next-line no-underscore-dangle

export const URLS = {
  ENV: 'test',
  ...window?._env_web_checkin,
};

export const PAGE = {
  homepage: 'homepage',
  srp: 'srp',
};

export const localStorageKeys = {
  m_c_r: 'm_c_r',
  c_p_d: 'c_p_d',
  b_d_p: 'b_d_p',
};

export const dateFormats = {
  ddMMM: 'dd MMM',
  yyyyMMdd: 'yyyy-MM-dd',
  ddMMYYYY: 'dd-MM-yyyy',
  ddmmYYYY: 'dd-mm-yyyy',
  ddMMMYY: 'dd MMM, yy',
  MMMddYY: 'MMM, dd yy',
  iiiddMMM: 'iii, dd MMM',
  MMMMyyyy: 'MMMM yyyy',
  HHmm: 'HH:mm',
  HHMM: 'HHmm',
  webcheckinstarts: 'HH:mm, iii dd MMM ’yy',
  ddMMyyyy: 'dd-MM-yyyy',
  boardingpass: 'dd MMM yyyy',
};

export const specialFareCodes = {
  STU: 'STU',
  UMNR: 'UMNR',
  FNF: 'FNF',
  DFN: 'DFN',
  VAXI: 'VAXI',
};

export const customEvents = {
  TOGGLE_LOGIN_POPUP_EVENT: 'toggleLoginPopupEvent',
  SET_RECENT_SEARCH_VALUES: 'SET_RECENT_SEARCH_VALUES',
};

export const COOKIE_KEYS = {
  AUTH: 'auth_token',
  ROLE_DETAILS: 'role_details',
};

export const ANALTYTICS = {
  INTERACTION: {
    PAGELOAD: 'Pageload',
    LINK_BUTTON_CLICK: 'Link/ButtonClick',
    POPUP_SHOWN: 'Pop Up Shown',
  },
  EVENTS: {
    SECONDARY_CLICK: 'secondaryClick',
    CLICK: 'click',
    SEARCH_FLIGHT: 'searchFlight',
    PAGELOAD: 'pageload',
    CHECKIN_START: 'checkInStart',
  },
  DATA_CAPTURE_EVENTS: {
    ERROR: 'error',
    API_RESPONSE: 'apiresonse',
    HOTEL_STRIP_CARD: 'clickHotelCards',
    HOTEL_STRIP_SEEMORE: 'hotel_click',
  },
  TYPE: {
    API: 'api',
    BE_ERROR: 'BE ERROR',
  },
  SOURCE: {
    API: 'api',
  },
  TRIGGER_EVENTS: {
    BOARDING_PASS_PAGE_LOAD: 'BOARDING_PASS_PAGE_LOAD',
    BOARDING_PASS_DOWNLOAD: 'BOARDING_PASS_DOWNLOAD',
    BOARDING_PASS_EMAIL: 'BOARDING_PASS_EMAIL',
    BOARDING_PASS_GOTO_WEBCHECKIN: 'BOARDING_PASS_GOTO_WEBCHECKIN',
    DANGEROUS_GOODS_PAGELOAD: 'DANGEROUS_GOODS_PAGELOAD',
    DANGEROUS_GOODS_AGREE_CONTINUE: 'DANGEROUS_GOODS_AGREE_CONTINUE',
    WEBCHECKIN_FLIGHT_DETAILS_NEXT: 'WEBCHECKIN_FLIGHT_DETAILS_NEXT',
    WEBCHECKIN_FLIGHT_DETAILS_LOAD: 'WEBCHECKIN_FLIGHT_DETAILS_LOAD',
    WEB_CHECK_HOME_PAGE_LOAD: 'WEB_CHECK_HOME_PAGE_LOAD',
    WEB_CHECK_HOME_CHECK_IN_CLICKED: 'WEB_CHECK_HOME_CHECK_IN_CLICKED',
    WEB_CHECK_HOME_SCHEDULE_CHECK_IN_CLICKED:
      'WEB_CHECK_HOME_SCHEDULE_CHECK_IN_CLICKED',
    WEB_CHECK_HOME_VIEW_BOARDING_PASS_CLICKED:
      'WEB_CHECK_HOME_VIEW_BOARDING_PASS_CLICKED',
    WEB_CHECK_HOME_VIEW_UNDO_CHECKIN_CLICKED:
      'WEB_CHECK_HOME_VIEW_UNDO_CHECKIN_CLICKED',
    WEB_CHECK_HOME_VIEW_SEAT_SELECT_CLICKED:
      'WEB_CHECK_HOME_VIEW_SEAT_SELECT_CLICKED',
    WEB_CHECKIN_PAX_DETAILS_LOAD: 'WEB_CHECKIN_PAX_DETAILS_LOAD',
    WEB_CHECKIN_PAX_DETAILS_NEXT: 'WEB_CHECKIN_PAX_DETAILS_NEXT',
    AUTO_CHECK_SUCCESS: 'AUTO_CHECK_SUCCESS',
  },
  PAGE_NAME: {
    BOARDING_PASS: 'Boarding Pass',
    DANGEROUS_GOODS: 'Dangerous Good',
    WEB_CHECK_IN_FLIGHT_DETAILS: 'Web Check In Flight Details',
    WEB_CHECK_IN_HOME: 'Web Check-in',
    WEB_CHECK_IN_VIEW: 'Web Check-In View',
    WEB_CHECK_IN: 'Web Check-in',
    UNDO_CHECKIN: 'Undo Check-in',
  },
};

export const GTM_ANALTYTICS = {
  EVENTS: {
    SEARCH_FLIGHT: 'search_flight',
    RECENT_SEARCH: 'recent_search',
    DANGEROUS_GOODS_AGREE_CONTINUE: 'dangerous_good',
    DANGEROUS_GOODS_PAGE_LOAD: 'dangerous_good_page_load',
    WEB_CHECK_HOME_PAGE_LOAD: 'web_check_home_page_load',
    CHECK_IN_INITIATE: 'checkin_initiate',
    BOARDING_PASS_DOWNLOAD: 'boarding_pass_download',
    BOARDING_PASS_EMAIL: 'boarding_pass_email',
    CHECK_IN_COMPLETE: 'checkin_complete',
    FLIGHT_STATUS_CHECKIN: 'flight_status_checkIn',
    FLIGHT_STATUS_CHECKIN_PAGE_LOAD: 'flight_status_checkIn_page_load',
    CHECKIN_ERROR: 'checkin_error',
    FLIGHT_DETAILS_PAGE_LOAD: 'flight_details_page_load',
    ERROR: 'error',
    API_RESPONSE: 'api_response',
    AUTO_CHECKIN_COMPLETE: 'checkin_complete',
  },
  PAGE_NAME: {
    CHECK_IN_INITIATE: 'CheckIn Initiate',
  },
};

export const ROLE_CODES = {
  ANONYMOUS: 'WWWA',
};

export const checkinTypes = {
  SCHEDULE: 'schedule',
  NORMAL: 'normal',
};

export const ERROR_CODES = {
  pnr_balance_due: 'pnr_balance_due',
};

export const regexConstant = {
  MOBILE10: /^[0-9]{10}$/g,
  CHARCT10: /^[\w\W]{10,128}$/g,
  MOBILE12: /^[0-9]{7,12}$/g,
  ONLYDIGIT: /^[0-9]*$/g,
  ONLY_CHARS_FIELD: /^[a-zA-Z ]+$/,
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/i,
};

export const PAX_SHORT_NAME = {
  SS: 'SS',
  ADT: 'ADT',
  CHD: 'CHD',
  INFT: 'INFT',
};

export const PAX_NAMES = {
  ADULT: 'ADULT',
  CHILD: 'CHILD',
  INFANT: 'INFANT'
}
export const ERROR_MSGS = {
  INVALID_DATE: "Invalid Date",
}

export const PASSPORT_MAX_LEMGTH = 9;
export const HOME_ADDRESSS = 128;
export const EMERGENCY_STATUS_CODE = 2;
export const JOURNEY_TYPE = {
  INTERNATIONAL: 'International',
  DOMESTIC: 'Domestic',
};

export const XSAT_STRING = 'XSAT';

// datadog event list names
export const DD_RUM_EVENTS = {
  GET_JOURNIES_DATA: 'getJournies',
  GET_PASSENGER_HEALTH_FORM: 'getPassengerHealth',
  GET_ITINERARY_DATA: 'getItineraryData',
  GET_AEM_DATA: 'getAemData,',
  GET_SSR_DATA: 'getSsrData',
  GET_DANGEROUS_GOODS: 'getDangerousGoods',
  CHECKING_BOARDPASS_AEM: 'checkingBoardpass',
  AEM_CHECKIN_MASTER: 'aemCheckinMaster',
  AEM_CHECKIN_PASSENGER: 'aemCheckinPassenger',
  GET_PNR: 'getPNR',
  GET_BOARDING_PASS: 'getBoardingPass',
  GET_COUNTRIES_PAYLOAD: 'getCountriesData',
  POST_POLICY_CONSENT: 'policyConsent',
  POST_PASSENGER_HEALTH_FORM: 'postPassengerHealth',
  POST_MANUAL_CHECKIN: 'postManualCheckin',
  UNDO_MANUAL_CHECKIN: 'undoManualCheckin',
  TRAVEL_DOCUMENTS: 'postTravelDocuments',
  SEND_EMAIL_BOARDING_PASS: 'sendEmailBoardingPass',
  GET_BOOKING_LIST: 'getBookingList',
};

export const MF_NAME = 'web-checkin';

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

export const DOCUMENT_CODES = {
  PASSPORT: 'P',
  VISA: 'V',
};

export const HOTEL_TRAVELTIPS_VARIATION = {
  HOTELSTRIP: 'HotelStrip',
};

export const LOGIN_TYPE = {
  CORP_ADMIN: 'CORPCONNECTADMIN',
  CORP_CONNECT_USER: 'CORPCONNECTUSER',
  B2C: 'B2C',
  AGENT: 'AGENT',
  MEMBER: 'MEMBER',
  CAPF: 'CAPF',
  SLT: 'SLT',
  NO_LOGIN: 'ANONYMOUS',
  REWARD_USED: 'REWARDMEMBER',
  ANONYMOUS: 'WWWA',
};

export const DATE_CONSTANTS = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  UTIL_CONSTANTS: {
    DATE_SPACE_DDMMMYYYY: 'DD MMM YYYY',
    DATE_SLASH_DDMMYYYY: 'DD/MM/YYYY',
    DATE_HYPHEN_DDMMYYYY: 'DD-MM-YYYY',
    DATE_SLASH_DDMMMYYYY: 'DD/MMM/YYYY',
    DATE_SPACE_DDDMMMYYYYHHMM: 'DDD MMM YYYY HH:MM',
    DATE_SPACE_DDDMMMYYYY: 'DDD MMM YYYY',
    DATE_SPACE_DDDMMM: 'DDD MMM',
    DATE_BOOKEDON: 'DATE_BOOKEDON',
    DATE_BOOKINGDETAILS: 'DATE_BOOKINGDETAILS',
    DATE_BOOKINGDETAILS_PARTNER: 'DATE_BOOKINGDETAILS_PARTNER',
    DATE_SPACE_PRINTHEADER: 'DATE_SPACE_PRINTHEADER',
    DATE_CANCELFLIGHT_POPUP: 'DATE_CANCELFLIGHT_POPUP',
    DATE_CANGEFLIGHT_SRP_PAYLOADIN: 'DATE_CANGEFLIGHT_SRP_PAYLOADIN',
    DATE_HYPHEN_YYYYMMDD: 'YYYY-MM-DD',
    DATE_SPACE_DDMMMMYYYY: 'DD,MM YYYY',
  },
};

export const catchErrorMsg = 'catch block error';
