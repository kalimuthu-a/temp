/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import constants, { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import Cookies from './cookies';
import COOKIE_KEYS from '../constants/cookieKeys';
import { ddRumErrorPayload, getEnvObj } from './utils';
import pushDDRumAction from '../utils/ddrumEvent';

const {
  BASE_API_URL,
  ENDPOINT_HEADER,
  ANONYMOUS_USER_BODY,
  KEEP_ALIVE_AUTH_TOKEN,
  CREATE_SESSION_API_ENDPOINT,
  AGENT,
  MEMBER,
  dotRezAgentroleCk,
  dotRezUserCurrencyCk,
  AES_SECRET_KEY,
} = constants;

export const getUserToken = (
  config = {},
  userType = '',
  username = '',
  password = '',
  apiDataConfig = {},
) => {
  const usernameEncryted = encryptAESForLogin(username, AES_SECRET_KEY);
  const passwordEncrypted = encryptAESForLogin(password, AES_SECRET_KEY);
  const createMemberRequestBody = ({
    username = '',
    password = '',
    userType,
  }) => ({
    nskTokenRequest: {
      applicationName: 'SkyplusWeb',
      credentials: {
        domain: 'WW2',
        location: 'WWW',
        channelType: 'Web',
        password: passwordEncrypted,
        username: usernameEncryted,
        alternateIdentifier: '',
      },
    },
    isEncrypted: true,
    usertype: userType,
    ...ANONYMOUS_USER_BODY,
  });

  let requestBody = null;
  if (!userType || userType === 'anonymous') {
    requestBody = config.ANONYMOUS_USER_BODY;
  } else {
    if (!username || !password) {
      throw new Error(`username or password is missing for ${userType} user.`);
    }
    requestBody = createMemberRequestBody({ userType, username, password });
  }
  // MFA - OTP verification requestbody
  if (apiDataConfig && apiDataConfig?.otpText && requestBody) {
    requestBody = {
      ...requestBody,
      ...{
        applicationName: apiDataConfig.applicationName,
        otpText: apiDataConfig.otpText,
        otpAgentReferenceToValidate: apiDataConfig.otpAgentReferenceToValidate,
      },
    };
  }

  return fetch(`${config.BASE_API_URL}${config.CREATE_SESSION_API_ENDPOINT}`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: config.ENDPOINT_HEADER,
  });
};

export const getUserTokenOld = (
  config = {},
  userType = '',
  username = '',
  password = '',
) => {
  const createRequestBody = (userType, username, password) => {
    switch (userType) {
      case 'Agent':
        return {
          'agentLogin.Username': username,
          'agentLogin.Password': password,
          isEncrypred: true,
        };
      case 'Member':
        return {};
      default:
        return null;
    }
  };

  const requestBody = createRequestBody(userType, username, password);
  if (!requestBody) {
    throw new Error('Please proivde a valid usertype');
  }

  const uri = `${
    config.BASE_API_URL_OLD
  }${config.LOGIN_API_ENDPOINT_OLD.replace('--1--', userType)}`;

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: config.CONTENT_TYPE_HEADER,
  });
};

export const anonymousUserToken = () => getUserToken(
  {
    ANONYMOUS_USER_BODY,
    BASE_API_URL,
    CREATE_SESSION_API_ENDPOINT,
    ENDPOINT_HEADER,
  },
  '',
);

export const refreshAccessToken = async () => {
  let parsedAuthToken = null;
  const authToken = Cookies.get(COOKIE_KEYS.AUTH);

  try {
    parsedAuthToken = JSON.parse(authToken);
  } catch (ex) {
    parsedAuthToken = null;
  }

  if (parsedAuthToken === null) {
    return null;
  }

  let refreshAccessTokenPayload = DD_RUM_PAYLOAD;
  const refreshAccessTokenAction = DD_RUM_EVENTS.REFRESH_ACCESS_TOKEN;
  const startTimer = performance.now();

  const url = `${BASE_API_URL}${KEEP_ALIVE_AUTH_TOKEN}`;
  const apiResponse = await axios.put(url, null, {
    headers: {
      Authorization: parsedAuthToken.token,
      'Content-Type': 'application/json',
    },
  });

  refreshAccessTokenPayload.apiurl = url;
  refreshAccessTokenPayload.method = 'PUT';
  refreshAccessTokenPayload.mfname = MF_NAME;
  refreshAccessTokenPayload.statusCode = apiResponse?.status;
  refreshAccessTokenPayload.responseTime = (performance.now() - startTimer) / 1000;

  const { errors, data, status, statusText } = apiResponse;

  if (errors || !apiResponse.ok) {
    refreshAccessTokenPayload = ddRumErrorPayload(refreshAccessTokenPayload, errors);
  } else {
    refreshAccessTokenPayload.response = data;
  }
  // push actions to Datadog event listner
  pushDDRumAction(refreshAccessTokenAction, refreshAccessTokenPayload);
  return { ...data, status, statusText, errors, token: parsedAuthToken.token };
};

export const addExpirationDataToToken = (apiTokenObject) => {
  if (
    !apiTokenObject
    || !apiTokenObject.token
    || !apiTokenObject.idleTimeoutInMinutes
  ) {
    throw new Error(
      'ADD_EXPIRATION_INFO_TO_THE_TOKEN: Invalid token object, required information is missing',
      apiTokenObject,
    );
  }
  const { token, idleTimeoutInMinutes } = apiTokenObject;
  const createdAtMilliSeconds = new Date().getTime();
  const expiresInMilliSeconds = +idleTimeoutInMinutes * 60 * 1000;
  const validTillMilliSeconds = createdAtMilliSeconds + expiresInMilliSeconds;
  return {
    token,
    createdAtMilliSeconds,
    expiresInMilliSeconds,
    validTillMilliSeconds,
  };
};

export const isTokenExpired = (tokenStoredInCookies) => {
  if (
    !tokenStoredInCookies?.createdAtMilliSeconds
    || !tokenStoredInCookies?.expiresInMilliSeconds
    || !tokenStoredInCookies?.validTillMilliSeconds
  ) {
    throw new Error(
      'CHECK_TOKEN_EXPIRATION: Invalid token object, required information is missing',
      tokenStoredInCookies,
    );
  }
  const { validTillMilliSeconds } = tokenStoredInCookies;
  return validTillMilliSeconds <= new Date().getTime();
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
  const createRequestBody = (mobileNo, password, isEncrypted, rememberMe) => {
    return {
      'memberLogin.countryCode': `+${Number(countryCode)}`,
      'memberLogin.MemberMobileNo': mobileNo,
      'memberLogin.Password': encryptPassword(password),
      'memberLogin.Username': mobileNo,
      IsEncrypted: isEncrypted,
      memberLogin_Submit: 'login-sso',
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

  const urlOldMemberLogin = `${oldLoginDetails.baseApiUrlOld}${oldLoginDetails.subBaseApiUrlOld}${oldLoginDetails.memberLoginOld}`;
  const headerOLD = {
    'Content-type':
      'application/x-www-form-urlencoded;text/html; charset=UTF-8',
  };
  let getMemberLoginPayload = DD_RUM_PAYLOAD;
  const getMemberLoginAction = DD_RUM_EVENTS.GET_OLD_URL_LOGIN;
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

    if (oldMemberResponseJson?.errors || !oldMemberResponse.ok) {
      getMemberLoginPayload = ddRumErrorPayload(getMemberLoginAction, oldMemberResponseJson?.errors);
    } else {
      getMemberLoginPayload.response = oldMemberResponseJson;
    }

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
        // for Agent login-sso
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

      Cookies.get('IndigoMemberVerificationCookie')
        && createBrowserCookie('aemPCK', 'true', oldLoginDetails.subDomain, 0);
    }

    console.log('--error', oldAgentDataResponse?.indiGoError?.errors);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const encryptPassword = function (pass) {
  if (pass) {
    const envObj = getEnvObj();
    const publicKey = envObj?.ENC_PUB;
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(pass) || '';
  }
  return '';
};

export const triggerLoginStatus = function ($ele, status, response, error) {
  if (!$ele?.length) {
    return;
  }
  $ele.trigger('loginStatusChange', {
    type: status,
    error,
    response,
  });
};

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

export const deleteBrowserCookie = (sKey, sPath, sDomain) => {
  const encodedKey = encodeURIComponent(sKey);
  const expirationDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const domainPart = sDomain ? `; domain=${sDomain}` : '';
  const pathPart = sPath ? `; path=${sPath}` : '';

  document.cookie = `${encodedKey}=; expires=${expirationDate}${domainPart}${pathPart}`;
};

export const createBrowserCookie = (cName, cVal, expiry, domain, path) => {
  let cookieString = `${cName}=${cVal}`;
  if (expiry) {
    cookieString += `;expires=${expiry}`;
  }
  if (domain) {
    cookieString += `;domain=${domain}`;
  }
  if (path) {
    cookieString += `;path=${path}`;
  }
  document.cookie = cookieString;
};
