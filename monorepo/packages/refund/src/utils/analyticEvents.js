import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';

import { TYPE, SOURCE, interactions } from '../constants/analytic';

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
          pageInfo: data.pageInfo,
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
    pushAnalyticWrapper.log({ error });
  }
};

export default analyticEvents;
