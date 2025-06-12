import React, { useEffect, useState, Suspense } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
// import { useCustomEventListener } from 'skyplus-design-system-app/src/functions/hooks/customEventHooks';
import { store } from './store/store';
import COOKIE_KEYS from './constants/cookieKeys';
import Constants, { DD_RUM_EVENTS, DD_RUM_LOAD_CLICK_PAYLOAD, SCREEN_TYPE } from './constants';
import './index.scss';
import Cookies from './functions/cookies';
import Enrollment from './components/Enrollment';
import { loginAemLabels } from './functions/services';
import FocusTrap from './FocusTrap';
import './components/CountryPicker.scss';
import LandingForm from './components/LandingForm';
import WelcomePopup from './components/WelcomePopup/WelcomePopup';
import OtpVerifyScreen from './components/OtpVerifyScreen/OtpVerifyScreen';
import MemberBenefitsPage from './components/MemberBenefitsPage/MemberBenefitsPage';
import IframeComponent from './components/IframeComponent/IframeComponent';
import { formatDate } from './functions/utils';
import BankForm from './components/BankForm/BankForm';
import TierDetail from './components/TierDetail/TierDetail';
import defaultState from './utils/defaultState';
import completeLogin from './functions/completeLogin';
import pushDDRumAction from './utils/ddrumEvent';
// const LoginForm = lazy(() => import('./components/LoginForm'));

export const ProviderWrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
  // Create a custom event
const loginSSOMFLoadedEvent = new CustomEvent('login-sso-mf-loaded', { detail: { message: 'Login SSO MF loaded' } });

const Loginsso = () => {
  const loggedInUserDetails = Cookies.get(COOKIE_KEYS.USER, true, true);
  const isLoyaltyMember = loggedInUserDetails?.loyaltyMemberInfo?.FFN
    || loggedInUserDetails?.loyaltyMemberInfo?.ffn
    || false;
  const [personaState, setPersonaState] = useState();
  const [activeScreen, setActiveScreen] = useState();
  const [toastProps, setToastProps] = useState(null);
  const [sharedData, setSharedData] = useState(defaultState);
  const [loginAEMData, setLoginAEMData] = useState({});
  const mfLabels = loginAEMData?.data?.loginmainByPath?.item || {};

  const onCloseHandler = () => {
    // setToastProps(null);
    setPersonaState('');
    setSharedData(defaultState);
    // setActiveScreen(false);
  };
  const prefillUserDetails = (
    prefillDataFromevent,
    isLoyaltyCheckEditable = true,
  ) => {
    if (prefillDataFromevent) {
      setSharedData((prev) => ({
        ...prev,
        firstName: prefillDataFromevent.firstName,
        lastName: prefillDataFromevent.lastName,
        date:
          prefillDataFromevent.dob
            ? formatDate(prefillDataFromevent.dob, '/')
            : prefillDataFromevent.date && formatDate(prefillDataFromevent.date, '/'),
        // "1994-09-14T00:00:00" to 14/09/1994
        email: prefillDataFromevent.email,
        phone: prefillDataFromevent.mobileNumber || prefillDataFromevent.phone || '',
        // eslint-disable-next-line no-nested-ternary, no-restricted-globals
        gender: isNaN(prefillDataFromevent.gender)
          ? prefillDataFromevent.gender === 'Male' ? 'Male' : 'Female'
          : prefillDataFromevent.gender === 1 ? 'Male' : 'Female',
        loyaltyMemberInfo: loggedInUserDetails?.loyaltyMemberInfo || null,
        isLoyaltyCheckEditable,
      }));
    } else if (loggedInUserDetails) {
      setSharedData((prev) => ({
        ...prev,
        firstName: loggedInUserDetails?.name?.first,
        lastName: loggedInUserDetails?.name?.last,
        date: formatDate(loggedInUserDetails?.details?.dateOfBirth, '/'), // "1994-09-14T00:00:00" to 14/09/1994
        email: loggedInUserDetails?.email,
        phone: loggedInUserDetails?.mobileNumber,
        gender: loggedInUserDetails?.gender === 1 ? 'Male' : 'Female',
        loyaltyMemberInfo: loggedInUserDetails?.loyaltyMemberInfo || null,
        isLoyaltyCheckEditable,
      }));
    }
  };

  const showLoginScreen = () => {
    const loginOpenEvent = DD_RUM_EVENTS.LOGIN_BUTTON_CLICKED;
    const loginButtonClick = DD_RUM_LOAD_CLICK_PAYLOAD;
    loginButtonClick.action = 'Login Button Click';
    loginButtonClick.datadogSessionId = window.DD_RUM?.getInternalContext()?.session_id;
    loginButtonClick.timestamp = new Date().toISOString();
    loginButtonClick.metadata = {
      page: 'Login',
      step: 'Click',
      component: 'Loginsso',
      application: 'login-sso',
      durationMs: 0,
      flowType: 'Login',
    }
    pushDDRumAction(loginOpenEvent, loginButtonClick)

    setPersonaState(Constants.MEMBER);
    setActiveScreen(SCREEN_TYPE.LANDING_PAGE);
  };

  const showWelcomeScreen = () => {
    setPersonaState(Constants.MEMBER);
    setActiveScreen(SCREEN_TYPE.SIGNUP_6E_USER);
  };

  const showCobrandScreen = () => {
    setPersonaState(Constants.MEMBER);
    setActiveScreen(SCREEN_TYPE.COBRAND_PARTNER_BANK);
  };

  useEffect(() => {
    // open login popup automatically
    if (window.persona) {
      setPersonaState(window.persona);
    }
    const { hash, pathname } = window.location;
    const keyword = mfLabels?.hashParam || 'loginsso';
    if (hash.includes(keyword) || pathname.includes(keyword)) {
      showLoginScreen();
    }
  }, [mfLabels]);

  const onCustomEventListener = (detail) => {
    const {
      loginType,
      // persona = Constants.MEMBER,
      prefillData,
      callback = () => {},
    } = detail;
    if (loginType && loginType === 'loginSSOPopup') {
      showLoginScreen();
    }

    if (loginType && loginType === 'EnrollSSOloyalty') {
      prefillUserDetails(prefillData, false);
      showWelcomeScreen();
    }

    if (loginType && loginType === 'applyCard') {
      if (isLoyaltyMember) {
        prefillUserDetails(undefined, false);
        showCobrandScreen();
      } else if (loggedInUserDetails && !isLoyaltyMember) {
        prefillUserDetails(undefined, false);
        showWelcomeScreen();
        setSharedData((prev) => ({ ...prev, redirectToBankInEnd: true }));
      } else {
        showLoginScreen();
        setSharedData((prev) => ({
          ...prev,
          redirectToBankInEnd: true,
          isLoyaltyCheckEditable: false,
        }));
      }
    }

    if (loginType && loginType === 'refreshlogin') {
      completeLogin({
        refreshtokenParam: null,
        ciamPolicyNameParam: null,
        usernameParam: null, // auth_user
        sharedDataParam: sharedData || {},
        callback,
      });
    }
  };
  useEffect(() => {
    const fetchAemLabel = async () => {
      const result = await loginAemLabels(personaState);
      setLoginAEMData(result);
    };

    fetchAemLabel();

    window.addEventListener(Constants.TOGGLE_LOGIN_POPUP, (e) => onCustomEventListener(e.detail));
    // Dispatch the event
    document.dispatchEvent(loginSSOMFLoadedEvent);
  }, []);

  const commonProps = {
    persona: personaState,
    setPersona: setPersonaState,
    activeScreen,
    setActiveScreen,
    sharedData,
    setSharedData,
    mfLabels,
    setToastProps,
    onCloseHandler,
  };

  const renderContent = () => {
    switch (activeScreen) {
      case SCREEN_TYPE.LANDING_PAGE:
        return <LandingForm {...commonProps} />;
      case SCREEN_TYPE.IFRAME:
        return <IframeComponent {...commonProps} />;
      // case SCREEN_TYPE.LOGIN_CREDENTIALS:
      //   return <LoginWithCredentials {...commonProps} />;
      case SCREEN_TYPE.OTP_VERIFY_PAGE:
        return <OtpVerifyScreen {...commonProps} />;
      case SCREEN_TYPE.SIGNUP_NEW_USER:
      case SCREEN_TYPE.SIGNUP_ONBOARD_BANK:
      case SCREEN_TYPE.SIGNUP_6E_REWARD_MIGRATION:
      case SCREEN_TYPE.SIGNUP_6E_USER_MIGRATION:
      case SCREEN_TYPE.SIGNUP_6E_USER:
      case SCREEN_TYPE.COBRAND_LOYALTY_MEMBER:
      case SCREEN_TYPE.COBRAND_6E_USER:
      case SCREEN_TYPE.COBRAND_GUEST_USER:
        return <Enrollment {...commonProps} />;
      case SCREEN_TYPE.MEMBERS_BENEFITS_PAGE:
        return <MemberBenefitsPage {...commonProps} />;
      case SCREEN_TYPE.LOYALTY_DASHBOARD_WELCOME:
        return <WelcomePopup {...commonProps} />;
      case SCREEN_TYPE.TIER_DETAIL:
        return <TierDetail {...commonProps} />;
      case SCREEN_TYPE.COBRAND_PARTNER_BANK:
        return <BankForm {...commonProps} />;
      default:
        return <LandingForm {...commonProps} />;
    }
  };

  const safari = navigator.userAgent.indexOf('Safari') !== -1
      && navigator.userAgent.indexOf('Chrome') === -1;

  return (
    <ProviderWrapper>
      <div
        id="login-sso-mf-placeholder-mutation"
        className={`skyplus-indigo-global-wrapper-v1 login-sso login-sso-mf-placeholder-mutation ${
          safari && 'safari'
        }`}
      >
        {toastProps && (
          <Toast
            position={toastProps.position || 'top-bottom'}
            renderToastContent={toastProps.renderToastContent}
            onClose={toastProps.onClose}
            variation={toastProps.variation || 'notifi-variation--Information'}
            containerClass={toastProps.containerClass}
            description={toastProps.description || 'hello'}
            infoIconClass={toastProps.infoIconClass || 'icon-info'}
            autoDismissTimeer={
              toastProps.autoDismissTimeer || mfLabels?.autoDismissTimer || 2000
            }
          />
        )}
        {personaState
        && (!loggedInUserDetails
          || [
            SCREEN_TYPE.SIGNUP_6E_USER,
            SCREEN_TYPE.COBRAND_6E_USER,
            SCREEN_TYPE.LOYALTY_DASHBOARD_WELCOME,
            SCREEN_TYPE.TIER_DETAIL,
            SCREEN_TYPE.COBRAND_PARTNER_BANK,
          ].includes(activeScreen)) ? (
            <Suspense
              fallback={(
                <div className="mainLoader mainLoader-overlay">
                  <div className="mainLoader-cont">
                    <div id="circleG-dark">
                      <div id="circleG-dark_1" className="circleG-dark" />
                      <div id="circleG-dark_2" className="circleG-dark" />
                      <div id="circleG-dark_3" className="circleG-dark" />
                    </div>
                  </div>
                </div>
            )}
            >
              <FocusTrap>{renderContent()}</FocusTrap>
            </Suspense>
          ) : null}
      </div>
    </ProviderWrapper>
  );
};
ProviderWrapper.propTypes = {
  children: PropTypes.any.isRequired,
};
Loginsso.propTypes = {
  loginType: PropTypes.any,
  persona: PropTypes.string,
  configJson: PropTypes.object,
};

let rootElement = null;

function loginAppInit(ele, props) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<Loginsso {...props} />);
  }
}

if (document.getElementById('__login__microapp__dev__only')) {
  loginAppInit(document.getElementById('__login__microapp__dev__only'), {});
}

export { loginAppInit };
