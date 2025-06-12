/* eslint-disable import/prefer-default-export */
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import SavedPassengers from './pages/MyProfile/SavedPassengers';
import Ewallet from './pages/Ewallet/Ewallet';
import './index.scss';
import { SCREEN_TYPE } from './constants';
import Nominee from './pages/Nominee';
import MyProfile from './pages/MyProfile';
import MyBookings from './pages/MyBookings';
import { AEMContextProvider } from './context/AEMContextProvider';
import Help from './pages/Help/Help';
import { pageTypes } from './constants/common';

const SCREEN_MAP = {
  [SCREEN_TYPE.NOMINEE]: Nominee,
  [SCREEN_TYPE.MY_PROFILE]: MyProfile,
  [SCREEN_TYPE.MY_BOOKINGS]: MyBookings,
  [SCREEN_TYPE.HELP]: Help,
  [SCREEN_TYPE.MY_TRANSCATION]: Ewallet,
};

const UserProfile = ({ pageType }) => {
  const PageView = useMemo(() => {
    switch (pageType) {
      case pageTypes.myProfile:
        return SCREEN_MAP[SCREEN_TYPE.MY_PROFILE];
      case pageTypes.myBookings:
        return SCREEN_MAP[SCREEN_TYPE.MY_BOOKINGS];
      case pageTypes.helpPage:
        return SCREEN_MAP[SCREEN_TYPE.HELP];
      case pageTypes.transactions:
        return SCREEN_MAP[SCREEN_TYPE.MY_TRANSCATION];
      default:
        return SCREEN_MAP[SCREEN_TYPE.NOMINEE];
    }
  }, []);

  return (
    <AEMContextProvider>
      <div className="user-profile">
        <div className="user-profile-right">
          <PageView />
        </div>
      </div>
    </AEMContextProvider>
  );
};

UserProfile.propTypes = {
  pageType: PropTypes.string,
};

let rootElement = null;

function userProfileAppInit(ele) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<UserProfile pageType={window.pageType} />);
  }
}

if (document.querySelector('#__mf__user_profile__dev__only')) {
  userProfileAppInit(document.getElementById('__mf__user_profile__dev__only'));
}

export { userProfileAppInit };
