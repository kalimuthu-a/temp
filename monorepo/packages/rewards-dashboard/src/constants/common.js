export const LOGIN_SUCCESS = 'loginSuccessEvent';
export const TOGGLE_LOGIN_POPUP = 'toggleLoginPopupEvent';
export const GENERIC_TOAST_MESSAGE_EVENT = 'genericToastMessageEvent';
export const MAIN_LOADER_EVENT = 'mainLoaderEvent';

export const AGENT = 'Agent';
export const ANONYMOUS = 'Anonymous';
export const CORPORATE = 'Corporate';
export const MEMBER = 'Member';
export const SME_ADMIN = 'CorpConnectAdmin';
export const SME_USER = 'CorpConnectUser';
export const loginEvent = 'loginEven';
export const loginFail = 'loginFail';
export const dotRezLoginCk = 'aemLoginStatus';
export const dotRezAgentroleCk = 'aemOrgRole';
export const dotRezUserCurrencyCk = 'aemOrgCurrency';
export const pCkName = 'IndigoMemberVerificationCookie';
export const pSessionCk = 'aemPCK';
export const refreshAEMSession = 'refreshAEMSession';
export const PERPETUAL_LOGIN_EVT = 'perpetualLoginStatus';
export const WEB_ANONYMOUS = 'WebAnonymous';
export const DEFAULT_CURRENCY_CODE = 91;

export const FLIGHT_SELECT_PAGE = 'srp';
export const PASSENGER_EDIT_PAGE = 'passenger-edit';

export const loginVariationCodes = {
  MOBILE: 'mobile',
  STAFF: 'staff',
  USER: 'user',
};

export const analyticConstant = {
  CORP_CONNECT_ADMIN: 'Homepage - Corp Admin',
  CORP_CONNECT_USER: 'Homepage - Corp User',
  PERSONA_CORP_ADMIN: 'CorpConnectAdmin',
  PERSONA_CORP_USER: 'CorpConnectUser',
  CUSTOMER_LOGIN: 'Customer Login',
  PERSONA_MEMBER: 'Member',
  SME_LOGIN: 'SME Login',
  PARTNER: 'Partner Login',
  PERSONA_AGENT: 'Agent',
  AGENT_USER: 'Homepage - Agent',
  HOMEPAGE: 'Homepage',
  FLIGHT_SELECT: 'Flight Select',
  PASSENGER_SELECT: 'Passenger Details',

};

export default {
  LOGIN_SUCCESS,
  // ENDPOINT_HEADER,
  TOGGLE_LOGIN_POPUP,
  // CONTENT_TYPE_HEADER,
  AGENT,
  ANONYMOUS,
  MEMBER,
  SME_USER,
  SME_ADMIN,
  CORPORATE,
  loginEvent,
  loginFail,
  dotRezLoginCk,
  dotRezAgentroleCk,
  dotRezUserCurrencyCk,
  pCkName,
  pSessionCk,
  refreshAEMSession,
  PERPETUAL_LOGIN_EVT,
  WEB_ANONYMOUS,
  GENERIC_TOAST_MESSAGE_EVENT,
  MAIN_LOADER_EVENT,
  DEFAULT_CURRENCY_CODE,
  loginVariationCodes,
};
