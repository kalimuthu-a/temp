import { createRoot } from 'react-dom/client';
import { VisaServiceContextProvider } from './store/visa-service-context';
import ViewVisaServiceApp from './components/AppEntry/ViewVisaServiceApp';
import './styles/main.scss';
import { AppContextProvider } from './context/AppContext';

const App = () => {
  return (
    <VisaServiceContextProvider>
      <ViewVisaServiceApp />
    </VisaServiceContextProvider>
  );
};

let rootElement = null;

// eslint-disable-next-line import/prefer-default-export
export function AppInit(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }

    rootElement.render(
      <AppContextProvider additionalData={data}>
        <App page={data?.pageType} time={data.time} />
      </AppContextProvider>,
    );
  }
}

if (document.querySelector('#__visa_service__microapp__dev-only')) {
  AppInit(document.querySelector('#__visa_service__microapp__dev-only'));
}
