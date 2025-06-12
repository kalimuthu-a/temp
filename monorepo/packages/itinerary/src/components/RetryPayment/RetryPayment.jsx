import React, { useEffect, useState, useRef } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import { confirmPayment } from '../../services';
import { CONSTANTS } from '../../constants';
import { getSessionToken } from '../../utils';

const RetryPayment = ({ refreshData, setacknowledgePaymentStausFlag, bookingStatus, paymentStatus }) => {
  const [pollCount, setPollCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showRetryCta, setShowRetryCta] = useState(false);
  const intervalId = useRef();
  const POLLING_INTERVAL = window._env_itinerary?.POLLING_INTERVAL || 5000; //
  const MAX_POLLING_COUNT = window._env_itinerary?.MAX_POLLING_COUNT || 3;
  const RETRY_CTA_TEXT = window._env_itinerary?.RETRY_CTA_TEXT || 'Retry Booking';
  const PAYNOW_CTA_TEXT = window._env_itinerary?.PAYNOW_CTA_TEXT || 'Pay Now';

  const { PAYMENT_POLLING_STATUS_KEY } = CONSTANTS;

  const fetchData = async () => {
    const confirmPaymentStatus = await confirmPayment();
    let returnData;
    const paymentStatusLower = confirmPaymentStatus?.data?.bookingPaymentStatus?.toLowerCase();
    if (paymentStatusLower === 'inprocess' && pollCount <= MAX_POLLING_COUNT) {
      setacknowledgePaymentStausFlag(PAYMENT_POLLING_STATUS_KEY.PAYMENTV2_INPROCESS);
      returnData = false;
    } else {
      if (paymentStatusLower === 'failed') {
        setacknowledgePaymentStausFlag(PAYMENT_POLLING_STATUS_KEY.PAYMENTV2_FAILED);
        setShowRetryCta(true);
      } else {
        setacknowledgePaymentStausFlag(PAYMENT_POLLING_STATUS_KEY.PAYMENTV2_BOOKINGFAILED);
      }
      
      refreshData();
      returnData = true;
      setIsLoading(false);
    }
    setPollCount((prevPollCount) => prevPollCount + 1);
    return returnData;
  };

  useEffect(() => {
    if (pollCount > MAX_POLLING_COUNT) {
      clearInterval(intervalId.current);
      setacknowledgePaymentStausFlag(PAYMENT_POLLING_STATUS_KEY.PAYMENTV2_NOT_CONFIRMED);
      setShowRetryCta(true);
      setIsLoading(false);
    }
  }, [pollCount]);

  const updatePollInterval = async () => {
    intervalId.current = setInterval(async () => {
      const returnData = await fetchData();
      if (returnData || pollCount >= MAX_POLLING_COUNT) {
        clearInterval(intervalId.current);
        setIsLoading(false);
      }
    }, POLLING_INTERVAL);
  };

  useEffect(() => {
    updatePollInterval();
    return () => clearInterval(intervalId.current); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    if (((bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.HOLD.toLowerCase())
      || (bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.ON_HOLD.toLowerCase())
      || (bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.PENDING.toLowerCase()
        && paymentStatus?.toLowerCase() === CONSTANTS.PAYMENT_STATUS.PENDING.toLowerCase())) && !showRetryCta) {
      setShowRetryCta(true);
    }
  }, [bookingStatus]);

  const makePaymentRequiredFlow = () => {
    const token = getSessionToken();
    const dataToPass = { from: 'Itinerary', token, params: {} };
    const event = new CustomEvent(CONSTANTS.EVENT_INITIATE_PAYMENT, {
      bubbles: true,
      detail: dataToPass,
    });
    document.dispatchEvent(event);
  };

  const retryPaymentClick = () => {
    makePaymentRequiredFlow();
  };

  if (showRetryCta) {
    return (
      <Button
        onClick={retryPaymentClick}
        loading={isLoading}
        containerClass="retry-btn"
      >
        {
        ((bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.HOLD.toLowerCase())
        || (bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.ON_HOLD.toLowerCase()))
          ? PAYNOW_CTA_TEXT : RETRY_CTA_TEXT
        }
      </Button>
    );
  }
  return null;
};

RetryPayment.propTypes = {
  refreshData: PropTypes.object,
  setacknowledgePaymentStausFlag: PropTypes.any,
  bookingStatus: PropTypes.object,
  paymentStatus: PropTypes.any,
};

export default RetryPayment;
