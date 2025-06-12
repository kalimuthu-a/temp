import { addonActions } from '../addonActions';

export const defaultBarState = {
  selectedBar: {},
  removedBar: [],
  setGetBar: {},
  setSellBar: {},
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const barReducer = (state = defaultBarState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SELECTED_BAR_ADDON_DATA:
      return {
        ...state,
        selectedBar: payload,
      };
    case addonActions.REMOVED_BAR_ADDON_DATA:
      return {
        ...state,
        removedBar: payload,
      };

    case addonActions.SET_GET_BAR_ADDON_DATA:
      return {
        ...state,
        setGetBar: payload,
      };
    case addonActions.SET_SELL_BAR_ADDON_DATA:
      return {
        ...state,
        setSellBar: payload,
      };

    default:
      return state;
  }
};
