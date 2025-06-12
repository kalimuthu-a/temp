import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { ScratchCardContextProvider } from './store/scratch-card-context';
import './styles/main.scss';
import CardStacker from './component/card-stacker/CardStacker';

const App = () => {
  return (
    <ScratchCardContextProvider>
      <CardStacker />
    </ScratchCardContextProvider>
  );
};

App.propTypes = {
};

let rootElement = null;

function AppInit(ele) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<App />);
  }
}

if (document.querySelector('#__scratch_card__microapp__dev-only')) {
  AppInit(document.querySelector('#__scratch_card__microapp__dev-only'));
}

// eslint-disable-next-line import/prefer-default-export
export { AppInit };
