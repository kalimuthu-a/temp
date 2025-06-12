import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { AESEncryptCtr, AESDecryptCtr } from 'skyplus-design-system-app/dist/des-system/aes-ctr';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import Constants, { REGEX_LIST, SCREEN_TYPE } from '../../constants';
import {
  createBrowserCookie,
  deleteBrowserCookie,
} from '../../functions/userToken';
import Cookies from '../../functions/cookies';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import pushAnalytic from '../../functions/analyticEvents';
import gtmPushAnalytic from '../../functions/gtmAnalyticsEvents';
import VariationBasedComponent from './components/VariationBasedComponent';
import { onSubmitFormHandler, onSubmitFormOldLoginHandler } from './functions';
import { COOKIE_KEYS } from '../../constants/cookieKeys';
import { AGENT, MEMBER, SME_USER, AA_CONSTANTS } from '../../constants/common';
import OtpVerifyPopUp from './components/OtpVerifyPopUp';
import PasswordLoginPopUp from './components/PasswordLoginPopUp';
import {
  loginWithOtpLogInAPI,
  loginWithOtpUserValidateAPI,
  resetPasswordAPI } from '../../functions/services';
import { AES_SECRET_KEY } from '../../constants/index-env';
import { getEnvObj } from '../../functions/utils';

const {
  BASE_API_URL_OLD,
  SUB_BASE_API_URL_OLD,
  MEMBER_LOGIN_OLD,
  AGENT_LOGIN_OLD,
  CAPF_LOGIN_OLD,
  MEMBER_LOGOUT_OLD,
  AGENT_LOGOUT_OLD,
  SUB_DOMAIN,
  DEFAULT_CURRENCY_CODE,
  LOGIN_SUCCESS,
  GENERIC_TOAST_MESSAGE_EVENT,
  MAIN_LOADER_EVENT,
} = Constants;
const loginSuccessEvent = (config) => new CustomEvent(LOGIN_SUCCESS, config);
const genericToastMessageEvent = (data) => new CustomEvent(GENERIC_TOAST_MESSAGE_EVENT, data);
const mainLoaderEvent = (data) => new CustomEvent(MAIN_LOADER_EVENT, data);
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
const envObj = getEnvObj();

const LoginForm = ({
  persona = '',
  onCloseHandler = () => {},
  setFormType = () => {},
  setToastProps,
  mfLabels,
  setActiveScreen,
  activeScreen,
  setSharedData,
  sharedData,
  makeBAUCallFromStrToken,
}) => {
  const [isOtpRequired, setIsOtpRequired] = useState(null);
  const [isLoginWithPassword] = useState(null);
  const [formData, setFormData] = useState({
    countryCode: sharedData?.countryCode || 91,
  });
  const [errorObj, setErrorObj] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpText, setOtpText] = useState(null);
  const [isResendOtp, setIsResendOtp] = useState(false);
  const [customErrorMsg, setcustomErrorMsg] = useState(null);
  const [agentLockedDialog, setAgentLockedDialog] = useState('');
  const [state, setState] = useState({
    hiddenElements: [],
    disabledElements: [],
  });
  // const [countryCodeValues] = useState(
  //   sharedData?.countryCode|| mfLabels?.defaultCountryCode || DEFAULT_CURRENCY_CODE
  // );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMember = persona?.toLowerCase() === MEMBER?.toLowerCase();
  const isAgent = persona?.toLowerCase() === Constants.AGENT.toLowerCase();
  const loginref = useRef(null);
  const PersonaArray = ['Member', 'SME', 'Partner'].map((identity) => ({
    label: identity === 'Member' ? 'Customer' : identity,
    value: identity,
  }));
  useEffect(() => {
    const handleResendOtpEvent = (event) => {
      onClickInitiateOtp(event.detail.data, 'resend');
    };

    window.addEventListener('resendOtpEvent', handleResendOtpEvent);
    const loginModal = loginref.current;
    loginModal?.querySelectorAll('input')[1]?.focus();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resendOtpEvent', handleResendOtpEvent);
    };
  }, []);
  useEffect(() => {
    if (isLoggedIn && Cookies.get(COOKIE_KEYS.PERSONA_TYPE)) {
      deleteBrowserCookie(COOKIE_KEYS.PERSONA_TYPE, '/', '');
    }

    if (isLoggedIn) {
      const cookieLifeTime = new Date();
      const exp = new Date(cookieLifeTime.getTime() + 15 * 60 * 1000);
      createBrowserCookie(
        COOKIE_KEYS.PERSONA_TYPE,
        persona,
        exp.toUTCString(),
        '.goindigo.in',
        '/',
      );
    }
    if (!Cookies.get(COOKIE_KEYS.USER)) {
      pushAnalytic({
        state: {
          userId: sharedData?.countryCode || 91,
        },
        event: 'Get started',
      });
      gtmPushAnalytic({
        state,
        event: 'customerLogin',
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if ([SCREEN_TYPE.FORGOT_USERID, SCREEN_TYPE.LOGIN_USERID, SCREEN_TYPE.LOGIN_OTP]
      .includes(activeScreen) && formData.password) {
      onChange('password', '');
    }
  }, [activeScreen]);

  useEffect(() => {
    !isMember
      ? setActiveScreen(SCREEN_TYPE.LOGIN_PASSWORD)
      : setActiveScreen(SCREEN_TYPE.LOGIN_USERID);
  }, [isMember]);
  const onChange = (key, value, additionalObj) => {
    setcustomErrorMsg('');
    setAgentLockedDialog(false);
    const temp = { ...formData, ...additionalObj };
    if (key) {
      temp[key] = value;
    }
    setFormData(temp);
    isMember && validateResetHomeForm(temp);
    setSharedData((prev) => {
      return { ...prev, ...temp };
    });
  };

  const onChangePersonaArray = (value) => {
    console.log(value, 'value');
    if (value.toLowerCase() == 'customer') setFormType(MEMBER);
    if (value.toLowerCase() == 'sme') setFormType(SME_USER);
    if (value.toLowerCase() == 'partner') setFormType(AGENT);
  };

  const variation = 'mobile';

  const onSubmit = async (event, otpNumberText) => {
    setIsLoading(true);
    event.preventDefault?.();
    let { userId, password } = formData;
    let skyplusCallSuccess = false;
    if (!userId) {
      userId = sharedData.userId;
      password = sharedData.password;
    }

    if (!userId || !password) {
      setIsLoading(false);
      gtmPushAnalytic({
        state: {
          persona,
          click_text: 'Login',
          error_message: 'username and password is required for login',
          error_type: 'Business',
        },
        event: 'error',
      });
      return;
    }

    document.dispatchEvent(
      mainLoaderEvent({
        bubbles: true,
        detail: { isMainloader: true },
      }),
    );
    setState((prev) => ({
      ...prev,
      disabledElements: [...prev.disabledElements, 'submit_btn'],
    }));
    if (
      persona === MEMBER
      && Number(
        sharedData?.countryCode
          || mfLabels?.defaultCountryCode
          || DEFAULT_CURRENCY_CODE,
      ) !== 91
    ) {
      userId = `${Number(
        sharedData?.countryCode
          || mfLabels?.defaultCountryCode
          || DEFAULT_CURRENCY_CODE,
      )}*${String(userId)}`;
    }
    let apiDataConfig = {};
    if (isOtpRequired) {
      apiDataConfig = {
        otpText: otpNumberText,
        otpAgentReferenceToValidate: isOtpRequired.otpAgentReferenceToValidate,
        applicationName: 'SkyplusWeb',
      };
    }
    let skyplusResponseData = {
      user: {},
      token: '',
      isOtpRequired: false,
      otpAgentReferenceToValidate: '',
      passwordChangeRequired: false,
    };
    const additionalInfo = {
      mobileNumber: '',
      mobileCountryCode: '',
      email: '', // we need to add the data once we get from
		  };
		  if (isMember) {
      additionalInfo.mobileCountryCode = formData?.countryCode;
      additionalInfo.mobileNumber = formData.userId;
		  }
    // skyplus - Login --START
    try {
      const {
        token,
        user,
        isOtpRequired,
        otpAgentReferenceToValidate,
        passwordChangeRequired,
      } = await onSubmitFormHandler(persona, userId, password, apiDataConfig, additionalInfo);
      skyplusResponseData = {
        ...skyplusResponseData,
        token,
        user,
        isOtpRequired,
        otpAgentReferenceToValidate,
        passwordChangeRequired,
      };
      setIsLoading(false);
      // comment skyplus -success block -
      if (passwordChangeRequired) {
        const dataToEncrypt = { userId: formData.userId };
        // comment const encryptedUserData = encryptAESForLogin(JSON.stringify(dataToEncrypt),AES_SECRET_KEY);
        const data = {
          userData: dataToEncrypt,
          persona,
          isEncrypted: false,
          countryCode:
            sharedData?.countryCode
            || mfLabels?.defaultCountryCode
            || DEFAULT_CURRENCY_CODE,
        };
        localStorage.setItem('changepwd', JSON.stringify(data));
        // redirect user to reset password screen;
        setSharedData({
          ...sharedData,
          userId: formData.userId,
          countryCode:
            sharedData?.countryCode
            || mfLabels?.defaultCountryCode
            || DEFAULT_CURRENCY_CODE,
        });
        setActiveScreen(SCREEN_TYPE.FORGOT_CONFIRM_PASSWORD);
        return;
      }
      if (isOtpRequired && (!token || !token?.token)) {
        setSharedData({
          ...sharedData,
          userId: formData.userId,
          countryCode:
            sharedData?.countryCode
            || mfLabels?.defaultCountryCode
            || DEFAULT_CURRENCY_CODE,
          password: formData.password,
        });
        setState((prev) => ({
          ...prev,
          disabledElements: prev?.disabledElements?.filter(
            (d) => d !== 'submit_btn',
          ),
        }));
        setIsOtpRequired({
          otpAgentReferenceToValidate,
          isError: !!apiDataConfig.otpText,
        });
        setActiveScreen(SCREEN_TYPE.LOGIN_MFA_OTP);
        return;
      }
      setIsOtpRequired(null); // if otp not required then setting empty
      skyplusCallSuccess = true;
      setIsLoggedIn(true);
    } catch (failed) {
      const errMsg = getErrorMsgForCode(failed?.message);
      setIsLoading(false);
      document.dispatchEvent(
        mainLoaderEvent({
          bubbles: true,
          detail: { isMainloader: false },
        }),
      );
      const errorDetail = {
        type: 'error',
        code: errMsg?.code || failed?.message,
        title: 'Error', // change title with error type like error,info
        message: errMsg?.message || '*Password entered is incorrect',
        autoDismissTimeer: 5000,
        infoIconClass: 'icon-info',
      };
      if (failed?.message?.includes('AgentLocked')) {
        setcustomErrorMsg(errorDetail?.message);
        setAgentLockedDialog(true);
      } else if (failed?.message?.includes('Credentials:Failed')) {
        setcustomErrorMsg(errorDetail?.message);
      } else {
        document.dispatchEvent(
          genericToastMessageEvent({
            bubbles: true,
            detail: errorDetail,
          }),
        );
      }

      pushAnalytic({
        state: { loginFail: 1 },
        event: 'Login',
      });
      gtmPushAnalytic({
        state: { ...state, isLoggedIn: false, errorDetail },
        event: 'popupLogin',
      });
    }
    // comment skyplus - Login --END

    if (!skyplusCallSuccess) {
      setState((prev) => ({
        ...prev,
        disabledElements: prev?.disabledElements?.filter(
          (d) => d !== 'submit_btn',
        ),
      }));
      // if skyplus call is failed or change password flow then -avoid BAU API call
      return;
    }

    // comment BAU - Login --START
    try {
      await onSubmitFormOldLoginHandler(
        persona,
        formData.userId,
        formData.password,
        sharedData?.countryCode
          || mfLabels?.defaultCountryCode
          || DEFAULT_CURRENCY_CODE,
        formData,
        oldLoginDetails,
      );
    } catch (error) {
      console.log('---unCaught BAU login error::::::', error);
    }
    // comment BAU - Login --END

    // Refreshing Now - from BAU call - after both call are settled;
    document.dispatchEvent(
      loginSuccessEvent({
        bubbles: true,
        detail: {
          token: skyplusResponseData.token,
          user: skyplusResponseData.user,
        },
      }),
    );
    pushAnalytic({
      state: { loginSuccessful: 1 },
      event: 'Login',
    });

    gtmPushAnalytic({
      state: {
        ...state,
        isLoggedIn: true,
        user: skyplusResponseData.user,
        persona,
        login_method: 'Password',
      },
      event: 'loginSuccess',
    });
    document.dispatchEvent(
      mainLoaderEvent({
        bubbles: true,
        detail: { isMainloader: false },
      }),
    );
    setIsLoading(false);
    setTimeout(() => {
      onCloseHandler();
    }, 200);
  };
  // comment const formSubmitted = state.disabledElements.includes('submit_btn');

  const onOutsideClickCloseHandler = (e) => {
    if (
      !document
        .querySelector('.popup-modal-with-content__content')
        .contains(e.target)
    ) {
      onCloseHandler();
    }
  };

  const validateResetHomeForm = (tempFormData) => {
    const erroObj = {};
    const regex = tempFormData.countryCode === '+91'
      || Number(tempFormData.countryCode) === 91
      ? REGEX_LIST.INDIAN_MOBILE_NUMBER
      : REGEX_LIST.EXCEPT_INDIAN_MOBILE_NUMBER;

    if (!regex.test(tempFormData?.userId) && tempFormData?.userId?.length > 5) {
      erroObj.userId = mfLabels?.mobileValidationText || 'invalid';
    }
    setErrorObj(erroObj);

    return erroObj;
  };
  const onClickInitiateOtp = async (formData, triggerType = 'sendOtp') => {
    let { userId } = formData;
    if (!isMember) {
      setSharedData({ userId });
      setActiveScreen(SCREEN_TYPE.LOGIN_PASSWORD);
      return;
    }
    triggerType !== 'resend'
      && pushAnalytic({
        state: { phone: encryptAESForLogin(sharedData.userId) },
        event: 'Send OTP',
      });
    gtmPushAnalytic({
      state: '',
      event: 'Send OTP',
    });

    if (persona === MEMBER) {
      userId = `${
        sharedData?.countryCode || 91
      }*${String(formData.userId)}`;
    }
    const payload = {
      data: {
        mobile: userId,
      },
    };

    if (Object.keys(errorObj).length == 0 && formData?.userId) {
      setIsLoading(true);
      const startTime = performance.now();
      const { response } = await loginWithOtpUserValidateAPI(payload);
      const endTime = performance.now();
      const apiResponseTime = endTime - startTime;
      setIsLoading(false);

      let err;
      if (response?.data?.status?.toLowerCase() === 'success') {
        if (triggerType == 'resend') {
          setIsResendOtp(true);
        }
        pushAnalytic({
          state: '',
          event: 'api',
          apiMesg: {
            code: response?.status || '',
            response: response?.data || '',
            responsetime: apiResponseTime || '',
            apiURL: envObj.API_LOGIN_WITH_OTP_INITATE_VALIDATE,
          },
        });
      }

      switch (response?.data?.process?.toLowerCase()) {
        case 'login':
          setActiveScreen(SCREEN_TYPE.LOGIN_OTP);
          break;
        case 'signup':
          setActiveScreen(SCREEN_TYPE.SIGNUP_OTP);
          break;
        default:
          switch (true) {
            case Array.isArray(response?.errors):
              err = response.errors[0];
              break;
            case response?.error:
              err = response.error;
              break;
            default:
              err = response?.errors;
              break;
          }

          const errorObj = getErrorMsgForCode(err?.code);
          const errorDetail = {
            type: 'error',
            code: err?.code,
            title: 'Error', // change title with error type like error,info
            message: errorObj?.message || 'Something went wrong',
          };
          gtmPushAnalytic({
            state: {
              persona,
              error_message: errorDetail?.message,
              error_type: errorDetail?.type,
              apiURL: envObj.API_LOGIN_WITH_OTP_INITATE_VALIDATE,
            },
            event: 'error',
          });

          pushAnalytic({
            state: '',
            event: 'error',
            errorMesg: {
              code: response?.errors?.code || '',
              type: 'api',
              source: 'api',
              apiURL: envObj.API_LOGIN_WITH_OTP_INITATE_VALIDATE,
              statusCode: response?.status,
              statusMessage: response?.errors?.message || '',
              displayMessage: errorObj?.message || 'Something went wrong',
            },
          });
          pushAnalytic({
            event: 'UXerror',
            errorMesg: {
              code: response?.status,
              type: AA_CONSTANTS.BE_ERROR,
              source: AA_CONSTANTS.MS_API,
              apiUrl: envObj.API_LOGIN_WITH_OTP_INITATE_VALIDATE,
              statusCode: response?.status,
              statusMessage: response?.errors?.message,
              displayMessage: errorObj?.message,
              action: AA_CONSTANTS.LINK_BUTTON_CLICK,
              component: 'Send OTP',
            },
          });
          console.log(errorDetail, 'errorDetail');
          setToastProps({
            title: 'Error',
            description: errorObj?.message || 'Something went wrong',
            variation: 'notifi-variation--Error',
            autoDismissTimeer: 5000,
            onClose: () => {
              setToastProps(null);
            },
          });
          break;
      }
    }
  };

  const onClickOtpValidateFromLoginWithOtpFlow = async (otpText) => {
    setIsLoading(true);
    setOtpText(otpText);
    let { userId } = formData;
    const formUserId = userId;
    persona === MEMBER
      && (userId = `${
        sharedData?.countryCode || 91
      }*${String(formData.userId)}`);

    const payload = {
      data: {
        mobile: userId,
        otp: encryptAESForLogin(otpText),
      },
    };
    const startTime = performance.now();
    const { response } = await loginWithOtpLogInAPI(payload);
    const endTime = performance.now();
    const apiResponseTime = endTime - startTime;
    setIsLoading(false);
    if (
      response?.data?.status?.toLowerCase() === 'success'
      && response?.data?.token
      && !response?.data?.token?.passwordChangeRequired
    ) {
      const personObj = response.data?.token?.person || {};
      const customerNumber = response.data?.token?.person?.customerNumber;
      let customerNumberEncryptedForAnalytics = '';
      try {
        customerNumberEncryptedForAnalytics = AESEncryptCtr(customerNumber, '', 256);
      } catch (error) {}
      const user = {
        customerNumber,
        name: {
          first: personObj.name?.first,
          last: personObj.name?.last,
          title: personObj.name?.title,
        },
        details: {
          dateOfBirth: personObj.details?.dateOfBirth,
          passengerType: personObj.details?.passengerType,
          preferredCurrencyCode:
            personObj.details?.preferredCurrencyCode,
        },
        customerNumberEncryptedForAnalytics,
        loyaltyMemberInfo: personObj?.loyaltyMemberInfo || {},
        mobileNumber: formUserId || '',
        mobileCountryCode: sharedData?.countryCode || 91,
        email: '',
      };
      const strTok = response?.data?.token?.strToken;
      // BAU call - START
      makeBAUCallFromStrToken(strTok);
      // BAU call - END
      document?.dispatchEvent(
        loginSuccessEvent({
          bubbles: true,
          detail: {
            token: response?.data?.token,
            user,
          },
        }),
      );
      pushAnalytic({
        state: { loginSuccessful: 1 },
        event: 'Submit OTP',
      });
      pushAnalytic({
        state: '',
        event: 'api',
        apiMesg: {
          code: response?.status || '',
          response: response?.data || '',
          responsetime: apiResponseTime || '',
          apiURL: envObj.API_LOGIN_WITH_OTP,
        },
      });
      gtmPushAnalytic({
        state: {
          ...state,
          isLoggedIn: true,
          user,
          persona,
          login_method: 'OTP',
        },
        event: 'loginSuccess',
      });
      setFormType('');
    } else if (
      response?.data?.status?.toLowerCase() === 'success'
      && response?.data?.token
      && response?.data?.token?.passwordChangeRequired
    ) {
      pushAnalytic({
        state: { loginFail: 1 },
        event: 'Submit OTP',
      });
      const updatedUserName = isMember
        && Number(
          sharedData?.countryCode || 91,
        ) !== 91
        ? `${Number(
          sharedData?.countryCode || 91,
        )}*${String(formData.userId)}`
        : formData.userId;
      const usernameEncrypted = encryptAESForLogin(
        updatedUserName,
        AES_SECRET_KEY,
      );
      const otpEncrypted = otpText && encryptAESForLogin(otpText, AES_SECRET_KEY);
      const otpAgentReferenceEncrypted = otpText
        ? encryptAESForLogin(otpText, AES_SECRET_KEY)
        : '';
      const payload = {
        username: usernameEncrypted,
        domainCode: isMember ? 'WW2' : 'WWW',
        usertype: persona,
        otpText: otpEncrypted || '',
        isEncrypted: true,
        otpAgentReferenceToValidate: otpText && otpAgentReferenceEncrypted,
      };
      const { response } = await resetPasswordAPI(payload);
      setSharedData({ ...sharedData, name: response?.data?.name || {} });
      setActiveScreen(SCREEN_TYPE.FORGOT_CONFIRM_PASSWORD);
    } else {
      // handle error;
      let err;

      if (Array.isArray(response?.errors)) {
        err = response.errors[0];
      } else {
        err = response?.error || response?.errors;
      }
      const errorObj = getErrorMsgForCode(err?.code);
      const errorDetail = {
        type: 'error',
        code: err?.code,
        title: 'Error', // change title with error type like error,info
        message: errorObj?.message || 'Something went wrong',
      };
      console.log(errorDetail, 'errorDetail');
      pushAnalytic({
        event: 'UXerror',
        errorMesg: {
          code: response?.status,
          type: AA_CONSTANTS.BE_ERROR,
          source: AA_CONSTANTS.MS_API,
          apiUrl: envObj.API_LOGIN_WITH_OTP,
          statusCode: err?.code,
          statusMessage: err?.message,
          displayMessage: errorObj?.message,
          action: AA_CONSTANTS.LINK_BUTTON_CLICK,
          component: 'login with Otp',
        },
      });
      gtmPushAnalytic({
        state: {
          persona,
          click_text: 'Submit Otp',
          error_message: errorDetail?.message,
          error_type: errorDetail?.type,
          apiURL: envObj.API_LOGIN_WITH_OTP,
        },
        event: 'error',
      });

      pushAnalytic({
        state: { loginFail: 1 },
        event: 'Submit OTP',
      });

      pushAnalytic({
        state: '',
        event: 'error',
        errorMesg: {
          code: response?.errors?.code || '',
          type: 'api',
          source: 'api',
          apiURL: envObj.API_LOGIN_WITH_OTP,
          statusCode: response?.status,
          statusMessage: response?.errors?.message || '',
          displayMessage: errorDetail?.message || 'Something went wrong',
        },
      });
      if (errorDetail?.code === 'InvalidOtp:Failed') return errorDetail?.message;
      setToastProps({
        title: 'Error',
        description: errorDetail?.message || 'Something went wrong',
        variation: 'notifi-variation--Error',
        autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
    }
  };
  const newErrorObj = {};
  for (const key in errorObj) {
    newErrorObj[key] = { message: errorObj[key] };
  }

  switch (activeScreen) {
    case SCREEN_TYPE.LOGIN_MFA_OTP:
    case SCREEN_TYPE.LOGIN_OTP:
      return (
        <OtpVerifyPopUp
          onClickSubmit={(otpText) => (activeScreen === SCREEN_TYPE.LOGIN_OTP
            ? onClickOtpValidateFromLoginWithOtpFlow(otpText)
            : onSubmit({}, otpText))}
          errorMsg={
            isOtpRequired?.isError
              ? mfLabels?.incorrectOtpText
                || 'You seem to have entered an invalid OTP'
              : ''
          }
          resendOtp={onClickInitiateOtp}
          phoneNumber={formData?.userId}
          isLoading={isLoading}
          mfLabels={mfLabels}
          setActiveScreen={setActiveScreen}
          activeScreen={activeScreen}
          sharedData={sharedData}
          setSharedData={setSharedData}
          persona={persona}
          setToastProps={setToastProps}
          isResendOtp={isResendOtp}
          onCloseHandler={() => {
            if (isOtpRequired) setIsOtpRequired(null);
            onCloseHandler && onCloseHandler();
          }}
        />
      );

    case SCREEN_TYPE.LOGIN_PASSWORD:
      return (
        <PasswordLoginPopUp
          onClickSubmit={(props) => onSubmit({}, props)}
          errorMsg={
            isOtpRequired?.isError
              ? mfLabels?.incorrectOtpText
                || 'You seem to have entered an invalid OTP'
              : ''
          }
          isMember={isMember}
          persona={persona}
          onClose={() => setActiveScreen(SCREEN_TYPE.SIGNUP_FORM)}
          onCloseHandler={onCloseHandler}
          isLoading={isLoading}
          onChange={(key, value) => onChange(key, value)}
          mfLabels={mfLabels}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          setFormType={setFormType}
          formData={formData}
          customErrorMsg={customErrorMsg}
          setAgentLockedDialog={setAgentLockedDialog}
          agentLockedDialog={agentLockedDialog}
        />
      );

    case SCREEN_TYPE.LOGIN_USERID:
      const diabledVar = !(
        Object.keys(errorObj).length == 0 && formData?.userId?.length > 5
      );
      return (
        <PopupModalWithContent
          overlayClickClose={false}
          onOutsideClickClose={onOutsideClickCloseHandler}
          onCloseHandler={onCloseHandler}
          className={`popup-modal-with-content-login-form ${persona}`}
          isLoginWithPassword={isLoginWithPassword}
          mfLabels={mfLabels}
          modalTitle={mfLabels?.loginTitle?.html}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          customPopupContentClassName="login-mf-modal"
          closeButtonIconClass={isMember ? '' : 'invisible'}
        >
          <div className={`login-form ${persona} ${variation}`} role="generic">
            <div className="login-form__wrapper">
              <form
                onSubmit={() => onClickInitiateOtp(formData)}
                className="login-form__wrapper__form"
              >
                <div className="login-form__wrapper__form__persona d-none">
                  <p>You can now log in as :</p>
                  <RadioBoxGroup
                    items={PersonaArray}
                    onChange={onChangePersonaArray}
                    selectedValue={persona}
                    containerClassName="login-form__wrapper__form__persona__radio-btn"
                  />
                </div>

                <div
                  ref={loginref}
                  className={`login-form__wrapper__form__row login-form__wrapper__form__row--row1 ${variation}`.trim()}
                >
                  <VariationBasedComponent
                    onChange={onChange}
                    value={formData?.userId || null}
                    onEnter={
                      !diabledVar
                        ? () => {
                          onClickInitiateOtp(formData);
                        }
                        : () => {}
                    }
                    variation={persona}
                    errorObj={newErrorObj}
                    countryCode={
                     formData?.countryCode
                      || mfLabels?.defaultCountryCode
                      || DEFAULT_CURRENCY_CODE
                    }
                    name="userId"
                    required
                    placeholder={mfLabels?.userIdPlaceholder}
                  />
                </div>

                <div className="login-form__wrapper__form__row login-form__wrapper__form__row--row4 submit-btn login-form__send-otp-btn">
                  <Button
                    aria-label={mfLabels?.sendOtpLabel}
                    aria-disabled={diabledVar}
                    onClick={
                      !diabledVar
                        ? () => {
                          onClickInitiateOtp(formData);
                        }
                        : () => {}
                    }
                    disabled={diabledVar}
                    loading={isLoading}
                  >
                    {mfLabels?.sendOtpLabel}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </PopupModalWithContent>
      );

    default:
      return null;
  }
};

LoginForm.propTypes = {
  persona: PropTypes.any,
  onCloseHandler: PropTypes.func,
  setFormType: PropTypes.func,
  setToastProps: PropTypes.func,
  mfLabels: PropTypes.any,
  setActiveScreen: PropTypes.any,
  activeScreen: PropTypes.any,
  setSharedData: PropTypes.any,
  sharedData: PropTypes.any,
  makeBAUCallFromStrToken: PropTypes.func,
};

export default LoginForm;
