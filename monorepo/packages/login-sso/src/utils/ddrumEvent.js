/* eslint-disable no-console */
import pushDDCustomAction from 'skyplus-design-system-app/dist/des-system/dataDogHelper';
/**
 * Pushes a Datadog RUM action based on the event type.
 *
 * @param {string} event - The name of the event triggering the action.
 * @param {Object} [payload={}] - The payload associated with the event (can be empty).
 */
const pushDDRumAction = (event, payload = {}) => {
  // Validate input
  if (typeof event !== 'string') {
    console.error('Invalid "event" parameter.');
    return null;
  }
  if (typeof payload !== 'object' || payload === null) {
    console.error('Invalid "payload" parameter.');
    return null;
  }
  // Event-to-action mapping
  // mfname/apiorAEM/ define

  const eventActionMap = {
    loginAemData: 'login-sso/aem/Get AEM data for login',
    loginUserData: 'login-sso/api/Get User data',
    loginPartnerData: 'login-sso/api/Get Partner data',
    loginAdminData: 'login-sso/api/Get Admin data',
    checkUserData: 'login-sso/api/Check user data',
    signUpUser: 'login-sso/api/Sign up user',
    userRegistration: 'login-sso/api/User registration',
    sendOtp: 'login-sso/api/Send OTP request',
    validateOtp: 'login-sso/api/Validate otp request',
    checkExistingUser: 'login-sso/api/Check existing user',
    validateToken: 'login-sso/api/Validate token request',
    getMemberLogin: 'login-sso/api/Get member login details',
    loginDetails: 'login-sso/api/Get login details',
    refreshAccessToken: 'login-sso/api/Refresh token',
    oldUrlLogin: 'login-sso/api/Get old member login url',
    memberPopupEvent: 'login-sso/member popup event',
    memberDetailsInput: 'login-sso/member Input Details',
    resendOtpMember: 'login-sso/member resendOTP',
    ResendEmailMemberOtpAction: 'login-sso/member ResemdEmailOtp',
    SubmitOtpMember: 'login-sso/member submitOTP',
    loginLoadPage: 'login-sso/Login page load time',
    loginButtonClicked: 'login-sso/Login page open',
    loginContinueClicked: 'login-sso/Login phone/email entered and continue',
    signupLoadData: 'login-sso/sign-up Sign-up load time'
  };

  const action = eventActionMap[event];
  if (!action) {
    console.warn(`Unhandled event: ${event}`);
    return null;
  }
  // Push action to Datadog
  try {
    pushDDCustomAction(action, { ...payload });
  } catch (error) {
    console.error('Error pushing Datadog RUM action:', error);
  }
  return null;
};
export default pushDDRumAction;
