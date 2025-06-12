import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';

const interactions = {
  PAGE_LOAD: 'pageload',
  Link_Button_Click: 'Link/ButtonClick',
  POP_UP: 'Pop Up shown',
  API_RESPONSE: 'API response',
  ERROR: 'Error',
};

/**
 * @param {object} param0 - contains data and event name
 */
const pushAnalyticWrapper = ({ ...obj }) => {
  const { event = '', data = {} } = obj;
  const { _event, response } = data;

  let eventProps = {};

  const aemError = getErrorMsgForCode();

  switch (_event) {
    case 'pageload': {
      eventProps = {
        event,
        interactionType: interactions.POP_UP,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: {
            name: 'Fare Details',
          },
        },
      };
      break;
    }

    case 'api':
      eventProps = {
        event,
        interactionType: interactions.API_RESPONSE,
        page: {
          pageInfo: {
            projectName: 'Skyplus',
          },
          api: {
            code: 200,
            response: response.responseData,
            responsetime: response.responseTime,
            apiURL: response.url,
          },
        },
      };
      break;

    case 'error':
      eventProps = {
        event: 'error',
        interactionType: interactions.ERROR,
        page: {
          pageInfo: {
            projectName: 'Skyplus',
          },
          error: {
            code: response.statusCode,
            type: 'API',
            source: 'API',
            apiURL: response.url,
            statusCode: aemError.code,
            statusMessage: aemError.message,
            displayMessage: aemError.message,
          },
        },
      };
      break;

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
    console.log({ error });
    // Error Handling
  }
};

export default analyticEvents;
