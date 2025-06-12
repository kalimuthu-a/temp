import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <h1>Post Booking</h1>
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

if (document.querySelector('#__post-booking__microapp__dev-only')) {
  AppInit(document.getElementById('__post-booking__microapp__dev-only'));
}

// eslint-disable-next-line import/prefer-default-export
export { AppInit };
