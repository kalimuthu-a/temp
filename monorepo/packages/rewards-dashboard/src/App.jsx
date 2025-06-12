/* eslint-disable import/prefer-default-export */
import React, { useMemo } from 'react';
import { createRoot } from 'react-dom/client';

import './index.scss';
import { SCREEN_TYPE } from './constants';

import Nominee from './pages/Nominee';
import { AEMContextProvider } from './context/AEMContextProvider';

const SCREEN_MAP = {
  [SCREEN_TYPE.NOMINEE]: Nominee,
};

const UserProfile = () => {
  const PageView = useMemo(() => {
    return SCREEN_MAP[SCREEN_TYPE.NOMINEE];
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

UserProfile.propTypes = {};

let rootElement = null;

function userProfileAppInit(ele) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<UserProfile />);
  }
}

if (document.querySelector('#__mf__user_profile__dev__only')) {
  userProfileAppInit(document.getElementById('__mf__user_profile__dev__only'));
}

export { userProfileAppInit };
