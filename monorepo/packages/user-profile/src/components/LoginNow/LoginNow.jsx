import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import {
  Pages,
  a11y,
} from 'skyplus-design-system-app/dist/des-system/globalConstants';
import UserIdentity from 'skyplus-design-system-app/src/functions/UserIdentity';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { PAGES } from '../../constants/index';

const LoginNow = ({ aemData, pageType }) => {
  const LoggedInUser = Cookies.get('auth_user', true, true) || false;
  const [mount, setMount] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(true);

  const onClickLogin = () => {
    UserIdentity.dispatchLoginEvent();
  };

  const mountComponent = () => {
    setMount(true);
  };

  const unMountComponent = () => {
    setMount(false);
  };

  useEffect(() => {
    const isGuest = UserIdentity.isAnonymous;

    UserIdentity.subscribeToLogin(unMountComponent);
    UserIdentity.subscribeToLogout(mountComponent);
    setMount(isGuest);
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === a11y.keyCode.enter) {
      onClickLogin();
    }
  };

  if (
    (!mount || (pageType === Pages.WEB_CHECK_IN || pageType === Pages.UNDO_WEB_CHECKIN
    || pageType === Pages.CHECK_IN_MASTER)) && pageType !== PAGES.TRACK_REFUND
  ) {
    return null;
  }

  if (pageType === PAGES.TRACK_REFUND && !LoggedInUser) {
    return (
      <div className="login-now retrieve-pnr-infoalert cornflower-blue">
        <Text
          variation="body-small-regular"
          containerClass="text-text-secondary text-capitalize"
        >
          {aemData?.loginSubHeading}
        </Text>
        <div className="d-flex flex-column link-container align-content-center">
          <HtmlBlock html={aemData?.loginHeading} className="h4" tagName="h4" />
          <div
            className="login-button-container d-flex"
            onClick={onClickLogin}
            role="button"
            tabIndex="0"
            onKeyDown={onKeyDown}
          >
            <Text
              variation="text-medium-regular"
              containerClass="text-text-secondary"
            >
              {aemData?.loginText}
            </Text>
            <div className="right d-flex justify-content-center align-items-center">
              <i className="sky-icons icon-arrow-top-right sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageType === PAGES.TRACK_REFUND && LoggedInUser) {
    return null;
  }

  if (showLoginCard) {
    return (
      <div className="login-now-wrapper">
        <HtmlBlock
          html={aemData?.accessYourTripsLabel?.html}
          className="h4"
          tagName="h4"
        />
        <div className="login-now retrieve-pnr-infoalert cornflower-blue">
          <Text
            variation="body-small-regular"
            containerClass="text-text-secondary text-uppercase d-flex justify-content-between align-items-centers"
          >
            {aemData?.signInInfoLabel}
            <button
              onClick={() => setShowLoginCard(false)}
              type="button"
              aria-label="button"
              className="bg-transparent border-0 p-0"
            >
              <span className="icon-close-simple icon-size-sm cursor-pointer" />
            </button>
          </Text>
          <div className="d-flex link-container align-content-center">
            <Text>
              {aemData?.passengerTripsAndTicketsInfo}
            </Text>
            <HtmlBlock
              html={aemData?.signInSavedDetailsBanner?.description?.html}
              className="h4"
              tagName="h4"
            />
            <div
              className="login-button-container d-flex"
              onClick={onClickLogin}
              role="button"
              tabIndex="0"
              onKeyDown={onKeyDown}
            >
              <Text
                variation="text-medium-regular"
                containerClass="text-text-secondary"
              >
                {aemData?.signInNowCta}
              </Text>
              <div className="right d-flex justify-content-center align-items-center">
                <i className="sky-icons icon-arrow-top-right sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

LoginNow.propTypes = {
  aemData: PropTypes.any,
  pageType: PropTypes.any,
};

export default LoginNow;
