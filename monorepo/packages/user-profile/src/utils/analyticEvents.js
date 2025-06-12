import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { aaEvents, commonInfoMerge, interactions } from './analyticsConstants';

/**
 * @param {object} param0 - contains data and event name
 */
const pushAnalyticWrapper = ({ ...obj }) => {
  const { event = '', data = {}, commonInfo = commonInfoMerge() } = obj;
  const { _event, response } = data;

  let eventProps = {};

  const aemError = getErrorMsgForCode();

  switch (event) {
    case aaEvents.MY_BOOKINGS_PAGELOAD:
    case aaEvents.NOMINEE_PAGELOAD:
    case aaEvents.MY_PROFILE_PAGELOAD: {
      eventProps = {
        event: _event,
        interactionType: interactions.PAGE_LOAD,
        page: {
          pageInfo: {
            checkFlag: data?.checkFlag,
          },
        },
      };
      break;
    }

    case aaEvents.BOOKING_CARD_BTN:
    case aaEvents.VIEW_BOARDING_PASS:
    case aaEvents.NEED_HELP:
    case aaEvents.PAY_NOW: {
      eventProps = {
        event: _event,
        interactionType: interactions.Link_Button_Click,
        page: {
          eventInfo: data?.eventInfo,
        },
        product: {
          productInfo: {
            ...data.productInfo,
          },
        },
      };
      break;
    }
    case aaEvents.MY_PROFILE_BTN_CLICK: {
      eventProps = {
        event: _event,
        interactionType: interactions.Link_Button_Click,
        eventInfo: data?.eventInfo,
        page: {
          pageInfo: data.pageInfo,
        },
      };
      break;
    }
    case aaEvents.NOMINEE_ADDED_INITIATED:
    case aaEvents.NOMINEE_ADDED:
    case aaEvents.REMOVE_NOMINEE:
    case aaEvents.REMOVE_NOMINEE_CANCEL:
    case aaEvents.REMOVE_NOMINEE_INITIATED: {
      eventProps = {
        event: _event,
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: data.eventInfo,
        },
      };
      break;
    }
    case aaEvents.REMOVE_NOMINEE_POPUP: {
      eventProps = {
        event: _event,
        interactionType: interactions.POPUP_SHOWN,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: data.eventInfo,
        },
      };
      break;
    }
    case 'api':
      eventProps = {
        event: _event,
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
    ...commonInfo,
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
