import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { TYPE, SOURCE, interactions, PAGE } from '../constants/analytic';

const dogDataId = window.DD_RUM?.getInternalContext()?.session_id;

/**
 * @param {object} param0 - contains data and event name
 */
const pushAnalyticWrapper = ({ ...obj }) => {
  const { event = '', data = {} } = obj;
  const { _event, errorMesg = {} } = data;

  let eventProps = {};

  switch (_event) {
    case 'pageload': {
      eventProps = {
        event,
        interactionType: interactions.PAGE_LOAD,
        page: {
          LOB: data.LOB || PAGE.LOB,
          pageInfo: data.pageInfo,
        },
      };
      break;
    }

    case 'checkInStart':
    case 'getStarted': {
      eventProps = {
        event,
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: data.eventInfo,
          LOB: data.LOB || PAGE.LOB,
        },
        product: {
          productInfo: data.productInfo,
        },
        user: {
          dataDogSessionID: dogDataId,
        },
      };
      break;
    }

    case 'error': {
      eventProps = {
        event,
        interactionType: 'Error',
        page: {
          error: {
            ...errorMesg,
            code: errorMesg?.code || '',
            type: TYPE[errorMesg?.type] || '',
            source: SOURCE[errorMesg?.source] || '',
            apiURL: errorMesg?.url || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.message || '',
          },
          pageInfo: data.pageInfo,
        },
      };
      break;
    }

    default:
  }

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
    // console.log({ error });
    // Error Handling
  }
};

export default analyticEvents;
