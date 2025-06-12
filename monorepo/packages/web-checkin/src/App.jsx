import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import get from 'lodash/get';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';

import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';

import { AppContextProvider } from './context/AppContext';

import './styles/main.scss';
import './App.css';
import useAppContext from './hooks/useAppContext';
import { getAemData } from './services';
import { webcheckinActions } from './context/reducer';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import BoardingPass from './pages/BoardingPass';
import DangerousGoods from './pages/DangerousGoods';
import WebCheckIn from './pages/WebCheckIn';
import Main from './pages/Main';
import UndoWebCheckin from './pages/UndoCheckin';
import Modal from './components/common/Modal/Modal';

const {
  CHECK_IN_MASTER,
  CHECK_IN_DANGEROUS_GOOD,
  CHECK_IN_PASSPORT_VISA,
  CHECK_IN_BOARDING_PASS,
  WEB_CHECK_IN,
  UNDO_WEB_CHECKIN,
} = Pages;

const App = ({ page }) => {
  const className = `webcheckin-container ${page}`;

  const {
    dispatch,
    state: { loading, appAlert, showFooter, toast, loaderImage },
  } = useAppContext();

  const PageView = useMemo(() => {
    const pageMap = {
      [CHECK_IN_MASTER]: Main,
      [CHECK_IN_DANGEROUS_GOOD]: DangerousGoods,
      [CHECK_IN_PASSPORT_VISA]: WebCheckIn,
      [CHECK_IN_BOARDING_PASS]: BoardingPass,
      [WEB_CHECK_IN]: Home,
      [UNDO_WEB_CHECKIN]: UndoWebCheckin,
    };

    return get(pageMap, page, <div />);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([...getAemData(page)])
        .then((response) => {
          const [...aem] = response;

          dispatch({
            type: webcheckinActions.SET_AEM_DATA,
            payload: {
              aem,
            },
          });
        })
        .catch(() => {});
    };

    loadData();
  }, []);

  return (
    <div className={className}>
      <PageView loading={loading} loaderImage={loaderImage} />
      {showFooter && <Footer />}
      {appAlert.show && <Modal>{appAlert.message}</Modal>}

      {toast.show && (
        <Toast
          mainToastWrapperClass="wc-toast"
          variation={`notifi-variation--${toast.variation}`}
          description={toast.description}
          containerClass="wc-toast-container"
          onClose={() => {
            dispatch({
              type: webcheckinActions.SET_TOAST,
              payload: { show: false, description: '' },
            });
          }}
        />
      )}
    </div>
  );
};

App.propTypes = {
  page: PropTypes.string.isRequired,
};

let rootElement = null;

function WebCheckinApp(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(
      <AppContextProvider additionalData={data} pageName={data.pageType}>
        <App page={data.pageType} />
      </AppContextProvider>,
    );
  }
}

if (document.querySelector('#__mf-web-checkin')) {
  WebCheckinApp(document.getElementById('__mf-web-checkin'), {
    pageType: 'checkinundo',
  });
}

// eslint-disable-next-line import/prefer-default-export
export { WebCheckinApp };
