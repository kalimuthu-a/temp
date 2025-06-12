/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useSelector } from 'react-redux';

const ExploreCity = () => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { exploreLabel, defaultIataDetails } = mfData?.itineraryMainByPath?.item || '';
  const [exploreCityObj, setExploreCityObj] = useState([]);
  const exploreCities = useSelector(
    (state) => state.itinerary?.exploreCitiesData,
  ) || [];
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
      enabled: true,
    },
    grid: {
      rows: 1,
      fill: 'column',
    },
    spaceBetween: 0,
    slidesPerView: 1,
    cssMode: true,
  };

  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const passengerDetails = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  const PaxName = passengerDetails && `${passengerDetails[0]?.name.first} ${passengerDetails[0]?.name.last}`;
  const cityName = journeyDetail.length > 0 ? (journeyDetail[0]?.journeydetail?.destinationCityName) : '';
  const { exploreImages } = defaultIataDetails || {};
  const exploreTitle = `${exploreLabel} ${cityName}`;
  const exploreCitiesApiData = exploreCities[0]?.exploreImages;

  useEffect(() => {
    if (exploreCitiesApiData?.length > 0) {
      setExploreCityObj(exploreCitiesApiData);
    } else {
      setExploreCityObj(exploreImages);
    }
  }, [exploreCityObj, exploreCitiesApiData]);

  return (
    exploreCityObj?.length > 0
      ? (
        <div className="swiper-explore" key={uniq()}>
          {exploreTitle && (
            <HtmlBlock
              html={exploreTitle}
              className="skyplus-text travel-tips-heading"
            />
          )}
          <SwiperComponent
            swiperConfig={swiperConfig}
            swiperSelectorClass="explore-city"
            containerClass="mobile-slider travel-tips-slider swiper-lg"
          >
            {exploreCityObj?.map((cityCard) => (
              <SwiperComponent.Slide key={uniq()}>
                <div className="travel-tips-container">
                  <div className="travel-tips-container-tile">
                    <div className="travel-tips-container-tile__bg-img">
                      <img
                        alt="Explore Images"
                        src={cityCard?.image?._publishUrl || ''}
                        loading="lazy"
                      />
                    </div>
                    <a href={cityCard?.path || '/'} className="travel-tips-container-tile-content">
                      <div className="skyplus-text link-sm">
                        {cityCard?.title?.replace('{name}', PaxName)?.replace('{place}', cityName)}
                      </div>
                    </a>
                  </div>
                </div>
              </SwiperComponent.Slide>
            ))}
          </SwiperComponent>
        </div>
      ) : null
  );
};

export default ExploreCity;
