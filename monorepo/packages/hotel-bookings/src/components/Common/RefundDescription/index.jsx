import React from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { REFUND_STATUS_CODE } from '../../../constants';

const getRefundDescription = (status, aemData) => {
  const statusMap = {
    [REFUND_STATUS_CODE.SUCCESS]: aemData?.receivedRefundDescription,
    [REFUND_STATUS_CODE.NEFT_REFUNDED]: aemData?.receivedRefundDescription,
    [REFUND_STATUS_CODE.PENDING]: aemData?.refundInprogressDescription,
    [REFUND_STATUS_CODE.FAILURE]: aemData?.refundFailedDescription,
    [REFUND_STATUS_CODE.MANUAL_REVIEW]: aemData?.refundInprogressDescription,
    [REFUND_STATUS_CODE.PARTIALLY_REFUNDED]: aemData?.receivedRefundDescription,
    [REFUND_STATUS_CODE.PARTIALLY_INPROGRESS]: aemData?.refundInprogressDescription,
  };
  const description = statusMap[status];
  if (!description) {
    return '';
  }
  return (
    <HtmlBlock
      className="skyplus-heading  h4"
      html={description?.html?.slice(4)}
    />
  );
};

export default getRefundDescription;
