import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import pushAnalytic from '../../functions/analyticEvents';
import gtmPushAnalytic from '../../functions/gtmAnalyticsEvents';
import { REGEX_LIST } from '../../constants';

function CreatePassword({
  mfLabels,
  onCloseHandler = () => {},
  onClickSubmitFromSetPassword,
  activeScreen,
  setActiveScreen,
  isLoading,
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setIsConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    if (
      confirmPassword === password
      && REGEX_LIST.PASSWORD.test(confirmPassword)
    ) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [confirmPassword, password]);
  function onClicksetPassword() {
    gtmPushAnalytic({
      state: '',
      event: 'Set Password',
    });
    onClickSubmitFromSetPassword?.(password);
  }
  return (
    <div className="signup_createPassword">
      <PopupModalWithContent
        overlayClickClose={false}
        onOutsideClickClose={null}
        onCloseHandler={onCloseHandler}
        className="popup-modal-with-content-login-form signup_createPassword_popup"
        hideFooter
        modalTitle="Create Password"
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-mf-modal"
      >
        <div className="signup_createPassword_inputField">
          <InputField
            type="password"
            name="NewPassword"
            maxLength={16}
            register={() => {}}
            onChangeHandler={(e) => {
              setPassword(e.target.value);
            }}
            inputWrapperClass="forgot-pwd__inpt-field"
            placeholder={mfLabels?.newPasswordPlaceholder}
            showEyeIcon
          />
          <InputField
            type="password"
            name="ConfirmNewPassword"
            maxLength={16}
            register={() => {}}
            onChangeHandler={(e) => {
              setIsConfirmPassword(e.target.value);
            }}
            inputWrapperClass="forgot-pwd__inpt-field"
            placeholder={mfLabels?.confirmPasswordPlaceholder}
            showEyeIcon
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
                <span className="body-small-regular">{inst?.value}</span>
              </div>
            );
          })}
        </div>
        <Button
          type="submit"
          onClick={isPasswordValid ? onClicksetPassword : () => {}}
          disabled={!isPasswordValid}
          containerClass="forgot-pwd__confirm-button"
          aria-label={mfLabels?.setPasswordLabel}
          loading={isLoading}
          aria-disabled={!isPasswordValid}
        >
          {mfLabels?.setPasswordLabel}
        </Button>
      </PopupModalWithContent>
    </div>
  );
}
CreatePassword.propTypes = {
  mfLabels: PropTypes.any,
  onCloseHandler: PropTypes.func,
  onClickSubmitFromSetPassword: PropTypes.func,
  activeScreen: PropTypes.any,
  setActiveScreen: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default CreatePassword;
