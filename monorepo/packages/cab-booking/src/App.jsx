import { createRoot } from 'react-dom/client';
import './index.scss';
import { CabBookingContextProvider } from './store/cab-booking-context';

const App = ({ apiData }) => {
  return (
    <CabBookingContextProvider>
      <h1>Hello, Cab Booking</h1>
    </CabBookingContextProvider>
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
    rootElement.render(<App />);
  }
}

if (document.querySelector('#__cab_booking__microapp__dev-only')) {
  AppInit(document.querySelector('#__cab_booking__microapp__dev-only'));
}

export { AppInit };
