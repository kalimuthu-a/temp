export const URLS = {
  VALIDATE_PROMOCODE: '',
  BOOKING_WIDGET: '',
  BW_MAIN: '',
  BW_ADDITIONAL: '',
  BW_OFFERS: '',
  FARE_CALENDAR: '',
  POPULAR_SEARCHES: '',
  POPULAR_SEARCHES_KEY: '',
  fareCalLimit: 62,
  displayCalenderMonths: 2,
  ...window?._env_booking,
};

export const maxPAxSelectionCount = 9;

export const localStorageKeys = {
  bw_cntxt_val: 'bw_cntxt_val',
  c_m_d: 'c_m_d',
  recent_searches: 'recent_searches',
  recent_city_searches: 'recent_city_searches',
  promo_val: 'promo_val',
};

export const paxCodes = {
  adult: {
    code: 'ADT',
    discountCode: '',
  },
  seniorCitizen: {
    code: 'ADT',
    discountCode: 'SRCT',
  },
  children: {
    code: 'CHD',
    discountCode: '',
  },
  infant: {
    code: 'INFT',
    discountCode: '',
  },
};

export const DEFAULT_CURRENCY = {
  label: 'Indian Rupee',
  value: 'INR',
};

export const DEFAULT_CITY_INFO = {
  countryCode: 'IN',
  countryCodeLower: 'in',
  countryName: 'India',
  countryNameLower: 'india',
};

export const dateFormats = {
  ddMMM: 'dd MMM',
  doMMM: 'do MMM',
  yyyyMMdd: 'yyyy-MM-dd',
  ddMMYYYY: 'dd-MM-yyyy',
  MMMMyyyy: 'MMMM yyyy',
};

export const specialFareCodes = {
  STU: 'STU',
  UMNR: 'UMNR',
  FNF: 'FNF',
  DFN: 'DFN',
  VAXI: 'VAXI',
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

export const discountCodes = {
  DOUBLE_SEAT: 'EXT',
  TRIPLE_SEAT: 'EXT2',
};

export const customEvents = {
  TOGGLE_LOGIN_POPUP_EVENT: 'toggleLoginPopupEvent',
  SET_RECENT_SEARCH_VALUES: 'SET_RECENT_SEARCH_VALUES',
  CALL_SEARCH_RESULT_API: 'CALL_SEARCH_RESULT_API',
  DATE_CHANGE_EVENT: 'DATE_CHANGE_EVENT',
  CALL_EXPLORE_DESTINATION_API: 'CALL_EXPLORE_DESTINATION_API',
  SET_CONTEXT_FROM_OUTSIDE_EVENT: 'SET_CONTEXT_FROM_OUTSIDE_EVENT',
  SOURCE_CITY_FROM_EXPLORE: 'SOURCE_CITY_FROM_EXPLORE',
  NOMINEE_DETAILS_RECEIVED: 'nomineeDetailsReceivedEvent',
  LOYALTY_PAYWITH_EVENT: 'LOYALTY_PAYWITH_EVENT',
  AFTER_PAYWITH_CHANGE: 'AFTER_PAYWITH_CHANGE',
  MODIFY_BOOKING: 'MODIFY_BOOKING'
};

export const COOKIE_KEYS = {
  AUTH: 'auth_token',
  ROLE: 'aemLoginStatus',
  USER: 'auth_user',
  ROLE_DETAILS: 'role_details',
  PERSONA_TYPE: 'personasType',
  SKYPLUS_ALB: 'akaalb_skyplus_alb',
  NOMINEE_DETAILS: 'nominee_details',
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
    BOOKING_REMOTE_LOADED: 'bookingremoteloaded',
    ERROR: 'error',
    UX_ERROR: 'ux_error',
    API_RESPONSE: 'apiresonse',
    MODIFY_DEAL: 'modifyDeal',
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
    MODIFY_DEAL: 'modify_deal',
  },
};
export const APPLICATION_NAME = 'ibe';
export const COUNTRY_CODE = 'IN';

// datadog event list names
export const DD_RUM_EVENTS = {
  VALIDATE_PROMO: 'validatePromo',
  GET_WIDGET: 'widgetData',
  CALENDER_FARE: 'calenderFare',
  AEM_DATA: 'aemData',
  AEM_ADDITIONAL_DATA: 'aemAdditionalData',
  AEM_OFFERS_DATA: 'aemOffersData',
};

export const MF_NAME = 'booking';

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

export const CARGO_CONSTANTS = {
  INTERNATIONAL: 'international',
};
