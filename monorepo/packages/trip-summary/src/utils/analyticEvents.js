import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { CONSTANTS } from '../constants';

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
  const { _event, journeyIndex, response } = data;

  const aemError = getErrorMsgForCode();

  let eventProps = {};

  switch (_event) {
    case 'pageload': {
      eventProps = {
        event,
        interactionType: interactions.POP_UP,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: {
            name: 'Trip Summary',
          },
        },
      };
      break;
    }

    case 'showmore':
      eventProps = {
        event,
        interactionType: interactions.Link_Button_Click,
        page: {
          eventInfo: {
            name: 'Show More',
            position: String(journeyIndex + 1),
            component: 'Trip Summary',
          },
        },
      };
      break;

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
  if (window?.pageType === CONSTANTS.PASSENGER_PAGETYPE) {
    eventProps.page.pageInfo = {
      ...eventProps.page.pageInfo,
      ...{
        pageName: 'Passenger Details',
        siteSection: 'Booking Flow',
        journeyFlow: 'Booking Flow',
      },
    };
  } else {
    eventProps.page.pageInfo = {
      ...eventProps.page.pageInfo,
      ...{
        pageName: 'Passenger Details Modification',
        siteSection: 'Modification Flow',
        journeyFlow: 'Modification Flow',
      },
    };
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
    //  Error Handling
  }
};

export default analyticEvents;
