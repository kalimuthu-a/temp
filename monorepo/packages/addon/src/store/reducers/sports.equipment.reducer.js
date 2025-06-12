import { addonActions } from '../addonActions';

export const defaultSportsEquipmentState = {
  selectedSportsEquipment: {},
  removedSportsEquipment: [],
  setGetSportsEquipment: {},
  setSellSportsEquipment: {},
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
export const sportsEquipmentReducer = (
  state = defaultSportsEquipmentState,
  action = {},
) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA:
      return {
        ...state,
        selectedSportsEquipment: payload,
      };
    case addonActions.REMOVED_SPORTSEQUIPMENT_ADDON_DATA:
      return {
        ...state,
        removedSportsEquipment: payload,
      };
    case addonActions.SET_GET_SPORTSEQUIPMENT_ADDON_DATA:
      return {
        ...state,
        setGetSportsEquipment: payload,
      };
    case addonActions.SET_SELL_SPORTSEQUIPMENT_ADDON_DATA:
      return {
        ...state,
        setSellSportsEquipment: payload,
      };

    default:
      return state;
  }
};
