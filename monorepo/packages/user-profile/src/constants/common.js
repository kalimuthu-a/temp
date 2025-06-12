export const LOGIN_SUCCESS = 'loginSuccessEvent';
export const TOGGLE_LOGIN_POPUP = 'toggleLoginPopupEvent';
export const GENERIC_TOAST_MESSAGE_EVENT = 'genericToastMessageEvent';
export const MAIN_LOADER_EVENT = 'mainLoaderEvent';

export const AGENT = 'Agent';
export const ANONYMOUS = 'Anonymous';
export const CORPORATE = 'Corporate';
export const MEMBER = 'Member';
export const SME_ADMIN = 'CorpConnectAdmin';
export const SME_USER = 'CorpConnectUser';
export const loginEvent = 'loginEven';
export const loginFail = 'loginFail';
export const dotRezLoginCk = 'aemLoginStatus';
export const dotRezAgentroleCk = 'aemOrgRole';
export const dotRezUserCurrencyCk = 'aemOrgCurrency';
export const pCkName = 'IndigoMemberVerificationCookie';
export const pSessionCk = 'aemPCK';
export const refreshAEMSession = 'refreshAEMSession';
export const PERPETUAL_LOGIN_EVT = 'perpetualLoginStatus';
export const WEB_ANONYMOUS = 'WebAnonymous';
export const DEFAULT_CURRENCY_CODE = 91;
export const HEADER_CONTENT_UPDATE_EVENT = 'HEADER_CONTENT_UPDATE_EVENT';
export const SOMETHING_WENT_WRONG = 'Something went wrong';

export const FLIGHT_SELECT_PAGE = 'srp';
export const PASSENGER_EDIT_PAGE = 'passenger-edit';
export const GET_ITINERARY_DATA = 'getItineraryData';

export const loginVariationCodes = {
  MOBILE: 'mobile',
  STAFF: 'staff',
  USER: 'user',
};

export const flightTypeLabels = {
  NonStop: 'Non - Stop',
  Connect: 'Connected',
};

export const btnKeys = {
  SMART_CHECK_IN: 'scheduleSmartCheckin',
  WEB_CHECK_IN: 'webCheckin',
  VIEW_BOARDING_PASS: 'viewBoardingPass',
  AVAIL_PLAN_B: 'availPlanBFromIndiGo',
  CHECK_STATUS: 'checkStatus',
  NEED_HELP: 'NeedHelpChatWithUs',
  PAY_NOW: 'payNow',
  BOOK_AGAIN: 'BookAgain',
  BOOK_RETURN: 'BookReturn',
  TRACK_REFUND: 'TrackRefund',
};

export const pageTypes = {
  myBookings: 'my-bookings',
  myProfile: 'my-profile',
  helpPage: 'help-page',
  transactions: 'transactions',
};

export const items = [
  {
    label: 'Male',
    value: 'Male',
  },
  {
    label: 'Female',
    value: 'Female',
  },
];

export const myProfileItems = [
  {
    label: 'Male',
    value: 1,
  },
  {
    label: 'Female',
    value: 2,
  },
];

export const MY_BOOKING_STATIC_ID = 'my-bookings-static';

export const analyticConstant = {
  CORP_CONNECT_ADMIN: 'Homepage - Corp Admin',
  CORP_CONNECT_USER: 'Homepage - Corp User',
  PERSONA_CORP_ADMIN: 'CorpConnectAdmin',
  PERSONA_CORP_USER: 'CorpConnectUser',
  CUSTOMER_LOGIN: 'Customer Login',
  PERSONA_MEMBER: 'Member',
  SME_LOGIN: 'SME Login',
  PARTNER: 'Partner Login',
  PERSONA_AGENT: 'Agent',
  AGENT_USER: 'Homepage - Agent',
  HOMEPAGE: 'Homepage',
  FLIGHT_SELECT: 'Flight Select',
  PASSENGER_SELECT: 'Passenger Details',
};
export const transactionAnalyticConstant = {
  TRANSACTION_HISTORY_LOAD: 'transactionHistoryLoad',
  PAGELOAD: 'Pageload',
  FLIGHT: 'Flight',
  TRANSACTION_HISTORY: 'Transaction History',
  MONEY_TRANSACTION_HISTORY: '6e Money Transaction History',
  UX_REVAMP: 'UX-Revamp',
  LANGUAGE: 'en',
  MWEB: 'Mweb',
  WEB: 'Web',
  WWWA: 'WWWA',
};
export const tripStatus = {
  0: 'Default',
  1: 'On hold',
  2: 'Complete',
  3: 'Cancelled',
  4: 'Payment pending',
  5: 'Hold and pay later',
  6: 'Payment failed',
  7: 'Confirmed',
};

export const paymentStatuses = {
  0: 'New',
  1: 'Received',
  2: 'Pending',
  3: 'Complete',
  4: 'Declined',
  5: 'Unknown',
  6: 'Pending customer action',
  7: 'Refund Initiated',
};

// this is according to the web checkin status we are getting
export const webCheckInStatus = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
  COMPLETE: 'COMPLETE',
};

// this is according to the web checkin UTC time in API
export const webCheckInMsgStatus = {
  NOT_STARTED: 'NOT_STARTED',
  CLOSED: 'CLOSED',
  STARTED: 'STARTED',
};

export const tripStatusColors = {
  1: {
    text: '#FFF8E5',
    textBg: '#A97D0E',
    cardBg: '#F9E8BB',
  },
  2: {
    text: '#F0FFF6',
    textBg: '#218946',
    cardBg: '#DAF1FF',
  },
  3: {
    text: '#F4DEDF',
    textBg: '#C3272E',
    cardBg: '#FEE',
  },
  4: {
    text: '#FFF8E5',
    textBg: '#A97D0E',
    cardBg: '#F9E8BB',
  },
  5: {
    text: '#FFF8E5',
    textBg: '#A97D0E',
    cardBg: '#F9E8BB',
  },
  6: {
    text: '#F4DEDF',
    textBg: '#C3272E',
    cardBg: '#FEE',
  },
};

export const flightStatus = {
  FLOWN: 'FLOWN',
  ON_TIME: 'ON_TIME',
  NO_SHOW: 'NO_SHOW',
  CANCELLED: 'CANCELLED',
  DELAYED: 'DELAYED',
  REFUND_PENDING: 'REFUND_PENDING',
};

export const flightStatusLabel = {
  FLOWN: 'Flown',
  ON_TIME: 'On Time',
  NO_SHOW: 'No Show',
  CANCELLED: 'Cancelled',
  DELAYED: 'Delayed',
  REFUND_PENDING: 'Refund Pending',
};

export const flightStatusColors = {
  FLOWN: {
    text: '#348DC4',
    bg: '#EAF8FF',
  },
  ON_TIME: {
    text: '#218946',
    bg: '#F0FFF6',
  },
  CANCELLED: {
    text: '#A97D0E',
    bg: '#FFF8E5',
  },
  NO_SHOW: {
    text: '#C3272E',
    bg: '#F4DEDF',
  },
};

export const myBookingBtnType = {
  VIEW_BOARDING: 'VIEW_BOARDING',
  SMART_CHECK_IN: 'SMART_CHECK_IN',
  PLAN_B: 'PLAN_B',
  CHECK_STATUS: 'CHECK_STATUS',
};
export const transactionTypes = {
  DEBITED: 'debited',
  EXPIRED: 'expired',
  CREDITED: 'credited',
  ALL: 'all',
  REFUND: 'refunded',
  EXPIRINGSOON: 'expiringsoon',
};
export const GENERIC_DATA_CONTAINER_APP = 'generic_data_container_app';

export default {
  LOGIN_SUCCESS,
  // ENDPOINT_HEADER,
  TOGGLE_LOGIN_POPUP,
  // CONTENT_TYPE_HEADER,
  AGENT,
  ANONYMOUS,
  MEMBER,
  SME_USER,
  SME_ADMIN,
  CORPORATE,
  loginEvent,
  loginFail,
  dotRezLoginCk,
  dotRezAgentroleCk,
  dotRezUserCurrencyCk,
  pCkName,
  pSessionCk,
  refreshAEMSession,
  PERPETUAL_LOGIN_EVT,
  WEB_ANONYMOUS,
  GENERIC_TOAST_MESSAGE_EVENT,
  MAIN_LOADER_EVENT,
  DEFAULT_CURRENCY_CODE,
  loginVariationCodes,
};

export const FLIGHT_BOOKING = Object.freeze({
  CURRENT: 'current',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
});

export const PAGINATION_SIZE = 50;

export const terminalDetail = {
  ORIGIN: 'origin',
  DESTINATION: 'destination',
  DEPARTURE_TERMINAL: 'departureTerminal',
  ARRIVAL_TERMINAL: 'arrivalTerminal',
};
