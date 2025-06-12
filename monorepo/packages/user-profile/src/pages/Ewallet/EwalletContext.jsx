/* eslint-disable import/named */
import PropTypes from 'prop-types';
import React, { useMemo, createContext } from 'react';

import { ewalletActions, ewalletReducer } from './EwalletReducer';
import { getTransactions } from '../../services/ewallet.service';

const initialState = {
  loading: true,
  transactions: [],
  filter: 'all',
  toast: {
    show: false,
    description: '',
    variation: '',
  },
  disableFilterChange: false,
};

const EwalletContext = createContext(initialState);

export const EwalletContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(ewalletReducer, initialState);

  const dispatchToast = (payload) => {
    dispatch({
      type: ewalletActions.SET_TOAST,
      payload,
    });
  };

  const reloadData = async () => {
    dispatch({
      type: ewalletActions.SHOW_LOADER,
      payload: true,
    });
    await getTransactions().then((response) => {
      dispatch({
        type: ewalletActions.RELOAD_DATA,
        payload: response,
      });
    });
  };

  const setFilter = (filter) => {
    dispatch({
      type: ewalletActions.SET_FILTER,
      payload: filter,
    });
  };

  const value = useMemo(
    () => ({ state, dispatch, dispatchToast, reloadData, setFilter }),
    [state],
  );

  return (
    <EwalletContext.Provider value={value}>{children}</EwalletContext.Provider>
  );
};

EwalletContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EwalletContext;
