import React from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { CONSTANTS } from './constants';
import ViewItineraryApp from './components/AppEntry/ViewItineraryApp';
import Cookies from './utils/cookies';
import { store } from './store/store';
import './styles/main.scss';

// eslint-disable-next-line no-shadow
export const ProviderWrapper = ({ children, store }) => (
  <Provider store={store}>{children}</Provider>

);
const Itinerary = ({ additionalAemData }) => {
  const loginTypeObj = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.ROLE_DETAILS, true) || {};
  return (
    <ProviderWrapper store={store}>
      <ViewItineraryApp
        loginType={
        loginTypeObj
        && loginTypeObj.roleName
        && loginTypeObj.roleName.toUpperCase() // in const file we are keeping as uppercase
      }
        mfAdditionalData={additionalAemData}
      />
    </ProviderWrapper>
  );
};

ProviderWrapper.propTypes = {
  children: PropTypes.any,
  store: PropTypes.any,
};

let rootElement = null;

// eslint-disable-next-line no-use-before-define
itineraryAppInit(
  document.getElementById('__itinerary__microapp__dev-only'),
  {},
);

function itineraryAppInit(ele, data = null) {
  let updatedData = {};
  /* mock the aem json coming from container */
  if (
    data
    && data.configJson
    && data.configJson.data
    && data.configJson.data.mainReviewSummaryAdditionalList
  ) {
    updatedData = data.configJson.data;
  } else {
    updatedData = {}; // mock
  }
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<Itinerary additionalAemData={updatedData} />);
  }
}

Itinerary.propTypes = {
  additionalAemData: PropTypes.object,
};

export { itineraryAppInit };
