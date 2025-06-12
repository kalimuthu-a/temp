export const SEAT_AVAILABILITY = {
  Unknown: 0,
  Reserved: 1,
  Blocked: 2,
  HeldForAnotherSession: 3,
  HeldForThisSession: 4,
  Open: 5,
  Missing: 6,
  CheckedIn: 7,
  FleetBlocked: 8,
  Restricted: 9,
  Broken: 10,
  ReservedForPnr: 11,
  SoftBlocked: 12,
  Unavailable: 13,
};

export const SEAT_TYPE = {
  STRING_TRUE: 'true',
  SEATTYPE_WING: 'wing',
  EXTRASEATTAG_DOUBLE: 'DOUBLE',
  EXTRASEATTAG_TRIPLE: 'TRIPLE',
  SEATTYPE_MIDDLE: 'middle',
  SEATTYPE_AISLE: 'aisle',
  SEATTYPE_WINDOW: 'window',
  SEATTYPE_NWINDOW: 'nwindow',
  STRING_FALSE: 'false',
  SEATTYPE_EXITROW: 'exitrow',
  SEATTYPE_LEGROOM: 'legroom',
  SEATTYPE_RECLINE: 'recline',
  SEATTYPE_NON_RECLINE: 'non-recline',
  SEATTYPE_CHILD: 'child',
  SEATTYPE_INFANT: 'infant',
  SEATTYPE_BASSINET: 'bassinet',

  FLIGHT_TYPE: {
    CONNECT: 'Connect',
  },
  EXTRASEATTAG: ['EXTRASEAT', 'EXTRASEAT2'],
};

export const DISCOUNT_CODE = {
  DOUBLE: 'EXT',
  TRIPLE: 'EXT2',
};

export const SEAT_HEIGHT = 2;
export const SEAT_WIDTH = 1.5;
export const SEAT_SPACE_PROPORTION = 0.8;
export const NEXT_SEAT_SPACE_PROPORTION_LEFT = 0.65;
export const NEXT_SEAT_SPACE_PROPORTION_BOTTOM = 0.80;
export const WING_HEIGHT = 30;
export const NEXT_SEATING_SPACE = 2.5;
export const NEXT_COMPARTMENT_DESIGNATOR = 'C';
export const NEXT_EXIT_GATE_COMPENSATOR = 13.43;
export const ECHO_COMPARTMENT_DESIGNATOR = 'Y';
export const NEXT_LEGEND_ARRAY = ['assigned', 'occupied'];
