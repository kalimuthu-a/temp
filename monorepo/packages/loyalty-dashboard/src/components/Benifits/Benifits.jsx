import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { useUserSummaryContext } from '../../store/user-summary-context';
import {
  USER_CARD, TIER, TABNAME,
  QUERYPARAM_KEY,
  TIER_BENEFIT_UTLISATION_TAB,
  VOUCHER_HISTORY_TAB, VOUCHER_CONSTANTS,
  ANALYTICS_EVENTS, VOUCHER_DASHBOARD } from '../../constants';
import { getUpdatedPathWithQueryParam } from '../../utils';
import analyticEvents from '../../utils/analyticEvents';

const LoyaltyCarousel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [bankTab, setBankTab] = useState(0);
  const [activeTabdata, setActiveTabData] = useState({});
  const [isMobile] = useIsMobile();
  const { aemData, userData } = useUserSummaryContext();
  let cardUrl = getUpdatedPathWithQueryParam(aemData?.claimedBenefitsCtaPath, QUERYPARAM_KEY.TABKEY, TIER_BENEFIT_UTLISATION_TAB.PARTNERS);
  cardUrl = getUpdatedPathWithQueryParam(cardUrl, QUERYPARAM_KEY.VOUCHERFILTER_KEY, VOUCHER_HISTORY_TAB.EXPIRING);
  let url = getUpdatedPathWithQueryParam(aemData?.claimedBenefitsCtaPath, QUERYPARAM_KEY.TABKEY, TIER_BENEFIT_UTLISATION_TAB.ALL_TRANSACTIONS);
  url = getUpdatedPathWithQueryParam(url, QUERYPARAM_KEY.VOUCHERFILTER_KEY, VOUCHER_HISTORY_TAB.REDEEMED);

  const mergeVouchersAemData = (aemPartnersData = [], partnerVouchers = []) => {
    const lookup = new Map(
      aemPartnersData.flatMap(({ partnerName, voucherCardCode, ...offer }) => {
        if (!partnerName || !voucherCardCode || Object.keys(offer).length === 0) return [];
        return [[`${partnerName.toLowerCase()}-${voucherCardCode.toLowerCase()}`, offer]];
      }),
    );

    return partnerVouchers
      .filter((voucher) => voucher?.isActive && voucher?.category && voucher?.offerType)
      .map((voucher) => {
        const key = `${voucher.category.toLowerCase()}-${voucher.offerType.toLowerCase()}`;
        const offerDetails = lookup.get(key);
        return offerDetails ? { ...voucher, ...offerDetails } : null;
      })
      .filter(Boolean);
  };

  const handlePartnerOfferCard = (data) => {
    const { category, offerType } = data;

    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.LOYALTY_VOUCHER,
        pageInfo: {
          pageName: VOUCHER_DASHBOARD.PAGE_NAME,
          siteSection: VOUCHER_CONSTANTS.SITE_SECTION,
          projectName: VOUCHER_CONSTANTS.PROJECT_NAME,
          journeyFlow: VOUCHER_CONSTANTS.JOURNEY_FLOW,
        },
        eventInfo: {
          name: offerType,
          component: category,
        },
      },
    };
    analyticEvents(analyticsObj);
  };

  const viewClaimedBenefit = () => {
    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.VIEW_CLAIM_BENEFITS,
        pageInfo: {
          pageName: VOUCHER_DASHBOARD.PAGE_NAME,
          siteSection: VOUCHER_CONSTANTS.SITE_SECTION,
          projectName: VOUCHER_CONSTANTS.PROJECT_NAME,
          journeyFlow: VOUCHER_CONSTANTS.JOURNEY_FLOW,
        },
        eventInfo: {
          name: ANALYTICS_EVENTS.VIEW_CLAIM_BENEFITS,
        },
      },
      event: 'Link/ButtonClick',
    };
    analyticEvents(analyticsObj);
  };

  useEffect(() => {
    const updatedCard = [];
    const tabData = aemData?.memberBenefitTabs?.find((item) => item?.tabType?.toLowerCase() === 'withsubtabs');
    if (userData?.card_details?.length > 0) {
      userData?.card_details.map((item) => {
        const filterTab = tabData?.withSubtabOffers
          .find((subitem) => subitem?.tabDetails?.key.toLowerCase() === item?.series_name?.toLowerCase());
        filterTab ? updatedCard.push(filterTab) : '';
      });
      setBankTab(updatedCard);
    }
    setActiveTabData(aemData?.memberBenefitTabs?.[0]);
  }, [userData]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleTabClick = (item) => {
    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.DASHBOARD_TAB_BENFIT,
        interactionType: item.tabName,
        pageInfo: {
          pageName: VOUCHER_DASHBOARD.PAGE_NAME,
          siteSection: VOUCHER_CONSTANTS.SITE_SECTION,
          projectName: VOUCHER_CONSTANTS.PROJECT_NAME,
          journeyFlow: VOUCHER_CONSTANTS.JOURNEY_FLOW,
        },
        eventInfo: {
          name: item?.tabName,
        },
      },
    };
    analyticEvents(analyticsObj);
    setActiveTabData(item);
  };
  const handleClick = (event, link) => {
    event.preventDefault();
    window.location.href = link;
  };

  const getCouponData = (data, couponLeft) => {
    return data?.replace('{numberOfPassesLeft}', couponLeft);
  };

  const getBackgroundImage = (data, isLastElementFullWidth) => {
    if (isMobile) {
      return isLastElementFullWidth
        ? data?.cardImageStretchedMobile?._publishUrl
        : data?.cardImageMobile?._publishUrl;
    }
    return data?.cardImage?._publishUrl;
  };

  const getLogoImage = (data) => {
    return isMobile
      ? data?.cardLogoImageMobile?._publishUrl
      : data?.cardLogoImage?._publishUrl;
  };

  const addIcon = (list = []) => {
    const elementToAdd = { showIcon: true };
    const updatedList = [].concat(...list?.map((item) => [item, elementToAdd]))?.slice(0, -1);
    return updatedList.map((item, index) => (
      item?.showIcon ? (
        <span className="icon-add-circle additional" key={`icon_${index}`} />
      ) : (
        <div className="container" key={`container_${index}`}>
          <div className="primary-container">
            <div className="focus-state">
              <span className={item?.icon} />
            </div>
            <div className="child-container">
              <span className="intro-header">
                {item?.title}
              </span>
              <span className="sub-title">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      )
    ));
  };

  const subCards = (subCardItems, key = '') => {
    const cardItems = subCardItems?.filter((card) => card.cardType !== USER_CARD?.MAINCARD);
    return (
      cardItems?.map((item, index) => {
        const leftInfo = userData
          ?.couponDetail
          ?.filter((item) => item?.category?.toLowerCase() === key?.toLowerCase())?.length;
        return (
          <a
            key={`card_${index}`}
            className={`offer-card 
            bg-image rounded 
            p-6 p-md-10 d-flex 
            flex-column 
            align-items-stretch 
            text-decoration-none 
            text-secondary-white 
            additional-gradient 
            offer-card-${index + 2}`}
            style={{ backgroundImage: `url(${item?.cardImage?._publishUrl})` }}
            onClick={(e) => handleClick(e, item?.cardCtaPath)}
          >
            <div className={`offer-card-section ${item?.cardTextColor === 'blue' ? 'darktheme-color' : ''}`}>
              <div className="offer-section-1 d-flex justify-content-between align-items-center w-100">

                {item?.passesLeftLabel && leftInfo > 0
                  ? <div className="pass-indicator">{item?.passesLeftLabel?.replace('{numberOfPassesLeft}', leftInfo)}</div>
                  : (
                    <div>
                      <span className="icon-Indigo_Logo icon-hide" />
                      <span className="icon-close-circle icon-show" />
                    </div>
                  )}
                <div className="subheader-ta">
                  {item?.termsAndConditionsLabel || 'T&C*'}
                </div>
              </div>

              <div className="offer-section-2 d-flex flex-column justify-content-evenly align-items-start w-100">
                <div className={`sub-heading ${item?.cardTextColor === 'blue' ? 'darktheme-color' : ''}`}>
                  {parse(item?.cardTitle?.html || '')}
                </div>
                <div className={`expiry-sub-card ${item?.cardTextColor === 'blue' ? 'darktheme-color' : ''}`}>{item?.cardExpiryLabel}</div>
              </div>
            </div>
          </a>
        );
      })
    );
  };
  const partnersSubCards = () => {
    const partnerVouchers = userData?.partner_vouchers ?? [];
    const mergedData = mergeVouchersAemData(activeTabdata?.withoutSubtabOffers, partnerVouchers);
    analyticEvents();
    return mergedData?.map((data, index) => {
      if (!data) return null;
      const isLastElementFullWidth = isMobile && mergedData.length % 2 !== 0 && index === mergedData.length - 1;
      const backgroundImage = getBackgroundImage(data, isLastElementFullWidth);
      const cardLogo = getLogoImage(data);
      return (
        <a
          key={`card_${index}`}
          className="partner-offer-card bg-image rounded p-6 p-md-8 d-flex flex-column align-items-stretch text-decoration-none text-secondary-white"
          href={`${cardUrl}`}
          onClick={() => handlePartnerOfferCard(data)}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%), url(${backgroundImage})`,
            ...(isLastElementFullWidth ? { gridColumn: 'span 2' } : {}),
          }}
        >
          <div className="partner-offer-card-topSection">
            {cardLogo && (
              <img
                src={cardLogo}
                alt={data?.cardLogoImageAltText}
                className="partner-offer-card-topSection-image"
              />
            )}
            {(data?.passesLeftLabel && data?.couponLeft) && (
              <div className="partner-offer-card-topSection-left">
                {getCouponData(data?.passesLeftLabel, data?.couponLeft)}
              </div>
            )}
          </div>

          <div className="partner-offer-card-bottomSection">
            {data?.cardTitle?.html && (
              <div className="partner-offer-card-bottomSection-heading">
                {parse(data.cardTitle.html)}
              </div>
            )}
            {data?.cardDescription?.html && (
              <div className="partner-offer-card-bottomSection-subHeading">
                {parse(data.cardDescription.html)}
              </div>
            )}
          </div>
        </a>
      );
    });
  };

  const mainCard = () => {
    const cardItem = activeTabdata?.withoutSubtabOffers?.find((item) => item.cardType === USER_CARD?.MAINCARD);
    const leftInfo = userData
      ?.couponDetail
      ?.filter((item) => (item?.category?.toLowerCase()
        === USER_CARD?.PRIME_PASS
        && item?.offerType?.toLowerCase()
        === USER_CARD?.EPRIME))?.length;
    const passLeft = cardItem?.passesLeftLabel?.replace('{numberOfPassesLeft}', leftInfo);
    return (
      <div
        style={{ backgroundImage: `url(${cardItem?.cardImage?._publishUrl})` }}
        className="offer-card
        bg-image
        offer-card-1
        offers-card__type1
        rounded p-6 p-md-10
        d-flex flex-column
        align-items-stretch
        text-decoration-none"
        onClick={(event) => handleClick(event, cardItem?.cardCtaPath)}
      >
        <div className="d-flex justify-content-between flex-column h-100">
          <div
            className="offer-section-1 d-flex justify-content-between align-items-center"
          >
            <div className="lighttheme-color">
              <span className="icon-Indigo_Logo" />
            </div>
            {leftInfo > 0
              && <div className="pass-indicator">{passLeft}</div>}
          </div>
          <div className="layout-container">
            {cardItem?.associatedBenefitsList?.length > 0
              && addIcon(cardItem?.associatedBenefitsList)}
          </div>
          <div
            className="offer-section-2 d-flex flex-column justify-content-evenly heading-container w-100"
          >
            <div className="heading">
              {parse(cardItem?.cardTitle?.html || '')}
            </div>
            <div className="expiry">{cardItem?.cardExpiryLabel}</div>

          </div>
        </div>
      </div>
    );
  };

  const renderContent = (type) => {
    if (type === TABNAME?.NOTBASETIER) {
      return (
        <div>
          <div className="content-heading">
            {parse(activeTabdata?.tabDescription?.html || '')}
          </div>

          <div className="card-container">
            <div className="offers-cards-container offers-cards-container__six-cards">
              {mainCard()}
              {subCards(activeTabdata?.withoutSubtabOffers)}
            </div>
            {aemData?.claimedBenefitsCtaLabel && aemData?.claimedBenefitsCtaPath
              && (
                <div className="view-all">
                  <a href={aemData?.claimedBenefitsCtaPath}>
                    {aemData?.claimedBenefitsCtaLabel}
                  </a>
                  <span className="icon-accordion-left-24" />
                </div>
              )}
          </div>
        </div>
      );
    }
    if (type === TABNAME?.BASETIER) {
      return (
        <div id="BaseLoyal">
          <div className="content-heading">
            {parse(activeTabdata?.tabDescription?.html || '')}
          </div>

          <div className="card-container-cobrand">
            <div className="offers-cards-container offers-cards-container__six-cards">
              {subCards(activeTabdata?.withoutSubtabOffers)}
            </div>
          </div>
        </div>
      );
    }
    if (type === TABNAME?.COBRAND) {
      return (
        <div className="coBrand-container">
          <div className="content-heading">
            {parse(activeTabdata?.tabDescription?.html || '')}
          </div>

          <div className="co-brand-tabs">
            <div className="tabs-cobrand">
              {bankTab?.map((item, index) => (
                <div
                  key={`co-brand-tabs_${index}`}
                  className={`tab ${activeTab === index ? 'checked-cobrand' : ''}`}
                  onClick={() => handleTabChange(index)}
                >{item?.tabDetails?.value}
                </div>
              ))}
            </div>
          </div>
          <div className="card-container-cobrand">
            <div className="offers-cards-container offers-cards-container__six-cards">
              {subCards(bankTab[activeTab]?.offerCards, bankTab[activeTab]?.tabDetails?.key)}
            </div>
            {aemData?.claimedBenefitsCtaLabel && aemData?.claimedBenefitsCtaPath
              && (
                <div className="view-all">
                  <a href={aemData?.claimedBenefitsCtaPath}>
                    {aemData?.claimedBenefitsCtaLabel}
                  </a>
                  <span className="icon-accordion-left-24" />
                </div>
              )}
          </div>
        </div>
      );
    }
    if (type === TABNAME?.PARTNERSHIPS) {
      return (
        <div id="BaseLoyal">
          <div className="content-heading">
            {parse(activeTabdata?.tabDescription?.html || '')}
          </div>

          <div className="card-container-partner">
            <div className="card-container-partner-offers">
              {partnersSubCards()}
            </div>
            {aemData?.claimedBenefitsCtaLabel && aemData?.claimedBenefitsCtaPath
              && (
                <div className="view-all">
                  <a
                    onClick={() => viewClaimedBenefit()}
                    href={`${url}`}
                  >
                    {aemData?.claimedBenefitsCtaLabel}
                  </a>
                  <span className="icon-accordion-left-24" />
                </div>
              )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="loyaltycarousel">
      <div className="loyaltycarousel-tabs-container">
        {aemData?.memberBenefitTabs
          ?.filter((item) => {
            if (item.tabName?.toLowerCase() === TABNAME?.COBRAND?.toLowerCase()) {
              return userData?.card_details?.length > 0;
            }
            if (item.tabName?.toLowerCase() === TABNAME?.PARTNERSHIPS?.toLowerCase()) {
              return userData?.partner_vouchers?.length > 0;
            }
            return true;
          })
          .map((item, index) => (
            <div
              key={`Brand_${index}`}
              className={`loyaltycarousel-tabs-container-tab 
              ${activeTabdata?.tabName === item?.tabName
                ? 'loyaltycarousel-tabs-container-checked' : ''}`}
              onClick={() => handleTabClick(item)}
            >
              {item?.tabName}
            </div>
          ))}
      </div>

      <div className="section-title">{activeTabdata?.tabTitle}</div>

      <div className="wrapper">
        {(() => {
          const isTierBenefitsTab = activeTabdata?.tabName === TIER?.TIERBENIFITS;
          const isNotBaseTier = userData?.currentTier?.toLowerCase() !== TIER?.BASE;
          const isCoBrandTab = activeTabdata?.tabName?.toLowerCase() === TABNAME?.COBRAND;
          const isPartnersTab = activeTabdata?.tabName?.toLowerCase() === TABNAME?.PARTNERSHIPS;

          if (isTierBenefitsTab) return renderContent(isNotBaseTier ? TABNAME?.NOTBASETIER : TABNAME?.BASETIER);
          if (isCoBrandTab) return renderContent(TABNAME?.COBRAND);
          if (isPartnersTab) return renderContent(TABNAME?.PARTNERSHIPS);

          return null;
        })()}
      </div>
    </div>
  );
};

export default LoyaltyCarousel;
