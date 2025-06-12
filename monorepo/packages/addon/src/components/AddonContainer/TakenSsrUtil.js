import isEmpty from 'lodash/isEmpty';
import { CURRENCY_CODES, categoryCodes } from '../../constants/index';

const getTakenMeals = (ssr, aemMealList, bundles) => {
  const takenMeals = [];

  // Old Code:
  // const selectedAddonTakenSsrData = [];
  // let selectedAddonTakenSsrData = [[],[]];

  const mlstBundleFareTakenSsrData = [];
  const primBundleFareTakenSsrData = [];
  const seatAddedTakenSsrData = [];
  let currencycode = CURRENCY_CODES.INR;

  ssr.forEach((tripSsr, ssrIndex) => {
    let segment = {};
    // Old Code:
    // let isCpml = false;
    currencycode = tripSsr.currencyCode;

    /* Old Code:
    if (
      setGetSelectedAddon &&
      setGetSelectedAddon[ssrIndex] &&
      setGetSelectedAddon[ssrIndex].selectedAddone.length > 0
    ) {
      selectedAddonTakenSsrData = [...setGetSelectedAddon];
    } else {
      if (!setGetSelectedAddon[ssrIndex]) {
        selectedAddonTakenSsrData[ssrIndex] = [];
      }
      if (!setGetSelectedAddon[ssrIndex].selectedAddone) {
        selectedAddonTakenSsrData[ssrIndex].selectedAddone = [];
      }
    } */
    let primeBundlePrice = 0;
    bundles.forEach(bundle => {if(bundle?.bundleCode === categoryCodes?.prim) {
      const journeyBundle =  bundle?.pricesByJourney?.filter(journeyBundle => journeyBundle?.journeyKey === tripSsr.journeyKey)
      primeBundlePrice = journeyBundle?.[0]?.totalPrice
    }})


    const bundleFareObj = {
      isSelected: true,
      journeyKey: tripSsr.journeyKey,
      bundleCode: '',
      passengerKeys: [],
    };

    tripSsr.segments.forEach((segSsr) => {
      const mealSsr = segSsr.segmentSSRs.filter((catData) => {
        return catData.category === categoryCodes.meal;
      });
      mealSsr.forEach((meal) => {
        if (meal.takenssr?.length) {
          segment = {
            ...segment,
            [segSsr.segmentKey]: {},
          };
          meal.takenssr?.forEach((taken) => {
            if (taken.ssrCode === 'CPTR') {
              return;
            }

            // Old Code:
            // if (taken.ssrCode === 'CPML') {
            //   isCpml = true;
            // }
            // if (taken.ssrCode !== "CPML") {
            // check for CPML which does not qualify to be a takenMeals item

            const matchedApiMeal = meal.ssrs.find(
              (_apimeal) => _apimeal.ssrCode === taken.ssrCode,
            );

            let mergedApiAemMeal = {};

            if (!isEmpty(matchedApiMeal)) {
              const matchedAemMeal = aemMealList.find(
                (_aemmeal) => _aemmeal.ssrCode === matchedApiMeal.ssrCode,
              );
              mergedApiAemMeal = { ...matchedApiMeal, ...matchedAemMeal };
            } else {
              mergedApiAemMeal = taken;
            }

            /* =====Creating Taken Meals for context and updating the same in confirmed meals========== */
            if (segment[segSsr.segmentKey][taken.passengerKey]) {
              segment[segSsr.segmentKey][taken.passengerKey].push({
                meal: mergedApiAemMeal,
                isTaken: true,
                canBeRemoved: taken.canBeRemoved,
                passengerSSRKey: {
                  passengerKey: taken.passengerKey,
                  ssrKey: taken.originalSsrKey,
                  takenSsrKey: taken.ssrKey,
                },
                segmentKey: segSsr.segmentKey,
                journeyKey: tripSsr.journeyKey,
                ssrCategory: taken.bundleCode
                  ? taken.bundleCode
                  : meal.category,
                bundleTotalPrice: primeBundlePrice
              });
            } else {
              segment[segSsr.segmentKey][taken.passengerKey] = [
                {
                  meal: mergedApiAemMeal,
                  isTaken: true,
                  canBeRemoved: taken.canBeRemoved,
                  passengerSSRKey: {
                    passengerKey: taken.passengerKey,
                    ssrKey: taken.originalSsrKey,
                    takenSsrKey: taken.ssrKey,
                  },
                  segmentKey: segSsr.segmentKey,
                  journeyKey: tripSsr.journeyKey,
                  ssrCategory: taken.bundleCode
                    ? taken.bundleCode
                    : meal.category,
                  bundleTotalPrice: primeBundlePrice,
                },
              ];
            }
            // Old Code:
            // } else {
            //  isCpml = true;
            // }
            if (taken.inBundle === true) {
              bundleFareObj.bundleCode = taken.bundleCode;
              bundleFareObj.passengerKeys.push({ keys: taken.passengerKey });
            }
          });
        }
      });
    });

    if (!isEmpty(segment)) {
      if (!isEmpty(takenMeals[ssrIndex])) {
        takenMeals.push(segment);
      } else {
        takenMeals[ssrIndex] = segment;
      }
    }

    if (
      !isEmpty(bundleFareObj.passengerKeys) &&
      bundleFareObj.bundleCode === categoryCodes.mlst
    ) {
      if (!isEmpty(mlstBundleFareTakenSsrData[ssrIndex])) {
        mlstBundleFareTakenSsrData.push(bundleFareObj);
      } else {
        mlstBundleFareTakenSsrData[ssrIndex] = bundleFareObj;
      }

      if (!isEmpty(seatAddedTakenSsrData)[ssrIndex]) {
        seatAddedTakenSsrData.push({ isSelected: true });
      } else {
        seatAddedTakenSsrData[ssrIndex] = { isSelected: true };
      }
    }

    if (
      !isEmpty(bundleFareObj.passengerKeys) &&
      bundleFareObj.bundleCode === categoryCodes.prim
    ) {
      if (!isEmpty(primBundleFareTakenSsrData[ssrIndex])) {
        primBundleFareTakenSsrData.push(bundleFareObj);
      } else {
        primBundleFareTakenSsrData[ssrIndex] = bundleFareObj;
      }

      if (!isEmpty(seatAddedTakenSsrData)[ssrIndex]) {
        seatAddedTakenSsrData.push({ isSelected: true });
      } else {
        seatAddedTakenSsrData[ssrIndex] = { isSelected: true };
      }
    }
  });

  /* Old Code:
  selectedAddonTakenSsrData.forEach((item) => {
    // item.selectedAddone = uniqBy(item.selectedAddone, "passengerKey");

    item.selectedAddone = uniqBy(item.selectedAddone, function (elem) {
      return [elem.passengerKey, elem.addonName].join();
    });
  }); */

  return {
    takenMeals,
    mlstBundleFareTakenSsrData,
    primBundleFareTakenSsrData,
    seatAddedTakenSsrData,
    currencycode,
  };
};

const getTakenMealTotalPriceCount = (takenMeals, currencycode) => {
  const totalMealsPriceCount = [];

  for (const trip in takenMeals) {
    let price = 0;
    let count = 0;
    for (const segment in takenMeals[trip]) {
      for (const passenger in takenMeals[trip][segment]) {
        for (const item in takenMeals[trip][segment][passenger]) {
          price += takenMeals[trip][segment][passenger][item].meal?.price;
          count += 1;
        }
      }
    }

    if (!isEmpty(totalMealsPriceCount[trip])) {
      totalMealsPriceCount.push({ price, count, currencycode });
    } else {
      totalMealsPriceCount[parseInt(trip, 10)] = { price, count, currencycode };
    }
  }

  return totalMealsPriceCount;
};

export const setTakenMealsData = (getAddonSsr, aemMealList, bundles) => {
  const {
    takenMeals,
    mlstBundleFareTakenSsrData,
    primBundleFareTakenSsrData,
    seatAddedTakenSsrData,
    currencycode,
  } = getTakenMeals(getAddonSsr, aemMealList, bundles);

  let totalMealsPriceCount = [];
  if (takenMeals.length > 0 || seatAddedTakenSsrData.length > 0) {
    totalMealsPriceCount = getTakenMealTotalPriceCount(
      takenMeals,
      currencycode,
    );
    return {
      takenMeals,
      totalMealsPriceCountTaken: totalMealsPriceCount,
      totalMealsPriceCount,
      mlstBundleFareTakenSsrData,
      primBundleFareTakenSsrData,
      seatAddedTakenSsrData,
    };
  }
  return {};
};
