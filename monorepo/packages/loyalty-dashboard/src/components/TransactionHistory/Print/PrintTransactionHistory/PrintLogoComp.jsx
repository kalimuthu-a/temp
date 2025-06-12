import React from 'react';
import { useUserSummaryContext } from '../../../../store/user-summary-context';

const PrintLogo = () => {
  const { transactionHistoryAemData } = useUserSummaryContext();
  return (
    <div className="print-logo">
      <img className="print-logo__image" src={transactionHistoryAemData?.image?._publishUrl} alt="logo" loading="lazy" />
      <div className="print-logo__bookingheading">
        <span className="print-logo__bookingreference">{transactionHistoryAemData?.loyaltyProgramLabel || 'Loyalty Program'}</span>
      </div>
    </div>
  );
};

export default PrintLogo;
