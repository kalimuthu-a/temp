import React, { useEffect, useState } from 'react';
import { useUserSummaryContext } from '../../store/user-summary-context';
import { TIER, ANALYTICS_EVENTS, VOUCHER_CONSTANTS, VOUCHER_DASHBOARD } from '../../constants';
import { formatNumber } from '../../utils';
import analyticEvents from '../../utils/analyticEvents';

function PointRedeemption() {
  const { aemData, userData } = useUserSummaryContext();
  const [show, setShow] = useState(false);
  const handleClick = () => {
    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.LOYALTY_REDEEM,
        pageInfo: {
          pageName: VOUCHER_DASHBOARD.PAGE_NAME,
          siteSection: VOUCHER_CONSTANTS.SITE_SECTION,
          projectName: VOUCHER_CONSTANTS.PROJECT_NAME,
          journeyFlow: VOUCHER_CONSTANTS.JOURNEY_FLOW,
        },
        eventInfo: {
          name: 'Redeem Now',
          position: userData?.redemptionPoint,
          component: '',
        },
        loyalty: {
          pointsAvailable: userData?.rewardpoint,
        },
      },
    };
    analyticEvents(analyticsObj);
    window.location.href = (userData?.rewardpoint > TIER.EARNPOINTS) ? aemData?.redeemNowCtaPath : aemData?.earnNowCtaPath;
  };

  useEffect(() => {
    if (userData?.rewardpoint > 0) { setShow(true); }
  }, [userData]);

  return (
    <div className="point-redemption-container">

      <div className="points-summary">
        { show
          && (
          <div className="points-item">
            <div className="container-heading">
              {aemData?.pointsExpiringLabel}
            </div>
            <div className="amount">
              {formatNumber(userData?.pointExpirySchedules?.[0]?.points || 0)}
            </div>
            <div className="view-summary">
              <a href={aemData?.expiringPointsCtaPath}>
                {aemData?.expiringPointsCtaLabel}
              </a>
              <span className="icon-accordion-left-24" />
            </div>
          </div>
          )}
        {show
          && (
          <div className="final-container">
            <div className="container-heading">
              {aemData?.lifetimeRedemptionsLabel}
            </div>
            <div className="amount">
              {/* API is sending 'lIfeTimePurchase' like this, but we are handling for correct case also */}
              {formatNumber(userData?.lIfeTimePurchase || userData?.lifeTimePurchase || 0)}
            </div>
            <div className="view-summary">
              <a href={aemData?.lifetimeRedemptionsCtaPath}>
                {aemData?.lifetimeRedemptionsCtaLabel}
              </a>
              <span className="icon-accordion-left-24" />
            </div>
          </div>
          )}
      </div>
      <div className={show ? 'secondary-container' : 'secondary-container border-with-points'}>
        <div className="point-container">
          <span className="point-section">
            {formatNumber(userData?.rewardpoint || 0)}
          </span>
          <span className="reward">
            {aemData?.rewardPointsLabel}
          </span>
        </div>
        <div className="button-wrapper" onClick={() => handleClick()}>
          <span>{userData?.rewardpoint > TIER.EARNPOINTS ? aemData?.redeemNowCtaLabel : aemData?.earnNowCtaLabel}</span>
        </div>
      </div>
    </div>
  );
}

PointRedeemption.propTypes = {};

export default PointRedeemption;
