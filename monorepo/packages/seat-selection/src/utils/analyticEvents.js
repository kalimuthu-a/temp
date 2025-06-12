import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { getFormattedProductDetails } from '.';
import {
  API_RESPONSE,
  ERROR,
  LINK_BUTTON_CLICK,
  VALUES,
} from '../constants/analytics';

/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line sonarjs/cognitive-complexity
const pushAnalyticWrapper = ({ ...obj }) => {
  const { event = '', data = {} } = obj;
  const {
    _event,
    productInfo = {},
    isModifyFlow,
    response,
    warning,
    warningMessage,
    productDetails = {},
    journeysDetail = [],
    component,
    action,
    isWebCheckInFlow,
    femaleSeatsCount = '0',
    isFemaleSeat = 'false',
  } = data || {};

  let pageName = isModifyFlow
    ? VALUES.SEAT_SELECT_MODIFICATION_FLOW
    : VALUES.SEAT_SELECT;

  let flow = isModifyFlow ? VALUES.MODIFICATION_FLOW : VALUES.BOOKING_FLOW;

  if (window.pageType === 'add-on-seat-selection-checkin') {
    pageName = VALUES.SEAT_SELECTION_CHECKIN_FLOW;
    flow = VALUES.CHECKIN_FLOW;
  }

  let sector = '';

  journeysDetail?.forEach((journey, index) => {
    if (index > 0) {
      sector += '|';
    }
    sector += `${journey?.journeydetail?.origin}-${journey?.journeydetail?.destination}`;
  });

  const aemError = getErrorMsgForCode(response?.responseData?.Code);

  const formattedProductDetails = getFormattedProductDetails({
    productDetails,
    journeysDetail,
  });
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  let eventProps = {};
  switch (_event) {
    case 'pageload':
      eventProps = {
        event,
        interactionType: 'Pageload',
        page: {
          pageInfo: {
            pageName,
            journeyFlow: flow,
            siteSection: flow,
            language: 'en',
            platform:
              window.innerWidth <= 768
                ? VALUES.PLATFORM.Mweb
                : VALUES.PLATFORM.WEB,
          },
          LOB: VALUES.LOB,
        },
        product: {
          productViewed: {
            seat: '1',
          },
          productCount: {
            seat: femaleSeatsCount,
          },
        },
      };
      break;
    case 'clickNext':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: 'Next',
            position: '',
            component: pageName,
          },
          pageInfo: {
            pageName,
            journeyFlow: flow,
            siteSection: flow,
            language: 'en',
            platform:
              window.innerWidth <= 768
                ? VALUES.PLATFORM.Mweb
                : VALUES.PLATFORM.WEB,
          },
          LOB: VALUES.LOB,
        },
        product: {
          productInfo: {
            seatSelected: productInfo.seatSelected,
            XLseatSelected: productInfo.XLseatSelected,
            femaleSeat: productInfo.femaleSeat,
            productDetails: formattedProductDetails,
          },
          productSelected: {
            seat: '1',
            FemaleSeat: isFemaleSeat,
          },
        },
      };
      break;
    case 'click':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: event,
            position: '',
            component: pageName,
          },
          pageInfo: {
            pageName,
            journeyFlow: flow,
            siteSection: flow,
            language: 'en',
            platform:
              window.innerWidth <= 768
                ? VALUES.PLATFORM.Mweb
                : VALUES.PLATFORM.WEB,
          },
        },
        product: {
          productInfo: {
            Sector: sector,
          },
          productSelected: {
            seat: 1,
          },
        },
      };
      break;
    case 'clickAdd':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: 'Add',
            position: '',
            component: pageName,
          },
          pageInfo: {
            pageName,
            journeyFlow: flow,
            siteSection: flow,
            language: 'en',
          },
          LOB: VALUES.LOB,
        },
      };
      break;

    case 'api':
      eventProps = {
        event,
        interactionType: API_RESPONSE,
        page: {
          pageInfo: {
            pageName,
            siteSection: flow,
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
        interactionType: ERROR,
        page: {
          pageInfo: {
            pageName,
            siteSection: flow,
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

    case 'UXerror':
      eventProps = {
        event: 'UXerror',
        interactionType: 'Error',
        page: {
          pageInfo: {
            pageName,
            siteSection: flow,
            projectName: 'UX-Revamp',
            platform: isMobile ? 'Mweb' : 'Web',
          },
          error: {
            code: String(response.statusCode),
            type: 'BE Error',
            source: 'MS API',
            apiURL: response.url,
            statusCode: response?.responseData?.Code || aemError?.code,
            statusMessage: response?.responseData?.Message || aemError?.message,
            displayMessage: aemError?.message,
            // "Page load" ,"Link/ButtonClick" ,"Pop up shown"
            action: action || 'Page load',
            //  Page Name in case of page load,
            //  Link or CTA name in case of click,
            //  Pop up name in case of Pop up load,
            component: component || pageName,
          },
        },
      };
      break;

    case 'warning':
      eventProps = {
        event: 'warning',
        interactionType: warning ? 'Warning' : 'Info',
        page: {
          pageInfo: {
            pageName,
            siteSection: flow,
            projectName: 'Skyplus',
            warningCount: warning ? '1' : '0',
            infoCount: warning ? '0' : '1',
            platform:
              window.innerWidth <= 768
                ? VALUES.PLATFORM.Mweb
                : VALUES.PLATFORM.WEB,
          },
          eventInfo: {
            name: warningMessage,
            position: 'on',
            component,
          },
        },
      };
      break;
    default:
  }
  console.log({ eventProps }); // eslint-disable-line no-console
  adobeAnalytic({
    state: {},
    commonInfo: {},
    eventProps,
  });
};

export const pushAnalytic = (arg) => {
  try {
    pushAnalyticWrapper(arg);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error in adobeAnalytic seat selection MF', error);
  }
};
