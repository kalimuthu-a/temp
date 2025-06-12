import PropTypes from 'prop-types';
import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import React, { useEffect, useMemo } from 'react';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { srpReducer } from './reducer';
import AEMMain from '../models/AEMMain';
import AEMAdditional from '../models/AEMAdditional';
import GTMPageLoadEvent from '../utils/gtmanalytics/pageload';
import SearchPayloadFactory from '../models/search/SearchPayloadFactory';
import { defaultFilterState } from './reducerUtils';
import { COOKIE_KEYS, localStorageKeys, LOYALTY_FLOWS } from '../constants';
import LocalStorage from '../utils/LocalStorage';
import { isLoyalty as isLoyaltyFlow, isBurn as isBurnFlow, getLoyaltyAnalyticsData } from '../utils';

/**
 * @type {React.Context<{state ?: {
 *  trips: Array<any>,
 *  selectedTripIndex: number,
 *  searchContext: SearchPayload
 * }, dispatch ?: React.Dispatch<*>}>}
 */
const AppContext = React.createContext({});

const isLoyalty = isLoyaltyFlow();
let isEarn;
let isBurn;
let burnMode;
let loyaltyAnalyticsData = {};
if (isLoyalty) {
  const { payWith = LOYALTY_FLOWS.cash } = LocalStorage.getAsJson(
    localStorageKeys.bw_cntxt_val,
    {},
  );

  isBurn = isBurnFlow(payWith);
  burnMode = isBurn ? payWith : '';
  isEarn = !isBurn;

  // Initial loyalty analytics data for page load (user data is added from design system common object)
  loyaltyAnalyticsData = getLoyaltyAnalyticsData(payWith);
}

let authUser;
let nomineeDetails;
try {
  authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
  nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS, true, true);
} catch (e) {
  authUser = Cookies.get(COOKIE_KEYS.USER);
  nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS);
}

export const initialState = {
  showFooter: false,
  selectedTripIndex: 0,
  trips: [],
  selectedFares: [],
  recommended: null,
  filters: { ...defaultFilterState },
  appLoading: true,
  sort: {
    label: 'Sort',
    value: '',
  },
  searchContext: {},
  segments: [],
  segmentLoading: false,
  analyticsContext: {},
  googleAnalyticsContext: {},
  noDataAvailable: true,
  toast: {
    show: false,
    description: '',
  },
  pageType: Pages.SRP,
  isChangeFlightFlow: false,
  calendarResponses: new Map(),
  isProjectNextEnabled: false,
  combinabilityMap: new Map(),
  firstTimeLoad: {},
  isLoyalty,
  isEarn,
  isBurn,
  burnMode,
  authUser,
  userSignedInSrp: false,
  nomineeDetails,
  enrollmentPopUp: {
    show: false,
    data: null,
  },
  loyaltyAnalyticsData,
};

const AppContextProvider = ({ data, children, pageType }) => {
  const isChangeFlightFlow = pageType === Pages.FLIGHT_SELECT_MODIFICATION;

  const searchContext = SearchPayloadFactory.createpayload(window.pageType);

  const [state, dispatch] = React.useReducer(srpReducer, {
    ...initialState,
    ...data,
    searchContext,
    segments: searchContext.getSegment(),
    noDataAvailable: searchContext.isNoDataAvailable(),
    main: new AEMMain({}),
    additional: new AEMAdditional({}),
    pageType,
    isChangeFlightFlow,
  });

  useEffect(() => {
    GTMPageLoadEvent(searchContext);
  }, []);

  const value = useMemo(() => {
    return { state, dispatch };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.any,
  data: PropTypes.any,
  pageType: PropTypes.string,
};

export { AppContext, AppContextProvider };
