import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { REFUND_STATUS_CODE } from '../../../constants';

const getRefundStatusBadge = (status, aemData) => {
  const {
    MANUAL_REVIEW,
    SUCCESS,
    NEFT_REFUNDED,
    PENDING,
    PARTIALLY_REFUNDED,
    PARTIALLY_INPROGRESS,
  } = REFUND_STATUS_CODE;
  if (status === SUCCESS || status === NEFT_REFUNDED) {
    return (
      <div className="statusWrapper success">
        <Icon className="icon-check" size="md" />
        <span className="status">{aemData?.refundedLabel}</span>
      </div>
    );
  }
  if (status === PENDING || status === MANUAL_REVIEW) {
    return (
      <div className="statusWrapper pending">
        <Icon className="icon-info" size="md" />
        <span className="status">{aemData?.refundInProcessLabel}</span>
      </div>
    );
  }
  if (status === PARTIALLY_REFUNDED) {
    return (
      <div className="statusWrapper success">
        <Icon className="icon-check" size="md" />
        <span className="status">{aemData?.partiallyRefundedLabel}</span>
      </div>
    );
  }
  if (status === PARTIALLY_INPROGRESS) {
    return (
      <div className="statusWrapper pending">
        <Icon className="icon-info" size="md" />
        <span className="status">{aemData?.partiallyInProgressLabel}</span>
      </div>
    );
  }

  return (
    <div className="statusWrapper failed">
      <Icon className="icon-close-circle" size="md" />
      <span className="status">{aemData?.refundFailedLabel}</span>
    </div>
  );
};

export default getRefundStatusBadge;
