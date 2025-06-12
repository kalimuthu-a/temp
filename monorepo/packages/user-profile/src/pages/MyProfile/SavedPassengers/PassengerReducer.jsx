export const passengerActions = {
  SET_PROFILE_DATA: 'SET_PROFILE_DATA',
  SET_COUNTRY_LIST: 'SET_COUNTRY_LIST',
  SET_ORIGINAL_PROFILE_DATA: 'SET_ORIGINAL_PROFILE_DATA',
  SET_USER_TYPE: 'SET_USER_TYPE',
  SET_IS_OPENED: 'SET_IS_OPENED',
  SET_IS_OPENED_SIDEBAR: 'SET_IS_OPENED_SIDEBAR',
  SET_SELECTED_CARD: 'SET_SELECTED_CARD',
  SET_SAVED_PASSENGER_AEM_DATA: 'SET_SAVED_PASSENGER_AEM_DATA',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  FILTER_CARDS: 'FILTER_CARDS',
  SET_ERRORS: 'SET_ERRORS',
  SHOW_STATE_AND_NATIONALITY: 'SHOW_STATE_AND_NATIONALITY',
  SHOW_PASSPORT_DETAILS: 'SHOW_PASSPORT_DETAILS',
  SHOW_GST_DETAILS: 'SHOW_GST_DETAILS',
  SET_MODE: 'SET_MODE',
  SET_FORM_STATE: 'SET_FORM_STATE',
  SET_TOAST: 'SET_TOAST',
  SET_TOAST_TEXT: 'SET_TOAST_TEXT',
  SET_REMOVE_MODE: 'SET_REMOVE_MODE',
  DATA_UPDATED: 'DATA_UPDATED',
};

export const passengerReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case passengerActions.SET_PROFILE_DATA:
      return {
        ...state,
        profileData: payload,
      };

    case passengerActions.SET_COUNTRY_LIST:
      return {
        ...state,
        countryList: payload,
      };

    case passengerActions.SET_ORIGINAL_PROFILE_DATA:
      return {
        ...state,
        originalProfileData: payload,
      };

    case passengerActions.SET_USER_TYPE:
      return {
        ...state,
        userType: payload,
      };

    case passengerActions.SET_IS_OPENED:
      return {
        ...state,
        isOpened: payload,
      };

    case passengerActions.SET_IS_OPENED_SIDEBAR:
      return {
        ...state,
        isOpenedSidebar: payload,
      };

    case passengerActions.SET_SAVED_PASSENGER_AEM_DATA:
      return {
        ...state,
        savedPassengerAemData: payload,
      };

    case passengerActions.SET_SELECTED_CARD:
      return {
        ...state,
        selectedCard: payload,
      };
    case passengerActions.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };

    case passengerActions.FILTER_CARDS: {
      const searchTerm = state.searchTerm.toLowerCase().trim();
      const cardData = state.profileData?.FavoriteTraveler || [];

      // If the search term is empty, return all cards
      if (!searchTerm) {
        return { ...state, filteredCards: cardData };
      }

      const filteredCards = cardData.filter((item) => {
        const firstName = item.firstname?.toLowerCase() || '';
        const lastName = item.lastname?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return (
          firstName.includes(searchTerm)
          || lastName.includes(searchTerm)
          || fullName.includes(searchTerm)
        );
      });

      return { ...state, filteredCards };
    }

    case passengerActions.SET_ERRORS: {
      return {
        ...state,
        error: {
          ...state.error,
          ...payload,
        },
        isButtonDisabled: Object.values(state.error).some(
          (err) => err && err.trim() !== '',
        ),
      };
    }

    case passengerActions.SHOW_STATE_AND_NATIONALITY: {
      return {
        ...state,
        showStateAndNationality: payload,
      };
    }
    case passengerActions.SHOW_PASSPORT_DETAILS: {
      return {
        ...state,
        showPassportDetails: payload,
      };
    }
    case passengerActions.SHOW_GST_DETAILS: {
      return {
        ...state,
        showGSTDetails: payload,
      };
    }

    case passengerActions.SET_MODE: {
      return {
        ...state,
        mode: payload,
      };
    }

    case passengerActions.SET_FORM_STATE: {
      return {
        ...state,
        formData: payload,
      };
    }

    case passengerActions.SET_TOAST: {
      return {
        ...state,
        showToast: payload,
      };
    }

    case passengerActions.SET_TOAST_TEXT: {
      return {
        ...state,
        toastText: payload,
      };
    }

    case passengerActions.SET_REMOVE_MODE: {
      return {
        ...state,
        isRemoveMode: payload,
      };
    }

    case passengerActions.DATA_UPDATED:
      return {
        ...state,
        dataVersion: (state.dataVersion || 0) + 1, // Increment to trigger useEffect
      };

    default:
      return state;
  }
};
