export const profileActions = {
  SET_PROFILE_DATA: 'SET_PROFILE_DATA',
  SET_INITIAL_NAME: 'SET_INITIAL_NAME',
  SET_COUNTRY_LIST: 'SET_COUNTRY_LIST',
  SET_STATE_LIST: 'SET_STATE_LIST',
  SET_ORIGINAL_PROFILE_DATA: 'SET_ORIGINAL_PROFILE_DATA',
  SET_USER_TYPE: 'SET_USER_TYPE',
  SET_IS_OPENED: 'SET_IS_OPENED',
  SET_MY_PROFILE_AEM_DATA: 'SET_MY_PROFILE_AEM_DATA',
  SET_ERRORS: 'SET_ERRORS',
  SET_ERROR: 'SET_ERROR',
  SHOW_STATE_AND_NATIONALITY: 'SHOW_STATE_AND_NATIONALITY',
  SHOW_PASSPORT_DETAILS: 'SHOW_PASSPORT_DETAILS',
  SHOW_GST_DETAILS: 'SHOW_GST_DETAILS',
  SET_TOAST: 'SET_TOAST',
  ENABLE_BUTTON: 'ENABLE_BUTTON',
  DISABLE_BUTTON: 'DISABLE_BUTTON',
  SET_API_ERROR: 'SET_API_ERROR',
};

export const profileReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case profileActions.SET_PROFILE_DATA:
      return {
        ...state,
        profileData: payload,
      };

    case profileActions.SET_INITIAL_NAME: {
      return {
        ...state,
        initialName: {
          first: action.payload.first,
          last: action.payload.last,
          title: action.payload.title,
        },
      };
    }

    case profileActions.SET_COUNTRY_LIST:
      return {
        ...state,
        countryList: payload,
      };
    case profileActions.SET_STATE_LIST:
      return {
        ...state,
        stateList: payload,
      };

    case profileActions.SET_ORIGINAL_PROFILE_DATA:
      return {
        ...state,
        originalProfileData: payload,
      };

    case profileActions.SET_USER_TYPE:
      return {
        ...state,
        userType: payload,
      };

    case profileActions.SET_IS_OPENED:
      return {
        ...state,
        isOpened: payload,
      };

    case profileActions.SET_MY_PROFILE_AEM_DATA: {
      return {
        ...state,
        myProfileAemData: payload,
      };
    }
    case profileActions.SET_ERROR: {
      const errorObj = {...state.error, ...payload};
      const isErrorExist = Object.values(errorObj).some(
        (err) => err && err.trim() !== '',
      );
      return {
        ...state,
        error: errorObj,
        isButtonDisabled: isErrorExist,
      };
    }
    case profileActions.SET_ERRORS: {
      const updatedErrors = {
        ...state.error,
        [Object.keys(payload)[0]]: {
          ...state.error?.[Object.keys(payload)[0]],
          ...payload[Object.keys(payload)[0]],
        },
      };

      const isButtonDisabled = Object.values(updatedErrors).some(
        (fieldErrors) => Object.values(fieldErrors).some((err) => err && err.trim() !== ''),
      );

      return {
        ...state,
        error: updatedErrors,
        isButtonDisabled,
      };
    }

    case profileActions.SHOW_STATE_AND_NATIONALITY: {
      return {
        ...state,
        showStateAndNationality: payload,
      };
    }
    case profileActions.SHOW_PASSPORT_DETAILS: {
      return {
        ...state,
        showPassportDetails: payload,
      };
    }
    case profileActions.SHOW_GST_DETAILS: {
      return {
        ...state,
        showGSTDetails: payload,
      };
    }
    case profileActions.SET_TOAST: {
      return {
        ...state,
        toast: payload,
      };
    }
    case profileActions.ENABLE_BUTTON: {
      return {
        ...state,
        isButtonDisabled: false,
      };
    }
    case profileActions.DISABLE_BUTTON: {
      return {
        ...state,
        isButtonDisabled: true,
      };
    }

    case profileActions.SET_API_ERROR: {
      return {
        ...state,
        apiError: payload,
      };
    }

    default:
      return state;
  }
};
