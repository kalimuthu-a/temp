import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { getPageLoadTime } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';
import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import omit from 'lodash/omit';
import { GTM_ANALTYTICS, CLARITY_ID } from '../constants';

export const getPathFromUrl = (url) => {
  return url?.split(/[?#]/)[0] || 'N/A';
};

const getPreviousPage = () => {
  let previousUrls = [];
  try {
    previousUrls = JSON.parse(sessionStorage.getItem('prevUrls'));
  } catch (error) {
    // Error Handling
  }

  let url = 'N/A';
  if (document.referrer.length > 0) {
    url = document.referrer;
  } else if (previousUrls) {
    const length = previousUrls?.length;
    if (length >= 2) {
      url = getPathFromUrl(previousUrls[length - 2]);
    }
  }

  if (url === '/book/itinerary.html') {
    return 'Flight Booking Itinerary';
  }

  if (url === '/book/passenger-edit.html') {
    return 'Passenger Details';
  }

  if (url === '/') {
    return 'Homepage';
  }

  return 'N/A';
};

const pushDataLayerFunc = ({ ...obj }) => {
  const { pageType } = window;

  const { event, data } = obj;
  const clarityId = Cookies.get(CLARITY_ID.ID);

  let gtmProps = {
    line_of_business: 'Flight',
    clarity_id: clarityId,
    ...(pageType === Pages.FLIGHT_SELECT_MODIFICATION && {
      has_modifications: 'Yes',
    }),
  };

  const {
    PAGE_LOAD,
    VIEW_ITEM_LIST,
    ERROR,
    API_RESPONSE,
    ADD_TO_CART,
    SELECT_FLIGHT,
    NO_FLIGHTS_FOUND,
  } = GTM_ANALTYTICS.EVENTS;

  switch (event) {
    case PAGE_LOAD:
      gtmProps = omit(
        {
          page_load_time: getPageLoadTime(),
          platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
          previous_page: getPreviousPage(),
          ...gtmProps,
          ...data,
        },
        ['flight_list'],
      );
      break;

    case VIEW_ITEM_LIST: {
      gtmProps = omit(
        {
          event,
          ...gtmProps,
          ...data,
        },
        [
          'days_until_departure',
          'flight_sector',
          'flight_type',
          'OD',
          'platform',
          'previous_page',
          'flight_list',
        ],
      );
      break;
    }

    case SELECT_FLIGHT: {
      gtmProps = omit(
        {
          event,
          ...gtmProps,
          ...data,
        },
        ['site_section', 'clarity_id'],
      );
      break;
    }

    case ERROR: {
      gtmProps = {
        event,
        ...gtmProps,
        ...data,
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
        previous_page: getPreviousPage(),
      };
      break;
    }

    case ADD_TO_CART: {
      gtmProps = omit(
        {
          event,
          ...gtmProps,
          ...data,
        },
        [
          'site_section',
          'OD',
          'line_of_business',
          'clarity_id',
          'coupon_code',
          'currency_code',
          'flight_list',
          'flight_type',
        ],
      );

      break;
    }

    case API_RESPONSE: {
      gtmProps = {
        event,
        ...gtmProps,
        ...data,
        previous_page: getPreviousPage(),
      };
      break;
    }

    case NO_FLIGHTS_FOUND:
      gtmProps = omit(
        {
          event: NO_FLIGHTS_FOUND,
          noFlightFound: '1',
          previous_page: getPreviousPage(),
          platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
          ...gtmProps,
          ...data,
        },
        ['line_of_business'],
      );
      break;
    default:
  }

  gtmAnalytic({
    state: { pageType: 'Flight Select' },
    gtmProps: {
      ...gtmProps,
    },
  });
};
export default (obj) => {
  try {
    pushDataLayerFunc(obj);
  } catch (error) {
    // handling
  }
};
