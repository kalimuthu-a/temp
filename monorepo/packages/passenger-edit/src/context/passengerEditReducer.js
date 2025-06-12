import { getDeepCopyOfObjectByStr } from '../helpers';
import passengerEditActions from './actions';

/* reducer for useReducer */
const passengerEditReducer = (state, action) => {
  switch (action.type) {
    case passengerEditActions.SET_PASSENGERS_DATA:
      return {
        ...state,
        paxData: action.payload,
        passengers: action.payload.passengers,
        specialFareCode: action?.payload?.configurations?.specialFareCode,
        doubleSeatCount: action?.payload?.configurations?.doubleSeatCount,
        tripleSeatCount: action?.payload?.configurations?.tripleSeatCount,
        extraSeatKeys: action?.payload?.extraSeatKeys,
        modificationFlow: action.payload.modificationFlow,
        ssr: action?.payload?.ssr,
        isSMEUser: action.payload.isSMEUser,
        isAgentUser: action.payload.isAgentUser,
        savedGstDetails: action.payload?.orgGstDetails,
      };
    case passengerEditActions.SET_LOADER:
      return {
        ...state,
        loader: action.payload,
      };
    case passengerEditActions.TOGGLE_MODAL:
      return {
        ...state,
        toggleModal: {
          flag: action.payload.flag,
          modalContent: action.payload.modalContent,
        },
      };
    case passengerEditActions.SELECT_SAVED_PASSENGERS: {
      return {
        ...state,
        // savedPassengers: action.payload.clickedPax,
        selectedSavedPassengers: action.payload.selectedFavPax,
      };
    }
    case passengerEditActions.SET_PASSENGERS: {
      return {
        ...state,
        passengers: action.payload,
      };
    }
    case passengerEditActions.ON_CLICK_NEXT: {
      return {
        ...state,
        onclickNext: action.payload,
      };
    }
    case passengerEditActions.PD_CONSENT: {
      const consentObj = getDeepCopyOfObjectByStr(
        state?.aemMainData?.privacyDescription,
        'key',
        action.payload.whichConsent,
      );
      consentObj.checked = action.payload.value;
      consentObj.initFlag = action.payload.initRenderFlag;
      consentObj.userInteracted = action?.payload?.userInteracted;

      return {
        ...state,
        aemMainData: {
          ...state.aemMainData,
          privacyDescription: [
            ...state.aemMainData.privacyDescription.slice(
              0,
              action.payload.index,
            ),
            consentObj,
            ...state.aemMainData.privacyDescription.slice(
              action.payload.index + 1,
            ),
          ],
        },
      };
    }
    case passengerEditActions.SET_AEM_DATA: {
      return {
        ...state,
        aemMainData: {
          ...state.aemMainData,
          ...action.payload,
        },
      };
    }
    case passengerEditActions.ADD_PASSENGER_PAYLOAD: {
      return {
        ...state,
        postApiPayload: action.payload,
      };
    }
    case passengerEditActions.SET_SPECIAL_ASSISTANCE: {
      return {
        ...state,
        specialAssistanceForm: action.payload,
      };
    }
    case passengerEditActions.BOOKING_CONTEXT: {
      return {
        ...state,
        bookingContext: action.payload,
      };
    }
    case passengerEditActions.SET_SAVED_PASSENGERS: {
      return {
        ...state,
        savedPassengers: action.payload,
      };
    }
    case passengerEditActions.SET_IS_AUTHENTICATED: {
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    }
    case passengerEditActions.SET_BOOKING_CONTACT: {
      return {
        ...state,
        paxData: {
          ...state.paxData,
          bookingcontacts: [
            {
              ...state.paxData.bookingcontacts[0],
              ...action.payload,
            },
          ],
        },
      };
    }
    case passengerEditActions.SET_GST_DETAILS: {
      return {
        ...state,
        gstDetails: {
          ...state.gstDetails,
          [action.payload.key]: {
            value: action.payload.value,
            error: action.payload.error,
          },
        },
      };
    }
    case passengerEditActions.SET_GST_FLAGS: {
      return {
        ...state,
        [action.payload.flag]: action.payload.value,
      };
    }
    case passengerEditActions.SET_LOGGED_USER: {
      return {
        ...state,
        loggedInUser: action.payload,
      };
    }
    case passengerEditActions.SET_IS_LOYALTY_AUTHENTICATED: {
      return {
        ...state,
        isLoyaltyAuthenticated: action.payload,
      };
    }
    case passengerEditActions.SET_IS_BURN_FLOW: {
      return {
        ...state,
        isBurnFlow: action.payload,
      };
    }
    case passengerEditActions.SET_PASSENGER_EDIT_ERROR: {
      return {
        ...state,
        passengerEditError: action.payload,
      };
    }
    case passengerEditActions.SET_FAVORITE_TRAVELLER: {
      return {
        ...state,
        paxData: {
          ...state.paxData,
          favouriteTraveller: action.payload,
        },
      };
    }
    case passengerEditActions.SET_NOMINEE_TRAVELLER: {
      return {
        ...state,
        paxData: {
          ...state.paxData,
          nomineeTraveller: action.payload,
        },
      };
    }
    case passengerEditActions.SET_ADULT_MINOR_CONSENT: {
      return {
        ...state,
        adultMinorConsent: action.payload,
      };
    }
    case passengerEditActions.SET_ADULT_CONSENT_DATA: {
      return {
        ...state,
        adultConsentData: action.payload,
      };
    }
    case passengerEditActions.SET_PRIVACY_POLICY_DATA: {
      return {
        ...state,
        getPrivacyPolicyData: action.payload,
      };
    }
    default:
      return state;
  }
};

export default passengerEditReducer;
