import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import EmailComponent from 'skyplus-design-system-app/dist/des-system/EmailComponent';
import CheckBoxV3 from 'skyplus-design-system-app/dist/des-system/CheckBoxV3';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import DateField from 'skyplus-design-system-app/dist/des-system/DateField';
import sanitizeHtml from 'skyplus-design-system-app/src/functions/sanitizeHtml';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import pushAnalytic from '../../functions/analyticEvents';
import { checkExistenceAPI, sendOtpAPI } from '../../functions/services';
import { DD_RUM_EVENTS, DD_RUM_LOAD_CLICK_PAYLOAD, REGEX_LIST, SCREEN_TYPE } from '../../constants';
import { formatDate, maskEmail, maskName, maskString } from '../../functions/utils';
import { DEFAULT_CURRENCY_CODE } from '../../constants/common';
import pushDDRumAction from '../../utils/ddrumEvent';

// eslint-disable-next-line sonarjs/cognitive-complexity
function EnrollmentForm({
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  activeScreen,
  setSharedData,
  setToastProps,
  STEPLIST,
  ModalTitle,
  setActiveStep = () => {},
  stepComponent = () => {},
  fieldsDisabled,
  showMobileOtp,
  showEmailOtp,
  dobDisabled,
  genderDisable,
}) {
  const items = mfLabels?.genderIdentity?.map((identity) => ({
    label: identity,
    value: identity?.toLowerCase(),
  }));

  const showEmailField = sharedData?.isMobileEntered;
  const tempErrMessage = mfLabels?.dobErrorObject;
  const [isLoading, setIsloading] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: sharedData?.countryCode || DEFAULT_CURRENCY_CODE,
    userId: sharedData?.userId || '',
    email: sharedData?.email || '',
    phone: sharedData?.phone || '',
    firstName: sharedData?.firstName || '',
    lastName: sharedData?.lastName || '',
    date: sharedData?.date || '',
    gender: sharedData?.gender || '',
  });

  // 3 checkbox
  let checkboxArray = mfLabels?.loyaltyInformation?.enrollRegistrationActivation || [];
  const sixeloyaltyCheckbox = 'sixeloyalty';
  if (
    [SCREEN_TYPE.SIGNUP_6E_USER, SCREEN_TYPE.COBRAND_6E_USER].includes(
      activeScreen,
    )
  ) {
    // 1 checkbox
    checkboxArray = mfLabels?.loyaltyInformation?.enrollRegistrationDescription || [];

     const MigrationDetailsPayload = DD_RUM_LOAD_CLICK_PAYLOAD;
     const MigrationDetailsAction = DD_RUM_EVENTS.MEMBER_DETAILS_INPUT;
     MigrationDetailsPayload.action = MigrationDetailsAction;
     MigrationDetailsPayload.datadogSessionId =
       window.DD_RUM?.getInternalContext()?.session_id;
     MigrationDetailsPayload.timestamp = new Date().toISOString();
     MigrationDetailsPayload.metadata = {
       page: 'Migration Page',
       step: 'User Details',
       component: 'EnrollmentForm',
       application: 'login-sso',
       flowType: 'Migration',
       userInput: {
         firstName: formData?.firstName ? maskString(formData?.firstName) : '',
         lastName: formData?.lastName ? maskString(formData?.lastName) : '',
         dob: formData?.date,
         phoneNumber: formData?.phone ? maskString(formData?.phone) : '',
         countryCode: formData?.countryCode,
         email: formData?.email ? maskEmail(formData?.email) : '',
       },
     };

     pushDDRumAction(MigrationDetailsAction, MigrationDetailsPayload);
  } else if ([SCREEN_TYPE.SIGNUP_6E_USER_MIGRATION].includes(activeScreen)) {
    // 2 checkbox
    checkboxArray = mfLabels?.registerationDescription || [];
  } else if ([SCREEN_TYPE.COBRAND_LOYALTY_MEMBER].includes(activeScreen)) {
    // todo to change authering when available
    checkboxArray = [];
  }

  if (window.disableLoyalty) {
    checkboxArray = checkboxArray.filter((item) => item.key !== sixeloyaltyCheckbox);
  }

  const [errorObj, setErrorObj] = useState({});
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});
  const staticErrorMsg = 'Something went wrong';
  const staticErrorVariationToast = 'notifi-variation--Error';

  const handleCheckboxChange = (key, event) => {
    const isChecked = event;
    setCheckboxStates((prevState) => ({
      ...prevState,
      [key]: isChecked,
    }));

    setSharedData((prevState) => ({
      ...prevState,
      checkbox: {
        ...prevState.checkbox,
        [key]: isChecked,
      },
    }));
  };
  const validatePhone = (tempFormData) => {
    const tempErrorObj = {};
    const regex = tempFormData.countryCode === '+91'
      || Number(tempFormData.countryCode) === 91
      ? REGEX_LIST.INDIAN_MOBILE_NUMBER
      : REGEX_LIST.EXCEPT_INDIAN_MOBILE_NUMBER;

    if (
      !String(tempFormData.phone).match(regex)
      || tempFormData.phone.length < mfLabels?.minPhoneLength
      || tempFormData.phone.length > mfLabels?.maxPhoneLength
    ) {
      tempErrorObj.phone = {
        message: mfLabels?.mobileValidationText || '',
      };
    }
    setErrorObj(tempErrorObj);

    return tempErrorObj;
  };
  useEffect(() => {
    if (Object.keys(checkboxStates).length !== checkboxArray.length) {
      const initialCheckboxStates = {};
      checkboxArray.forEach((desc) => {
        initialCheckboxStates[desc.key] = !!desc.preSelected;
      });
      setCheckboxStates(initialCheckboxStates);
      setSharedData((prevState) => ({
        ...prevState,
        checkbox: initialCheckboxStates,
      }));
    }
  }, [mfLabels]);

  useEffect(() => {
    let checkboxValid = true;

    for (const label of checkboxArray ?? []) {
      if (label.required === true) {
        if (checkboxStates[label.key]) {
          // checkboxValid = true;
        } else {
          checkboxValid = false;
        }
      }
    }
    if (
      !showEmailField
      && formData.gender
      && formData.date
      && checkboxValid
      && formData.lastName
      && formData.firstName
      && formData.phone.length > 6
      && !Object.keys(errorObj).length
    ) {
      setIsFormValid(true);
    } else if (
      showEmailField
      && formData.gender
      && formData.date
      && checkboxValid
      && formData.lastName
      && formData.firstName
      && formData.email
      && !emailError
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [formData, emailError, errorObj, checkboxStates]);

  const onChange = (key, value, additionalObj) => {
    const temp = { ...formData, ...additionalObj };
    if (key) {
      temp[key] = value;
    }
    if ((!showEmailField && !key) || key === 'phone') {
      validatePhone(temp);
    }
    setFormData(temp);
    setSharedData((prev) => {
      return { ...prev, ...temp };
    });
  };

  const onGenderChange = (value) => {
    const item = items.find(
      (row) => row.value?.toLowerCase() === value?.toLowerCase(),
    );
    onChange('gender', item.value);
  };

  const handleEmailChange = (emailParam, error) => {
    setEmailError(error);
    onChange('email', emailParam);
  };

  const sanitizeAlphabetInput = (event) => {
    const input = event.target;
    const { value } = input;
    const sanitizedValue = value.replace(/[^a-zA-Z ]/g, '');
    if (value !== sanitizedValue) {
      input.value = sanitizedValue;
    }
    return input;
  };

  const checkExistenceHandler = async () => {
    try {
      const payload = showEmailField
        ? { emailId: formData?.email, mobileNumber: '' }
        : {
          mobileNumber: `+${formData.countryCode}${formData.phone}`,
          emailId: '',
        };
      const { response } = await checkExistenceAPI(payload);

      if (response?.data) {
        return showEmailField
          ? response?.data?.isEmailExist
          : response?.data?.isMobileExist;
      }
      const err = Array.isArray(response?.errors)
        ? response.errors[0]
        : response?.error || response?.errors;
      const tempErrorObj = getErrorMsgForCode(err?.code);

      setToastProps({
        title: 'Error',
        description: tempErrorObj?.message || staticErrorMsg,
        variation: staticErrorVariationToast,
        // autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('checkExistenceHandler ::error', error);
    }
    return false;
  };

  const sendOtpAPIHandler = async () => {
    try {
      // todo otpytype should be email or sms
      const payload = {
        mobileNumber: formData.phone ? `+${formData.countryCode}${formData.phone}` : '',
        emailId: formData?.email,
        otpType:
          (showEmailOtp && showMobileOtp && 'Both')
          || (showEmailOtp && 'Email')
          || (showMobileOtp && 'SMS'),
      };
      const { response } = await sendOtpAPI(payload);
      if (response?.data?.success) {
        setActiveStep(STEPLIST.OTP);
      } else {
        const err = Array.isArray(response?.errors)
          ? response.errors[0]
          : response?.error || response?.errors;

        const tempErrorObj = getErrorMsgForCode(err?.code);

        setToastProps({
          title: 'Error',
          description: tempErrorObj?.message || staticErrorMsg,
          variation: staticErrorVariationToast,
          // autoDismissTimeer: 5000,
          onClose: () => {
            setToastProps(null);
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('sendOtpAPIHandler ::error', error);
    }
    setIsloading(false);
  };

  const userExistError = (isverified) => {
    if (isverified) {
      setToastProps({
        title: 'Error',
        description: mfLabels?.loyaltyInformation?.userExistErr || 'User already exist',
        variation: staticErrorVariationToast,
        // autoDismissTimeer: 5000,
        onClose: () => {
          setToastProps(null);
        },
      });
    }
  };

  const clickedContinue = async () => {
    setIsloading(true);
    let isverified = false;
    if ([SCREEN_TYPE.SIGNUP_NEW_USER].includes(activeScreen)) {
      isverified = await checkExistenceHandler();
    }
    pushAnalytic({
      state: {
        firstName: encryptAESForLogin(formData?.firstName),
        lastName: encryptAESForLogin(formData?.lastName),
        dob: encryptAESForLogin(formatDate(formData?.date, '-')),
      },
      event: 'ContinueAtSignup',
    });
    if (isverified === false) {
      await sendOtpAPIHandler();
    } else {
      userExistError(isverified);
    }
    setIsloading(false);
  };

  const enrollDescription = sanitizeHtml(
    mfLabels?.loyaltyInformation?.enrollDescription?.html,
  );

  return (
    <PopupModalWithContent
      overlayClickClose={false}
      onOutsideClickClose={null}
      onCloseHandler={onCloseHandler}
      className="popup-modal-with-content-login-sso-form"
      // mfLabels={mfLabels}
      modalTitle={ModalTitle || ''}
      mfLabels={mfLabels}
      activeScreen={activeScreen}
      setActiveScreen={setActiveScreen}
      customPopupContentClassName="login-sso-enrollment_modal"
      carouselImages
      hideBannerImage
    >
      {/* <div className="signup-container-inner-title">
        <p>{mfLabels?.addDetailsNote}</p>
      </div> */}
      {[SCREEN_TYPE.COBRAND_LOYALTY_MEMBER].includes(activeScreen)
        ? null
        : stepComponent()}
      <div
        className="body-small-regular text-tertiary mt-6"
        dangerouslySetInnerHTML={{
          __html: enrollDescription,
        }}
      />
      <div className="signup__email-input-field">
        <RadioBoxGroup
          items={items}
          onChange={onGenderChange}
          selectedValue={formData.gender?.toLowerCase()}
          containerClassName="signup__radio-btn"
          disableRadios={formData?.gender ? genderDisable : false}
        />
        <div className="signup__fullname">
          <InputField
            type="text"
            name="firstName"
            value={formData?.firstName}
            register={() => {}}
            onInputHandler={sanitizeAlphabetInput}
            onChangeHandler={(e) => onChange('firstName', e.target.value)}
            inputWrapperClass="signup__inpt-field signup__left-input"
            placeholder={mfLabels?.firstNameLabel}
            disabled={sharedData?.firstName ? fieldsDisabled : false}
            maxLength={50}
          />
          <InputField
            type="text"
            name="lastName"
            value={formData?.lastName}
            register={() => {}}
            onInputHandler={sanitizeAlphabetInput}
            onChangeHandler={(e) => onChange('lastName', e.target.value)}
            inputWrapperClass="signup__inpt-field "
            placeholder={mfLabels?.lastNameLabel}
            disabled={sharedData?.lastName ? fieldsDisabled : false}
            maxLength={50}
          />
        </div>
        <div>
          <DateField
            required
            name="date"
            Datevalue={formatDate(formData?.date, '-')}
            customError=""
            onChangeHandler={(value) => onChange('date', value)}
            placeholder={mfLabels?.dateOfBirthLabel}
            inputWrapperClass="signup__inpt-field date-signup-enroll"
            showError
            showDateIcon={false}
            minAge={mfLabels?.minAge || 18}
            maxAge={mfLabels?.maxAge || 100}
            showInfoAlways
            customInfoMessage={mfLabels?.loyaltyInformation?.dobFormatText
              || '* Enter date of birth in (DD-MM-YYYY) format'}
            disabled={formData?.date ? dobDisabled : false}
            customErrorObj={tempErrMessage}
            dateViewSeparator ="-"
          />
        </div>
        {showEmailField ? (
          <EmailComponent
            name="email"
            required
            value={formData?.email}
            className="email-signup-enroll"
            emailPlaceholder={mfLabels?.enterMailIdLabel}
            onEmailChange={handleEmailChange}
            // isDisabled={true}
            errors={
              emailError && {
                email: {
                  message:
                    mfLabels?.loyaltyInformation?.invalidEmailLabel
                    || '*Please enter a valid email id"',
                },
              }
            }
          />
        ) : (
          <PhoneComponent
            phonePlaceholder="Enter mobile number"
            className={
              `login-sso-enrollment-phone-dropdown 
                login-sso-enrollment-signup-form 
                error-space ${Object.keys(errorObj).length
                ? ' login-sso-phone-dropdown-error '
                : ''}`
            }
            onChangeCountryCode={(countryInitials, item) => {
              onChange(null, null, {
                countryInitials: item?.countryCode,
                countryCode: item?.phoneCode,
              });
            }}
            onChangePhoneNumber={(value) => {
              onChange('phone', value);
            }}
            initialCountryCode={formData?.countryCode}
            errors={errorObj}
            name="phone"
            required
            maxLength={10}
            value={formData?.phone}
            sanitize
            // isDisabled={true}
            type="number"
          />
        )}

        {checkboxArray?.map((desc, index) => {
          return (
            <div
              className={`signup__checkbox-conditions ${
                index === 0 && 'mt-sm-8 mt-md-0'
              }`}
              key={desc?.key}
            >
              <CheckBoxV3
                checked={checkboxStates[desc.key] || false}
                onChangeHandler={(isChecked) => {
                  handleCheckboxChange(desc.key, isChecked);
                }}
                description={desc.description.html}
                containerClass="align-items-center"
                required={desc.required}
                name={desc?.key}
                id={desc?.key}
                editable={
                  desc.key === sixeloyaltyCheckbox
                    ? sharedData?.isLoyaltyCheckEditable
                    : true
                }
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
          loading={isLoading}
        >
          {mfLabels?.continueCtaLabel}
        </Button>
      </div>
    </PopupModalWithContent>
  );
}

EnrollmentForm.propTypes = {
  mfLabels: PropTypes.object.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func.isRequired,
  activeScreen: PropTypes.string.isRequired,
  setSharedData: PropTypes.func.isRequired,
  setToastProps: PropTypes.func.isRequired,
  STEPLIST: PropTypes.any,
  ModalTitle: PropTypes.any,
  setActiveStep: PropTypes.any,
  stepComponent: PropTypes.any,
  fieldsDisabled: PropTypes.bool,
  showMobileOtp: PropTypes.bool,
  showEmailOtp: PropTypes.bool,
  genderDisable: PropTypes.bool,
  dobDisabled: PropTypes.bool,
};

export default EnrollmentForm;
