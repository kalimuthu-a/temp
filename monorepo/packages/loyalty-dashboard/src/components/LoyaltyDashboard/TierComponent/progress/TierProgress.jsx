import React, { useEffect, useState } from 'react';
import CONSTANT from '../constant';
import ProgressBar from './ProgressBar';
import dateJS, { formatDate } from '../../../../utils/date';
import { UTIL_CONSTANTS, formatNumber } from '../../../../utils';

function TierProgress({ aemData, stroke, tierType, ...apiData }) {
  const description = tierType == CONSTANT.TIER_TYPE_RETAIN ? aemData?.tierRetainActions : aemData?.tierUpgradeActions;

  const descriptionRender = (item, index) => {
    let labelDes = replaceText(item?.html);
    const spendEarnValue = parseInt(apiData?.tierDetails?.tierPoint?.earnedValue);
    const flightEarnValue = parseInt(apiData?.tierDetails?.flight?.earnedValue);
    if (index === 0 && spendEarnValue > 0 && spendEarnValue >= parseInt(apiData?.tierDetails?.tierPoint?.targetValue)) {
      labelDes = `${aemData?.spendsMilestoneLabel} ${aemData?.achievedLabel}`;
    } else if (index === 1 && flightEarnValue > 0 && flightEarnValue >= parseInt(apiData?.tierDetails?.flight?.targetValue)) {
      labelDes = `${aemData?.flightsMilestoneLabel} ${aemData?.achievedLabel}`;
    }
    return labelDes;
  };

  const replaceText = (actualText) => {
    const balTier = Number(apiData?.tierDetails?.tierPoint?.targetValue) - Number(apiData?.tierDetails?.tierPoint?.earnedValue);
    const balFlight = Number(apiData?.tierDetails?.flight?.targetValue) - Number(apiData?.tierDetails?.flight?.earnedValue);
    const reviewDate = apiData?.tierReviewDate ? formatDate(apiData?.tierReviewDate, UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY) : '';
    actualText = actualText?.replace('{amount}', balTier ? formatNumber(balTier) : '0');
    actualText = actualText?.replace('{remainingNumberOfFlights}', balFlight || '0');
    actualText = actualText?.replace('{reviewDate}', reviewDate);
    return actualText;
  };
  const checkMax = (value, maxValue) => {
    return parseInt(value) > parseInt(maxValue) ? maxValue : value;
  };
  return (
    <div className="tier-progress">
      <div className="tier-progress__title">
        <p>{tierType == CONSTANT.TIER_TYPE_RETAIN ? aemData?.tierRetainHeading : aemData?.tierUpgradeHeading}</p>
      </div>
      <div className="tier-progress__progress">
        <div className="spend-milestone">
          <div className="spend-milestone--progressbar">
            {/* progress bar left */}
            <ProgressBar
              size="120"
              max={apiData?.tierDetails?.tierPoint?.targetValue}
              value={checkMax(apiData?.tierDetails?.tierPoint?.earnedValue, apiData?.tierDetails?.tierPoint?.targetValue)}
              strokeWidth="10"
              stroke={stroke}

            />
          </div>

          <p>{aemData?.spendsMilestoneLabel}</p>

        </div>
        <div className="flight-milestone">
          <div className="flight-milestone--progressbar">
            {/* progress bar right */}
            <ProgressBar
              size="120"
              max={apiData?.tierDetails?.flight?.targetValue}
              value={checkMax(apiData?.tierDetails?.flight?.earnedValue, apiData?.tierDetails?.flight?.targetValue)}
              strokeWidth="10"
              stroke={stroke}

            />
          </div>

          <p>{aemData?.flightsMilestoneLabel}</p>

        </div>
      </div>
      <div className="progress-vector" />
      <div className="tier-progress__description">
        {
          description?.map((item, index) => {
            return (
              <div className="description-item">
                <span className="icon-add-simple" />
                <p dangerouslySetInnerHTML={{ __html: descriptionRender(item, index) }} />

              </div>
            );
          })
        }

      </div>

    </div>
  );
}

export { TierProgress };
