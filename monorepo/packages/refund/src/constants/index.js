const CONSTANTS = {
  APP_NAME: 'Refund',
  NEFT_REFUND: 'NEFT Refund',
  INITIATE_REFUND: "initiate-refund",
};

export const BROWSER_STORAGE_KEYS = {
  REFUND_FORM_DATA: 't_r_d', // track refund form data
  AUTH_TOKEN: 'auth_token',
};

export const REFUND_SUMMARY_CLASS = {
  SUCCESS: 'success',
  FAILURE: 'error',
  PENDING: 'warning',
  DEFAULT: 'grey',
};

export const REFUND_STATUS_CODE = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PENDING: 'pending',
  NEFT_REFUNDED: 'neft refunded',
  MANUAL_REVIEW: 'manual_review',
  PARTIALLY_REFUNDED: 'partially refunded',
  PARTIALLY_INPROGRESS: 'partially in progress',
};

export const KEYBOARD_KEYS = {
  ENTER: 13,
};

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const FIELD_TYPE = {
  NAME_OF_BANK: 'nameOfBank',
  ACCOUNT_NUMBER: 'accountNumber',
  CONFIRMED_ACCOUNT_NUMBER: 'confirmedAccountNumber',
  IFSC_CODE: 'IFSCCode',
  FILE_NAME: 'fileName',
  SAVINGS: 'Savings'
}

export const CUSTOM_EVENTS = {
  HANDLE_SHOW_OTP_MODAL : 'HANDLE_SHOW_OTP_MODAL',
  HANDLE_SHOW_REFUND_CLAIM_FORM: 'HANDLE_SHOW_REFUND_CLAIM_FORM'
}

export const ACCOUNT_TYPE_OTIONS= {
  ACCOUNT_TYPE: 'accountType',
  SAVINGS: 'savings',
  CURRENT: 'current'
}

export default CONSTANTS;
