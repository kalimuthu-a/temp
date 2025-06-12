import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import {
  pageConstant,
  pageTypeConst,
  personaConstant,
} from 'skyplus-design-system-app/src/constants/analytics';
import {
  FLIGHT_SELECT_PAGE,
  PASSENGER_EDIT_PAGE,
  analyticConstant,
  AA_CONSTANTS,
} from '../constants/common';
/**
 * pushAnalytic - It holds the list of events and its details called from MFE
 * @param {*} param0 - contains state and event name
 */
const pushAnalytic = ({ ...obj }) => {
  const { state, event, errorMesg, apiMesg } = obj;

  const {
    CORP_CONNECT_ADMIN,
    CORP_CONNECT_USER,
    PERSONA_CORP_ADMIN,
    PERSONA_CORP_USER,
    PERSONA_MEMBER,
    PERSONA_AGENT,
    AGENT_USER,
    HOMEPAGE,
    FLIGHT_SELECT,
    PASSENGER_SELECT,
  } = analyticConstant;
  let eventProps = {};
  console.log({ state, event });
  let TempPageName = HOMEPAGE;
  const { pageType, persona } = window;
  if (pageType === pageTypeConst.PAGETYPE_HOMEPAGE) {
    switch (persona) {
      case PERSONA_CORP_ADMIN:
        TempPageName = CORP_CONNECT_ADMIN;
        break;
      case PERSONA_CORP_USER:
        TempPageName = CORP_CONNECT_USER;
        break;
      case PERSONA_AGENT:
        TempPageName = AGENT_USER;
        break;
      case PERSONA_MEMBER:
        TempPageName = HOMEPAGE;
        break;
      default:
        TempPageName = HOMEPAGE;
        break;
    }
  }

  if (pageType === FLIGHT_SELECT_PAGE) TempPageName = FLIGHT_SELECT;
  if (pageType === PASSENGER_EDIT_PAGE) TempPageName = PASSENGER_SELECT;

  switch (event) {
    case 'Get started':
      eventProps = {
        interactionType: 'Pop Up shown',
        page: {
          eventInfo: {
            name: 'Get Started',
          },
          user: {
            loginInitiated: '1',
          },
        },
      };
      break;
    case 'Send OTP':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Send OTP',
          },
        },
        user: {
          customer: {
            phone: state?.phone || '',
          },
        },
      };
      break;
    case 'Continue As A Guest':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Continue As A Guest',
          },
        },
      };
      break;
    case 'Continue':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Continue',
          },
        },
      };
      break;
    case 'Submit OTP':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Submit OTP',
          },
          user: {
            loginSuccessful: String(state.loginSuccessful || '0'),
            loginFail: String(state?.loginFail || '0'),
            signUpInitiated: String(state?.signUpInitiated || '0'),
          },
        },
      };
      break;
    case 'Resend OTP':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Resend OTP',
          },
        },
      };
      break;
    case 'Confirm OTP':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Confirm OTP',
          },
        },
      };
      break;
    case 'Login With Password':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Login With Password',
          },
        },
      };
      break;
    case 'Login':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Login',
          },
          user: {
            loginSuccessful: String(state.loginSuccessful || '0'),
            loginFail: String(state?.loginFail || '0'),
          },
        },
      };
      break;
    case 'Login With OTP':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Login With OTP',
          },
        },
      };
      break;
    case 'Forgot Password':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Forgot Password',
          },
        },
      };
      break;
    case 'Set Password':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Set Password',
          },
          user: {
            signUpSucess: String(state?.signUpSucess || '0'),
            signUpFail: String(state?.signUpFail || '0'),
          },
        },
      };
      break;
    case 'api':
      eventProps = {
        interactionType: 'Api',
        page: {
          response: {
            code: apiMesg?.code || '',
            response: apiMesg?.response || '',
            responsetime: apiMesg?.responsetime || '',
            apiURL: apiMesg?.apiURL || '',
          },
        },
      };
      break;
    case 'error':
      eventProps = {
        interactionType: 'Error',
        page: {
          error: {
            ...errorMesg,
            code: errorMesg?.code || '',
            type: errorMesg?.type || '',
            source: errorMesg?.source || '',
            apiURL: errorMesg?.apiURL || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.displayMessage || 'Something went wrong',
          },
        },
      };
      break;
    case 'UXerror':
      eventProps = {
        event: 'UXerror',
        interactionType: 'Error',
        page: {
          error: {
            code: `${errorMesg?.code}` || AA_CONSTANTS.NO_CODE,
            type: errorMesg?.type || '',
            source: errorMesg?.source || '',
            apiURL: errorMesg?.apiUrl || '',
            statusCode: `${errorMesg?.code}` || AA_CONSTANTS.NO_STATUS_CODE,
            statusMessage: errorMesg?.statusMessage || AA_CONSTANTS.NO_STATUS_MESSAGE,
            displayMessage: errorMesg?.displayMessage || AA_CONSTANTS.NO_DISPLAY_MESSAGE,
            action: errorMesg?.action || '',
            component: errorMesg?.component || '',
          },
          pageInfo: {
            projectName: 'UX-Revamp',
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    default:
      break;
  }

  try {
    adobeAnalytic({
      state: { ...state, pageName: TempPageName, pageType: TempPageName },
      commonInfo: {
        event: event || 'click',
        page: {
          LOB: 'Flights',
          eventInfo: {
            component: 'Login',
          },
          pageInfo: {
            platform: window?.innerWidth > '768' ? 'Web' : 'Mweb',
            journeyFlow: 'login flow',
            siteSection: 'login Flow ',
          },
        },
      },
      eventProps,
    });
  } catch (error) {
    console.log('---error in login mf analytics util', error);
  }
};

export default pushAnalytic;
