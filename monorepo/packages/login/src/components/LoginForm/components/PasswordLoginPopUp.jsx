import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import sanitizeHtml from 'skyplus-design-system-app/src/functions/sanitizeHtml';
import { PopupModalWithContent } from '../../designComp/PopupModalWithContent';
import pushAnalytic from '../../../functions/analyticEvents';
import gtmPushAnalytic from '../../../functions/gtmAnalyticsEvents';
import { SCREEN_TYPE } from '../../../constants';
import { AGENT, SME_ADMIN, SME_USER } from '../../../constants/common';

function PasswordLoginPopUp({
  onClickSubmit,
  onCloseHandler,
  onChange,
  mfLabels,
  isMember,
  persona,
  isLoading,
  activeScreen,
  setActiveScreen,
  setFormType,
  formData,
  customErrorMsg,
  setAgentLockedDialog,
  agentLockedDialog,
}) {
  const otpSendProps = {
    label: 'Submit OTP',
    // variation: isLoading ? "LOADING" : "",
    onClick: async () => {
      onClickSubmit?.({});
    },
    loading: isLoading,
    disabled:
      SME_USER
        ? (!((formData?.userId?.length && formData?.password?.length)))
        : (!formData?.password?.length),
    color: 'primary',
    variant: 'filled',
    size: 'large',
    containerClass:
      'submit-otp login-password_button login-otpverify-verify-button',
  };

  function forgotPasswordHandler() {
    pushAnalytic({
      state: '',
      event: 'Forgot Password',
    });
    gtmPushAnalytic({
      state: '',
      event: 'Forgot Password',
    });

    setActiveScreen(SCREEN_TYPE.FORGOT_USERID);
  }

  function popupHeading() {
    if (isMember) {
      return mfLabels?.enterPasswordLabel;
    }
    return mfLabels?.loginTitle?.html;
  }

  function buttonText() {
    if (isMember) {
      return mfLabels?.loginLabel;
    }
    return mfLabels?.loginTitle?.html;
  }

  function renderlink() {
    switch (persona) {
      case SME_ADMIN:
        return (
          <div
            className="d-flex login-form-V2__lower__row1 login-form-V2__lower__sme-admin mt-10"
            dangerouslySetInnerHTML={{
              __html: mfLabels?.continueAsGuestText?.html,
            }}
          />
        );
      case AGENT:
        return (
          <div
            className="d-flex login-form-V2__lower__row1 mt-10 text-primary-main"
            dangerouslySetInnerHTML={{
              __html: mfLabels?.continueAsGuestText?.html,
            }}
          />
        );
      default:
        return null;
    }
  }

  const sanitizeSpecialCharInput = (event) => {
    const input = event.target;
    const { value } = input;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '');
    if (value !== sanitizedValue) {
      input.value = sanitizedValue;
    }
    return input;
  };

  return (
    <PopupModalWithContent
      className="login-otpverify login-password"
      onCloseHandler={onCloseHandler}
      modalTitle={popupHeading()}
      otpScreen={false}
      isLoginWithPassword
      mfLabels={mfLabels}
      persona={persona}
      activeScreen={activeScreen}
      setActiveScreen={setActiveScreen}
      hideFooter={persona === AGENT}
      setFormType={setFormType}
      setAgentLockedDialog={setAgentLockedDialog}
      agentLockedDialog={agentLockedDialog}
      customPopupContentClassName="login-mf-modal"
      closeButtonIconClass={isMember ? '' : 'invisible'}
    >
      {!isMember && (
        <InputField
          type="text"
          name="userId"
          onInputHandler={sanitizeSpecialCharInput}
          register={() => {}}
          inputWrapperClass="forgot-pwd__inpt-field"
          placeholder="Enter User Id"
          onChangeHandler={(event) => onChange('userId', event.target.value)}
          errors={{}}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onClickSubmit?.({});
            }
          }}
        />
      )}

      <InputField
        customErrorMsg={customErrorMsg}
        type="password"
        placeholder={mfLabels?.enterPasswordLabel}
        showEyeIcon
        maxLength={16}
        inputWrapperClass="login-password__inputfield"
        onChangeHandler={(event) => onChange('password', event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onClickSubmit?.({});
          }
        }}
      />
      <div className="login-password__link">
        {isMember ? (
          <a
            className="text-decoration-underline"
            data-href="#"
            onClick={forgotPasswordHandler}
          >
            {mfLabels?.forgotPasswordTitle}
          </a>
        ) : (
          <span
            className="text-decoration-underline d-inline-block"
            onClick={forgotPasswordHandler}
            dangerouslySetInnerHTML={{
              __html: mfLabels?.forgotPasswordLabel.html,
            }}
          />
        )}
      </div>
      <Button
        {...otpSendProps}
        aria-disabled={SME_USER
          ? (!((formData?.userId?.length && formData?.password?.length)))
          : (!formData?.password?.length)}
        aria-label={mfLabels?.loginLabel || 'Login'}
      >
        {mfLabels?.loginLabel || 'Login'}{' '}
      </Button>
      {renderlink()}
    </PopupModalWithContent>
  );
}
PasswordLoginPopUp.propTypes = {
  onClickSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  onCloseHandler: PropTypes.func,
  onChange: PropTypes.func,
  mfLabels: PropTypes.any,
  activeScreen: PropTypes.any,
  setActiveScreen: PropTypes.func,
  isMember: PropTypes.bool,
  setFormType: PropTypes.func,
  persona: PropTypes.any,
  formData: PropTypes.any,
  customErrorMsg: PropTypes.any,
  agentLockedDialog: PropTypes.any,
  setAgentLockedDialog: PropTypes.any,
};

export default PasswordLoginPopUp;
