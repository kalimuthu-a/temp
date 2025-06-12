export const LINK_BUTTON_CLICK = 'Link/ButtonClick';
export const OVERLAY_OPEN = 'Overlay Open';
export const MARKET_INTERNATIONAL = 'international';
export const MARKET_DOMESTIC = 'domestic';
export const COOKIE_BOOKING_PNR = 'bookingPNR';
export const EVENT_DELAY = 2000;
export const NOT_AVAILABLE = 'N/A';
export const SPLIT_PNR_EVENT = 'Split PNR';
export const FLOW_TYPE = {
  MODIFICATION_FLOW: 'Modification',
  BOOKING_FLOW: 'Booking',
};

export const TYPE = {
  api: 'business',
  network: 'network',
  validation: 'user',
};

export const JOURNEY_TYPE = {
  MULTI_CITY: 'multi_city',
  ONE_WAY: 'one_way',
  ROUND_TRIP: 'round_trip',
};

export const SOURCE = {
  api: 'MS-API',
  aem: 'AEM',
  mf: 'MF',
};

export const CLARITY_ID = {
  ID: '_clck',
};

export const AA_CONSTANTS = {
  NO_CODE: 'No Code',
  NO_STATUS_CODE: 'No Status Code',
  NO_DISPLAY_MESSAGE: 'No Message Displayed',
  NO_STATUS_MESSAGE: 'No Status Message',
  BE_ERROR: 'BE Error',
  MS_API: 'MS API',
  PAGE_LOAD: 'Page load',
  LINK_BUTTON_CLICK: 'Link/ButtonClick',
  POP_UP: 'Pop up',
  PAGE_NAME: 'ITINERARY',
};

export const getBookingChannel = (type) => {
  const bookingChannel = {
    0: 'Default',
    1: 'Direct',
    2: 'Web',
    3: 'Gds',
    4: 'Api',
    5: 'DigitalApi',
    6: 'DigitalWeb',
    7: 'Ndc',
  };
  return bookingChannel[type] ?? '';
};
