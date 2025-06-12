import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import merge from 'lodash/merge';

import { ANALTYTICS } from '../constants';

const { EVENTS, INTERACTION, DATA_CAPTURE_EVENTS } = ANALTYTICS;

const ANALTYTICS_FLIGHT_SELECT = 'Flight Select';
const ANALTYTICS_BOOKING_FLOW = 'Booking Flow';

const getDynamicPageInfo = () => {
  const { pageType = '' } = window;

  const defaultProps = {
    journeyFlow: ANALTYTICS_BOOKING_FLOW,
    siteSection: ANALTYTICS_BOOKING_FLOW,
  };

  switch (pageType) {
    case 'srp':
      return {
        pageName: ANALTYTICS_FLIGHT_SELECT,
        ...defaultProps,
      };
    case 'flight-select-modification':
      return {
        pageName: 'Flight Select Modification',
        journeyFlow: 'Modification Flow',
        siteSection: 'Modification Flow',
      };
    default:
      return {
        pageName: pageType,
        journeyFlow: pageType,
        siteSection: pageType,
      };
  }
};

const pushAnalyticWrapper = ({ ...obj }) => {
  const {
    event = '',
    data: {
      productInfo = {},
      search = {},
      eventInfo = {},
      productSelected = {},
      pageInfo = {},
      errorObj = {},
      apiresponse = {},
      loyalty,
    },
  } = obj;

  let eventProps = {};

  const defaultProps = {
    page: {
      pageInfo: {
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
        ...getDynamicPageInfo(),
        ...pageInfo,
      },
      eventInfo: {},
      LOB: 'Flights',
    },
    product: {
      productInfo,
    },
    ...(loyalty && { loyalty }),
  };

  const {
    POP_UP_OPEN_OFFER_DETAILS,
    POP_UP_OPEN_LAYOVER_DETAILS,
    POP_UP_OPEN_FLIGHT_DETAILS,
    ON_CLICK_APPLY,
    ON_CLICK_CALENDAR,
    ON_CLICK_SELECT,
    ON_PAGE_LOAD,
    NO_FLIGHT_FOUND,
    POP_UP_OPEN_FARE_DETAILS,
    ON_CLICK_RECOMMENDATION,
    ERROR,
    API_RESPONSE,
    ON_CLICK_NEXT,
    UX_ERROR,
  } = DATA_CAPTURE_EVENTS;

  switch (event) {
    case ON_PAGE_LOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.PAGELOAD,
        event: EVENTS.PAGELOAD,
        page: {
          eventInfo: {},
        },
        product: {
          productViewed: {
            flight: '1',
          },
        },
      });
      break;
    }

    case ON_CLICK_SELECT: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Select',
            component: ANALTYTICS_FLIGHT_SELECT,
            ...eventInfo,
          },
        },
        product: {
          productInfo,
          productSelected,
        },
      });
      break;
    }

    case ON_CLICK_NEXT: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SELECT_FLIGHT,
        page: {
          eventInfo: {
            name: 'Next',
            component: ANALTYTICS_FLIGHT_SELECT,
            ...eventInfo,
          },
        },
        product: {
          productInfo,
          productSelected,
        },
      });
      break;
    }

    case ON_CLICK_CALENDAR: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SEARCH_FLIGHT,
        page: {
          eventInfo: {
            component: 'Fare calendar',
            ...eventInfo,
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case ON_CLICK_APPLY: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Apply',
            position: 'Filters',
            component: ANALTYTICS_FLIGHT_SELECT,
          },
        },
        product: {
          productInfo,
        },
        search,
      });
      break;
    }

    case POP_UP_OPEN_LAYOVER_DETAILS: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.POPUP_SHOWN,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Layover Details',
            position: '',
            component: ANALTYTICS_FLIGHT_SELECT,
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case POP_UP_OPEN_FLIGHT_DETAILS: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.POPUP_SHOWN,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Flight Details',
            position: '',
            component: ANALTYTICS_FLIGHT_SELECT,
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case POP_UP_OPEN_OFFER_DETAILS: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.POPUP_SHOWN,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Offers Details',
            position: '',
            component: ANALTYTICS_FLIGHT_SELECT,
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case NO_FLIGHT_FOUND: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.Error,
        event: EVENTS.NO_FLIGHT_FOUND,
        page: {
          eventInfo: {
            name: 'No Flight Found',
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case POP_UP_OPEN_FARE_DETAILS: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.POPUP_SHOWN,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Fare Details',
            component: ANALTYTICS_FLIGHT_SELECT,
            position: '',
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case ON_CLICK_RECOMMENDATION: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Select',
            position: '',
            component: ANALTYTICS_FLIGHT_SELECT,
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case API_RESPONSE: {
      eventProps = merge(defaultProps, {
        interactionType: 'Api response',
        event: 'api response',
        page: {
          api: {
            code: apiresponse.code,
            response: apiresponse.response,
            responsetime: apiresponse.responsetime,
            apiURL: apiresponse.apiURL,
          },
        },
      });
      break;
    }

    case ERROR: {
      eventProps = merge(defaultProps, {
        interactionType: 'Error',
        event: 'error',
        page: {
          api: errorObj,
        },
      });
      break;
    }

    case UX_ERROR: {
      eventProps = merge(defaultProps, {
        interactionType: 'Error',
        event: 'UXerror',
        page: {
          error: errorObj,
        },
      });
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

export default (obj) => {
  try {
    pushAnalyticWrapper(obj);
  } catch (error) {
    // error handling
  }
};
