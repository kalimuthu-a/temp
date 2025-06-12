import { getEnvObj } from '../functions/utils';

let BASE_API_URL;
let CONTENT_TYPE_HEADER;
let BASE_API_URL_OLD = 'https://comm-uat.goindigo.in';
let SUB_BASE_API_URL_OLD = '/IndiGo-Dev2';
let MEMBER_LOGIN_OLD = '/Member/LoginAEM';
let AGENT_LOGIN_OLD = '/Agent/LoginAEM';
let CAPF_LOGIN_OLD = '/CAPF/LoginAEM';
let MEMBER_LOGOUT_OLD = '/Member/Logout';
let AGENT_LOGOUT_OLD = '/Agent/Logout';
let SUB_DOMAIN = '.goindigo.in';
let SUBSCRIPTION = 'S9pIpbp4QxCTs98Nzrmy0A==';
let RESET_PASSWORD_API;
let CHANGE_PASSWORD_API;
let RESET_PASSWORD_USERKEY;
let CHANGE_PASSWORD_USERKEY;
const envObj = getEnvObj();

if (Object.keys(envObj).length > 0 && envObj.BASE_API_URL) {
  BASE_API_URL = envObj.BASE_API_URL;
  CONTENT_TYPE_HEADER = envObj.CONTENT_TYPE_HEADER;
  BASE_API_URL_OLD = envObj.BASE_API_URL_OLD;
  SUB_BASE_API_URL_OLD = envObj.SUB_BASE_API_URL_OLD;
  MEMBER_LOGIN_OLD = envObj.MEMBER_LOGIN_OLD;
  AGENT_LOGIN_OLD = envObj.AGENT_LOGIN_OLD;
  CAPF_LOGIN_OLD = envObj.CAPF_LOGIN_OLD;
  MEMBER_LOGOUT_OLD = envObj.MEMBER_LOGOUT_OLD;
  AGENT_LOGOUT_OLD = envObj.AGENT_LOGOUT_OLD;
  SUB_DOMAIN = envObj.SUB_DOMAIN;
  SUBSCRIPTION = envObj.SUBSCRIPTION;
  RESET_PASSWORD_API = envObj.RESET_PASSWORD_API;
  CHANGE_PASSWORD_API = envObj.CHANGE_PASSWORD_API;
  RESET_PASSWORD_USERKEY = envObj.RESET_PASSWORD_USERKEY;
  CHANGE_PASSWORD_USERKEY = envObj.CHANGE_PASSWORD_USERKEY;
} else if (location.origin.includes('preprod')) {
  BASE_API_URL = 'https://api-preprod-session-skyplus6e.goindigo.in';

  CONTENT_TYPE_HEADER = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    user_key: 'ee9d95f32abd403433570df02d257640',
  };
} else if (location.origin.includes('prod')) {
  BASE_API_URL = 'https://api-prod-session-skyplus6e.goindigo.in';

  CONTENT_TYPE_HEADER = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    user_key: '654a6a3cc4998e498e5c0c8ead072915',
  };
} else {
  BASE_API_URL = 'https://SkyPlus-dev.goindigo.in/Login_Skyplus';

  CONTENT_TYPE_HEADER = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
}

export const ENDPOINT_HEADER = {
  ...CONTENT_TYPE_HEADER,
};

export const CREATE_SESSION_API_ENDPOINT = '/v1/token/create';
export const LOGOUT_SESSION_API_ENDPOINT = '/v1/token/delete';
export const KEEP_ALIVE_AUTH_TOKEN = '/v1/token/Refresh';

export const ANONYMOUS_USER_BODY = {
  strToken: '',
  subscriptionKey: SUBSCRIPTION,
};

export { BASE_API_URL, CONTENT_TYPE_HEADER };

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
export const AES_SECRET_KEY = window?.msdv2?.encryptionKey;

export default {
  BASE_API_URL,
  CONTENT_TYPE_HEADER,
  ENDPOINT_HEADER,
  CREATE_SESSION_API_ENDPOINT,
  KEEP_ALIVE_AUTH_TOKEN,
  ANONYMOUS_USER_BODY,
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
  LOGOUT_SESSION_API_ENDPOINT,
  BASE_API_URL_OLD,
  SUB_BASE_API_URL_OLD,
  MEMBER_LOGIN_OLD,
  AGENT_LOGIN_OLD,
  CAPF_LOGIN_OLD,
  MEMBER_LOGOUT_OLD,
  AGENT_LOGOUT_OLD,
  SUB_DOMAIN,
  AES_SECRET_KEY,
};

export {
  RESET_PASSWORD_API,
  CHANGE_PASSWORD_API,
  RESET_PASSWORD_USERKEY,
  CHANGE_PASSWORD_USERKEY,
};
