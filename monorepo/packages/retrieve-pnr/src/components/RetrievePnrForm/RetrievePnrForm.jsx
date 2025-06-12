/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import PropTypes from 'prop-types';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { useCustomEventListener } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import { CONSTANTS, CUSTOM_EVENTS, PAGES } from '../constants';
import RefundTrackForm from '../RefundTrackForm';
import GstInvoiceForm from '../GstInvoiceForm';
import LoginNow from '../LoginNow/LoginNow';
import { submitHandler, validateForm } from './utils';
import gtmEvents from '../../utils/gtmEvents';
import { GTM_ANALTYTICS } from '../../constants/analytic';
import UpdateContactNote from '../UpdateContactNote/UpdateContactNote';
import { emailItineraryReq } from '../../services';
import analyticEvents from '../../utils/analyticEvents';
import VisaTrackForm from '../VisaTrackForm';
import SingleRowRetrievePnrForm from '../SingleRowRetrievePnrForm/SingleRowRetrievePnrForm';

const RetrievePnrForm = ({ aemData = {}, pageType }) => {
  const [formData, setFormData] = useState({
    pnr: '',
    email: '',
    errors: {
      pnr: true,
      email: true,
    },
    isLoading: false,
    otherCtaLoading: false,
  });
  const [alert, setAlert] = useState(false);
  const [toastMsg, setToastMsg] = useState({ status: '', msg: '' });
  const [isShowRefundClaimForm, setIsShowRefundClaimForm] = useState(true);
  const creditShell = 'Credit Shell';
  const onChangeForm = (key, value) => {
    const formTemp = { ...formData, [key]: value };
    const errors = validateForm(formTemp);
    setFormData({
      ...formTemp,
      errors,
    });
  };

  const config = {
    'web-check-in': {
      apiflag: 'checkin',
      buttonList: [
        {
          label: aemData?.getStartedCTALabel,
          buttonVariation: 'filled',
          href: aemData?.primaryCtaPath,
          toastTitle: 'Web CheckIn',
          pageName: 'Web Check-in',
          flow: 'Check-in',
          eventName: 'Check-in',
          className: 'w-50',
          hrefBau: aemData?.primaryCtaBauPath,
        },
      ],
    },
    'change-flight': {
      apiflag: 'change-flight',
      buttonList: [
        {
          label: aemData?.getStartedCTALabel,
          buttonVariation: 'filled',
          href: aemData?.primaryCtaPath,
          toastTitle: 'Change Flight',
          pageName: 'Change Flight',
          flow: 'Change-flight',
          eventName: 'Change-flight',
          className: 'w-50',
          hrefBau: aemData?.primaryCtaBauPath,
        },
      ],
    },
    'update-contact-details': {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      apiflag: 'update-contact-details',
      buttonList: [
        {
          label: aemData?.getStartedCTALabel,
          buttonVariation: 'filled',
          href: aemData?.primaryCtaPath,
          toastTitle: 'Update Contact Details',
          pageName: 'Update Contact Details',
          flow: 'update-contact-details',
          eventName: 'update-contact-details',
          className: 'w-50',
          hrefBau: aemData?.primaryCtaBauPath,
        },
      ],
    },
    'split-pnr-details': {
      apiflag: pageType,
      buttonList: [
        {
          label: aemData?.retrieveBookingCtaText,
          buttonVariation: 'filled',
          href: aemData?.retrieveBookingCtaLink,
          toastTitle: 'Split PNR Details',
          pageName: 'Split PNR Details',
          flow: pageType,
          eventName: pageType,
          className: 'w-50',
          hrefBau: aemData?.retrieveBookingCtaLink,
        },
      ],
    },
    'edit-booking': {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      apiflag: 'edit-booking',
      buttonList: [
        {
          label: aemData?.getStartedCTALabel,
          buttonVariation: 'filled',
          href: aemData?.primaryCtaPath,
          toastTitle: 'Edit Booking',
          pageName: 'Edit Booking',
          flow: 'edit-booking',
          eventName: 'edit-booking',
          className: 'w-50',
          hrefBau: aemData?.primaryCtaBauPath,
        },
      ],
    },
    'credit-shell': {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      apiflag: 'credit-shell',
      buttonList: [
        {
          label: 'Email Itinerary',
          buttonVariation: 'outline',
          href: '#',
          toastTitle: creditShell,
          pageName: creditShell,
          flow: 'credit-shell',
          eventName: 'credit-shell',
          className: 'w-50',
          hrefBau: aemData?.primaryCtaBauPath,
          emailItinerary: true,
        },
        {
          label: aemData?.getStartedCTALabel,
          buttonVariation: 'filled',
          href: aemData?.primaryCtaPath,
          toastTitle: creditShell,
          pageName: creditShell,
          flow: 'credit-shell',
          eventName: 'credit-shell',
          className: 'w-50',
          hrefBau: aemData?.primaryCtaBauPath,
        },
      ],
    },
    'my-bookings': {
      apiflag: 'modified',
      buttonList: [
        {
          label: aemData?.getStartedCTALabel,
        },
      ],
    },
    'info-contact-us': {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      apiflag: 'info-contact-us',
      buttonList: [
        {
          label: aemData?.getStartedCTALabel,
          buttonVariation: 'filled',
          href: aemData?.getStartedCtaLink,
          toastTitle: 'Info Contact-us',
          pageName: 'info-contact-us',
        },
      ],
    },
    default: {
      buttonList: [],
    },
  };

  const configItem =
    config[window.pageType] ||
    config['web-check-in'] ||
    config['split-pnr-details'];

  const bindWithDeepLinkUrl = (refurlPath) => {
    const pnr = formData.pnr || '';
    let baseUrl =
      'https://comm-uat.goindigo.in/IndiGo-Dev2/Booking/SkyplusGenericDeepLinkApp?cid=skyplus';
    if (window?.msd?.bridgeDeepLinkPath) {
      baseUrl = window.msd.bridgeDeepLinkPath;
    }
    const refurl = refurlPath?.startsWith('/')
      ? window.location.origin + refurlPath
      : refurlPath;
    const lastname = formData?.email || '';
    let queryKey = 'email';
    if (CONSTANTS.REGEX_LIST.ONLY_CHARS_FIELD.test(lastname)) {
      queryKey = 'lastname';
    }
    const deepLinkUrl = `${baseUrl}&pnr=${pnr}&${queryKey}=${lastname}&refurl=${refurl}`;
    window.open(deepLinkUrl, '_self');
  };

  const onClickSubmit = async (label) => {
    if (Object.keys(formData.errors).length > 0) {
      return;
    }

    if (pageType === PAGES?.MY_BOOKINGS) {
      analyticEvents({
        data: {
          _event: 'getStarted',
          pageInfo: {
            pageName: 'My Bookings',
            siteSection: 'User Profile Flow',
            journeyFlow: 'User Profile Flow',
          },
          eventInfo: {
            name: label,
            position: 'Flight',
            component: 'My Bookings',
          },
          productInfo: {
            pnr: formData?.pnr || '',
            bookingReference: formData?.pnr || '',
          },
        },
        event: 'get_started',
      });
    }

    if (pageType === PAGES?.WEB_CHECK_IN) {
      gtmEvents({
        event: GTM_ANALTYTICS.EVENTS.GET_STARTED,
        data: {
          PNR: formData.pnr,
          Airline: '',
          OD: '',
          trip_type: '',
          pax_details: ' ',
          departure_date: '',
          special_fare: '',
          flight_sector: '',
          flight_type: '',
          coupon_code: '',
          days_until_departure: '',
          booking_purpose: '',
        },
      });
    }

    setFormData((prev) => ({ ...prev, isLoading: true }));
    const response = await submitHandler(
      formData.pnr,
      formData.email,
      configItem.apiflag,
    );

    if (response.isSuccess) {
      if (pageType === PAGES.SPLIT_PNR) {
        window.location.href = aemData?.retrieveBookingCtaLink;
        return;
      }

      if (response.isInternational) {
        const link = aemData?.getStartedInternationalCtaLink;
        if (link?.includes('bau=1')) {
          bindWithDeepLinkUrl(link);
          return;
        }
      }

      window.location.href = aemData?.getStartedCtaLink;
      // Redirection Happens here;
    } else {
      setAlert(response.aemError.message);
    }
    setFormData((prev) => ({ ...prev, isLoading: false }));
  };

  const onClickItinerary = async () => {
    if (Object.keys(formData.errors).length > 0) {
      return;
    }
    setFormData((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await submitHandler(
        formData.pnr,
        formData.email,
        configItem.apiflag,
        true,
      );
      if (!response.isError) {
        window.location.href = aemData?.getStartedCtaLink;
      } else {
        setAlert(response?.aemError?.message);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching itinerary', error);
    }
    setFormData((prev) => ({ ...prev, isLoading: false }));
  };

  const onCloseAlert = () => {
    setAlert('');
    if (toastMsg?.msg !== '') {
      setToastMsg({ status: '', msg: '' });
    }
  };

  const onClickEmailItinerary = async () => {
    setFormData((prev) => ({ ...prev, otherCtaLoading: true }));
    const data = await emailItineraryReq(formData.pnr, formData.email);
    const messageStr =
      aemData?.emailItinerarySuccessMsg ||
      'Your Itinerary details sent you on email successfully';
    if (data?.success || data?.isSuccess) {
      setToastMsg({ status: true, msg: messageStr });
      setFormData((prev) => ({ ...prev, otherCtaLoading: false }));
    } else {
      const err =
        Array.isArray(data?.errors) && data.errors.length
          ? data.errors[0]
          : data.error || data.errors;
      const code = typeof (err?.code) === 'string' ? err?.code?.trim() : err?.code;
      const getErrorMsg = getErrorMsgForCode(code);
      const { message } = getErrorMsg;
      setToastMsg({ status: false, msg: message });
      setFormData((prev) => ({ ...prev, otherCtaLoading: false }));
    }
  };

  useCustomEventListener(
    CUSTOM_EVENTS.HANDLE_SHOW_REFUND_CLAIM_FORM,
    (data) => {
      setIsShowRefundClaimForm(data?.isRefundClaimFormShow);
    },
  );

  const bookingHtml =
    pageType === PAGES.SPLIT_PNR
      ? aemData?.findYourBookingLabel?.html
      : aemData?.bookingDescription?.html;

  if (pageType === PAGES?.TRACK_REFUND) {
    return <RefundTrackForm aemData={aemData} pageType={pageType} />;
  }

  if (pageType === PAGES?.GST_INVOICE) {
    return <GstInvoiceForm aemData={aemData} pageType={pageType} />;
  }

  if (pageType === PAGES.VISA_TRACK_STATUS) {
    return <VisaTrackForm aemData={aemData} pageType={pageType} />;
  }

  if (pageType === PAGES.INITIATE_REFUND) {
    return <SingleRowRetrievePnrForm aemData={aemData} pageType={pageType}
      isSingleRowRetrievePnrFormVisible={isShowRefundClaimForm} />;
  }

  const handleSubmit = (bItem) => {
    if (pageType === PAGES?.CREDIT_SHELL && bItem?.emailItinerary !== undefined) {
      return onClickEmailItinerary();
    }
    if (pageType === PAGES?.CONTACT_US) {
      return onClickItinerary();
    }
    return onClickSubmit(bItem.label);
  };

  return (
    <div className="retrieve-pnr retrieve-pnr-container">
      {(aemData?.bookingTitle && pageType !== PAGES?.CONTACT_US) ?
        <h2 className="booking-title">{aemData?.bookingTitle}</h2>
        : null}
      {bookingHtml && pageType !== PAGES?.CONTACT_US && <HtmlBlock html={bookingHtml} />}
      <div className={`retrieve-pnr-form rounded-1 mt-12 ${pageType}`}>
        {pageType === PAGES?.CONTACT_US && <HtmlBlock className="retrieve-pnr-form-title" html={bookingHtml} />}
        <Input
          placeholder={
            pageType === PAGES.SPLIT_PNR
              ? aemData?.pnrBookingReferenceLabel
              : aemData?.pnrBookingPlaceholder
          }
          name="pnr-booking-ref"
          onChange={(e) => onChangeForm('pnr', e.target.value.toUpperCase())}
          inputWrapperClass="mb-0"
          value={formData?.pnr}
          maxLength={6}
        />
        <Input
          placeholder={
            pageType === PAGES.SPLIT_PNR
              ? aemData?.emailLastNameLabel
              : aemData?.emailNamePlaceholder
          }
          name="email-last-name"
          onChange={(e) => onChangeForm('email', e.target.value)}
          maxLength={32}
          inputWrapperClass="mb-0"
          value={formData?.email}
        />
        <div className="d-block ">
          {configItem?.buttonList?.map((bItem) => {
            return (
              bItem.label && (
                <Button
                  key={bItem.label}
                  // eslint-disable-next-line
                  onClick={() => handleSubmit(bItem)}
                  disabled={Object.keys(formData?.errors).length > 0}
                  block
                  variant={bItem?.buttonVariation || ''}
                  type="submit"
                  loading={
                    bItem?.emailItinerary !== undefined
                      ? formData?.otherCtaLoading
                      : formData?.isLoading
                  }
                  title={bItem.label}
                  classNames={
                    window.pageType === PAGES?.CREDIT_SHELL &&
                    bItem?.emailItinerary !== undefined
                      ? 'email-itinerary-cta mb-8'
                      : ''
                  }
                >
                  {bItem.label}
                </Button>
              )
            );
          })}
        </div>
      </div>
      {window.pageType !== PAGES?.CONTACT_US &&
      window.pageType !== PAGES?.CHANGE_FLIGHT &&
      window.pageType !== PAGES?.UPDATE_CONTACT_DETAILS &&
      window.pageType !== PAGES?.CREDIT_SHELL &&
      pageType !== PAGES.SPLIT_PNR &&
      window.pageType !== PAGES?.EDIT_BOOKING &&
      window.pageType !== PAGES?.CANCELLATION &&
      window.pageType !== PAGES?.BOARDING_PASS &&
      window.pageType !== PAGES?.REFUND ? (
        <LoginNow aemData={aemData} pageType={pageType} />
        ) : null}
      {window.pageType === PAGES?.UPDATE_CONTACT_DETAILS ||
      window.pageType === PAGES?.CREDIT_SHELL ? (
        <UpdateContactNote aemData={aemData} />
        ) : null}
      {alert && (
        <Toast
          mainToastWrapperClass="wc-toast"
          variation="notifi-variation--Error"
          description={alert}
          containerClass="wc-toast-container"
          onClose={onCloseAlert}
        />
      )}
      {toastMsg?.msg !== '' && (
        <Toast
          mainToastWrapperClass="wc-toast"
          variation={
            toastMsg?.status
              ? 'notifi-variation--Success'
              : 'notifi-variation--Error'
          }
          description={toastMsg?.msg}
          containerClass="wc-toast-container"
          onClose={onCloseAlert}
        />
      )}
    </div>
  );
};

RetrievePnrForm.propTypes = {
  aemData: PropTypes.object,
  analyticsData: PropTypes.shape({
    pageFlow: PropTypes.any,
    pageName: PropTypes.any,
  }),
  pageType: PropTypes.string,
};

export default RetrievePnrForm;
