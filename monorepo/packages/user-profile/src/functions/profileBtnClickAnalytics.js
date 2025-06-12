import analyticEvents from '../utils/analyticEvents';
import { aaEvents, eventNames } from '../utils/analyticsConstants';

const profileBtnClickAnalytics = (btnLabel, component, position = '') => {
  analyticEvents({
    event: aaEvents.MY_PROFILE_BTN_CLICK,
    data: {
      _event: eventNames.SIMPLE_CLICK,
      eventInfo: {
        name: btnLabel,
        position,
        component,
      },
    },

  });
};

export default profileBtnClickAnalytics;
