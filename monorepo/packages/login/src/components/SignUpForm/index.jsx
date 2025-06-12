import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { AESEncryptCtr } from 'skyplus-design-system-app/dist/des-system/aes-ctr';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import EmailComponent from 'skyplus-design-system-app/dist/des-system/EmailComponent';
import CheckBoxV3 from 'skyplus-design-system-app/dist/des-system/CheckBoxV3';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import DateField from 'skyplus-design-system-app/dist/des-system/DateField';

import CreatePassword from './CreatePassword';
import { signupAPI, makePrivacyPostApi } from '../../functions/services';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import OtpVerifyPopUp from '../LoginForm/components/OtpVerifyPopUp';
import { SCREEN_TYPE } from '../../constants';
import gtmPushAnalytic from '../../functions/gtmAnalyticsEvents';
import pushAnalytic from '../../functions/analyticEvents';
import { getEnvObj } from '../../functions/utils';
import { LOGIN_SUCCESS, AA_CONSTANTS } from '../../constants/common';

function SignUpForm({
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  activeScreen,
  setSharedData,
  setToastProps,
  persona,
  makeBAUCallFromStrToken,
}) {
  const items = mfLabels?.genderIdentity?.map((identity) => ({
    label: identity,
    value: identity,
  }));

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isResendOtp, setIsResendOtp] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState('');
  const [isCreatePassword, setIsCreatePassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});
  const handleCheckboxChange = (key, event) => {
    const isChecked = event;
    setCheckboxStates((prevState) => ({
      ...prevState,
      [key]: isChecked,
    }));
  };
  const envObj = getEnvObj();
  useEffect(() => {
    let checkboxValid = false;
    for (const label of mfLabels?.registerationDescription ?? []) {
      if (label.required === true) {
        if (checkboxStates[label.key]) {
          checkboxValid = true;
        } else {
          checkboxValid = false;
        }
      }
    }
    if (
      selectedGender
      && date
      && checkboxValid
      && lastName
      && firstName
      && email
      && !emailError
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedGender, lastName, firstName, email, date, checkboxStates]);

  const onChange = (value) => {
    const item = items.find((row) => row.value === value);
    setSelectedGender(item.value);
  };

  const handleEmailChange = (emailParam, error) => {
    setEmailError(error);
    setEmail(emailParam);
  };

  const onClickSubmitFromSetPassword = async (passwordText) => {
    setIsloading(true);
    const mobileNumber = sharedData?.userId;
    const payload = {
      data: {
        signup: {
          password: encryptAESForLogin(passwordText),
          roleName: 'member',
          roleCode: 'WWWM',
          username: encryptAESForLogin(
            `${sharedData?.countryCode || 91}*${
              mobileNumber
            }`,
          ),
          otp: encryptAESForLogin(sharedData?.otpText),
          details: {
            gender: 0,
            dateOfBirth: date,
            nationality: sharedData?.countryInitials || 'IN',
            residentCountry: sharedData?.countryInitials || 'IN',
            passengerType: '',
            preferredCultureCode: '',
            preferredCurrencyCode: '',
            nationalIdNumber: '',
          },
          person: {
            name: {
              first: firstName,
              last: lastName,
              title: selectedGender?.toLowerCase() == 'male' ? 'Mr' : 'Ms',
            },
            emailAddresses: [
              {
                email,
                default: true,
                type: 'W',
              },
            ],
            phoneNumbers: [
              {
                type: 1,
                number: sharedData?.userId,
                default: true,
              },
            ],
          },
        },
      },
    };

    const startTime = performance.now();
    const { response } = await signupAPI(payload);
    const endTime = performance.now();
    const apiResponseTime = endTime - startTime;
    setIsloading(false);
    const responseData = response?.data || {};
    const isSuccessString = responseData.status?.toLowerCase() === 'success';
    const isSuccessBool = responseData.status === true;
    const customerNumber = responseData.person?.customerNumber || '';
    if (isSuccessString || isSuccessBool || customerNumber) {
      pushAnalytic({
        state: { signUpSucess: 1 },
        event: 'Set Password',
      });
      gtmPushAnalytic({
        state: '',
        event: 'signupSuccess',
      });

      pushAnalytic({
        state: '',
        event: 'api',
        apiMesg: {
          code: response?.data.status || '',
          response: response?.data || '',
          responsetime: apiResponseTime || '',
          apiURL: envObj?.API_SIGN_UP,
        },
      });

      setToastProps({
        title: 'Success',
        description: 'Signup Successfull',
        variation: 'notifi-variation--success',
        autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
      if (customerNumber) {
        let customerNumberEncryptedForAnalytics = '';
        try {
          customerNumberEncryptedForAnalytics = AESEncryptCtr(customerNumber, '', 256);
        } catch (error) {}
        const personObj = responseData?.person || {};
        const user = {
          customerNumber,
          name: {
            first: personObj.name.first,
            last: personObj.name.last,
            title: personObj.name.title,
          },
          details: {
            dateOfBirth: personObj.details.dateOfBirth,
            passengerType: personObj.details.passengerType,
            preferredCurrencyCode:
            personObj.details.preferredCurrencyCode,
          },
          mobileNumber: mobileNumber || '',
          mobileCountryCode: sharedData?.countryCode || 91,
          email: '',
          customerNumberEncryptedForAnalytics,
          loyaltyMemberInfo: personObj?.loyaltyMemberInfo || {},
        };
        makeBAUCallFromStrToken(responseData?.strToken);
        const loginSuccessEvent = (config) => new CustomEvent(LOGIN_SUCCESS, config);
        document.dispatchEvent(
          loginSuccessEvent({
            bubbles: true,
            detail: {
              token: responseData,
              user,
            },
          }),
        );
      }
      onCloseHandler();
    } else {
      // handle error;
      let err;

      if (Array.isArray(response?.errors)) {
        err = response.errors[0];
      } else {
        err = response?.error || response?.errors || response;
      }
      const errorObj = getErrorMsgForCode(err?.code);
      const errorDetail = {
        type: 'error',
        code: err?.code,
        title: 'Error', // change title with error type like error,info
        message: errorObj?.message || 'Something went wrong',
      };
      setToastProps({
        title: 'Error',
        description: errorDetail?.message || 'Something went wrong',
        variation: 'notifi-variation--Error',
        autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
      console.log(errorDetail, 'errorDetail');
      gtmPushAnalytic({
        state: {
          click_text: 'Set Password',
          error_message: errorObj?.message,
          apiURL: envObj?.API_SIGN_UP,
          error_type: 'Business',
        },
        event: 'error',
      });
      pushAnalytic({
        state: { signUpFail: 1 },
        event: 'Set Password',
      });
      pushAnalytic({
        event: 'UXerror',
        errorMesg: {
          code: response?.status,
          type: AA_CONSTANTS.BE_ERROR,
          source: AA_CONSTANTS.MS_API,
          apiUrl: envObj?.API_SIGN_UP,
          statusCode: response?.status,
          statusMessage: response?.errors?.message,
          displayMessage: errorObj?.message,
          action: AA_CONSTANTS.LINK_BUTTON_CLICK,
          component: 'Set Password',
        },
      });
      pushAnalytic({
        state: '',
        event: 'error',
        errorMesg: {
          code: response?.errors?.code || '',
          type: 'api',
          source: 'api',
          apiURL: envObj?.API_SIGN_UP,
          statusCode: response?.status,
          statusMessage: response?.errors?.message || '',
          displayMessage: errorObj?.message || 'Something went wrong',
        },
      });
      gtmPushAnalytic({
        state: {
          click_text: 'Set Password',
          error_message: errorObj?.message,
          error_type: 'Business',
        },
        event: 'signupFailed',
      });
    }
  };

  const onClickOtpProceed = (otp) => {
    setActiveScreen(SCREEN_TYPE.SIGNUP_FORM);
  };
  const onClickResentSignupOtp = (otp) => {
    if (otp) {
      onClickOtpProceed(otp);
    } else {
      setIsResendOtp(true);
      const event = new CustomEvent('resendOtpEvent', {
        detail: { data: sharedData },
      });
      window.dispatchEvent(event);
    }
  };

  if (activeScreen === SCREEN_TYPE.SIGNUP_OTP) {
    return (
      <OtpVerifyPopUp
        onClickSubmit={(otpText) => onClickResentSignupOtp(otpText)}
        phoneNumber={sharedData?.userId}
        onCloseHandler={onCloseHandler}
        isLoading={isLoading}
        setIsloading={setIsloading}
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        setSharedData={setSharedData}
        sharedData={sharedData}
        persona={persona}
        setToastProps={setToastProps}
        isResendOtp={isResendOtp}
      />
    );
  }

  const sanitizeAlphabetInput = (event) => {
    const input = event.target;
    const { value } = input;
    const sanitizedValue = value.replace(/[^a-zA-Z]/g, '');
    if (value !== sanitizedValue) {
      input.value = sanitizedValue;
    }
    return input;
  };

  const privacyPolicyCheck = async () => {
    const policyPayload = {
      data: {
        userId: '',
        ip: '',
        formName: 'CustomerSignupForm',
        privacyPolicyConsent: true,
        genericConsent: false,
        umnrConsent: false,
        infantConsent: false,
        minorConsent: false,
        pnr: '',
      },
    };
    await makePrivacyPostApi(policyPayload);
  };

  const clickedContinue = async () => {
    if (isFormValid) {
      setIsCreatePassword(true);
      await privacyPolicyCheck();
    }
    pushAnalytic({
      state: '',
      event: 'Continue',
    });
    gtmPushAnalytic({
      state: '',
      event: 'Continue',
    });
  };

  return (
    <>
      {isCreatePassword ? (
        <CreatePassword
          onCloseHandler={onCloseHandler}
          mfLabels={mfLabels}
          onClickSubmitFromSetPassword={onClickSubmitFromSetPassword}
          setActiveScreen={setActiveScreen}
          isLoading={isLoading}
        />
      ) : (
        <PopupModalWithContent
          overlayClickClose={false}
          onOutsideClickClose={null}
          onCloseHandler={onCloseHandler}
          className="popup-modal-with-content-login-form"
          // mfLabels={mfLabels}
          hideFooter
          modalTitle="Hi there, Welcome!"
          mfLabels={mfLabels}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          customPopupContentClassName="login-mf-modal"
        >
          <div className="forgot-pwd-container-inner-title">
            <p>{mfLabels?.addDetailsNote}</p>
          </div>
          <div className="signup__email-input-field">
            <EmailComponent
              name="email"
              required
              emailPlaceholder={mfLabels?.enterMailIdLabel}
              onEmailChange={handleEmailChange}
              errors={
                emailError && {
                  email: { message: 'Invalid email' },
                }
              }
            />
            <RadioBoxGroup
              items={items}
              onChange={onChange}
              selectedValue={selectedGender}
              containerClassName="signup__radio-btn"
            />
            <div className="signup__fullname">
              <InputField
                type="text"
                name="firstName"
                register={() => {}}
                onInputHandler={sanitizeAlphabetInput}
                onChangeHandler={(e) => setFirstName(e.target.value)}
                inputWrapperClass="forgot-pwd__inpt-field signup__left-input"
                placeholder={mfLabels?.firstNameLabel}
              />
              <InputField
                type="text"
                name="lastName"
                register={() => {}}
                onInputHandler={sanitizeAlphabetInput}
                onChangeHandler={(e) => setLastName(e.target.value)}
                inputWrapperClass="forgot-pwd__inpt-field "
                placeholder={mfLabels?.lastNameLabel}
              />
            </div>
            <div>
              <DateField
                required
                name="lastName"
                customError=""
                onChangeHandler={(value) => setDate(value)}
                placeholder={mfLabels?.dateOfBirthLabel}
                inputWrapperClass="forgot-pwd__inpt-field"
                showError
                showDateIcon={false}
              />

              {/* <InputField
                type="date"
                name="lastName"
                register={() => {}}
                inputWrapperClass="forgot-pwd__inpt-field"
                placeholder={mfLabels?.dateOfBirthLabel}
                onChangeHandler={(e) => setDate(e.target.value)}
              /> */}
            </div>
            {mfLabels?.registerationDescription?.map((desc, index) => {
              if (
                Object.keys(checkboxStates).length
                != mfLabels?.registerationDescription.length
              ) {
                checkboxStates[desc.key] = false;
                if (desc.required) {
                  checkboxStates[desc.key] = true;
                }
              }
              return (
                <div
                  className={`signup__checkbox-conditions ${
                    index === 0 && 'mt-sm-8 mt-md-0'
                  }`}
                  key={desc?.key}
                >
                  <CheckBoxV3
                    checked={checkboxStates[desc.key] || false}
                    onChangeHandler={(isChecked) => handleCheckboxChange(desc.key, isChecked)}
                    description={desc.description.html}
                    required={desc.required}
                  />
                </div>
              );
            })}

            <Button
              disabled={!isFormValid}
              onClick={() => clickedContinue()}
              containerClass="signup__continue-button"
              aria-label={mfLabels?.continueCtaLabel}
              aria-disabled={!isFormValid}
            >
              {mfLabels?.continueCtaLabel}
            </Button>
          </div>
        </PopupModalWithContent>
      )}
    </>
  );
}

SignUpForm.propTypes = {
  mfLabels: PropTypes.any,
  onCloseHandler: PropTypes.func,
  sharedData: PropTypes.object,
  setActiveScreen: PropTypes.any,
  activeScreen: PropTypes.any,
  setSharedData: PropTypes.func,
  persona: PropTypes.any,
  setToastProps: PropTypes.func,
  makeBAUCallFromStrToken: PropTypes.func,
};

export default SignUpForm;
