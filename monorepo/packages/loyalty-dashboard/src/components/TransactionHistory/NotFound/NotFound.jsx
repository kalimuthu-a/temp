import React from 'react';
import { useUserSummaryContext } from '../../../store/user-summary-context';

const NotFound = () => {
  const { transactionHistoryAemData } = useUserSummaryContext();
  const { noResultsDetails } = transactionHistoryAemData;
  return (
    <div className="not-found-container">
      <div className="not-found">
        <div className="not-found-image">
          <img src={noResultsDetails?.image?._publishUrl} alt="" />
        </div>
        <div className="not-found-text">
          <p className="not-found-text--heading">{noResultsDetails?.heading}</p>
          <p
            className="not-found-text--sub-heading"
            dangerouslySetInnerHTML={{
              __html: noResultsDetails?.description?.html,

            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
