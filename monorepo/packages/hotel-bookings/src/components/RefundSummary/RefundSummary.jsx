import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { any } from 'prop-types';
import CONSTANTS, { REFUND_SUMMARY_CLASS, REFUND_STATUS_CODE } from '../../constants';
import getRefundStatusBadge from '../Common/RefundStatusBadge';
import getFormattedCurrency from '../../utils/getFormattedCurrency';
import convertZuluToFormattedDate from '../Common/ConvertToTimezone';

const RefundSummary = ({ aemData, apiData }) => {
  const { MANUAL_REVIEW, SUCCESS, FAILURE, NEFT_REFUNDED, PENDING } =
    REFUND_STATUS_CODE;

  const getStatusClass = (index, currentStepCode, statusCode) => {
    const normalizedStatusCode = statusCode.toLowerCase();
    if (index < parseInt(currentStepCode, 10)) {
      return REFUND_SUMMARY_CLASS.SUCCESS;
    }
    if (index > parseInt(currentStepCode, 10)) {
      return REFUND_SUMMARY_CLASS.DEFAULT;
    }

    switch (normalizedStatusCode) {
      case SUCCESS:
      case NEFT_REFUNDED:
        return REFUND_SUMMARY_CLASS.SUCCESS;
      case FAILURE:
        return REFUND_SUMMARY_CLASS.FAILURE;
      case PENDING:
      case MANUAL_REVIEW:
        return REFUND_SUMMARY_CLASS.PENDING;
      default:
        return '';
    }
  };

  const getStatusList = (stepCode, refund) => {
    const stepLabels = {
      0: aemData?.refundInProcessStepsLabel,
      1: aemData?.refundInProcessStepsLabel,
      2: aemData?.refundFailedStepsLabel,
      3: aemData?.refundedStepsLabel,
    };
    return stepLabels[stepCode]?.map((element, index) => {
      const className = getStatusClass(index, stepCode, refund?.refundStatus);
      let dateDisplay = null;
      if (index === 0) {
        dateDisplay = convertZuluToFormattedDate(refund?.transactionDate, false);
      } else if (index === parseInt(stepCode, 10)) {
        dateDisplay = convertZuluToFormattedDate(refund?.tnxLastUpdateDate, false);
      } else {
        dateDisplay = '';
      }
      return (
        <li className={className}>
          <Icon className={element?.icon} size="lg" />
          <h1 className="time">{dateDisplay}</h1>
          <p className="refundStep">{element?.title}</p>
          <HtmlBlock
            tagName="p"
            className="refundStepDescription"
            html={element?.description.html.slice(3)}
          />
        </li>
      );
    });
  };

  return (
    <div>
      { apiData?.data?.indigoRefundStatus &&
        apiData?.data?.indigoRefundStatus?.clsRefundStatus.map((refund) => {
          return (
            <div>
              <div className="refundContainer">
                <div className="refundStatus">
                  <div className="bookedDate">
                    {aemData?.bookedOnLabel} {apiData?.data?.bookingDate}
                  </div>
                  {getRefundStatusBadge(
                    refund?.refundStatus?.toLowerCase(),
                    aemData,
                  )}
                </div>
                {
                  apiData?.data?.isMaskedPNR === false ? (
                    <div className="refundSummaryAmount">
                      <div className="amountWrapper">
                        {refund?.offlineDetailsText !== null
                          ? CONSTANTS.NEFT_REFUND
                          : aemData?.refundAmountLabel}
                        <span className="amount text-green ms-4">
                          {refund?.offlineDetailsText !== null
                            ? ''
                            : getFormattedCurrency(
                              refund?.refundAmount?.split(',').join(''),
                              refund?.currency,
                              0,
                            )}
                        </span>
                      </div>
                      <div className="refundId">
                        <span className="">{refund?.refundID}</span>
                      </div>
                    </div>
                  )
                    : ''
                }
              </div>
              {refund?.offlineDetailsText !== null ? (
                <div className="refundwrapper mb-5">
                  <ul className="sessions">
                    <li className={REFUND_SUMMARY_CLASS.SUCCESS}>
                      <Icon className="icon-refund-confirmed" size="lg" />
                      <h1 className="nefttime">{refund?.transactionDate}</h1>
                      <p className="refundStepDescription">
                        {refund?.offlineDetailsText}
                      </p>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="refundwrapper">
                  <ul className="sessions">
                    {getStatusList(refund.stepCode, refund)}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
RefundSummary.propTypes = {
  aemData: any,
  apiData: any,
};
export default RefundSummary;
