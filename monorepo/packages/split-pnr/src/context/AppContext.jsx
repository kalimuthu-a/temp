import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { decryptAESForLoginAPI } from 'skyplus-design-system-app/src/functions/loginEncryption';

import { reducer } from './reducer';

const AppContext = React.createContext({});
const hashParam = window.location.hash?.substring(1) || '';
let splitPnrsFromHash;
if (hashParam) {
  try {
    splitPnrsFromHash = JSON.parse(decryptAESForLoginAPI(hashParam) || null);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
}

export const initialState = {
  isLoading: true,
  main: null,
  api: null,
  selectedPassengersList: [],
  toast: {
    show: false,
    description: '',
  },
  popUp: {
    show: false,
    data: null,
  },
  splitPnrs: splitPnrsFromHash,
  splitPnrDetailResponse: null,
};

const AppContextProvider = ({ data, children }) => {
  const [state, dispatch] = React.useReducer(reducer, { ...initialState, ...data });

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  data: PropTypes.any,
  children: PropTypes.any,
};

export { AppContext, AppContextProvider };
