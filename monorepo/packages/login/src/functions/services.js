import { COOKIE_KEYS } from '../constants/cookieKeys';
import { AGENT, MEMBER, SME_USER, SME_ADMIN } from '../constants/common';
import {
  RESET_PASSWORD_API,
  RESET_PASSWORD_USERKEY,
} from '../constants/index-env';
import Cookies from './cookies';
import { getEnvObj } from './utils';

const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(COOKIE_KEYS.AUTH, true);
    return tokenObj.token || '';
  } catch (error) {
    return '';
  }
};

export const resetPasswordAPI = async (requestBody) => {
  const token = getSessionToken();
  try {
    const response = await fetch(RESET_PASSWORD_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: RESET_PASSWORD_USERKEY,
        'Content-Type': 'application/json',
      },
    });
    const parsedResponse = await response.json();
    return { response: parsedResponse };
  } catch (error) {
    console.log('-error: resetPasswordAPI', error);
    return { isSuccess: false, response: {} };
  }
};

export const changePasswordAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj();
  let CHANGE_PASSWORD_API = '';
  let CHANGE_PASSWORD_USERKEY = '';
  if (Object.keys(envObj).length > 0 && envObj.CHANGE_PASSWORD_API) {
    CHANGE_PASSWORD_API = envObj.CHANGE_PASSWORD_API;
    CHANGE_PASSWORD_USERKEY = envObj.CHANGE_PASSWORD_USERKEY;
  }

  try {
    const response = await fetch(CHANGE_PASSWORD_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: CHANGE_PASSWORD_USERKEY,
        'Content-Type': 'application/json',
      },
    });
    const parsedResponse = await response.json();
    return { response: parsedResponse };
  } catch (error) {
    return { isSuccess: false, response: {} };
  }
};

export const loginWithOtpUserValidateAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};

  try {
    const response = await fetch(envObj.API_LOGIN_WITH_OTP_INITATE_VALIDATE, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.USERKEY_LOGIN_WITH_OTP_INITATE_VALIDATE,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    const parsedResponse = await response.json();
    return { response: parsedResponse };
  } catch (error) {
    return { isSuccess: false, response: {} };
  }
};

export const loginWithOtpLogInAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};

  try {
    const response = await fetch(envObj.API_LOGIN_WITH_OTP, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.USERKEY_LOGIN_WITH_OTP,
        'Content-Type': 'application/json',
      },
      credentials: "include"
    });
    const parsedResponse = await response.json();
    return { response: parsedResponse };
  } catch (error) {
    return { isSuccess: false, response: {} };
  }
};

export const signupAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};

  try {
    const response = await fetch(envObj.API_SIGN_UP, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.USERKEY_SIGN_UP,
        'Content-Type': 'application/json',
      },
    });
    const parsedResponse = await response.json();
    return { response: parsedResponse };
  } catch (error) {
    return { isSuccess: false, response: {} };
  }
};

export const loginAemLabels = async (personaParam) => {
  const envObj = getEnvObj() || {};

  let API_END_POINT;
  switch (personaParam) {
    case MEMBER:
      API_END_POINT = envObj.LOGIN_AEM_DATA;
      break;
    case SME_USER:
      API_END_POINT = envObj.LOGIN_USER_DATA;
      break;
    case AGENT:
      API_END_POINT = envObj.LOGIN_PARTNER_DATA;
      break;
    case SME_ADMIN:
      API_END_POINT = envObj.LOGIN_ADMIN_DATA;
      break;
    default:
      API_END_POINT = envObj.LOGIN_AEM_DATA;
      break;
  }
  try {
    const response = await fetch(API_END_POINT);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const validateOtpApi = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};
  try {
    const response = await fetch(envObj.API_VALIDATE_OTP, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.USERKEY_VALIDATE_OTP,
        'Content-Type': 'application/json',
      },
    });
    const parsedResponse = await response.json();
    return { response: parsedResponse };
  } catch (error) {
    console.error('-error: validateApi', error);
    return { isSuccess: false, response: {} };
  }
};

export const makePrivacyPostApi = async ({ data }) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};
  try {
    const response = await fetch(envObj?.POLICY_CONSENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: envObj?.USER_KEY_PRIVACY_POLICY,
      },
      body: JSON.stringify({
        data: { ...data, sessionToken: token || '' },
      }),

    });
    const privacyPolicyResponse = await response.json();

    return privacyPolicyResponse || {};
  } catch (e) {
    console.log(e, 'error');
    return {};
  }
};
