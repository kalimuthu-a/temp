/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
import JSEncrypt from 'jsencrypt';
import { ddRumErrorPayload, getEnvObj } from './utils';
import { createBrowserCookie, deleteBrowserCookie } from './userToken';
import Cookies from './cookies';
import { AGENT, dotRezAgentroleCk, dotRezUserCurrencyCk, MEMBER } from '../constants/common';
import COOKIE_KEYS from '../constants/cookieKeys';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import pushDDRumAction from '../utils/ddrumEvent';

export const serialize = (data) => Object.keys(data)
  .map((keyName) => {
    if (data[keyName] instanceof Array) {
      return data[keyName]
        .map(
          (key) => `${encodeURIComponent(keyName)}=${encodeURIComponent(key)}`,
        )
        .join('&');
    }
    return `${encodeURIComponent(keyName)}=${encodeURIComponent(
      data[keyName],
    )}`;
  })
  .join('&');

let BASE_API_URL_OLD = 'https://book.goindigo.in';
let SUB_BASE_API_URL_OLD = '';
let MEMBER_LOGIN_OLD = '/Member/LoginAEM';
let AGENT_LOGIN_OLD = '/Agent/LoginAEM';
let CAPF_LOGIN_OLD = '/CAPF/LoginAEM';
let MEMBER_LOGOUT_OLD = '/Member/Logout';
let AGENT_LOGOUT_OLD = '/Agent/Logout';
let SUB_DOMAIN = '.goindigo.in';
let ENC_PUB = '';

const envObj = getEnvObj();
if (Object.keys(envObj).length > 0 && envObj.BASE_API_URL_OLD) {
  BASE_API_URL_OLD = envObj.BASE_API_URL_OLD;
  SUB_BASE_API_URL_OLD = envObj.SUB_BASE_API_URL_OLD;
  MEMBER_LOGIN_OLD = envObj.MEMBER_LOGIN_OLD;
  AGENT_LOGIN_OLD = envObj.AGENT_LOGIN_OLD;
  CAPF_LOGIN_OLD = envObj.CAPF_LOGIN_OLD;
  MEMBER_LOGOUT_OLD = envObj.MEMBER_LOGOUT_OLD;
  AGENT_LOGOUT_OLD = envObj.AGENT_LOGOUT_OLD;
  SUB_DOMAIN = envObj.SUB_DOMAIN;
  ENC_PUB = envObj.ENC_PUB;
}

export const encryptPassword = function (pass) {
  if (pass) {
    const publicKey = ENC_PUB;
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(pass) || '';
  }
  return '';
};

export const getMemberLoginOld = async (
  userType,
  countryCode,
  mobileNo,
  password,
  isEncrypted,
  rememberMe,
  oldLoginDetails,
// eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  // eslint-disable-next-line no-shadow
  const createRequestBody = (mobileNo, password, isEncrypted, rememberMe) => {
    return {
      'memberLogin.countryCode': `+${Number(countryCode)}`,
      'memberLogin.MemberMobileNo': mobileNo,
      'memberLogin.Password': encryptPassword(password),
      'memberLogin.Username': mobileNo,
      IsEncrypted: isEncrypted,
      memberLogin_Submit: 'Login',
      'IndigoLoginMember.IsRememberMe': !!rememberMe,
    };
  };
  let requestBody = null;
  /* comment if (!userType || userType === 'anonymous') {
      // requestBody = config.ANONYMOUS_USER_BODY;
    } else */
  if (mobileNo && password) {
    requestBody = createRequestBody(
      mobileNo,
      password,
      isEncrypted,
      rememberMe,
    );
  } else {
    throw new Error('username or password is missing for Member user.');
  }

  // eslint-disable-next-line max-len
  const urlOldMemberLogin = `${oldLoginDetails.baseApiUrlOld}${oldLoginDetails.subBaseApiUrlOld}${oldLoginDetails.memberLoginOld}`;
  const headerOLD = {
    'Content-type':
            'application/x-www-form-urlencoded;text/html; charset=UTF-8',
  };
  let getMemberLoginPayload = DD_RUM_PAYLOAD;
  const getMemberLoginAction = DD_RUM_EVENTS.GET_MEMBER_LOGIN;
  const startTimer = performance.now();

  try {
    const oldMemberResponse = await fetch(urlOldMemberLogin, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: headerOLD,
      body: serialize(requestBody),
    });

    getMemberLoginPayload.apiurl = urlOldMemberLogin;
    getMemberLoginPayload.method = 'POST';
    getMemberLoginPayload.mfname = MF_NAME;
    getMemberLoginPayload.requestbody = requestBody;
    getMemberLoginPayload.responseTime = (performance.now() - startTimer) / 1000;
    getMemberLoginPayload.statusCode = oldMemberResponse?.status;

    const oldMemberResponseJson = await oldMemberResponse.json();

    if (oldMemberResponseJson?.indiGoError?.errors || !oldMemberResponse.ok) {
      getMemberLoginPayload = ddRumErrorPayload(getMemberLoginPayload, oldMemberResponseJson?.indiGoError?.errors);
    } else {
      getMemberLoginPayload.response = oldMemberResponseJson;
    }

    // push actions to Datadog event listner
    pushDDRumAction(getMemberLoginAction, getMemberLoginPayload);

    const data = oldMemberResponseJson;
    if (data?.indiGoMemberProfile?.member?.name) {
      const cookieLifeTime = new Date();
      const exp = new Date(cookieLifeTime.getTime() + 15 * 60 * 1000);
      // Assuming COOKIES is an object containing cookie keys
      if (Cookies.get(COOKIE_KEYS.ROLE)) {
        deleteBrowserCookie(COOKIE_KEYS.ROLE, '/', oldLoginDetails.subDomain);
      }

      if (Cookies.get(dotRezAgentroleCk)) {
        deleteBrowserCookie(dotRezAgentroleCk, '/', oldLoginDetails.subDomain);
      }

      if (Cookies.get(dotRezUserCurrencyCk)) {
        deleteBrowserCookie(
          dotRezUserCurrencyCk,
          '/',
          oldLoginDetails.subDomain,
        );
      }

      createBrowserCookie(
        COOKIE_KEYS.ROLE,
        MEMBER,
        exp.toUTCString(),
        oldLoginDetails.subDomain,
        '/',
      );
      createBrowserCookie(
        dotRezAgentroleCk,
        data?.indigoChooseRole?.roleCode,
        exp.toUTCString(),
        oldLoginDetails.subDomain,
        '/',
      );
      createBrowserCookie(
        dotRezUserCurrencyCk,
        '',
        exp.toUTCString(),
        oldLoginDetails.subDomain,
        '/',
      );

      const pCk = Cookies.get('IndigoMemberVerificationCookie');
      if (pCk) {
        createBrowserCookie('aemPCK', 'true', oldLoginDetails.subDomain, 0);
      }
    }
    if (data?.indiGoError?.errors) {
      console.log('--error', data?.indiGoError?.errors);
    }
  } catch (error) {
    getMemberLoginPayload = ddRumErrorPayload(getMemberLoginPayload, error);

    // push actions to Datadog event listner
    pushDDRumAction(getMemberLoginAction, getMemberLoginPayload);
    return Promise.reject(error);
  }
  return null;
};

export const getAgentLoginOld = async (
  userType,
  agentId,
  password,
  isEncrypted,
  oldLoginDetails,
) => {
  let loginPostObj = {};
  let oldLoginUrl = '';
  // eslint-disable-next-line no-shadow
  const createRequestBody = (userType, agentId, password, isEncrypted) => {
    switch (userType) {
      case 'CAPF':
        loginPostObj = {
          'CAPFLogin.Username': agentId,
          'CAPFLogin.Password': encryptPassword(password),
          IsEncrypted: isEncrypted,
          usertype: 'admin',
        };
        break;
      case 'CorpConnectAdmin':
        loginPostObj = {
          'agentLogin.Username': agentId,
          'agentLogin.Password': encryptPassword(password),
          IsEncrypted: isEncrypted,
          usertype: 'admin',
        };
        break;
      case 'CorpConnectUser':
        loginPostObj = {
          'agentLogin.Username': agentId,
          'agentLogin.Password': encryptPassword(password),
          IsEncrypted: isEncrypted,
          usertype: 'user',
        };
        break;
      default:
        // for Agent login
        loginPostObj = {
          'agentLogin.Username': agentId,
          'agentLogin.Password': encryptPassword(password),
          IsEncrypted: isEncrypted,
        };
    }
    return loginPostObj;
  };
  let requestBody = null;
  /* comment if (!userType || userType === 'anonymous') {
      console.log('userType', userType);
    } else { */

  if (agentId && password) {
    requestBody = createRequestBody(userType, agentId, password, isEncrypted);
  } else {
    throw new Error('username or password is missing for Member user.');
  }

  oldLoginUrl = `${oldLoginDetails.baseApiUrlOld}${oldLoginDetails.subBaseApiUrlOld}${oldLoginDetails.agentLoginOld}`;
  if (userType === 'capf') {
    oldLoginUrl = `${oldLoginDetails.baseApiUrlOld}${oldLoginDetails.subBaseApiUrlOld}${oldLoginDetails.capfLoginOld}`;
  }

  const headerOLD = {
    'Content-type':
            'application/x-www-form-urlencoded; text/html; charset=UTF-8',
  };

  try {
    const oldAgentApiResponse = await fetch(oldLoginUrl, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: headerOLD,
      body: serialize(requestBody),
    });

    const oldAgentDataResponse = await oldAgentApiResponse.json();
    if (oldAgentDataResponse) {
      const cookieLifeTime = new Date();
      const exp = new Date(cookieLifeTime.getTime() + 15 * 60 * 1000);
      if (Cookies?.get(COOKIE_KEYS.ROLE) !== AGENT) {
        deleteBrowserCookie(COOKIE_KEYS.ROLE, '/', oldLoginDetails.subDomain);
      }
      if (Cookies.get(dotRezAgentroleCk)) {
        deleteBrowserCookie(dotRezAgentroleCk, '/', oldLoginDetails.subDomain);
      }
      if (Cookies.get(dotRezUserCurrencyCk)) {
        deleteBrowserCookie(
          dotRezUserCurrencyCk,
          '/',
          oldLoginDetails.subDomain,
        );
      }

      createBrowserCookie(
        COOKIE_KEYS.ROLE,
        AGENT,
        exp.toUTCString(),
        oldLoginDetails.subDomain,
        '/',
      );
      createBrowserCookie(
        dotRezAgentroleCk,
        oldAgentDataResponse?.indigoChooseRole?.roleCode,
        exp.toUTCString(),
        oldLoginDetails.subDomain,
        '/',
      );
      createBrowserCookie(
        dotRezUserCurrencyCk,
        oldAgentDataResponse?.organizationProfile?.currencyCode,
        exp.toUTCString(),
        oldLoginDetails.subDomain,
        '/',
      );
      if (Cookies.get('IndigoMemberVerificationCookie')) {
        createBrowserCookie('aemPCK', 'true', oldLoginDetails.subDomain, 0);
      }
    }

    console.log('--error', oldAgentDataResponse?.indiGoError?.errors);
  } catch (error) {
    return Promise.reject(error);
  }
  return null;
};

export const onSubmitFormOldLoginHandler = async (
  userType,
  username,
  password,
  countryCodeValues,
  stateRef,
  oldLoginDetails,
) => {
  if (username && password) {
    /* comment Old(BAU) member,agent,corp-connect admin, corp-connect user, cafp login support */
    if (userType === 'Member' || userType === 'member') {
      try {
        const memberOldAPI = await getMemberLoginOld(
          userType,
          countryCodeValues,
          username,
          password,
          true,
          stateRef?.rememberMe,
          oldLoginDetails,
        );
        return Promise.resolve(memberOldAPI);
      } catch (error) {
        console.log(error, 'Error for old Member login api');
        return Promise.reject({
          user: null,
          token: {},
          oldLoginError: true,
          message: 'Login failed',
        });
      }
    } else {
      try {
        const memberOldAPI = await getAgentLoginOld(
          userType,
          username,
          password,
          true,
          oldLoginDetails,
        );
        return Promise.resolve(memberOldAPI);
      } catch (error) {
        return Promise.reject({
          user: null,
          token: {},
          oldLoginError: true,
          message: 'Login failed',
        });
      }
    }
  }
  return null;
};

const oldLoginDetails = {
  baseApiUrlOld: BASE_API_URL_OLD,
  subBaseApiUrlOld: SUB_BASE_API_URL_OLD,
  memberLoginOld: MEMBER_LOGIN_OLD,
  agentLoginOld: AGENT_LOGIN_OLD,
  capfLoginOld: CAPF_LOGIN_OLD,
  memberLogoutOld: MEMBER_LOGOUT_OLD,
  agentLogoutOld: AGENT_LOGOUT_OLD,
  subDomain: SUB_DOMAIN,
};

const makeBauLoginInitiate = async ({ persona, userId, password, countryCode }) => {
  // comment BAU - Login --START
  try {
    await onSubmitFormOldLoginHandler(
      persona,
      userId,
      password,
      countryCode
            || 91,
      { rememberMe: false },
      oldLoginDetails,
    );
  } catch (error) {
    console.log('---unCaught BAU login error::::::', error);
  }
  // comment BAU - Login --END
};

export {
  makeBauLoginInitiate,
};
