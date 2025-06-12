import React, { useEffect, useState } from 'react';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { ProfileProvider } from './ProfileContext';
import MyProfileComp from './MyProfile';
import { MOBILE_PAGE_TITLES, myProfileComponents } from './constant';
import { BROWSER_STORAGE_KEYS } from '../../constants/index';
import { COOKIE_KEYS } from '../../constants/cookieKeys';
import disableNonPersonaMenu from '../../utils/disableNonPersonaMenu';
// import SavedPassengersPage from './SavedPassengers';
import SettingsPage from './Settings';
import MyGSTDetailsPage from './MyGSTDetails';
import GuestScreen from './GuestScreen';
import CorpConnectPage from './CorpConnect';
import IndigoCash from './IndigoCash/IndigoCash';
import { HEADER_CONTENT_UPDATE_EVENT } from '../../constants/common';

const MyProfilePage = () => {
  const [currentComp, setCurrentComp] = useState(window.location.hash || myProfileComponents.MY_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setMobileTitle = (hash) => {
    const headerTitleUpdateEvent = (data) => new CustomEvent(HEADER_CONTENT_UPDATE_EVENT, data);
    document.dispatchEvent(
      headerTitleUpdateEvent({
        bubbles: true,
        detail: {
          title: MOBILE_PAGE_TITLES[hash],
        },
      }),
    );
  };

  const onHashChange = () => {
    const { hash } = window.location;
    setCurrentComp(hash);
    setMobileTitle(hash);
  };

  useEffect(() => {
    /** HANDLING BROWSER BACK BUTTON EVENT */
    window.addEventListener('hashchange', onHashChange);
    if (window.location.hash) {
      setMobileTitle(window.location.hash || MOBILE_PAGE_TITLES['#my-profile']);
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const loginStatus = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || false;
    const personasType = Cookies.get(COOKIE_KEYS.ROLE_DETAILS, true);
    disableNonPersonaMenu(personasType);
    setIsLoggedIn(loginStatus);
  }, []);

  if (!isLoggedIn) return (<GuestScreen />); // TODO- Guest screen component

  switch (currentComp) {
    case myProfileComponents.MY_PROFILE:
      return (
        <ProfileProvider>
          <MyProfileComp />
        </ProfileProvider>
      );
    // Hiding saved passenger for the time being
    // case myProfileComponents.SAVED_PASSENGER:
    //   return (<SavedPassengersPage />);
    case myProfileComponents.MY_GST_DETAILS:
      return (<MyGSTDetailsPage />); // TODO - GST details component will come here
    case myProfileComponents.SETTINGS:
      return (<SettingsPage />); // TODO - Settings component will come here
    case myProfileComponents.INDIGO_CASH:
      return (<IndigoCash />);
    case myProfileComponents.CORP_CONNECT:
      return (<CorpConnectPage />);
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    default:
      return (
        <ProfileProvider>
          <MyProfileComp />
        </ProfileProvider>
      );
  }
};

export default MyProfilePage;
