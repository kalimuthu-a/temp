import React, { useEffect, useState } from 'react';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import EmailComponent from 'skyplus-design-system-app/dist/des-system/EmailComponent';
import CheckBoxV3 from 'skyplus-design-system-app/dist/des-system/CheckBoxV3';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import DateField from 'skyplus-design-system-app/dist/des-system/DateField';
import sanitizeHtml from 'skyplus-design-system-app/src/functions/sanitizeHtml';
import PropTypes from 'prop-types';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import pushAnalytic from '../../functions/analyticEvents';
import { formatDate } from '../../functions/utils';
import { DEFAULT_CURRENCY_CODE } from '../../constants/common';

function BankForm({
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  activeScreen,
  setSharedData,
}) {
  const items = mfLabels?.genderIdentity?.map((identity) => ({
    label: identity,
    value: identity,
  }));

  const showEmailField = sharedData?.isMobileEntered;
  const formData = {
    countryCode: parseInt(sharedData?.countryCode, 10) || DEFAULT_CURRENCY_CODE,
    userId: sharedData?.userId || '',
    email: sharedData?.email || '',
    phone: sharedData?.phone || '',
    firstName: sharedData?.firstName || '',
    lastName: sharedData?.lastName || '',
    date: sharedData?.date || '',
    gender: sharedData?.gender || '',
  };

  const checkboxArray = mfLabels?.loyaltyInformation?.coBrandRegistrationDescription || [];
  const [isLoading, setIsloading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});

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

  useEffect(() => {
    if (Object.keys(checkboxStates).length !== checkboxArray?.length) {
      const initialCheckboxStates = {};
      checkboxArray?.forEach((desc) => {
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
    setIsFormValid(checkboxValid);
  }, [formData, checkboxStates]);

  const clickedContinue = async () => {
    setIsloading(true);

    pushAnalytic({
      state: {
        firstName: sharedData.firstName || '',
        lastName: sharedData.lastName || '',
        dob: sharedData.date || '',
      },
      event: 'ContinueAtSignup',
    });
    setIsloading(false);
  };

  const enrollDescription = sanitizeHtml(
    mfLabels?.loyaltyInformation?.verifyInformationDescription?.html,
  );

  return (
    <div className="login-sso-enrollment">
      <PopupModalWithContent
        overlayClickClose={false}
        onOutsideClickClose={null}
        onCloseHandler={onCloseHandler}
        className="popup-modal-with-content-login-sso-form"
        // mfLabels={mfLabels}
        modalTitle={
          mfLabels?.loyaltyInformation?.redirectingToPartnerBank?.html || ''
        }
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-sso-enrollment_modal"
        carouselImages
        hideBannerImage
      >
        <div
          className="body-small-regular text-tertiary mt-6 mb-6"
          dangerouslySetInnerHTML={{
            __html: enrollDescription,
          }}
        />
        <div className="signup__email-input-field">
          <RadioBoxGroup
            items={items}
            selectedValue={formData?.gender}
            containerClassName="signup__radio-btn"
            disableRadios
          />
          <div className="signup__fullname">
            <InputField
              type="text"
              name="firstName"
              value={formData?.firstName}
              register={() => {}}
              inputWrapperClass="signup__inpt-field signup__left-input"
              placeholder={mfLabels?.firstNameLabel}
              disabled
            />
            <InputField
              type="text"
              name="lastName"
              value={formData?.lastName}
              register={() => {}}
              inputWrapperClass="signup__inpt-field "
              placeholder={mfLabels?.lastNameLabel}
              disabled
            />
          </div>
          <div>
            <DateField
              required
              name="date"
              Datevalue={formatDate(formData?.date, '-')}
              customError=""
              placeholder={mfLabels?.dateOfBirthLabel}
              inputWrapperClass="signup__inpt-field date-signup-enroll"
              showError
              showDateIcon={false}
              minAge={18}
              showInfoAlways
              customInfoMessage={mfLabels?.loyaltyInformation?.dobFormatText
                || '* Enter date of birth in (DD-MM-YYYY) format'}
              disabled
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
              isDisabled
            />
          ) : (
            <PhoneComponent
              phonePlaceholder="Enter mobile number"
              className="login-sso-enrollment-phone-dropdown login-sso-enrollment-signup-form error-space"
              initialCountryCode={formData?.countryCode}
              name="phone"
              required
              // value={value}
              maxLength={10}
              value={formData?.phone}
              sanitize
              isDisabled
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
    </div>
  );
}
BankForm.propTypes = {
  onCloseHandler: PropTypes.func.isRequired,
  mfLabels: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func,
  activeScreen: PropTypes.string.isRequired,
  sharedData: PropTypes.object,
  setSharedData: PropTypes.object,
};

export default BankForm;
