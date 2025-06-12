import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import LoyaltyAuthBanner from 'skyplus-design-system-app/dist/des-system/LoyaltyAuthBanner';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

import {
  ENROLL_SSO_LOYALTY_POPUP,
  LOGIN_POPUP,
  TOGGLE_LOGIN_POPUP,
} from '../../constants/constants';
import { AppContext } from '../../context/appContext';

function AuthBannerLoyalty(props) {
  const {
    state: {
      isAuthenticated,
      loggedInUser,
      isLoyaltyAuthenticated,
      disableLoyalty,
      aemMainData: { loyaltySignUpBanner, loyaltySignUpBannerMobile },
    },
  } = useContext(AppContext);
  const [isMobile] = useIsMobile();
  const { name: { first = '' } = {} } = loggedInUser || {};
  const loyaltyAuthBannerContent = isMobile
    ? loyaltySignUpBannerMobile
    : loyaltySignUpBanner;
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
        detail: { loginType: ENROLL_SSO_LOYALTY_POPUP, persona: 'Member' },
      }),
    );
  };

  const getDescription = (desc) => {
    const _description = desc;
    if (desc?.html) {
      _description.html = desc?.html?.replace?.('{discountPercentage}', 10);
    }
    return _description;
  };

  const getButtonContent = (content) => {
    return content?.replace?.(
      '{numberOfMiles}',
      props?.totalEarnPoints?.toLocaleString?.(),
    );
  };
  const loyaltyAuthBannerData = isAuthenticated
    ? {
      image: image?._publishUrl || '',
      btnContent: getButtonContent(secondaryCtaLabel),
      subHeading: getDescription(description),
      heading: heading && `${first}, ${heading}`,
      handleClick: handleLoyaltyAuthClick,
    }
    : {
      image: image?._publishUrl || '',
      btnContent: getButtonContent(ctaLabel),
      subHeading: getDescription(description),
      heading,
      handleClick: handleAuthClick,
    };

  return (
    (!disableLoyalty && !isLoyaltyAuthenticated) && (
      <LoyaltyAuthBanner {...loyaltyAuthBannerData} />
    )
  );
}

AuthBannerLoyalty.propTypes = {
  totalEarnPoints: PropTypes.string,
};

export default AuthBannerLoyalty;
