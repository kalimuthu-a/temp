import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { paymentStatuses, tripStatus, webCheckInMsgStatus, webCheckInStatus } from '../../../../constants/common';
import { calculateRemainingTime, replaceCurlyBraces } from '../../../../functions/utils';

const WebCheckInMsg = (props) => {
  const { labels, checkinStatus, msgStatus, checkinDate, holdExpiry, bookingStatus, paymentStatus,
    setIsTimerZero } = props;
  const [remainingTime, setRemainingTime] = useState('');
  const [futureTime, setFutureTime] = useState('');
  const intervalRef = useRef(null);

  const updateRemainingTime = useCallback(() => {
    const { remainingTime: newRemainingTime, futureTime: newFutureTime } = calculateRemainingTime(holdExpiry);
    setRemainingTime(newRemainingTime);
    setFutureTime(newFutureTime);
  }, [holdExpiry]);

  useEffect(() => {
    if (!holdExpiry) return;

    updateRemainingTime();
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 60000);
      intervalRef.current = interval;
    }, msToNextMinute);

    return () => {
      clearTimeout(timeout);
      clearInterval(intervalRef.current);
    };
  }, [holdExpiry, updateRemainingTime]);

  useEffect(() => {
    if (!holdExpiry) return;
    if (remainingTime === '0hr 0mins') {
      setIsTimerZero(true);
    }
  }, [remainingTime, setIsTimerZero, holdExpiry]);

  if (holdExpiry !== null
     && bookingStatus === tripStatus[5]
     && [paymentStatuses[2], paymentStatuses[4]].includes(paymentStatus) ) {
    return (
      <div
        className="p-6 py-8 d-flex flex-column justify-content-center align-items-center
        bg-system-warning-light rounded-2 mb-6"
      >
        <p className="body-small-medium" style={{ color: 'var(--system-warning)' }}>
          {replaceCurlyBraces(
            labels?.remainingLabel,
            remainingTime,
          )}
        </p>
        <p className="text-secondary body-small-regular">
          {replaceCurlyBraces(
            labels?.flightOnHoldDescription,
            futureTime,
          )}
        </p>
      </div>
    );
  }

  if (msgStatus === webCheckInMsgStatus.NOT_STARTED && checkinStatus === webCheckInStatus.CLOSE) {
    return (
      <div
        className="p-6 py-8 d-flex flex-column justify-content-center align-items-center
        bg-system-information-light rounded-2 mb-6"
      >
        <p className="text-primary body-small-medium">
          {labels?.webCheckInLabel}
        </p>
        <p className="text-secondary body-small-light">
          {checkinDate}
        </p>
      </div>
    );
  }

  if (msgStatus === webCheckInMsgStatus.CLOSED && checkinStatus === webCheckInStatus.CLOSE) {
    return (
      <div
        className="p-6 py-8 d-flex flex-column justify-content-center align-items-center
        bg-system-warning-light rounded-2 mb-6"
      >
        <p
          className="text-primary body-small-medium"
          dangerouslySetInnerHTML={{ __html: labels?.webCheckInClosed?.html }}
        />
        <p className="text-secondary body-small-light">
          {labels?.webCheckInClosedSubText}
        </p>
      </div>
    );
  }

  if (checkinStatus === webCheckInStatus.COMPLETE) {
    return (
      <div
        className="p-6 py-8 d-flex flex-column justify-content-center align-items-center
        bg-system-information-light rounded-2 mb-6"
      >
        <p className="text-primary body-small-medium">
          <span dangerouslySetInnerHTML={{ __html: labels?.webCheckInComplete?.html }} />
        </p>
        <p className="text-secondary body-small-light">
          {labels?.webCheckInCompleteSubText}
        </p>
      </div>
    );
  }
  return null;
};

WebCheckInMsg.propTypes = {
  labels: PropTypes.object,
  msgStatus: PropTypes.string,
  checkinDate: PropTypes.string,
  checkinStatus: PropTypes.string,
  holdExpiry: PropTypes.string,
  bookingStatus: PropTypes.string,
  paymentStatus: PropTypes.string,
  setIsTimerZero: PropTypes.bool,
};

export default WebCheckInMsg;
