/* eslint-disable sonarjs/no-duplicate-string */
import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { getPageLoadTime } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';
import { ANALTYTICS, GTM_ANALTYTICS } from '../constants';

const { PAGE_NAME } = ANALTYTICS;

const getPlatform = () => (window.innerWidth <= 768 ? 'Mweb' : 'Web');

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
  const { event, data } = obj;

  let gtmProps = {
    line_of_business: 'Flight',
    site_section: 'WebCheckIn Page',
    booking_purpose: '',
    page_name: 'WebCheck In',
    journey_flow: 'WebCheckIn Flow',
    flight_type: 'Departing',
    coupon_code: '',
  };

  const {
    SEARCH_FLIGHT,
    RECENT_SEARCH,
    DANGEROUS_GOODS_AGREE_CONTINUE,
    DANGEROUS_GOODS_PAGE_LOAD,
    BOARDING_PASS_DOWNLOAD,
    BOARDING_PASS_EMAIL,
    WEB_CHECK_HOME_PAGE_LOAD,
    CHECK_IN_INITIATE,
  } = GTM_ANALTYTICS.EVENTS;

  switch (event) {
    case SEARCH_FLIGHT:
      gtmProps = { event, ...gtmProps, ...data };
      break;

    case RECENT_SEARCH: {
      gtmProps = { event, ...gtmProps, ...data };
      break;
    }

    case DANGEROUS_GOODS_AGREE_CONTINUE: {
      gtmProps = {
        event,
        ...gtmProps,
        ...data,
        page_name: PAGE_NAME.DANGEROUS_GOODS,
      };
      break;
    }

    case DANGEROUS_GOODS_PAGE_LOAD: {
      gtmProps = {
        event: 'pageload',
        ...gtmProps,
        ...data,
        page_name: PAGE_NAME.DANGEROUS_GOODS,
      };
      break;
    }

    case WEB_CHECK_HOME_PAGE_LOAD: {
      gtmProps = {
        ...gtmProps,
        page_load_time: getPageLoadTime(),
        platform: getPlatform(),
        previous_page: getPreviousPage(),
        ...data,
        page_name: 'Flight Status CheckIn',
      };
      break;
    }

    case CHECK_IN_INITIATE: {
      gtmProps = {
        event,
        ...gtmProps,
        platform: getPlatform(),
        checkin_initiate: '1',
        page_name: 'CheckIn Initiate',
        ...data,
      };
      break;
    }

    case BOARDING_PASS_EMAIL:
    case BOARDING_PASS_DOWNLOAD: {
      gtmProps = {
        ...gtmProps,
        ...data,
      };
      break;
    }

    case GTM_ANALTYTICS.EVENTS.CHECK_IN_COMPLETE: {
      gtmProps = {
        ...gtmProps,
        event: 'checkin_complete',
        page_name: 'Boarding Pass',
        previous_page: 'Web-Checkin',
        page_load_time: getPageLoadTime(),
        checkin_complete: '1',
        ...data,
      };
      break;
    }

    case GTM_ANALTYTICS.EVENTS.FLIGHT_STATUS_CHECKIN: {
      gtmProps = {
        event,
        addons_selected: '1',
        ...gtmProps,
        ...data,
        page_name: 'Flight Status CheckIn',
      };
      break;
    }

    case GTM_ANALTYTICS.EVENTS.FLIGHT_STATUS_CHECKIN_PAGE_LOAD: {
      gtmProps = {
        event: 'pageload',
        addons_selected: '1',
        ...gtmProps,
        ...data,
        page_name: 'Flight Status CheckIn',
      };
      break;
    }

    case GTM_ANALTYTICS.EVENTS.CHECKIN_ERROR: {
      gtmProps = {
        event,
        journey_flow: 'WebCheckIn Flow',
        page_name: 'CheckIn View',
        previous_page: 'CheckIn Initiate',
        Checkin_error: '1',
        ...gtmProps,
        ...data,
      };
      break;
    }

    case GTM_ANALTYTICS.EVENTS.AUTO_CHECKIN_COMPLETE: {
      gtmProps = {
        event,
        journey_flow: 'WebCheckIn Flow',
        page_name: 'Auto Checkin',
        previous_page: 'Web-Checkin',
        ...gtmProps,
        ...data,
      };
      break;
    }

    default:
  }

  gtmAnalytic({
    state: { pageType: '' },
    gtmProps,
  });
};
export default (obj) => {
  try {
    pushDataLayerFunc(obj);
  } catch (error) {
    // @todo
  }
};
