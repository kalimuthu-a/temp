import PropTypes from 'prop-types';
import React, { useMemo, createContext } from 'react';

import { nomieeActions, nomineeReducer } from './NomieeReducer';
import { getNominee } from '../../services/nominee.service';

const initialState = {
  showConfirmation: false,
  showFooter: false,
  toast: {
    show: false,
    description: '',
    variation: '',
  },
  loading: true,
  nominees: [],
  maxNominee: 1,
  disableAdd: false,
  initalActiveIndexes: [],
};

const NomieeContext = createContext(initialState);

export const NomieeContextProvider = ({ children, maxNomineeCount }) => {
  const [state, dispatch] = React.useReducer(nomineeReducer, {
    ...initialState,
    maxNominee: maxNomineeCount,
  });

  const dispatchToast = (payload) => {
    dispatch({
      type: nomieeActions.SET_TOAST,
      payload,
    });
  };

  const reloadData = async () => {
    dispatch({
      type: nomieeActions.SHOW_LOADER,
      payload: true,
    });
    await getNominee().then((response) => {
      dispatch({
        type: nomieeActions.RELOAD_DATA,
        payload: response,
      });
    });
  };

  const value = useMemo(
    () => ({ state, dispatch, dispatchToast, reloadData }),
    [state],
  );

  return (
    <NomieeContext.Provider value={value}>{children}</NomieeContext.Provider>
  );
};

NomieeContextProvider.propTypes = {
  children: PropTypes.element,
  maxNomineeCount: PropTypes.number,
};

export default NomieeContext;
