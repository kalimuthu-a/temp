import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import SwiperComponent from '../Swiper/SwiperComponent';
import {
  uniq,
  getCurrencyPrice,
  getSwiperTitle,
  redirectTo,
  emptyFn,
} from '../../functions/utils';
import useIsMobile from '../../functions/hooks/useIsMobile';
import HtmlBlock from '../HtmlBlock/HtmlBlock';
import { HOTEL_STRIPS_DETAILS } from '../../constants';

const HotelStrip = ({
  hotelList = [],
  arrivalCityName = '',
  isBookingFlow = false,
  isModificationFlow = false,
  isCancelFlightFlow = false,
  showMoreUrl = '',
  hotelRecommendations = {},
  stripType = '',
  analyticsHandler = emptyFn,
}) => {
  const [isMobile] = useIsMobile();

  const { HOTEL_TRAVELTIPS_VARIATION } = HOTEL_STRIPS_DETAILS;

  const spaceBetween = isMobile ? 12 : 16;

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
    spaceBetween,
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    cssMode: false,
  };

  const swiperTitleInfo = {
    stripType,
    stripVariations: HOTEL_TRAVELTIPS_VARIATION,
    hotelRecommendations,
    arrivalCityName,
    swiperConfig,
  };

  const uiConfig = getSwiperTitle(swiperTitleInfo);
  const swiperTitle = uiConfig?.title;

  const bookingFLow = isBookingFlow ? 'isBookingFlow' : 'noBookingFlow';
  const modificationFlow = isModificationFlow ? 'isModificationFlow' : ' ';
  const cancelFlightFlow = isCancelFlightFlow ? 'isCancelFlight' : ' ';

  const clickHandler = (itemValues, redirectUrl, sliderIndex = '') => {
    analyticsHandler({ ...itemValues, sliderIndex });
    redirectTo(redirectUrl);
  };

  return (
    <div
      className={`confirmation-itinerary-hotel-strip ${bookingFLow} ${cancelFlightFlow} ${modificationFlow}`}
    >
      {(swiperTitle || hotelRecommendations?.subHeading?.html) && (
        <div className="confirmation-itinerary-hotel-strip-heading-block">
          {swiperTitle && (
            <HtmlBlock
              html={swiperTitle}
              className="confirmation-itinerary-hotel-strip-heading-block-heading"
            />
          )}
          {hotelRecommendations?.subHeading?.html && (
            <HtmlBlock
              html={hotelRecommendations?.subHeading?.html?.replace(
                '{city}',
                arrivalCityName,
              )}
              className="confirmation-itinerary-hotel-strip-heading-block-sub-heading"
            />
          )}
        </div>
      )}
      <SwiperComponent
        swiperConfig={swiperConfig}
        swiperSelectorClass="hotel-strip"
        containerClass="travel-tips-slider mobile-slider"
      >
        {hotelList?.map((hotel, index) => {
          const price = hotel?.price;
          const tax = getCurrencyPrice(price?.tax);
          const actualPrice = getCurrencyPrice(price?.strike_price);
          const hotelPrice = getCurrencyPrice(price?.net);
          return (
            <SwiperComponent.Slide key={uniq()}>
              <div
                className="confirmation-itinerary-hotel-strip--item"
                onClick={() => clickHandler(hotel, hotel?.property_url, index)}
                role="button"
                tabIndex="0"
                onKeyDown={null}
              >
                <div className="confirmation-itinerary-hotel-strip--item--image-block">
                  <img
                    src={hotel?.img?.image_url}
                    alt={hotel?.hotel_name}
                    className="confirmation-itinerary-hotel-strip--item--image-block--image"
                  />
                  {hotel?.customer_rating ? (
                    <div className="confirmation-itinerary-hotel-strip--rating">
                      <span className="confirmation-itinerary-hotel-strip--rating--count">
                        {hotel?.customer_rating}/{hotelRecommendations?.totalRating}
                      </span>
                      ({hotel?.no_of_reviews} {hotelRecommendations?.reviewsLabel})
                    </div>
                  ) : null}
                </div>
                <div className="confirmation-itinerary-hotel-strip--item-info">
                  <div className="confirmation-itinerary-hotel-strip--title-block">
                    <p
                      className="confirmation-itinerary-hotel-strip--title-block--title"
                      title={hotel.hotel_name}
                    >
                      {hotel.hotel_name}
                    </p>
                    <div className="confirmation-itinerary-hotel-strip--title-block--rating">
                      {Array.from({ length: hotel?.star_rating }, () => (
                        <span className="rate-icon" key={uniq()}>
                          <i className={`sky-icons ${hotelRecommendations?.starIcon} star-icon`} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="confirmation-itinerary-hotel-strip--item-info--divider" />
                  <div className="confirmation-itinerary-hotel-strip--price-block">
                    <div className="price">
                      <span className="hotel-price">
                        {actualPrice ? (
                          <span className="actual-price">
                            {price?.currency} {actualPrice}
                          </span>
                        ) : null}
                        {price?.currency} {hotelPrice}
                      </span>
                      <span className="price-label">
                        /{hotelRecommendations?.note}
                      </span>
                    </div>
                    <div className={`tax ${!price?.tax ? 'hide' : ''} `}>
                      <span className="tax-price">
                        + {price?.currency} {tax}{' '}
                      </span>
                      <span className="tax-label">{hotelRecommendations?.taxFeeLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperComponent.Slide>
          );
        })}
      </SwiperComponent>
      {hotelRecommendations?.ctaLabel && (
        <Button
          variant="link"
          size="small"
          containerClass="show-more-cta"
          onClick={() => clickHandler({}, showMoreUrl)}
        >
          <span className="text">{hotelRecommendations?.ctaLabel} </span>
          <span className="icon-accordion-down-simple" />
        </Button>
      )}
    </div>
  );
};

HotelStrip.propTypes = {
  hotelList: PropTypes.array,
  arrivalCityName: PropTypes.string,
  showMoreUrl: PropTypes.string,
  isBookingFlow: PropTypes.string,
  isModificationFlow: PropTypes.bool,
  isCancelFlightFlow: PropTypes.string,
  hotelRecommendations: PropTypes.object,
  stripType: PropTypes.string,
  analyticsHandler: PropTypes.func,
};

export default HotelStrip;
