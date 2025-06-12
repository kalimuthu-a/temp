/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import SwiperComponent from './SwiperComponent';

import './SwiperDemo.scss';
import useIsMobile from '../../functions/hooks/useIsMobile';

export default {
  title: 'Skyplus/SwiperComponent',
  component: SwiperComponent,
};

// eslint-disable-next-line arrow-body-style
export const BasicSwiper = () => {
  const swiperConfig = {
    direction: 'horizontal',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class="${className}"></span>`;
      },
    },
  };

  return (
    <SwiperComponent containerClass="mobile-slider" swiperConfig={swiperConfig}>
      <SwiperComponent.Slide>Slide 1</SwiperComponent.Slide>
      <SwiperComponent.Slide>Slide 2</SwiperComponent.Slide>
      <SwiperComponent.Slide>Slide 3</SwiperComponent.Slide>
      <SwiperComponent.Slide>Slide 4</SwiperComponent.Slide>
      <SwiperComponent.Slide>Slide 5</SwiperComponent.Slide>
      <SwiperComponent.Slide>Slide 6</SwiperComponent.Slide>
    </SwiperComponent>
  );
};

export const RecentSearchesSwiper = () => {
  const [isMobile] = useIsMobile();

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
    },
    slidesPerView: isMobile ? 1 : 3,
    grid: {
      rows: 1,
    },
  };

  return (
    <SwiperComponent containerClass="mobile-slider" swiperConfig={swiperConfig}>
      <SwiperComponent.Slide>Recent Search 1</SwiperComponent.Slide>
      <SwiperComponent.Slide>Recent Search 2</SwiperComponent.Slide>
    </SwiperComponent>
  );
};

export const SRPDateSwiper = () => {
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
      enabled: false,
    },
    grid: {
      rows: 1,
      fill: 'column',
    },
    spaceBetween: 5,
    slidesPerView: 9,
    cssMode: true,
  };

  return (
    <SwiperComponent
      containerClass="flight-date-slider"
      swiperConfig={swiperConfig}
    >
      {Array.from({ length: 25 }).map((i, key) => (
        <SwiperComponent.Slide key={key} className="swiper-slide-date">
          {`Day ${key + 1}`}
        </SwiperComponent.Slide>
      ))}
    </SwiperComponent>
  );
};

export const SRPOfferSwiper = () => {
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
    spaceBetween: 2,
    slidesPerView: isMobile ? 1 : 2,
    cssMode: true,
  };

  return (
    <SwiperComponent
      containerClass="flight-offer-slider"
      swiperConfig={swiperConfig}
    >
      {Array.from({ length: 4 }).map((i, key) => (
        <SwiperComponent.Slide key={key} className="swiper-slide-offer">
          {`Offer ${key + 1}`}
        </SwiperComponent.Slide>
      ))}
    </SwiperComponent>
  );
};
