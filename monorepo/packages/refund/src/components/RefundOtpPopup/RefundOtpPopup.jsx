import React, { useState, useRef, useEffect } from 'react';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import OtpInput from 'skyplus-design-system-app/dist/des-system/OtpInput';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { getInitiateRefundOtp, validateRefundPnr } from '../../services';
import { useCustomEventDispatcher } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import { CUSTOM_EVENTS } from '../../constants';

const RefundOtpPopup = ({ aemData, setIsOpenOtpPopup, setIsOtpSubmitted, setPassengerDetails }) => {
  let otpExpiryMin = aemData?.otpExpireMinutes;
  let otpExpirySec = aemData?.otpExpireSeconds;
  const otpTimerConfig = { minute: otpExpiryMin, seconds: otpExpirySec };

  const [otpNumber, setOtpNumber] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isResendOtp, setIsResendOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(otpTimerConfig);
  const dispatchCustomEvent = useCustomEventDispatcher();

  const otpLength = aemData?.otpLength;
  const isDisabled = otpLength !== otpNumber.length;
  const [isMobile] = useIsMobile();
  const otpCompRef = useRef();
  const otpExpiryTimer = () => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.seconds === 0 && prevTime.minute === 0) {
          clearInterval(intervalId);
          setIsResendOtp(false)
          return { minute: 0, seconds: 0 };
        }
        if (prevTime.seconds === 0) {
          return { minute: prevTime.minute - 1, seconds: 59 };
        }
        return { ...prevTime, seconds: prevTime.seconds - 1 };
      });
    }, 1000);
  }

  useEffect(() => {
    otpExpiryTimer();
  }, []);

  const onCloseHandler = () => {
    setIsOpenOtpPopup(false);
  };

  const handleChange = (value) => {
    otpError && setOtpError('');
    setOtpNumber(value);
  };

  const onClickResendOtp = async () => {
    await getInitiateRefundOtp();
    setTime(otpTimerConfig);
    otpExpiryTimer
    setIsResendOtp(true);
  };

  const handleSubmitOtp = async () => {
    setIsLoading((prev) => !prev);
    const response = await validateRefundPnr(otpNumber);
    if (response?.isSuccess) {
      setIsOtpSubmitted(true);
      setIsOpenOtpPopup(false);
      dispatchCustomEvent(CUSTOM_EVENTS.HANDLE_SHOW_REFUND_CLAIM_FORM, {
        isRefundClaimFormShow: false,
      });
    }else{
      setOtpError(aemData?.errorMessages?.IncorrectOTP)
    }
    setPassengerDetails(response);
    setIsLoading((prev) => !prev);
  };

  const renderPopover = () => {
    return (
      <div className={`${isMobile ? 'refund-mob-otp-wrapper' : ''}`}>
        {isMobile && <h3 className="otp-heading">{aemData?.otpLabel}</h3>}
        <p>{aemData?.otpSentNote}</p>
        <OtpInput
          otpLength={4}
          onChangeHandler={handleChange}
          containerClass="refund-otp"
          ref={otpCompRef}
          error={otpError}
        />
        <Button containerClass={`refund-otp-btn ${otpError ? 'mt-24' : ''}`} disabled={isDisabled} onClick={handleSubmitOtp} loading={isLoading}>
          {aemData?.retrievePnrLabel}
        </Button>
        <div className="refund-otp__didnt--recieved">
          <p>{aemData?.resendOtpText}</p>
          {!isResendOtp ? (
            <a
              data-href="#"
              onClick={onClickResendOtp}
              dangerouslySetInnerHTML={{ __html: aemData?.resendLabel?.html }}
            />
          ) : (
            <div className="login-otpverify__otp-resent">
              <span className="body-small-medium">{aemData?.otpResentLabel}</span>
              <Icon className='icon-tick-outlined' size='md'/>
            </div>
          )}
        </div>
        <p className="refund-otp__helper-text">
          {aemData?.otpExpireNote?.replace('{TimeStamp}', `${time?.minute?.toString().padStart(2, '0')}:${time?.seconds
            ?.toString()
            .padStart(2, '0')}`)}
        </p>
      </div>
    );
  };

  return (
    !isMobile ? (
      <PopupModalWithContent
        className="refund-otpverify"
        onCloseHandler={onCloseHandler}
        modalTitle={aemData?.otpLabel}
        customPopupContentClassName="refund-mf-modal"
      >
        {renderPopover()}
      </PopupModalWithContent>
    )
      : (
        <div className="refund-popover__content">
          <div className="pop-over-header-mobile" onClick={onCloseHandler}>
            <div className="icon-circle">
              <Icon className="icon-close-simple" size="lg" />
            </div>
          </div>
          {renderPopover()}
        </div>
      )
  );
};

export default RefundOtpPopup;