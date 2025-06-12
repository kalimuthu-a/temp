import React, { useState } from 'react';
import CurrentTier from './currentTier/CurrentTier';
import { TierProgress as TierUpgrade } from './progress/TierProgress';
import { useUserSummaryContext } from '../../../store/user-summary-context';
import CONSTANT from './constant';
import RetainTier from './progress/RetainTier';

function Index() {
  const { aemData, userData } = useUserSummaryContext();
  const currentTier = userData?.currentTier?.toLowerCase();
  const tierReviewDate = userData?.tierRetain?.tierPoint?.targetdate;

  return (
    <div className="tier-container style">
      <CurrentTier
        aemData={aemData}
        currentTier={currentTier}
        tierReviewDate={tierReviewDate}
      />
      {currentTier !== CONSTANT.TIER_LABELS.GOLD && (

      <div className="propress-bar-container">
        <TierUpgrade
          aemData={aemData}
          stroke={currentTier === CONSTANT.TIER_LABELS.GOLD ? CONSTANT.RETAIN_STROKE_COLOR : CONSTANT.UPGRADE_STROKE_COLOR}
          tierType={currentTier === CONSTANT.TIER_LABELS.GOLD ? CONSTANT.TIER_TYPE_RETAIN : CONSTANT.TIER_TYPE_UPGRADE}
          tierDetails={currentTier === CONSTANT.TIER_LABELS.GOLD ? userData?.tierRetain : userData?.tierUpgarde}
          tierReviewDate={tierReviewDate}
        />

        <RetainTier
          aemData={aemData}
          tierDetails={userData?.tierRetain}
          currentTier={currentTier}
          tierReviewDate={tierReviewDate}
        />
      </div>
      )}

    </div>
  );
}

export default Index;
