import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { ANALTYTICS } from '../constants';

const { EVENTS, INTERACTION, DATA_CAPTURE_EVENTS, JOURNEY_FLOW, SITE_SECTION, PAGE_NAME, COMPONENT } = ANALTYTICS;

/**
 * Delay in asyn fucntion
 * @param {*} ms - time
 * @returns
 */

/**
 * pushAnalyticWrapper - It holds the list of events and its details called from MFE
 * @param {object} param0 - contains data and event name
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const pushAnalyticWrapper = async ({ ...obj }) => { // NOSONAR
  const { data = {} } = obj;
  const {
    _event,
    _eventInfoName = '',
    _componentName = '',
    _totalcard,
    _customerid,
    _scratches,
    _couponAvaild,
  } = data;

  const {
    SCRATCH_CARD,
    SCRATCH_CARD_CLICK,
    SCRATCH_CARD_POPUPLOAD,
    CLOSE_ICON_CLICK,
    SCRATCHING_CLICK,
    AVAIL_NOW_CLICK,
    COPY_CLICK,
  } = DATA_CAPTURE_EVENTS;

  /**
     * getValuefromCode - find name of ssrCode from Abbreviation List
     * @param {String} i
     * @param {Object} arr
     * @param {String} j
     * @returns - name of ssr
     */

  /**
     * getParentSSR - fond the parent ssrCode if any
     * @param {String} ssrCode
     * @param {Object} ssrCategories
     * @returns - parent ssrCode
     */

  // const loginTypeObj = Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true) || {};

  let eventProps = {};
  switch (_event) {
    case SCRATCH_CARD:
      eventProps = {
        event: INTERACTION.PAGELOAD,
        interactionType: INTERACTION.PAGELOAD,

        page: {
          eventInfo: {
            name: SCRATCH_CARD || 'scratchcard',
            position: '',
          },
          LOB: 'Flights',
          pageInfo: {
            totalCount: String(_totalcard),
          },
        },
      };
      break;

    case SCRATCH_CARD_CLICK:
      eventProps = {
        event: EVENTS.SECONDARY_CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            // position: String(_couponID),
            position: '',
            component: _componentName || 'Scratch Card',
          },
          LOB: 'Flights',
          pageInfo: {

          },
        },
      };
      break;
    case SCRATCH_CARD_POPUPLOAD:
      eventProps = {
        event: EVENTS.CLICK,
        interactionType: INTERACTION.POPUP_SHOWN,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: '',
            component: COMPONENT,
          },
          LOB: 'Flights',
        },
      };
      break;
    case CLOSE_ICON_CLICK:
      eventProps = {
        event: EVENTS.SECONDARY_CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'X',
            component: 'Active',
          },
          LOB: 'Flights',
          pageInfo: {
            customerID: String(_customerid),
          },
        },
      };
      break;
    case SCRATCHING_CLICK:
      eventProps = {
        event: EVENTS.CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'Click here',
            component: COMPONENT,
          },
          LOB: 'Flights',
          pageInfo: {
            customerID: String(_customerid),
            scratches: _scratches,
          },
        },
      };
      break;
    case AVAIL_NOW_CLICK:
      eventProps = {
        event: EVENTS.CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'Avail Now',
            component: COMPONENT,
          },
          LOB: 'Flights',
          pageInfo: {

          },

        },
        product: {
          productInfo: {
            cupponavilled: _couponAvaild,

          },

        },
      };
      break;
    case COPY_CLICK:
      eventProps = {
        event: EVENTS.SECONDARY_CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'Copy',
            component: COMPONENT,
          },
          LOB: 'Flights',
          pageInfo: {
            customerID: String(_customerid),

          },
        },
      };
      break;
    default:
  }

  if (_event === 'cmp:loaded') {
    return;
  }

  try {
    adobeAnalytic({
      state: {},
      commonInfo: {
        page: {
          pageInfo: {
            pageName: PAGE_NAME,
            siteSection: SITE_SECTION,
            journeyFlow: JOURNEY_FLOW,
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
            language: 'en',
          },
        },
      },
      eventProps,
    });
  } catch (errors) {
    // console.log('---error in scratchcard mf adobe analytics util', errors);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const pushAnalytic = async (obj) => {
  try {
    await pushAnalyticWrapper(obj);
  } catch (error) {
    console.error('scratchcard::error:pushAnalytic', error);// eslint-disable-line no-console
  }
};
