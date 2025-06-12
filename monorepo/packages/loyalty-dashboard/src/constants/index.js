/* eslint-disable max-len */
export const BROWSER_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
};

export const USER_CARD = {
  MAINCARD: 'mainCard',
  PRIME_PASS: 'indigo',
  EPRIME: '6eprime',
  CARRIER_CODE: '6E',
};
export const TIER = {
  EARNPOINTS: 500,
  BASE: 'base',
  TIERBENIFITS: 'Tier Benefit',
};

export const API_LIST = {
  GET_USER_SUMMARY:
    'https://api-qa-skyplus.goindigo.in/loyalty/api/v1/customer/tier',
  DATA_LOYALTY_DASHBOARD:
    'https://aem-s6web-qa-skyplus6e.goindigo.in/content/api/s6web/in/en/v1/loyalty-dashboard',
  GET_ITINERARY:
    'https://api-dev-itinerary-skyplus6e.goindigo.in/v1/itinerary',
  RETRO_CLAIM:
    'https://api-uat2-skyplus.goindigo.in/itinerary-save/v1/booking/retroclaim',
  RETRO_CLAIM_USER_KEY: '7bb1af1f67357e54006a029913b4522e',
  USERKEY_ITINERARY_GET: '3b5f87989534c2ed45b375447820e77b',
  RETRO_CLAIM_API: 'https://aem-s6web-qa-skyplus6e.goindigo.in/content/api/s6web/in/en/v1/loyalty-retro-claim.json',
  TRANSACTION_HISTORY: 'https://api-qa-skyplus.goindigo.in/loyalty/api/Transaction/history',
  DATA_TRANSACTION_HISTORY: 'https://aem-s6web-qa-skyplus6e.goindigo.in/content/api/s6web/in/en/v1/loyalty-transaction-history',
  GET_TRANSACTION_SUMMARY: 'https://api-qa-skyplus.goindigo.in/loyalty/api/v1/Transaction/history',
  VOUCHER_AEM_DATA: 'https://aem-s6web-qa-skyplus6e.goindigo.in/content/api/s6web/in/en/v1/loyalty-tier-utilization.json',
  ...window?._env_loyalty_dashboard,
};
export const CONSTANTS = {
  ERROR: 'error',
  API_RESPONSE: 'api response',
  API: 'api',
  REGEX_LIST: {
    ONLY_CHARS_FIELD: /^[a-zA-Z ]+$/,
    EMAIL: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
    ALPHA_NUMERIC: /^[a-z0-9]+$/i,
  },
};

export const ANALYTICS_EVENTS = {
  RETRO_PAGE_LOAD: 'retro_page_load',
  RETRO_CTA_CLICK: 'retro_cta_click',
  RETRO_POINTS_CLAIMED: 'retro_points_claimed',
  PARTNER_HISTORY: 'Partner_History',
  PARTNER_FILTERS: 'Partner_Filters',
  PARTNERS_VOUCHER_LOAD: 'pageload',
  VIEW_CLAIM_BENEFITS: 'View Claimed Benefits',
  DASHBOARD_TAB_BENFIT: 'dashboard_tab_benefit',
  LOYALTY_REDEEM: 'Loyalty_Redeem',
  LOYALTY_VOUCHER: 'Loyalty_Voucher',
};

// datadog event list names
export const DD_RUM_EVENTS = {
  USER_SUMMARY_DATA: 'userSummaryData',
  RETRO_CLAIM: 'retroClaim',
  AEM_DATA: 'aemData',
  AEM_VOUCHER: 'aemVoucher',
  AEM_TRANSACTION_HISTORY: 'aemTransactionHistory',
  API_TRANSACTION_HISTORY: 'apiTransactionHistory',
  PNR_SEARCH: 'pnrSearch',
  RETRO_CLAIM_REQUEST: 'retroClaimRequest',
};

export const MF_NAME = 'loyalty-dashboard';

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

export const AA_CONSTANTS = {
  PAGE_NAME: 'Retro Claim',
  SITE_SECTION: 'Loyalty',
  JOURNEY_FLOW: 'Loyalty',
  PROJECT_NAME: 'UX-Revamp',
};

export const VOUCHER_DASHBOARD = {
  PAGE_NAME: 'Loyalty Dashboard',
};

export const VOUCHER_CONSTANTS = {
  PAGE_NAME: 'Loyalty Voucher',
  SITE_SECTION: 'Loyalty',
  JOURNEY_FLOW: 'Loyalty',
  PROJECT_NAME: 'UX-Revamp',
};

export const LOYALTY_UPDATE_POINTS = 'LOYALTY_UPDATE_POINTS';

export const TABNAME = {
  COBRAND: 'co-brand card',
  PARTNERSHIPS: 'partnerships',
  NOTBASETIER: 'notBaseTier',
  BASETIER: 'baseTier',
};

export const TIER_BENEFIT_UTLISATION_TAB = {
  ALL_TRANSACTIONS: 'allTransactions',
  LOYALTY: 'loyalty',
  PARTNERS: 'partners',
};

export const VOUCHER_HISTORY_TAB = {
  ALL_RESULT: 'allResult',
  EARNED: 'earned',
  REDEEMED: 'redeemed',
  EXPIRING: 'expiringSoon',
};

export const EXPIRING = 'expiring';

export const LATEST_FIRST = 'latestFirst';

export const EXPIRYSOON = 'expirySoon';

export const PASSES_LEFT = 'left';

export const INDIGO = 'indigo';

export const QUERYPARAM_KEY = {
  TABKEY: 'tabKey',
  VOUCHERFILTER_KEY: 'voucherFilterKey',
};

export const SIXEPRIME = '6EPRIME';
export const SIXEPRIMEVOUCHER = '6E Prime Voucher';
export const BLUECHIPVALUE = 'BluChip Value';
export const EXPIRY = 'Expiry';
export const TYPE = 'Type';

export const EATKEYWORD = ['meal', 'eat'];
export const PRIMEKEYWORD = ['6eprime', 'prime'];
export const BLUECHIPKEYWORD = ['bluchip'];

export const SIXEEATFILTER = '6eEat';
export const SIXEPRIMEFILTER = '6E Prime';
export const BLUECHIPFILTER = 'IndiGoBluChip';

export const PARTNER_HISTORY_ANALYTICS = 'Partners History';
export const COUPON_LEFT = 'couponLeft';
export const IBC = 'ibc';
export const TRANSACTION_CHANNEL = 'Transaction channel';
