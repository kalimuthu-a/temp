import { createRoot } from 'react-dom/client';

import FareSummary from './components/FareSummary';

import './index.scss';
import { FareSummaryContextProvider } from './store/fare-summary-context';

const App = () => {
  return (
    <FareSummaryContextProvider>
      <FareSummary />
    </FareSummaryContextProvider>
  );
};

App.propTypes = {};

let rootElement = null;

function AppInit(ele) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<App />);
  }
}

if (document.querySelector('#__fare-summary__microapp__dev-only')) {
  AppInit(document.getElementById('__fare-summary__microapp__dev-only'));
}

export { AppInit };
