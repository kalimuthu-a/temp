import React, { useState, useEffect } from 'react';
import LoyaltyAuthBanner from 'skyplus-design-system-app/dist/des-system/LoyaltyAuthBanner';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

import { CONSTANTS } from '../../constants';
import { useSeatMapContext } from '../../store/seat-map-context';

import './AuthBannerLoyalty.scss';

function AuthBannerLoyalty() {
  const { TOGGLE_LOGIN_POPUP, LOGIN_POPUP, ENROLL_SSO_LOYALTY_POPUP, MEMBER } = CONSTANTS;
  const { seatMainAemData, isLoyaltyEnabled, authUser } = useSeatMapContext();

  const [totalEarnPoints, setTotalEarnPoints] = useState(0);
  const { loyaltySignupBanner, loyaltySignUpBannerMobile } = seatMainAemData || {};
  const showLoyaltyBanner = !authUser?.loyaltyMemberInfo?.FFN;
  const [isMobile] = useIsMobile();
  const loyaltyAuthBannerContent = isMobile
    ? loyaltySignUpBannerMobile
    : loyaltySignupBanner;
  const { heading, ctaLabel, secondaryCtaLabel, description, image } = loyaltyAuthBannerContent || {};

  const handleAuthClick = () => {
    const event = new CustomEvent(TOGGLE_LOGIN_POPUP, {
      bubbles: true,
      detail: { loginType: LOGIN_POPUP },
    });

    document.dispatchEvent(event);
  };

  const handleLoyaltyAuthClick = () => {
    const toggleLoginPopupEvent = (config) => new CustomEvent(TOGGLE_LOGIN_POPUP, config);
    document.dispatchEvent(
      toggleLoginPopupEvent({
        bubbles: true,
        detail: { loginType: ENROLL_SSO_LOYALTY_POPUP, persona: MEMBER },
      }),
    );
  };

  const getDescription = (desc) => {
    const updatedDesc = desc;
    if (updatedDesc) {
      updatedDesc.html = desc?.html?.replace?.('{discountPercentage}', 10);
    }
    return updatedDesc;
  };

  const addTotalMilesForLoyalty = (buttonText) => {
    const miles = totalEarnPoints || '';
    return buttonText?.replace?.('{numberOfMiles}', miles);
  };

  const loyaltyAuthBannerData = authUser
    ? {
      image: image?._publishUrl || '',
      btnContent: addTotalMilesForLoyalty(secondaryCtaLabel),
      subHeading: getDescription(description),
      heading: heading && `${authUser?.name?.first}, ${heading}`,
      handleClick: handleLoyaltyAuthClick,
    }
    : {
      image: image?._publishUrl || '',
      btnContent: addTotalMilesForLoyalty(ctaLabel),
      subHeading: getDescription(description),
      heading,
      handleClick: handleAuthClick,
    };

  useEffect(() => {
    const obj = localStorage.getItem('journeyReview');
    const parsedObj = JSON.parse(obj) || {};
    setTotalEarnPoints(parsedObj?.priceBreakdown?.totalPoints);
  }, []);

  return (
    isLoyaltyEnabled
    && loyaltyAuthBannerContent?.heading
    && showLoyaltyBanner && <LoyaltyAuthBanner {...loyaltyAuthBannerData} />
  );
}

export default AuthBannerLoyalty;
