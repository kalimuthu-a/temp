import { addonActions } from '../addonActions';
import { setFlightSSRAddOn } from '../addonReducerHelpers';

export const defaultCommonState = {
  isInternationalFlight: false,
  upSellPopup: {
    submitAddon: false,
    actionTakenTA: true,
    actionTakenLB: true,
    actionTakenCI: true,
    showTAUpsellPopup: false,
    showLBUpsellPopup: false,
    showCIUpsellPopup: false,
  },
  removedAddonSsr: [],
  sellAddonSsr: [],
  setGetSelectedAddon: [],
  setSellQuickBoard: {},
  getPassengerDetails: [],
  setGetFastForward: {},
  setSellFastForward: {},
  selectedGoodNight: {},
  removedGoodNight: [],
  setGetGoodNight: {},
  setSellGoodNight: {},
  isPassengerPostRequired: false,
  selectedLounge: {},
  removedLounge: [],
  setGetLounge: {},
  setSellLounge: {},
  selectedBar: {},
  removedBar: [],
  setGetBar: {},
  setSellBar: {},
  selectedSportsEquipment: {},
  removedSportsEquipment: [],
  setGetSportsEquipment: {},
  setSellSportsEquipment: {},
  persistPassengerDetails: null,
  delayLostBaggageProtection: null,
  isAddonSubmitted: false,
  istravelAssistanceAddedFromPE: null,
  isZeroCancellationAddedFromPE: false,
  isAddonNextFare: false,
  addonNextFareType: '',
  couponData: {},
  redeemCoupon: {},
  mealRedeemCoupon: {}
};

export const commonReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case addonActions.SET_FLIGHT_SSR_ADD_ON: {
      return {
        ...state,
        ...setFlightSSRAddOn(payload, state),
      };
    }
    case addonActions.SET_TRIP_INDEX: {
      const { paxIndexNew, tripIndex } = action.payload;
      return {
        ...state,
        tripIndex,
        paxIndex: paxIndexNew,
      };
    }

    case addonActions.SET_GET_PAX_INDEX:
      return {
        ...state,
        paxIndex: action.payload,
      };

    case addonActions.SET_SELL_ADDON_SSR:
      return {
        ...state,
        sellAddonSsr: action.payload,
      };
    case addonActions.SET_GET_SELECTED_ADDON:
      return {
        ...state,
        setGetSelectedAddon: action.payload,
      };
    case addonActions.SET_CURRENCY_LIST:
      return {
        ...state,
        currencyList: action.payload,
      };
    case addonActions.SET_FROM_DATE:
      return {
        ...state,
        selectedTravelDatesInfo: {
          ...state.selectedTravelDatesInfo,
          startDate: action.payload,
        },
      };
    case addonActions.SET_TO_DATE:
      return {
        ...state,
        selectedTravelDatesInfo: {
          ...state.selectedTravelDatesInfo,
          endDate: action.payload,
        },
      };
    case addonActions.SET_UPSELL_POPUP_DATA: {
      return {
        ...state,
        upSellPopup: { ...state.upSellPopup, ...action.payload },
      };
    }

    case addonActions.IS_ADDON_EXPANDED:
      return {
        ...state,
        isAddonExpanded: action.payload,
      };
    case addonActions.IS_ADDON_ENABLE_CHANGE:
      return {
        ...state,
        isAddonEnableChange: action.payload,
      };

    case addonActions.IS_ADDON_SUBMITTED:
      return {
        ...state,
        isAddonSubmitted: action.payload,
      };
    case addonActions.SET_ADDON_ERROR:
      return {
        ...state,
        setAddonError: action.payload,
      };

    case addonActions.SET_ADDON_IS_LOADING:
      return {
        ...state,
        setAddonIsLoading: action.payload,
      };

    case addonActions.GET_PASSENGER_DATA:
      return {
        ...state,
        getPassengerDetails: payload,
        persistPassengerDetails: payload,
      };

    case addonActions.UNMOUNT_ADDONCONTAINER: {
      return {
        ...state,
        upSellPopup: {
          submitAddon: false,
          actionTakenTA: true,
          actionTakenLB: true,
          actionTakenCI: true,
          showTAUpsellPopup: false,
          showLBUpsellPopup: false,
          showCIUpsellPopup: false,
        },
        removedAddonSsr: [],
        sellAddonSsr: [],
        setGetSelectedAddon: [],
        setSellQuickBoard: {},
        setGetFastForward: {},
        setSellFastForward: {},
        isPassengerPostRequired: false,
        selectedLounge: {},
        removedLounge: [],
        setGetLounge: {},
        setSellLounge: {},
        selectedBar: {},
        removedBar: [],
        setGetBar: {},
        setSellBar: {},
        selectedSportsEquipment: {},
        removedSportsEquipment: [],
        setGetSportsEquipment: {},
        setSellSportsEquipment: {},
        persistPassengerDetails: null,
        delayLostBaggageProtection: null,
        confirmedMeals: [],
        takenMeals: [],
        copyTotalMealsPriceCount: [],
        mlstBundleFare: [],
        primBundleFare: [],
        underTwelveHourFlight: false,
        flexiPlusSuper6ECorpFareForMeal: false,
        bundleMeals: [],
        seatAdded: [],
        couponData: {},
        redeemCoupon: {},
        mealRedeemCoupon: {}
      };
    }
    case addonActions.REMOVE_ADDON_SSR:
      return {
        ...state,
        removedAddonSsr: payload,
      };

    case addonActions.IS_PASSENGER_POST_REQUIRED:
      return {
        ...state,
        isPassengerPostRequired: payload,
      };
    case addonActions.SET_CONTEXT_AT_MOUNT_ONLY: {
      return {
        ...state,
        ...payload,
      };
    }
    case addonActions.ADD_TRAVEL_ASSISTANCE_FROM_PE: {
      return {
        ...state,
        istravelAssistanceAddedFromPE: payload,
      };
    }
    case addonActions.ADD_ZERO_CANCELLATION_FROM_PE: {
      return {
        ...state,
        isZeroCancellationAddedFromPE: payload,
      };
    }
    case addonActions.ADDON_AEM_DATA: {
      return {
        ...state,
        containerConfigData: payload,
      };
    }

    case addonActions.IS_ADDON_CHANGE_FLOW:
      return {
        ...state,
        isAddonChangeFlow: action.payload,
      };

    case addonActions.IS_ADDON_NEXT_FARE:
      return {
        ...state,
        isAddonNextFare: action.payload,
      };

    case addonActions.ADDON_NEXT_FARE_TYPE:
      return {
        ...state,
        addonNextFareType: action.payload,
      };

    case addonActions.SET_IS_AUTHENTICATED: {
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    }
    case addonActions.SET_LOGGED_USER: {
      return {
        ...state,
        loggedInUser: action.payload,
      };
    }
    case addonActions.SET_ISLOYALTY_FLOW: {
      return {
        ...state,
        loggedInLoyaltyUser: action.payload,
      };
    }
    case addonActions.SET_COUPON_DATA: {
      return {
        ...state,
        couponData: action.payload,
      };
    }
    case addonActions.SET_REDEEM_COUPON_DATA: {
      return {
        ...state,
        redeemCoupon: action.payload,
      };
    }
    case addonActions.SET_MEAL_REDEEM_DATA: {
      return {
        ...state,
        mealRedeemCoupon: action.payload,
      };
    }
    default:
      return state;
  }
};
