export const PAX_TYPES = ['ADT', 'SRCT', 'CHD', 'INFT'];

export const PAX_FORM_KEYS_TO_IGNORE = [
  'passengerKey',
  'passengerTypeCode',
  'discountCode',
];

export const localStorageKeys = {
  bw_cntxt_val: 'bw_cntxt_val',
  c_m_d: 'c_m_d',
  recent_searches: 'recent_searches',
  recent_city_searches: 'recent_city_searches',
  ext_pax_keys: 'ext_pax_keys',
  upd_flds: 'upd_flds',
  srct_ids: 'srct_ids',
  journeyReview: 'journeyReview',
  passengerPost: 'passengerPost',
  ALTNUMB: 'ALT_NUMB',
  GENERIC_DATA_CONTAINER_APP: 'generic_data_container_app',
  ERROR_CODE_AEM_MAPPING: 'info_errorMessageItemListByPath',
  loyal_opt_signup_enroll: 'loyal-opt-signup-enroll',
};

export const BROWSER_STORAGE_KEYS = {
  TOKEN: 'auth_token', // cookie
  BOOKING_WIDGET_INFO: 'bw_cntxt_val', // localstorage
  ROLE_DETAILS: 'role_details', // cookie
  ADD_PASSENGER_PAYLOAD: 'ADD_PASSENGER_PAYLOAD', // localStorage
  CONTACT_DETAILS_FROM_SRP: 'cd_n', // localstorage
  SPECIALFARE_PCLASS_FROM_SRP: 'sfd_n', // localstorage
  MODIFY_ITINERARY_VALUES: 'iti_mo', // localStorage
  SPECIALFARE_ID_DATA: 'speci_pa_dat', // specialfare data in localstorage
  SME_ROLE_TYPE: 'SMEC',
  AGENT_ROLE_TYPE: 'RCTT',
};

export const TYPE = {
  api: 'business',
  network: 'network',
  validation: 'user',
};

export const SOURCE = {
  api: 'MS-API',
  aem: 'AEM',
  mf: 'MF',
};

export const GTM_CONSTANTS = {
  PAX_INFO: 'pax_info',
  NEXT: 'Next',
  FLIGHTS: 'Flights',
  PAGELOAD: 'pageload',
  DOMESTIC: 'Domestic',
  ERROR_EVENT_TYPE: 'Error',
  ERROR_SWITCH_CASE: 'error',
  BOOKING_FLOW: 'Booking Flow',
  LINK_CLICK: 'Link/ButtonClick',
  INTERNATIONAL: 'International',
  CAPTURE_API_RESPONSE: 'captureApiRes',
  MODIFICATION_FLOW: 'Modification Flow',
  PASSENGEREDIT_PAGE_TYPE: 'passenger-edit',
  API_RESPONSE_INTERACTION_TYPE: 'API response',
  BROWSER_STORAGE_KEYS: { TOKEN: 'auth_token' },
  PAGENAME_PASSENGER_DETAILS: 'Passenger Details',
  ENTER_PASSENGER_DETAILS: 'enterPassengerDetails',
  GOOGLE_ANALYTIC_EVENT_PASSENGER_DETAILS: 'passenger_details',
  PAGENAME_PASSENGER_DETAILS_MODIFICATION: 'Passenger Details Modification',
  TRAVEL_ASSISTANT_SSRCODE: 'PROT',
  TRAVEL_ASSISTANT_SSRCODE_INTL0: 'PRI0',
  TRAVEL_ASSISTANT_SSRCODE_INTL1: 'PRI1',
  TRAVEL_ASSISTANT_SSRCODE_INTL2: 'PRI2',
  TRAVEL_ASSISTANT_SSRCODE_INTL3: 'PRI3',
  TRAVEL_ASSISTANT_SSRCODE_INTL4: 'PRI4',
  TRAVEL_ASSISTANT_SSRCODE_INTL5: 'PRI5',
  TRAVEL_ASSISTANT_SSRCODE_INTL6: 'PRI6',
  TRAVEL_ASSISTANT_SSRCODE_INTL7: 'PRI7',
  TRAVEL_ASSISTANT_SSRCODE_INTL8: 'PRI8',
  ZERO_CANCELLATION_SSRCODE: 'IFNR',
  HEADER_CONTENT_UPDATE_EVENT: 'HEADER_CONTENT_UPDATE_EVENT',
  SIGN_IN_NOW: 'SIGN_IN_NOW',
  PASSENGER_DETAILS: 'Passenger Details',
  DESTINATION: 'Destination',
  WWWA: 'WWWA',
  MEMBER: 'Member',
  EN: 'en',
};

export const AA_CONSTANTS = {
  NO_STATUS_CODE: 'No Status Code',
  NO_CODE: 'No Code',
  NO_DISPLAY_MESSAGE: 'No Message Displayed',
  NO_STATUS_MESSAGE: 'No Status Message',
  BE_ERROR: 'BE Error',
  MS_API: 'MS API',
  PAGE_LOAD: 'Page load',
  PAGE_NAME: 'Passenger Details',
};

export const GTM_ANALTYTICS = {
  EVENTS: {
    ERROR: 'error',
    API_RESPONSE: 'api response',
  },
};
