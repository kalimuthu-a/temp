import { addonActions } from '../addonActions';

/**
 * @typedef {{travelAssistanceAdded: boolean,  cancellationAdded?: *}} DefaultState
 *
 * @type {DefaultState}
 */
export const defaultTravelAssistanceState = {
  travelAssistanceAdded: false,
};

/**
 * @param {DefaultState} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const travelAssistanceReducer = (
  state = defaultTravelAssistanceState,
  action = {},
) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SET_TRAVEL_ASSISTANCE_ADDON: {
      return {
        ...state,
        ...payload,
        // Old Code:
        // isPassengerPostRequired: payload.travelAssistanceAdded || state.cancellationAdded,
      };
    }

    case addonActions.UNMOUNT_TRAVEL_ASSISTANCE_ADDON: {
      return { ...state, travelAssistanceAdded: false };
    }

    default:
      return state;
  }
};
