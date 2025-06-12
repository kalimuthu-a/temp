import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { bookingReducer } from './reducer';
import { COOKIE_KEYS } from '../constants';

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

let authUser;
let nomineeDetails;
try {
  authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
  nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS, true, true) || [];
} catch (e) {
  authUser = Cookies.get(COOKIE_KEYS.USER);
  nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS) || [];
}

const bookingInitialState = {
  pageType: 'homepage',
  showLoyaltyBox: false,
  persona: 'Member',
  airportsData: [],
  activeCitiesModel: [],
  activeCurrencyModel: [],
  activeCountryModel: [],
  macStations: [],
  widgetsModel: {},
  main: {},
  offers: {},
  additional: {},
  specialFaresList: [],
  loading: true,
  showFullFormInSrp: false,
  fareCalendar: {
    response: new Map(),
    origin: '',
    destination: '',
  },
  isModificationFlow: false,
  isLoyaltyEnabled: !(window.disableLoyalty ?? true),
  authUser,
  nomineeDetails,
  popSearch: [],
  finalCityList: [],
};

const AppContextProvider = ({ additionalData, children }) => {
  const { pageType } = additionalData;
  const [state, dispatch] = React.useReducer(bookingReducer, {
    ...bookingInitialState,
    ...additionalData,
    isModificationFlow: pageType === Pages.FLIGHT_SELECT_MODIFICATION,
  });

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.any,
  additionalData: PropTypes.any,
};

export { AppContext, AppContextProvider };
