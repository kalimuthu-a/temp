/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import { MEMBER } from '../../constants/common';
import { REGEX_LIST, SCREEN_TYPE } from '../../constants';
import './LoginWithCredentials.scss';

function LoginWithCredentials({
  persona = '',
  onCloseHandler = () => {},
  mfLabels,
  setActiveScreen,
  activeScreen,
  setSharedData,
  sharedData,
  customErrorMsg,
  onClickSubmit,
  formData,
}) {
  const isMember = persona?.toLowerCase() === MEMBER?.toLowerCase();
  const [value, setValue] = useState(sharedData.userId || '');
  const [errorObj, setErrorObj] = useState({});
  const isLoading = false;
  const [password, setPassword] = useState(formData?.password || '');

  useEffect(() => {
    setValue(sharedData.userId || '');
    setPassword(formData?.password || '');
  }, [sharedData.userId, formData?.password]);

  const validateInput = (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = REGEX_LIST.EXCEPT_INDIAN_MOBILE_NUMBER;
    const indianMobilePattern = REGEX_LIST.INDIAN_MOBILE_NUMBER;
    const ffPattern = /^\d{7,10}$/;

    const errors = {};

    if (
      !emailPattern.test(input)
      && !mobilePattern.test(input)
      && !ffPattern.test(input)
      && !indianMobilePattern.test(input)
    ) {
      errors.userId = '*Please enter a valid Email ID or phone number';
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setValue(input);
    const error = validateInput(input);
    setErrorObj(error);
    setSharedData((prev) => ({ ...prev, userId: input }));
  };

  const handlePasswordChange = (e) => {
    const input = e.target.value;
    setPassword(input);
    setSharedData((prev) => ({ ...prev, password: input }));
  };

  const isButtonDisabled = () => {
    const hasErrors = Object.keys(errorObj).length > 0;
    const hasPassword = password.length > 0;
    return hasErrors || !hasPassword;
  };

  const loginProps = {
    label: 'Login',
    onClick: async () => {
      onClickSubmit?.({});
    },
    loading: isLoading,
    disabled: isButtonDisabled(),
    color: 'primary',
    variant: 'filled',
    size: 'large',
    containerClass:
      'submit-otp login-sso-password_button login-sso-otpverify-verify-button',
  };

  return (
    <div>
      <PopupModalWithContent
        overlayClickClose
        onOutsideClickClose={null}
        className={`popup-modal-with-content-login-sso-form ${persona}`}
        mfLabels={mfLabels}
        modalTitle={mfLabels?.loginTitle?.html}
        activeScreen={activeScreen}
        setActiveScreen={() => {}}
        customPopupContentClassName="login-sso-mf-modal"
        closeButtonIconClass={isMember ? '' : 'invisible'}
        onCloseHandler={onCloseHandler}
      >
        <form
          className="login-with-mobile"
          onSubmit={(e) => e.preventDefault()}
        >
          <InputField
            type="text"
            name="userMobile"
            inputWrapperClass="forgot-pwd__inpt-field"
            value={value}
            onChange={handleInputChange}
            maxLength={15} // Set a general maxLength
          />
          <InputField
            customErrorMsg={customErrorMsg}
            type="password"
            placeholder={mfLabels?.enterPasswordLabel}
            showEyeIcon
            inputWrapperClass="login-sso-password__inputfield"
            value={password}
            onChangeHandler={handlePasswordChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onClickSubmit?.({});
              }
            }}
          />
          <div className="login-sso-password__link">
            {isMember ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a className="text-decoration-underline" href="#">
                {mfLabels?.forgotPasswordTitle}
              </a>
            ) : (
              <span
                className="text-decoration-underline"
                dangerouslySetInnerHTML={{
                  __html: mfLabels?.forgotPasswordLabel?.html,
                }}
              />
            )}
          </div>
          <Button
            {...loginProps}
            aria-disabled={isButtonDisabled()}
            aria-label={mfLabels?.loginLabel || 'login-sso'}
          >
            {mfLabels?.loginLabel || 'login-sso'}
          </Button>
          <div className="login-sso-form-V2__lower otpScreen login-sso-form-V2__login-screen">
            <div className="login-sso-form-V2__lower-dot" />
            <div className="login-sso-form-V2__lower__row1">
              {mfLabels?.orLabel}
            </div>
            <div
              className="login-sso-form-V2__lower__row2"
              dangerouslySetInnerHTML={{
                __html: mfLabels?.loginWithOtpLabel?.html,
              }}
              onClick={() => {
                setActiveScreen(SCREEN_TYPE.OTP_VERIFY_PAGE);
              }}
            />
          </div>
        </form>
      </PopupModalWithContent>
    </div>
  );
}

LoginWithCredentials.propTypes = {
  persona: PropTypes.string.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  mfLabels: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func.isRequired,
  activeScreen: PropTypes.string.isRequired,
  setSharedData: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
  customErrorMsg: PropTypes.string,
  onChange: PropTypes.func,
  onClickSubmit: PropTypes.func,
  formData: PropTypes.object,
};

export default LoginWithCredentials;
