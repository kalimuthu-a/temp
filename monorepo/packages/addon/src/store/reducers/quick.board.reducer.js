import { addonActions } from '../addonActions';

export const defaultQuickBoardState = {
  setSellQuickBoard: {},
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const quickBoardReducer = (state = defaultQuickBoardState, action = {}) => {
  const { type, payload } = action;
  if (type === addonActions.SET_SELL_QUICKBOARD_ADDON_DATA) {
    return {
      ...state,
      setSellQuickBoard: payload,
    };
  }
  return state;
};
