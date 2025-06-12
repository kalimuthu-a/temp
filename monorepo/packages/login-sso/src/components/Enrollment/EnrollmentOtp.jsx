/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import OtpInput from 'skyplus-design-system-app/dist/des-system/OtpInput';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import pushAnalytic from '../../functions/analyticEvents';
import COOKIE_KEYS from '../../constants/cookieKeys';
import {
  sendOtpAPI,
  validateOtpApi,
  registerAPI,
} from '../../functions/services';
import { SCREEN_TYPE, CONSTANT, DD_RUM_LOAD_CLICK_PAYLOAD, DD_RUM_EVENTS } from '../../constants';
import { formatDate, loyaltyMemberInfoWithFFN } from '../../functions/utils';
import Cookies from '../../functions/cookies';
import { makePointsUpdateInCookieEvent } from '../../utils/customEvents';
import pushDDRumAction from '../../utils/ddrumEvent';

function EnrollmentOTP({
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  activeScreen,
  setSharedData,
  setToastProps,
  STEPLIST,
  ModalTitle,
  setActiveStep = () => {},
  stepComponent = () => {},
  showMobileOtp,
  showEmailOtp,
}) {
  const [isLoading, setIsloading] = useState(false);
  const [isResendMobileOtp, setIsResendMobileOtp] = useState(false);
  const [isResendEmaileOtp, setIsResendEmailOtp] = useState(false);
  const staticErrorMsg = 'Something went wrong';
  const staticErrorVariationToast = 'notifi-variation--Error';
  const [formData, setFormData] = useState({
    mobileOtpError: '',
    emailOtpError: '',
    otpText: sharedData?.otpText,
    otpEmail: sharedData?.otpEmail,
    phone: sharedData?.phone || '',
    countryCode: parseInt(sharedData?.countryCode, 10) || '',
    email: sharedData?.email || '',
    transactionId: sharedData?.transactionId,
  });

  useEffect(() => {
    if (!formData?.transactionId) {
      const tempId = sharedData?.transactionId || uniq();

      setFormData((prev) => {
        return { ...prev, transactionId: tempId };
      });

      setSharedData((prev) => {
        return { ...prev, transactionId: tempId };
      });
    }
  }, []);
  const [time, setTime] = useState(
    mfLabels?.timeConfig || { minute: 5, seconds: 0 },
  );
  const [time2, setTime2] = useState(
    mfLabels?.timeConfig || { minute: 5, seconds: 0 },
  );

  // Using refs to hold interval IDs for both timers
  const intervalIdRef1 = useRef(null);
  const intervalIdRef2 = useRef(null);

  // Reusable function to manage timer logic
  const startTimer = (setTimeFunc, intervalRef) => {
    const ref = intervalRef;
    ref.current = setInterval(() => {
      setTimeFunc((prevTime) => {
        if (prevTime.seconds === 0 && prevTime.minute === 0) {
          clearInterval(ref.current);
          return { minute: 0, seconds: 0 };
        }
        if (prevTime.seconds === 0) {
          return { minute: prevTime.minute - 1, seconds: 59 };
        }
        return { ...prevTime, seconds: prevTime.seconds - 1 };
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer(setTime, intervalIdRef1);
    return () => clearInterval(intervalIdRef1.current);
  }, []);

  useEffect(() => {
    startTimer(setTime2, intervalIdRef2);
    return () => clearInterval(intervalIdRef2.current);
  }, []);

  const resendOtpAPIHandler = async (payload) => {
    try {
      const { response } = await sendOtpAPI(payload);
      setIsloading(false);
      if (response?.data?.success) {
        return true;
      }
      const err = Array.isArray(response?.errors)
        ? response.errors[0]
        : response?.error || response?.errors;

      const errorObj = getErrorMsgForCode(err?.code);

      setToastProps({
        title: 'Error',
        description: errorObj?.message || staticErrorMsg,
        variation: staticErrorVariationToast,
        onClose: () => {
          setToastProps(null);
        },
      });
      return false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return false;
  };

  const registerAPIHandler = async () => {
    const authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
    let mobileNumber = '';

    if (formData.phone) {
      mobileNumber = `+${formData.countryCode}${formData.phone}`;
    } else if (authUser?.mobileNumber) {
      mobileNumber = `+${authUser.mobileCountryCode}${authUser.mobileNumber}`;
    }
    const payload = {
      firstName: sharedData?.firstName,
      lastName: sharedData?.lastName,
      gender: sharedData?.gender,
      emailId: formData?.email || '',
      mobileNumber,
      dob: sharedData?.date ? formatDate(sharedData?.date, '-') : '',
      ipAddress: '',
      city: '',
      transactionId: formData?.transactionId || sharedData?.transactionId,
    };
    const { response } = await registerAPI(payload);
    return response;
  };

  const onclickResendMobileOtp = async () => {
    setIsloading(true);
    const payload = {
      mobileNumber: `+${formData.countryCode}${formData.phone}`,
      emailId: sharedData?.email || '',
      otpType: 'SMS',
    };
    const otpSent = await resendOtpAPIHandler(payload);
    otpSent && setIsResendMobileOtp(true);
    pushAnalytic({
      state: {
        position: 'phone',
      },
      event: 'Resend OTP',
    });
    let ResendOtpPayload = DD_RUM_LOAD_CLICK_PAYLOAD;
    const ResendOtpAction = DD_RUM_EVENTS?.RESEND_MEMBER_OTP;
    ResendOtpPayload.action = ResendOtpAction;
    ResendOtpPayload.datadogSessionId =
      window.DD_RUM?.getInternalContext()?.session_id;
    ResendOtpPayload.timestamp = new Date().toISOString();
    ResendOtpPayload.metadata = {
      page: 'Migration Page',
      step: 'Resend OTP for Member',
      component: 'EnrollmentOTP',
      application: 'login-sso',
      flowType: 'Migration',
    };    
    pushDDRumAction(ResendOtpAction, ResendOtpPayload);
  };

  const onclickResendEmailOtp = async () => {
    setIsloading(true);
    const payload = {
      emailId: sharedData?.email || '',
      mobileNumber: formData.phone ? `+${formData.countryCode}${formData.phone}` : '',
      otpType: 'Email',
    };
    const otpSent = await resendOtpAPIHandler(payload);
    otpSent && setIsResendEmailOtp(true);
    pushAnalytic({
      state: {
        position: 'email',
      },
      event: 'Resend OTP',
    });
    let ResendEmailOtpPayload = DD_RUM_LOAD_CLICK_PAYLOAD;
    const ResendEmailOtpAction = DD_RUM_EVENTS?.RESEND_EMAIL_MEMBER_OTP;
    ResendEmailOtpPayload.action = ResendEmailOtpAction;
    ResendEmailOtpPayload.datadogSessionId =
      window.DD_RUM?.getInternalContext()?.session_id;
    ResendEmailOtpPayload.timestamp = new Date().toISOString();
    ResendEmailOtpPayload.metadata = {
      page: 'Migration Page',
      step: 'Resend Email OTP for Member',
      component: 'EnrollmentOTP',
      application: 'login-sso',
      flowType: 'Migration',
    };    
    pushDDRumAction(ResendEmailOtpAction, ResendEmailOtpPayload);
  };

  const validateOtphandler = async () => {
    const payload = {
      mobileNumber: formData.phone ? `+${formData.countryCode}${formData.phone}` : '',
      emailId: showEmailOtp ? formData?.email : '',
      mobileOtp: showMobileOtp ? encryptAESForLogin(formData?.otpText) : '',
      emailOtp: showEmailOtp ? encryptAESForLogin(formData?.otpEmail) : '',
      transactionId: formData?.transactionId || sharedData?.transactionId,
    };

    const { response } = await validateOtpApi(payload);
    if (
      // todo might need to correct this condition response?.data?.success
      (showMobileOtp && !showEmailOtp && response?.data?.mobileVerified)
      || (showEmailOtp && !showMobileOtp && response?.data?.emailVerified)
      || (showMobileOtp
        && showEmailOtp
        && response?.data?.mobileVerified
        && response?.data?.emailVerified)
    ) {
      setFormData((prev) => ({
        ...prev,
        mobileOtpError: '',
        emailOtpError: '',
      }));
      return true;
    }
    if (!response?.data?.mobileVerified && !response?.data?.emailVerified) {
      setFormData((prev) => ({
        ...prev,
        mobileOtpError: mfLabels?.incorrectOtpText,
        emailOtpError: mfLabels?.incorrectOtpText,
      }));
    } else if (
      !response?.data?.mobileVerified
      && response?.data?.emailVerified
    ) {
      setFormData((prev) => ({
        ...prev,
        mobileOtpError: mfLabels?.incorrectOtpText,
        emailOtpError: '',
      }));
    } else if (
      !response?.data?.emailVerified
      && response?.data?.mobileVerified
    ) {
      setFormData((prev) => ({
        ...prev,
        mobileOtpError: '',
        emailOtpError: mfLabels?.incorrectOtpText,
      }));
    } else {
      const err = Array.isArray(response?.errors)
        ? response.errors[0]
        : response?.error || response?.errors;

      const errorObj = getErrorMsgForCode(err?.code);

      setToastProps({
        title: 'Error',
        description: errorObj?.message || staticErrorMsg,
        variation: staticErrorVariationToast,
        // autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
    }
    return false;
  };

  function onClickBack() {
    setActiveStep(STEPLIST.FORM);
  }

  async function onClickContinue() {
    pushAnalytic({
      state: '',
      event: 'Verify OTP',
    });
    setIsloading(true);
    const isvalid = await validateOtphandler();
    if (isvalid) {
      if ([SCREEN_TYPE.SIGNUP_6E_USER].includes(activeScreen)) {
        const response = await registerAPIHandler();
        setIsloading(false);

        if (response?.data) {
          let authUser;
          try {
            authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
          } catch (e) {
            authUser = Cookies.get(COOKIE_KEYS.USER);
          }
          try {
            if (response && response?.data) {
              const loyaltyMemberInfo = loyaltyMemberInfoWithFFN(response?.data?.loyaltyMemberInfo);
              setSharedData((prev) => ({
                ...prev,
                loyaltyMemberInfo,
              }));
              authUser.loyaltyMemberInfo = loyaltyMemberInfo;
              if (response?.data?.userDetail) {
                const userDetails = {
                  first: response.data.userDetail?.firstName,
                  last: response.data.userDetail?.lastName,
                  title: response.data.userDetail?.title,
                  gender: response.data.userDetail?.gender,
                };
                authUser.name = userDetails;
              }
              const tokenObj = Cookies.get(COOKIE_KEYS.AUTH, true);
              const cookieExpiredTime = tokenObj?.expiresInMilliSeconds || 15 * 60 * 1000;
              const event = new CustomEvent(CONSTANT.UPDATE_AUTH_USER_COOKIE, {
                bubbles: true,
                detail: { user: authUser, cookieExpiredTime },
              });
              pushAnalytic({
                state: '',
                event: 'Registration Successful',
              });
              document.dispatchEvent(event);
              const SubmitOtpPayload = DD_RUM_LOAD_CLICK_PAYLOAD;
              let SubmitOtpAction =
                DD_RUM_EVENTS?.SUBMIT_OTP_MEMBER;
              SubmitOtpPayload.action = SubmitOtpAction;
              SubmitOtpPayload.datadogSessionId =
                window.DD_RUM?.getInternalContext()?.session_id;
              SubmitOtpPayload.timestamp = new Date().toISOString();
              SubmitOtpPayload.metadata = {
                page: 'Migration Page',
                step: 'Submit OTP for Member',
                component: 'EnrollmentOTP',
                application: 'login-sso',
                flowType: 'Migration',
              };              
              pushDDRumAction(SubmitOtpAction, SubmitOtpPayload);
              setTimeout(() => {
                // used to fetch the pointbalance and tiertype from points summary API
                makePointsUpdateInCookieEvent();
              }, 0);
              setToastProps({
                title: 'Success',
                description:
                  mfLabels?.registerSuccessToast
                  || mfLabels?.signInWithApple
                  || 'Registration Successfull !!',
                variation: 'notifi-variation--Success',
                infoIconClass: 'icon-check',
                onClose: () => {
                  window.location.reload(); // it will reload on click or after timeout expires
                },
              });
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('register error', e);
          }

          if (sharedData?.redirectToBankInEnd) {
            setActiveScreen(SCREEN_TYPE.TIER_DETAIL);
          } else {
            onCloseHandler();
          }
        } else {
          const err = Array.isArray(response?.errors)
            ? response.errors[0]
            : response?.error || response?.errors;

          const errorObj = getErrorMsgForCode(err?.code);

          setToastProps({
            title: 'Error',
            description: errorObj?.message || staticErrorMsg,
            variation: staticErrorVariationToast,
            // autoDismissTimeer: 5000,
            onClose: () => {
              setToastProps(null);
            },
          });
        }
      } else {
        setActiveStep(STEPLIST.PWD);
      }
    }
    setIsloading(false);
  }

  const onChange = (key, value, additionalObj) => {
    const temp = { ...formData, ...additionalObj };
    if (key) {
      temp[key] = value;
    }
    setFormData(temp);
    setSharedData((prev) => {
      return { ...prev, ...temp };
    });
  };
  const isButtonEnabled = () => {
    if (showEmailOtp && !showMobileOtp) {
      return formData?.otpEmail?.length === 6;
    }
    if (!showEmailOtp && showMobileOtp) {
      return formData?.otpText?.length === 6;
    }
    if (showEmailOtp && showMobileOtp) {
      return (
        formData?.otpText?.length === 6 && formData?.otpEmail?.length === 6
      );
    }
    return false;
  };
  const enableButton = !isButtonEnabled();

  return (
    <PopupModalWithContent
      overlayClickClose={false}
      onOutsideClickClose={null}
      onCloseHandler={onCloseHandler}
      className="popup-modal-with-content-login-sso-form"
      modalTitle={ModalTitle}
      mfLabels={mfLabels}
      activeScreen={activeScreen}
      setActiveScreen={setActiveScreen}
      customPopupContentClassName="login-sso-enrollment_modal"
    >
      {stepComponent()}
      {showMobileOtp && (
        <>
          {/* mobile otp div */}
          <p className="login-sso-otpverify__paragraph mt-5 text-secondary">
            {mfLabels?.otpSentNote?.replace('{mobileNumber}', '')}
          </p>
          <div className="login-sso-otpverify__number">
            <p className="body-large-medium text-secondary">
              {`+${formData.countryCode} ${formData.phone}`}
            </p>
          </div>

          <OtpInput
            otpLength={6}
            onChangeHandler={(value) => {
              onChange('otpText', value);
              setFormData((prev) => ({
                ...prev,
                mobileOtpError: '',
              }));
            }}
            containerClass="justify-content-between"
            error={formData?.mobileOtpError}
          />
          <div className="login-sso-otpverify__didnt--recieved">
            <p>{mfLabels?.otpNotRecievedText}</p>
            {!isResendMobileOtp ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                href="#"
                onClick={onclickResendMobileOtp}
                dangerouslySetInnerHTML={{
                  __html: mfLabels?.resendOtpLabel?.html,
                }}
              />
            ) : (
              <div className="login-sso-otpverify__otp-resent">
                <p className="body-small-medium">{mfLabels?.otpResentLabel}</p>
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
                    // eslint-disable-next-line max-len
                    d="M10 2.91663C6.088 2.91663 2.91669 6.08794 2.91669 9.99996C2.91669 13.912 6.088 17.0833 10 17.0833C13.912 17.0833 17.0834 13.912 17.0834 9.99996C17.0834 6.08794 13.912 2.91663 10 2.91663ZM1.66669 9.99996C1.66669 5.39759 5.39765 1.66663 10 1.66663C14.6024 1.66663 18.3334 5.39759 18.3334 9.99996C18.3334 14.6023 14.6024 18.3333 10 18.3333C5.39765 18.3333 1.66669 14.6023 1.66669 9.99996Z"
                    fill="#218946"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    // eslint-disable-next-line max-len
                    d="M13.3548 7.47086C13.601 7.7128 13.6044 8.10852 13.3625 8.35471L9.26763 12.5214C9.15012 12.6409 8.9895 12.7083 8.82186 12.7083C8.65422 12.7083 8.4936 12.6409 8.37609 12.5214L6.22092 10.3284C5.97897 10.0822 5.98241 9.68649 6.2286 9.44454C6.4748 9.2026 6.87051 9.20604 7.11245 9.45223L8.82186 11.1916L12.4709 7.47854C12.7129 7.23235 13.1086 7.22891 13.3548 7.47086Z"
                    fill="#218946"
                  />
                </svg>
              </div>
            )}
          </div>
          <p className="login-sso-otpverify__helper-text">
            {mfLabels?.otpExpiryNote?.replace('{time} min', '')}
            {`${time.minute.toString().padStart(2, '0')}:${time.seconds
              .toString()
              .padStart(2, '0')}`}{' '}
            {mfLabels?.timeUnit || 'sec'}
          </p>
        </>
      )}

      {showEmailOtp && (
        <>
          {/* email otp div */}

          <p className="login-sso-otpverify__paragraph mt-5 text-secondary">
            {mfLabels?.loyaltyInformation?.emailOtpSentNote?.replace(
              '{mail}',
              '',
            ) || 'We have sent you an OTP on'}
          </p>
          <div className="login-sso-otpverify__number">
            <p className="body-large-medium text-secondary">
              {sharedData?.email}
            </p>
          </div>
          <OtpInput
            otpLength={6}
            onChangeHandler={(value) => {
              onChange('otpEmail', value);
              setFormData((prev) => ({
                ...prev,
                emailOtpError: '',
              }));
            }}
            error={formData?.emailOtpError}
            containerClass="justify-content-between"
            // initialTimerObj={otpTimerConfig}
          />
          <div className="login-sso-otpverify__didnt--recieved">
            <p>{mfLabels?.otpNotRecievedText}</p>
            {!isResendEmaileOtp ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                href="#"
                onClick={onclickResendEmailOtp}
                dangerouslySetInnerHTML={{
                  __html: mfLabels?.resendOtpLabel?.html,
                }}
              />
            ) : (
              <div className="login-sso-otpverify__otp-resent">
                <p className="body-small-medium">{mfLabels?.otpResentLabel}</p>
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
                    // eslint-disable-next-line max-len
                    d="M10 2.91663C6.088 2.91663 2.91669 6.08794 2.91669 9.99996C2.91669 13.912 6.088 17.0833 10 17.0833C13.912 17.0833 17.0834 13.912 17.0834 9.99996C17.0834 6.08794 13.912 2.91663 10 2.91663ZM1.66669 9.99996C1.66669 5.39759 5.39765 1.66663 10 1.66663C14.6024 1.66663 18.3334 5.39759 18.3334 9.99996C18.3334 14.6023 14.6024 18.3333 10 18.3333C5.39765 18.3333 1.66669 14.6023 1.66669 9.99996Z"
                    fill="#218946"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    // eslint-disable-next-line max-len
                    d="M13.3548 7.47086C13.601 7.7128 13.6044 8.10852 13.3625 8.35471L9.26763 12.5214C9.15012 12.6409 8.9895 12.7083 8.82186 12.7083C8.65422 12.7083 8.4936 12.6409 8.37609 12.5214L6.22092 10.3284C5.97897 10.0822 5.98241 9.68649 6.2286 9.44454C6.4748 9.2026 6.87051 9.20604 7.11245 9.45223L8.82186 11.1916L12.4709 7.47854C12.7129 7.23235 13.1086 7.22891 13.3548 7.47086Z"
                    fill="#218946"
                  />
                </svg>
              </div>
            )}
          </div>
          <p className="login-sso-otpverify__helper-text">
            {mfLabels?.otpExpiryNote?.replace('{time} min', '')}
            {`${time2.minute.toString().padStart(2, '0')}:${time2.seconds
              .toString()
              .padStart(2, '0')}`}{' '}
            {mfLabels?.timeUnit || 'sec'}
          </p>
        </>
      )}
      <div className="d-flex gap-5 mt-20">
        <Button
          variant="outline"
          color="primary"
          size="large"
          containerClass="w-50"
          onClick={() => onClickBack()}
        >
          {mfLabels?.loyaltyInformation?.enrollBackLabel || 'Back'}
        </Button>
        <Button
          variant="filled"
          color="primary"
          size="large"
          containerClass="w-50"
          onClick={() => onClickContinue()}
          disabled={enableButton}
          aria-disabled={enableButton}
          loading={isLoading}
        >
          {mfLabels?.continueCtaLabel}
        </Button>
      </div>
    </PopupModalWithContent>
  );
}

EnrollmentOTP.propTypes = {
  mfLabels: PropTypes.object.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func.isRequired,
  activeScreen: PropTypes.string.isRequired,
  setSharedData: PropTypes.func.isRequired,
  setToastProps: PropTypes.func.isRequired,
  STEPLIST: PropTypes.any,
  ModalTitle: PropTypes.any,
  setActiveStep: PropTypes.any,
  stepComponent: PropTypes.any,
  showMobileOtp: PropTypes.bool,
  showEmailOtp: PropTypes.bool,
};

export default EnrollmentOTP;
