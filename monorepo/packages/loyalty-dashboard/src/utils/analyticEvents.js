import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { ANALYTICS_EVENTS } from '../constants';

const interactions = {
  PAGE_LOAD: 'Pageload',
  Link_Button_Click: 'Link/ButtonClick',
  POP_UP: 'Pop Up shown',
  API_RESPONSE: 'API response',
  ERROR: 'Error',
  LOYALTY_TRANSACTION: 'Loyalty_Transaction',
  CLICK: 'click',
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
        interactionType: interactions.PAGE_LOAD,
        page: {
          pageInfo: {
            ...data.pageInfo,
            searchResultCount: data?.pageInfo?.searchResultCount,
          },
        },
        loyalty: data.loyalty,
      };
      break;
    }
    case 'transactionPageload': {
      eventProps = {
        interactionType: interactions.PAGE_LOAD,
        event: interactions.LOYALTY_TRANSACTION,
        page: {
          pageInfo: {
            ...data.pageInfo,
            pageName: 'Loyalty Transaction',
            siteSection: 'Loyalty',
            projectName: 'UX-Revamp',
            journeyFlow: 'Loyalty',
          },
          eventInfo: {},
        },
        user: data?.userInfo,
        loyalty: data?.loyalty,
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
    case ANALYTICS_EVENTS.RETRO_PAGE_LOAD:
      eventProps = {
        event,
        interactionType: data.interactionType,
        page: {
          pageInfo: data.pageInfo,
        },
      };
      break;
    case ANALYTICS_EVENTS.RETRO_CTA_CLICK:
      eventProps = {
        event,
        interactionType: data.interactionType,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: data.eventInfo,
        },
        product: {
          productInfo: data.productInfo,
        },
        loyalty: data.loyaltyInfo,
      };
      break;
    case ANALYTICS_EVENTS.RETRO_POINTS_CLAIMED:
      eventProps = {
        event,
        interactionType: data.interactionType,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: data.eventInfo,
        },
        loyalty: data.loyalty,
      };
      break;
    case ANALYTICS_EVENTS.PARTNER_HISTORY:
      eventProps = {
        event,
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: data.eventInfo,
        },
      };
      break;
    case ANALYTICS_EVENTS.PARTNER_FILTERS:
      eventProps = {
        event,
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: data.eventInfo,
        },
        search: {
          filters: {
            transaction: data?.search?.filters?.transaction,
            voucher: data?.search?.filters?.voucher,
            partner: data?.search?.filters?.partner,
            date: data?.search?.filters?.date,
          },
        },
      };
      break;
    case ANALYTICS_EVENTS.VIEW_CLAIM_BENEFITS:
      eventProps = {
        event: interactions.CLICK,
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data?.pageInfo,
          eventInfo: data?.eventInfo,
        },
      };
      break;
    case ANALYTICS_EVENTS.DASHBOARD_TAB_BENFIT:
      eventProps = {
        event: interactions.CLICK,
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data?.pageInfo,
          eventInfo: data?.eventInfo,
        },
      };
      break;
    case ANALYTICS_EVENTS.LOYALTY_REDEEM:
      eventProps = {
        event: 'Loyalty_Redeem',
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data?.pageInfo,
          eventInfo: data?.eventInfo,
        },
        loyalty: data?.loyalty,
      };
      break;
    case ANALYTICS_EVENTS.LOYALTY_VOUCHER:
      eventProps = {
        event: interactions.CLICK,
        interactionType: interactions.Link_Button_Click,
        page: {
          pageInfo: data?.pageInfo,
          eventInfo: data?.eventInfo,
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
    // console.log({ error });
    // Error Handling
  }
};

export default analyticEvents;
