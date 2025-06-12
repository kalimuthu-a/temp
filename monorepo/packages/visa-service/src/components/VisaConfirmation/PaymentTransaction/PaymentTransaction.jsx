import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CONSTANTS } from '../../../constants';
import { AppContext } from '../../../context/AppContext';
import {
  getStatusClass,
} from '../../../utils';

const PaymentTransaction = ({ transactionCode, transactionId }) => {
  const {
    state: {
      bookingConfirmation,
      getItineraryDetails,
    },
  } = React.useContext(AppContext);

  const mfDataObj = bookingConfirmation || {};
  const { paymentDetailsLabel,
    transactionIdLabel, paymentStatusIssueInformation, bookingStatus } = mfDataObj;
  const { bookingDetails } = getItineraryDetails || {};

  const [bookingStatusState, setBookingStatusState] = useState(null);
  const getOrderId = () => {
    const thisUrl = new URL(window.location.href);
    return thisUrl?.searchParams.get('order_id');
  };

  useEffect(() => {
    if (!bookingStatusState) {
      const bookingData = bookingStatus?.filter(
        (bookingState) => (bookingState?.key === getStatusClass(String(transactionCode)))
        && (bookingDetails?.paymentStatus !== CONSTANTS.PAYMENT_STATUS.COMPLETED)
        && (getStatusClass(String(transactionCode)) === CONSTANTS.BOOKING_STATUS.HOLD),
      )[0];
      setBookingStatusState(bookingData);
    }
  }, [!bookingStatusState, bookingStatus]);

  const transactionIdQueryParam = getOrderId();

  return (
    <div className={`payment-transaction ${bookingDetails?.isFlexPay && 'mt-5'}`}>
      <div className="payment-transaction__header">
        <strong className="payment-transaction__header__heading">{paymentDetailsLabel || 'Payment details'}</strong>
        <span className={`payment-transaction__header__status ${getStatusClass(String(transactionCode))}`}>
          {getStatusClass(String(transactionCode))}
        </span>
      </div>
      <div className="payment-transaction__container">
        <div className="payment-transaction__container__transaction">
          <div className="payment-transaction__container__transaction__block w-100">
            <span className="payment-transaction__container__transaction__id">
              {transactionIdLabel || 'Transaction ID: '}
            </span>
            <span className="payment-transaction__container__transaction__number">
              {transactionId || transactionIdQueryParam || '366465858787'}
            </span>
          </div>
        </div>
        <div className="payment-transaction__container__description mb-4"><p>{paymentStatusIssueInformation}</p></div>
      </div>
    </div>
  );
};

PaymentTransaction.propTypes = {
  transactionCode: PropTypes.any,
  transactionId: PropTypes.any,
};

export default PaymentTransaction;
