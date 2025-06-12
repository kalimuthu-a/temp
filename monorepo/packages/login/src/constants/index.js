import apiEnv from './index-env';
import common from './common';

const result = apiEnv;
for (const key in common) {
  result[key] = common[key];
}
export default result;

export const SCREEN_TYPE = {
  LOGIN_USERID: 'LOGIN_USERID',
  LOGIN_PASSWORD: 'LOGIN_PASSWORD',
  LOGIN_OTP: 'LOGIN_OTP',
  FORGOT_USERID: 'FORGOT_USERID',
  FORGOT_OTP: 'FORGOT_OTP',
  FORGOT_CONFIRM_PASSWORD: 'FORGOT_CONFIRM_PASSWORD',
  SIGNUP_OTP: 'SIGNUP_OTP',
  SIGNUP_FORM: 'SIGNUP_FORM',
  SIGNUP_SETPASSWORD: 'SIGNUP_SETPASSWORD',
  PASSWORD_RESET: 'PASSWORD_RESET',
  LOGIN_MFA_OTP: 'LOGIN_MFA_OTP',
};

export const REGEX_LIST = {
  INDIAN_MOBILE_NUMBER: /^[6-9]\d{9}$/,
  EXCEPT_INDIAN_MOBILE_NUMBER: /^\d{7,14}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/,
};
