/* eslint-disable sonarjs/no-duplicate-string */
export const CONSTANTS = {
  TAB_KEYS: {
    DOWNLOAD: 'DOWNLOAD',
    SHARE: 'SHARE',
    WALLET: 'WALLET',
  },
  REGEX_LIST: {
    ONLY_CHARS_FIELD: /^[a-zA-Z ]+$/,
    // eslint-disable-next-line max-len, no-useless-escape
    EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/i,
    ALPHA_NUMERIC: /^[a-z0-9]+$/i,
    PNR_VALID: /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
    VALID_PASSPORT: /^[A-Za-z]{1}[0-9]{7}$/,
    PHONE: /^[6-9]\d{9}$/g,
    PHONE_INTERNATIONAL: /^[0-9]\d{5,13}$/g,
  },

  VARIATIONS: {
    VISABOOKING: 'visa-booking',
    VISA_VIES_BOOKING: 'visa-view',
  },

  ACTION_BUTTONKEYS: {
    EMAIL_ITINERARY: 'emailItinerary',
    GET_ITINERARY: 'getItinerary',
    CHECKIN: 'checkInhandler',
    DEFAULT: 'default',
    PLANB: 'planb',
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
    REFUND_FORM_DATA: 't_r_d', // track refund form data
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
  PAYMENT_POLLING_STATUS_KEY: {
    PAYMENTV2_FAILED: 'paymentv2failed',
    PAYMENTV2_INPROCESS: 'paymentv2inprocess',
    PAYMENTV2_BOOKINGFAILED: 'paymentv2bookingfailed',
    PAYMENTV2_NOT_CONFIRMED: 'paymentv2bookingnotconfirmed',
  },
  JPAY: 'JPAY',
  JFT: 'JFT',
  PNR: 'pnr',
  PNR_BOOKING_REF_KEY: 'pnr',
  EMAIL_LAST_NAME_KEY: 'email',
  INVOICE_NUMBER_KEY: 'invoiceNumber',
  GST_EMAIL_KEY: 'gstEmail',
  PASSENGER_TYPE: {
    ADULT: 'ADT',
    SENIOUR: 'SRCT',
    CHILD: 'CHD',
    INFANT: 'INFT',
    CHILDREN: 'Child',
  },
  GENDER_TYPE: {
    MALE: 'Male',
    FELMALE: 'Female ',
  },
  TITLE: 'title',
  DOB: 'dateOfBirth',
  PASSPORT_EXPIRY: 'passportExpiry',
  PASSPORT_NUMBER: 'passportNumber',
  GENDER: 'gender',
  OCCUPATION: 'occupation',
  COUNTRYCODE: 'CountryCode',
  CELL: 'cell',
  EMAIL: 'emailId',
  MANDETORY_FIELD: 'Mandatory Filed',
  INVALID_EMAIL: 'Invalid Email',
  INVALID_PHONE_NUMBER: 'Invalid Phone Number',
  PAGE_TYPE_PROP: 'review-summary',
  PAGE_TYPE_CONFIRM: 'confirmation',
  NOT_VALID: 'Not Valid',
  DUPLICATE_PASSPORT_NUMBER: 'Duplicate Passport Number',
  IS_PRIMARY: 'primary',
  PRIMARY_USER: 'primaryUser',
  INVALID_AGE: 'Invalid Primary Age',
  VISA_SERVICE_K: 'visa-service-k',
};

export const PAGES = {
  VISA_PAX_SELECT: 'visa-pax-select',
  VISA_SRP: 'visa-srp',
  VISA_PLAN_DETAILS: 'visa-plan-details',
  VISA_TRAVELLER_DETAILS: 'visa-traveller-details',
  VISA_REVIEW: 'visa-review',
  VISA_UPLOAD_DOCUMENTS: 'visa-upload-documents',
  VISA_BOOKING_DETAILS: 'booking-details',
  VISA_AEM_MAIN: 'visa-aem-main',
  VISA_CONFIRMATION: 'visa-confirmation',
  VISA_STATIC_SEO: 'visa-static-seo',
  VISA_PAYMENT: 'visa-payment',
};

export const AnalyticsPageData = new Map([
  [
    PAGES.VISA_PAX_SELECT,
    {
      pageName: 'Visa Pax Select',
      pageFlow: 'Booking Visa',
    },
  ],
  [
    PAGES.VISA_SRP,
    {
      pageName: 'Visa SRP',
      pageFlow: 'Booking Visa',
    },
  ],
  [
    PAGES.VISA_PLAN_DETAILS,
    {
      pageName: 'Visa Plan Details',
      pageFlow: 'Booking Visa',
    },
  ],
  [
    PAGES.VISA_TRAVELLER_DETAILS,
    {
      pageName: 'Visa Traveller Details',
      pageFlow: 'Booking Visa',
    },
  ],
  [
    PAGES.VISA_REVIEW,
    {
      pageName: 'Visa Review',
      pageFlow: 'Booking Visa',
    },
  ],
  [
    PAGES.VISA_UPLOAD_DOCUMENTS,
    {
      pageName: 'Upload visa document',
      pageFlow: 'Booking Visa',
    },
  ],
]);

export const TOAST_VARIATION = {
  SUCCESS: 'notifi-variation--Success',
  WARNING: 'notifi-variation--Warning',
  INFORMATION: 'notifi-variation--Information',
  ERROR: 'notifi-variation--Error',
};

export const MALE_GENDER_TYPE = 'Male';
export const FEMALE_GENDER_TYPE = 'Female';
export const OTHERS_GENDER_TYPE = 'Others';

export const MALE_GENDER_TYPES = 'Mr';
export const FEMALE_GENDER_TYPES = 'Mrs';
export const OTHERS_GENDER_TYPES = 'Ms';

export const ALL_GENDERS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  // { label: 'Others', value: 'Others' },
];

export const ALL_TITLES = [
  { label: 'Mr', value: 'MR' },
  { label: 'Ms', value: 'MS' },
  { label: 'Mrs', value: 'MRS' },
  { label: 'Master', value: 'MASTER' },
];

export const MAX_FILE_SIZE = 1024 * 1024; // 7MB
export const MAX_UPLOADS = 5;
// datadog MF Name
export const MF_NAME = 'visa-service';
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

export const STEPLIST = {
  TRAVELER_DETAILS: 'Traveller Details',
  UPLOAD_DOCUMENT: 'Upload Document',
  REVIEW_PAY: 'Review & Pay',
};

export const keyCodes = {
  enter: 13,
  space: 32,
  end: 35,
  home: 36,
  arrowLeft: 37,
  arrowUp: 38,
  arrowRight: 39,
  arrowDown: 40,
  delete: 46,
  escape: 27,
  tab: 9,
};

export const key = {
  enter: 'Enter',
  space: 'Space',
  tab: 'Tab',
};

export const MEMBER = {
  B2C_1A_PH_LOYALTY: 'B2C_1A_PH_LOYALTY',
  B2C_1A_PH_NON_LOYALTY: 'B2C_1A_PH_NON_LOYALTY',
};

export const Link = 'link';
export const Text = 'text';
