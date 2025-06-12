import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import OtpInput from 'skyplus-design-system-app/dist/des-system/OtpInput';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

const EnterOTP = ({
  onChangeHandler,
  onClickResent,
  onClickVerifyOtp,
  variation,
  onClickClose,
  otpError,
  setOtpError,
  loading,
}) => {
  const [otpNumber, setOtpNumber] = useState(''); // NOSONAR
  const otpLength = 6;
  const otpTimerConfig = { minute: 5, seconds: 0 };
  /* eslint-disable no-unused-vars */
  const isDisabled = otpLength !== otpNumber.length; // NOSONAR
  const otpCompRef = useRef();

  const { bookingDetails, contacts } = useSelector((state) => state.itinerary?.apiData) || {};
  const pnr = bookingDetails?.recordLocator || '';

  const { otpDetails } = useSelector(
    (state) => state?.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  const { verifyOtp, otpErrorMessage, resendLabel,
    otpSubtext, otpMessage, otpTitle } = otpDetails || {};
  const { emailAddress, homePhone } = contacts?.[0] || '';
  const [isMobile] = useIsMobile();
  const [resentOtpCall, setResentOtpCall] = useState(false);
  const handleChange = (value) => {
    onChangeHandler(value);
    setOtpNumber(value);
    if (otpError !== '') {
      setOtpError('');
    }
  };
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderResentOtp = (min, sec) => {
    const timeText = `${min}:${sec}`;
    const totalLeftSec = min * 60 + sec;
    if (resentOtpCall && totalLeftSec === 0) {
      setResentOtpCall(false);
    }
    const resentOtps = 'OTP resent';
    return (
      <div key={uniq}>
        {(otpError && otpError !== '')
          ? <div className="enter-otp-container-otp-error">{otpError}</div>
          : null}
        {!isMobile
          ? (
            <>
              <Button
                size="large"
                containerClass={`verify-cta ${isDisabled ? 'verify-cta-disabled' : ''}`}
                onClick={onClickVerifyOtp}
              >
                {loading ? 'Loading...' : verifyOtp}
              </Button>
              <div className="d-flex justify-content-between align-center">
                <div className="body-large-medium text-primary">
                  {otpErrorMessage}
                </div>
                {resentOtpCall ? (
                  <div className="enter-otp-container-resent-block">
                    <p className="body-small-medium">{resentOtps}</p>
                    <span className="icon-check text-forest-green" />
                  </div>
                )
                  : (
                    <div
                      aria-hidden="true"
                      className="h0 text-decoration-underline text-capitalize text-primary-main"
                      onClick={() => {
                        onClickResent();
                        setResentOtpCall(true);
                        otpCompRef?.current?.resetTimer(otpTimerConfig);
                      }}
                    >
                      {resendLabel}
                    </div>
                  )}
              </div>

              <div
                className="body-medium-light text-tertiary"
                dangerouslySetInnerHTML={{
                  __html: otpSubtext?.html.replace('{time}', timeText),
                }}
              />
            </>
          )
          : (
            <>
              <div className="d-flex justify-content-between align-center">
                <div className="body-large-medium text-primary">
                  {otpErrorMessage}
                </div>
                {resentOtpCall ? (
                  <div className="enter-otp-container-resent-block">
                    <p className="body-small-medium">{resentOtps}</p>
                    <span className="icon icon-check" />
                  </div>
                )
                  : (
                    <div
                      aria-hidden="true"
                      className="h0 text-decoration-underline text-capitalize text-primary-main"
                      onClick={onClickResent}
                    >
                      {resendLabel}
                    </div>
                  )}
              </div>

              <div
                className="body-medium-light text-tertiary"
                dangerouslySetInnerHTML={{
                  __html: otpSubtext?.html.replace('{time}', timeText),
                }}
              />
              <Button
                size="large"
                containerClass={`verify-cta ${isDisabled ? 'verify-cta-disabled' : ''}`}
                onClick={onClickVerifyOtp}
              >
                {loading ? 'Loading...' : verifyOtp}
              </Button>
            </>
          )}

      </div>
    );
  };

  const defaultRender = () => {
    return (
      <div className="enter-otp-container" key={uniq}>
        <div className="enter-otp-container-main">
          <div className="h3 enter-otp-container-title">{otpTitle}</div>
          <div onClick={onClickClose} aria-hidden="true">
            <span className="icon-close-simple" />
          </div>
        </div>

        <div
          className="mb-12 sh6 enter-otp-container-subtitle"
          dangerouslySetInnerHTML={{
            __html: otpMessage?.html.replace('{mobileNumber}', homePhone)
              .replace('{email}', emailAddress).replace('{pnr}', pnr),
          }}
        />
        <OtpInput
          otpLength={otpLength}
          onChangeHandler={handleChange}
          renderResentOtp={renderResentOtp}
          initialTimerObj={otpTimerConfig}
          ref={otpCompRef}
          variation={(otpError && otpError !== '') ? 'INPUT_TEXT_FIELD_ERROR' : 'DEFAULT'}
          containerClass={otpError && otpError !== '' ? 'form-error' : ''}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (variation === 'model') {
      return (
        <ModalComponent
          modalContent={() => defaultRender()}
          variation="dropdown"
          modalWrapperClass="itinerary-modify-otp-popup"
          modalContentClass="itinerary-modify-otp-popup-content"
          showCrossIcon={!!isMobile}
          onCloseHandler={() => onClickClose()}
        />
      );
    }
    defaultRender();
    return null;
  };

  return renderContent();
};

EnterOTP.propTypes = {
  onChangeHandler: PropTypes.func,
  onClickResent: PropTypes.func,
  onClickVerifyOtp: PropTypes.func,
  variation: PropTypes.string,
  onClickClose: PropTypes.func,
  mobileNumber: PropTypes.string,
  email: PropTypes.string,

};

export default EnterOTP;
