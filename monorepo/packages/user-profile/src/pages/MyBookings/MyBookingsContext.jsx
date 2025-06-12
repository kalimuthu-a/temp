import PropTypes from 'prop-types';
import React, { useMemo, createContext } from 'react';

import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { myBookingsReducer } from './MyBookingsReducer';
import { BROWSER_STORAGE_KEYS } from '../../constants';
import { MEMBER } from '../../constants/common';

const initialState = {
  loader: true,
  isLoggedIn: Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || false,
  userType: Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true)?.roleName || MEMBER,
  initGetBookingDone: false,
  myBookingsData: {
    currentJourney: [],
    completedJourney: [],
    cancelledJourney: [],
  },
  myHotelBookingsData: {},
  myBookingsAemData: {},
};

const MyBookingsContext = createContext(initialState);

export const MyBookingsContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(myBookingsReducer, {
    ...initialState,
  });

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <MyBookingsContext.Provider value={value}>
      {children}
    </MyBookingsContext.Provider>
  );
};

MyBookingsContextProvider.propTypes = {
  children: PropTypes.element,
};

export default MyBookingsContext;
