// eslint-disable-next-line import/prefer-default-export
export const PREFFERED_COUNTRY_CODE = 'in';
export const DEFAULT_COUNTRY_CODE = '91';
export const LABEL_TEXT_INCOMPLETE = 'incomplete';
export const LABEL_TEXT_COMPLETE = 'completed';
export const PRIMARY_CONTACT_ELEMENT_NAME = 'primaryContact';
export const COUNTRY_CODE_ELEMENT_NAME = 'countryCode';
export const EMAIL_ADDRESS_ELEMENT_NAME = 'email';
export const ALT_COUNTRY_CODE_ELEMENT_NAME = 'altCountryCode';
export const ALT_EMAIL_ELEMENT_NAME = 'altEmail';
export const ALT_CONTACT_ELEMENT_NAME = 'altContact';
export const INFANT_TYPE_CODE = 'INFT';
export const MALE_GENDER_TYPE = 'Male';
export const FEMALE_GENDER_TYPE = 'Female';
export const OTHERS_GENDER_TYPE = 'Others';
export const TAG_EXTRA_SEATS_ERROR_LABEL = 'Please complete all the details to proceed.';
export const ADT_AGE_LIMIT_ERROR_MSG = 'Please enter valid date (12 years or above)';
export const SRCT_AGE_LIMIT_ERROR_MSG = 'Please enter valid date (60 years or above)';
export const CHD_AGE_LIMIT_ERROR_MSG = 'Please enter valid date (between 3 to 12 years)';
export const IFT_AGE_LIMIT_ERROR_MSG = 'Please enter valid date (less than 3 years)';
export const FUTURE_DATE_ERROR_MSG = 'Future date is not allowed';
export const INVALID_DATE_ERROR_MSG = 'Please enter valid date';
export const GENDER_FIELD_NAME = 'gender';
export const SEAT_TAGGING_FIELD_NAME = 'seatTagging';
export const FIRST_AND_MIDDLE_FIELD_NAME = 'first';
export const LAST_FIELD_NAME = 'last';
export const DOB_FIELD_NAME = 'DOB';
export const DOB_FIELD_LABEL = 'dateOfBirth';
export const SRCT_ID_FIELD_NAME = 'srctId';
export const ARMED_FORCE_ID_FIELD_NAME = 'armedForcesId';
export const STUDENT_ID_FIELD_NAME = 'studentId';
export const TRIPLE_SEAT_CODE = 'EXT2';
export const DOUBLE_SEAT_LABEL = 'Double seat';
export const DOUBLE_SEAT_CODE = 'EXT';
export const TRIPLE_SEAT_LABEL = 'Triple seat';
export const SRCT_ID = 'SRCT';
export const TRIPLE_LABEL = 'Triple';
export const DOUBLE_LABEL = 'Double';
export const NONE_SEAT_CODE = 'none';
export const NONE_SEAT_LABEL = 'None';
export const SRCT_ID_FIELD_LABEL = 'seniorCitizenId';
export const MEDICAL_LABEL = 'MEDICAL';
export const HOSPITAL_ID_LABEL = 'hospitalId';
export const ARMED_FORCE_ID_LABEL = 'armedForcesId';
export const ARMED_FORCE_ID_CODE = 'DFN';
export const UMNR_ID_CODE = 'UMNR';
export const UMNR_AGE_ERROR_MSG = 'Age should be 5 to 12';
export const STUDENT_ID_CODE = 'STU';
export const STUDENT_ID_LABEL = 'studentId';
export const INSTITUTION_ID_LABEL = 'institutionId';
export const DATE_FORMAT_INFO_LABEL = 'Please enter date of birth in (DD-MM-YYYY) format i.e. 25-04-1998';
export const DUPLICATE_SRCTID_ERROR_MSG = 'Senior Citizen Id should be unique for each Senior Citizen passenger';
export const ALT_CONTACT_LABEL = 'Alternate contact number';
export const ADD_PASSENGER_PAYLOAD = 'ADD_PASSENGER_PAYLOAD';
export const PASSENGER_LABEL = 'Passenger';
export const WHATSAPP_KEY = 'whatsapp';
export const EUROPEAN_RESIDENT_KEY = 'europeanResident';
export const VAXI_SPECIAL_CODE = 'VAXI';
export const PRIVACY_POLICY_KEY = 'privacyPolicy';
export const MINOR_POLICY_KEY = 'privacyPolicyMinor';
export const PE_PAGE = 'passenger-edit';
export const PE_MODIFICATION_PAGE = 'passenger-edit-modification';
export const FF_NUMBER = 'FFN';
export const FAREMASKING_KEY = 'fareMasking';
export const CONSENT_TYPE_YES = 'Yes';
export const CONSET_TYPE_NO = 'No';
export const PASSENGER_TYPE = {
  ADULT: 'ADT',
  SENIOUR: 'SRCT',
  CHILD: 'CHD',
  INFANT: 'INFT',
};

export const PASSENGER_TYPE_NAME = {
  ADULT: 'Adult',
  SENIOUR: 'Senior Citizen',
  CHILD: 'Child',
  INFANT: 'Infant',
};
export const MALE_CHILD_TITLE = 'MR';
export const MALE_TITLE = 'MR';
export const FEMALE_CHILD_TITLE = 'MS';
export const FEMALE_TITLE = 'MS';
export const MALE_CHILD_TITLE_CODE = '1';
export const ALL_GENDERS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  // { label: 'Others', value: 'Others' },
];
export const ALL_SEATS = [
  { label: DOUBLE_SEAT_LABEL, value: DOUBLE_SEAT_LABEL, seatKey: 'EXT' },
  { label: TRIPLE_SEAT_LABEL, value: TRIPLE_SEAT_LABEL, seatKey: 'EXT2' },
  { label: NONE_SEAT_LABEL, value: 'none', disabled: false },
];
export const DOUBLE_SEAT = [
  { label: DOUBLE_SEAT_LABEL, value: DOUBLE_SEAT_LABEL, seatKey: 'EXT' },
  { label: TRIPLE_SEAT_LABEL, value: TRIPLE_SEAT_LABEL, seatKey: 'EXT2', disabled: true },
  { label: NONE_SEAT_LABEL, value: 'none', disabled: false },
];
export const TRIPLE_SEAT = [
  { label: DOUBLE_SEAT_LABEL, value: DOUBLE_SEAT_LABEL, seatKey: 'EXT', disabled: true },
  { label: TRIPLE_SEAT_LABEL, value: TRIPLE_SEAT_LABEL, seatKey: 'EXT2' },
  { label: NONE_SEAT_LABEL, value: 'none', disabled: false },
];
export const MEDICAL_REASONS = 'medicalReasons';
export const SENIOR_CITIZEN = 'seniorCitizens';
export const WHEELCHAIR_USER = 'wheelchairUser';
export const OTHERS = 'others';

export const dateFormats = {
  USER_FRIENDLY_FORMAT: 'DD-MM-YYYY',
  YYYY_MM_DD: 'YYYY-MM-DD',
};
export const LOGIN_SUCCESS = 'loginSuccessEvent';
export const LOGOUT_SUCCESS = 'logoutSuccessEvent';
export const LOYALTY_LOGIN_SUCCESS = 'LOYALTY_MEMBER_LOGIN_SUCCESS';
export const TOGGLE_LOGIN_POPUP = 'toggleLoginPopupEvent';
export const LOGIN_POPUP = 'loginSSOPopup';
export const ENROLL_SSO_LOYALTY_POPUP = 'EnrollSSOloyalty';
export const MF_NAME = 'passenger-edit';
export const CUSTOM_EVENTS = {
  MAKE_ME_EXPAND_V2: 'MAKE_ME_EXPAND_V2',
  ONCLICK_NEXT_FARE_SUMMARY_V2: 'ONCLICK_NEXT_FARE_SUMMARY_V2',
  EVENT_FARE_SUMMARY_DATA_TRANSFER: 'EVENT_FARE_SUMMARY_DATA_TRANSFER',
  REVIEW_SUMMARY_API_DATA: 'REVIEW_SUMMARY_API_DATA',
  GET_PASSENGER_DATA_FROM_FARE: 'GET_PASSENGER_DATA_FROM_FARE',
  PASSENGER_ADDED: 'PASSENGER_ADDED',
  TRACK_DOM_CHANGE: 'TRACK_DOM_CHANGE',
  EVENT_FARE_SUMMARY_FARE_SPLIT: 'EVENT_FARE_SUMMARY_FARE_SPLIT',
};

export const SALUTATION_ADULT = [
  { label: 'Mr.', value: 'MR', gender: '1' },
  { label: 'Ms.', value: 'MS', gender: '2' },
  { label: 'Mrs.', value: 'MRS', gender: '3' },
];

export const WHEELCHAIR_ADDON_SSRCODE = 'WCHR';
export const FIRSTTIME_FLYER_ADDON_SSRCODE = 'FTIM';
// used for ramp wheelchair -> user chooses otherthan "wheelchair user" as reason
export const WHEELCHAIR_USER_CODE = 'WCHC'; // used for cabin wheelchair -> user chooses "wheelchair user" as reason

export const DEAF_SSRCODE = 'DEAF';
export const BLND_SSRCODE = 'BLND';
export const MUTE_SSRCODE = 'MUTE';
export const TA_SSRCODE = 'PROT';
export const ZERO_CANCELLATION_SSRCODE = 'IFNR';

export const ALL_LABEL = 'all';
export const INTELLECTUAL_DEVELOPMENT_DISABILITY = 'personWithIntellectualOrDevelopmentDisabilityNeedingAssistance';
export const ELECTRONIC_WHEELCHAIR = 'electronicWheelchairPersonalWheelchairUser';
export const WHEELCHAIR = 'wheelchair';

export const ALREADY_OPT = 'AlreadyOpt';
export const IS_REQUIRED = 'Required';
export const ETRA_SEATS_LABEL = {
  DOUBLE: DOUBLE_SEAT_LABEL,
  TRIPLE: TRIPLE_SEAT_LABEL,
};
export const EXTRA_SEATS_RADIOS = {
  DOUBLE: DOUBLE_SEAT,
  TRIPLE: TRIPLE_SEAT,
};

export const ageLimitUtil = {
  ADULT_START_LOYALTY: 18,
  ADULT_START: 12,
  ADULT_END: 200,
  SENOIR_START: 60,
  SENOIR_END: 200,
  CHILD_START: 2,
  CHILD_UNMR_START: 5,
  CHILD_END: 12,
  INFANT_START_DAYS: 3, // Minimum this days old required
  INFANT_END: 2,
};

export const ENCRYPT_VALUE = 256;
export const PAX_NAME_CHAR_LIMIT = 32;
export const HEADER_CONTENT_UPDATE_EVENT = 'HEADER_CONTENT_UPDATE_EVENT';
export const SPECIALFARE_ID_DATA = 'speci_pa_dat';
export const PASSENGER_EDIT_SECTION_IDENTIFIER = {
  ADDON: 'addon',
  SEATSELECTION: 'seat',
  MFTO_OPEN_ADDON: 'addon',
  MFTO_OPEN_SEAT: 'seat-selection',
};

export const TA_AEM_KEYS = {
  DEFAULT: 'default',
  SELECTED: 'selected',
  UNSELECTED: 'unselected',
};

export const WHATSAPP_COMPONENT = {
  DEFAULT: 'Whatsapp Pre Opted',
  SELECTED: 'Whatsapp new opted',
  UNSELECTED: 'Whatsapp not opted',
};

export const WHATSAPP_OPT_STATUS = {
  [WHATSAPP_COMPONENT.DEFAULT]: 'Y',
  [WHATSAPP_COMPONENT.SELECTED]: 'Y',
  [WHATSAPP_COMPONENT.UNSELECTED]: 'N',
};

const SAVER_FARE = 'Saver fare';

export const fareTypeList = {
  F: 'Corporate fare',
  A: SAVER_FARE,
  O: 'Super 6E fare',
  N: SAVER_FARE,
  S: 'Sale fare',
  B: 'Zero bag fare',
  T: 'Tactical Fare',
  C: 'Promo Fare',
  J: 'Flexi plus fare',
  M: 'SME fare',
  R: SAVER_FARE,
};

export const SME_ADMIN = 'CorpConnectAdmin';
export const SME_USER = 'CorpConnectUser';
export const PERSONA_AGENT = 'Agent';

export const specialAssistanceKeys = {
  MUTE: 'speechImpaired',
  BLND: 'visuallyImpaired',
  DEAF: 'hearingImpaired',
  DPNA: 'personWithIntellectual',
  WCHR: 'wheelchair',
  FTIM: 'isFirstTimeFlyer',
};

export const INDIGO_BLUCHIPS = 'IndiGo BluChips';
export const INDIGO_BLUCHIPS_CASH = 'IndiGo BluChips + Cash';
export const NOMINEE = 'NOMINEE';
export const SELF = 'SELF';

export const ALL_CONSENT = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  // { label: 'Others', value: 'Others' },
];

// datadog event list names
export const DD_RUM_EVENTS = {
  GET_PASSENGER_LIST: 'getPassengerList',
  AEM_DATA: 'aemData',
  AEM_ADDITIONAL_DATA: 'aemAdditionalData',
  POLICY_CONSENT: 'policyConsent',
  ADD_PASSENGER_DETAILS: 'addPassengerDetails',
  LOYALTY_SIGNUP: 'signUpLoyalty',
};

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

export const GST_ERROR_CODE = 'GSTRequired';
