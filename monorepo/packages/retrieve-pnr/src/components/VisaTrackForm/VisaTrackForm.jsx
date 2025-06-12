import React, { useEffect, useState } from 'react';
import TabsContainer from 'skyplus-design-system-app/dist/des-system/TabsContainer';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import { any, string } from 'prop-types';
import { onSubmit } from './functions';
import LoginNow from '../LoginNow/LoginNow';
import { TOAST_VARIATION } from '../constants';
import './VisaTrackForm.scss';
import validateField, { isFormValid } from './functions/validateField';
import analyticEvents from '../../utils/analyticEvents';
import { interactions, PAGE, VALUES, VISA_PAGE_LOAD } from '../../constants/analytic';

const VisaTrackForm = ({ aemData, pageType }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState('');
  const [isButtonDisable, setButtonDisable] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    pnr: '',
    bookingId: '',
    errors: {
      pnr: '',
      email: '',
      bookingId: '',
    },
    isLoading: false,
  });

  const onChangeTab = (index) => {
    setActiveTab(index);
    setButtonDisable(true);
    if (index !== 0) {
      setFormData({
        ...formData,
        bookingId: '',
        errors: {
          pnr: '',
          email: '',
          bookingId: '',
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
          bookingId: '',
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
    const isPNRInvalid = activeTab !== 0 && validationErrors.pnr;
    const isEmailInvalid = activeTab !== 0 && validationErrors.email;
    const isFormValidState = isFormValid(1, updatedFormData);
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
      { title: aemData?.visaBookingIdLabel, checked: false },
    ],
    content: [
      <div className="visa_track_wrapper-tab-container">
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
          placeholder={aemData?.juspayIdPlaceholder}
          name="booking-id"
          customErrorMsg={formData?.errors.bookingId}
          onChange={(e) => onChangeForm('bookingId', e.target.value)}
          minLength={21}
          maxLength={21}
          inputWrapperClass="mb-0"
          value={formData.bookingId}
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

  // tsd page load
  useEffect(() => {
    analyticEvents({
      event: VISA_PAGE_LOAD,
      data: {
        _event: interactions.PAGE_LOAD,
        LOB: PAGE.VISA,
        pageInfo: {
          pageName: VALUES.VISA_STATUS_LANDING_PAGE,
          journeyFlow: PAGE.VISAFLOW,
          siteSection: PAGE.VISAFLOW,
        },
      },
    });
  }, []);

  return (
    <div>
      <div className="visa_track_wrapper">
        <div className="skyplus-heading visa_track_wrapper-sub-heading">
          {aemData?.bookingTitle}
        </div>
        <HtmlBlock
          tagName="h4"
          className="skyplus-heading visa_track_wrapper-title"
          html={aemData?.bookingDescription?.html}
        />
        <div className="tab__wrapper">
          <TabsContainer {...tabProps} />
        </div>
        <div className="d-block ">
          <Button
            key={aemData?.getStartedCTALabel}
            onClick={() => onSubmit(aemData, formData, setFormData, setAlert, 1)}
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
VisaTrackForm.propTypes = {
  aemData: any,
  pageType: string,
};
export default VisaTrackForm;
