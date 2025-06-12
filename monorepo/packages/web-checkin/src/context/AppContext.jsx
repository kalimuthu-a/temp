import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import get from 'lodash/get';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

import { webcheckinReducer } from './reducer';
import AEMModel from '../models/AEMModel';
import AnalyticContext from '../models/AnalyticContext';

/**
 * @type {React.Context<{state ?: {
 *    pageType: string,
 *    loading: boolean,
 *    bookingDetails: any,
 * }, dispatch ?: React.Dispatch<*>}>}
 */
const AppContext = React.createContext({});

const webcheckinInitialState = {
  pageType: 'homepage',
  loading: true,
  ssrs: new Map(),
  bookingDetails: null,
  appAlert: {
    message: '',
    show: false,
  },
  aemModel: new AEMModel(),
  countries: [],
  formData: [],
  formErrors: [],
  analyticContext: {
    page: { pageInfo: { pageName: '' } },
  },
  emergencyDetails: { country: '91' },
  emergencyDetailsFormError: [],
  copyForAll: false,
  toast: {
    show: false,
    description: '',
  },
  loaderImage: '',
  aemData: {},
  analyticsContext: {},
  minorConsentSelection: new Set(),
};

const AppContextProvider = ({ additionalData, children, pageName }) => {
  const [state, dispatch] = React.useReducer(webcheckinReducer, {
    ...webcheckinInitialState,
    ...additionalData,
    analyticContext: new AnalyticContext(pageName),
  });

  const aemLabel = (key, defaultValue = '') => {
    return get(state.aemData, key, defaultValue);
  };

  const formattedAEMLabel = (key, defaultValue, obj) => {
    const aemString = aemLabel(key, defaultValue);
    return formattedMessage(aemString, obj);
  };

  const value = useMemo(
    () => ({ state, dispatch, aemLabel, formattedAEMLabel }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.any,
  additionalData: PropTypes.any,
  pageName: PropTypes.string,
};

export { AppContext, AppContextProvider };
