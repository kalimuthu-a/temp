/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// above are disable for acting anchor as button

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OtpInput from 'skyplus-design-system-app/dist/des-system/OtpInput';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import pushAnalytic from '../../functions/analyticEvents';
import { SCREEN_TYPE } from '../../constants';
import { sendOtpAPI, checkUserAPI } from '../../functions/services';
import './OtpVerifyScreen.scss';
import { formatDate } from '../../functions/utils';

function OtpVerifyScreen({
  onCloseHandler = () => {},
  mfLabels,
  activeScreen,
  setActiveScreen,
  setSharedData = () => {},
  sharedData,
  setToastProps = () => {},
}) {
  const [otpNumber, setOtpNumber] = React.useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsloading] = useState('');
  const [isResendOtp, setIsResendOtp] = useState(false);
  const otpLength = 6;
  const otpTimerConfig = mfLabels?.timeConfig || { minute: 5, seconds: 0 };
  const isDisabled = otpLength !== otpNumber.length;
  const otpCompRef = useRef();
  const isMobileOTP = sharedData?.isMobileEntered;
  const [formdata] = useState({
    phone: `+${sharedData.countryCode}${sharedData.phone}`,
    email: sharedData?.email || '',
  });
  const handleChange = (value) => {
    if (otpError) {
      setOtpError('');
    }
    setOtpNumber(value);
  };

  const checkUserHandler = async () => {
    const transactionId = sharedData?.transactionId || uniq();
    setSharedData((prev) => {
      return { ...prev, transactionId };
    });
    const payload = {
      mobileNumber: isMobileOTP ? formdata?.phone : '',
      emailId: !isMobileOTP ? formdata?.email : '',
      ffNumber: '',
      mobileOtp: isMobileOTP ? encryptAESForLogin(otpNumber) : '',
      emailOtp: !isMobileOTP ? encryptAESForLogin(otpNumber) : '',
      transactionId,
    };
    const { response } = await checkUserAPI(payload);
    return response;
  };
  const verifyProps = {
    label: mfLabels?.loyaltyInformation?.verifyOtp,
    onClick: async () => {
      setIsloading(true);
      const response = await checkUserHandler?.();
      if (response?.data) {
        const person = response?.data?.userDetails || {};
        const { isActivated, isMigrated, isCoBrandMember, isLoyaltyMember } = response.data;
        const isEditable = isLoyaltyMember && !isActivated && isMigrated && !isCoBrandMember;
        if (Object.keys(person).length > 0) {
          setSharedData((prev) => {
            return {
              ...prev,
              firstName: person?.firstName || '',
              lastName: person?.lastName || '',
              email: person?.emailId || '',
              ffNumber: person.ffNumber || '',
              countryCode: `${
                person?.countryCode
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
              isDOBEditable: isEditable,
              isGenderEditable: isEditable,
            };
          });

          setActiveScreen(sharedData?.flow);
          setIsloading(false);
        } else {
          setOtpError(
            mfLabels?.loyaltyInformation?.incorrectMobileOtpText
              || '*OTP entered is incorrect! Try agains',
          );
          setIsloading(false);
          setSharedData((prev) => {
            return {
              ...prev,
              isLoyaltyMember: response?.data?.isLoyaltyMember,
              checkUserApiResponse: response?.data,
            };
          });
        }
      } else {
        const err = Array.isArray(response?.errors)
          ? response?.errors[0]
          : response?.error || response?.errors;

        const errorObj = getErrorMsgForCode(err?.code);

        setToastProps({
          title: 'Error',
          description: errorObj?.message || 'Something went wrong',
          variation: 'notifi-variation--Error',
          onClose: () => {
            setToastProps(null);
          },
        });
        setIsloading(false);
      }
    },
    disabled: isDisabled || isLoading,
    loading: isLoading,
    color: 'primary',
    variant: 'filled',
    size: 'large',
    containerClass: 'submit-otp login-sso-otpverify-verify-button',
  };

  const onClickResendOtp = async () => {
    const buttonType = isMobileOTP ? 'phone' : 'email';
    pushAnalytic({
      state: {
        position: buttonType,
      },
      event: 'Resend OTP',
    });
    setIsloading(true);

    const payload = {
      mobileNumber: isMobileOTP ? formdata?.phone : '',
      emailId: formdata?.email || '',
      otpType: isMobileOTP ? 'SMS' : 'Email',
    };
    const { response } = await sendOtpAPI(payload);
    if (response?.data?.success) {
      setIsResendOtp(true);
    }
    setIsloading(false);
  };

  // Timer logic starts

  const [time, setTime] = useState(otpTimerConfig);
  const intervalIdRef = useRef(null);
  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.seconds === 0 && prevTime.minute === 0) {
          clearInterval(intervalIdRef.current);
          return { minute: 0, seconds: 0 };
        }
        if (prevTime.seconds === 0) {
          return { minute: prevTime.minute - 1, seconds: 59 };
        }
        return { ...prevTime, seconds: prevTime.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, []);
  // timer logic ends
  return (
    <div>
      <PopupModalWithContent
        className="login-sso-otpverify"
        onCloseHandler={onCloseHandler}
        modalTitle={mfLabels?.enterOtpLabel}
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-sso-mf-modal"
      >
        <p className="login-sso-otpverify__paragraph">
          {mfLabels?.otpSentNote?.replace('{mobileNumber}', '')}
        </p>
        <div className="login-sso-otpverify__number">
          <p className="body-medium-regular">
            {isMobileOTP ? formdata?.phone : formdata?.email}
          </p>
          <a onClick={() => setActiveScreen(SCREEN_TYPE.LANDING_PAGE)}>
            <i className="icon-edit" />
          </a>
        </div>
        <OtpInput
          otpLength={otpLength}
          onChangeHandler={handleChange}
          // initialTimerObj={otpTimerConfig}
          ref={otpCompRef}
          error={otpError}
        />

        <Button
          {...verifyProps}
          aria-disabled={isDisabled || isLoading}
          aria-label={mfLabels?.loyaltyInformation?.verifyOtp}
        >
          {mfLabels?.loyaltyInformation?.verifyOtp || 'verify OTP'}
        </Button>

        <div className="login-sso-otpverify__didnt--recieved mt-10">
          <p>{mfLabels?.otpNotRecievedText}</p>
          {!isResendOtp ? (
            <a
              href="#"
              onClick={onClickResendOtp}
              dangerouslySetInnerHTML={{
                __html: mfLabels?.resendOtpLabel?.html,
              }}
            />
          ) : (
            <div className="login-sso-otpverify__otp-resent">
              <p className="body-small-medium">{mfLabels?.otpResentLabel || 'OTP resent'}</p>
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
        <p className="login-sso-otpverify__helper-text body-medium-light">
          {mfLabels?.otpExpiryNote?.replace('{time} min', '')}
          {`${time.minute.toString().padStart(2, '0')}:${time.seconds
            .toString()
            .padStart(2, '0')}`}{' '}
          {mfLabels?.timeUnit || 'sec'}
        </p>
      </PopupModalWithContent>
    </div>
  );
}
OtpVerifyScreen.propTypes = {
  persona: PropTypes.string.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  mfLabels: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func,
  activeScreen: PropTypes.string.isRequired,
  sharedData: PropTypes.object.isRequired,
  setSharedData: PropTypes.func.isRequired,
  setToastProps: PropTypes.func.isRequired,
};
export default OtpVerifyScreen;
