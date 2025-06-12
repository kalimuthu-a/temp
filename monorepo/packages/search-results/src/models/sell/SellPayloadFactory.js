import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';

import BookingFlow from './BookingFlow';
import ChangeFlow from './ChangeFlow';
import PlanB from './PlanB';

const SellPayloadFactory = {
  /**
   *
   * @param {string} pageType
   * @param {any} searchContext
   * @returns
   */
  createpayload: (pageType, searchContext, selectedFares, sliderSelectedValues, isRedeemTransaction) => {
    switch (pageType) {
      case Pages.SRP:
        return new BookingFlow(searchContext, selectedFares, sliderSelectedValues);

      case Pages.FLIGHT_SELECT_MODIFICATION:
        return new ChangeFlow(searchContext, selectedFares, sliderSelectedValues, isRedeemTransaction);

      case Pages.PLAN_B:
        return new PlanB(searchContext, selectedFares);

      default:
        return new BookingFlow();
    }
  },
};

export default SellPayloadFactory;
