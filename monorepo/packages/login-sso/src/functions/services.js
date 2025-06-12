/* eslint-disable no-console */
import COOKIE_KEYS from '../constants/cookieKeys';
import { AGENT, MEMBER, SME_USER, SME_ADMIN, SOURCE_WEB } from '../constants/common';
import Cookies from './cookies';
import { ddRumErrorPayload, getEnvObj } from './utils';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import pushDDRumAction from '../utils/ddrumEvent';

const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(COOKIE_KEYS.AUTH, true);
    return tokenObj.token || '';
  } catch (error) {
    return '';
  }
};

// SSO USED CALL BELOW
export const loginAemLabels = async (personaParam) => {
  const envObj = getEnvObj() || {};

  let loginDataDogPayload = DD_RUM_PAYLOAD;
  let loginDataDogAction = DD_RUM_EVENTS.LOGIN_AEM_DATA;

  let API_END_POINT;
  switch (personaParam) {
    case MEMBER: {
      API_END_POINT = envObj.LOGIN_AEM_DATA;
      loginDataDogAction = DD_RUM_EVENTS.LOGIN_AEM_DATA;
      break;
    }
    case SME_USER: {
      API_END_POINT = envObj.LOGIN_USER_DATA;
      loginDataDogAction = DD_RUM_EVENTS.LOGIN_USER_DATA;
      break;
    }
    case AGENT: {
      API_END_POINT = envObj.LOGIN_PARTNER_DATA;
      loginDataDogAction = DD_RUM_EVENTS.LOGIN_PARTNER_DATA;
      break;
    }
    case SME_ADMIN: {
      API_END_POINT = envObj.LOGIN_ADMIN_DATA;
      loginDataDogAction = DD_RUM_EVENTS.LOGIN_ADMIN_DATA;
      break;
    }
    default:
      API_END_POINT = envObj.LOGIN_AEM_DATA;
      break;
  }

  const startTimer = performance.now();
  try {
    const response = await fetch(API_END_POINT);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    loginDataDogPayload.apiurl = API_END_POINT;
    loginDataDogPayload.method = 'GET';
    loginDataDogPayload.mfname = MF_NAME;
    loginDataDogPayload.responseTime = (performance.now() - startTimer) / 1000;
    loginDataDogPayload.statusCode = response?.status;

    const data = await response.json();

    if (data?.errors || !response.ok) {
      loginDataDogPayload = ddRumErrorPayload(loginDataDogPayload, data?.errors);
    } else {
      loginDataDogPayload.response = data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(loginDataDogAction, loginDataDogPayload);
    return data;
  } catch (error) {
    loginDataDogPayload = ddRumErrorPayload(loginDataDogPayload, error);

    // push actions to Datadog event listner
    pushDDRumAction(loginDataDogAction, loginDataDogPayload);

    return null;
  }
};

export const checkUserAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj();

  let checkUserDatadogPayload = DD_RUM_PAYLOAD;
  const checkUserDatadogAction = DD_RUM_EVENTS.CHECK_USER_DATA;
  const startTimer = performance.now();

  try {
    const response = await fetch(envObj.CHECK_USER_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.CHECK_USER_KEY,
        Source: SOURCE_WEB,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    checkUserDatadogPayload.apiurl = envObj.CHECK_USER_API;
    checkUserDatadogPayload.method = 'POST';
    checkUserDatadogPayload.mfname = MF_NAME;
    checkUserDatadogPayload.requestbody = requestBody;
    checkUserDatadogPayload.statusCode = response?.status;

    const parsedResponse = await response.json();
    checkUserDatadogPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (parsedResponse?.errors || !response.ok) {
      checkUserDatadogPayload = ddRumErrorPayload(checkUserDatadogPayload, parsedResponse?.errors);
    } else {
      checkUserDatadogPayload.response = parsedResponse;
    }
    // push actions to Datadog event listner
    pushDDRumAction(checkUserDatadogAction, checkUserDatadogPayload);

    return { response: parsedResponse };
  } catch (error) {
    checkUserDatadogPayload = ddRumErrorPayload(checkUserDatadogPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(checkUserDatadogAction, checkUserDatadogPayload);
    console.log('-error: checkUserAPI', error);
    return { isSuccess: false, response: {} };
  }
};

export const signupAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};

  let signUpDatadogPayload = DD_RUM_PAYLOAD;
  const signUpDatadogAction = DD_RUM_EVENTS.SIGN_UP_USER;
  const startTimer = performance.now();

  try {
    const response = await fetch(envObj.SIGNUP_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.SIGNUP_USER_KEY,
        Source: SOURCE_WEB,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    signUpDatadogPayload.apiurl = envObj.SIGNUP_API;
    signUpDatadogPayload.method = 'POST';
    signUpDatadogPayload.mfname = MF_NAME;
    signUpDatadogPayload.requestbody = requestBody;
    signUpDatadogPayload.statusCode = response?.status;

    const parsedResponse = await response.json();

    signUpDatadogPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (parsedResponse?.errors || !response.ok) {
      signUpDatadogPayload = ddRumErrorPayload(signUpDatadogPayload, parsedResponse?.errors);
    } else {
      signUpDatadogPayload.response = parsedResponse;
    }
    // push actions to Datadog event listner
    pushDDRumAction(signUpDatadogAction, signUpDatadogPayload);

    return { response: parsedResponse };
  } catch (error) {
    signUpDatadogPayload = ddRumErrorPayload(signUpDatadogPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(signUpDatadogAction, signUpDatadogPayload);
    console.log('-error: signupAPI', error);
    return { isSuccess: false, response: {} };
  }
};
export const registerAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};

  let registerDatadogPayload = DD_RUM_PAYLOAD;
  const registerDatadogAction = DD_RUM_EVENTS.USER_REGISTRATION;
  const startTimer = performance.now();

  try {
    const response = await fetch(envObj.REGISTER_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.REGISTER_USER_KEY,
        Source: SOURCE_WEB,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    registerDatadogPayload.apiurl = envObj.REGISTER_API;
    registerDatadogPayload.method = 'POST';
    registerDatadogPayload.mfname = MF_NAME;
    registerDatadogPayload.requestbody = requestBody;
    registerDatadogPayload.statusCode = response?.status;

    const parsedResponse = await response.json();

    registerDatadogPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (parsedResponse?.errors || !response.ok) {
      registerDatadogPayload = ddRumErrorPayload(registerDatadogPayload, parsedResponse?.errors);
    } else {
      registerDatadogPayload.response = parsedResponse;
    }
    // push actions to Datadog event listner
    pushDDRumAction(registerDatadogAction, registerDatadogPayload);

    return { response: parsedResponse };
  } catch (error) {
    registerDatadogPayload = ddRumErrorPayload(registerDatadogPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(registerDatadogAction, registerDatadogPayload);
    console.log('-error: RegisterAPI', error);
    return { isSuccess: false, response: {} };
  }
};
export const sendOtpAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};
  let sendOTPDatadogPayload = DD_RUM_PAYLOAD;
  const sendOTPDatadogAction = DD_RUM_EVENTS.SEND_OTP;
  const startTimer = performance.now();

  try {
    const response = await fetch(envObj.SEND_OTP_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.SEND_OTP_USER_KEY,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    sendOTPDatadogPayload.apiurl = envObj.REGISTER_API;
    sendOTPDatadogPayload.method = 'POST';
    sendOTPDatadogPayload.mfname = MF_NAME;
    sendOTPDatadogPayload.requestbody = requestBody;
    sendOTPDatadogPayload.statusCode = response?.status;

    const parsedResponse = await response.json();

    sendOTPDatadogPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (parsedResponse?.error || !response.ok) {
      sendOTPDatadogPayload = ddRumErrorPayload(sendOTPDatadogPayload, parsedResponse?.error);
    } else {
      sendOTPDatadogPayload.response = parsedResponse;
    }
    // push actions to Datadog event listner
    pushDDRumAction(sendOTPDatadogAction, sendOTPDatadogPayload);

    return { response: parsedResponse };
  } catch (error) {
    sendOTPDatadogPayload = ddRumErrorPayload(sendOTPDatadogPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(sendOTPDatadogAction, sendOTPDatadogPayload);
    console.log('-error: sendotpAPI', error);
    return { isSuccess: false, response: {} };
  }
};

export const validateOtpApi = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj() || {};

  let registerDatadogPayload = DD_RUM_PAYLOAD;
  const registerDatadogAction = DD_RUM_EVENTS.VALIDATE_OTP;
  const startTimer = performance.now();
  try {
    const response = await fetch(envObj.VALIDATE_OTP_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.VALIDATE_OTP_USER_KEY,
        Source: SOURCE_WEB,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    registerDatadogPayload.apiurl = envObj.REGISTER_API;
    registerDatadogPayload.method = 'POST';
    registerDatadogPayload.mfname = MF_NAME;
    registerDatadogPayload.requestbody = requestBody;
    registerDatadogPayload.statusCode = response?.status;

    const parsedResponse = await response.json();

    registerDatadogPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (parsedResponse?.error || !response.ok) {
      registerDatadogPayload = ddRumErrorPayload(registerDatadogPayload, parsedResponse?.error);
    } else {
      registerDatadogPayload.response = parsedResponse;
    }
    // push actions to Datadog event listner
    pushDDRumAction(registerDatadogAction, registerDatadogPayload);
    return { response: parsedResponse };
  } catch (error) {
    console.error('-error: validateOtpApi', error);
    registerDatadogPayload = ddRumErrorPayload(registerDatadogPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(registerDatadogAction, registerDatadogPayload);
    return { isSuccess: false, response: {} };
  }
};

export const checkExistenceAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj();
  let checkExistingUserPayload = DD_RUM_PAYLOAD;
  const checkExistingUserAction = DD_RUM_EVENTS.CHECK_EXISTING_USER;
  const startTimer = performance.now();

  try {
    const response = await fetch(envObj.CHECK_EXISTENCE_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.CHECK_EXISTENCE_USER_KEY,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    checkExistingUserPayload.apiurl = envObj.REGISTER_API;
    checkExistingUserPayload.method = 'POST';
    checkExistingUserPayload.mfname = MF_NAME;
    checkExistingUserPayload.requestbody = requestBody;
    checkExistingUserPayload.statusCode = response?.status;

    const parsedResponse = await response.json();

    checkExistingUserPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (parsedResponse?.errors || !response.ok) {
      checkExistingUserPayload = ddRumErrorPayload(checkExistingUserPayload, parsedResponse?.errors);
    } else {
      checkExistingUserPayload.response = parsedResponse;
    }
    // push actions to Datadog event listner
    pushDDRumAction(checkExistingUserAction, checkExistingUserPayload);

    return { response: parsedResponse };
  } catch (error) {
    console.log('-error: checkExistenceAPI', error);
    checkExistingUserPayload = ddRumErrorPayload(checkExistingUserPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(checkExistingUserAction, checkExistingUserPayload);
    return { isSuccess: false, response: {} };
  }
};

export const validateTokenAPI = async (requestBody) => {
  const token = getSessionToken();
  const envObj = getEnvObj();
  let validateTokenDatadogPayload = DD_RUM_PAYLOAD;
  const validateTokenDatadogAction = DD_RUM_EVENTS.VALIDATE_TOKEN;
  const startTimer = performance.now();

  try {
    const response = await fetch(envObj.CHECK_VALIDATE_TOKEN_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: token,
        user_key: envObj.CHECK_VALIDATE_TOKEN_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    validateTokenDatadogPayload.apiurl = envObj.REGISTER_API;
    validateTokenDatadogPayload.method = 'POST';
    validateTokenDatadogPayload.mfname = MF_NAME;
    validateTokenDatadogPayload.requestbody = requestBody;
    validateTokenDatadogPayload.statusCode = response?.status;

    const parsedResponse = await response.json();

    validateTokenDatadogPayload.responseTime = (performance.now() - startTimer) / 1000;

    if (parsedResponse?.errors || !response.ok) {
      validateTokenDatadogPayload = ddRumErrorPayload(validateTokenDatadogPayload, parsedResponse?.errors);
    } else {
      validateTokenDatadogPayload.response = parsedResponse;
    }
    // push actions to Datadog event listner
    pushDDRumAction(validateTokenDatadogAction, validateTokenDatadogPayload);

    return { response: parsedResponse };
  } catch (error) {
    console.log('-error: validateTokenAPI', error);
    validateTokenDatadogPayload = ddRumErrorPayload(validateTokenDatadogPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(validateTokenDatadogAction, validateTokenDatadogPayload);
    return { isSuccess: false, response: {} };
  }
};
