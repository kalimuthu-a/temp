export const TripTypes = {
  ONE_WAY: 'oneWay',
  ROUND: 'roundTrip',
  MULTI_CITY: 'multiCity',
};

// eslint-disable-next-line no-underscore-dangle
export const URLS = {
  FARE_CALENDAR:
    'https://api-qa-booking-skyplus6e.goindigo.in/v1/getfarecalendar',
  fareCalStart: 15,
  fareCalEnd: 15,
  ...window?._env_search_results,
};

export const dateFormats = {
  HHMM: 'HH:mm',
  HHMMbb: 'HH:mm bb',
  EEEddLLL: 'EEE, dd LLL',
  yyyyMMdd: 'yyyy-MM-dd',
  EdMMM: 'E d MMM',
  ddMMyyyy: 'dd-MM-yyyy',
};

export const customEvents = {
  SORT_ITEM_CLICK: 'SORT_ITEM_CLICK',
  CLICK: 'click',
  CALL_SEARCH_RESULT_API: 'CALL_SEARCH_RESULT_API',
  DATE_CHANGE_EVENT: 'DATE_CHANGE_EVENT',
  AUTH_TOKEN_SET_EVENT: 'authTokenSetEvent',
  AUTH_LOGIN_SUCCESS: 'loginSuccessEvent',
  AUTH_TOKEN_LOGOUT_SUCCESS: 'logoutSuccessEvent',
  NOMINEE_DETAILS_RECEIVED: 'nomineeDetailsReceivedEvent',
  LOYALTY_MEMBER_LOGIN_SUCCESS: 'LOYALTY_MEMBER_LOGIN_SUCCESS',
  LOYALTY_PAYWITH_EVENT: 'LOYALTY_PAYWITH_EVENT',
  MODIFY_BOOKING: 'MODIFY_BOOKING',
};

export const localStorageKeys = {
  bw_cntxt_val: 'bw_cntxt_val',
  c_m_d: 'c_m_d',
  recent_searches: 'recent_searches',
  recent_city_searches: 'recent_city_searches',
  bookingPurpose: 'bookingPurpose',
  bookingMode: 'bookingMode',
  journeyReview: 'journeyReview',
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

export const discountCodes = {
  DOUBLE_SEAT: 'EXT',
  TRIPLE_SEAT: 'EXT2',
};

export const flightTypes = {
  NON_STOP: 'NonStop',
  CONNECT: 'Connect',
  THROUGH: 'Through',
};

export const AIRCRAFT_TYPES = {
  ATR: 'ATR',
};

export const templateString = {
  flightNumbers:
    '<img src="{icon}" alt="CS" class="codeshare-icon" width="16px" height="16px" /> {carrierCode} {identifier}',
  airportWithTerminal: '{airport} {terminal}',
};

export const ANALTYTICS = {
  INTERACTION: {
    PAGELOAD: 'Pageload',
    LINK_BUTTON_CLICK: 'Link/ButtonClick',
    POPUP_SHOWN: 'Pop up shown',
    Error: 'Error',
  },
  EVENTS: {
    SECONDARY_CLICK: 'secondaryClick',
    CLICK: 'click',
    SEARCH_FLIGHT: 'searchFlight',
    SELECT_FLIGHT: 'Select Flight',
    NO_FLIGHT_FOUND: 'noFlightFound',
    PAGELOAD: 'pageload',
  },
  DATA_CAPTURE_EVENTS: {
    ON_PAGE_LOAD: 'ON_PAGE_LOAD',
    ON_CLICK_NEXT: 'ON_CLICK_NEXT',
    ON_CLICK_SELECT: 'ON_CLICK_SELECT',
    ON_CLICK_MODIFY: 'ON_CLICK_MODIFY',
    NO_FLIGHT_FOUND: 'NO_FLIGHT_FOUND',
    ON_CLICK_CALENDAR: 'ON_CLICK_CALENDAR',
    ON_CLICK_APPLY: 'ON_CLICK_APPLY',
    POP_UP_OPEN_FLIGHT_DETAILS: 'POP_UP_OPEN_FLIGHT_DETAILS',
    POP_UP_OPEN_LAYOVER_DETAILS: 'POP_UP_OPEN_LAYOVER_DETAILS',
    POP_UP_OPEN_OFFER_DETAILS: 'POP_UP_OPEN_OFFER_DETAILS',
    POP_UP_OPEN_FARE_DETAILS: 'POP_UP_OPEN_FARE_DETAILS',
    ON_CLICK_RECOMMENDATION: 'ON_CLICK_RECOMMENDATION',
    ERROR: 'error',
    API_RESPONSE: 'apiresonse',
    UX_ERROR: 'ux_error',
  },
};

export const GTM_ANALTYTICS = {
  EVENTS: {
    PAGE_LOAD: 'page_load',
    SELECT_FLIGHT: 'select_flight',
    ADD_TO_CART: 'add_to_cart',
    ERROR: 'error',
    API_RESPONSE: 'api response',
    VIEW_ITEM_LIST: 'view_item_list',
    NO_FLIGHTS_FOUND: 'noFlightFound',
  },
};

export const INVALID_MARKET_CODE = 'nsk:InvalidMarket';

export const TRIP_CRITERIA = {
  ROUND_TRIP: 'RoundTrip',
  ONE_WAY: 'OneWay',
};

export const CLARITY_ID = {
  ID: '_clck',
};

export const WEEKDAYSCOUNT = 7;

export const LOWEST_IN_WEEK = 'W';

export const DAY_DEPARTURE_RANGE = '360-960';

export const COOKIE_KEYS = {
  AUTH: 'auth_token',
  ROLE: 'aemLoginStatus',
  USER: 'auth_user',
  ROLE_DETAILS: 'role_details',
  PERSONA_TYPE: 'personasType',
  SKYPLUS_ALB: 'akaalb_skyplus_alb',
  NOMINEE_DETAILS: 'nominee_details',
};

export const FARE_CLASSES = {
  BUSINESS: 'Business',
  NEXT: 'NEXT',
  ECONOMY: 'Economy',
};

export const SALE_TAG = 'S';

export const SAVER_COMBINABILITY_MATRIX = ['R', 'N', 'A', 'T', 'S'];

export const LOYALTY_FLOWS = {
  cash: 'cash',
  points: 'indigo bluchips',
  pointPlusCash: 'cash + indigo bluchips',
};

export const DEFAULT_TIER = 'Base';

export const UPDATE_FLIGHT_SEARCH = {
  withCash: 'updateFlightSearchWithCash',
};

export const LOG_IN_POP_UP_EVENT = {
  name: 'toggleLoginPopupEvent',
  persona: 'Member',
  types: {
    customer: 'loginPopup',
    customerSSO: 'loginSSOPopup',
    customerEnrollSSO: 'EnrollSSOloyalty',
  },
};
// datadog MF Name
export const MF_NAME = 'search-results';

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
