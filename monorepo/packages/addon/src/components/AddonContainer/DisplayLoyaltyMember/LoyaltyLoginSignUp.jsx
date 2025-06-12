import React, { useState, useEffect } from 'react';
import LoyaltyAuthBanner from 'skyplus-design-system-app/dist/des-system/LoyaltyAuthBanner';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { useCustomEventListener } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import PropTypes from 'prop-types';
import { AppContext } from '../../../context/AppContext';
import { formatPoints } from '../../../functions/utils';

export const TOGGLE_LOGIN_POPUP = 'toggleLoginPopupEvent';
export const LOGIN_POPUP = 'loginSSOPopup';
export const ENROLL_SSO_LOYALTY_POPUP = 'EnrollSSOloyalty';

function LoyaltyLoginSignUp({ mfData, isAuthenticated, loggedInUser }) {
  const {
    heading,
    ctaLabel,
    description,
    image,
    mobileCtaLabel,
    secondaryCtaLabel,
    mobileSecondaryCtaLabel,
  } = mfData?.loyaltySignUpBanner || {};

  if (!heading) {
    return null;
  }

  const {
    state: { ...state },
  } = React.useContext(AppContext);

  const [isMobile] = useIsMobile();
  const [totalEarnPoints, setTotalEarnPoints] = useState(0);

  const discountPer = state.getAddonData?.Loyalty?.discount?.[0]?.discountPer || 0;

  const addDiscountPercentageToText = (desc) => {
    return { html: desc?.html?.replace?.('{discountPercentage}', discountPer) };
  };

  const addTotalMilesForLoylty = (buttonText) => {
    return buttonText?.replace?.('{numberOfMiles}', formatPoints(totalEarnPoints));
  };

  useCustomEventListener('REVIEW_SUMMARY_API_DATA', (event) => {
    if (event?.fareSummaryData?.priceBreakdown?.totalPotentialPoints) {
      setTotalEarnPoints(event?.fareSummaryData?.priceBreakdown?.totalPotentialPoints);
    }
  });

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
      toggleLoginPopupEvent({ bubbles: true, detail: { loginType: ENROLL_SSO_LOYALTY_POPUP, persona: 'Member' } }),
    );
  };

  const loyaltyAuthBannerData = isAuthenticated ?
    {
      image: image?._publishUrl || '',
      btnContent: isMobile ? mobileSecondaryCtaLabel : addTotalMilesForLoylty(secondaryCtaLabel),
      subHeading: addDiscountPercentageToText(description),
      heading: heading && `${loggedInUser?.name?.first}, ${heading}`,
      handleClick: handleLoyaltyAuthClick,
    } : {
      image: image?._publishUrl || '',
      btnContent: isMobile ? mobileCtaLabel : addTotalMilesForLoylty(ctaLabel),
      subHeading: addDiscountPercentageToText(description),
      heading,
      handleClick: handleAuthClick,
    };

  useEffect(() => {
    const obj = localStorage.getItem('journeyReview');
    const parsedObj = JSON.parse(obj) || {};
    setTotalEarnPoints(parsedObj?.priceBreakdown?.totalPotentialPoints);
  }, []);

  return (
    <LoyaltyAuthBanner
      {...loyaltyAuthBannerData}
    />
  );
}

LoyaltyLoginSignUp.propTypes = {
  mfData: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    name: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
    }),
  }),
};

export default LoyaltyLoginSignUp;
