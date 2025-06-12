/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useLayoutEffect, Profiler } from 'react';
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import EmailComponent from 'skyplus-design-system-app/dist/des-system/EmailComponent';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import { checkUserAPI, sendOtpAPI } from '../../functions/services';
import { DD_RUM_EVENTS, DD_RUM_LOAD_CLICK_PAYLOAD, REGEX_LIST, SCREEN_TYPE } from '../../constants';
import pushAnalytic from '../../functions/analyticEvents';
import './LandingForm.scss';
import {
  formatDate,
  getParameterValue,
  getEnvObj,
} from '../../functions/utils';
import { DEFAULT_CURRENCY_CODE } from '../../constants/common';
import Cookies from '../../functions/cookies';
import COOKIE_KEYS from '../../constants/cookieKeys';
import { maskEmail, maskString } from '../../utils/common';
import pushDDRumAction from '../../utils/ddrumEvent';

function LandingForm({
  persona = '',
  onCloseHandler = () => { },
  mfLabels,
  setActiveScreen,
  activeScreen,
  setSharedData,
  sharedData,
  setToastProps,
}) {
  const [errorObj, setErrorObj] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    value: '',
    countryCode: sharedData?.countryCode || DEFAULT_CURRENCY_CODE,
    phone: sharedData?.phone || '',
    email: sharedData?.email || '',
  });
  const isPhone = formData?.phone.length > 0;
  const isEmail = formData?.email.length > 0;
  const envObj = getEnvObj() || {};
  let startTimer = 0;
  let responseTime = 0;
  if (!isMounted) {
    startTimer = performance.now();
  }
  useEffect(() => {
    // edit on otp page will avoid showing both phone and email
    if (isPhone && isEmail) {
      sharedData?.isMobileEntered
        && setFormData((prev) => {
          return { ...prev, email: '' };
        });
      !sharedData?.isMobileEntered
        && setFormData((prev) => {
          return { ...prev, phone: '' };
        });
    }
    if (!isMounted) {
      setIsMounted(true);
      responseTime = (performance.now() - startTimer) / 1000;
      const loginPageLoadEvent = DD_RUM_EVENTS.LOGIN_LOAD_PAGE;
      const loginPageLoad = DD_RUM_LOAD_CLICK_PAYLOAD;
      loginPageLoad.action = 'Login Page Load';
      loginPageLoad.datadogSessionId = window.DD_RUM?.getInternalContext()?.session_id;
      loginPageLoad.timestamp = new Date();
      loginPageLoad.metadata = {
        page: 'Login',
        step: 'PageLoad',
        component: 'LandingForm',
        application: 'login-sso',
        durationMs: responseTime,
        flowType: 'Login',
       
      }
      pushDDRumAction(loginPageLoadEvent, loginPageLoad)
    }
  }, []);

  useEffect(() => {
    if (!isPhone && !isEmail) {
      document.querySelector('input.SSO_landing_input_onfocus')?.focus();
    } else if (isPhone) {
      document
        .querySelector('.SSO_phone_onfocus .SSO_phone_onfocus input')
        ?.focus();
    } else if (isEmail) {
      document.querySelector('.SSO_email_focus_onload')?.focus();
    }

  }, [isPhone, isEmail]);

  const validatePhone = (tempFormData) => {
    const errorObjTemp = {};
    const regex = tempFormData.countryCode === '+91'
      || Number(tempFormData.countryCode) === 91
      ? REGEX_LIST.INDIAN_MOBILE_NUMBER
      : REGEX_LIST.EXCEPT_INDIAN_MOBILE_NUMBER;

    if (
      !String(tempFormData.phone).match(regex)
      || tempFormData.phone.length < mfLabels?.minPhoneLength
      || tempFormData.phone.length > mfLabels?.maxPhoneLength
    ) {
      errorObjTemp.phone = {
        message: mfLabels?.mobileValidationText || '',
      };
    }
    setErrorObj(errorObjTemp);

    return errorObjTemp;
  };

  const validateEmail = (tempFormData) => {
    if (!tempFormData.email.includes('@')) {
      // if user directly enter number withot deleting email
      if (tempFormData.email.length > 6 && /^\d+$/.test(tempFormData.email)) {
        validatePhone({
          countryCode: formData?.countryCode,
          phone: tempFormData.email,
        });
        setFormData({
          ...formData,
          phone: tempFormData.email,
          email: '',
          value: '',
        });
      } else {
        setFormData({
          ...formData,
          phone: '',
          email: '',
          value: tempFormData.email,
        });
      }
      return null;
    }
    const errorObjTemp = {};
    const emailPattern = REGEX_LIST.EMAIL;
    emailPattern.test(tempFormData.email)
      ? ''
      : (errorObjTemp.email = {
        message:
          mfLabels?.loyaltyInformation?.invalidEmailLabel || 'Invalid email',
      });

    setErrorObj(errorObjTemp);
    return null;
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (input.startsWith('+')) {
      setFormData({ ...formData, phone: input, value: '' });
    } else if (input.length > 6 && /^\d+$/.test(input)) {
      validatePhone({ countryCode: formData?.countryCode, phone: input });
      setFormData({ ...formData, phone: input, value: '' });
    } else if (input.includes('@')) {
      validateEmail({ email: input });
      setFormData({ ...formData, email: input, value: '' });
    } else {
      setFormData({ ...formData, value: input });
    }
  };

  const onChange = (key, value, additionalObj) => {
    const temp = { ...formData, ...additionalObj };
    if (key) {
      temp[key] = value;
    }
    setFormData(temp);
    isPhone && validatePhone(temp);
    isEmail && validateEmail(temp);
    setSharedData((prev) => {
      return { ...prev, ...temp };
    });
  };
  const sendOtpAndChangeScreen = async () => {
    setIsLoading(true);
    try {
      const payload = {
        mobileNumber: isPhone
          ? `+${formData?.countryCode}${formData?.phone}`
          : '',
        emailId: formData?.email || '',
        otpType: isPhone ? 'SMS' : 'Email',
      };
      const { response } = await sendOtpAPI(payload);
      setIsLoading(false);
      if (response?.data?.success) {
        setActiveScreen(SCREEN_TYPE.OTP_VERIFY_PAGE);
      } else {
        const err = Array.isArray(response?.errors)
          ? response.errors[0]
          : response?.error || response?.errors;

        const errorObjTemp = getErrorMsgForCode(err?.code);

        setToastProps({
          title: 'Error',
          description: errorObjTemp?.message || 'Something went wrong',
          variation: 'notifi-variation--Error',
          onClose: () => {
            setToastProps(null);
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleContinueButton = async () => {
    setSharedData({ ...sharedData, ...formData, isMobileEntered: isPhone });
    setIsLoading(true);
    const loginSubmitEvent = DD_RUM_EVENTS.LOGIN_CONTINUE_CLICKED;
    const loginSubmitClick = DD_RUM_LOAD_CLICK_PAYLOAD;
    loginSubmitClick.action = 'Continue Button Click';
    loginSubmitClick.datadogSessionId = window.DD_RUM?.getInternalContext()?.session_id;
    loginSubmitClick.timestamp = new Date().toISOString();
    loginSubmitClick.metadata = {
      page: 'Login',
      step: 'Continue',
      component: 'LandingForm',
      application: 'login-sso',
      userInput: {
        phoneNumber: isPhone ? maskString(formData?.phone) : '',
        countryCode: isPhone ? formData?.countryCode : '',
        firstName: '',
        lastName: '',
        dob: '',
        email: isEmail ? maskEmail(formData?.email) : '',
        otp: '',
      },
      durationMs: 0,
      flowType: 'Login',
    }
    pushDDRumAction(loginSubmitEvent, loginSubmitClick)
    isPhone
      ? pushAnalytic({
        state: {
          phone: encryptAESForLogin(
            `+${formData.countryCode}${formData.phone}`,
          ),
        },
        event: 'ContinueAtPhone',
      })
      : pushAnalytic({
        state: {
          email: encryptAESForLogin(formData?.email),
        },
        event: 'ContinueAtEmail',
      });

    try {
      let payload;

      if (isEmail) {
        payload = { emailId: formData?.email };
      } else {
        payload = {
          mobileNumber: `+${formData.countryCode}${formData.phone}`,
        };
      }

      const { response } = await checkUserAPI(payload);
      if (response?.data) {
        const {
          isSignUp,
          isActivated,
          isMigrated,
          isLoyaltyMember,
          isCoBrandMember,
        } = response?.data || {};

        const person = response?.data?.userDetails || {};
        let ciamPolicyName = null;
        if (response?.data?.iframeUrl) {
          ciamPolicyName = getParameterValue(response?.data?.iframeUrl, 'p');
          let cookieExpiredTime = envObj?.sso_token_validity_minutes
            || envObj?.SSO_TOKEN_VALIDITY_MINUTES
            || 60 * 24 * 60;
          cookieExpiredTime = cookieExpiredTime * 60 * 1000;
          Cookies.set(
            COOKIE_KEYS.CIAM_POLICY,
            ciamPolicyName,
            null,
            cookieExpiredTime,
            true,
          );
        }

        if (Object.keys(person).length > 0) {
          setSharedData((prev) => {
            return {
              ...prev,
              firstName: person?.firstName || '',
              lastName: person?.lastName || '',
              email: person?.emailId || '',
              countryCode: `${person?.countryCode
                ? String(person?.countryCode).replaceAll('+', '')
                : '91'
                }`,
              phone: person?.mobileNumber.replace(
                person?.countryCode || '+91',
                '',
              ),
              date: formatDate(person?.dob, '/') || '',
              gender: person?.gender || '',
              isLoyaltyMember: response?.data?.isLoyaltyMember,
              checkUserApiResponse: response?.data,
              ciamPolicyName,
            };
          });
        } else {
          setSharedData((prev) => {
            return {
              ...prev,
              ciamPolicyName,
              isLoyaltyMember: response?.data?.isLoyaltyMember,
              checkUserApiResponse: response?.data,
            };
          });
        }

        switch (true) {
          case !isActivated && isCoBrandMember:
            // 8
            setSharedData((prev) => {
              return {
                ...prev,
                flow: SCREEN_TYPE.SIGNUP_6E_REWARD_MIGRATION,
                isLoyaltyCheckEditable: false,
                isformFieldsEditable: false,
                isDOBEditable: false,
                isGenderEditable: false,
              };
            });
            sendOtpAndChangeScreen();
            break;

          case isActivated && isCoBrandMember:
            // 9
            setSharedData((prev) => {
              return { ...prev, flow: SCREEN_TYPE.LOYALTY_DASHBOARD_WELCOME };
            });
            setActiveScreen(SCREEN_TYPE.IFRAME);
            break;

          case isSignUp && !isActivated && isLoyaltyMember:
            // 1
            setSharedData((prev) => {
              return {
                ...prev,
                flow: SCREEN_TYPE.SIGNUP_NEW_USER,
                isLoyaltyCheckEditable: false,
              };
            });
            setActiveScreen(SCREEN_TYPE.SIGNUP_NEW_USER);
            break;

          case isSignUp && !isActivated && !isLoyaltyMember:
            // 2
            setSharedData((prev) => {
              return { ...prev, flow: SCREEN_TYPE.SIGNUP_NEW_USER };
            });
            setActiveScreen(SCREEN_TYPE.SIGNUP_NEW_USER);
            break;

          case !isSignUp && !isActivated && !isLoyaltyMember:
            // 3
            setSharedData((prev) => {
              return {
                ...prev,
                flow: SCREEN_TYPE.SIGNUP_6E_USER_MIGRATION,
                isformFieldsEditable: false,
                isDOBEditable: false,
                isGenderEditable: false,
              };
            });
            sendOtpAndChangeScreen();
            //  setActiveScreen(SCREEN_TYPE.OTP_VERIFY_PAGE);
            break;

          case !isSignUp && !isActivated && isLoyaltyMember && !isMigrated:
            // 4
            setSharedData((prev) => {
              return {
                ...prev,
                flow: SCREEN_TYPE.SIGNUP_6E_REWARD_MIGRATION,
                isformFieldsEditable: false,
                isDOBEditable: false,
                isGenderEditable: false,
              };
            });
            sendOtpAndChangeScreen();
            //  setActiveScreen(SCREEN_TYPE.OTP_VERIFY_PAGE);
            break;

          // eslint-disable-next-line sonarjs/no-duplicated-branches
          case !isSignUp && !isActivated && isLoyaltyMember && isMigrated:
            // 5
            setSharedData((prev) => {
              return {
                ...prev,
                flow: SCREEN_TYPE.SIGNUP_6E_REWARD_MIGRATION,
                isLoyaltyCheckEditable: false,
                isformFieldsEditable: false,
                isDOBEditable: false,
                isGenderEditable: false,
              };
            });
            sendOtpAndChangeScreen();
            //  setActiveScreen(SCREEN_TYPE.OTP_VERIFY_PAGE);
            break;

          // eslint-disable-next-line sonarjs/no-duplicated-branches
          case isActivated && isLoyaltyMember:
            // 6
            setSharedData((prev) => {
              return { ...prev, flow: SCREEN_TYPE.LOYALTY_DASHBOARD_WELCOME };
            });
            setActiveScreen(SCREEN_TYPE.IFRAME);
            break;
          case isActivated && !isLoyaltyMember:
            // 7
            setSharedData((prev) => {
              return {
                ...prev,
                flow: SCREEN_TYPE.SIGNUP_6E_USER,
                isLoyaltyCheckEditable: false,
              };
            });
            setActiveScreen(SCREEN_TYPE.IFRAME);
            break;
          // eslint-disable-next-line sonarjs/no-duplicated-branches
          default:
            setSharedData((prev) => {
              return { ...prev, flow: SCREEN_TYPE.SIGNUP_NEW_USER };
            });
            setActiveScreen(SCREEN_TYPE.SIGNUP_NEW_USER);
            break;
        }
      } else {
        const err = Array.isArray(response?.errors)
          ? response?.errors[0]
          : response?.error || response?.errors;

        const errorObjTemp = getErrorMsgForCode(err?.code);

        setToastProps({
          title: 'Error',
          description: errorObjTemp?.message || 'Something went wrong',
          variation: 'notifi-variation--Error',
          onClose: () => {
            setToastProps(null);
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsLoading(false);
  };
  const disabledVar = !(
    Object.keys(errorObj).length === 0
    && (isPhone || isEmail)
  );
  return (
    <div>
      <PopupModalWithContent
        overlayClickClose={false}
        onOutsideClickClose={null}
        className={`popup-modal-with-content-login-sso-form ${persona}`}
        mfLabels={mfLabels}
        modalTitle={mfLabels?.loginTitle?.html}
        activeScreen={activeScreen}
        setActiveScreen={() => { }}
        customPopupContentClassName="login-sso-mf-modal"
        onCloseHandler={onCloseHandler}
      >
        <form
          className="login-sso-form__wrapper__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div
            className={'login-sso-form__wrapper__form__row login-sso-form__wrapper__form__row--row1'.trim()}
          >
            {!isPhone && !isEmail && (
              <InputField
                type="text"
                name="userInput"
                register={() => { }}
                className="SSO_landing_input_onfocus"
                inputWrapperClass="forgot-pwd__inpt-field"
                placeholder={
                  mfLabels?.loyaltyInformation?.ffPlaceholder
                  || 'Enter Mobile No./ Email Id'
                }
                value={formData?.value}
                onChange={handleInputChange}
                data-dd-privacy={'mask'}
              />
            )}
            {isPhone && (
              <PhoneComponent
                className={`SSO_phone_onfocus ${Object.keys(errorObj).length === 0
                  ? 'login-sso-phone-dropdown mb-6'
                  : 'login-sso-phone-dropdown login-sso-phone-dropdown-error error-space mb-6'
                  }`}
                onChangeCountryCode={(countryInitials, item) => {
                  onChange(null, null, {
                    countryInitials: item?.countryCode,
                    countryCode: item?.phoneCode,
                  });
                }}
                onChangePhoneNumber={(value) => {
                  onChange('phone', value);
                }}
                initialCountryCode={formData?.countryCode}
                errors={errorObj}
                name="phone"
                required
                value={formData?.phone}
                maxLength={15}
                sanitize
                type="number"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !disabledVar) {
                    handleContinueButton();
                  }
                }}
                data-dd-privacy={'mask'}
              />
            )}

            {isEmail && (
              <EmailComponent
                name="email"
                value={formData?.email}
                required
                className="SSO_email_focus_onload mb-6"
                emailPlaceholder={mfLabels?.enterMailIdLabel}
                onEmailChange={(value) => onChange('email', value)}
                errors={errorObj}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !disabledVar) {
                    handleContinueButton();
                  }
                }}
              />
            )}

            <Button
              aria-label={mfLabels?.enrollContinueLabel}
              aria-disabled={disabledVar}
              disabled={disabledVar}
              loading={isLoading}
              onClick={handleContinueButton}
            >
              {mfLabels?.enrollContinueLabel || 'Continue'}
            </Button>
          </div>
        </form>
      </PopupModalWithContent>
    </div>
  );
}

LandingForm.propTypes = {
  persona: PropTypes.string.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  mfLabels: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func.isRequired,
  activeScreen: PropTypes.string.isRequired,
  setSharedData: PropTypes.func.isRequired,
  setToastProps: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
};

export default LandingForm;
