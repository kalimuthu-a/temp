import PropTypes from 'prop-types';
import React, { useMemo, createContext } from 'react';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { corpConnectReducer } from './CorpConnectReducer';
import { BROWSER_STORAGE_KEYS } from '../../../constants';

const initialState = {
  loader: false,
  userDetails: Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || false,
  initGetBookingDone: false,
  corpConnectData: {},
  corcpConnectAemData: {},
  countryList: [],
};

const CorpConnectContext = createContext(initialState);

export const CorpConnectProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(corpConnectReducer, {
    ...initialState,
  });

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <CorpConnectContext.Provider value={value}>
      {children}
    </CorpConnectContext.Provider>
  );
};

CorpConnectProvider.propTypes = {
  children: PropTypes.element,
};

export default CorpConnectContext;
