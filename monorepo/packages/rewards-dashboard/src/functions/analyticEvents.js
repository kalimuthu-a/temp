import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { analyticConstant } from '../constants/common';
/**
 * pushAnalytic - It holds the list of events and its details called from MFE
 * @param {*} param0 - contains state and event name
 */
const pushAnalytic = ({ ...obj }) => {
  const { state, event, errorMesg } = obj;

  let eventProps = {};
  console.log({ state, event });
  const pageName = '';

  switch (event) {
    case 'Get started':
      eventProps = {
        interactionType: 'Pop Up shown',
        page: {
          eventInfo: {
            name: 'Get Started',
            component: 'profile',
          },
          user: {
            profileInitiated: 1,
          },
          pageInfo: {
            journeyFlow: 'profile flow',
            siteSection: 'profile flow',
          },
        },
      };
      break;
    default: break;
  }
  try {
    adobeAnalytic({
      state: { ...state, pageType: pageName },
      commonInfo: {
        page: {
          pageInfo: {
            siteSection: pageName,
          },
        },
      },
      eventProps,
    });
  } catch (error) {
    console.log('---error in profile mf analytics util', error);
  }
};

export default pushAnalytic;
