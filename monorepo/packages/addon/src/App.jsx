import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';

import AddonContainer from './components/AddonContainer';
import './App.scss';

import {
  AppProvider,
  addonReducer,
  addonInitialState,
} from './context/AppContext';
import { CONSTANTS } from './constants/index';
// Old AEM local file: import configJson from '../public/addonAEM';
import { getAddonAemData } from './services/api.service';
import { LOCATION_HASHES } from './constants/analytic';

const Addon = (props) => {
  // Old AEM implementation:
  // const fallbackAemConfigJson = configJson?.data;
  // if (typeof (fallbackAemConfigJson?.mfData) === 'string') {
  //   fallbackAemConfigJson.mfData = JSON.parse(fallbackAemConfigJson?.mfData);
  // }
  // const configAemData =
  //   props && props?.data ? props?.data : fallbackAemConfigJson;
  // const containerConfigData = configAemData;
  const [state, dispatch] = React.useReducer(addonReducer, {
    ...addonInitialState,
    // Old AEM implementation: containerConfigData,
    page: props?.page,
  });

  const [isModifyFlow, setIsModifyFlow] = React.useState('');
  const [isAemDataAvailable, setIsAemDataAvailable] = useState(false);

  const getAemData = async () => {
    const containerConfigData = await getAddonAemData(dispatch);

    if (containerConfigData) {
      setIsAemDataAvailable(true);
    }
  };
  React.useEffect(() => {
    getAemData();
    let pageType = '';
    try {
      const parsedPageTypeData = document
        .querySelector("div[data-component='mf-addon-v2']")
        .getAttribute('data-page-type');

      pageType = [
        CONSTANTS.ADDON_MODIFY_PAGE_TYPE,
        CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN,
        CONSTANTS.ADDON_SEAT_SELECTION_MODIFICATION,
        CONSTANTS.ADDON_CHECKIN,
      ].includes(parsedPageTypeData)
        ? parsedPageTypeData
        : '';
    } catch (error) {
      /* empty */
    }
    const hasParam = window.location.hash?.substring(1);
    if (hasParam === '' || hasParam.includes(LOCATION_HASHES.ADDON)) {
      setIsModifyFlow(pageType);
    }

    // Hide Footer for Addon Checkin
    if (window.pageType === CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
      document?.querySelector('.headerv2 .headerv2__mob__nav').classList?.add('d-none');
    }
  }, []);
  return (
    isAemDataAvailable && (
      <AppProvider
        value={{
          state,
          dispatch,
        }}
      >
        <AddonContainer isModifyFlow={isModifyFlow} />
      </AppProvider>
    )
  );
};

Addon.propTypes = {
  page: PropTypes.string,
  // Old Code:
  // data: PropTypes.any,
};

let rootElement = null;

function addonAppInit(ele, data = null) {
  if (!data) {
    // Old AEM implementation:
    // data = configJson?.data;
  }
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    const page = ele.parentElement.getAttribute('data-page-type');
    rootElement.render(<Addon data={data} page={page} />);
  }
}

if (document.getElementById('__addon__microapp__dev-only')) {
  addonAppInit(document.getElementById('__addon__microapp__dev-only'));
}

// eslint-disable-next-line import/prefer-default-export
export { addonAppInit };
