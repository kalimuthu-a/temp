import React, { useState } from 'react';
import TabsContainer from 'skyplus-design-system-app/dist/des-system/TabsContainer';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import { any, string } from 'prop-types';
import { onSubmit } from './functions';
import LoginNow from '../LoginNow/LoginNow';
import { TOAST_VARIATION } from '../constants';
import './RefundTrackForm.scss';
import validateField, { isFormValid } from './functions/validateField';

const RefundTrackForm = ({ aemData, pageType }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState('');
  const [isButtonDisable, setButtonDisable] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    pnr: '',
    justpayId: '',
    errors: {
      pnr: '',
      email: '',
      justpayId: '',
    },
    isLoading: false,
  });

  const onChangeTab = (index) => {
    setActiveTab(index);
    setButtonDisable(true);
    if (index === 0) {
      setFormData({
        ...formData,
        justpayId: '',
        errors: {
          pnr: '',
          email: '',
          justpayId: '',
        },
      });
    } else {
      setFormData({
        ...formData,
        pnr: '',
        email: '',
        errors: {
          pnr: '',
          email: '',
          justpayId: '',
        },
      });
    }
  };
  const onChangeForm = (key, value) => {
    const updatedFormData = {
      ...formData,
      [key]: value,
      errors: { ...formData.errors, [key]: '' },
    };
    const errorMessages = aemData?.refundErrorMessages;
    const validationErrors = validateField(
      updatedFormData,
      activeTab,
      errorMessages,
    );
    const isPNRInvalid = activeTab === 0 && validationErrors.pnr;
    const isEmailInvalid = activeTab === 0 && validationErrors.email;
    const isFormValidState = isFormValid(activeTab, updatedFormData);
    setFormData(() => ({
      ...updatedFormData,
      isLoading: false,
      errors: {
        ...updatedFormData.errors,
        pnr: isPNRInvalid ? validationErrors.pnr : '',
        email: isEmailInvalid ? validationErrors.email : '',
      },
    }));
    setButtonDisable(isPNRInvalid || !isFormValidState || !isFormValidState);
  };

  const tabProps = {
    tabs: [
      { title: aemData?.pnrLabel, checked: false },
      { title: aemData?.juspayIdLabel, checked: false },
    ],
    content: [
      <div>
        <Input
          placeholder={aemData?.pnrBookingPlaceholder}
          name="pnr-booking-ref"
          customErrorMsg={formData?.errors.pnr}
          onChange={(e) => onChangeForm('pnr', e.target.value.toUpperCase())}
          inputWrapperClass="mb-0"
          value={formData.pnr}
          maxLength={6}
        />
        <Input
          placeholder={aemData?.emailNamePlaceholder}
          name="email-last-name"
          customErrorMsg={formData?.errors.email}
          onChange={(e) => onChangeForm('email', e.target.value)}
          maxLength={32}
          inputWrapperClass="mb-0"
          value={formData.email}
        />
      </div>,
      <Input
        placeholder={aemData?.juspayIdPlaceholder}
        name="justpay-id"
        customErrorMsg={formData?.errors.justpayId}
        onChange={(e) => onChangeForm('justpayId', e.target.value)}
        minLength={21}
        maxLength={21}
        inputWrapperClass="mb-0"
        value={formData.justpayId}
      />,
    ],
    defaultActiveTab: activeTab,
    showSingleTabBtn: false,
    onChangeTab,
  };

  const toastProps = {
    description: alert,
    onClose: () => setAlert(''),
    infoIconClass: 'icon-close-solid ',
    variation: TOAST_VARIATION.ERROR,
    autoDismissTimeer: 10000,
  };
  return (
    <div>
      <div className="refund_tracker_wrapper">
        <h4 className="skyplus-heading h5 body-small-regular">
          {aemData?.bookingTitle}
        </h4>
        <HtmlBlock
          tagName="h4"
          className="skyplus-heading  h4"
          html={aemData?.bookingDescription?.html?.slice(4)}
        />
        <div className="tab__wrapper">
          <TabsContainer {...tabProps} />
        </div>
        <div className="d-block ">
          <Button
            key={aemData?.getStartedCTALabel}
            onClick={() => onSubmit(aemData, formData, setFormData, setAlert, activeTab)}
            block
            type="submit"
            disabled={isButtonDisable}
            loading={formData?.isLoading}
          >
            {aemData?.getStartedCTALabel}
          </Button>
        </div>
      </div>
      <LoginNow aemData={aemData} pageType={pageType} />
      {alert && <Toast {...toastProps} />}
    </div>
  );
};
RefundTrackForm.propTypes = {
  aemData: any,
  pageType: string,
};
export default RefundTrackForm;
