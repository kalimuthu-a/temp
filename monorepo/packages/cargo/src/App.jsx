import { createRoot } from 'react-dom/client';

import './index.scss';
import { CargoContextProvider } from './store/cargo-context';

const App = () => {
  return (
    <CargoContextProvider>
      <h1>Cargo</h1>
    </CargoContextProvider>
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

if (document.querySelector('#__cargo__microapp__dev-only')) {
  AppInit(document.getElementById('__cargo__microapp__dev-only'));
}

export { AppInit };
