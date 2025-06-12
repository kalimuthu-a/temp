import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { useCustomEventListener } from 'skyplus-design-system-app/src/functions/hooks/customEventHooks';
import { decryptAESForLoginAPI } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { store } from './store/store';
import { COOKIE_KEYS } from './constants/cookieKeys';
import Constants, { SCREEN_TYPE } from './constants';
import './index.scss';
import Cookies from './functions/cookies';
import ForgotPasswordHome from './components/ForgotPassword';
import SignUpForm from './components/SignUpForm';
import { loginAemLabels } from './functions/services';
import FocusTrap from './FocusTrap';
import './components/CountryPicker.scss';
import { MEMBER } from './constants/index-env';

import { onSubmitFormOldLoginHandler } from './components/LoginForm/functions';

const LoginForm = lazy(() => import('./components/LoginForm'));

const {
  BASE_API_URL_OLD,
  SUB_BASE_API_URL_OLD,
  MEMBER_LOGIN_OLD,
  AGENT_LOGIN_OLD,
  CAPF_LOGIN_OLD,
  MEMBER_LOGOUT_OLD,
  AGENT_LOGOUT_OLD,
  SUB_DOMAIN,
} = Constants;

/*
  AEM Script Exposed variables
  defaultLoginOpen
  persona
*/

export const ProviderWrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

const Login = () => {
  const loggedInUserDetails = Cookies.get(COOKIE_KEYS.USER);
  const [formType, setFormType] = useState('');
  const [toastProps, setToastProps] = useState(null);
  const [sharedData, setSharedData] = useState({
    userId: '',
    otpText: '',
    countryCode: '91',
    countryInitials: '',
    password: '',
  });
  const [activeScreen, setActiveScreen] = useState(SCREEN_TYPE.LOGIN_USERID);
  const [loginAEMData, setLoginAEMData] = useState({});

  useEffect(() => {
    if (window.persona) {
      setFormType(window.persona);
    }
  }, []);
  useEffect(() => {
    const fetchAemLabel = async () => {
      const result = await loginAemLabels(formType);
      setLoginAEMData(result);
    };

    fetchAemLabel();
  }, [formType]);

  const onCloseHandler = () => {
    if ([SCREEN_TYPE.LOGIN_USERID, SCREEN_TYPE.LOGIN_PASSWORD].includes(activeScreen)) {
      setFormType('');
      setActiveScreen(false);
    } else {
      setActiveScreen(isMember ? SCREEN_TYPE.LOGIN_USERID : SCREEN_TYPE.LOGIN_PASSWORD);
    }
    setToastProps(null);
  };

  const onCustomEventListener = (detail) => {
    const { loginType, persona = Constants.MEMBER } = detail;
    if (loginType && loginType === 'loginPopup') {
      setFormType(persona);
    }
  };

  const makeBAUCallFromStrToken = async (strToken = '') => {
    if (!strToken) return;
    const oldLoginDetails = {
      baseApiUrlOld: BASE_API_URL_OLD,
      subBaseApiUrlOld: SUB_BASE_API_URL_OLD,
      memberLoginOld: MEMBER_LOGIN_OLD,
      agentLoginOld: AGENT_LOGIN_OLD,
      capfLoginOld: CAPF_LOGIN_OLD,
      memberLogoutOld: MEMBER_LOGOUT_OLD,
      agentLogoutOld: AGENT_LOGOUT_OLD,
      subDomain: SUB_DOMAIN,
    };
    const splittedValues = strToken.split('.');
    const userId = decryptAESForLoginAPI(splittedValues[0]);
    const password = decryptAESForLoginAPI(splittedValues[1]);
    // comment BAU - Login --START
    try {
      await onSubmitFormOldLoginHandler(
        formType,
        userId,
        password,
        sharedData?.countryCode,
        {},
        oldLoginDetails,
      );
    } catch (error) {
      console.log('---unCaught BAU login error::::::', error);
    }
    // comment BAU - Login --END
  };

  useCustomEventListener(Constants.TOGGLE_LOGIN_POPUP, onCustomEventListener);
  const isMember = formType?.toLowerCase() === MEMBER?.toLowerCase();
  return (
    <ProviderWrapper>
      <div className="skyplus-indigo-global-wrapper-v1">
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
        {formType && !loggedInUserDetails ? (
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
            <FocusTrap>
              <LoginForm
                persona={formType}
                setFormType={setFormType}
                onCloseHandler={() => onCloseHandler()}
                setToastProps={setToastProps}
                mfLabels={loginAEMData?.data?.loginmainByPath?.item}
                setSharedData={setSharedData}
                sharedData={sharedData}
                setActiveScreen={setActiveScreen}
                activeScreen={activeScreen}
                makeBAUCallFromStrToken={makeBAUCallFromStrToken}
              />
            </FocusTrap>
          </Suspense>
        ) : null}
        {[
          SCREEN_TYPE.FORGOT_USERID,
          SCREEN_TYPE.FORGOT_CONFIRM_PASSWORD,
        ].includes(activeScreen) && (
          <FocusTrap>
            <ForgotPasswordHome
              onCloseHandler={() => {
                if (isMember) {
                  onCloseHandler();
                  return;
                }
                setToastProps(null);
                setActiveScreen(SCREEN_TYPE.LOGIN_PASSWORD);
              }}
              setToastProps={setToastProps}
              personaType={formType}
              mfLabels={loginAEMData?.data?.loginmainByPath?.item}
              setActiveScreen={setActiveScreen}
              sharedData={sharedData}
              activeScreen={activeScreen}
              setSharedData={setSharedData}
            />
          </FocusTrap>
        )}

        {[
          SCREEN_TYPE.SIGNUP_OTP,
          SCREEN_TYPE.SIGNUP_FORM,
          SCREEN_TYPE.SIGNUP_SETPASSWORD,
        ].includes(activeScreen) && (
          <FocusTrap>
            <SignUpForm
              persona={formType}
              onCloseHandler={onCloseHandler}
              mfLabels={loginAEMData?.data?.loginmainByPath?.item}
              sharedData={sharedData}
              setActiveScreen={setActiveScreen}
              activeScreen={activeScreen}
              setSharedData={setSharedData}
              setToastProps={setToastProps}
              makeBAUCallFromStrToken={makeBAUCallFromStrToken}
            />
          </FocusTrap>
        )}
      </div>
    </ProviderWrapper>
  );
};
ProviderWrapper.propTypes = {
  children: PropTypes.any,
};
Login.propTypes = {};

let rootElement = null;

function loginAppInit(ele, props) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(<Login {...props} />);
  }
}

if (document.getElementById('__login__microapp__dev__only')) {
  loginAppInit(document.getElementById('__login__microapp__dev__only'), {});
}

export { loginAppInit };
