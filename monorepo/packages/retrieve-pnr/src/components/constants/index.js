/* eslint-disable sonarjs/no-duplicate-string */
export const CONSTANTS = {
  REGEX_LIST: {
    ONLY_CHARS_FIELD: /^[a-zA-Z ]+$/,
    EMAIL: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
    ALPHA_NUMERIC: /^[a-z0-9]+$/i,
    PNR_VALID: /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
  },
  VARIATIONS: {
    WEBCHECKIN: 'web-check-in',
    EDITBOOKING: 'edit-booking',
    CHANGEFLIGHT: 'change-flight',
    PLAN_B: 'plan-b',
    UPDATE_CONTACT_DETAILS: 'update-contact-details',
    SUBMIT_PASSENGERS_DETAILS_ARRIVING_INDIA:
      'submit-passenger-details-arriving-india',
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
    REFUND_FORM_DATA: 't_r_d', // track refund form data
    VISA_SERVICE_K: 'visa-service-k',
  },
  JPAY: 'JPAY',
  JFT: 'JFT',
  PNR: 'pnr',
  PNR_BOOKING_REF_KEY: 'pnr',
  EMAIL_LAST_NAME_KEY: 'email',
  INVOICE_NUMBER_KEY: 'invoiceNumber',
  GST_EMAIL_KEY: 'gstEmail',
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
  CONTACT_US: 'info-contact-us',
  CANCELLATION: 'cancellation',
  BOARDING_PASS: 'boarding-pass',
  REFUND: 'refund',
  VISA_TRACK_STATUS: 'visa-track-status',
  INITIATE_REFUND: 'initiate-refund',
};

export const AnalyticsPageData = new Map([
  [
    PAGES.WEB_CHECK_IN,
    {
      pageName: 'Web Check-in',
      pageFlow: 'Check-in',
    },
  ],
  [
    PAGES.EDIT_BOOKING,
    {
      pageName: 'Edit Booking',
      pageFlow: 'Modification Flow',
    },
  ],
  [
    PAGES.UPDATE_CONTACT_DETAILS,
    {
      pageName: 'Update Contact Details',
      pageFlow: 'Modification Flow',
    },
  ],
  [
    PAGES.SUBMIT_PASSENGERS_DETAILS_ARRIVING_INDIA,
    {
      pageName: 'International Passenger Details',
      pageFlow: 'Check-in Flow',
    },
  ],
  [
    PAGES.CHANGE_FLIGHT,
    {
      pageName: 'Change Flight',
      pageFlow: 'Change Flight',
    },
  ],
  [
    PAGES.PLAN_B,
    {
      pageName: 'Plan B',
      pageFlow: 'Modification Flow',
    },
  ],
  [
    PAGES.TRACK_REFUND,
    {
      pageName: 'Track Refund',
      pageFlow: 'Modification Flow',
    },
  ],
]);

export const SOMETHING_WENT_WRONG = 'Something went wrong';
export const CHANGE_FLIGHT = 'Change Flight';
export const CUSTOM_EVENTS = {
  HANDLE_SHOW_OTP_MODAL: 'HANDLE_SHOW_OTP_MODAL',
  HANDLE_SHOW_REFUND_CLAIM_FORM: 'HANDLE_SHOW_REFUND_CLAIM_FORM',
};

export const SUCCESS_LABEL = 'success';

export const TOAST_VARIATION = {
  SUCCESS: 'notifi-variation--Success',
  WARNING: 'notifi-variation--Warning',
  INFORMATION: 'notifi-variation--Information',
  ERROR: 'notifi-variation--Error',
};
