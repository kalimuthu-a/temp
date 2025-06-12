import merge from 'lodash/merge';
import { FLIGHT_BOOKING, pageTypes } from '../constants/common';

const dogDataId = window.DD_RUM?.getInternalContext()?.session_id;

export const checkFlag = {
  viewBordingPassCount: 0,
  smartCheckinCount: 0,
  autoCheckinCount: 0,
  planBCount: 0,
};

export const eventNames = {
  BOOKING_PAGELOAD: 'pageload',
  CLICK: 'cta_click',
  SIMPLE_CLICK: 'click',
};

export const flightTypes = {
  ONEWAY: 'OneWay',
  ROUND: 'RoundTrip',
  MULTI: 'MutliCity',
};

export const analyticsTripCatLabel = (tripCat) => {
  switch (tripCat) {
    case FLIGHT_BOOKING.CURRENT:
      return 'Upcoming Bookings';

    case FLIGHT_BOOKING.COMPLETED:
      return 'Past Bookings';

    case FLIGHT_BOOKING.CANCELLED:
      return 'Cancelled Bookings';

    default:
      return 'Upcoming Bookings';
  }
};

export const aaEvents = {
  MY_BOOKINGS_PAGELOAD: 'Bookings/Pageload',
  BOOKING_CARD_BTN: 'MyBookings/BookingCardBtn',
  VIEW_BOARDING_PASS: 'MyBookings/ViewBoardingPass',
  AVAIL_PLAN_B: 'MyBookings/AvailPlanB',
  CHECK_STATUS: 'MyBookings/CheckStatus',
  NEED_HELP: 'MyBookings/NeedHelp',
  PAY_NOW: 'MyBookings/PayNow',
  MY_PROFILE_PAGELOAD: 'MyProfile/Pageload',
  MY_PROFILE_BTN_CLICK: 'MyProfile/SaveChanges',
  NOMINEE_PAGELOAD: 'Nominee/Pageload',
  NOMINEE_ADDED_INITIATED: 'Nominee/Nominee_Added_Initated',
  NOMINEE_ADDED: 'Nominee/Nominee_Added',
  REMOVE_NOMINEE_INITIATED: 'Nominee/Remove_Nominee_Initated',
  NOMINEE_CLICK: 'Nominee/Click',
  REMOVE_NOMINEE_POPUP: 'Nominee/Remove_Nominee_Popup',
  REMOVE_NOMINEE: 'Nominee/Remove_Nominee',
  REMOVE_NOMINEE_CANCEL: 'Nominee/Remove_Nominee_Cancel',
};

export const interactions = {
  PAGE_LOAD: 'pageload',
  Link_Button_Click: 'Link/Button Click',
  POP_UP: 'Pop Up shown',
  API_RESPONSE: 'API response',
  ERROR: 'Error',
  POPUP_SHOWN: 'Popup Shown',
};

export const nomineeCommonInfo = {
  commonInfo: {
    page: {
      pageInfo: {
        pageName: 'Nominee page',
        siteSection: 'Loyalty',
        journeyFlow: 'Loyalty',
      },
    },
  },
};

export const myBookingsCommonInfo = {
  commonInfo: {
    page: {
      pageInfo: {
        pageName: 'My Bookings',
        siteSection: 'User Profile Flow',
        language: 'en',
        journeyFlow: 'User Profile Flow',
        platform: window.innerWidth < 768 ? 'Mweb' : 'Web',
      },
      LOB: 'Flights',
    },
    user: {
      dataDogSessionID: dogDataId,
    },
  },
};

export const myProfileCommonInfo = {
  commonInfo: {
    page: {
      pageInfo: {
        pageName: 'My Profile',
        siteSection: 'My Profile Flow',
        journeyFlow: 'My Profile Flow',
      },
    },
    user: {
      dataDogSessionID: dogDataId,
    },
  },
};

/**
 *
 * @param {*} overrideObj object which will override only matched keys from default object
 * with lodash deep merge
 * @returns new common object
 */
export const commonInfoMerge = (overrideObj = {}) => {
  if (window.pageType === pageTypes.myBookings) {
    return merge({}, nomineeCommonInfo, myBookingsCommonInfo);
  }
  if (window.pageType === pageTypes.myProfile) {
    return merge({}, nomineeCommonInfo, myProfileCommonInfo);
  }
  return merge({}, nomineeCommonInfo, overrideObj);
};
