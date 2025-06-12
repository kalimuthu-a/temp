import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { visaServiceReducer } from './reducer';

/**
 * @type {React.Context<{state ?: {
 *    activeCountryModel: Array<*>,
 *    activeCurrencyModel: Array<*>,
 *    airportsData: Array<*>,
 *    selectedSpecialFare: any,
 *    promocode: any,
 *    additional: any,
 *    main: any,
 *    offers: Array<any>,
 *    recentSearches: Array<*>,
 *    popSearch:any,
 * }, dispatch ?: React.Dispatch<*>}>}
 */
const AppContext = React.createContext({});

const visaServiceInitialState = {
  main: {},
  offers: {},
  additional: {},
};

const AppContextProvider = ({ additionalData, children }) => {
  // const { pageType } = additionalData;
  const [state, dispatch] = React.useReducer(visaServiceReducer, {
    ...visaServiceInitialState,
    ...additionalData,
  });

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.any,
  additionalData: PropTypes.any,
};

export { AppContext, AppContextProvider };
