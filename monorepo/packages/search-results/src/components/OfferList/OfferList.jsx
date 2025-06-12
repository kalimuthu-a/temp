import PropTypes from 'prop-types';
import React from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';

import OfferItem from './OfferItem';

const OfferList = ({ offers }) => {
  const [isMobile] = useIsMobile();

  const swiperConfig = {
    direction: 'horizontal',

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      enabled: !isMobile,
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
    spaceBetween: 20,
    slidesPerView: isMobile ? 1 : 2,
    cssMode: true,
  };

  return (
    <SwiperComponent
      containerClass={`skyplus-slider flight-offer-slider ${
        offers.length > 2 ? '' : 'w-100'
      }`}
      swiperConfig={swiperConfig}
    >
      {offers.map((offer) => (
        <SwiperComponent.Slide key={offer.code} className="">
          <OfferItem offer={offer} />
        </SwiperComponent.Slide>
      ))}
    </SwiperComponent>
  );
};

OfferList.propTypes = {
  offers: PropTypes.any,
};

export default OfferList;
