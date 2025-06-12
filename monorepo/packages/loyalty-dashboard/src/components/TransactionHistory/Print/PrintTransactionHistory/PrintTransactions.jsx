import React from 'react';
import { useUserSummaryContext } from '../../../../store/user-summary-context';
import { TRANSACTION_TYPE, getNumberFormat } from '../../Constant';
import { formatDate } from '../../../../utils/date';
import { UTIL_CONSTANTS } from '../../../../utils';

const PrintTransactions = () => {
  const { transactionHistoryAemData,  filteredHistoryData } = useUserSummaryContext();

  const chipRenderer = (tranType) => {
    switch (tranType) {
      case TRANSACTION_TYPE.CREDIT:
        return { chilClass: 'chip-success', aemLabel: transactionHistoryAemData?.pointsCreditedLabel };
      case TRANSACTION_TYPE.EXPIRE_SOON:
        return { chilClass: 'chip-success', aemLabel: transactionHistoryAemData?.pointsCreditedLabel };
      case TRANSACTION_TYPE.REDEEM:
        return { chilClass: 'chip-error', aemLabel: transactionHistoryAemData?.pointsRedeemedLabel };
      case TRANSACTION_TYPE.EXPIRED:
        return { chilClass: 'chip-disabled', aemLabel: transactionHistoryAemData?.pointsExpiredLabel };
      case TRANSACTION_TYPE.PROMISE:
        return { chilClass: 'chip-promise', aemLabel: transactionHistoryAemData?.pointsPromisedLabel || 'Points promised' };
      default:
        return {};
    }
  };
  return (
    <div className="print-transactions">
      <div className="print-transactions-title">
        <span className="print-transactions-title-block">{transactionHistoryAemData?.dateLabel}</span>
        <span className="print-transactions-title-block middle">{transactionHistoryAemData?.descriptionLabel || 'Description'}</span>
        <span className="print-transactions-title-block">{transactionHistoryAemData?.transactionLabel}</span>
      </div>
      {filteredHistoryData?.map((etrdata) => {
        const refundCheck = etrdata?.reversalId === null
          || etrdata?.reversalId === ''
          || etrdata?.reversalId === undefined;
        const transactionType = etrdata?.transactionType?.toLowerCase();
        const addAndMinusSymbol = transactionType === TRANSACTION_TYPE.REDEEM ? '-' : '+';
        const aemLabel = chipRenderer(etrdata?.transactionType?.toLowerCase());
        return (
          <div className="print-transactions-discription">
            <span className="print-transactions-discription-date common ">{etrdata?.transactionDate ? formatDate(etrdata?.transactionDate, UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY) : ''}</span>

            <span className="print-transactions-discription-transaction common middle"> {refundCheck ? transactionHistoryAemData?.typeLabel?.[transactionType] : transactionHistoryAemData?.typeLabel?.refund || 'IndiGo BluChips Refund'}</span>
            <span className={`print-transactions-discription-balance common ${refundCheck ? aemLabel?.chilClass : 'chip-success'}`}>
              {`${refundCheck ? addAndMinusSymbol : '+'} ${getNumberFormat(etrdata?.transactionDetail?.totalPoint)} ${transactionHistoryAemData?.ptsLabel ?? ''}`}
            </span>
          </div>
        );
      })}

    </div>
  );
};

PrintTransactions.propTypes = {};

export default PrintTransactions;
