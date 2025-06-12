export const BROWSER_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
};

export const SALUTATION_ADULT = [
  { label: 'Mr.', value: 'MR', gender: 1 },
  { label: 'Ms.', value: 'MS', gender: 2 },
  { label: 'Mrs.', value: 'MRS', gender: 3 },
];

export const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
};

export const PASSENGER_TYPE = {
  CHD: 'CHD',
  ADT: 'ADT',
  INFT: 'INFT',
};

export const PASSENGER_TYPE_MAPPING = {
  ADT: 'Adult',
  SRCT: 'Adult',
  CHD: 'Child',
  INFT: 'Infant',
};

export const LOYALTY_PAX_TYPES = ['SELF', 'NOMINEE'];

export const PNR_TYPE = {
  ONE_WAY: 'OneWay',
  ROUND_TRIP: 'RoundTrip',
  MULTY_CITY: 'MultiCity',
};

export const INTERACTIONS = {
  PAGE_LOAD: 'Pageload',
  Link_Button_Click: 'Link/ButtonClick',
  POP_UP: 'Pop Up shown',
  API_RESPONSE: 'API response',
  ERROR: 'Error',
};

export const EVENTS = {
  PAGE_LOAD: 'pageload',
  CLICK: 'Click',
  SPLIT_PNR_SUCCESS: 'Split_PNR_success',
};

export const UTIL_CONSTANTS = {
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
};

export const MONTH_NAMES = [
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
];

export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default {
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

  SPLIT_PNR: 'Split PNR',
  SELECT_AND_CONTINUE: 'Submit',
  CHECKING_FLOW: 'Check-in Flow',
};
