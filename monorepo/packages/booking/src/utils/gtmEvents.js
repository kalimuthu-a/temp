import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';

import { COOKIE_KEYS, GTM_ANALTYTICS } from '../constants';

const pushDataLayerFunc = ({ ...obj }) => {
  const { event, data } = obj;

  let gtmProps = {
    page_name: 'Homepage',
    search_flight: '1',
    site_section: 'Booking Page',
    line_of_business: 'Flight',
  };

  const {
    SEARCH_FLIGHT,
    RECENT_SEARCH,
    MODIFY_SEARCH,
    BOOK_A_FLIGHT_CLICK,
    BOOK_A_STAY_CLICK,
    ERROR,
    API_RESPONSE,
  } = GTM_ANALTYTICS.EVENTS;

  switch (event) {
    case SEARCH_FLIGHT:
      gtmProps = { event, ...gtmProps, ...data };
      break;

    case RECENT_SEARCH: {
      gtmProps = { event, ...gtmProps, ...data };
      break;
    }

    case BOOK_A_FLIGHT_CLICK:
      gtmProps = {
        event: 'link_click ',
        click_text: 'Book a Flight',
        site_section: 'Destination',
        ...gtmProps,
        ...data,
      };
      break;

    case BOOK_A_STAY_CLICK: {
      gtmProps = {
        event: 'link_click ',
        click_text: 'Book a Stay',
        site_section: 'Destination',
        ...gtmProps,
        ...data,
      };
      break;
    }

    case MODIFY_SEARCH: {
      gtmProps = {
        event,
        ...gtmProps,
        ...data,
        ...{
          page_name: 'Flight Select',
          site_section: 'Booking Page',
        },
      };
      break;
    }

    case ERROR: {
      gtmProps = {
        event,
        ...gtmProps,
        ...data,
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
      };
      break;
    }

    case API_RESPONSE: {
      gtmProps = { event, ...gtmProps, ...data };
      break;
    }
    default:
  }

  let authUser;
  try {
    authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
  } catch (e) {
    authUser = Cookies.get(COOKIE_KEYS.USER);
  }
  const personasType = Cookies.get(COOKIE_KEYS.ROLE_DETAILS, true);

  gtmAnalytic({
    state: { pageType: 'Flight Select' },
    gtmProps: {
      ...gtmProps,
      user_type: personasType?.roleName || '',
      user_role_code: personasType?.roleCode || '',
      user_id: authUser?.customerNumber || '',
    },
  });
};
export default (obj) => {
  try {
    pushDataLayerFunc(obj);
  } catch (error) {
    // Error
  }
};
