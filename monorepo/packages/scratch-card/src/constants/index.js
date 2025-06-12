const BROWSER_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  ROLE_DETAILS: 'role_details', // cookie
  MODIFY_FLOW_IDENTIFIER: 'modify_flow_identifier', // localstorage
  ADD_PASSENGER_PAYLOAD: 'ADD_PASSENGER_PAYLOAD', // localStorage
  CONTACT_DETAILS_FROM_SRP: 'cd_n', // localstorage
  CREDITSHELL_REFUNDTYPE: 'creditshell_refundType',
  CHANGE_FLIGHT_DATA_TO_SRP: 'c_m_d', // localStorage
  MODIFY_ITINERARY_VALUES: 'iti_mo', // localStorage
  BOARDING_PASS_PAYLOAD: 'b_d_p', // localstorage
  CLEAN_KEYS_SFD: 'sfd_n', // localstorage
  CLEAN_KEYS_BOOKING_CONTEXT: 'bw_cntxt_val', // localstorage
  RECENT_SEARCHES: 'recent_searches',
};

export default BROWSER_STORAGE_KEYS;

export const CONSTANT = {
  SCRATCHED: 'SCRATCHED',
  ASSIGN: 'ASSIGNED',
  UNSCRATCHED: 'unscratched',
  LOCKED: 'LOCKED',
  CONSUMED: 'CONSUMED',
  EXPIRED: 'expired',
  AUTH_LOGIN_SUCCESS: 'LOGIN_SUCCESS',

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
  },
  JOURNEY_FLOW: 'User Profile Flow',
  SITE_SECTION: 'Scratch Card Flow',
  PAGE_NAME: 'Scratch Card',
  COMPONENT: 'Scratch Card Pop Up',

  DATA_CAPTURE_EVENTS: {
    SCRATCH_CARD: 'scratchcard',
    SCRATCH_CARD_CLICK: 'scratchcardclick',
    SCRATCH_CARD_POPUPLOAD: 'scratchcardpopupload',
    CLOSE_ICON_CLICK: 'xclick',
    SCRATCHING_CLICK: 'scrachedimage',
    AVAIL_NOW_CLICK: 'avialnow',
    COPY_CLICK: 'copy',
  },
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

// datadog event list names
export const DD_RUM_EVENTS = {
  GET_SCRATCH_CARD_DATA: 'getScratchCard',
  AEM_DATA: 'getAEMData',
  COUPON_DATA: 'getcouponStatus',
};

export const MF_NAME = 'scratch-card';

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
