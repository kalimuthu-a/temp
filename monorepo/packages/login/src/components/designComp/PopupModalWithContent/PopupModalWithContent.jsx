/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import pushAnalytic from '../../../functions/analyticEvents';
import gtmPushAnalytic from '../../../functions/gtmAnalyticsEvents';
import { SCREEN_TYPE } from '../../../constants';
import { SME_ADMIN, SME_USER } from '../../../constants/common';

const PopupModalWithContent = ({
  children = null,
  onCloseHandler = () => {},
  overlayClickClose,
  closeButtonIconClass = '',
  className = '',
  modalTitle,
  modalTitleDisplay = true,
  onOutsideClickClose,
  customPopupContentClassName,
  hideHead = false,
  hideFooter = false,
  hideBannerImage = false,
  persona,
  id,
  mfLabels,
  activeScreen,
  setActiveScreen,
  setFormType,
  setAgentLockedDialog,
  agentLockedDialog,
}) => {
  const [isMobile] = useIsMobile();
  const otpScreen = [
    SCREEN_TYPE.FORGOT_OTP,
    SCREEN_TYPE.LOGIN_OTP,
    SCREEN_TYPE.SIGNUP_OTP,
  ].includes(activeScreen);
  const reactComponentAsChildren = children?.type
    ?.toString()
    ?.includes('react');

  useEffect(() => {
    document.body.classList.add('no-scroll-on-popup');
    return () => {
      document.body.classList.remove('no-scroll-on-popup');
    };
  }, []);

  function onContinueAsGuest() {
    pushAnalytic({
      state: '',
      event: 'Continue As A Guest',
    });
    gtmPushAnalytic({
      state: '',
      event: 'Continue As A Guest',
    });
    onCloseHandler();
  }
  function loginWithOtp() {
    pushAnalytic({
      state: '',
      event: 'Login With OTP',
    });
    gtmPushAnalytic({
      state: '',
      event: 'Login With OTP',
    });
    setActiveScreen(SCREEN_TYPE.LOGIN_OTP);
  }
  function loginWithPassword() {
    pushAnalytic({
      state: '',
      event: 'Login With Password',
    });
    gtmPushAnalytic({
      state: '',
      event: 'loginWithPassword',
    });
    setActiveScreen(SCREEN_TYPE.LOGIN_PASSWORD);
  }

  const renderLowerSection = () => {
    if (hideFooter) {
      return null;
    }

    let lowerSectionContent;
    if (otpScreen) {
      lowerSectionContent = (
        <div className="login-form-V2__lower otpScreen login-form-V2__login-screen">
          <div className="login-form-V2__lower-dot" />
          <div className="login-form-V2__lower__row1">{mfLabels?.orLabel}</div>
          <div
            className="login-form-V2__lower__row2 fw-medium"
            dangerouslySetInnerHTML={{
              __html: mfLabels?.loginWithPasswordLabel?.html,
            }}
            onClick={loginWithPassword}
          />
        </div>
      );
    } else if (activeScreen === SCREEN_TYPE.LOGIN_PASSWORD) {
      switch (persona) {
        case SME_ADMIN:
          lowerSectionContent = (
            <div className="login-form-V2__lower login-form-V2__login-screen">
              <div className="login-form-V2__lower-dot" />
              <div className="login-form-V2__lower__row1 d-flex pb-6">
                <div
                  className="ms-2"
                  // onClick={() => setFormType(SME_USER)}
                  dangerouslySetInnerHTML={{
                    __html: mfLabels?.privacyDescription.html,
                  }}
                />
              </div>
            </div>
          );
          break;
        case SME_USER:
          lowerSectionContent = (
            <div className="login-form-V2__lower login-form-V2__login-screen">
              <div className="login-form-V2__lower__row1 d-flex pb-6">
                <div
                  className="ms-2"
                  // onClick={() => setFormType(SME_ADMIN)}
                  dangerouslySetInnerHTML={{
                    __html: mfLabels?.continueAsGuestText?.html,
                  }}
                />
              </div>
            </div>
          );
          break;
        default:
          lowerSectionContent = (
            <div className="login-form-V2__lower otpScreen login-form-V2__login-screen">
              <div className="login-form-V2__lower-dot" />
              <div className="login-form-V2__lower__row1">
                {mfLabels?.orLabel}
              </div>
              <div
                className="login-form-V2__lower__row2"
                dangerouslySetInnerHTML={{
                  __html: mfLabels?.loginWithOtpLabel?.html,
                }}
                onClick={loginWithOtp}
              />
              {agentLockedDialog && (
                <div className="login-error-box mt-md-16">
                  <i className="icon-info text-error icon-size-md" />
                  <div className="login-error-box-main">
                    <p className="body-small-regular text-sm-start">
                      You have entered wrong password 3 times. Please try after
                      sometime or{' '}
                      <span onClick={loginWithOtp}>login with OTP</span>
                    </p>
                    <i
                      className="icon-close-simple  icon-size-md cursor-pointer"
                      onClick={() => setAgentLockedDialog(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
          break;
      }
    } else {
      lowerSectionContent = (
        <div className="login-form-V2__lower login-form-V2__login-screen">
          <div className="login-form-V2__lower-dot" />
          <div className="login-form-V2__lower__row1 d-flex pb-6">
            {mfLabels?.orLabel}{' '}
            <div
              onClick={onContinueAsGuest}
              dangerouslySetInnerHTML={{
                __html: mfLabels?.continueAsGuestText?.html,
              }}
              className="ms-2 text-decoration-underline"
            />
          </div>
          <div
            className="login-form-V2__lower__row2 link-small"
            dangerouslySetInnerHTML={{
              __html: mfLabels?.privacyDescription?.html,
            }}
          />
        </div>
      );
    }

    return lowerSectionContent;
  };

  return (
    <div
      className={`popup-modal-with-content ${className}`}
      onClick={onOutsideClickClose}
    >
      <div
        className="popup-modal-with-content__bg-overlay"
        onClick={overlayClickClose ? onCloseHandler : null}
      >
        <div
          id={id}
          className={`popup-modal-with-content__content ${customPopupContentClassName}`}
        >
          {!hideBannerImage && (
            <div className="login-image-V2">
              {isMobile ? (
                <img
                  src={
                    mfLabels?.bannerImageMobile?._publishUrl
                    || mfLabels?.bannerImage?._publishUrl
                  }
                  alt={mfLabels?.bannerMessage?.html}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = mfLabels?.bannerImage?._publishUrl;
                  }}
                />
              ) : (
                <img
                  src={mfLabels?.bannerImage?._publishUrl}
                  alt={mfLabels?.bannerMessage?.html}
                />
              )}
              {persona != SME_ADMIN && (
                <div
                  className="login-image-V2-p whereliketoIndiGo d-sm-none d-md-block"
                  dangerouslySetInnerHTML={{
                    __html: mfLabels?.bannerMessage?.html,
                  }}
                />
              )}
            </div>
          )}
          <div className="login-form-V2">
            {persona != SME_ADMIN && (
              <div
                className="login-image-V2-p whereliketoIndiGo d-sm-block d-md-none"
                dangerouslySetInnerHTML={{
                  __html: mfLabels?.bannerMessage?.html,
                }}
              />
            )}
            <div className="login-form-V2__upper">
              {!hideHead && (
                <div className="popup-modal-with-content__header">
                  <button
                    aria-label="Close Login Popup"
                    onClick={onCloseHandler}
                    className={`popup-modal-with-content__close-overlay-button ${
                      closeButtonIconClass || ''
                    }`}
                  >
                    <Icon className="icon-close-simple" />
                  </button>
                  <h3
                    className={`popup-modal-with-content__header__title ${
                      modalTitleDisplay ? '' : 'visibility-hidden'
                    }`}
                    dangerouslySetInnerHTML={{ __html: modalTitle }}
                  />
                </div>
              )}
              {reactComponentAsChildren
                ? React.cloneElement(children, { onCloseHandler })
                : children}
            </div>
            {renderLowerSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

PopupModalWithContent.propTypes = {
  onCloseHandler: PropTypes.func,
  overlayClickClose: PropTypes.bool,
  hideHead: PropTypes.bool,
  hideFooter: PropTypes.bool,
  children: PropTypes.any.isRequired,
  closeButtonIconClass: PropTypes.any,
  className: PropTypes.any,
  modalTitle: PropTypes.any,
  modalTitleDisplay: PropTypes.any,
  onOutsideClickClose: PropTypes.any,
  customPopupContentClassName: PropTypes.any,
  hideBannerImage: PropTypes.bool,
  id: PropTypes.any,
  mfLabels: PropTypes.any,
  activeScreen: PropTypes.any,
  setActiveScreen: PropTypes.func,
  setFormType: PropTypes.func,
  persona: PropTypes.any,
  agentLockedDialog: PropTypes.any,
  setAgentLockedDialog: PropTypes.any,
};

PopupModalWithContent.defaultProps = {
  onCloseHandler: () => {},
  overlayClickClose: false,
};

export default PopupModalWithContent;
