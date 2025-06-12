import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import TripSummary from './components/TripSummary';
import './index.scss';
import { TripSummaryContextProvider } from './store/trip-summary-context';

const App = ({ apiData, apiSSRData }) => {
  useEffect(() => {
    localStorage.setItem('journeyReview', JSON.stringify(apiData));
    return () => {
      localStorage.removeItem('journeyReview');
    };
  }, [apiData]);
  return (
    <TripSummaryContextProvider>
      <TripSummary apiData={apiData} apiSSRData={apiSSRData} />
    </TripSummaryContextProvider>
  );
};

App.propTypes = {
};

let rootElement = null;

function AppInit(ele, props = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<App apiData={props?.apiData?.fareSummaryData || {}} apiSSRData={props?.apiData?.ssrData} />);
  }
}

if (document.querySelector('#__trip-summary__microapp__dev-only')) {
  AppInit(document.querySelector('#__trip-summary__microapp__dev-only'));
}

export { AppInit };
