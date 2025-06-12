import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';

import BookingFlow from './BookingFlow';
import ChangeFlow from './ChangeFlow';
import PlanB from './PlanB';

const SearchPayloadFactory = {
  /**
   *
   * @param {string} pageType
   * @param {any} searchContext
   * @returns
   */
  createpayload: (pageType) => {
    switch (pageType) {
      case Pages.SRP:
        return new BookingFlow();

      case Pages.FLIGHT_SELECT_MODIFICATION:
        return new ChangeFlow();

      case Pages.PLAN_B:
        return new PlanB();

      default:
        return new BookingFlow();
    }
  },
};

export default SearchPayloadFactory;
