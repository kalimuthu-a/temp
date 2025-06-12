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
import { PAGES } from '../constants';
import { interactions, PAGE, VALUES, VISA_CLICK } from '../../constants/analytic';
import analyticEvents from '../../utils/analyticEvents';

const LoginNow = ({ aemData, pageType }) => {
  const LoggedInUser = Cookies.get('auth_user', true, true) || false;
  const [mount, setMount] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(true);

  const onClickLogin = () => {
    // open login dropdown instead of opening customer login popup
    const webLoginBtn = document.querySelector('#userNavBtn');
    if (webLoginBtn) webLoginBtn.click();
    const mwebLoginBtn = document.querySelector('#userNavMobBtn');
    if (mwebLoginBtn) mwebLoginBtn.click();
    // UserIdentity.dispatchLoginEvent();
    // tsd on click login button

    const urlParams = new URL(window.location.href)?.searchParams || '';
    const linkNav = urlParams?.get('linkNav') || '';

    analyticEvents({
      event: VISA_CLICK,
      interactionType: interactions.Link_Button_Click,
      data: {
        _event: 'checkInStart',
        LOB: linkNav?.indexOf('Visa Status') !== -1 ? PAGE.VISA : PAGE.LOB,
        pageInfo: {
          pageName: VALUES.VISA_STATUS_LANDING_PAGE,
          journeyFlow: PAGE.VISAFLOW,
          siteSection: PAGE.VISAFLOW,
        },
        eventInfo: {
          name: PAGE.LOGINNOW,
          position: '',
          component: VALUES.VISA_SERVICE,
        },
      },
    });
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

  if (
    showLoginCard &&
    (pageType === PAGES.TRACK_REFUND ||
      pageType === PAGES.MY_BOOKINGS ||
      pageType === PAGES.HELP_PAGE) &&
    !LoggedInUser
  ) {
    return (
      <div className="login-now retrieve-pnr-infoalert cornflower-blue">
        <Text
          variation="body-small-regular"
          containerClass="text-text-secondary text-capitalize d-flex justify-content-between align-items-center"
        >
          {aemData?.loginSubHeading}
          <button
            onClick={() => setShowLoginCard(false)}
            type="button"
            aria-label="button"
            className="bg-transparent border-0 p-0"
          >
            <span className="icon-close-simple icon-size-sm cursor-pointer" />
          </button>
        </Text>
        <div
          className={`d-flex ${pageType === PAGES.HELP_PAGE ? 'flex-class' : 'flex-column'
          } link-container align-content-center`}
        >
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
      <div className="login-now retrieve-pnr-infoalert cornflower-blue">
        <Text
          variation="body-small-regular"
          containerClass="text-text-secondary text-uppercase d-flex justify-content-between align-items-center"
        >
          {aemData?.signInSavedDetailsBanner?.heading || aemData?.loginSubHeading}
          <button
            onClick={() => setShowLoginCard(false)}
            type="button"
            aria-label="button"
            className="bg-transparent border-0 p-0"
          >
            <span className="icon-close-simple icon-size-sm cursor-pointer" />
          </button>
        </Text>
        <div className="d-flex flex-column link-container align-content-center">
          <HtmlBlock
            html={aemData?.signInSavedDetailsBanner?.description?.html || aemData?.loginHeading}
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
              {aemData?.signInSavedDetailsBanner?.ctaLabel || aemData?.loginText}
            </Text>
            <div className="right d-flex justify-content-center align-items-center">
              <i className="sky-icons icon-arrow-top-right sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

LoginNow.propTypes = {
  aemData: PropTypes.any,
  pageType: PropTypes.any,
};

export default LoginNow;
