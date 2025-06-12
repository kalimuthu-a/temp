import React from 'react';
import PropTypes from 'prop-types';
import { createRoot } from 'react-dom/client';
import CONSTANTS from './constants';
import { CareersContextProvider } from './store/careers-context';

import './App.scss';

const App = ({ data }) => {
  return (
    <div>
      <h1>{data.app_name}</h1>
    </div>
  );
};

App.propTypes = {
  data: PropTypes.object,
};

let rootElement = null;

function CareersMainApp(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }

    rootElement.render(
      <CareersContextProvider>
        <App data={data} />
      </CareersContextProvider>,
    );
  }
}

if (document.querySelector('#__mf-careers')) {
  // window.BookingMainApp = BookingMainApp;
  CareersMainApp(document.getElementById('__mf-careers'), {
    app_name: CONSTANTS.APP_NAME,
  });
}

// eslint-disable-next-line import/prefer-default-export
export { CareersMainApp };
