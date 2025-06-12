import React from 'react';
import PropTypes from 'prop-types';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useSelector } from 'react-redux';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { CONSTANTS } from '../../constants';

export const TRAVELTIPS_VARIATION = {
  TRAVELCHECKOUTS: 'travelCheckouts',
  TRAVELREMINDERS: 'travelReminders',
};

const TravelTips = ({ swiperModel }) => {
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
      enabled: true,
    },
    grid: {
      rows: 1,
      fill: 'column',
    },
    spaceBetween: 8,
    slidesPerView: 2.5,
    cssMode: true,
  };

  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || [];
  const { passengers, journeysDetail, bookingDetails } = useSelector((state) => state.itinerary?.apiData) || {};

  const {
    travelTips,
    travelTipsAndRemindersLabel,
    addonOptions,
    checkoutOtherAddonsLabel,
  } = mfData?.itineraryMainByPath?.item || [];
  const isSectorInternational = (journeysDetail?.map(
    (journeys) => {
      return journeys?.segments?.map((seg) => seg?.international === true).includes(true);
    },
  ))?.includes(true) || false;

  const getAllSSRListSelected = () => {
    const list = [];
    passengers?.forEach((pItem) => {
      pItem?.seatsAndSsrs?.journeys?.forEach((jItem) => {
        jItem?.segments?.forEach((sItem) => {
          if (list?.length > 0 && (list?.indexOf(sItem?.bundleCode) === -1)) {
            list.push(sItem.bundleCode);
          }
          const ssrList = sItem?.ssrs?.map((ssrItem) => ssrItem.ssrCode);
          list.push(...ssrList);
        });
      });
    });
    return list;
  };

  const getSSRAEMConfigList = () => {
    const data = getAllSSRListSelected();
    return addonOptions?.filter((addonList) => {
      const { ssrList, categoryBundleCode } = addonList;
      const commonSSRs = ssrList?.filter((aemSsritem) => data.includes(aemSsritem));
      if (data?.indexOf(categoryBundleCode) === -1 && commonSSRs.length < 1) {
        if (
          !isSectorInternational
          && (categoryBundleCode === CONSTANTS.BUNDLECODE.BAR
            || categoryBundleCode === CONSTANTS.BUNDLECODE.GOODNIGHT)
        ) {
          return null;
        }
        if (isSectorInternational && categoryBundleCode === CONSTANTS.BUNDLECODE.PROT) {
          return null;
        }
        return addonList;
      }
      return null;
    });
  };
  // eslint-disable-next-line no-shadow, consistent-return
  const getSwiperTitle = (swiperModel) => {
    switch (swiperModel) {
      case TRAVELTIPS_VARIATION.TRAVELREMINDERS:
        swiperConfig.slidesPerView = 2.25;
        swiperConfig.cssMode = false;
        return {
          title: travelTipsAndRemindersLabel.html,
          swiperClass: 'mobile-slider travel-tips-slider travel-remainder',
          swiperConfigList: travelTips || [],
        };
      case TRAVELTIPS_VARIATION.TRAVELCHECKOUTS:
        swiperConfig.navigation.enabled = true;
        if (isMobile) swiperConfig.slidesPerView = 2.25;
        else swiperConfig.slidesPerView = 4;
        return {
          title: checkoutOtherAddonsLabel.html,
          swiperClass: 'mobile-slider travel-tips-slider swiper-md travel-checkout',
          swiperConfigList: getSSRAEMConfigList() || addonOptions,
        };
      default:
        return {};
    }
  };
  const uiConfig = getSwiperTitle(swiperModel);
  const swiperTitle = uiConfig?.title;
  const swiperDetailsList = uiConfig?.swiperConfigList || [];

  return (
    <div>

      {swiperDetailsList.length > 0 && !bookingDetails?.isFlexPay && (
        <>
          <HtmlBlock
            html={swiperTitle}
            className={`skyplus-text travel-tips-heading 
            ${TRAVELTIPS_VARIATION.TRAVELREMINDERS === swiperModel ? 'travel-remainder-heading' : ''}
            ${TRAVELTIPS_VARIATION.TRAVELCHECKOUTS === swiperModel ? 'checkout-remainder-heading' : ''}`}
          />
          <SwiperComponent
            swiperConfig={swiperConfig}
            swiperSelectorClass={swiperModel}
            containerClass={uiConfig.swiperClass}
            key={uniq()}
          >
            {swiperDetailsList.map((item) => (
              <SwiperComponent.Slide key={uniq()}>
                <div className="travel-tips-container">
                  <div className="travel-tips-container-tile">
                    <div className="travel-tips-container-tile__bg-img">
                      {swiperModel === TRAVELTIPS_VARIATION.TRAVELREMINDERS ? (
                        <img alt="travel-reminders" src={item.image?._publishUrl} loading="lazy" />
                      ) : (<img alt="checkout-addons" src={item.tileImage?._publishUrl} loading="lazy" />)}
                    </div>
                    {swiperModel === TRAVELTIPS_VARIATION.TRAVELREMINDERS && (
                      <a href={item.path ? item.path : '/'} className="travel-tips-container-tile-content">
                        <div className="skyplus-text link-sm">
                          {item.title}
                        </div>
                      </a>
                    )}
                    {swiperModel === TRAVELTIPS_VARIATION.TRAVELCHECKOUTS && (
                      <div className="travel-tips-container-tile-content">
                        <div>
                          {/* eslint-disable-next-line max-len */}
                          {item.tileLabel && (<span className="skyplus-text link-sm tile-label">{item.tileLabel}</span>)}
                        </div>
                        <div className="offer-sec">
                          <div className="tile-offer skyplus-text  link-sm">
                            {item.tileTitle}
                          </div>
                          <div className="tile-offer-amount"> {item.tileNote}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {swiperModel === TRAVELTIPS_VARIATION.TRAVELCHECKOUTS && (
                    <a href={item.path ? item.path : '/'} className="skyplus-text  link-sm tile-title">
                      {item?.title}
                    </a>
                  )}
                </div>
              </SwiperComponent.Slide>
            ))}
          </SwiperComponent>
        </>
      )}
    </div>
  );
};

TravelTips.propTypes = {
  swiperModel: PropTypes.string,
};
export default TravelTips;
