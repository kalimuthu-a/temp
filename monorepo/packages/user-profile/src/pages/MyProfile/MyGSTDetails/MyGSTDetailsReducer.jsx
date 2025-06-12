export const myGSTDetailsReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case myGSTDetailsActions.SET_PROFILE_DATA:
      return {
        ...state,
        profileData: payload,
      };

    case myGSTDetailsActions.SET_ORIGINAL_PROFILE_DATA:
      return {
        ...state,
        originalProfileData: payload,
      };

    case myGSTDetailsActions.SET_USER_TYPE:
      return {
        ...state,
        userType: payload,
      };

    case myGSTDetailsActions.SET_IS_OPENED_SIDEBAR:
      return {
        ...state,
        isOpenedSidebar: payload,
      };

    case myGSTDetailsActions.SET_IS_OPENED_EDIT_SIDEBAR:
      return {
        ...state,
        isOpenedEditSidebar: payload,
      };

    case myGSTDetailsActions.SET_SELECTED_CARD:
      return {
        ...state,
        selectedCard: payload,
      };

    case myGSTDetailsActions.SET_IS_OPENED_REMOVE_GST_MODAL:
      return {
        ...state,
        isRemoveGSTModalOpened: payload,
      };

    case myGSTDetailsActions.SET_MY_GST_DETAILS_AEM_DATA:
      return {
        ...state,
        myGSTDetailsAemData: payload,
      };

    case myGSTDetailsActions.SET_ERRORS: {
      return {
        ...state,
        error: {
          ...state.error,
          ...payload,
        },
        isButtonDisabled: Object.values(action.payload).some(
          (err) => err && err.trim() !== '',
        ),
      };
    }

    case myGSTDetailsActions.SET_MODE: {
      return {
        ...state,
        mode: payload,
      };
    }

    case myGSTDetailsActions.SET_FORM_STATE: {
      return {
        ...state,
        formData: payload,
      };
    }

    case myGSTDetailsActions.SET_TOAST: {
      return {
        ...state,
        toast: payload,
      };
    }

    default:
      return state;
  }
};

export const myGSTDetailsActions = {
  SET_PROFILE_DATA: 'SET_PROFILE_DATA',
  SET_ORIGINAL_PROFILE_DATA: 'SET_ORIGINAL_PROFILE_DATA',
  SET_MY_GST_DETAILS_AEM_DATA: 'SET_MY_GST_DETAILS_AEM_DATA',
  SET_IS_OPENED_SIDEBAR: 'SET_IS_OPENED_SIDEBAR',
  SET_IS_OPENED_EDIT_SIDEBAR: 'SET_IS_OPENED_EDIT_SIDEBAR',
  SET_SELECTED_CARD: 'SET_SELECTED_CARD',
  SET_IS_OPENED_REMOVE_GST_MODAL: 'SET_IS_OPENED_REMOVE_GST_MODAL',
  SET_ERRORS: 'SET_ERRORS',
  SET_MODE: 'SET_MODE',
  SET_FORM_STATE: 'SET_FORM_STATE',
  SET_TOAST: 'SET_TOAST',
};
