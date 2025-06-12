/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import {
  FLIGHT_SELECT_PAGE,
  PASSENGER_EDIT_PAGE,
  analyticConstant,
} from '../constants/common';
/**
 * pushAnalytic - It holds the list of events and its details called from MFE
 * @param {*} param0 - contains state and event name
 */
const pushAnalytic = ({ ...obj }) => {
  const { state, event } = obj;

  const { HOMEPAGE, FLIGHT_SELECT, PASSENGER_SELECT } = analyticConstant;
  let eventProps = {};
  console.log({ state, event });
  let TempPageName = HOMEPAGE;
  const { pageType } = window;

  if (pageType === FLIGHT_SELECT_PAGE) TempPageName = FLIGHT_SELECT;
  if (pageType === PASSENGER_EDIT_PAGE) TempPageName = PASSENGER_SELECT;

  switch (event) {
    case 'ContinueAtPhone':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Continue',
            component: 'New user registration',
            position: 'phone',
          },
        },
        user: {
          phone: state?.phone || '',
          signUpInitiated: '1',
        },
      };
      break;
    case 'ContinueAtEmail':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Continue',
            component: 'New user registration',
            position: 'email',
          },
        },
        user: {
          email: state?.email || '',
          signUpInitiated: '1',
        },
      };
      break;
    case 'ContinueAtSignup':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Continue',
            component: 'New user registration Form',
          },
        },
        user: {
          firstName: state?.firstName || '',
          lastName: state?.lastName || '',
          dob: state?.dob || '',
        },
      };
      break;
    case 'Verify OTP':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Verify OTP',
            component: 'New user registration',
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
            component: 'New user registration',
            position: state?.position,
          },
        },
      };
      break;
    case 'Set Password':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: state?.buttonName || 'Set Password',
            component: 'New User Registration',
          },
        },
        user: {
          signUpSuccess: String(state?.signUpSuccess) || '',
          signUpFail: String(state?.signUpFail) || '',
        },
      };
      break;
    case 'Loyality Dashboard':
      eventProps = {
        interactionType: 'Pop up shown',
        page: {
          eventInfo: {
            name: 'Registration successful',
            component: 'New User Registration',
          },
        },
      };
      break;
    case 'Enroll Me Now':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Enroll Me Now',
            component: 'Existing User Registration',
          },
          user: {
            signUpInitiated: '1',
          },
        },
      };
      break;
    case 'I will do later':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'I will do later',
            component: 'Existing User Registration',
          },
        },
      };
      break;

    case 'Existing User Login':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Login',
            component: 'Existing User Login',
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
            component: 'Existing User Login',
          },
        },
      };
      break;
    case 'Registration Successful':
      eventProps = {
        interactionType: 'Link/ButtonClick',
        page: {
          eventInfo: {
            name: 'Registration Successful',
            component: 'New User Registration',
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
        event: 'click',
        page: {
          LOB: 'Flights',
          pageInfo: {
            platform: window?.innerWidth > '768' ? 'Web' : 'Mweb',
            journeyFlow: 'login flow',
            siteSection: 'login Flow ',
          },
        },
        user: {
          type: 'WWWA',
        },
      },
      eventProps,
    });
  } catch (error) {
    console.error('---error in login-sso mf analytics util', error);
  }
};

export default pushAnalytic;
