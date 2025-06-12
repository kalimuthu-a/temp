import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import CONSTANTS, { EVENTS, INTERACTIONS } from '../constants';

/**
 * @param {object} param - contains data and event name
 */
const pushAnalyticWrapper = ({ event = '', data = {} }) => {
  const { _event, pageInfo, productInfo, bookingChannel, eventInfo } = data;
  const eventProps = {
    event,
    page: {
      pageInfo: {
        siteSection: CONSTANTS.CHECKING_FLOW,
        journeyFlow: CONSTANTS.CHECKING_FLOW,
        language: 'en',
        pageName: CONSTANTS.SPLIT_PNR,
        ...pageInfo, // Merged directly with pageInfo
      },
      eventInfo: _event === EVENTS.CLICK ? { ...eventInfo, component: CONSTANTS.SPLIT_PNR } : eventInfo,
    },
  };

  switch (_event) {
    case EVENTS.PAGE_LOAD:
      eventProps.interactionType = INTERACTIONS.PAGE_LOAD;
      eventProps.bookingChannel = bookingChannel;
      eventProps.product = {
        productInfo,
      };
      break;

    case EVENTS.CLICK:
      eventProps.interactionType = INTERACTIONS.Link_Button_Click;
      eventProps.page.eventInfo = {
        ...eventProps.page.eventInfo,
        component: CONSTANTS.SPLIT_PNR,
      };
      break;

    case EVENTS.SPLIT_PNR_SUCCESS:
      eventProps.interactionType = INTERACTIONS.PAGE_LOAD;
      eventProps.page.eventInfo = {
        ...eventProps.page.eventInfo,
        component: CONSTANTS.SPLIT_PNR,

      };
      eventProps.bookingChannel = bookingChannel;
      eventProps.product = {
        productInfo,
      };
      break;

    default:
      // No default actions needed
      break;
  }

  // Pass analytics data
  adobeAnalytic({
    state: {},
    commonInfo: {},
    eventProps,
  });
};

const analyticEvents = (obj) => {
  try {
    pushAnalyticWrapper(obj);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error });
    // Error Handling
  }
};

export default analyticEvents;
