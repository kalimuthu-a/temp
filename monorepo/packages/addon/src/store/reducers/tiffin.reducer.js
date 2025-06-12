import { addonActions } from '../addonActions';
import {
  updateStateAfterSelectedMeal,
  updateStateAfterSelectedMealFromPopup,
  updateStateAfterRemoveMeal,
  setMlstBundleFare,
  setPrimBundleFare,
  setSeatAdded,
  removeConfirmedMealsForAPax,
  removeAllConfirmedMealsForBundle,
  removeBundleMeals,
} from '../addonReducerHelpers';

export const defaultTiffinState = {
  limit: 0,
  mealFilters: [],
  mealSearch: '',
  selectedMeals: [], // Slider
  confirmedMeals: [], // after clicking continue
  takenMeals: [],
  totalMealsPriceCount: [],
  mlstBundleFare: [],
  primBundleFare: [],
  underTwelveHourFlight: false,
  flexiPlusSuper6ECorpFareForMeal: false,
  bundleMeals: [],
  seatAdded: [],
  isSliderDefaultOpen: false,
  mealVoucherData: [],
  ssrMealCouponRemoveRequest: [],
  passengerMealData: [],
  journeyPaxCount: [],
};

/**
 * @param {*} state
 * @param {{type: string, payload: *}} action
 * @returns {*}
 */
// eslint-disable-next-line default-param-last
export const tiffinReducer = (state = defaultTiffinState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SET_LIMIT:
      return {
        ...state,
        limit: payload,
      };
    case addonActions.SET_MEAL_FILTERS:
      return {
        ...state,
        mealFilters: payload,
      };
    case addonActions.SET_MEAL_SEARCH:
      return {
        ...state,
        mealSearch: payload,
      };
    case addonActions.UNDER_TWELVE_HOUR_FLIGHT:
      return {
        ...state,
        underTwelveHourFlight: payload,
      };
    case addonActions.FLEXIPLUS_SUPER6E_CORP_FARE_FOR_MEAL:
      return {
        ...state,
        flexiPlusSuper6ECorpFareForMeal: payload,
      };
    case addonActions.SET_SELECTED_MEALS:
      return updateStateAfterSelectedMeal(state, action);
    case addonActions.SET_SELECTED_MEALS_FROM_POPUP:
      return updateStateAfterSelectedMealFromPopup(state, action);
    case addonActions.REMOVE_SELECTED_MEALS:
      return updateStateAfterRemoveMeal(state, action);
    case addonActions.REMOVE_CONFIRMED_MEALS_FOR_A_PAX:
      return removeConfirmedMealsForAPax(state, action);
    case addonActions.REMOVE_ALL_CONFIRMED_MEALS_FOR_BUNDLE:
      return removeAllConfirmedMealsForBundle(state);
    case addonActions.SET_CONFIRMED_MEALS:
      return {
        ...state,
        confirmedMeals: payload.meals,
        copyTotalMealsPriceCount: payload.priceAndCount,
      };
    case addonActions.SET_TAKEN_MEALS:
      return {
        ...state,
        takenMeals: payload.meals,
        totalMealsPriceCountTaken: payload.totalMealsPriceCountTaken,
      };
    case addonActions.RESET_SELECTED_MEALS:
      return {
        ...state,
        selectedMeals: payload,
        totalMealsPriceCount: state.copyTotalMealsPriceCount,
      };
    // TD: - changed selectedMeals - kept for reference
    // case addonActions.CLEAR_SELECTED_MEALS:
    //   return {
    //     ...state,
    //     selectedMeals: [],
    //     totalMealsPriceCount: [],
    //   };
    case addonActions.CLEAR_SELECTED_MEALS: {
      return {
        ...state,
        selectedMeals: state.confirmedMeals,
        totalMealsPriceCount: [],
      };
    }
    case addonActions.MLST_BUNDLE_FARE_SELECTED:
      return setMlstBundleFare(state, action);
    case addonActions.PRIM_BUNDLE_FARE_SELECTED:
      return setPrimBundleFare(state, action);
    case addonActions.SEAT_ADDED:
      return setSeatAdded(state, action);
    case addonActions.MLST_BUNDLE_FARE_TAKEN:
      return {
        ...state,
        mlstBundleFare: payload,
      };
    case addonActions.PRIM_BUNDLE_FARE_TAKEN:
      return {
        ...state,
        primBundleFare: payload,
      };
    case addonActions.SEAT_ADDED_TAKEN:
      return {
        ...state,
        seatAdded: payload,
      };
    // case addonActions.IS_MANDATORY_MEAL:
    // return {
    // ...state,
    // isMandatoryMeal: payload,
    // };
    case addonActions.SET_BUNDLE_MEALS:
      return {
        ...state,
        bundleMeals: payload.meals,
        copyTotalMealsPriceCount: payload.priceAndCount,
      };
    case addonActions.REMOVE_BUNDLE_MEALS:
      return removeBundleMeals(state);
    case addonActions.CLEAR_BUNDLE_MEALS:
      return {
        ...state,
        bundleMeals: [],
        totalMealsPriceCount: [],
      };

    case addonActions.SET_DEFAULT_SLIDER_STATE:
      return {
        ...state,
        isSliderDefaultOpen: payload.sliderDefaultState,
      };
    case addonActions.SET_MEAL_COUPON_DATA:
      return {
        ...state,
        mealVoucherData: payload.mealVoucherData,
      };
    case addonActions.REMOVE_MEAL_FOR_COUPON:
      return {
        ...state,
        ssrMealCouponRemoveRequest: payload.ssrMealCouponRemoveRequest,
      };
    case addonActions.SET_PASSENGER_MEAL_DATA:
      return {
        ...state,
        passengerMealData: payload.passengerMealData,
      };
    case addonActions.SET_JOURNEY_PAX_COUNT:
      return {
        ...state,
        journeyPaxCount: payload.journeyPaxCount,
      };
    default:
      return state;
  }
};
