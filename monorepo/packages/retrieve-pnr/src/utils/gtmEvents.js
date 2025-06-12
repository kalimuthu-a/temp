import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { GTM_ANALTYTICS } from '../constants/analytic';

const getPlatform = () => (window.innerWidth <= 768 ? 'Mweb' : 'Web');

const pushDataLayerFunc = ({ ...obj }) => {
  const { event, data } = obj;

  let gtmProps = {
    line_of_business: 'Flight',
    site_section: 'WebCheckIn Page',
    page_name: 'WebCheck In',
    journey_flow: 'WebCheckIn Flow',
    platform: getPlatform(),
  };

  const { SEARCH_FLIGHT, GET_STARTED, CHECKIN_ERROR } = GTM_ANALTYTICS.EVENTS;

  switch (event) {
    case SEARCH_FLIGHT:
      gtmProps = { event, ...gtmProps, ...data };
      break;

    case GET_STARTED: {
      gtmProps = {
        event,
        page_name: 'CheckIn Initiate',
        get_started: '1',
        journey_flow: 'Web Check-In Flow',
        booking_purpose: '',
        coupon_code: '',
        flight_type: 'Departing',

        ...gtmProps,
        ...data,
      };
      break;
    }

    case CHECKIN_ERROR: {
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
