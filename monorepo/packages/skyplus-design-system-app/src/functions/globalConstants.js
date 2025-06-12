import { personaConstant } from '../constants/analytics';

export const TripTypes = {
  ONE_WAY: 'oneWay',
  ROUND: 'roundTrip',
  MULTI_CITY: 'multiCity',
};

export const PayWithModes = {
  CASH: 'Cash',
  POINTS: 'IndiGo BluChips',
};

export const paxCodes = {
  adult: {
    code: 'ADT',
    discountCode: '',
  },
  seniorCitizen: {
    code: 'ADT',
    discountCode: 'SRCT',
  },
  children: {
    code: 'CHD',
    discountCode: '',
  },
  infant: {
    code: 'INFT',
    discountCode: '',
  },
};

export const specialFareCodes = {
  STU: 'STU',
  UMNR: 'UMNR',
  FNF: 'FNF',
  DFN: 'DFN',
  VAXI: 'VAXI',
};

export const LOYALTY_KEY = 'loyalty';

export const progressStepsKeys = {
  passengerDetails: 'pe',
  addon: 'addon',
  seatSelection: 'seat',
  payment: 'payment',
};

export const progressSteps = [
  progressStepsKeys.passengerDetails,
  progressStepsKeys.addon,
  progressStepsKeys.seatSelection,
  progressStepsKeys.payment,
];

export const Pages = {
  HOMEPAGE: 'homepage',
  SRP: 'srp',
  PASSENGER_EDIT: 'passenger-edit',
  SRP_MODIFICATION: 'srp-modification',
  FLIGHT_SELECT_MODIFICATION: 'flight-select-modification',
  CHECK_IN_MASTER: 'checkinmaster',
  WEB_CHECK_IN: 'web-check-in',
  CHECK_IN_DANGEROUS_GOOD: 'checkindangerousgood',
  CHECK_IN_PASSPORT_VISA: 'checkinpassportvisa',
  CHECK_IN_BOARDING_PASS: 'checkinboardingpass',
  CHECK_IN_SUCCESS: 'checkin-success',
  CHECK_IN_ERROR: 'checkin-error',
  PASSENGER_EDIT_MODIFICATION: 'passenger-edit-modification',
  SEAT_SELECT_MODIFICATION: 'seat-selection-modification',
  ADDON_MODIFICATION: 'add-on-modification',
  XPLORE: 'xplore',
  UNDO_WEB_CHECKIN: 'checkinundo',
  CARGO_HOME: 'cargo-homepage',
};

export const a11y = {
  keyCode: {
    enter: 13,
    space: 32,
    end: 35,
    home: 36,
    arrowLeft: 37,
    arrowUp: 38,
    arrowRight: 39,
    arrowDown: 40,
    delete: 46,
    escape: 27,
    tab: 9,
  },
  key: {
    enter: 'Enter',
    space: 'Space',
    tab: 'Tab',
    arrowleft: 'ArrowLeft',
    arrowright: 'ArrowRight',
  },
};

export { personaConstant };
