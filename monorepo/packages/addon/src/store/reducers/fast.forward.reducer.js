import { addonActions } from '../addonActions';

export const defaultFastForwardState = {
  setGetFastForward: {},
  setSellFastForward: {},
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const fastForwardReducer = (state = defaultFastForwardState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SET_GET_FAST_FORWARD_SELECTED:
      return {
        ...state,
        setGetFastForward: payload,
      };
    case addonActions.SET_SELL_FAST_FORWARD:
      return {
        ...state,
        setSellFastForward: payload,
      };

    default:
      return state;
  }
};
