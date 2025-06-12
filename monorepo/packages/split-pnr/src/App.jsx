import { createRoot } from 'react-dom/client';
import './index.scss';

import { AppContextProvider } from './context/AppContext';
import SplitPnrHome from './components/AppEntry/SplitPnrHome';

const App = () => {
  return (
    <SplitPnrHome />
  );
};

App.propTypes = {};

let rootElement = null;

function AppInit(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(
      <AppContextProvider {...data}>
        <App />
      </AppContextProvider>,
    );
  }
}

if (document.querySelector('#__split-pnr__microapp__dev-only')) {
  AppInit(document.getElementById('__split-pnr__microapp__dev-only'));
}

// eslint-disable-next-line import/prefer-default-export
export { AppInit };
