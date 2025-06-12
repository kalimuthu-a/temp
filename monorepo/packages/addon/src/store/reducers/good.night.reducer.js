import { addonActions } from '../addonActions';

export const defaultGoodNightState = {
  selectedGoodNight: {},
  removedGoodNight: [],
  setGetGoodNight: {},
  setSellGoodNight: {},
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const goodNightReducer = (state = defaultGoodNightState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SELECTED_GOODNIGHT_ADDON_DATA:
      return {
        ...state,
        selectedGoodNight: payload,
      };
    case addonActions.REMOVED_GOODNIGHT_ADDON_DATA:
      return {
        ...state,
        removedGoodNight: payload,
      };
    case addonActions.SET_GET_GOODNIGHT_ADDON_DATA:
      return {
        ...state,
        setGetGoodNight: payload,
      };
    case addonActions.SET_SELL_GOODNIGHT_ADDON_DATA:
      return {
        ...state,
        setSellGoodNight: payload,
      };

    default:
      return state;
  }
};
