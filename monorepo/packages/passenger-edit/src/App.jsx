/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppProvider,
  passengerEditReducer,
  passengerEditInitailState,
  passengerEditActions,
} from './context/appContext';
import PassengerDetailsApp from './components/PassengerDetailsApp/PassengerDetailsApp';
import aemdataprops from './aemdataprops';
import getPassengersDocs from './functions/getPassengerDetails';
import './styles/main.scss';
import getAemData from './functions/getAemData';
import { ADD_PASSENGER_PAYLOAD, CUSTOM_EVENTS } from './constants/constants';
import LocalStorage from './utils/LocalStorage';
import { localStorageKeys } from './constants';
import nextButtonStateUtil from './utils/nextButtonStateUtil';

const getPassengersDetailEvent = (config) => new CustomEvent(ADD_PASSENGER_PAYLOAD, config);

const PassengerDetails = (props) => {
  const [state, dispatch] = React.useReducer(passengerEditReducer, {
    ...passengerEditInitailState,
    ...aemdataprops,
  });

  const [isProtectionAdded, setIsProtectionAdded] = useState(false);
  const [zeroCancellationAdded, setZeroCancellationAdded] = useState(false);

  const [hashChange, setHashChange] = useState(0);

  const onHashChange = () => {
    const { hash } = window.location;
    if (!hash) {
      setHashChange((prev) => prev + 1);
    } else {
      const dataToPass = {
        from: 'passenger-details',
        mfToOpen: hash === '#addon' ? 'addon' : 'seat-selection',
      };
      const event = new CustomEvent(CUSTOM_EVENTS?.MAKE_ME_EXPAND_V2, {
        bubbles: true,
        detail: dataToPass,
      });
      // dispatching event to catch the event in passengerdetails component and toggle the addon
      // document.dispatchEvent(event);
    }
  };

  useEffect(() => {
    nextButtonStateUtil(false);
    getAemData(dispatch);
    document.dispatchEvent(
      getPassengersDetailEvent({
        bubbles: true,
        detail: { payload: state.postApiPayload, from: 'passenger-details' },
      }),
    );
    const getLocalStorage = LocalStorage.getAsJson(
      localStorageKeys.bw_cntxt_val,
    );

    dispatch({
      type: passengerEditActions.BOOKING_CONTEXT,
      payload: getLocalStorage,
    });
    LocalStorage.remove(localStorageKeys.ext_pax_keys);
    LocalStorage.remove(localStorageKeys.upd_flds);
    LocalStorage.remove(localStorageKeys.srct_ids);
  }, []);

  useEffect(() => {
    localStorage.removeItem(localStorageKeys.passengerPost);
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const paxPostSuccess = localStorage.getItem(localStorageKeys.passengerPost);
    if ((paxPostSuccess === 'true' && hashChange) || (!paxPostSuccess && !hashChange)) {
      dispatch({
        type: passengerEditActions.SET_LOADER,
        payload: true,
      });
      localStorage.removeItem(localStorageKeys.passengerPost);
      getPassengersDocs(dispatch);
    }
  }, [hashChange]);

  const addonsProps = {
    isProtectionAdded,
    zeroCancellationAdded,
    setIsProtectionAdded,
    setZeroCancellationAdded
  }

  return (
    <AppProvider
      value={{
        state,
        dispatch,
      }}
    >
      <PassengerDetailsApp {...{ ...props, ...addonsProps }} />
    </AppProvider>
  );
};

PassengerDetails.propTypes = {};

let rootElement = null;

function passengerEditAppInit(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    const page = ele.parentElement.getAttribute('data-page-type');
    rootElement.render(<PassengerDetails data={data} page={page} />);
  }
}

if (document.getElementById('__addon__microapp__dev-only')) {
  passengerEditAppInit(document.getElementById('__addon__microapp__dev-only'));
}
export { passengerEditAppInit };
