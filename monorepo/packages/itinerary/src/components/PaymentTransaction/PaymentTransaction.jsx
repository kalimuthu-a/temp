import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { useSelector } from 'react-redux';
import { CONSTANTS } from '../../constants';
import {
  formatDate,
  UTIL_CONSTANTS,
  formatCurrencyFunc,
} from '../../utils';

const PaymentTransaction = ({ acknowledgePaymentStausFlag }) => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const mfDataObj = mfData?.itineraryMainByPath?.item || {};
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const { paymentDetailsLabel, paymentStatusLabels,
    transactionIdLabel, copyLabel, paymentDetailsDescription, bookingStatus, paymentDetailsNote } = mfDataObj;
  const { bookingDetails, priceBreakdown } = itineraryApiData;
  const transactionIdLabelValue = transactionIdLabel?.replace('{transactionId}', ' ');

  const [bookingStatusState, setBookingStatusState] = useState(null);
  const [isPaymentRequired, setPaymentRequired] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const bookingHoldDate = bookingDetails?.holdDate
    ? formatDate(bookingDetails?.holdDate, UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER) : '';

  const getOrderId = () => {
    const thisUrl = new URL(window.location.href);
    return thisUrl?.searchParams.get('order_id');
  };

  useEffect(() => {
    if (!bookingStatusState) {
      const bookingData = bookingStatus?.filter(
        (bookingState) => (bookingState?.key === bookingDetails?.bookingStatus)
        && (bookingDetails?.paymentStatus !== CONSTANTS.PAYMENT_STATUS.COMPLETED)
        && (bookingDetails?.bookingStatus === CONSTANTS.BOOKING_STATUS.HOLD),
      )[0];
      setBookingStatusState(bookingData);
      if (bookingDetails?.bookingStatus === CONSTANTS.BOOKING_STATUS.HOLD) {
        setPaymentRequired(true);
      }
      if (bookingDetails?.isFlexPay && (bookingDetails?.paymentStatus === CONSTANTS.PAYMENT_STATUS.PENDING)) {
        setShowNote(true);
      }
    }
  }, [!bookingStatusState, bookingStatus]);
  let paymentStatusLower = bookingDetails?.paymentStatus?.toLowerCase();
  const transactionIdQueryParam = getOrderId();
  // eslint-disable-next-line no-shadow
  const copyTextFromElements = () => {
    try {
      navigator.clipboard.writeText(
        bookingDetails?.transactionId
        || bookingDetails?.numericRecordLocator
        || transactionIdQueryParam,
      );
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    } catch (error) {
      // Error Hanlding
    }
  };

  if (acknowledgePaymentStausFlag === CONSTANTS.PAYMENT_POLLING_STATUS_KEY.PAYMENTV2_NOT_CONFIRMED) {
    paymentStatusLower = 'notconfirmed';
  }
  const copyClipBoardLabel = 'Copied to clipboard';

  const fpDueAmount = priceBreakdown?.balanceDue;
  const fpPaidAmount = (
    priceBreakdown?.taxAmountList
      ?.find((tax) => tax.feeCode === CONSTANTS.FLEXPAY_HOLD_FEE)
  )?.value;

  const descriptionHintText = () => {
    return paymentDetailsNote?.replace('{paidAmount}', formatCurrencyFunc(
      { price: fpPaidAmount, currencycode: bookingDetails?.currencyCode },
    ))
      ?.replace(
        '{balanceDue}',
        formatCurrencyFunc(
          { price: fpDueAmount, currencycode: bookingDetails?.currencyCode },
        ),
      );
  };

  return (
    <div className={`payment-transaction ${bookingDetails?.isFlexPay && 'mt-5'}`}>
      <div className="payment-transaction__header">
        <strong className="payment-transaction__header__heading">{paymentDetailsLabel}</strong>
        <span className={`payment-transaction__header__status ${paymentStatusLower}`}>
          {paymentStatusLower && (paymentStatusLabels?.[paymentStatusLower] || bookingStatusState?.key)}
        </span>
      </div>
      <div className="payment-transaction__container">
        <div className="payment-transaction__container__transaction">
          <div className="payment-transaction__container__transaction__block">
            <span className="payment-transaction__container__transaction__id">
              {transactionIdLabelValue}
            </span>
            <span className="payment-transaction__container__transaction__number">
              {bookingDetails?.transactionId || transactionIdQueryParam}
            </span>
          </div>
          <div className={`tooltip ${showTooltip ? 'visible' : ''}`}>
            <span className="tooltiptext" id="paymentTooltip">
              {copyClipBoardLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={copyTextFromElements}
            className="btn btn-primary payment-transaction__container__transaction__copy"
          >
            {copyLabel}
          </button>
        </div>
        <div className="payment-transaction__container__description mb-4"><p>{paymentDetailsDescription}</p></div>
        {showNote && (
        <div className="payment-transaction__container__transaction__note hold">
          <Icon
            className="icon-info"
            role="button"
            aria-label="close note text"
          />
          <div
            className="description"
            dangerouslySetInnerHTML={
            { __html: descriptionHintText() }
            }
          />
        </div>
        )}
        {isPaymentRequired && (
        <div className="payment-transaction__container__transaction__block hold">
          <button
            type="button"
            aria-label="cross"
            className="icon-close-simple"
            onClick={() => { setPaymentRequired(false); }}
          />
          <span
            className="description"
            dangerouslySetInnerHTML={{
              __html: bookingStatusState?.description?.html.replace('{date}', bookingHoldDate),
            }}
          />
        </div>
        )}
      </div>
    </div>
  );
};

PaymentTransaction.propTypes = {
  acknowledgePaymentStausFlag: PropTypes.string,
};

export default PaymentTransaction;
