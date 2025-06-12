import React, { useState, useEffect } from 'react';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import PrintTransactionHistory from '../Print/PrintTransactionHistory/PrintTransactionHistory';
import { useUserSummaryContext } from '../../../store/user-summary-context';
import { TRANSACTION_TYPE, getNumberFormat } from '../Constant';

const TransactionHistorySummary = ({ currentTab, isDownload, isPartner, isAllTransActive }) => {
  const { transactionHistoryAemData, transactionHistoryData } = useUserSummaryContext();
  const [pointsDetails, setPointsDetails] = useState({ total: 0, redem: 0 });
  useEffect(() => {
    const sumofAllPoints = transactionHistoryData?.transactionHistory?.transactions
      ?.filter((item) => item?.transactionType?.toLowerCase() === TRANSACTION_TYPE.CREDIT.toLowerCase())
      ?.reduce((accumulator, current) => {
        return accumulator + current?.transactionDetail?.totalPoint;
      }, 0);
    const sumofRemmedPoints = transactionHistoryData?.transactionHistory?.transactions
      ?.filter((item) => item?.transactionType?.toLowerCase() === TRANSACTION_TYPE.REDEEM.toLowerCase() && (item?.reversalId === null || item?.reversalId === ''))
      ?.reduce((accumulator, current) => accumulator + current?.transactionDetail?.totalPoint, 0);
    setPointsDetails({ total: sumofAllPoints, redem: sumofRemmedPoints });
  }, [transactionHistoryData]);
  const componentRef = React.useRef();
  return (
    <div className="summary">
      <div className="summary__details">
        <div className="summary__heading">{transactionHistoryAemData?.transactionHistoryLabel}</div>
        <div className="summary__details--item">
          <span>{transactionHistoryAemData?.totalPointsEarnedLabel}:</span>
          <span>{getNumberFormat(pointsDetails?.total)}</span>
        </div>
        <div className="summary__details--item">
          <span>{transactionHistoryAemData?.lifetimeRedemptionsLabel}:</span>
          <span>{getNumberFormat(pointsDetails?.redem)}</span>
        </div>

      </div>
      <div className="summary__download">
        <PrintTransactionHistory key={uniq()} currentTab={currentTab} isPartner={isPartner} isAllTransActive={isAllTransActive}>
          <button
            type="button"
            disabled={isDownload}
          >
            {transactionHistoryAemData?.downloadSummaryLabel}
            <span className="icon-download" />
          </button>
        </PrintTransactionHistory>
      </div>
    </div>
  );
};

export default TransactionHistorySummary;
