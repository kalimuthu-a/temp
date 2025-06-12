import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  formatCurrencyFunc,
  getRemoveAddonSsrContext,
  isInternationlFlightSearch,
  newAddonData,
} from '../functions/utils';
import { CONSTANTS, categoryCodes } from '../constants';
import localStorageKeys from '../constants/localStorageKeys';
import LocalStorage from '../utils/LocalStorage';
import RemovedAddonSsrList from '../models/RemovedAddonSsrList';

const setSelectedMeal = (state, action) => {
  // const { tripIndex } = state;
  const tripIndex = action?.payload?.tripIndex ? (action.payload.tripIndex - 1) : state.tripIndex;
  const { segmentKey } = action.payload;
  const { passengerKey } = action.payload.passengerSSRKey;

  let meals = [];

  if (
    state.selectedMeals[tripIndex] &&
    state.selectedMeals[tripIndex][segmentKey] &&
    state.selectedMeals[tripIndex][segmentKey][passengerKey]
  ) {
    const itemExists = state.selectedMeals[tripIndex][segmentKey][
      passengerKey
    ].find((passengerMeal) => {
      return passengerMeal.meal.ssrCode === action.payload.meal.ssrCode;
    });
    if (itemExists === action.payload.meal.limitPerPassenger) {
      return state.selectedMeals[tripIndex][segmentKey][passengerKey];
    }

    if (
      state.selectedMeals[tripIndex][segmentKey][passengerKey].length >=
      state.limit
    ) {
      /* TD: Need to check for modification flow
      if (state.isAddonNextFare) {
        let selectedMeals = cloneDeep(state.selectedMeals[tripIndex][segmentKey][passengerKey]);
        selectedMeals = selectedMeals?.filter((obj) => obj.isTaken === true && obj.canBeRemoved === false);
        meals = [
          ...selectedMeals,
          action.payload,
        ];
      } else {
        meals = [
          ...state.selectedMeals[tripIndex][segmentKey][passengerKey].slice(1),
          action.payload,
        ];
      } */

      meals = [
        ...state.selectedMeals[tripIndex][segmentKey][passengerKey].slice(1),
        action.payload,
      ];
    } else {
      meals = [
        ...state.selectedMeals[tripIndex][segmentKey][passengerKey],
        action.payload,
      ];
    }
  } else {
    meals = [{ ...action.payload }];
  }

  return meals;
};

const calcTotalMealPriceAndCount = (state, action) => {
  // const { tripIndex } = state;
  const tripIndex = action?.payload?.tripIndex ? action.payload.tripIndex - 1 : state.tripIndex;
  let totalPrice = 0;
  let totalCount = 0;

  const selecteMealForTrip = state.selectedMeals[tripIndex];

  for (const segment in selecteMealForTrip) {
    for (const passenger in selecteMealForTrip[segment]) {
      for (const item in selecteMealForTrip[segment][passenger]) {
        totalPrice += selecteMealForTrip[segment][passenger][item].meal.price;
        totalCount += 1;
      }
    }
  }
  return { totalPrice, totalCount };
};

export const updateStateAfterSelectedMealFromPopup = (state, action) => {
  const meals = setSelectedMeal(state, action);
  let { tripIndex } = action.payload;
  tripIndex -= 1;
  const selectedMeals = [...state.selectedMeals];
  selectedMeals[tripIndex] = {
    ...selectedMeals[tripIndex],
    [action.payload.segmentKey]: {
      ...(state.selectedMeals[tripIndex]?.[action.payload.segmentKey] ||
        {}),
      [action.payload.passengerSSRKey.passengerKey]: meals,
    },
  };

  const totalPriceAndCount = calcTotalMealPriceAndCount({
    ...state,
    selectedMeals,
  });

  const totalMealsPriceCount = [...state.totalMealsPriceCount];

  totalMealsPriceCount[tripIndex] = {
    ...totalMealsPriceCount[tripIndex],
    ...{
      ...(state.totalMealsPriceCount[tripIndex] || {}),
      price: totalPriceAndCount.totalPrice,
      count: totalPriceAndCount.totalCount,
      currencycode: action?.payload?.meal?.currencycode,
    },
  };

  return {
    ...state,
    selectedMeals,
    totalMealsPriceCount,
  };
};

export const updateStateAfterSelectedMeal = (state, action) => {
  const meals = setSelectedMeal(state, action);
  const selectedMeals = [...state.selectedMeals];
  selectedMeals[state.tripIndex] = {
    ...selectedMeals[state.tripIndex],
    [action.payload.segmentKey]: {
      ...(state.selectedMeals[state.tripIndex]?.[action.payload.segmentKey] ||
        {}),
      [action.payload.passengerSSRKey.passengerKey]: meals,
    },
  };

  const totalPriceAndCount = calcTotalMealPriceAndCount({
    ...state,
    selectedMeals,
  });

  const totalMealsPriceCount = [...state.totalMealsPriceCount];

  totalMealsPriceCount[state.tripIndex] = {
    ...totalMealsPriceCount[state.tripIndex],
    ...{
      ...(state.totalMealsPriceCount[state.tripIndex] || {}),
      price: totalPriceAndCount.totalPrice,
      count: totalPriceAndCount.totalCount,
      currencycode: action?.payload?.meal?.currencycode,
    },
  };

  return {
    ...state,
    selectedMeals,
    totalMealsPriceCount,
  };
};

const removeSelecedMeal = (state, action) => {
  const { tripIndex } = state;
  const { segmentKey } = action.payload;
  const { passengerKey } = action.payload.passengerSSRKey;

  return state.selectedMeals[tripIndex][segmentKey][passengerKey].filter(
    (item) => {
      return item.meal.ssrCode !== action.payload.meal.ssrCode;
    },
  );
};

export const updateStateAfterRemoveMeal = (state, action) => {
  const { tripIndex } = state;
  const { segmentKey } = action.payload;
  const { passengerKey } = action.payload.passengerSSRKey;

  const selectedMeals = [...state.selectedMeals];
  const remainingMeals = removeSelecedMeal(state, action);

  selectedMeals[tripIndex] = {
    ...selectedMeals[tripIndex],
    [segmentKey]: {
      ...(state.selectedMeals[tripIndex]?.[segmentKey] || {}),
      [passengerKey]: remainingMeals.length === 0 ? undefined : remainingMeals,
    },
  };

  const updatedState = {
    ...state,
    selectedMeals,
  };
  const totalPriceAndCount = calcTotalMealPriceAndCount(updatedState);

  const totalMealsPriceCount = [...state.totalMealsPriceCount];

  totalMealsPriceCount[state.tripIndex] = {
    ...totalMealsPriceCount[state.tripIndex],
    ...{
      ...(state.totalMealsPriceCount[state.tripIndex] || {}),
      price: totalPriceAndCount.totalPrice,
      count: totalPriceAndCount.totalCount,
    },
  };

  return {
    ...updatedState,
    totalMealsPriceCount,
  };
};

export const setMlstBundleFare = (state, action) => {
  // const { tripIndex } = state;
  const tripIndex = action?.payload?.tripIndex ? (action.payload.tripIndex - 1) : state.tripIndex;
  const mlstBundleFare = [...state.mlstBundleFare];

  mlstBundleFare[tripIndex] = {
    ...mlstBundleFare[tripIndex],
    ...{
      ...(state.mlstBundleFare[tripIndex] || {}),
      isSelected: action.payload.isSelected,
      journeyKey: action.payload.journeyKey,
      bundleCode: action.payload.bundleCode,
      passengerKeys: action.payload.passengerKeys,
      title: action.payload.title,
      passengerKeysWithCoupon: action.payload?.passengerKeysWithCoupon || [],
    },
  };

  return {
    ...state,
    mlstBundleFare,
  };
};

export const setPrimBundleFare = (state, action) => {
  // const { tripIndex } = state;
  const tripIndex = action?.payload?.tripIndex ? (action.payload.tripIndex - 1) : state.tripIndex;
  const primBundleFare = [...state.primBundleFare];

  primBundleFare[tripIndex] = {
    ...primBundleFare[tripIndex],
    ...{
      ...(state.primBundleFare[tripIndex] || {}),
      isSelected: action.payload.isSelected,
      journeyKey: action.payload.journeyKey,
      bundleCode: action.payload.bundleCode,
      passengerKeys: action.payload.passengerKeys,
      title: action.payload.title,
      passengerKeysWithCoupon: action.payload?.passengerKeysWithCoupon || [],
    },
  };

  return {
    ...state,
    primBundleFare,
  };
};

export const setSeatAdded = (state, action) => {
  const { tripIndex } = state;
  const seatAdded = [...state.seatAdded];

  seatAdded[tripIndex] = {
    ...seatAdded[tripIndex],
    ...{
      ...(state.seatAdded[tripIndex] || {}),
      isSelected: action.payload,
    },
  };

  return {
    ...state,
    seatAdded,
  };
};

const setAddonDataOnCardRemoveBtn = (state, passengerKey, category) => {
  const segmentsHavingMeals = [];

  for (const segKey in state.confirmedMeals[state.tripIndex]) {
    for (const paxKey in state.confirmedMeals[state.tripIndex][segKey]) {
      if (
        passengerKey === paxKey &&
        !!state.confirmedMeals[state.tripIndex][segKey][paxKey]
      ) {
        segmentsHavingMeals.push(segKey);
        break;
      }
    }
  }

  const selectedAddonData = { ...state.setGetSelectedAddon };
  let selectedAddon = [];

  if (
    state.setGetSelectedAddon &&
    state.setGetSelectedAddon[state.tripIndex].selectedAddone.length > 0
  ) {
    selectedAddon = selectedAddonData[state.tripIndex].selectedAddone
      .map((addonItem) => {
        if (
          addonItem?.passengerKey === passengerKey &&
          addonItem?.addonName === category &&
          segmentsHavingMeals.length === 0
        ) {
          return undefined;
        }
        return addonItem;
      })
      .filter((item) => item);
  }

  return {
    ...selectedAddonData,
    [state.tripIndex]: {
      selectedAddone: selectedAddon,
    },
  };
};

const calcTotalMealPriceAndCountForConfirmedMeals = (state) => {
  const { tripIndex } = state;
  let totalPrice = 0;
  let totalCount = 0;

  const confirmedMealsForTrip = state.confirmedMeals[tripIndex];

  for (const segment in confirmedMealsForTrip) {
    for (const passenger in confirmedMealsForTrip[segment]) {
      for (const item in confirmedMealsForTrip[segment][passenger]) {
        totalPrice +=
          confirmedMealsForTrip[segment][passenger][item].meal.price;
        totalCount += 1;
      }
    }
  }
  return { totalPrice, totalCount };
};

export const removeConfirmedMealsForAPax = (state, action) => {
  const { passengerKey, segmentKeys, category } = action.payload;
  const confirmedMealsForRemoval = cloneDeep([...state.confirmedMeals]);

  segmentKeys.forEach((segKey) => {
    if (confirmedMealsForRemoval[state.tripIndex]?.[segKey]?.[passengerKey]) {
      confirmedMealsForRemoval[state.tripIndex][segKey][passengerKey] =
        undefined;
    }
  });

  const updatedState = {
    ...state,
    confirmedMeals: confirmedMealsForRemoval,
  };
  const copyTotalPriceAndCount =
    calcTotalMealPriceAndCountForConfirmedMeals(updatedState);

  const copyTotalMealsPriceCount = [...state.copyTotalMealsPriceCount];

  copyTotalMealsPriceCount[state.tripIndex] = {
    ...copyTotalMealsPriceCount[state.tripIndex],
    ...{
      ...(state.copyTotalMealsPriceCount[state.tripIndex] || {}),
      price: copyTotalPriceAndCount.totalPrice,
      count: copyTotalPriceAndCount.totalCount,
    },
  };

  return {
    ...updatedState,
    copyTotalMealsPriceCount,
    setGetSelectedAddon: setAddonDataOnCardRemoveBtn(
      updatedState,
      passengerKey,
      category,
    ),
  };
};

export const removeAllConfirmedMealsForBundle = (state) => {
  const confirmedMealsForRemoval = cloneDeep([...state.confirmedMeals]);

  for (const segment in confirmedMealsForRemoval[state.tripIndex]) {
    if (confirmedMealsForRemoval[state.tripIndex]?.[segment]) {
      confirmedMealsForRemoval[state.tripIndex][segment] = undefined;
    }
  }

  const updatedState = {
    ...state,
    confirmedMeals: confirmedMealsForRemoval,
  };

  // Check for complimentary / select on board meals
  if (state.confirmedMeals[state.tripIndex]) {
    const copyTotalPriceAndCount =
      calcTotalMealPriceAndCountForConfirmedMeals(updatedState);
    const copyTotalMealsPriceCount = [...state.copyTotalMealsPriceCount];

    copyTotalMealsPriceCount[state.tripIndex] = {
      ...copyTotalMealsPriceCount[state.tripIndex],
      ...{
        ...(state.copyTotalMealsPriceCount[state.tripIndex] || {}),
        price: copyTotalPriceAndCount.totalPrice,
        count: copyTotalPriceAndCount.totalCount,
      },
    };

    return {
      ...updatedState,
      copyTotalMealsPriceCount,
    };
  }

  return {
    ...updatedState,
  };
};

export const removeBundleMeals = (state) => {
  const bundleMeals = [...state.bundleMeals];

  for (const segment in bundleMeals[state.tripIndex]) {
    if (bundleMeals[state.tripIndex]?.[segment]) {
      bundleMeals[state.tripIndex][segment] = undefined;
    }
  }

  const updatedState = {
    ...state,
    bundleMeals,
  };

  return {
    ...updatedState,
  };
};

/**
 *
 * @param {Object} payload
 * @param {Object} state
 * @returns {any}
 */
export function setFlightSSRAddOn(payload, state) {
  const { getTrips, getPassengerDetails } = payload;
  const {
    containerConfigData,
    page,
    isPassengerPostRequired,
    getPassengerDetails: peEventData,
    istravelAssistanceAddedFromPE,
    isZeroCancellationAddedFromPE,
    removedAddonSsr,
    sellAddonSsr,
  } = state;

  const mfData = containerConfigData?.mfData?.data?.addOnsMainByPath?.item;

  const passengerData = getPassengerDetails.map((row, key) => ({
    ...(isPassengerPostRequired ? peEventData?.[key] : row),
    name: {
      action: 'update',
      ...(isPassengerPostRequired ? peEventData?.[key]?.name : row?.name),
    },
    travelDocuments:
      row?.travelDocuments?.map((_r) => ({
        ...(isPassengerPostRequired ? peEventData?.[key]?.travelDocuments : _r),
        action: 'update',
      })) ?? [],
  }));

  const firstSSR = get(getTrips, 'ssr.0.journeySSRs', []);
  const categoriesToGet = [
    categoryCodes.abhf,
    categoryCodes.brb,
    categoryCodes.prot,
  ];

  const categories = {};

  const upSellPopup = {
    submitAddon: false,
    actionTakenTA: true,
    actionTakenLB: true,
    actionTakenCI: true,
    showTAUpsellPopup: false,
    showLBUpsellPopup: false,
    showCIUpsellPopup: false,
  };

  firstSSR.forEach((element) => {
    const { category, ssrs, takenssr } = element;

    // const AEMData = mfData.categoriesList.find(
    const categoriesList = [...mfData.mainAddonsList, ...mfData.extaAddonsList];
    const AEMData = categoriesList?.find(
      (row) => row.categoryBundleCode === category,
    );

    if (
      categoriesToGet.includes(category) &&
      (ssrs.length > 0 || takenssr?.length > 0)
    ) {
      const categoryData = { ...ssrs[0], ...(takenssr?.[0] ?? {}) };

      categories[category] = {
        ...categoryData,
        priceToDisplay: formatCurrencyFunc({
          price: categoryData.price,
          currencycode: categoryData.currencycode,
        }),
        // TD:
        // strikedPriceToDisplay: formatCurrencyFunc({
        //   price: categoryData.price,
        //   currencycode: categoryData.currencycode,
        // }),
        AEMData,
      };

      // BRB UpSell popup condition
      if (category === categoryCodes.brb) {
        upSellPopup.actionTakenLB = false;
      }
    }
  });

  function _baggageDeclarationLogic(getAddonData, categoryValue, pageData) {
    // Baggage Declaration Logic
    let tripIndex = 0;
    const paxIndex = [];
    paxIndex[tripIndex] = { paxIndex: tripIndex };
    const excessBaggageData = { data: [], openslider: false };
    let setGetSelectedAddon = [];

    const baggageDecalationData = LocalStorage.getAsJson(
      localStorageKeys.baggage_declaration,
      { baggageDeclarationRequest: [] },
    );

    const { baggageDeclarationRequest } = baggageDecalationData || {
      baggageDeclarationRequest: [],
    };

    // if page is checkin flow or add on seat selection
    const { ADDON_CHECKIN, ADDON_SEAT_SELECTION_CHECKIN } = CONSTANTS;

    if ([ADDON_SEAT_SELECTION_CHECKIN, ADDON_CHECKIN].includes(pageData)) {
      getAddonData?.ssr?.forEach((_ssr, index) => {
        const newSelectedAddonData = [];

        const { journeyKey, journeySSRs } = _ssr;
        const {
          AEMData: { title },
        } = get(categoryValue, categoryCodes.abhf, {
          AEMData: { title: '' },
        });

        let ssrCode = '';
        let passengersSSRKey = [];
        let price = '';

        const ssrCat = journeySSRs.find((s) => {
          return s.category === categoryCodes.abhf;
        });

        if (ssrCat && ssrCat.ssrs.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          ({ ssrCode, passengersSSRKey = [], price } = ssrCat.ssrs[0]);
        }

        const excessBaggageRow = [];

        const baggageDeclarationJou =
          baggageDeclarationRequest.find(
            (item) => item.journeyKey === journeyKey,
          ) ?? [];

        passengersSSRKey.forEach((passenger, pIndex) => {
          const excessBaggageCell = {};
          const { passengerKey } = passenger;
          const baggageDeclaration = baggageDeclarationJou?.passengers?.find(
            (item) => item.passengerKey === passengerKey && item.extraBaggageCount > 0,
          );

          if (baggageDeclaration) {
            tripIndex = index;
            paxIndex[tripIndex] = [];
            paxIndex[tripIndex].paxIndex = pIndex;
            newSelectedAddonData.push({
              passengerKey,
              addonName: title,
              multiplier: baggageDeclaration.extraBaggageCount,
              category: categoryCodes.abhf,
              price,
              ssrCode,
              journeyKey,
            });

            setGetSelectedAddon = newAddonData(
              setGetSelectedAddon,
              [title],
              [index],
              newSelectedAddonData,
              [passengerKey],
            );

            excessBaggageData.openslider = true;
          }
          excessBaggageRow.push(excessBaggageCell);
        });

        excessBaggageData.data.push(excessBaggageRow);
      });
    }

    return {
      tripIndex,
      paxIndex,
      excessBaggageData,
      setGetSelectedAddon,
    };
  }

  const { tripIndex, paxIndex, excessBaggageData, setGetSelectedAddon } =
    _baggageDeclarationLogic(getTrips, categories, page);

  /**
   * Logic to exclude ssrCode - "CPTR" (Corporate Fare) from meal
   */
  const filterCPTR = (_ssr) => _ssr.ssrCode !== 'CPTR';

  getTrips.ssr = getTrips.ssr.map((ssr) => {
    return {
      ...ssr,
      segments: ssr.segments.map((segment) => {
        return {
          ...segment,
          segmentSSRs: segment.segmentSSRs.map((segmentSSR) => ({
            ...segmentSSR,
            ssrs: segmentSSR.ssrs.filter(filterCPTR),
          })),
        };
      }),
    };
  });

  let _removedAddonSsr = new RemovedAddonSsrList(...removedAddonSsr);
  const _sellAddonSsr = [...sellAddonSsr];
  let _setGetSelectedAddon = setGetSelectedAddon;

  getTrips.ssr.forEach((ssr, key) => {
    const { journeyKey } = ssr;

    const category = ssr.journeySSRs.find(
      (item) => item.category === categoryCodes.prot,
    );

    const sliderConfiguration = get(
      containerConfigData,
      'configJson.data.addonAdditionalByPath.item.sliderConfiguration',
      [],
    );

    if (category) {
      const travelAssistance = sliderConfiguration.find(
        (c) => c.categoryBundleCode === categoryCodes.prot,
      );
      const categoryTitle = travelAssistance?.sliderTitle;
      const {
        passengersSSRKey = [],
        price,
        ssrCode,
        name,
      } = get(category, 'ssrs.0', {});

      if (istravelAssistanceAddedFromPE) {
        const newSelectedAddonData = [];

        passengersSSRKey.forEach(({ passengerKey, ssrKey }) => {
          _sellAddonSsr.push({
            ssrKey,
            count: 1,
            Note: '',
            categoryName: categoryTitle,
            ssrCategory: categoryCodes.prot,
          });
          newSelectedAddonData.push({
            passengerKey,
            addonName: categoryTitle,
            ssrCode,
            price,
            category: categoryCodes.prot,
            journeyKey,
            name,
          });
        });

        _setGetSelectedAddon = newAddonData(
          _setGetSelectedAddon,
          [categoryTitle],
          [key],
          newSelectedAddonData,
        );
      }

      if (istravelAssistanceAddedFromPE) {
        _removedAddonSsr = getRemoveAddonSsrContext(
          _removedAddonSsr,
          [ssrCode],
          getTrips,
          key,
          getPassengerDetails,
        );
      }
    }

    const zeroCancellationCategory = ssr.journeySSRs.find(
      (item) => item.category === categoryCodes.ifnr,
    );

    if (zeroCancellationCategory) {
      const zeroCancellation = sliderConfiguration.find(
        (c) => c.categoryBundleCode === categoryCodes.ifnr,
      );
      const categoryTitle = zeroCancellation?.sliderTitle;
      const {
        passengersSSRKey = [],
        price,
        ssrCode,
        name,
      } = get(zeroCancellationCategory, 'ssrs.0', {});

      if (isZeroCancellationAddedFromPE) {
        const newSelectedAddonData = [];

        passengersSSRKey.forEach(({ passengerKey, ssrKey }) => {
          _sellAddonSsr.push({
            ssrKey,
            count: 1,
            Note: '',
            categoryName: categoryTitle,
            ssrCategory: categoryCodes.ifnr,
          });
          newSelectedAddonData.push({
            passengerKey,
            addonName: categoryTitle,
            ssrCode,
            price,
            category: categoryCodes.ifnr,
            journeyKey,
            name,
          });
        });

        _setGetSelectedAddon = newAddonData(
          _setGetSelectedAddon,
          [categoryTitle],
          [key],
          newSelectedAddonData,
        );
      }

      if (isZeroCancellationAddedFromPE) {
        _removedAddonSsr = getRemoveAddonSsrContext(
          _removedAddonSsr,
          [ssrCode],
          getTrips,
          key,
          getPassengerDetails,
        );
      }
    }
  });

  return {
    ...payload,
    categories,
    isInternationalFlight: isInternationlFlightSearch(getTrips?.ssr || []),
    getPassengerDetails: passengerData,
    persistPassengerDetails: passengerData,
    tripIndex,
    paxIndex,
    excessBaggageData,
    upSellPopup,
    getTrips,
    sellAddonSsr: _sellAddonSsr,
    removedAddonSsr: _removedAddonSsr,
    setGetSelectedAddon: _setGetSelectedAddon,
  };
}
