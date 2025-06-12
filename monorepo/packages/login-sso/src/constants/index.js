/* eslint-disable no-useless-escape */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
import apiEnv from './index-env';
import common from './common';

const result = apiEnv;
for (const key in common) {
  result[key] = common[key];
}
export default result;

export const SCREEN_TYPE = {
  LANDING_PAGE: 'LANDING_PAGE',
  IFRAME: 'IFRAME',
  OTP_VERIFY_PAGE: 'OTP_VERIFY_PAGE',
  MEMBERS_BENEFITS_PAGE: 'MEMBERS_BENEFITS_PAGE',
  SIGNUP_6E_USER: 'SIGNUP_6E_USER',
  SIGNUP_NEW_USER: 'SIGNUP_NEW_USER',
  SIGNUP_ONBOARD_BANK: 'SIGNUP_ONBOARD_BANK',
  SIGNUP_6E_USER_MIGRATION: 'SIGNUP_6E_USER_MIGRATION',
  SIGNUP_6E_REWARD_MIGRATION: 'SIGNUP_6E_REWARD_MIGRATION',
  LOYALTY_DASHBOARD_WELCOME: 'LOYALTY_DASHBOARD_WELCOME',
  COBRAND_LOYALTY_MEMBER: 'COBRAND_LOYALTY_MEMBER',
  COBRAND_GUEST_USER: 'COBRAND_GUEST_USER',
  COBRAND_6E_USER: 'COBRAND_6E_USER',
  TIER_DETAIL: 'TIER_DETAIL',
  COBRAND_PARTNER_BANK: 'COBRAND_PARTNER_BANK',
};

export const CONSTANT = {
  LOYALTY_MEMBER_LOGIN_SUCCESS: 'LOYALTY_MEMBER_LOGIN_SUCCESS',
  UPDATE_AUTH_USER_COOKIE: 'UPDATE_AUTH_USER_COOKIE',
};
export const REGEX_LIST = {
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/i,
  INDIAN_MOBILE_NUMBER: /^[6-9]\d{9}$/g,
  EXCEPT_INDIAN_MOBILE_NUMBER: /^\d{7,14}$/,
  PASSWORD:
    /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9\\/.,~`"''])[a-zA-Z0-9!@#$%^&*()_+\-=?<>|{}[\]:;]{8,16}$/,
};

// datadog event list names
export const DD_RUM_EVENTS = {
  LOGIN_AEM_DATA: 'loginAemData',
  LOGIN_USER_DATA: 'loginUserData',
  LOGIN_PARTNER_DATA: 'loginPartnerData',
  LOGIN_ADMIN_DATA: 'loginAdminData',
  CHECK_USER_DATA: 'checkUserData',
  SIGN_UP_USER: 'signUpUser',
  USER_REGISTRATION: 'userRegistration',
  SEND_OTP: 'sendOtp',
  VALIDATE_OTP: 'validateOtp',
  CHECK_EXISTING_USER: 'checkExistingUser',
  VALIDATE_TOKEN: 'validateToken',
  GET_MEMBER_LOGIN: 'getMemberLogin',
  LOGIN_DETAILS: 'loginDetails',
  REFRESH_ACCESS_TOKEN: 'refreshAccessToken',
  GET_OLD_URL_LOGIN: 'oldUrlLogin',

  LOGIN_LOAD_DATA: 'loginLoadData',
  LOGIN_BUTTON_CLICKED: 'loginButtonClicked',
  LOGIN_PHONE_NUMBER: 'loginPhoneNumber',
  LOGIN_CONTINUE_CLICKED: 'loginContinueClicked',
  FORGET_PASSWORD_CLICKED: 'forgetPasswordClicked',
  OTP_LOAD_PAGE: 'otpLoadPage',
  OTP_ENTERED: 'otpEntered',
  RESEND_OTP: 'resendOtp',
  VERIFY_OTP: 'verifyOtp',
  SUBMIT_OTP: 'submitOtp',
  LOGIN_SUCCESS: 'loginSuccess',
  FORGET_PASSWORD: 'forgetPassword',
  MEMBER_POPUP_EVENT: 'memberPopupEvent',
  MEMBER_DETAILS_INPUT: 'memberDetailsInput',
  RESEND_MEMBER_OTP: 'resendOtpMember',
  RESEND_EMAIL_MEMBER_OTP: 'ResendEmailMemberOtpAction',
  SUBMIT_OTP_MEMBER: 'SubmitOtpMember',
  SIGNUP_LOAD_DATA: 'signupLoadData',
  LOGIN_LOAD_PAGE: 'loginLoadPage',
};

export const MF_NAME = 'login-sso';

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

export const DD_RUM_LOAD_CLICK_PAYLOAD = {
  action: '', // EVENT_NAME e.g., 'Login Button Clicked'
  datadogSessionId: '', // SESSION_ID From datadogRum.getInternalContext()
  timestamp: '', // ISO format 2025-05-20T12:00:00.000Z
  metadata: {
    page: '', // 'Login' | 'SignUp' | 'Migration' | 'OTP' | 'Success' | 'PasswordCreation',
    step: '', // 'PageLoad' | 'Input' | 'Click' | 'Submit' | 'Verify' | 'Error',
    component: '', // LoginPopup' | 'SignUpPopup' | 'OTPForm' | 'MigrationForm' | 'SuccessScreen', // contextual
    application: '', // 'MF_NAME', // Microfrontend name
    userInput: {
      phoneNumber: '', // Masked or partially logged (e.g. `+91-XXX1234`)
      countryCode: '',
      firstName: '',
      lastName: '',
      dob: '', // YYYY-MM-DD (optional and only if GDPR compliant)
      email: '', // Masked or partial
      otp: '', // Only if no compliance issues
      gender: '',
      termsAndConditions: '',
      privacyConsent: '',
      EUConsent: '',
    },
    durationMs: 0, // For page load or action timings
    // flowType: '', // 'Login' | 'SignUp' | 'Migration',
    // context: {
    //   deviceType: '', //'desktop' | 'mobile' | 'tablet',
    //   browser: '',
    //   os: '',
    //   env: '', //'production' | 'staging' | 'dev',
    // }
  },
};
