import { createRoot } from 'react-dom/client';
import './index.scss';
import { PlanBContextProvider } from './store/plan-b-context';

const App = () => {
  return (
    <PlanBContextProvider>
      <h1>Plan B V2</h1>
    </PlanBContextProvider>
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

if (document.querySelector('#__plan-b__microapp__dev-only')) {
  AppInit(document.getElementById('__plan-b__microapp__dev-only'));
}

export { AppInit };
