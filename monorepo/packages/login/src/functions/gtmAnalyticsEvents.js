import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { analyticConstant } from '../constants/common';
import { COOKIE_KEYS } from '../constants/cookieKeys';
import Cookies from './cookies';

const getCommonProps = (state, pageName) => ({
  page_name: pageName,
  previous_page: pageName,
  platform: window.screen.width < 768 ? 'Mweb' : 'Web',
  site_section: 'Homepage',
  line_of_business: 'Flight',
  user_id: '',
  clarity_id: '',
  user_type: window?.persona,
});

const handlePersonaPageMapping = (persona, pageType) => {
  let pageName;
  switch (persona) {
    case analyticConstant.PERSONA_CORP_ADMIN:
      pageName = analyticConstant.PERSONA_CORP_ADMIN;
      break;
    case analyticConstant.PERSONA_CORP_USER:
      pageName = analyticConstant.PERSONA_CORP_USER;
      break;
    case analyticConstant.PERSONA_AGENT:
      pageName = analyticConstant.AGENT_USER;
      break;
    case analyticConstant.PERSONA_MEMBER:
      pageName = analyticConstant.HOMEPAGE;
      break;
    default:
      pageName = 'Homepage';
  }

  if (pageType === analyticConstant.FLIGHT_SELECT_PAGE) {
    pageName = analyticConstant.FLIGHT_SELECT;
  } else if (pageType === analyticConstant.PASSENGER_EDIT_PAGE) {
    pageName = analyticConstant.PASSENGER_SELECT;
  }

  return pageName;
};

const gtmPushAnalyticWrapper = ({ state, event }) => {
  const { persona } = window;
  const { pageType } = window;
  const pageName = handlePersonaPageMapping(persona, pageType);
  const authUser = Cookies.get(COOKIE_KEYS.USER) || '';
  const clarityId = Cookies.get(COOKIE_KEYS.CLARITY_ID, undefined, false) || '';
  const personasType = Cookies.get(COOKIE_KEYS.ROLE_DETAILS, true);
  let gtmProps;
  switch (event) {
    case 'customerLogin':
      gtmProps = {
        event: 'login_initiation',
        login_initiate: 1,
      };
      break;
    case 'popupLogin':
      gtmProps = {
        event: 'login_initiation',
        page: {
          user: {
            login_success: state.isLoggedIn ? '1' : '',
            login_failure: !state.isLoggedIn ? '1' : '',
          },
          error: {
            id: state.errorDetail?.code || '',
            text: !state.isLoggedIn ? state.errorDetail?.message : '',
          },
        },
      };
      break;
    case 'loginSuccess':
      gtmProps = {
        ...getCommonProps(state, pageName),
        event: 'login_success',

        login_success: '1',
        login_method: state.login_method,
      };
      break;
    case 'loginFailed':
      gtmProps = {
        ...getCommonProps(state, pageName),
        event: 'login_failed',
        click_text: state?.click_text,
        error_message: state?.error_message,

        login_failed: '1',
        clarty_id: '',
        login_method: state.login_method,
      };
      break;
    case 'error':
      gtmProps = {
        ...getCommonProps(state, pageName),
        event: 'error',

        click_text: state?.click_text,
        error_message: state?.error_message,
        error_type: state?.error_type,
        api_url: state?.apiURL,
        error_shown: '1',
      };
      break;
    case 'signupSuccess':
      gtmProps = {
        ...getCommonProps(state, pageName),
        event: 'signup_success',

        signup_success: '1',
      };
      break;

    case 'signupFailed':
      gtmProps = {
        ...getCommonProps(state, pageName),
        event: 'signup_failed',
        click_text: 'Set Password',
        error_message: 'Please try again sometime',

        signup_failed: '1',
      };
      break;
    case 'Continue As A Guest':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Continue as Guest',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;

    case 'loginWithPassword':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Login with Password',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;

    case 'Login With OTP':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Login with OTP',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;

    case 'Resend OTP':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Resend OTP',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;

    case 'Forgot Password':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Forgot Password',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;

    case 'Send OTP':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Send OTP',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;
    case 'Confirm OTP':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Confirm OTP',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;
    case 'Continue':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Set Password',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;
    case 'Continue':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Continue',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;
    case 'Continue':
      gtmProps = {
        event: 'link_click ',
        click_text: 'Continue',
        page_name: pageName,
        site_section: 'Homepage',
        line_of_business: 'Flight',
        user_id: '',

        user_type: window?.persona,
        clarity_id: '',
      };
      break;

    default:
      console.log('default case');
  }

  gtmAnalytic({
    state,
    commonInfo: {
      user_type: personasType?.roleName || 'Anonymous',
      page_name: 'Homepage',
      line_of_business: 'Flight',
      user_id: authUser,
      clarity_id: clarityId,
    },
    gtmProps,
  });
};

const gtmPushAnalytic = (obj) => {
  try {
    gtmPushAnalyticWrapper(obj);
  } catch (error) {
    console.log('gtmPushAnalytic::::', error);
  }
};

export default gtmPushAnalytic;
