import React from 'react';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import { delay } from 'skyplus-design-system-app/dist/des-system/utils';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { COOKIE_KEYS } from 'skyplus-design-system-app/src/constants';

import RecentSearch from './RecentSearch';
import useAppContext from '../../hooks/useAppContext';

const RecentSearchSlider = () => {
  const [isMobile] = useIsMobileBooking();
  const loggedInUserDetails = Cookies.get(COOKIE_KEYS.USER);

  const {
    state: { main, additional, recentSearches, isLoyaltyEnabled },
  } = useAppContext();

  const swiperConfig = {
    direction: 'horizontal',

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      enabled: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class="${className}"></span>`;
      },
      enabled: isMobile,
    },
    grid: {
      rows: 1,
      fill: 'column',
    },
    spaceBetween: 10,
    slidesPerView: isMobile ? 1 : 2.5,
    cssMode: true,
  };

  /**
   * @param {import("../../models/SearchItemModel")} item
   */
  const onClickItem = async (item, index) => {
    item.setAnalyticsEvent(index, isLoyaltyEnabled);
    item.setBwContext();

    await delay(0.1);

    window.location.href = main.searchCtaPath;
  };

  return recentSearches.length > 0 || !loggedInUserDetails ? (
    <SwiperComponent
      swiperConfig={swiperConfig}
      containerClass="recent-searches-slider"
    >
      {recentSearches.map((search, i) => (
        <SwiperComponent.Slide key={search.id}>
          <RecentSearch
            recentSearchLabel={main.recentSearchLabel}
            paxLabel={additional.paxLabel}
            passengersLabel={additional.passengersLabel}
            item={search}
            onClickItem={(item) => {
              onClickItem(item, i);
            }}
          />
        </SwiperComponent.Slide>
      ))}
    </SwiperComponent>
  ) : null;
};

export default RecentSearchSlider;
