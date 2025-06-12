/* eslint-disable guard-for-in */
import apiEnv from './index-env';
import common, { AGENT, MEMBER, SME_ADMIN, SME_USER } from './common';

const result = apiEnv;
for (const key in common) {
  result[key] = common[key];
}

export default result;

export const SCREEN_TYPE = {
  HELP: 'HELP',
  SETTINGS: 'SETTNGS',
  SAVED_PAYMENTS: 'SAVED_PAYMENTS',
  SAVED_PASSENGERS: 'SAVED_PASSENGERS',
  PROFILE: 'PROFILE',
  WISHLIST: 'WISHLIST',
  DELETE: 'DELETE',
  CASH: 'CASH',
  NOMINEE: 'NOMINEE',
  MY_PROFILE: 'MY_PROFILE',
  OTP_VERIFICATION: 'OTP_VERIFICATION',
  MY_BOOKINGS: 'MY_BOOKINGS',
  MY_TRANSCATION: 'MY_TRANSCATION',
};

export const REGEX_LIST = {
  INDIAN_MOBILE_NUMBER: /^[6-9]\d{9}$/,
  EXCEPT_INDIAN_MOBILE_NUMBER: /^\d{7,14}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/,
  NAME_ONLY_ALPHABET_SPACE: /[^a-zA-Z\s]/g,
};

export const USER_TYPES = {
  USER: MEMBER,
  AGENT,
  SME_USER,
  SME_ADMIN,
};

export const URLS = {
  ...window?._user_profile,
};

export const BROWSER_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  ROLE_DETAILS: 'role_details',
  CIAM_REFRESH_TOKEN: 'CIAM_REFRESH_TOKEN',
  CIAM_TOKEN: 'CIAM_TOKEN',
  CIAM_POLICY: 'ciam_policy',
};

export const dateFormats = {
  ddMMM: 'dd MMM',
  doMMM: 'do MMM',
  yyyyMMdd: 'yyyy-MM-dd',
  ddMMYYYY: 'dd-MM-yyyy',
  MMMMyyyy: 'MMMM yyyy',
  dob: 'dd-mm-yyyy',
  DDMMYYYY: 'DD-MM-YYYY',
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
    ERROR: 'error',
    API_RESPONSE: 'apiresonse',
    LOGIN_SUCCESS: 'loginSuccessEvent',
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
  },
};

export const CONSTANTS = {
  LOYALTY_NOMINEE_DETAILS_UPDATED: 'LOYALTY_NOMINEE_DETAILS_UPDATED',
  CONTACTUS_PAGE_TYPE: 'info-contact-us',
  INFO_CONTACT_US_SUMMARY: 'info-contact-us-summary',
  INFO_CONTACT_US_RECENT_QUERY: 'info-contact-us-recent-queries',
};

export const PAGES = {
  WEB_CHECK_IN: 'web-check-in',
  CHECK_IN_HOME: 'checkinmaster',
  EDIT_BOOKING: 'edit-booking',
  CHANGE_FLIGHT: 'change-flight',
  PLAN_B: 'plan-b',
  UPDATE_CONTACT_DETAILS: 'update-contact-details',
  SUBMIT_PASSENGERS_DETAILS_ARRIVING_INDIA:
    'submit-passenger-details-arriving-india',
  TRACK_REFUND: 'track-refund',
  GST_INVOICE: 'gst-invoice',
  SPLIT_PNR: 'split-pnr-details',
  CREDIT_SHELL: 'credit-shell',
  MY_BOOKINGS: 'my-bookings',
  HELP_PAGE: 'help-page',
};

export const BOOKINGS = {
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
    ON_HOLD1: 'On Hold',
    RESOLVED: 'Resolved',
    ON_HOLD1: 'On Hold',
    PARTIAL_COMPLETE: 'PartialComplete',
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
    PENDING_ARCHIVE: 'Pending Archive',
    ARCHIVED: 'Archived',
    ARCHIVED_PRIVATE: 'Archived Private',
    PROCESSED_FOR_ARCHIVE: 'Processed For Archive',
    PARTIAL_COMPLETE: 'Partial Complete',
  },
};

export const QUESRIES = {
  QUESRIES_STATUS: {
    UNTOUCHED: 'Untouched',
    OPEN: 'Open',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
  },
  QUESRIES_STATUS_LABEL: {
    OPEN: 'Open',
    WORK_IN_PROGRESS: 'Work In progress',
    RESOLVED: 'Resolved',
  },
};

export const TRIP_TYPE = {
  UPCOMING: 'upcoming',
  PAST: 'past',
};
