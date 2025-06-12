/**
 * @typedef {Object} CargoState
 * @property {Object} triptype - Information about the trip type.
 * @property {string} triptype.journeyTypeCode - Code for journey type.
 * @property {string} triptype.journeyTypeLabel - Label for journey type.
 * @property {Object} currency - Currency details.
 */

import { getCurrencySymbol } from '../../utils/functions';

/**
 * @typedef {Object} CargoAction
 * @property {string} type - Type of the action.
 * @property {Object} [payload] - Payload containing data for state update.
 */

/**
 * Action types for cargo form state management.
 * @enum {string}
 */
const cargoFormActions = {
  CHANGE_TRIP_TYPE: 'CHANGE_TRIP_TYPE',
  CHANGE_FORM_ITEM: 'CHANGE_FORM_ITEM',
  CHANGE_JOURNEY_ROW_ITEM: 'CHANGE_JOURNEY_ROW_ITEM',
  CHANGE_TRANSPORTED_BY: 'CHANGE_TRANSPORTED_BY',
  CHANGE_GOODSTYPE_BY: 'CHANGE_GOODSTYPE_BY',
  CHANGE_QUANTITY: 'CHANGE_QUANTITY',
};

/**
 * Reducer function for managing cargo form state.
 * @param {CargoState} state - The current state of the cargo form.
 * @param {CargoAction} action - The action dispatched to update the state.
 * @returns {CargoState} The updated state after applying the action.
 * @throws {Error} Throws an error for unknown action types or invalid payloads.
 */
// eslint-disable-next-line
const cargoReducer = (state, action) => {
  if (!action || typeof action !== 'object') {
    throw new Error('Invalid action object passed to cargoReducer');
  }

  const { type, payload } = action;

  switch (type) {
    case cargoFormActions.CHANGE_TRIP_TYPE:
      if (!payload?.journeyTypeCode || !payload?.journeyTypeLabel) {
        throw new Error('Invalid payload for CHANGE_TRIP_TYPE action');
      }
      return {
        ...state,
        triptype: {
          journeyTypeCode: payload.journeyTypeCode,
          journeyTypeLabel: payload.journeyTypeLabel,
          value: payload.journeyTypeCode,
          label: payload.journeyTypeLabel,
        },
      };

    case cargoFormActions.CHANGE_GOODSTYPE_BY:
      if (!payload?.goodsType) {
        throw new Error(`Invalid payload for ${type} action`);
      }
      return {
        ...state,
        goodsType: payload.goodsType,
      };

    case cargoFormActions.CHANGE_QUANTITY:
      if (!payload?.quantity) {
        throw new Error(`Invalid payload for ${type} action`);
      }
      return {
        ...state,
        quantity: payload.quantity,
      };

    case cargoFormActions.CHANGE_TRANSPORTED_BY:
      if (!payload?.transportedBy) {
        throw new Error(`Invalid payload for ${type} action`);
      }
      return {
        ...state,
        transportedBy: payload.transportedBy,
      };

    case cargoFormActions.CHANGE_FORM_ITEM:
      if (!payload?.currency) {
        throw new Error(`Invalid payload for ${type} action`);
      }
      return {
        ...state,
        currency: { ...payload.currency },
      };

    // case cargoFormActions.CHANGE_JOURNEY_ROW_ITEM:
    //   if (!payload?.journeys) {
    //     throw new Error(`Invalid payload for ${type} action`);
    //   }
    //   return {
    //     ...state,
    //     journeys: { ...state?.journeys, ...payload?.journeys },
    //   };

    case cargoFormActions.CHANGE_JOURNEY_ROW_ITEM: {
      const { objData } = payload;
      const { currency, journeys } = state;

      if (Reflect.has(objData, 'sourceCity')) {
        currency.currencyCode = objData.sourceCity.currencyCode;
        currency.currencySymbol = getCurrencySymbol(currency.currencyCode);
      }

      const updatedJournies = { ...journeys, ...objData };

      return {
        ...state,
        journeys: updatedJournies,
        currency,
      };
    }

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export { cargoReducer, cargoFormActions };
