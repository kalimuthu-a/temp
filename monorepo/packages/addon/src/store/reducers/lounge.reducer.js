import { addonActions } from '../addonActions';

export const defaultLoungeState = {
  selectedLounge: {},
  removedLounge: [],
  setGetLounge: {},
  setSellLounge: {},
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const loungeReducer = (state = defaultLoungeState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SELECTED_LOUNGE_ADDON_DATA:
      return {
        ...state,
        selectedLounge: payload,
      };
    case addonActions.REMOVED_LOUNGE_ADDON_DATA:
      return {
        ...state,
        removedLounge: payload,
      };
    case addonActions.SET_GET_LOUNGE_ADDON_DATA:
      return {
        ...state,
        setGetLounge: payload,
      };
    case addonActions.SET_SELL_LOUNGE_ADDON_DATA:
      return {
        ...state,
        setSellLounge: payload,
      };

    default:
      return state;
  }
};
