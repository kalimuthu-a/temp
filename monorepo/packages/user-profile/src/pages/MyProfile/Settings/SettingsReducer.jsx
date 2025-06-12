export const settingsReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case settingsActions.TOGGLE_POPUP:
      return {
        ...state,
        showPopup: payload,
      };

    case settingsActions.SET_SETTINGS_AEM_DATA:
      return {
        ...state,
        settingsAemData: payload,
      };

    case settingsActions.SET_USER_TYPE:
      return {
        ...state,
        userType: payload,
      };

    default:
      return state;
  }
};

export const settingsActions = {
  TOGGLE_POPUP: 'TOGGLE_POPUP',
  SET_SETTINGS_AEM_DATA: 'SET_SETTINGS_AEM_DATA',
  SET_USER_TYPE: 'SET_USER_TYPE',
};
