import React from 'react';
import { useSelector } from 'react-redux';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import PropTypes from 'prop-types';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

export const TRAVELTIPS_VARIATION = {
  HOTELSTRIP: 'HotelStrip',
};

const HotelComp = ({ hotelList, arrivalCityName, isBookingFlow,
  isModificationFlow, isCancelFlightFlow, showMoreUrl }) => {
  const { hotelRecommendations } = useSelector((state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item) || {};
  const swiperConfig = {
    direction: 'horizontal',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      enabled: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: false,
      renderBullet: (index, className) => {
        return `<span class="${className}"></span>`;
      },
      enabled: false,
    },
    grid: {
      rows: 1,
      fill: 'column',
    },
    spaceBetween: 12,
    slidesPerView: 2.5,
    cssMode: false,
  };
  const [isMobile] = useIsMobile();

  const getSwiperTitle = (swiperModel) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (swiperModel) {
      case TRAVELTIPS_VARIATION.HOTELSTRIP:
        swiperConfig.navigation.enabled = true;
        if (isMobile) swiperConfig.slidesPerView = 1.5;
        else swiperConfig.slidesPerView = 2.67;
        return {
          title: hotelRecommendations?.description?.html?.replace('{city}', arrivalCityName),
          swiperClass: 'mobile-slider hotel-slider swiper-md ',
        };
      default:
        return {};
    }
  };
  const uiConfig = getSwiperTitle('HotelStrip');
  const swiperTitle = uiConfig?.title;

  const onClickhotelItem = (url) => {
    window.open(url, '_blank');
  };
  const bookingFLow = isBookingFlow ? 'isBookingFlow' : 'noBookingFlow';
  const modificationFlow = isModificationFlow ? 'isModificationFlow' : ' ';
  const cancelFlightFlow = isCancelFlightFlow ? 'isCancelFlight' : ' ';
  const data = hotelList;

  return (
    data?.length > 0 && (
      <div className={`itinerary-hotel-strip ${bookingFLow} ${cancelFlightFlow} ${modificationFlow}`}>
        <HtmlBlock
          html={
            swiperTitle || 'Hotel Recommendations'
          }
          className="itinerary-hotel-strip-heading"
        />
        {hotelRecommendations?.subHeading?.html && (
          <HtmlBlock
            html={
              hotelRecommendations?.subHeading?.html?.replace('{city}', arrivalCityName)
            }
            className="itinerary-hotel-strip-sub-heading"
          />
        )}
        <SwiperComponent
          swiperConfig={swiperConfig}
          swiperSelectorClass="hotel-strip"
          containerClass="mobile-slider travel-tips-slider"
        >
          {data.map((hotel) => {
            const price = hotel?.price || {};
            const hotelPrice = price?.total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return (
              <SwiperComponent.Slide key={uniq()}>
                <div
                  className="itinerary-hotel-strip--item"
                  onClick={() => onClickhotelItem(hotel?.property_url)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={null}
                >
                  <img
                    src={hotel?.img?.image_url}
                    alt={hotel.hotel_name}
                    className="itinerary-hotel-strip--image"
                  />
                  <span className="itinerary-hotel-strip--item-over">
                    <div className="itinerary-hotel-strip--rating ">
                      <svg
                        className="star-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          // eslint-disable-next-line max-len
                          d="M13.5872 3.99654C12.96 2.64601 11.04 2.64601 10.4128 3.99654L8.6091 7.8805C8.57267 7.95894 8.49829 8.01298 8.41243 8.02339L4.16118 8.53863C2.68293 8.71779 2.08962 10.5438 3.18024 11.5577L6.31673 14.4733C6.38007 14.5322 6.40848 14.6196 6.39184 14.7045L5.56816 18.9069C5.28175 20.3682 6.83506 21.4967 8.13629 20.7728L11.8785 18.6908C11.9541 18.6487 12.046 18.6487 12.1216 18.6908L15.8638 20.7728C17.165 21.4967 18.7183 20.3682 18.4319 18.9069L17.6082 14.7045C17.5916 14.6196 17.62 14.5322 17.6833 14.4733L20.8198 11.5577C21.9104 10.5438 21.3171 8.71779 19.8389 8.53863L15.5876 8.02339C15.5018 8.01298 15.4274 7.95894 15.391 7.8805L13.5872 3.99654Z"
                          fill="#FFF"
                        />
                      </svg>
                      {hotel?.star_rating}
                    </div>
                    <span className="p9 d-flex">
                      <span className="title" title={hotel.hotel_name}>
                        {hotel.hotel_name}
                      </span>
                    </span>
                    <span className="itinerary-hotel-strip--item-over--price-tag">
                      <div className="d-flex flex-row ">
                        <span className="hotel-price">
                          {price?.currency} {hotelPrice}{' '}
                        </span>
                        <span className="hotel-stay">
                          {hotelRecommendations?.note || 'per night'}
                        </span>
                      </div>
                    </span>
                  </span>
                </div>
              </SwiperComponent.Slide>
            );
          })}
        </SwiperComponent>
        {hotelRecommendations?.ctaLabel && (
          <div
            className="show-more-cta"
            onClick={() => onClickhotelItem(showMoreUrl)}
          >
            <div className="text">{hotelRecommendations?.ctaLabel} </div>
            <span className="icon-accordion-down-simple" />
          </div>
        )}
      </div>
    )
  );
};

HotelComp.propTypes = {
  hotelList: PropTypes.array,
  arrivalCityName: PropTypes.string,
  showMoreUrl: PropTypes.string,
  isBookingFlow: PropTypes.string,
  isModificationFlow: PropTypes.string,
  isCancelFlightFlow: PropTypes.string,
};

export default HotelComp;
