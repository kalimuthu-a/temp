import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import DropDown from 'skyplus-design-system-app/dist/des-system/DropDown';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import CheckBox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { handleSubmitBankDetails } from '../../services';
import { validateBankDetailsForm } from '../../utils';
import { ACCOUNT_TYPE_OTIONS, CUSTOM_EVENTS, FIELD_TYPE } from '../../constants';
import { useCustomEventDispatcher } from 'skyplus-design-system-app/dist/des-system/customEventHooks';

const PassengerDetailsForm = ({ aemData = {}, setToastMsg, setIsOtpSubmitted, passengerDetails }) => {
  const [formData, setFormData] = useState({
    nameOfBank: '',
    accountNumber: '',
    confirmedAccountNumber: '',
    IFSCCode: '',
    fileName: '',
    accountType: '',
    customerConsent: false,
    chequeImage: '',
    errors: {
      nameOfBank: '',
      accountNumber: '',
      confirmedAccountNumber: '',
      IFSCCode: '',
      accountType: '',
      fileName: '',
    },
    submitCtaLoading: false,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const accountTypeRef = useRef(null);
  const dispatchCustomEvent = useCustomEventDispatcher();
  const { recordLocator, accountHolderName, bookingContactCountryCode, bookingContactMobileNo } = passengerDetails;

  const onChangeForm = (fieldType, value, fileSize = '') => {
    const formTemp = { ...formData, [fieldType]: value };
    const errors = validateBankDetailsForm(fieldType, value, formData, aemData, fileSize);
    setFormData({
      ...formTemp,
      errors: {
        ...formTemp.errors,
        [fieldType]: errors || '',
      },
    });
  };

  const getDropdownElement = (placeholder) => (
    <div className="design-system-input-field position-relative">
      <input
        className="my-profile-input"
        placeholder={placeholder || aemData?.accountTypeLabel}
        readOnly
        ref={accountTypeRef}
      />
      <i className="icon icon-accordion-down-simple" />
    </div>
  );

  const options = [
    { id: ACCOUNT_TYPE_OTIONS.ACCOUNT_TYPE, label: aemData?.accountTypeLabel, value: '' },
    { id: ACCOUNT_TYPE_OTIONS.SAVINGS, label: aemData?.accountTypeList?.[0], value: aemData?.accountTypeList?.[0] },
    { id: ACCOUNT_TYPE_OTIONS.CURRENT, label: aemData?.accountTypeList?.[1], value: aemData?.accountTypeList?.[1] },
  ];

  const showFileName = (fieldType, input) => {
    const fileNameSpan = document.getElementById('fileName');
    const file = input?.target?.files?.[0];
    fileNameSpan.textContent = file?.name || aemData?.cancelledCheckLabel;
    if (file) {
      // Base64 value
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader?.result?.split(',')?.[1];
        setFormData((prevFormData) => ({
          ...prevFormData,
          chequeImage: base64Data,
        }));
      };
      reader.readAsDataURL(file);
    }
    onChangeForm(fieldType, file?.name, file?.size);
  };

  const handleFormSubmit = async () => {
    setFormData((prev) => ({ ...prev, submitCtaLoading: true }));
    if (formData.accountNumber !== formData.confirmedAccountNumber) {
      return setFormData({
        ...formData,
        errors: {
          ...formData.errors,
          confirmedAccountNumber: aemData?.errorMessages?.ReEnterAccountNumber,
        },
      });
    }
    const response = await handleSubmitBankDetails(formData, accountHolderName);
    if (response?.isSuccess) {
      setToastMsg({ status: true, msg: aemData?.errorMessages?.SuccessMessage });
    } else {
      setToastMsg({
        status: false,
        msg: response?.indiGoError?.errors?.[0]?.message || aemData?.errorMessages?.FailureMessage,
      });
    }
    dispatchCustomEvent(CUSTOM_EVENTS.HANDLE_SHOW_REFUND_CLAIM_FORM, {
      isRefundClaimFormShow: true,
    });
    setFormData((prev) => ({ ...prev, submitCtaLoading: false }));
    setIsOtpSubmitted((prev) => !prev);
  };

  useEffect(() => {
    const allFieldsFilled =
      formData.nameOfBank &&
      formData.accountNumber &&
      formData.confirmedAccountNumber &&
      formData.IFSCCode &&
      formData.accountType &&
      formData.fileName &&
      formData.customerConsent;
    const noErrors = Object.values(formData?.errors)?.every((error) => error === '');
    setIsButtonDisabled(!(allFieldsFilled && noErrors));
  }, [formData]);

  return (
    <div className="passenger-details-wrapper">
      <h3>{aemData?.passengerDetailsHeading}</h3>
      <div className="passenger-details-form">
        <Input
          placeholder={aemData?.bankNameLabel}
          name="pnr-number"
          inputWrapperClass="mb-0"
          value={recordLocator}
          disabled="true"
        />
        <Input
          placeholder={aemData?.accountNumberLabel}
          name="account-holder-name"
          inputWrapperClass="mb-0"
          value={accountHolderName}
          disabled="true"
        />
        <PhoneComponent
          initialCountryCode={bookingContactCountryCode}
          name="phone"
          required
          value={bookingContactMobileNo}
          maxLength={15}
          sanitize
          type="number"
          isDisabled="true"
        />
      </div>
      <h3>{aemData?.bankDetailsHeading}</h3>
      <div className="bank-details-form">
        <div className="bank-details-form__section">
          <Input
            placeholder={aemData?.bankNameLabel}
            name={FIELD_TYPE.NAME_OF_BANK}
            onChange={(e) => onChangeForm(FIELD_TYPE.NAME_OF_BANK, e.target.value)}
            onBlur={(e) => onChangeForm(FIELD_TYPE.NAME_OF_BANK, e.target.value)}
            inputWrapperClass="mb-0"
            value={formData?.nameOfBank}
            customErrorMsg={formData.errors.nameOfBank}
            required
          />
          <Input
            placeholder={aemData?.accountNumberLabel}
            name={FIELD_TYPE.ACCOUNT_NUMBER}
            onChange={(e) => onChangeForm(FIELD_TYPE.ACCOUNT_NUMBER, e.target.value)}
            onBlur={(e) => onChangeForm(FIELD_TYPE.ACCOUNT_NUMBER, e.target.value)}
            inputWrapperClass="mb-0"
            value={formData?.accountNumber}
            customErrorMsg={formData.errors.accountNumber}
          />
          <Input
            placeholder={aemData?.reenterAccountNumberLabel}
            name={FIELD_TYPE.CONFIRMED_ACCOUNT_NUMBER}
            onChange={(e) => onChangeForm(FIELD_TYPE.CONFIRMED_ACCOUNT_NUMBER, e.target.value)}
            onBlur={(e) => onChangeForm(FIELD_TYPE.CONFIRMED_ACCOUNT_NUMBER, e.target.value)}
            inputWrapperClass="mb-0"
            value={formData?.confirmedAccountNumber}
            customErrorMsg={formData.errors.confirmedAccountNumber}
          />
        </div>
        <div className="bank-details-form__section">
          <Input
            placeholder={aemData?.ifscCodeLabel}
            name={FIELD_TYPE.IFSC_CODE}
            onChange={(e) => onChangeForm(FIELD_TYPE.IFSC_CODE, e.target.value)}
            onBlur={(e) => onChangeForm(FIELD_TYPE.IFSC_CODE, e.target.value)}
            inputWrapperClass="mb-0"
            value={formData?.IFSCCode}
            customErrorMsg={formData.errors.IFSCCode}
          />
          <DropDown
            renderElement={() => getDropdownElement(formData.accountType)}
            items={options}
            containerClass="account-type-dropdown"
            renderItem={({ id, label }) => (
              <div
                className="account-type-dropdown__item"
                key={id}
                onClick={() => setFormData({ ...formData, accountType: label })}
              >
                {label}
              </div>
            )}
            setToggleModal={() => {}}
            inputRef={accountTypeRef}
          />
          <div className="file-uploader">
            <Input
              placeholder={aemData?.cancelledCheckLabel}
              accept=".jpg, .png"
              name="file-upload"
              onChange={(e) => showFileName(FIELD_TYPE.FILE_NAME, e)}
              inputWrapperClass="mb-0"
              type="file"
              id="fileUpload"
              customErrorMsg={formData.errors.fileName}
            />
            <label htmlFor="fileUpload" className="custom-input">
              <span id="fileName">{aemData?.cancelledCheckLabel}</span>
              <i className={aemData?.uploadIcon} />
            </label>
            <span className="info-msg"><i className={aemData?.chequeInfoIcon} />{aemData?.chequeFormatNote}</span>
          </div>
        </div>
        <CheckBox
          onChangeHandler={() => setFormData({ ...formData, customerConsent: !formData.customerConsent })}
          checked={formData.customerConsent}
          id="customer-consent-checkbox"
          containerClass="customer-consent-checkbox"
        >
          <HtmlBlock
            html={
              aemData?.consentProcessDescription?.html
            }
          />
        </CheckBox>
        <Button
          disabled={isButtonDisabled}
          block
          type="submit"
          loading={formData?.submitCtaLoading}
          title="Submit bank details"
          onClick={handleFormSubmit}
        >
          {aemData?.submitLabel}
        </Button>
      </div>
    </div>
  );
};

PassengerDetailsForm.propTypes = {
  aemData: PropTypes.object,
  setToastMsg: PropTypes.func,
  setIsOtpSubmitted: PropTypes.func,
  passengerDetails: PropTypes.func,
};

export default PassengerDetailsForm;