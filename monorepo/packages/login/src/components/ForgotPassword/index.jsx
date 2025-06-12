import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import OtpInput from 'skyplus-design-system-app/dist/des-system/OtpInput';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { validator } from '../../functions/utils';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import { resetPasswordAPI, changePasswordAPI } from '../../functions/services';
import Constants, { REGEX_LIST, SCREEN_TYPE } from '../../constants';
import {
  AES_SECRET_KEY,
  MEMBER,
  RESET_PASSWORD_API,
  CHANGE_PASSWORD_API,
} from '../../constants/index-env';
import VariationBasedComponent from '../LoginForm/components/VariationBasedComponent';
import { AA_CONSTANTS, DEFAULT_CURRENCY_CODE } from '../../constants/common';
import pushAnalytic from '../../functions/analyticEvents';
import gtmPushAnalytic from '../../functions/gtmAnalyticsEvents';

const validators = {
  phone: validator('^[0-9][0-9]{0,9}$'),
  countryCode: validator('^[1-9][0-9]{0,3}$'),
  internationalPhone: validator('^[0-9][0-9]{0,11}$'),
  validPasswordText: REGEX_LIST.PASSWORD,
};
function ForgotPasswordHome({
  setToastProps = () => {},
  personaType,
  onCloseHandler,
  mfLabels,
  activeScreen,
  sharedData,
  setActiveScreen,
  setSharedData,
}) {
  const mfAdditionalData = {
    passwordResetSuccessPopupLabel: 'Success',
    passwordResetSuccessPopupDescription: {
      html: '<p>Your password has been reset successfully and an email has been sent to your email id.</p>\n<p>SUCCESS! Your Log in information and password have been emailed to thr address you entered. When you receive your password, you may again log on to our system and access all the features available to a preferred customer. You may also change your password or update other registration information at any time.</p>\n',
    },
  };
  const otpLength = 6;
  const [otpNumber, setOtpNumber] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: sharedData?.countryCode || DEFAULT_CURRENCY_CODE,
    userId: sharedData.userId || null,
  });
  const [resetOtpAPIdata, setResetOtpAPIData] = useState({});
  const [isSuccessEmailPopup, setIsSuccessEmailPopup] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [errorObj, setErrorObj] = useState({});
  // const [isLiveValidate, setIsLiveValidate] = useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [isResendOtp, setIsResendOtp] = useState(false);
  const [persona] = useState(personaType);

  const otpTimerConfig = { minute: 10, seconds: 0 };
  const isDisabled = otpLength !== otpNumber.length;
  const isAgent = persona?.toLowerCase() === Constants.AGENT.toLowerCase();
  const isMember = persona?.toLowerCase() === Constants.MEMBER.toLowerCase();
  const otpCompRef = useRef();
  const diabledVar = Object.keys(errorObj)?.length == 0 && formData?.userId?.length > 5;
  let apiResponseTime;
  useEffect(() => {
    document
      .querySelector('.forgot-pwd__resend u')
      ?.addEventListener('click', () => {
        onClickResendOtp();
      });
  }, []);

  useEffect(() => {
    if (activeScreen === SCREEN_TYPE.FORGOT_CONFIRM_PASSWORD) {
      setIsConfirmPassword(true);
      setFormData({
        userId: sharedData?.userId,
        countryCode:
          sharedData?.countryCode || 91,
      });
    }
  }, [activeScreen]);

  const onChange = (key, value, additionalObj = {}) => {
    const temp = { ...formData, ...additionalObj };
    if (key) {
      temp[key] = value;
    }
    setFormData(temp);
    // if (isLiveValidate) {
    validateFormData(temp);
    // }
  };
  const handleChange = (value) => {
    setOtpNumber(value);
  };

  const onClickInitiateOtp = async (otp, triggerType = 'sendOtp') => {
    // if (!isLiveValidate && triggerType !== 'resend') {
    //   setIsLiveValidate(true);
    //   return;
    // }
    triggerType == 'sendOtp'
      && pushAnalytic({
        state: { phone: encryptAESForLogin(sharedData.userId) },
        event: 'Send OTP',
      });
    triggerType == 'ConfirmOtp'
      && pushAnalytic({
        state: '',
        event: 'Confirm OTP',
      });
    const errorObjTemp = validateFormData(formData);
    if (Object.keys(errorObjTemp).length > 0) {
      return;
    }

    setIsOtpLoading(true);
    const updatedUserName = isMember
      && Number(sharedData?.countryCode || 91)
        !== 91
      ? `${Number(
        sharedData?.countryCode || 91,
      )}*${String(formData.userId)}`
      : formData.userId;

    const usernameEncrypted = encryptAESForLogin(
      updatedUserName,
      AES_SECRET_KEY,
    );
    const otpEncrypted = otp && encryptAESForLogin(otp, AES_SECRET_KEY);
    const otpAgentReferenceEncrypted = otpNumber && resetOtpAPIdata.otpAgentReferenceToValidate
      ? encryptAESForLogin(
        resetOtpAPIdata.otpAgentReferenceToValidate,
        AES_SECRET_KEY,
      )
      : '';

    const payload = {
      username: usernameEncrypted,
      domainCode: isMember ? 'WW2' : 'WWW',
      usertype: persona,
      otpText: otpEncrypted || '',
      isEncrypted: true,
      otpAgentReferenceToValidate: (triggerType === 'resend') ? '' : (otpNumber && otpAgentReferenceEncrypted),
    };
    const startTime = performance.now();
    const { response } = await resetPasswordAPI(payload);
    setSharedData({ ...sharedData, name: response?.data?.name || {} });
    const endTime = performance.now();
    apiResponseTime = endTime - startTime;
    handleResetPasswordApiResponse(response);
    setIsOtpLoading(false);
    triggerType === 'resend' && setIsResendOtp(true);
    gtmPushAnalytic({ state: '', event: 'Send OTP' });
  };

  const handleResetPasswordApiResponse = (response) => {
    if (response?.data?.success) {
      pushAnalytic({
        state: '',
        event: 'api',
        apiMesg: {
          code: response?.status || '',
          response: response?.data || '',
          responsetime: apiResponseTime || '',
          apiURL: RESET_PASSWORD_API,
        },
      });
      if (response.data.otpRequired) {
        handleOtpRequiredResponse(response);
      } else {
        handleOtpNotRequiredResponse();
      }
    } else {
      handleErrorResponse(response);
    }
  };

  const handleOtpRequiredResponse = (response) => {
    setShowOtp(true);
    setResetOtpAPIData({
      otpAgentReferenceToValidate: response.data.otpAgentReferenceToValidate,
    });
  };

  const handleOtpNotRequiredResponse = () => {
    setShowOtp(false);
    setIsConfirmPassword(true);
  };

  const handleErrorResponse = (response) => {
    const err = Array.isArray(response?.errors)
      ? response.errors[0]
      : response?.error || response?.errors;
    const errorObj = getErrorMsgForCode(err?.code);

    gtmPushAnalytic({
      state: {
        persona,
        click_text: 'Confirm OTP',
        error_message: errorObj?.message,
        error_type: 'Business',
        apiURL: RESET_PASSWORD_API,
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
        apiURL: RESET_PASSWORD_API,
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
        apiUrl: RESET_PASSWORD_API,
        statusCode: response?.status,
        statusMessage: response?.errors?.message,
        displayMessage: errorObj?.message,
        action: AA_CONSTANTS.LINK_BUTTON_CLICK,
        component: 'Confirm OTP',
      },
    });

    setToastProps({
      title: 'Error',
      description: errorObj?.message || 'Something went wrong',
      variation: 'notifi-variation--Error',
      autoDismissTimeer: 5000,
      onClose: () => {
        setToastProps(null);
      },
    });
  };

  const onClickSubmit = (otp) => {
    onClickInitiateOtp(otpNumber, 'ConfirmOtp');
  };
  const onClickResendOtp = () => {
    pushAnalytic({
      state: '',
      event: 'Resend OTP',
    });
    gtmPushAnalytic({
      state: '',
      event: 'Resend OTP',
    });
    onClickInitiateOtp(null, 'resend');
  };

  const renderResentOtp = (min, sec) => {
    const isTimerFinished = min === 0 && sec === 0;
    const minFormatted = min > 9 ? min : `0${min}`;
    const secFormatted = sec > 9 ? sec : `0${sec}`;
    const timeText = `<span class="login-otpverify__resend__time forget-pwd__resend-time"> OTP will expire in the next ${minFormatted} : ${secFormatted} sec</span>`;

    return (
      <>
        <Button
          type="submit"
          disabled={isDisabled || isOtpLoading}
          variation={isOtpLoading ? 'LOADING' : ''}
          loading={isOtpLoading}
          onClick={!isDisabled ? () => onClickSubmit(otpNumber) : () => {}}
          containerClass="forgot-pwd__confirm-button mb-10 login-otpverify-verify-button"
          aria-label={mfLabels?.submitOtpLabel}
          aria-disabled={isDisabled || isOtpLoading}
        >
          {mfLabels?.submitOtpLabel}
        </Button>
        <div className="forgot-pwd__resend-container">
          <div className="forgot-pwd__resend-span">
            <div
              className="forgot-pwd__resend"
              dangerouslySetInnerHTML={{
                __html:
                  mfLabels?.resentOtpDescription
                  || "<span>Didn't receive OTP?<span>",
              }}
            />
            {!isResendOtp ? (
              <a
                data-href="#"
                className="forgot-pwd__resend  text-decoration-underline"
                onClick={onClickResendOtp}
                dangerouslySetInnerHTML={{
                  __html: mfLabels?.resendOtpLabel?.html,
                }}
              />
            ) : (
              <div className="login-otpverify__otp-resent">
                <p className="body-small-medium">OTP resent</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 2.91663C6.088 2.91663 2.91669 6.08794 2.91669 9.99996C2.91669 13.912 6.088 17.0833 10 17.0833C13.912 17.0833 17.0834 13.912 17.0834 9.99996C17.0834 6.08794 13.912 2.91663 10 2.91663ZM1.66669 9.99996C1.66669 5.39759 5.39765 1.66663 10 1.66663C14.6024 1.66663 18.3334 5.39759 18.3334 9.99996C18.3334 14.6023 14.6024 18.3333 10 18.3333C5.39765 18.3333 1.66669 14.6023 1.66669 9.99996Z"
                    fill="#218946"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.3548 7.47086C13.601 7.7128 13.6044 8.10852 13.3625 8.35471L9.26763 12.5214C9.15012 12.6409 8.9895 12.7083 8.82186 12.7083C8.65422 12.7083 8.4936 12.6409 8.37609 12.5214L6.22092 10.3284C5.97897 10.0822 5.98241 9.68649 6.2286 9.44454C6.4748 9.2026 6.87051 9.20604 7.11245 9.45223L8.82186 11.1916L12.4709 7.47854C12.7129 7.23235 13.1086 7.22891 13.3548 7.47086Z"
                    fill="#218946"
                  />
                </svg>
              </div>
            )}
          </div>
          {!isTimerFinished && (
            <a dangerouslySetInnerHTML={{ __html: timeText }} />
          )}
        </div>
      </>
    );
  };
  const handleEditBtn = () => {
    setShowOtp(false);
  };
  const renderOtpPopup = () => {
    return (
      <PopupModalWithContent
        modalTitleDisplay
        // className={`forgot-pwd--otp-popup`}
        className="popup-modal-with-content-login-form forgot-pwd--otp-popup"
        modalTitle={mfLabels?.enterOtpLabel}
        // hideHead={true}
        hideFooter
        otpScreen
        onCloseHandler={onCloseHandler}
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-mf-modal"
      >
        <div className="forgot-pwd--otp-popup-content">
          <div className="popup-modal-with-content popup-modal-with-content__header__description mt-5">
            <p>{mfLabels?.otpSentNote.replace('{mobileNumber}', '')}</p>
          </div>
          <div className="login-otpverify__number text-decoration-none">
            <p className="text-decoration-none">+{formData?.countryCode} {formData?.userId}</p>
            <a
              role="button"
              className="ms-3 text-decoration-none"
              onClick={() => {
                handleEditBtn();
              }}
            >
              <i className="icon-edit" />
            </a>
          </div>
          <OtpInput
            otpLength={otpLength}
            onChangeHandler={handleChange}
            initialTimerObj={otpTimerConfig}
            ref={otpCompRef}
            containerClass="forgot-pwd__otp-field"
            renderResentOtp={renderResentOtp}
          />
        </div>
      </PopupModalWithContent>
    );
  };

  const onPopUpCloseHandlerSuccessEmailSend = () => {
    setToastProps(null);
    setIsSuccessEmailPopup(false);
    onCloseHandler && onCloseHandler();
  };

  const renderSuccessEmailSend = () => {
    return (
      <PopupModalWithContent
        className="forgot-pwd-popup"
        modalTitle=""
        modalTitleDisplay
        onCloseHandler={onPopUpCloseHandlerSuccessEmailSend}
        activeScreen={activeScreen}
        mfLabels={mfLabels}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-mf-modal"
      >
        <div className="forgot-pwd-email-modal-body">
          <h3>{mfAdditionalData.passwordResetSuccessPopupLabel}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html:
                mfAdditionalData.passwordResetSuccessPopupDescription?.html
                || '',
            }}
          />
        </div>
      </PopupModalWithContent>
    );
  };

  const renderConfirmPassword = () => {
    const newErrorObj = {};
    for (const key in errorObj) {
      newErrorObj[key] = { message: errorObj[key] };
    }
    const userName = sharedData?.name ? `${sharedData?.name?.first}` : '';
    return (
      <PopupModalWithContent
        className="popup-modal-with-content-login-form forgot-pwd--otp-popup"
        modalTitle={mfLabels?.newPasswordTitle}
        modalTitleDisplay
        onCloseHandler={onPopUpCloseHandlerSuccessEmailSend}
        hideFooter
        otpScreen
        customPopupContentClassName="forgot-pwd__new-pwd-title h-auto login-mf-modal"
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      >
        <div className="forgot-pwd__new-password-header gap-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.0019 7.13763C10.3471 7.13763 10.6269 7.41745 10.6269 7.76263V11.1793C10.6269 11.5245 10.3471 11.8043 10.0019 11.8043C9.65675 11.8043 9.37693 11.5245 9.37693 11.1793V7.76263C9.37693 7.41745 9.65675 7.13763 10.0019 7.13763Z"
              fill="#25304B"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.37083 13.7502C9.37083 13.405 9.65065 13.1252 9.99583 13.1252H10.0042C10.3493 13.1252 10.6292 13.405 10.6292 13.7502C10.6292 14.0954 10.3493 14.3752 10.0042 14.3752H9.99583C9.65065 14.3752 9.37083 14.0954 9.37083 13.7502Z"
              fill="#25304B"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.9032 4.26525C10.5017 3.57197 9.50057 3.5725 9.09981 4.2662L3.0794 14.6874C2.67821 15.3819 3.17937 16.2502 3.98136 16.2502H16.0368C16.8393 16.2502 17.3404 15.3809 16.9383 14.6865L10.9032 4.26525ZM8.01744 3.64091C8.8991 2.11477 11.1016 2.1136 11.9849 3.63882L18.02 14.0601C18.9047 15.5878 17.8023 17.5002 16.0368 17.5002H3.98136C2.21697 17.5002 1.11443 15.5899 1.99703 14.0621L8.01744 3.64091Z"
              fill="#25304B"
            />
          </svg>
          <div
            className="popup-modal-with-content body-large-regular text-secondary"
            dangerouslySetInnerHTML={{
              __html: mfLabels?.newPasswordNote,
            }}
          />
        </div>

        <div className="forgot-pwd__user-details mb-6 body-medium-regular">
          <p>
            {persona === MEMBER ? (
              <span>
                {mfLabels?.userDetailsLabel
                  .replace('{mobile}', '')
                  .replace('{name}', userName)
                  .replace('|', userName ? '|' : '')}
                <span className="text-black">
                  +{formData?.countryCode} {formData?.userId}
                </span>
              </span>
            ) : (
              <span>
                {mfLabels?.userDetailsLabel
                  .replace('{mobile}', '')
                  .replace('{name}', '')
                  .replace('|', '')}
                <span className="text-black">
                  {formData?.userId}
                </span>
              </span>
            )}
          </p>
        </div>
        <div>
          <InputField
            type="password"
            name="oldPassword"
            register={() => {}}
            inputWrapperClass="forgot-pwd__inpt-field"
            placeholder={mfLabels?.oldPasswordPlaceholder}
            showEyeIcon
            onChangeHandler={(event) => onChange('oldPassword', event.target.value)}
            errors={newErrorObj}
          />
          <InputField
            type="password"
            name="password"
            maxLength={16}
            register={() => {}}
            inputWrapperClass="forgot-pwd__inpt-field"
            placeholder={mfLabels?.newPasswordPlaceholder}
            showEyeIcon
            onChangeHandler={(event) => onChange('password', event.target.value)}
            errors={newErrorObj}
          />
          <InputField
            type="password"
            name="confirmPassword"
            maxLength={16}
            register={() => {}}
            inputWrapperClass="forgot-pwd__inpt-field"
            placeholder={mfLabels?.confirmPasswordPlaceholder}
            showEyeIcon
            onChangeHandler={(event) => onChange('confirmPassword', event.target.value)}
            errors={newErrorObj}
          />
        </div>
        <h5 className="mt-5 mb-2 forgot-pwd__must-have text-uppercase">
          {mfLabels?.passwordEligibilityTitle}
        </h5>
        <div className="mb-10">
          {mfLabels?.passwordEligibility?.map((inst) => {
            return (
              <div key={inst?.value} className="forgot-pwd__instructions">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.411 8.35026C11.411 8.675 11.1477 8.93826 10.823 8.93826L5.51003 8.93822C5.18531 8.93822 4.92207 8.67498 4.92206 8.35027C4.92205 8.02553 5.1853 7.76228 5.51003 7.76228L10.823 7.76227C11.1477 7.76227 11.411 8.02552 11.411 8.35026Z"
                    fill="#209326"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.16536 5.1036C8.49008 5.10364 8.7533 5.36691 8.75327 5.69164L8.75275 11.0096C8.75272 11.3343 8.48944 11.5975 8.16469 11.5975C7.83995 11.5975 7.57671 11.3342 7.57675 11.0094L7.57731 5.69152C7.57734 5.36679 7.84062 5.10357 8.16536 5.1036Z"
                    fill="#209326"
                  />
                </svg>
                <span>{inst?.value}</span>
              </div>
            );
          })}
        </div>
        <Button
          type="submit"
          disabled={
            isOtpLoading
            || Object.keys(newErrorObj).length > 0
            || !formData?.password?.length
          }
          loading={isOtpLoading}
          variation={isOtpLoading ? 'LOADING' : ''}
          containerClass="forgot-pwd__confirm-button login-otpverify-verify-button"
          onClick={() => {
            onClickConfirmPassword();
          }}
          aria-label={mfLabels?.setPasswordLabel}
          aria-disabled={
            isOtpLoading
            || Object.keys(newErrorObj).length > 0
            || !formData?.password?.length
          }
        >
          {mfLabels?.setPasswordLabel}
        </Button>
      </PopupModalWithContent>
    );
  };

  const renderSuccessScreen = () => (
    <PopupModalWithContent
      modalTitleDisplay
      className="popup-modal-with-content-login-form forgot-pwd__final-screen"
      hideBannerImage
      hideFooter
      onCloseHandler={onCloseHandler}
      mfLabels={mfLabels}
      activeScreen={activeScreen}
      setActiveScreen={setActiveScreen}
      customPopupContentClassName="login-mf-modal"
    >
      <div className="forgot-pwd--otp-popup-content">
        <h3 className="forgot-pwd__final-screen__title">
          {' '}
          Password <span>Reset</span>
        </h3>
        <p>Your password has been updated successfully.</p>
      </div>
    </PopupModalWithContent>
  );

  const validatePassword = (formData, err) => {
    if (!formData.password) {
      err.password = '';
    } else if (!validators.validPasswordText.test(formData.password)) {
      err.password = mfLabels?.enterValidPasswordLabel;
    }
  };

  const validateConfirmPassword = (formData, err) => {
    if (!formData.confirmPassword) {
      err.confirmPassword = '';
    } else if (formData.confirmPassword !== formData.password) {
      err.confirmPassword = mfLabels?.passwordsDontMatchLabel;
    }
  };

  const validateOldPassword = (formData, err) => {
    if (!formData.oldPassword) {
      err.oldPassword = '';
    }
  };

  const validateUserId = (formData, err) => {
    const updatedFormData = formData;
    if (!formData.userId) {
      err.userId = '*User ID is required';
    } else if (persona === MEMBER) {
      const regex = updatedFormData.countryCode === '+91'
        || Number(updatedFormData.countryCode) === 91
        ? REGEX_LIST.INDIAN_MOBILE_NUMBER
        : REGEX_LIST.EXCEPT_INDIAN_MOBILE_NUMBER;
      if (!regex.test(formData.userId)) {
        err.userId = mfLabels?.mobileValidationText;
      }
    }
  };

  const validateFormData = (updatedFormData) => {
    const err = {};
    if (isConfirmPassword) {
      validatePassword(updatedFormData, err);
      validateConfirmPassword(updatedFormData, err);
      validateOldPassword(updatedFormData, err);
    } else {
      validateUserId(updatedFormData, err);
    }
    setErrorObj(err);
    return err;
  };

  const renderForgotPwdHome = () => {
    const newErrorObj = {};
    for (const key in errorObj) {
      newErrorObj[key] = { message: errorObj[key] };
    }
    switch (true) {
      case showOtp:
        return renderOtpPopup();
      case isSuccessEmailPopup:
        return renderSuccessEmailSend();
      case isConfirmPassword:
        return renderConfirmPassword();
      case isResetSuccess:
        return renderSuccessScreen();
      default:
        // Handle default case if needed
        break;
    }

    return (
      <PopupModalWithContent
        overlayClickClose={false}
        modalTitle={mfLabels?.forgotPasswordTitle}
        hideFooter
        otpScreen
        onCloseHandler={onCloseHandler}
        closeButtonIconClass=""
        className="popup-modal-with-content-login-form forgot-pwd-popup"
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-mf-modal"
      >
        {' '}
        <div className="forgot-pwd">
          <div className="forgot-pwd-container">
            <div className="forgot-pwd-container-inner-title">
              <p> {mfLabels?.forgotPasswordNote}</p>
            </div>
            <div className="forgot-pwd-container-fieldsContainer">
              <VariationBasedComponent
                onChange={onChange}
                variation={persona}
                errorObj={newErrorObj}
                countryCode={formData?.countryCode || 91}
                name="userId"
                required
                placeholder={mfLabels?.userIdPlaceholder}
                value={formData?.userId}
                onEnter={
                  diabledVar
                    ? () => {
                      onClickInitiateOtp();
                    }
                    : () => {}
                }
              />
            </div>
            <Button
              type="submit"
              disabled={isOtpLoading || Object.keys(errorObj).length > 0 || !formData?.userId}
              variation={isOtpLoading ? 'LOADING' : ''}
              loading={isOtpLoading}
              containerClass="login-otpverify-verify-button"
              onClick={() => {
                onClickInitiateOtp();
              }}
              aria-label={mfLabels?.sendOtpLabel}
              aria-disabled={isOtpLoading || Object.keys(errorObj).length > 0 || !formData?.userId}
            >
              {mfLabels?.sendOtpLabel}
            </Button>
          </div>
        </div>
      </PopupModalWithContent>
    );
  };

  const onClickConfirmPassword = async () => {
    // Track password set event
    pushAnalytic({ event: 'Set Password' });
    gtmPushAnalytic({ event: 'Set Password' });

    // Validate form data
    // setIsLiveValidate(true);
    const errors = validateFormData(formData);
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Prepare user data
    let userId = formData?.userId;
    (persona === MEMBER && +sharedData?.countryCode)
      || (91 !== 91
        && (userId = `${
          +sharedData?.countryCode || 91
        }*${+userId}`));

    // Prepare payload for API call
    const payload = {
      credentials: {
        username: userId,
        password: formData?.oldPassword,
        domain: isMember ? 'WW2' : 'WWW',
        location: 'WWW',
        channelType: 'Web',
      },
      newPassword: formData?.password,
      usertype: persona?.toLowerCase() || 'member',
      isEncrypted: false,
      applicationName: 'SkyplusWeb',
    };
    setIsOtpLoading(true);
    const { response } = await changePasswordAPI(payload);
    setIsOtpLoading(false);
    if (response?.data?.token?.token) {
      pushAnalytic({
        state: '',
        event: 'api',
        apiMesg: {
          code: response?.status || '',
          response: response?.data || '',
          responsetime: apiResponseTime || '',
          apiURL: CHANGE_PASSWORD_API,
        },
      });
      setActiveScreen(false);
      // show success
      setToastProps({
        title: 'Success',
        description: 'Password Reset was success',
        variation: 'notifi-variation--Success',
        autoDismissTimeer: 5000,
        onClose: () => {
          onCloseHandler?.();
        },
      });
      // setIsResetSuccess(true); we can use this if we disable toast
    } else if (response?.data?.success === 'true' || response?.data?.success === true) {
      setActiveScreen(false);
      // show success
      setToastProps({
        title: 'Success',
        description: 'Password Reset was success',
        variation: 'notifi-variation--Success',
        autoDismissTimeer: 5000,
        onClose: () => {
          onCloseHandler?.();
        },
      });
      // setIsConfirmPassword(false);
      // setIsResetSuccess(true); we can use this if we disable toast
    } else {
      // Password reset failed
      const error = getErrorFromResponse(response);
      gtmPushAnalytic({
        state: {
          persona,
          error_message: error?.message,
          error_type: error?.type,
          apiURL: CHANGE_PASSWORD_API,
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
          apiURL: CHANGE_PASSWORD_API,
          statusCode: response?.status,
          statusMessage: response?.errors?.message || '',
          displayMessage: error?.message || 'Something went wrong',
        },
      });
      pushAnalytic({
        event: 'UXerror',
        errorMesg: {
          code: response?.status,
          type: 'BE error',
          source: 'MS API',
          apiUrl: CHANGE_PASSWORD_API,
          statusCode: response?.status,
          statusMessage: response?.errors?.message,
          displayMessage: error?.message,
          action: 'Link/ButtonClick',
          component: 'Set Password',
        },
      });
      setToastProps({
        title: 'Error',
        description: error?.message || 'Something went wrong',
        variation: 'notifi-variation--Error',
        autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
    }
  };

  function getErrorFromResponse(response) {
    let error;
    if (Array.isArray(response?.errors)) {
      error = response?.errors[0];
    } else if (response?.error) {
      error = response?.error;
    } else {
      error = response?.errors;
    }
    const errorObj = getErrorMsgForCode(error?.code);
    return {
      type: 'error',
      code: error?.code,
      title: 'Error', // consider changing based on error type
      message: errorObj?.message || 'Something went wrong',
    };
  }

  return renderForgotPwdHome();
}

ForgotPasswordHome.propTypes = {
  onCloseHandler: PropTypes.func,
  setToastProps: PropTypes.func,
  persona: PropTypes.string,
  sharedData: PropTypes.object,
  setSharedData: PropTypes.func,
};

export default ForgotPasswordHome;
