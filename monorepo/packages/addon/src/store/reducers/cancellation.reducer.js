import { addonActions } from '../addonActions';

/**
 * @typedef {{cancellationAdded: boolean, travelAssistanceAdded?: *, isPassengerPostRequired?: boolean }} DefaultState
 *
 * @type {DefaultState}
 */
export const defaultCancellationState = {
  cancellationAdded: false,
};

/**
 * @param {DefaultState} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const cancellationReducer = (
  state = defaultCancellationState,
  action = {},
) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SET_CANCELLATION_ADDON: {
      return {
        ...state,
        ...payload,
        // Old Code:
        // isPassengerPostRequired: payload.cancellationAdded || state.travelAssistanceAdded,
        isPassengerPostRequired: payload.cancellationAdded,
      };
    }

    case addonActions.UNMOUNT_ADDONCONTAINER: {
      return { ...state, cancellationAdded: false };
    }

    default:
      return state;
  }
};
