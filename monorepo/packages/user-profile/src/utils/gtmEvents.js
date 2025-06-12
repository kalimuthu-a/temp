import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';

import { GTM_ANALTYTICS } from '../constants';

const pushDataLayerFunc = ({ ...obj }) => {
  const { event, data } = obj;

  let gtmProps = {
    page_name: 'Homepage',
    search_flight: '1',
    site_section: 'Booking Page',
    line_of_business: 'Flight',
    platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
  };

  const { ERROR, API_RESPONSE } = GTM_ANALTYTICS.EVENTS;

  switch (event) {
    case ERROR: {
      gtmProps = {
        event,
        ...gtmProps,
        ...data,
      };
      break;
    }

    case API_RESPONSE: {
      gtmProps = { event, ...gtmProps, ...data };
      break;
    }
    default:
  }

  gtmAnalytic({
    state: { pageType: 'Flight Select' },
    gtmProps,
  });
};
export default (obj) => {
  try {
    pushDataLayerFunc(obj);
  } catch (error) {
    // Error
  }
};
