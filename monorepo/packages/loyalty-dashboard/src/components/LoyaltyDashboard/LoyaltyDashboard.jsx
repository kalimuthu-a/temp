import React, { useEffect, useState } from 'react';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import PropTypes from 'prop-types';
import UserCard from '../usercard/UserCard';
import Benifits from '../Benifits/Benifits';
import TierComponent from './TierComponent/TierComponent';
import { useUserSummaryContext } from '../../store/user-summary-context';
import { getAEMData, getRetroClaimData, getUserSummaryApiData, getVoucherAEMData } from '../../services/index';
import Shimmer from '../Shimmer';
import { BROWSER_STORAGE_KEYS } from '../../constants';
import RetroClaim from './RetroClaim/RetroClaim';
import TierUpgradeNotification from './TierUpgradeNotification/TierUpgradeNotification';
import UpcomingTierBenefits from './UpcomingTierBenefits/UpcomingTierBenefits';
import VoucherDashboard from '../VoucherDashboard/VoucherDashboard';
import RetroClaimForm from '../RetroClaimForm/RetroClaimForm';
import { PAGE_VIEW_TYPE } from '../../utils';
import analyticEvents from '../../utils/analyticEvents';
import { calculateDaysSince } from '../../utils/request';
import CONSTANT from './TierComponent/constant';

function LoyaltyDashboard({ page, setToastProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const {
    updateAEMData,
    updateUserData,
    aemData,
    updateRetroClaimData,
    updateVoucherAEMData,
  } = useUserSummaryContext();
  const updateCookieAuthUserMessageEvent = (eventData) => {
    return new CustomEvent('UPDATE_AUTH_USER_COOKIE', eventData);
  };
  const updateAuthUser = (userInfo) => {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.TOKEN, true);
    const cookieExpiredTime = tokenObj?.expiresInMilliSeconds || 15 * 60 * 1000;
    document.dispatchEvent(
      updateCookieAuthUserMessageEvent({
        bubbles: true,
        detail: {
          user: userInfo,
          cookieExpiredTime,
        },
      }),
    );
  };
  const sendAnalytics = (userData) => {
    const { tierRetain, tierUpgarde } = userData;
    analyticEvents({
      data: {
        _event: CONSTANT?.LOYALTY?.PAGELOAD,
        pageInfo: {
          pageName: page === CONSTANT.LOYALTY_VOUCHER.LOYALTY_VOUCHER_HISTORY
            ? CONSTANT.LOYALTY_VOUCHER.PAGENAME : CONSTANT.LOYALTY.PAGENAME,
          siteSection: CONSTANT.LOYALTY.SITESECTION,
          projectName: CONSTANT.LOYALTY.PROJECTNAME,
          journeyFlow: CONSTANT.LOYALTY.JOURNEYFLOW,
        },
        loyalty: {
          pointsEarned: String(userData?.lifeTimePoints || 0),
          pointsBurned: String(userData?.redemptionPoint || 0),
          pointsExpring: String(userData?.pointExpirySchedules?.[0]?.points || 0),
          pointsAvailable: String(userData?.loyaltyPoints || 0),
          pointsForUpgrade: String(tierUpgarde?.tierPoint?.targetValue - tierUpgarde?.tierPoint?.earnedValue || 0),
          flightsForUpgrade: String(tierUpgarde?.flight?.targetValue - tierUpgarde?.flight?.earnedValue || 0),
          isRetained: tierRetain?.tierPoint?.targetValue - tierRetain?.tierPoint?.earnedValue >= 0 ? '1' : '0',
          dateToReview: tierRetain?.tierPoint?.targetdate,
          daysToReview: calculateDaysSince(tierRetain?.tierPoint?.targetdate),
          Spent: String(userData?.lIfeTimePurchase || 0),
        },
      },
      event: CONSTANT?.LOYALTY?.PAGELOAD,
    });
  };
  const updateContextWithApiData = async (authUser) => {
    try {
      const userData = await getUserSummaryApiData(authUser);

      if (!userData?.success) {
        setToastProps({
          title: 'Error',
          description: userData?.message || 'Something went wrong',
          variation: 'notifi-variation--Error',
          autoDismissTimeer: 5000,
          onClose: () => {
            setToastProps(null);
          },
        });
      } else {
        updateUserData(userData);
        const updatedAuthUser = { ...authUser };
        const { currentTier, rewardpoint } = userData;
        updatedAuthUser.loyaltyMemberInfo = {
          ...updatedAuthUser.loyaltyMemberInfo,
          tier: currentTier,
          TierType: currentTier,
          pointBalance: rewardpoint,
        };
        updateAuthUser(updatedAuthUser);
        const aemDataRes = await getAEMData(userData?.currentTier);
        updateAEMData(aemDataRes);
      }
      if (page !== PAGE_VIEW_TYPE.RETRO_CLAIM_PAGE && page !== PAGE_VIEW_TYPE.TRANSACTION_HISTORY && page !== PAGE_VIEW_TYPE.VOUCHER_HISTORY) {
        sendAnalytics(userData);
      }
      const retroData = await getRetroClaimData();
      updateRetroClaimData(retroData);
      const voucherData = await getVoucherAEMData();
      updateVoucherAEMData(voucherData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const authUser = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    updateContextWithApiData(authUser);
  }, []);

  return (
    <>
      {!isLoading
        ? (
          <>
            {page === PAGE_VIEW_TYPE.RETRO_CLAIM_PAGE ? (
              <RetroClaimForm />
            ) : page === PAGE_VIEW_TYPE.VOUCHER_HISTORY ? (
              <VoucherDashboard />
            ) : (
              <div className="loyalty-db__wrapper">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: aemData?.welcomeMessage?.html,
                  }}
                />
                <TierUpgradeNotification isActiveFlag={false} />
                <UserCard />
                <Benifits className="pt-24" />
                <RetroClaim />
                <TierComponent />
                {aemData?.upcomingTierBenefits?.length > 0 && (
                  <UpcomingTierBenefits upcomingTierBenefits={aemData?.upcomingTierBenefits} />
                )}
              </div>
            )}
          </>
        )
        : <Shimmer />}
    </>
  );
}

LoyaltyDashboard.propTypes = {
  page: PropTypes.any,
  setToastProps: PropTypes.any,
};

export default LoyaltyDashboard;
