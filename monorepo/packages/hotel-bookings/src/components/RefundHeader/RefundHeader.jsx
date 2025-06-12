import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { any } from 'prop-types';
import { REFUND_STATUS_CODE } from '../../constants';
import getRefundStatusBadge from '../Common/RefundStatusBadge';
import getRefundDescription from '../Common/RefundDescription';
import getFormattedCurrency from '../../utils/getFormattedCurrency';

const RefundHeader = ({ aemData, apiData }) => {
  const {
    SUCCESS,
    FAILURE,
    PENDING,
    PARTIALLY_REFUNDED,
    PARTIALLY_INPROGRESS,
  } = REFUND_STATUS_CODE;
  const indigoRefundStatus =
    apiData?.data?.indigoRefundStatus?.clsRefundStatus || [];
  const totalRefundAmount = indigoRefundStatus.reduce((total, refund) => {
    if (
      refund?.refundStatus?.toLowerCase() === REFUND_STATUS_CODE.SUCCESS ||
      refund?.offlineDetailsText !== null
    ) {
      return total + (parseFloat(refund?.refundAmount?.replace(/,/g, '')) || 0);
    }
    return total;
  }, 0);
  const getRefundStatus = (cases) => {
    const successCount = cases.filter((status) => status === SUCCESS).length;
    const inProgressCount = cases.filter((status) => status === PENDING).length;
    const failedCount = cases.filter((status) => status === FAILURE).length;

    if (successCount === cases.length) return SUCCESS;
    if (inProgressCount === cases.length) return PENDING;
    if (failedCount === cases.length) return FAILURE;

    const hasSuccess = successCount > 0;
    const hasInProgress = inProgressCount > 0;
    const hasFailed = failedCount > 0;

    if (hasSuccess) {
      if (hasInProgress || hasFailed) return PARTIALLY_REFUNDED;
    } else if (hasInProgress && hasFailed) {
      return PARTIALLY_INPROGRESS;
    }

    return PENDING; // Default case
  };

  const statusCases = indigoRefundStatus.map(
    (refund) => refund?.refundStatus?.toLowerCase() ||
      aemData?.refundInProcessLabel?.toLowerCase(),
  );
  const overallRefundStatus = getRefundStatus(statusCases);

  return (
    <>
      <div className="flightRefund">
        <h1>{aemData?.flightRefundTitle}</h1>
        {getRefundDescription(overallRefundStatus?.toLowerCase(), aemData)}
      </div>
      <div className="flightDetails">
        {apiData?.data?.isMaskedPNR === false ? (
          <>
            <div className="refund">
              {aemData?.refundLabel}
              <span>
                <b>
                  {indigoRefundStatus?.[0]?.offlineDetailsText !== null
                    ? ''
                    : ` ${getFormattedCurrency(
                      totalRefundAmount,
                      indigoRefundStatus?.[0]?.currency,
                      0,
                    )}`}
                </b>
              </span>
            </div>
            <div className="refundStatusHeader">
              {/* <Icon className="icon-check text-green" size="md" /> */}
              <span>
                {getRefundStatusBadge(overallRefundStatus?.toLowerCase(), aemData)}
              </span>
            </div>
          </>
        ) : (
          ''
        )}

        {apiData?.data?.indigoRefundStatus?.recordLocator === null ? (
          <div className="pnr">
            {aemData?.juspayIdLabel}{' '}
            <b>{apiData?.data?.indigoRefundStatus?.jusPayId}</b>
          </div>
        ) : (
          apiData?.data?.indigoRefundStatus?.recordLocator && (
            <>
              <div className="pnr">
                {aemData?.pnrLabel}{' '}
                <b>{apiData?.data?.indigoRefundStatus?.recordLocator}</b>
              </div>
              <div className="pnrStatus">
                <Icon className="icon-close-circle" size="md" />
                <span>{aemData?.pnrCancelledLabel}</span>
              </div>
            </>
          )
        )}
      </div>
      <div className="yourRefund">
        <h1>{aemData?.refundSummaryTitle}</h1>
        <HtmlBlock
          tagName="h4"
          className="skyplus-heading h4"
          html={aemData?.refundSummaryDescription?.html?.slice(4)}
        />
      </div>
    </>
  );
};
RefundHeader.propTypes = {
  aemData: any,
  apiData: any,
};
export default RefundHeader;
