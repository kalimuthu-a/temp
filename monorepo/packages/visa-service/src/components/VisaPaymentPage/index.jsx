import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../context/AppContext';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';
import { convertDate, formatCurrencyFunc } from '../../utils';
import { getBookingStatus } from '../../services';
import BookingSummaryShimmer from '../commonComponents/Shimmer/BookingSummaryShimmer';
import BookingSummary from '../commonComponents/BookingSummary/BookingSummary';

const VisaPaymentPage = ({ bookingId, pnr }) => {
  const { state: { visaBookingDetailsByPath,
    visaBookingStatus,
    visaBookingSummaryByPath,
    visaUploadDocumentsByPath,
  }, dispatch } = useContext(AppContext);

  const { stayLabel, validityLabel,
  } = visaBookingDetailsByPath || {};

  // side pannel adjustment
  useSidePanelAdjustments(true);
  const bookingheaderEle = document.querySelector('.booking-widget-header');
  const visaHeaderEle = document.querySelector('.header');
  const visaBackCtaEle = document.querySelector('.back-btn');
  const footerEle = document.querySelector('.footer');
  if (visaBackCtaEle) {
    visaBackCtaEle.style.display = 'none';
  }
  if (bookingheaderEle) {
    bookingheaderEle.style.display = 'none';
    visaHeaderEle.style.display = 'none';
    if (footerEle) {
      footerEle.style.display = 'none';
    }
  }

  useEffect(() => {
    const bookingStatus = async () => {
      const bookingVisaStatus = await getBookingStatus(bookingId, pnr, true);
      if (bookingVisaStatus && bookingVisaStatus?.isSuccess) {
        dispatch({ type: 'VISA_BOOKING_STATUS', payload: bookingVisaStatus?.data });
      }
    };
    if (bookingId) {
      bookingStatus();
    }
    bookingStatus();
  }, []);

  const bookingSummaryProps = {
    title: visaBookingSummaryByPath?.bookingSummaryTitle,
    travelerCount: visaBookingStatus?.travelerBasicDetails?.length || 0,
    paymenttitle: visaBookingSummaryByPath?.paymentSummaryLabel,
    departureText: visaBookingSummaryByPath?.departingLabel,
    departureDate: visaBookingStatus?.bookingDetails?.bookingDate
      ? convertDate(new Date(visaBookingStatus?.bookingDetails?.bookingDate)) : null,
    visaText: visaUploadDocumentsByPath?.touristVisaLabel?.html?.replace('{Country}', visaBookingStatus?.description),
    visaDays: `${visaBookingStatus?.visaBookingBrief?.stayPeriod} 
    | ${visaBookingStatus?.visaBookingBrief?.entryType} 
    | ${validityLabel} : ${visaBookingStatus?.visaBookingBrief?.validity}<br/> 
      ${stayLabel} : ${visaBookingStatus?.visaBookingBrief?.stayPeriod} `,
    visaAmount: formatCurrencyFunc({
      price: visaBookingStatus?.amount || 0,
      currencycode: 'INR',
    }),
  };

  return (
    visaBookingStatus ? (
      <BookingSummary bookingSummaryData={bookingSummaryProps} />
    ) : <BookingSummaryShimmer />
  );
};

VisaPaymentPage.propTypes = {
  bookingId: PropTypes.string,
  pnr: PropTypes.string,
};

export default VisaPaymentPage;
