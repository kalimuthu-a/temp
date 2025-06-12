import React, { useState } from 'react';
import TabsContainer from 'skyplus-design-system-app/dist/des-system/TabsContainer';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import { any, string } from 'prop-types';
import { TOAST_VARIATION, CONSTANTS } from '../constants';
import { onSubmit } from './functions';
import './GstInvoiceForm.scss';
import validateField, { isFormValid } from './functions/validateField';

const GstInvoiceForm = ({ aemData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState('');
  const [isButtonDisable, setButtonDisable] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    pnr: '',
    invoiceNumber: '',
    gstEmail: '',
    errors: {
      pnr: '',
      email: '',
      invoiceNumber: '',
      gstEmail: '',
    },
    isLoading: false,
  });

  const onChangeTab = (index) => {
    setActiveTab(index);
    setButtonDisable(true);
    if (index === 0) {
      setFormData({
        ...formData,
        pnr: '',
        email: '',
        invoiceNumber: '',
        gstEmail: '',
        errors: {
          pnr: '',
          email: '',
          invoiceNumber: '',
          gstEmail: '',
        },
      });
    } else {
      setFormData({
        ...formData,
        invoiceNumber: '',
        gstEmail: '',
        errors: {
          pnr: '',
          email: '',
          invoiceNumber: '',
          gstEmail: '',
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
    const isGstEmailInvalid = activeTab === 1 && validationErrors.gstEmail;
    const isinvoiceNumberInvalid = activeTab === 1 && validationErrors.invoiceNumber;
    const isFormValidState = isFormValid(activeTab, updatedFormData);
    setFormData(() => ({
      ...updatedFormData,
      isLoading: false,
      errors: {
        ...updatedFormData.errors,
        pnr: isPNRInvalid ? validationErrors.pnr : '',
        email: isEmailInvalid ? validationErrors.email : '',
        gstEmail: isGstEmailInvalid ? validationErrors.gstEmail : '',
        invoiceNumber: isinvoiceNumberInvalid ? validationErrors.invoiceNumber : '',
      },
    }));
    setButtonDisable(isPNRInvalid || isGstEmailInvalid ||
      isinvoiceNumberInvalid || !isFormValidState || !isFormValidState);
  };
  const tabProps = {
    tabs: [
      { title: aemData?.pnrLabel, checked: false },
      { title: aemData?.gSTDetailsLabel, checked: false },
    ],
    content: [
      <div className="pnr_gst_inputs">
        <Input
          placeholder={aemData?.pnrBookingPlaceholder}
          customErrorMsg={formData?.errors.pnr}
          onChange={(e) => onChangeForm(CONSTANTS.PNR_BOOKING_REF_KEY, e.target.value.toUpperCase())}
          inputWrapperClass="mb-0"
          value={formData.pnr}
          maxLength={6}
        />
        <Input
          placeholder={aemData?.emailNamePlaceholder}
          customErrorMsg={formData?.errors.email}
          onChange={(e) => onChangeForm(CONSTANTS.EMAIL_LAST_NAME_KEY, e.target.value)}
          maxLength={32}
          inputWrapperClass="mb-0"
          value={formData.email}
        />
      </div>,
      <div className="pnr_gst_inputs"><Input
        placeholder={aemData?.invoiceNumberPlaceholder}
        customErrorMsg={formData?.errors.invoiceNumber}
        onChange={(e) => onChangeForm(CONSTANTS.INVOICE_NUMBER_KEY, e.target.value)}
        minLength={21}
        maxLength={21}
        inputWrapperClass="mb-0"
        value={formData.invoiceNumber}
      />
        <Input
          placeholder={aemData?.gSTEmailPlaceholder}
          customErrorMsg={formData?.errors.gstEmail}
          onChange={(e) => onChangeForm(CONSTANTS.GST_EMAIL_KEY, e.target.value)}
          maxLength={32}
          inputWrapperClass="mb-0"
          value={formData.gstEmail}
        />
      </div>,
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
      <div className="gst_header_wrapper">
        <h4 className="skyplus-heading h5 body-small-regular gst_generate_invoice">
          {aemData?.bookingTitle}
        </h4>
        <HtmlBlock
          tagName="h4"
          className="h4"
          html={aemData?.bookingDescription?.html?.slice(4)}
        />
      </div>
      <div className="gst_invoice_wrapper">
        <div className="gst_tab__wrapper">
          <TabsContainer {...tabProps} />
          <div className="gst_d-block ">
            <Button
              key="Retrieve GST Invoice"
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

      </div>
      {alert && <Toast {...toastProps} />}
    </div>
  );
};
GstInvoiceForm.propTypes = {
  aemData: any,
  pageType: string,
};
export default GstInvoiceForm;
