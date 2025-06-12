import React, { useEffect, useState } from 'react';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { useUserSummaryContext } from '../../../../store/user-summary-context';
import { BROWSER_STORAGE_KEYS } from '../../../../constants';
import { localStorageKeys } from '../../../../utils';
import { getNumberFormat } from '../../Constant';

const PrintSummary = () => {
  const { transactionHistoryAemData } = useUserSummaryContext();
  const [userDetails, setUserDetails] = useState();
  const [currentTierLabel, setCurrentTierLabel] = useState({});
  const getTierLabel = (userDetails) => {
    try {
      const localStorageObj = JSON.parse(localStorage.getItem(localStorageKeys.GENERIC_DATA));
      const tierLabelObj = localStorageObj?.loyaltyTierLabel?.find((items) => items.key == userDetails?.loyaltyMemberInfo?.tier?.toLocaleLowerCase());
      setCurrentTierLabel(tierLabelObj);
    } catch (error) {
      console.log('---catch error in get tier Label', error);
    }
  };

  useEffect(() => {
    const authUser = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    setUserDetails(authUser);
    getTierLabel(authUser);
  }, []);
  return (
    <div className="print-summary">
      <div className="print-summary-left">
        <div className="print-summary-left-user-names">
          <span className="print-summary-left-user-names-name">{`${userDetails ? `${userDetails?.name?.title} ${userDetails?.name?.first} ${userDetails?.name?.last}` : ''}`}</span>
        </div>
        <div className="print-summary-left-user-ff-info">
          <span className="print-summary-left-user-ff-info-number">{transactionHistoryAemData?.ffNumberLabel}: {`${userDetails?.loyaltyMemberInfo
            ?.FFN ? userDetails?.loyaltyMemberInfo
              ?.FFN : ''}`}
          </span>
        </div>
      </div>
      <div className="print-summary-right" style={{ width: '60% !important' }}>
        <div className="print-summary-right-nominees">
          <div className="print-summary-right-nominees-point-container">
            <i className="icon-bestsellar-solid me-2">
              <span className="path1" />
              <span className="path2" />
            </i>
            <span className="">{`${currentTierLabel?.value}`} {transactionHistoryAemData?.memberLabel || 'Member'}</span>
          </div>
          <div className="print-summary-right-nominees-points">{`${userDetails ? getNumberFormat(userDetails?.loyaltyMemberInfo
            ?.pointBalance) : ''}`}
          </div>
          <div className="print-summary-right-nominees-label">{transactionHistoryAemData?.rewardsPointsLabel || 'Reward points'}</div>
        </div>
      </div>
    </div>
  );
};

PrintSummary.propTypes = {};

export default PrintSummary;
