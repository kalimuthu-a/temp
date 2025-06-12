import React from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import { MEMBER } from '../../constants/common';
import pushAnalytic from '../../functions/analyticEvents';

function MemberBenefitsPage({
  persona = '',
  onCloseHandler,
  mfLabels,
  activeScreen,
  nextStep = () => {},
}) {
  const isMember = persona?.toLowerCase() === MEMBER?.toLowerCase();
  const handleClose = () => {
    onCloseHandler();
    pushAnalytic({
      state: '',
      event: 'I will do later',
    });
  };

  return (
    <PopupModalWithContent
      overlayClickClose={false}
      onOutsideClickClose={null}
      className="popup-modal-with-content-login-sso-form"
      mfLabels={mfLabels}
      modalTitle={mfLabels?.welcomeMessage?.html || 'Hi there, Welcome!'}
      activeScreen={activeScreen}
      setActiveScreen={() => {}}
      customPopupContentClassName="login-sso-mf-modal login-sso-mf-modal-memberbenefit"
      closeButtonIconClass={isMember ? '' : 'invisible'}
      carouselImages
      hideBannerImage
      onCloseHandler={onCloseHandler}
    >
      <h1 className="sh6 text-primary d-flex align-items-center pb-10 loyalty-content">
        <img
          src={mfLabels?.loyaltyInformation?.announcementLabelIcon?._publishUrl}
          className="pe-2"
          alt=""
        />
        {mfLabels?.loyaltyInformation?.announcementLabel}
        <img
          src={mfLabels?.loyaltyInformation?.announcementLabelIcon?._publishUrl}
          className="icon-edit ps-2"
          alt=""
        />
      </h1>
      <p
        className="body-large-regular text-primary mb-15"
        dangerouslySetInnerHTML={{
          __html: mfLabels?.loyaltyInformation?.welcomeDescription.html,
        }}
      />
      <h6 className="body-large-regular text-tertiary mb-10">
        {mfLabels?.loyaltyInformation?.benefitsLabel}
      </h6>
      <ul className="mb-10">
        {mfLabels?.loyaltyInformation?.benefitsContent?.map((item) => (
          <li
            key={item}
            className="d-flex align-items-center loyalty-content pb-4"
          >
            <img
              src={
                mfLabels?.loyaltyInformation?.benefitsContentIcon?._publishUrl
              }
              className="pe-2"
              alt=""
            />
            <span className="body-large-regular text-primary">{item}</span>
          </li>
        ))}
      </ul>
      <p
        className="tags-medium text-tertiary mb-10 d-sm-none d-md-block"
        dangerouslySetInnerHTML={{
          __html: mfLabels?.loyaltyInformation?.note1?.html,
        }}
      />
      <Button onClick={nextStep}>
        {mfLabels?.loyaltyInformation?.enrollMeCtaLabel}
      </Button>
      <a
        onClick={handleClose}
        className="d-flex primary-main justify-content-center body-large-regular mt-10 cursor-pointer"
      >
        {mfLabels?.loyaltyInformation?.enrollAfterLabel}
      </a>
    </PopupModalWithContent>
  );
}

MemberBenefitsPage.propTypes = {
  persona: PropTypes.string.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  mfLabels: PropTypes.object.isRequired,
  activeScreen: PropTypes.string.isRequired,
  nextStep: PropTypes.func,
};
export default MemberBenefitsPage;
