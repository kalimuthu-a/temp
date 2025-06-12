// eslint-disable-next-line import/prefer-default-export
export const CONSTANTS = {
  PNR_TYPE: {
    ONE_WAY: 'OneWay',
    ROUND_TRIP: 'RoundTrip',
    MULTY_CITY: 'MultiCity',
  },
  SCRATCHED: 'SCRATCHED',
  LOCKED: 'LOCKED',
  CONSUMED: 'CONSUMED',
  NOCARD: 'S07',
  SAVER_FARE_TYPES: ['R', 'N', 'A', 'S', ''],
  BOOKING_STATUS: {
    CONFIRMED: 'Confirmed',
    HOLD: 'Hold',
    IN_PROGRESS: 'In progress',
    CANCELLED: 'Cancelled',
    CLOSED: 'Closed',
    DEFAULT: 'Default',
    HOLD_CANCELLED: 'HoldCancelled',
    PENDING_ARCHIVE: 'PendingArchive',
    NEEDS_PAYMENT: 'NeedPayment',
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    ONHOLD: 'Hold',
    ON_HOLD: 'On-Hold',
  },
  PAYMENT_STATUS: {
    COMPLETED: 'Complete',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    CANCELLED: 'Closed',
    HOLD_CANCELLED: 'HoldCanceled',
  },
  BOOKING_STATUS_LABEL: {
    CONFIRMED: 'Confirmed',
    HOLD: 'On-Hold',
    IN_PROGRESS: 'In progress',
    CANCELLED: 'Cancelled',
    HOLD_CANCELLED: 'Hold Cancelled',
    CLOSED: 'Closed',
    COMPLETED: 'Completed',
    ONHOLD: 'Hold',
  },

  NAVIGATION_MENU: {
    MODIFY: 'Modify',
    MODIFY_CANCELBOOKIN: 'CancelBooking',
    MODIFY_CANCELFLIGHT: 'CancelFlight',
    MODIFY_CHANGEFLIGHT: 'ChangeFlight',
    MODIFY_CHANGEADDSEAT: 'ChangeAddSeat',
    SPLIT_PNR: 'SplitPNR',
    ADDONS: 'AddOns',
    ADDONS_MEAL: 'Meal',
    ADDONS_FASTFORWARD: 'FFWD',
    ADDONS_LOUNGE: 'Lounge',
    ADDONS_WHEELCHAIR: 'WCHR',
  },
  SALUTATION_ADULT: [
    { label: 'Mr.', value: 'MR', gender: 1 },
    { label: 'Ms.', value: 'MS', gender: 2 },
    { label: 'Mrs.', value: 'MRS', gender: 3 },
  ],
  PASSENGER_TYPE: {
    ADULT: 'ADT',
    SENIOUR: 'SRCT',
    CHILD: 'CHD',
    INFANT: 'INFT',
  },
  BROWSER_STORAGE_KEYS: {
    TOKEN: 'auth_token', // cookie
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
    AUTH_USER: 'auth_user',
    RECENT_SEARCHES: 'recent_searches',
  },
  LOGIN_TYPE: {
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
  },
  PASSENGER_EXTRA_SEAT: {
    DOUBLE_SEAT_DISCOUNT_CODE: 'EXT',
    TRIPLE_SEAT_DISCOUNT_CODE: 'EXT2',
    DOUBLE_TRIPLE_SEAT_DISCOUNT_CODE_EXST: 'EXST',
    DOUBLE_TRIPLE_SEAT_DISCOUNT_CODE_EXST_2: 'EXST2',
    EXTRASEATTAG_DOUBLE: 'Double',
    EXTRASEATTAG_TRIPLE: 'Triple',
    XLSEAT: 'XL',
  },
  REGEX: {
    FORM_NAME_FIELD: /^[a-zA-Z ]+$/,
    EMAIL: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
    MOBILE_NUMBER: /^[0-9]+$/, // NOSONAR
  },
  TOAST_KEYS: {
    EMAIL_ITINERARY_SUCCESS: 'send_email_itinerary',
  },
  MODIFY_FLOW_IDENTIFIER: {
    CANCEL_BOOKING: 'CancelBooking',
    CANCEL_FLIGHT: 'CancelFlight',
    CHANGE_FLIGHT: 'ChangeFlight',
    CHANGE_SEAT: 'Changeseat',
    CHANGE_ADDON: 'ChangeAddon',
    CHANGE_WHEELCHAIR: 'changewheelchair',
  },
  API_LIFT_STATUS: {
    DEFAULT: 'Default',
    CHECKEDIN: 'CheckedIn',
    BOARDED: 'Boarded',
    NOSHOW: 'NoShow',
  },
  UI_LOAD_TYPE: {
    FROM_BOOKING_FLOW: 'bookingflow',
  },
  FLIGHT_TYPE: {
    THROUGH: 'THROUGH',
    NONSTOP: 'NONSTOP',
    CONNECT: 'CONNECT',
  },
  EVENT_INITIATE_PAYMENT: 'INITIATE_PAYMENT', // catch in container app ->payment-dynamic
  SSR_CODE: {
    FIRST_TIME_FLYER: 'FTIM',
  },
  AUTH_LOGIN_SUCCESS: 'loginSuccessEvent',
  AUTH_TOKEN_LOGOUT_SUCCESS: 'logoutSuccessEvent',
  LOYALTY_MEMBER_LOGIN_SUCCESS: 'LOYALTY_MEMBER_LOGIN_SUCCESS',
  TAB_KEYS: {
    MODIFY: 'MODIFY',
    ADDONS: '6EADDONS',
    FLIGHTSTATUS: 'FLIGHTSTATUS',

    SPLITPNR: 'SPLITPNR',
    MEAL: 'MEAL',
    UNDOCHECKIN: 'UNDOCHKN',
    SMARTCHECKIN: 'SMARTCHECKIN',
    UPDATECONTACTDETAILS: 'UPDATECONTACT',
    ADDPAYMENT: 'ADDPAYMENT',
    EMAIL: 'EMAIL',
    EMAILBOARDINGPASS: 'EMAILBP',
    PRINT: 'PRINT',
    WEBCHECKIN: 'WEBCHKN',
    ADDBAGTAG: 'ADDBAGTAG',
    VIEWBAGTAG: 'VIEWBAGTAG',
    WHATSAPP: 'WHATSAPP',
    DOWNLOAD: 'DOWNLOAD',
    EMAILITINERARY: 'EMAILITR',
    WHATSAPPBPARDINGPASS: 'WHATSAPPBP',

    CANCELBOOKING: 'CANCELBOOKING',
    CANCELFLIGHT: 'CANCELFLIGHT',
    CHANGEFLIGHT: 'CHANGEFLIGHT',
    CHANGEADDSEAT: 'CHANGEADDSEAT',

    ADDSNACKSBAGS: 'ADDSNACKSBAGS',
    ADDFASTFORWARD: 'ADDFASTFORWARD',
    ADDLOUNGE: 'ADDLOUNGE',
    ADDWCHR: 'ADDWCHR',
    ADDPRIME: 'ADDPRIME',
    ADDQUICKBOARD: 'ADDQUICKBOARD',
    ADDSEATNEAT: 'ADDSEATNEAT',
    ADDDELAYEDNLOSTBAGGAGE: 'ADDDELAYEDNLOSTBAGGAGE',
    ADDSPORTSEQUIPMENT: 'ADDSPORTSEQUIPMENT',
    ADDTA: 'ADDTA',
    ADD6EBAR: 'ADD6EBAR',
    ADDGOODNIGHTKIT: 'ADDGOODNIGHTKIT',
    ADDEXCESSBAGGAGE: 'ADDEXCESSBAGGAGE',
    EDITADDONS: 'ADDONS',
    SHARE: 'SHARE',
    WALLET: 'WALLET',
    SPECIALASSISTANT: 'SPECIALASSISTANT',
    BOARDINGPASS: 'BOARDINGPASS',
    FFNUMBER: 'UPDATEFFN',
    VISASERVICE: 'VISASERVICE',
    PYAMENT_CODE: 'LV',
    PARTIAL_REDEMPTION : "PartialRedemption", 
    IBCVOUCHER_CANCELLED_PNR : "IBCVoucherOnlyCancelledPNR",
  },
  DISABLE_REASON_CODE: {
    anonymousUserNotAllowedToCancel:
      "The Cancellation cannot be initiated from user's end. Please ask your Agent for the Cancellation.",
    extraSeatIncluded:
      // eslint-disable-next-line max-len
      'Flight change is not allowed for Double seat/Triple seat booking, Request you to kindly cancel and make fresh booking.',
  },
  NOSHOW_CODE: {
    nonAG: 'nonag',
  },
  DATE_FORMAT: {
    SEARCH_QUERY_DATE_FORMAT: 'dd MMM yyyy',
    FLIGHT_LISTING_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY_DATE_FORMAT: 'DD MMM',
    DISPLAY_DAY_NAME_DATE_MONTH: 'ddd, DD MM',
    SEARCH_QUERY_TAB_DATE_FORMAT: 'DD MMM, ddd',
    SEARCH_QUERY_NAV_DATE_FORMAT: 'ddd, DD MMM',
    YYYYMMDD: 'YYYY-MM-DD',
  },
  UPDATECONTACTDETAILS_QUERY: 'opencontactslider',
  otpVerifyPopup: 'verifyOtp',
  updateSuccess: 'UpdateContactSuccessfully',
  FLEXPAY_HOLD_FEE: 'FLHL',
  PREFERENCE_TYPE: {
    VEG: 'Veg',
    NON_VEG: 'Non Veg',
  },
  EXTRASEAT_TAG: {
    DOUBLE: 'EXT',
    TRIPLE: 'EXT2',
  },
  LOCALSTORAGEKEYS: {
    promo_val: 'promo_val',
  },
  PAYMENT_POLLING_STATUS_KEY: {
    PAYMENTV2_FAILED: 'paymentv2failed',
    PAYMENTV2_INPROCESS: 'paymentv2inprocess',
    PAYMENTV2_BOOKINGFAILED: 'paymentv2bookingfailed',
    PAYMENTV2_NOT_CONFIRMED: 'paymentv2bookingnotconfirmed',
  },
  BUNDLECODE: {
    BAR: '6EBar',
    GOODNIGHT: 'Goodnight',
    PROT: 'PROT',
  },
  LOYALTYCONFIRMATION_AEMKEY: 'ConfirmedLoyalty',
  TOGGLE_LOGIN_POPUP_EVENT: 'toggleLoginPopupEvent',
  LOGIN_POPUP: { loginType: 'EnrollSSOloyalty', persona: 'Member' },
  FEECODE_CONFIG_LIST: {
    CANCEL_FEE_CODE: 'CXL',
    LOYALTY_CANCEL_FEE_IN_POINTS: 'CFPTE',
  },
  PAYWITH_MODES: {
    CASH: 'Cash',
    POINTS: 'IndiGo BluChips',
  },
  LOYALTY_UPDATE_POINTS: 'LOYALTY_UPDATE_POINTS',
  LOYALTY_OPT_ENROLL_SIGNUP: 'loyal-opt-signup-enroll', // FROM PASSENGEREDIT
  GENERIC_DATA_CONTAINER_APP: 'generic_data_container_app',
  LOYALTY_PAX_TYPES: {
    SELF: 'SELF',
    NOMINEE: 'NOMINEE',
  },
  HOTEL_TRAVELTIPS_VARIATION: {
    HOTELSTRIP: 'HotelStrip',
  },
};

// datadog MF Name
export const MF_NAME = 'itinerary';
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

export const PRIMV = 'PRIMV';
export const PRIM = 'PRIM';
