import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import get from 'lodash/get';

const { CHECK_IN_PASSPORT_VISA, CHECK_IN_BOARDING_PASS } = Pages;

class AnalyticContext {
  pageMap = {
    [CHECK_IN_PASSPORT_VISA]: 'International Passenger Details',
    [CHECK_IN_BOARDING_PASS]: 'Boarding Pass',
  };

  constructor(page) {
    this.pageName = get(this.pageMap, page, 'Check In');
  }

  getAdobeAnalytic() {
    return {
      pageInfo: {
        pageName: this.pageName,
      },
    };
  }
}

export default AnalyticContext;
