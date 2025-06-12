import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import merge from 'lodash/merge';

/**
 *
 * @param {{interactionType: string, event: string, data: any}} param0
 */
const pushAnalyticWrapper = ({ ...obj }) => {
  const {
    data: { productInfo = {}, pageInfo = {}, eventInfo = {} },
    interactionType,
    event,
  } = obj;

  let eventProps = {};

  const defaultProps = {
    page: {
      pageInfo: {
        pageName: '',
        journeyFlow: 'Check-in Flow',
        siteSection: 'Check-in Flow',
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
        ...pageInfo,
      },
      eventInfo: {
        component: '',
        ...eventInfo,
      },
      LOB: 'Flight',
    },
    product: {
      ...productInfo,
    },
    bookingChannel: window.innerWidth <= 768 ? 'Mweb' : 'Web',
  };

  eventProps = merge(defaultProps, {
    interactionType,
    event,
  });

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
