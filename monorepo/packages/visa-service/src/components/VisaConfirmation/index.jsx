import React, { useState, useEffect } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AESEncryptCtr } from 'skyplus-design-system-app/dist/des-system/aes-ctr';
import PropTypes from 'prop-types';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';
import { AppContext } from '../../context/AppContext';
import PaymentTransaction from './PaymentTransaction/PaymentTransaction';
import VisaBookingCard from '../commonComponents/VisaBookingCard/VisaBookingCard';
import { confirmBookingPayment, getBookingStatus } from '../../services';
import BookingInfo from '../VisaPaxSelector/BookingInfo/BookingInfo';
import VisaPaxAccordionWrapper, { VisaPaxCard } from '../commonComponents/VisaPaxSelection/VisaPaxAccordionWrapper';
import VisaPaymentDetails from '../commonComponents/VisaPaymentDetails/VisaPaymentDetails';
import { calculateAgeCategories, daysUntil, pushAnalytic } from '../../utils/analyticEvents';
import { ENCRYPT_VALUE, EVENTS_NAME } from '../../utils/analytic';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';
import VisaSrpShimmer from '../commonComponents/Shimmer/VisaSrpShimmer';
import ConfirmationBanner from '../commonComponents/ConfirmationBanner/ConfirmationBanner';
import InvoiceDownload from './DownloadInvoice';
import DownloadInvoice from './DownloadInvoice/common/DownloadInvoice';
import VisaTravellerForm from '../VisaTravellerDetails/VisaTravellerForm/VisaTravellerForm';
import { formatDate, UTIL_CONSTANTS } from '../../utils';
import PaymentCustomerSurpport from '../commonComponents/PaymentCustomerSupport/PaymentCustomerSupport';

const VisaConfirmation = ({ bookingId, pnr }) => {
  const {
    state: {
      visaBookingDetailsByPath,
      bookingConfirmation,
      visaReviewApplicationByPath,
      visaUploadDocumentsByPath,
    },
    dispatch,
  } = React.useContext(AppContext);
  const [visaGetVisaBooking, setGetVisaBooking] = useState(null);
  const [visaConfirmPayment, setVisaConfirmPayment] = useState(null);
  const { travellerDetailsLabel = '', stayLabel, validityLabel,
    travelDatesLabel, bookingIdLabel,
    saveShareOptions,
  } = visaBookingDetailsByPath || {};
  const [isMobile] = useIsMobile();

  const visaBookingDetailsProps = {
    date: visaGetVisaBooking?.bookingDetails?.dateOfTravel && new Date(visaGetVisaBooking.bookingDetails.dateOfTravel),
    bookingIdLabel: bookingIdLabel || '',
    bookingId: visaGetVisaBooking?.bookingDetails?.bookingId,
    destination: visaGetVisaBooking?.visaBookingBrief?.country,
    entryType: visaGetVisaBooking?.visaBookingBrief?.entryType,
    stayDuration: visaGetVisaBooking?.visaBookingBrief?.stayPeriod,
    validity: visaGetVisaBooking?.visaBookingBrief?.validity || 0,
    travelDate: visaGetVisaBooking?.bookingDetails?.dateOfTravel
      && new Date(visaGetVisaBooking.bookingDetails.dateOfTravel),
    isIconRequired: false,
    expectationJourneyCategory: visaGetVisaBooking?.bookingDetails?.bookingType || '',
    stayLabel,
    validityLabel,
    travelDatesLabel,
  };
  // side pannel adjustment
  useSidePanelAdjustments(false);

  const sendDataToAnalytic = async (bookingVisaStatus, paymentDetail) => {
    const { stayPeriod, entryType, visaType, country, validity } = bookingVisaStatus?.visaBookingBrief || {};
    const {
      dateOfTravel,
      bookingStatus,
      bookingId: bookId,
      partnerBookingId,
    } = bookingVisaStatus?.bookingDetails || {};
    const ageResult = calculateAgeCategories(bookingVisaStatus.travelerBasicDetails);

    // get original pax list from Itneary
    let optedPax = '';
    try {
      const visaPaxLength = bookingVisaStatus?.travelerBasicDetails?.length || 0;
      optedPax = `${visaPaxLength}`;
    } catch {
      //  localStorage data may not be present
    }

    // visaDates
    let expectedData = '';
    if (
      Array.isArray(bookingVisaStatus?.expectationJourneySteps)
      && bookingVisaStatus?.expectationJourneySteps?.length > 0
    ) {
      const lastStepIndex = (bookingVisaStatus?.expectationJourneySteps?.length ?? 0) - 1;
      expectedData = bookingVisaStatus?.expectationJourneySteps?.[lastStepIndex]?.expectedDate;
      expectedData = expectedData ? formatDate(
        new Date(expectedData),
        UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY,
      ) : '';
    }

    const userDetail = bookingVisaStatus.travelerBasicDetails.filter((t) => t.primaryTraveler)?.[0];
    const user = {
      firstName: AESEncryptCtr(userDetail.firstName, '', ENCRYPT_VALUE) || '',
      lastName: AESEncryptCtr(userDetail.lastName, '', ENCRYPT_VALUE) || '',
      email: AESEncryptCtr(userDetail.emailId, '', ENCRYPT_VALUE) || '',
      phone: AESEncryptCtr(userDetail.cell, '', ENCRYPT_VALUE) || '',
      title: AESEncryptCtr(userDetail.title, '', ENCRYPT_VALUE) || '',
    };

    const productInfo = {
      ...ageResult,
      visaName: `${stayPeriod} ${entryType}`,
      visaEntryType: `${entryType}`,
      visaType,
      visaValidity: validity,
      visaStay: stayPeriod,
      pnr: partnerBookingId,
      sector: country,
      departureDates: dateOfTravel ? formatDate(
        new Date(dateOfTravel),
        UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY,
      ) : '',
      daysUntilVisa: String(daysUntil(expectedData)),
      visaDates: expectedData,
      optedPax,
      bookingID: bookId,
      bookingstatus: bookingStatus,
      transactionID: paymentDetail?.transactionDetails?.transactionId || bookingId,
      isNewBooking: '1',
      paymentAmount: bookingVisaStatus.totalAmount,
    };

    pushAnalytic({
      event: 'VisaSuccess',
      data: {
        _event: EVENTS_NAME.VISA_SUCCESS,
        pageName: 'Visa Successful',
        productInfo,
        user,
      },
    });
  };

  useEffect(() => {
    // Hiding booking widget from traveller details
    const bookingheaderEle = document.querySelector('.booking-widget-header');
    const quickAction = document.getElementById('quick-actions');
    const rightAEMBookingSection = document.getElementById('booking-details');

    // removing aem content from our UI confirmation details page
    if (rightAEMBookingSection) {
      rightAEMBookingSection.style.display = 'none';
    }
    if (!isMobile && bookingheaderEle) {
      bookingheaderEle.style.display = 'none';
    }
    if (isMobile && bookingheaderEle) {
      bookingheaderEle.style.display = 'flex';
      bookingheaderEle?.classList?.remove('d-none');
      bookingheaderEle.style.width = 'calc(100% - 60px)';
    }
    if (isMobile && quickAction) {
      quickAction.style.display = 'none';
    }
    const bookingStatusApiCalling = async () => {
      const confirmBooking = await confirmBookingPayment(bookingId, pnr);
      if (confirmBooking && confirmBooking?.data) {
        setVisaConfirmPayment(confirmBooking?.data);
        const bookingVisaStatus = await getBookingStatus(bookingId, pnr, true);
        if ((bookingVisaStatus && bookingVisaStatus?.isSuccess) || (bookingVisaStatus?.data)) {
          dispatch({ type: 'VISA_BOOKING_STATUS', payload: bookingVisaStatus?.data });
          setGetVisaBooking(bookingVisaStatus?.data);
          sendDataToAnalytic(bookingVisaStatus?.data, confirmBooking?.data);
        }
      }
    };
    if (!visaGetVisaBooking) {
      bookingStatusApiCalling();
    }
  }, [visaGetVisaBooking]);

  return (
    visaGetVisaBooking ? (
      <>
        <VisaHeaderSection headingText={bookingConfirmation?.bookingLabel || 'Booking'} />
        <div className="visa-confirmation">
          <ConfirmationBanner
            bookingData={visaGetVisaBooking}
            transactionCode={visaConfirmPayment?.transactionDetails?.transactionCode}
          />
          {isMobile && visaConfirmPayment?.transactionDetails?.transactionCode === '2' && (
            <InvoiceDownload
              bookingId={bookingId}
              pnr={pnr}
              sector={visaGetVisaBooking?.visaBookingBrief?.country}
              quickAction={saveShareOptions?.[0]}
              decryptBookingId={visaGetVisaBooking?.bookingDetails?.bookingId || ''}
              decryptPnr={visaGetVisaBooking?.bookingDetails?.partnerBookingId || ''}
            />
          )}
          <PaymentTransaction
            transactionCode={visaConfirmPayment?.transactionDetails?.transactionCode || 3}
            transactionId={visaConfirmPayment?.transactionDetails?.transactionId}
          />
          <BookingInfo
            isVisaBooking
            pnr={visaGetVisaBooking?.bookingDetails?.bookingId || ''}
            stayDuration={visaGetVisaBooking?.visaBookingBrief?.stayPeriod}
            travellerPax={visaGetVisaBooking?.bookingDetails?.totalTravelers || 0}
            bookingIdLabel={bookingIdLabel || ''}
            heading={
              visaUploadDocumentsByPath?.touristVisaLabel?.html?.replace(
                '{Country}',
                visaGetVisaBooking?.visaBookingBrief?.country,
              )
            }
            isVisaDetail
          />
          <div className="visa-confirmation-visa-details">
            <Heading
              heading="h4"
              mobileHeading="h4"
              containerClass="visa-confirmation-heading"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: visaReviewApplicationByPath?.visaDetailsLabel,
                }}
              />
            </Heading>
            <VisaBookingCard
              bookingDetails={visaBookingDetailsProps}
              hideDate
            />
          </div>
          <Heading
            heading="h4"
            mobileHeading="h4"
            containerClass="visa-confirmation-heading"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: travellerDetailsLabel,
              }}
            />
          </Heading>
          {visaGetVisaBooking && visaGetVisaBooking?.travelerBasicDetails?.map((list, index) => {
            const passenger = list;
            passenger.name = `${passenger?.firstName} ${passenger?.lastName}`;
            return (
              <VisaPaxAccordionWrapper
                key={passenger?.travelerId}
                titleComponent={(
                  <VisaPaxCard
                    key={passenger.travelerId}
                    pax={passenger}
                    isSelected={false}
                    onSelect={() => { }}
                    trackVisaStatus
                    isPOC={false}
                    passengerInfoCreateBooking
                    index={index}
                  />
                )}
                contentComponent={(
                  <VisaTravellerForm
                    setIsButtonDisabled={() => { }}
                    index={index}
                    formData={visaGetVisaBooking?.travelerBasicDetails}
                    setFormData={() => { }}
                    isAgree={false}
                    pageType="confirmation"
                  />
                )}
                containerClassName="booking-details-container-accordian"
              />
            );
          })}
          {visaGetVisaBooking && <VisaPaymentDetails priceBreakDown={visaGetVisaBooking} />}
          {visaConfirmPayment?.transactionDetails?.transactionCode === '2' && (
          <DownloadInvoice
            bookingId={bookingId}
            pnr={pnr}
            sector={visaGetVisaBooking?.visaBookingBrief?.country}
            quickAction={saveShareOptions?.[0]}
            decryptBookingId={visaGetVisaBooking?.bookingDetails?.bookingId || ''}
            decryptPnr={visaGetVisaBooking?.bookingDetails?.partnerBookingId || ''}
          />
          )}
          <PaymentCustomerSurpport />
        </div>
      </>
    ) : <VisaSrpShimmer />
  );
};

VisaConfirmation.propTypes = {
  bookingId: PropTypes.string,
  pnr: PropTypes.string,
};

export default VisaConfirmation;
