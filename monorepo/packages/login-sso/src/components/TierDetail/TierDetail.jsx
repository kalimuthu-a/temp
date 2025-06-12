import React, { useEffect } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import PropTypes from 'prop-types';
import COOKIE_KEYS from '../../constants/cookieKeys';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import { MEMBER } from '../../constants/common';
import { SCREEN_TYPE } from '../../constants';
import './TierDetail.scss';
import Cookies from '../../functions/cookies';

// Define TierCard outside of TierDetail to avoid redefining it on every render
const TierCard = ({
  active,
  title,
  note,
  sharedData,
  localLoyaltyMemberInfo,
}) => {
  return (
    <div
      className={`tier-card p-8 d-flex gap-12 ${
        active ? 'active bg-secondary-medium ' : ''
      }`}
    >
      <span
        className={`tier-card-cross-container d-flex justify-content-center rounded-circle position-relative ${
          active ? 'active bg-primary-main text-white' : 'bg-secondary-medium'
        }`}
      >
        <Icon className="icon-close-simple" size="md" />
      </span>
      <span className="tier-card-text-container">
        <div className="tier-card-heading text-secondary body-large-medium">
          {title}
        </div>
        <div className="tier-card-subheading text-primary body-small-regular">
          {note.replace(
            '{ffno}',
            sharedData?.loyaltyMemberInfo?.FFN
              || sharedData?.loyaltyMemberInfo?.ffn
              || localLoyaltyMemberInfo?.FFN
              || localLoyaltyMemberInfo?.ffn
              || '',
          )}
        </div>
      </span>
    </div>
  );
};

TierCard.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
  sharedData: PropTypes.object,
  localLoyaltyMemberInfo: PropTypes.object,
};

function TierDetail({
  persona = '',
  onCloseHandler = () => {},
  mfLabels,
  sharedData,
  activeScreen,
  setActiveScreen,
}) {
  const getLoyaltydetails = () => {
    const loggedInUserDetails = Cookies.get(COOKIE_KEYS.USER, true, true);
    return loggedInUserDetails?.loyaltyMemberInfo || null;
  };

  let localLoyaltyMemberInfo;

  useEffect(() => {
    localLoyaltyMemberInfo = getLoyaltydetails();
  }, []);

  const isMember = persona?.toLowerCase() === MEMBER?.toLowerCase();

  const tierData = mfLabels?.loyaltyInformation?.tierStatus;

  const nextStep = () => {
    setActiveScreen(SCREEN_TYPE.COBRAND_PARTNER_BANK);
  };

  return (
    <div>
      <PopupModalWithContent
        overlayClickClose={false}
        onOutsideClickClose={null}
        className="popup-modal-with-content-login-sso-form"
        mfLabels={mfLabels}
        modalTitle={
          mfLabels?.loyaltyInformation?.tierWelcomeText?.html
          || 'Welcome to IndiGo 6E Loyalty Program'
        }
        activeScreen={activeScreen}
        setActiveScreen={() => {}}
        customPopupContentClassName="login-sso-mf-modal login-sso-mf-modal-memberbenefit"
        closeButtonIconClass={isMember ? '' : 'invisible'}
        carouselImages
        hideBannerImage
        onCloseHandler={onCloseHandler}
      >
        <div className="tier-cards-container overflow-hidden d-flex flex-column rounded-1 shadow-sm mb-25">
          {tierData?.map((tier) => (
            <TierCard
              key={tier.title}
              active={tier.active}
              title={tier.title}
              note={tier.note}
              sharedData={sharedData}
              localLoyaltyMemberInfo={localLoyaltyMemberInfo}
            />
          ))}
        </div>
        <Button onClick={nextStep}>
          {mfLabels?.loyaltyInformation?.continueToCoBrandApplication
            || 'Continue to Co-Brand Application'}
        </Button>
      </PopupModalWithContent>
    </div>
  );
}

TierDetail.propTypes = {
  persona: PropTypes.string.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  mfLabels: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func,
  activeScreen: PropTypes.string.isRequired,
  sharedData: PropTypes.object.isRequired,
};

export default TierDetail;
