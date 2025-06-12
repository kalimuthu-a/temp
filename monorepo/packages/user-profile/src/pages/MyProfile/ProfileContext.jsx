import React, { createContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { profileReducer } from './ProfileReducer'; // import your actions and reducer
import { BROWSER_STORAGE_KEYS } from '../../constants';

const initialState = {
  profileData: {},
  initialName: {
    first: '',
    last: '',
    title: '',
  },
  countryList: [],
  stateList: [],
  originalProfileData: {},
  userType: Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true)?.roleName,
  isOpened: false,
  myProfileAemData: {},
  error: {},
  showStateAndNationality: true,
  showPassportDetails: true,
  showGSTDetails: true,
  isButtonDisabled: true,
  toast: {
    show: false,
    description: '',
    variation: null,
  },
  apiError: false,
};

export const ProfileContext = createContext(initialState);

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.element,
};

export default ProfileContext;
