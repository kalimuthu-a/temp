import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OtpInput from 'skyplus-design-system-app/dist/des-system/OtpInput';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { PopupModalWithContent } from '../../designComp/PopupModalWithContent';
import pushAnalytic from '../../../functions/analyticEvents';
import gtmPushAnalytic from '../../../functions/gtmAnalyticsEvents';
import Constants, { SCREEN_TYPE } from '../../../constants';
import { validateOtpApi } from '../../../functions/services';

function OtpVerifyPopUp({
  onClickSubmit,
  onCloseHandler = () => {},
  errorMsg,
  isLoading,
  phoneNumber,
  mfLabels,
  activeScreen,
  setActiveScreen,
  setSharedData = () => {},
  sharedData,
  persona,
  setIsloading = () => {},
  setToastProps = () => {},
  resendOtp = () => {},
  isResendOtp,
}) {
  const mfData = {
    verifyOtpCtaLabel: 'Submit OTP',
  };
  const [otpNumber, setOtpNumber] = React.useState('');
  const [otpError, setOtpError] = useState('');
  const otpLength = 6;
  const otpTimerConfig = { minute: 10, seconds: 0 };
  const isDisabled = otpLength !== otpNumber.length;
  const otpCompRef = useRef();
  const isMember = persona?.toLowerCase() === Constants.MEMBER.toLowerCase();

  const handleChange = (value) => {
    otpError && setOtpError('');
    setOtpNumber(value);
  };

  const onPopUpCloseHandler = () => {
    setActiveScreen(SCREEN_TYPE.LOGIN_USERID);
  };
  const validateOtp = async (otpNumber) => {
    const payload = {
      MobileNumber:
        isMember
          ? encryptAESForLogin(
            `${
              sharedData?.countryCode || 91
            }*${sharedData?.userId}`,
          )
          : encryptAESForLogin(`${sharedData?.userId}`),
      OtpText: encryptAESForLogin(otpNumber),
    };
    const { response } = await validateOtpApi(payload);
    return response;
  };
  const onClickSendOtp = async () => {
    setSharedData((prev) => {
      return { ...sharedData, otpText: otpNumber };
    });
    let resp;
    if (activeScreen == SCREEN_TYPE.SIGNUP_OTP) {
      pushAnalytic({
        state: { signUpInitiated: 1 },
        event: 'Submit OTP',
      });
      setIsloading(true);
      resp = await validateOtp?.(otpNumber);
      if (resp.isValid) {
        await onClickSubmit?.(otpNumber);
        setIsloading(false);
      } else {
        setOtpError(mfLabels?.incorrectOtpText || '*OTP entered is incorrect! Try again');
        setIsloading(false);
      }
    } else {
      const mesg = await onClickSubmit?.(otpNumber);
      if (mesg) setOtpError(mesg);
    }
  };

  const otpSendProps = {
    label: mfData?.verifyOtpCtaLabel,
    // variation: isLoading ? "LOADING" : "",
    onClick: async () => {
      onClickSendOtp();
    },
    disabled: isDisabled || isLoading,
    loading: isLoading,
    color: 'primary',
    variant: 'filled',
    size: 'large',
    containerClass: 'submit-otp login-otpverify-verify-button',
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
    otpCompRef?.current?.resetTimer();
    if (activeScreen == SCREEN_TYPE.LOGIN_OTP) {
      resendOtp(sharedData, 'resend');
    } else {
      onClickSubmit?.('');
    }
  };

  // Timer logic starts

  const [time, setTime] = useState(otpTimerConfig);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.seconds === 0 && prevTime.minute === 0) {
          clearInterval(intervalId);
          return { minute: 0, seconds: 0 };
        }
        if (prevTime.seconds === 0) {
          return { minute: prevTime.minute - 1, seconds: 59 };
        }
        return { ...prevTime, seconds: prevTime.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  // timer logic ends
  return (
    <PopupModalWithContent
      className="login-otpverify"
      onCloseHandler={onCloseHandler}
      modalTitle="Enter OTP"
      mfLabels={mfLabels}
      activeScreen={activeScreen}
      setActiveScreen={setActiveScreen}
      customPopupContentClassName="login-mf-modal"
    >
      <p className="login-otpverify__paragraph">
        {mfLabels?.otpSentNote?.replace('{mobileNumber}', '')}
      </p>
      <div className="login-otpverify__number text-decoration-none">
        <p className="text-decoration-none">{isMember ? `+${sharedData?.countryCode}` : ''}  {phoneNumber} </p>
        <a className="text-decoration-none" onClick={() => setActiveScreen(isMember ? SCREEN_TYPE.LOGIN_USERID : SCREEN_TYPE.LOGIN_PASSWORD)}>
          <i className="icon-edit" />
        </a>
      </div>
      <OtpInput
        otpLength={otpLength}
        onChangeHandler={handleChange}
        // initialTimerObj={otpTimerConfig}
        ref={otpCompRef}
        error={otpError}
        onEnter={!isDisabled ? onClickSendOtp : () => {}}
      />
      {errorMsg && (
        <p className="login-otpverify__otp-error">
          <i className="icon-information" />
          {errorMsg}
        </p>
      )}

      <Button
        {...otpSendProps}
        aria-disabled={isDisabled || isLoading}
        aria-label={mfData?.verifyOtpCtaLabel}
      >
        {' '}
        {mfData?.verifyOtpCtaLabel}
      </Button>

      <div className="login-otpverify__didnt--recieved">
        <p>{mfLabels?.otpNotRecievedText}</p>
        {!isResendOtp ? (
          <a
            data-href="#"
            onClick={onClickResendOtp}
            dangerouslySetInnerHTML={{ __html: mfLabels?.resendOtpLabel?.html }}
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
      <p className="login-otpverify__helper-text">
        {mfLabels?.otpExpiryNote?.replace('{time} min', '')}
        {`${time.minute.toString().padStart(2, '0')}:${time.seconds
          .toString()
          .padStart(2, '0')}`}{' '}
        sec
      </p>
    </PopupModalWithContent>
  );
}
OtpVerifyPopUp.propTypes = {
  onClickSubmit: PropTypes.func,
  errorMsg: PropTypes.string,
  isLoading: PropTypes.bool,
  phoneNumber: PropTypes.any,
  mfLabels: PropTypes.any,
  activeScreen: PropTypes.any,
  setActiveScreen: PropTypes.any,
  setSharedData: PropTypes.func,
  setIsloading: PropTypes.func,
  sharedData: PropTypes.any,
  persona: PropTypes.any,
  setToastProps: PropTypes.any,
  resendOtp: PropTypes.func,
  isResendOtp: PropTypes.bool,
  onCloseHandler: PropTypes.func,
};

export default OtpVerifyPopUp;
