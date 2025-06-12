import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { getPageLoadTime } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';
import merge from 'lodash/merge';

import { ANALTYTICS } from '../constants';

const { EVENTS, INTERACTION, DATA_CAPTURE_EVENTS } = ANALTYTICS;

const COMPONENT = 'Booking Widget';

const getDynamicPageInfo = () => {
  let { pageType = '' } = window;
  pageType ||=
    window.location.href.split('/').pop().replace('.html', '').split('?')[0] ||
    '';

  const defaultProps = {
    journeyFlow: 'Booking Flow',
    siteSection: 'Booking Flow',
  };

  switch (pageType) {
    case 'homepage':
      return {
        pageName: 'Homepage',
        journeyFlow: 'Homepage',
        siteSection: 'Homepage',
      };
    case 'srp':
      return {
        pageName: 'Flight Select',
        ...defaultProps,
      };
    case 'passenger-edit':
      return {
        pageName: 'Passenger Details',
        ...defaultProps,
      };
    case 'flight-select-modification':
      return {
        pageName: 'Flight Select Modification',
        journeyFlow: 'Modification Flow',
        siteSection: 'Modification Flow',
      };
      case 'aiff':
        return {
          pageName: 'AIFF',
          journeyFlow: 'Collaboration Page',
          siteSection: 'Landing Page',
        };
      case 'xplore':
        return {
          pageName: 'Explore Destinations',
          journeyFlow: 'Explore Deals',
          siteSection: 'Explore Destinations',
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
      eventInfo = {},
      errorObj = {},
      apiresponse = {},
      points = null,
    },
  } = obj;

  let eventProps = {};

  const defaultProps = {
    page: {
      pageInfo: getDynamicPageInfo(),
      eventInfo: {
        ...eventInfo,
      },
    },
    product: {
      productInfo,
    },
    ...(points
      ? {
          loyalty: {
            ...points,
          },
        }
      : {}),
  };

  const {
    BOOK_A_FLIGHT_CLICK,
    BOOK_A_STAY_CLICK,
    ENTER_PROMO_CONTINUE,
    POPUPLOAD_PROMO_CODE,
    RECENT_SEARCH_CLICK,
    SEARCH_FLIGHT_CLICK,
    MODIFY_FLIGHT_CLICK,
    BOOKING_WIDGET_LOAD,
    ERROR,
    API_RESPONSE,
    MODIFY_DEAL,
    BOOKING_REMOTE_LOADED,
    UX_ERROR,
  } = DATA_CAPTURE_EVENTS;
  switch (event) {
    case BOOK_A_FLIGHT_CLICK: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Book a Flight',
            component: COMPONENT,
          },
        },
      });
      break;
    }

    case BOOK_A_STAY_CLICK: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Book a Stay',
            component: COMPONENT,
          },
        },
      });
      break;
    }

    case RECENT_SEARCH_CLICK: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SEARCH_FLIGHT,
        page: {
          eventInfo: {
            name: 'Recent Searches',
            component: COMPONENT,
            ...eventInfo,
          },
        },
      });
      break;
    }

    case MODIFY_FLIGHT_CLICK: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SEARCH_FLIGHT,
        page: {
          eventInfo: {
            // pageName: 'Flight Select',
            name: 'Modify Search',
            component: COMPONENT,
          },
        },
      });
      break;
    }

    case SEARCH_FLIGHT_CLICK: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.SEARCH_FLIGHT,
        page: {
          eventInfo: {
            name: 'Search Flight',
            position: '',
            component: COMPONENT,
          },
        },
      });
      break;
    }

    case POPUPLOAD_PROMO_CODE: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.POPUP_SHOWN,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Promo Code',
            component: COMPONENT,
          },
        },
        product: {
          productInfo,
        },
        ...(points
          ? {
              loyalty: {
                ...points,
              },
            }
          : {}),
      });
      break;
    }

    case ENTER_PROMO_CONTINUE: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        page: {
          eventInfo: {
            name: 'Continue',
            position: 'Promo Code',
            component: COMPONENT,
          },
        },
      });
      break;
    }

    case BOOKING_WIDGET_LOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.COMPONENT_LOAD,
        event: EVENTS.SECONDARY_CLICK,
        page: {
          eventInfo: {
            name: 'Booking Widget',
            component: '',
            position: '',
          },
          pageInfo: {
            componentLoadTime: getPageLoadTime(),
          },
        },
      });
      break;
    }

    case BOOKING_REMOTE_LOADED: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.COMPONENT_LOAD,
        event: 'booking-remote-loaded-2',
        page: {
          eventInfo: {
            name: COMPONENT,
            component: '',
            position: '',
          },
          pageInfo: {
            componentLoadTime: getPageLoadTime(),
          },
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

    case MODIFY_DEAL: {
      eventProps = merge(defaultProps, {
        interactionType: 'Link/ButtonClick',
        event: 'ModifyDeal',
        page: {
          eventInfo: {
            name: 'Modify Deal',
            component: 'Explore Widget',
            position: '',
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
    //  Errror Handling
  }
};
