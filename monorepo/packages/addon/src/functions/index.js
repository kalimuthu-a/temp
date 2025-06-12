import { CONSTANTS } from '../constants';
import {
  flightSrrAddon,
  sellSSRs,
  passengerPost,
} from '../services/api.service';

/**
 *
 * @param {import("../../types").PassengerDetails} passenger
 * @returns {string}
 */
const getPassengerName = (passenger) => {
  const { first = '', middle = '', last = '' } = passenger.name ?? { name: {} };
  return [first, middle, last].filter(Boolean).join(' ');
};

export const createEventForAddonModification = (
  ssrsToAdd = [],
  ssrsToRemove = [],
) => {
  const event = new CustomEvent(
    CONSTANTS.EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER_MODIFICATION,
    {
      detail: {
        data: [...ssrsToRemove, ...ssrsToAdd],
      },
    },
  );

  document.dispatchEvent(event);
};

export { flightSrrAddon, sellSSRs, passengerPost, getPassengerName };
