import React, { useEffect, useState } from 'react';
import merge from 'lodash/merge';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { a11y } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import RecommendedItem from './RecommendedItem';
import useAppContext from '../../hooks/useAppContext';

import './index.scss';
import { srpActions } from '../../context/reducer';
import { getPotentialLoyaltyPoints } from '../../utils/index';
import onclickrecommenedAnalytics from '../../utils/adobeanalytics/onclickrecommened';

const Recommended = () => {
  const [open, setOpen] = useState(false);

  const {
    state: {
      recommended,
      sort,
      main,
      analyticsContext,
      filters,
      selectedTripIndex,
      loyaltyAnalyticsData,
      authUser,
    },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    setOpen(false);
  }, [sort.value, filters]);

  useEffect(() => {
    setOpen(false);
  }, [selectedTripIndex]);

  const onClickSelectHandler = (item) => {
    let _loyaltyAnalyticsData = { ...loyaltyAnalyticsData };

    if (loyaltyAnalyticsData?.loyalty) {
      const { earn, burn } = loyaltyAnalyticsData.loyalty;

      _loyaltyAnalyticsData = merge(loyaltyAnalyticsData, {
        loyalty: {
          ...(earn === '1' && {
            pointsEarned:
              getPotentialLoyaltyPoints(
                item?.fare?.PotentialPoints,
                authUser,
              )?.toString?.() || '',
          }),
          ...(burn === '1' && {
            pointsBurned: item?.fare?.totalPublishFare?.toString?.() || '',
          }),
        },
      });
    }

    onclickrecommenedAnalytics(analyticsContext, item, _loyaltyAnalyticsData);

    dispatch({
      type: srpActions.SELECT_RECOMMENDED_FARE,
      payload: item,
    });
  };

  if (!recommended) {
    return null;
  }

  const onKeyUpHandler = (e) => {
    if (e.keyCode === a11y.keyCode.enter) {
      setOpen((prev) => !prev);
    }
  };

  if (Object.values(recommended).filter(Boolean).length === 0) {
    return null;
  }

  return (
    <section className="srp-flight-carousel" aria-label="recommendations">
      <div className="srp-flight-carousel-header">
        <h3>{main.recommendationsLabel}</h3>
        <Icon
          tabIndex="0"
          role="button"
          aria-label="recommendations"
          onClick={() => setOpen(!open)}
          onKeyUp={onKeyUpHandler}
          aria-expanded={open}
          className={`icon-accordion-down-simple recommended-icon
         ${open && 'recommended-icon-close'}`}
        />
      </div>
      {open && (
        <div className="srp-flight-carousel-container w-100 srp-caraousel">
          {recommended.highestLoyaltyPoints && (
            <RecommendedItem
              item={recommended.highestLoyaltyPoints}
              tag={main.travelRecommendationLabel?.highestpoints}
              onSelect={onClickSelectHandler}
            />
          )}
          {recommended.target && (
            <RecommendedItem
              item={recommended.target}
              tag={main.travelRecommendationLabel?.bestvalue}
              onSelect={onClickSelectHandler}
            />
          )}
          {recommended.value && (
            <RecommendedItem
              item={recommended.value}
              tag={main.travelRecommendationLabel?.bestvalue}
              onSelect={onClickSelectHandler}
            />
          )}
          {recommended.fastest && (
            <RecommendedItem
              item={recommended.fastest}
              tag={main.travelRecommendationLabel?.fastest}
              onSelect={onClickSelectHandler}
            />
          )}
        </div>
      )}
    </section>
  );
};

Recommended.propTypes = {};

export default Recommended;
