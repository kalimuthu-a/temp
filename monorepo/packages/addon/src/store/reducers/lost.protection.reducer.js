import { addonActions } from '../addonActions';

export const defaultLostProtectionState = {
  delayLostBaggageProtection: null,
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns
 */
export const lostProtectionReducer = (
  state = defaultLostProtectionState,
  action = {},
) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.UPDATE_DELAYED_LOST_BAGGAGE_ADDON: {
      return {
        ...state,
        ...payload,
      };
    }

    case addonActions.SET_DELAY_LOST_BAGGAGE_PROTECTION: {
      const {
        delayLostBaggageProtection,
        setGetSelectedAddon,
        sellAddonSsr,
        removedAddonSsr,
        excessBaggageData,
      } = payload;

      return {
        ...state,
        delayLostBaggageProtection,
        setGetSelectedAddon,
        sellAddonSsr,
        excessBaggageData,
        removedAddonSsr,
      };
    }

    default:
      return state;
  }
};
