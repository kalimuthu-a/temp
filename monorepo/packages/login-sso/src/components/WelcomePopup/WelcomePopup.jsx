/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable i18next/no-literal-string */
// this file is soon to be deleted

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import pushAnalytic from '../../functions/analyticEvents';
import { SCREEN_TYPE } from '../../constants';

function WelcomePopup({
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  setSharedData,
}) {
  useEffect(() => {
    pushAnalytic({
      state: '',
      event: 'Loyality Dashboard',
    });
  }, []);
  const enrollCobrand = () => {
    setActiveScreen(SCREEN_TYPE.COBRAND_PARTNER_BANK);
    setSharedData((prev) => {
      return {
        ...prev,
        isformFieldsEditable: false,
        isDOBEditable: false,
        isGenderEditable: false,
      };
    });
  };
  return (
    <PopupModalWithContent
      className="className"
      onCloseHandler={onCloseHandler}
      modalTitle={mfLabels?.successTitle || 'Loyalty Dashboard'}
      customPopupContentClassName="Loyality_dashboard_welcome_popup"
      mobileBackgroundImage={mfLabels?.bannerImage?._publishUrl}
    >
      <Heading containerClass="h3 d-sm-none d-md-block">
        {mfLabels?.dashboardTitle || 'Loyalty Dashboard'}
      </Heading>
      <p className="mb-sm-12 mb-md-20 sub-heading">
        {mfLabels?.dashboardSubtitle || 'Welcome to IndiGo 6ELoyalty program'}
      </p>
      <p className="body-medium-regular d-md-none mb-12 mt-12">
        Loyalty Dashboard
      </p>
      <div className="mb-20">
        <p className="body-medium-regular">Benefits of loyalty 1</p>
        <p className="body-medium-regular">Benefits of loyalty 2</p>
        <p className="body-medium-regular">Benefits of loyalty 3</p>
      </div>

      <p className="body-medium-regular d-sm-none">
        {mfLabels?.loyaltyInformation?.dashboardTitle || 'Loyalty Dashboard'}
      </p>

      {[
        SCREEN_TYPE.COBRAND_GUEST_USER,
        SCREEN_TYPE.COBRAND_6E_USER,
        SCREEN_TYPE.COBRAND_LOYALTY_MEMBER,
      ].includes(sharedData.flow) ? (
        <Button onClick={enrollCobrand}>
          {mfLabels?.loyaltyInformation?.continueToCoBrandApplication
            || 'Continue to Co-Brand Application'}
        </Button>
        ) : (
          <Button onClick={onCloseHandler}>
            {mfLabels?.loyaltyInformation?.bookFlightLabel || 'Book Flight Now'}
          </Button>
        )}
    </PopupModalWithContent>
  );
}

WelcomePopup.propTypes = {
  mfLabels: PropTypes.object,
  onCloseHandler: PropTypes.func,
  sharedData: PropTypes.object,
  setActiveScreen: PropTypes.func,
  setSharedData: PropTypes.func,
};
export default WelcomePopup;
