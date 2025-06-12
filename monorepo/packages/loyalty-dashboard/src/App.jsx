import { createRoot } from 'react-dom/client';
import './index.scss';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { useEffect, useState } from 'react';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import WarningPopup from 'skyplus-design-system-app/dist/des-system/WarningPopup';
import PropTypes from 'prop-types';
import LoyaltyDashboard from './components/LoyaltyDashboard/LoyaltyDashboard';
import TransactionHistoryContainer from './components/TransactionHistory/TransactionHistoryContainer';
import { UserSummaryContextProvider } from './store/user-summary-context';
import { PAGE_VIEW_TYPE } from './utils';
import { BROWSER_STORAGE_KEYS } from './constants';

const App = ({ page }) => {
  const [toastProps, setToastProps] = useState(null);
  const [isLoyaltyMember, setIsLoyaltyMember] = useState(null);
  const [warningPopupProps, setWarningPopupProps] = useState(null);
  const isAuthoringEnabled = window.location.href.includes('editor.html') || window.location.href.includes('author');

  useEffect(() => {
    const authUserCookie = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    const isLoggedLoyaltyMember = authUserCookie?.loyaltyMemberInfo?.FFN
                                  || authUserCookie?.loyaltyMemberInfo?.ffn
                                  || false;

    if (!isLoggedLoyaltyMember) {
      const localStorageObj = JSON.parse(localStorage.getItem('generic_data_container_app'));
      const popupProps = localStorageObj?.info_errorMessageItemListByPath?.items?.['loyalty:nonloggedinuser'];
      setWarningPopupProps({
        heading: popupProps?.heading || 'Info',
        subHeading: popupProps?.message || 'Please login as a registered loyalty user to continue.',
        ctaLabel: popupProps?.type || 'Ok',
        isCloseVisible: false,
        handleBtnClick: () => {
          window.location.href = window?._msdv2?.homePath || '/';
        },
      });
      setIsLoyaltyMember(false);
      // Uncomment the below line for local testing
      // setIsLoyaltyMember(true);
    } else {
      setIsLoyaltyMember(true);
    }
  }, []);

  return (
    <UserSummaryContextProvider>
      { isLoyaltyMember ? (
        <>
          {toastProps && (
          <Toast
            position={toastProps.position || 'top-bottom'}
            renderToastContent={toastProps.renderToastContent}
            onClose={toastProps.onClose}
            variation={toastProps.variation || 'notifi-variation--Information'}
            containerClass={toastProps.containerClass}
            description={toastProps.description || 'hello'}
            autoDismissTimeer={toastProps.autoDismissTimeer || ''}
          />
          )}
          {page === PAGE_VIEW_TYPE.TRANSACTION_HISTORY ? (
            <TransactionHistoryContainer />
          ) : (
            <LoyaltyDashboard page={page} setToastProps={setToastProps} />
          )}
        </>
      ) : (!isAuthoringEnabled && (<WarningPopup {...warningPopupProps} />))}
    </UserSummaryContextProvider>
  );
};

App.propTypes = { page: PropTypes.string };

let rootElement = null;

function LoyaltyDashboardAppInit(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<App page={data?.pageType} />);
  }
}

if (document.querySelector('#__loyalty-dashboard__microapp__dev-only')) {
  LoyaltyDashboardAppInit(
    document.getElementById('__loyalty-dashboard__microapp__dev-only'),
  );
}

// eslint-disable-next-line import/prefer-default-export
export { LoyaltyDashboardAppInit };
