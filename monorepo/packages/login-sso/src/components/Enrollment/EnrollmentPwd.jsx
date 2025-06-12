import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import pushAnalytic from '../../functions/analyticEvents';
import { REGEX_LIST, SCREEN_TYPE } from '../../constants';
import { signupAPI } from '../../functions/services';
import { formatDate } from '../../functions/utils';

function EnrollmentPwd({
  // onClickSubmitFromSetPassword,
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  activeScreen,
  setToastProps,
  STEPLIST,
  ModalTitle,
  setActiveStep = () => {},
  stepComponent = () => {},
}) {
  const [isLoading, setIsloading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setIsConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [passwordConditions, setPasswordConditions] = useState({
    '8char': false,
    uppercase: false,
    numeric: false,
    navitaireSpecialChar: false,
  });
  useEffect(() => {
    const conditions = {
      '8char': password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      numeric: /\d/.test(password),
      navitaireSpecialChar: /^(?=.*[^a-zA-Z0-9\\/,.~`“‘])[^\\/,.~`“‘"']*$/.test(password),
    };
    setPasswordConditions(conditions);

    // Check if all conditions are met for password validity
    const allConditionsMet = Object.values(conditions).every(
      (condition) => condition,
    );

    if (confirmPassword.length > 5) {
      if (confirmPassword !== password) {
        setPasswordMatch(false);
      } else {
        setPasswordMatch(true);
      }
    }

    if (
      confirmPassword === password
      && allConditionsMet
      && REGEX_LIST.PASSWORD.test(password)
    ) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [password, confirmPassword]);

  const signupAPIHandler = async () => {
    const payload = {
      firstName: sharedData?.firstName,
      lastName: sharedData?.lastName,
      gender: sharedData?.gender,
      emailId: sharedData?.email,
      countryCode: `+${String(sharedData?.countryCode || '91').replaceAll(
        '+',
        '',
      )}`,
      mobileNumber: `+${sharedData.countryCode}${sharedData.phone}`,
      dob: sharedData?.date
        ? formatDate(sharedData?.date, '-')
        : sharedData?.date,
      isLoyaltyMember: sharedData?.checkbox?.sixeloyalty || false,
      isResidentEuropean: sharedData?.checkbox?.privacyPolicyEuropean || false,
      isTermsAndConditionAgreed: sharedData?.checkbox?.privacyPolicy || true,
      ipAddress: '',
      city: '',
      password: encryptAESForLogin(password),
      transactionId: sharedData?.transactionId || '',
    };
    const { response } = await signupAPI(payload);
    return response;
  };
  const onClickSubmitFromSetPassword = async (buttonName) => {
    setIsloading(true);

    const response = await signupAPIHandler();
    setIsloading(false);
    if (response?.data?.success) {
      pushAnalytic({
        state: { signUpSuccess: '1', signUpFail: '0', buttonName },
        event: 'Set Password',
      });
      if (sharedData?.redirectToBankInEnd) {
        setActiveScreen(SCREEN_TYPE.TIER_DETAIL);
      } else {
        // setActiveScreen(SCREEN_TYPE.LOYALTY_DASHBOARD_WELCOME);
        setToastProps({
          title: 'Success',
          description:
            mfLabels?.signInSuccessLoginNowLabel
            || 'Sign in Successfull! Please login Now',
          variation: 'notifi-variation--Success',
          // autoDismissTimeer: 5000,
          onClose: () => {
            setToastProps(null);
          },
        });

        onCloseHandler();
      }
    } else {
      pushAnalytic({
        state: { signUpFail: '1', signUpSuccess: '0', buttonName },
        event: 'Set Password',
      });
      const err = Array.isArray(response?.errors)
        ? response.errors[0]
        : response?.error || response?.errors;

      const errorObj = getErrorMsgForCode(err?.code);

      setToastProps({
        title: 'Error',
        description: errorObj?.message || 'Something went wrong',
        variation: 'notifi-variation--Error',
        // autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
    }
  };

  const checkValidationStatus = (isConditionMet) => {
    if (password) {
      if (!isConditionMet) {
        return 'validation-error';
      }
      return 'validation-success';
    }
    return '';
  };

  return (
    <div className="signup_EnrollmentPwd">
      <PopupModalWithContent
        overlayClickClose={false}
        onOutsideClickClose={null}
        onCloseHandler={onCloseHandler}
        className="popup-modal-with-content-login-sso-form signup_EnrollmentPwd_popup"
        modalTitle={ModalTitle || 'Create Password'}
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-sso-mf-modal"
      >
        {stepComponent()}

        {[SCREEN_TYPE.SIGNUP_6E_USER_MIGRATION].includes(activeScreen) && (
          <p className="mt-5 body-large-regular text-secondary">
            {mfLabels?.loyaltyInformation?.migratedPasswordResetMessage
              || 'We have migrated your account please reset your password.'}
          </p>
        )}

        <div className="signup_EnrollmentPwd_inputField mt-20 mb-20">
          <InputField
            type="password"
            name="NewPassword"
            register={() => {}}
            onChangeHandler={(e) => {
              setPassword(e.target.value);
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[\s.]/g, '');
            }}
            inputWrapperClass="signup__inpt-field password-err-message"
            placeholder={mfLabels?.newPasswordPlaceholder}
            showEyeIcon
            maxLength={mfLabels?.maxPasswordLength || 16}
            onPaste={(e) => {
              e.preventDefault();
            }}
          />
          <InputField
            type="password"
            name="ConfirmNewPassword"
            register={() => {}}
            onChangeHandler={(e) => {
              setIsConfirmPassword(e.target.value);
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[\s.]/g, '');
            }}
            inputWrapperClass="signup__inpt-field password-err-message"
            placeholder={mfLabels?.confirmPasswordPlaceholder}
            showEyeIcon
            errors={
              !passwordMatch && {
                ConfirmNewPassword: {
                  message:
                    mfLabels?.passwordsDontMatchLabel || '*Password dont match',
                },
              }
            }
            maxLength={mfLabels?.maxPasswordLength || 16}
            onPaste={(e) => {
              e.preventDefault();
            }}
          />
        </div>

        <h5 className="mt-5 mb-2 signup__must-have text-uppercase">
          {mfLabels?.passwordEligibilityTitle}
        </h5>
        <div className="mb-10">
          {mfLabels?.loyaltyInformation?.passwordEligibility?.map((inst) => {
            const isConditionMet = passwordConditions[inst?.key];
            const modifiedText = inst && inst.value ? JSON.stringify(inst.value) : '';
            return (
              <div
                key={inst?.key}
                className="signup__instructions d-flex align-items-center justify-center mb-2"
              >
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
                    // eslint-disable-next-line max-len
                    d="M11.411 8.35026C11.411 8.675 11.1477 8.93826 10.823 8.93826L5.51003 8.93822C5.18531 8.93822 4.92207 8.67498 4.92206 8.35027C4.92205 8.02553 5.1853 7.76228 5.51003 7.76228L10.823 7.76227C11.1477 7.76227 11.411 8.02552 11.411 8.35026Z"
                    fill={isConditionMet ? '#209326' : '#000000'} // Green if met, black otherwise
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    // eslint-disable-next-line max-len
                    d="M8.16536 5.1036C8.49008 5.10364 8.7533 5.36691 8.75327 5.69164L8.75275 11.0096C8.75272 11.3343 8.48944 11.5975 8.16469 11.5975C7.83995 11.5975 7.57671 11.3342 7.57675 11.0094L7.57731 5.69152C7.57734 5.36679 7.84062 5.10357 8.16536 5.1036Z"
                    fill={isConditionMet ? '#209326' : '#000000'} // Green if met, black otherwise
                  />
                </svg>
                <span
                  className={`body-small-regular ${checkValidationStatus(
                    isConditionMet,
                  )}`}
                  id={inst?.key}
                >
                  {modifiedText.slice(1, -1)}
                </span>
              </div>
            );
          })}
        </div>

        {[
          SCREEN_TYPE.SIGNUP_NEW_USER,
          SCREEN_TYPE.SIGNUP_ONBOARD_BANK,
        ].includes(activeScreen) ? (
          <div className="d-flex justify-content-between">
            <Button
              type="submit"
              onClick={() => setActiveStep(STEPLIST.OTP)}
              variant="outline"
              color="primary"
              size="large"
              containerClass="w-50"
            >
              {mfLabels?.loyaltyInformation?.enrollBackLabel || 'Back'}
            </Button>
            <Button
              type="submit"
              onClick={() => (isPasswordValid
                ? onClickSubmitFromSetPassword(
                  mfLabels?.loyaltyInformation?.enrollNowLabel || 'Enroll',
                )
                : {})}
              disabled={!isPasswordValid}
              containerClass="signup__confirm-button w-50 ms-10"
              aria-label={mfLabels?.setPasswordLabel}
              loading={isLoading}
              aria-disabled={!isPasswordValid}
            >
              {mfLabels?.loyaltyInformation?.enrollNowLabel || 'Enroll'}
            </Button>
          </div>
          ) : (
            <Button
              type="submit"
              onClick={() => (isPasswordValid
                ? onClickSubmitFromSetPassword(mfLabels?.setPasswordLabel)
                : {})}
              disabled={!isPasswordValid}
              containerClass="signup__confirm-button"
              aria-label={mfLabels?.setPasswordLabel}
              loading={isLoading}
              aria-disabled={!isPasswordValid}
            >
              {mfLabels?.setPasswordLabel}
            </Button>
          )}
      </PopupModalWithContent>
    </div>
  );
}

EnrollmentPwd.propTypes = {
  mfLabels: PropTypes.object.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func.isRequired,
  activeScreen: PropTypes.string.isRequired,
  setToastProps: PropTypes.func.isRequired,
  STEPLIST: PropTypes.any,
  ModalTitle: PropTypes.any,
  setActiveStep: PropTypes.any,
  stepComponent: PropTypes.any,
};
export default EnrollmentPwd;
