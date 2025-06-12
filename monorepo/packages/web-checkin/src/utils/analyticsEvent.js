import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import merge from 'lodash/merge';
import { ANALTYTICS } from '../constants';

const { INTERACTION, TRIGGER_EVENTS, PAGE_NAME, EVENTS, DATA_CAPTURE_EVENTS } =
  ANALTYTICS;

const getPageName = () => {
  const { pageType } = window;

  switch (pageType) {
    case 'web-check-in':
      return PAGE_NAME.WEB_CHECK_IN;

    case 'checkinmaster':
      return PAGE_NAME.WEB_CHECK_IN_HOME;

    case 'checkindangerousgood':
      return PAGE_NAME.DANGEROUS_GOODS;

    case 'checkinboardingpass':
      return PAGE_NAME.BOARDING_PASS;

    case 'checkinundo':
      return PAGE_NAME.UNDO_CHECKIN;

    default:
      return '';
  }
};

const pushAnalyticWrapper = ({ ...obj }) => {
  const {
    event = '',
    data: {
      productInfo = {},
      user = {},
      bookingChannel,
      apiresponse = {},
      errorObj = {},
      hotelListResponse = {},
    },
  } = obj;

  let eventProps = {};

  const defaultProps = {
    page: {
      pageInfo: {
        pageName: '',
        journeyFlow: 'Check-in Flow',
        siteSection: 'Check-in Flow',
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
      },
      eventInfo: {
        component: '',
      },
      LOB: 'Flight',
    },
    product: {
      productInfo,
    },
  };

  switch (event) {
    case TRIGGER_EVENTS.WEB_CHECK_HOME_PAGE_LOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.PAGELOAD,
        event: EVENTS.PAGELOAD,
        bookingChannel,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_VIEW,
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEB_CHECK_HOME_CHECK_IN_CLICKED: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CHECKIN_START,
        bookingChannel,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_HOME,
          },
          eventInfo: {
            name: 'Check-in',
            position: '',
            component: '',
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEB_CHECK_HOME_SCHEDULE_CHECK_IN_CLICKED: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CHECKIN_START,
        bookingChannel,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_HOME,
          },
          eventInfo: {
            name: 'Schedule Web Check-In',
            position: '',
            component: '',
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEB_CHECK_HOME_VIEW_BOARDING_PASS_CLICKED: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        bookingChannel,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_HOME,
          },
          eventInfo: {
            name: 'View Boarding Pass',
            position: '',
            component: '',
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case TRIGGER_EVENTS.DANGEROUS_GOODS_PAGELOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.PAGELOAD,
        event: EVENTS.PAGELOAD,
        bookingChannel,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.DANGEROUS_GOODS,
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEB_CHECK_HOME_VIEW_UNDO_CHECKIN_CLICKED: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: 'UndoCheck-in',
        bookingChannel,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_HOME,
          },
          eventInfo: {
            name: 'Undo Check-in',
            position: '',
            component: '',
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEB_CHECK_HOME_VIEW_SEAT_SELECT_CLICKED: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        bookingChannel,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_HOME,
          },
          eventInfo: {
            name: 'Seat Select',
            position: '',
            component: 'Auto checked-in',
          },
        },
        product: {
          productInfo,
        },
      });
      break;
    }

    case TRIGGER_EVENTS.BOARDING_PASS_GOTO_WEBCHECKIN: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.BOARDING_PASS,
          },
          eventInfo: {
            name: 'Go to web check-in',
            position: '',
            component: '',
          },
        },
      });
      break;
    }

    case TRIGGER_EVENTS.BOARDING_PASS_EMAIL: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.BOARDING_PASS,
          },
          eventInfo: {
            name: 'Email All',
            position: '',
            component: 'Boarding Pass',
            emailBoardingPass: '1',
          },
        },
      });
      break;
    }

    case TRIGGER_EVENTS.BOARDING_PASS_DOWNLOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.BOARDING_PASS,
          },
          eventInfo: {
            name: 'Download All',
            position: '',
            component: 'Boarding Pass',
            downloadBoardingPass: '1',
          },
        },
      });
      break;
    }

    case TRIGGER_EVENTS.BOARDING_PASS_PAGE_LOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.PAGELOAD,
        event: 'BoardingPass',
        page: {
          pageInfo: {
            pageName: PAGE_NAME.BOARDING_PASS,
          },
        },
        product: {
          productInfo,
        },
        user,
        bookingChannel,
      });
      break;
    }

    case TRIGGER_EVENTS.AUTO_CHECK_SUCCESS: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: 'auto_checkIN',
        page: {
          pageInfo: {
            pageName: 'Auto Checkin',
          },
        },
        product: {
          productInfo,
        },
        user,
      });
      break;
    }

    case TRIGGER_EVENTS.DANGEROUS_GOODS_AGREE_CONTINUE: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.DANGEROUS_GOODS,
          },
          eventInfo: {
            name: 'Next',
            position: 'Agree & Continue',
            component: 'Dangerous Goods',
          },
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEBCHECKIN_FLIGHT_DETAILS_NEXT: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        event: EVENTS.CLICK,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_FLIGHT_DETAILS,
          },
          eventInfo: {
            name: 'Next',
            position: '',
            component: '',
          },
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEB_CHECKIN_PAX_DETAILS_LOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.PAGELOAD,
        event: EVENTS.PAGELOAD,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_FLIGHT_DETAILS,
          },
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEB_CHECKIN_PAX_DETAILS_NEXT: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.PAGELOAD,
        event: EVENTS.CLICK,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_FLIGHT_DETAILS,
          },
          eventInfo: {
            name: 'Next',
          },
        },
      });
      break;
    }

    case TRIGGER_EVENTS.WEBCHECKIN_FLIGHT_DETAILS_LOAD: {
      eventProps = merge(defaultProps, {
        interactionType: INTERACTION.PAGELOAD,
        page: {
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_FLIGHT_DETAILS,
          },
        },
        event: EVENTS.PAGELOAD,
      });
      break;
    }

    case DATA_CAPTURE_EVENTS.ERROR: {
      eventProps = merge(defaultProps, {
        interactionType: 'Error',
        event: 'UXError',
        page: {
          error: errorObj,
          pageInfo: {
            pageName: getPageName(),
          },
        },
      });
      break;
    }

    case DATA_CAPTURE_EVENTS.API_RESPONSE: {
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
          pageInfo: {
            pageName: PAGE_NAME.WEB_CHECK_IN_FLIGHT_DETAILS,
          },
        },
      });
      break;
    }

    case DATA_CAPTURE_EVENTS.HOTEL_STRIP_CARD:
      eventProps = {
        event: DATA_CAPTURE_EVENTS.HOTEL_STRIP_CARD,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        page: {
          eventInfo: hotelListResponse?.page?.eventInfo,
          pageInfo: {
            ...hotelListResponse?.page?.pageInfo,
            platform: defaultProps.page.pageInfo.platform,
          },
        },
        product: hotelListResponse?.product,
      };
      break;

    case DATA_CAPTURE_EVENTS.HOTEL_STRIP_SEEMORE:
      eventProps = {
        event: DATA_CAPTURE_EVENTS.HOTEL_STRIP_SEEMORE,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,
        page: {
          eventInfo: hotelListResponse?.page?.eventInfo,
          pageInfo: {
            ...hotelListResponse?.page?.pageInfo,
            platform: defaultProps.page.pageInfo.platform,
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

export default (obj) => {
  try {
    pushAnalyticWrapper(obj);
  } catch (error) {
    //  Errror Handling
  }
};
