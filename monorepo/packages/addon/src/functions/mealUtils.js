import { categoryCodes, ssrCodes } from '../constants/index';

/**
 *
 * @param {*} changedMeals
 * @param {string} addonName
 * @param {string} bundleCode
 * @param {number} bundlePrice
 * @param {boolean} underTwelveHourFlight
 * @param {{passengerDetails?: Array<*>, segmentData?: {journeyKey: string}, ssrCategory?: string}} cardData
 * @returns {Array<*>}
 */

const getPriceBasedOnCouponData = (bundleData, paxIndex, bundlePrice) => {
  if (bundleData?.length > 0 && bundleData?.[paxIndex]?.couponcode !== '') {
    return 0;
  }
  return bundlePrice;
};

export const getAddReviewSummaryData = (
  changedMeals,
  addonName,
  bundleCode = '',
  bundlePrice = 0,
  underTwelveHourFlight = false,
  cardData = {},
  bundleDataListWithCoupon,
) => {
  const addReviewSummaryData = [];

  if (underTwelveHourFlight) {
    const { passengerDetails, segmentData } = cardData;

    const { journeyKey } = segmentData;
    passengerDetails.forEach((passenger, paxIndex) => {
      const catObj = {
        addonName,
        passengerKey: passenger.passengerKey,
        multiplier: 1,
        ssrCode: bundleCode,
        price: getPriceBasedOnCouponData(
          bundleDataListWithCoupon,
          paxIndex,
          bundlePrice,
        ),
        journeyKey,
        name: addonName,
        category: bundleCode,
        action: 'add',
      };
      addReviewSummaryData.push(catObj);
    });

    return addReviewSummaryData;
  }

  for (const tripkey in changedMeals) {
    for (const segmentKey in changedMeals[tripkey]) {
      for (const passengerKey in changedMeals[tripkey][segmentKey]) {
        for (const item in changedMeals[tripkey][segmentKey][passengerKey]) {
          const mealItem =
            changedMeals[tripkey][segmentKey][passengerKey][item];

          const { prim, mlst } = categoryCodes;

          const mealObj = {
            addonName,
            passengerKey: mealItem.passengerSSRKey.passengerKey,
            multiplier: 1,
            ssrCode: [prim, mlst].includes(mealItem.ssrCategory)
              ? mealItem.ssrCategory
              : mealItem.meal.ssrCode,
            price: [prim, mlst].includes(mealItem.ssrCategory)
              ? mealItem.bundleTotalPrice
              : mealItem.meal.price,
            journeyKey: mealItem.journeyKey,
            name: [prim, mlst].includes(mealItem.ssrCategory)
              ? addonName
              : mealItem.meal.name,
            category: mealItem.ssrCategory,
            segmentKey: mealItem.segmentKey,
            action: 'add',
          };

          addReviewSummaryData.push(mealObj);
        }
      }
    }
  }

  return addReviewSummaryData;
};

/**
 *
 * @param {*} confirmedMeals
 * @param {*} underTwelveHourFlight
 * @param {{passengerDetails?: Array<*>, segmentData?: {journeyKey: string}, ssrCategory?: string}} cardData
 * @returns {Array<*>}
 */
export const getRemoveReviewSummaryData = (
  confirmedMeals,
  underTwelveHourFlight = false,
  cardData = {},
) => {
  const removeReviewSummaryData = [];

  const { journeyKey } = cardData.segmentData;

  if (underTwelveHourFlight) {
    const { passengerDetails, segmentData, ssrCategory } = cardData;
    const { journeyKey } = segmentData;
    passengerDetails.forEach((passenger) => {
      const catObj = {
        passengerKey: passenger.passengerKey,
        ssrCode: ssrCategory,
        journeyKey,
        action: 'remove',
      };
      const couponObj = {
        passengerKey: passenger.passengerKey,
        ssrCode: categoryCodes.primv,
        journeyKey,
        action: 'remove',
      };
      removeReviewSummaryData.push(catObj);
      removeReviewSummaryData.push(couponObj);
    });
    return removeReviewSummaryData;
  }

  for (const tripkey in confirmedMeals) {
    for (const segmentKey in confirmedMeals[tripkey]) {
      for (const passengerKey in confirmedMeals[tripkey][segmentKey]) {
        for (const item in confirmedMeals[tripkey][segmentKey][passengerKey]) {
          const mealItem =
            confirmedMeals[tripkey][segmentKey][passengerKey][item];

          const { prim, mlst } = categoryCodes;

          if (mealItem.journeyKey === journeyKey) {
            const mealObj = {
              passengerKey: mealItem.passengerSSRKey.passengerKey,
              ssrCode: [prim, mlst].includes(mealItem.ssrCategory)
                ? mealItem.ssrCategory
                : mealItem.meal.ssrCode,
              journeyKey: mealItem.journeyKey,
              segmentKey: mealItem.segmentKey,
              action: 'remove',
              price: mealItem.meal.price,
            };

            const couponObj = {
              passengerKey: mealItem.passengerSSRKey.passengerKey,
              ssrCode: categoryCodes.primv,
              journeyKey,
              action: 'remove',
            };

            removeReviewSummaryData.push(mealObj);
            removeReviewSummaryData.push(couponObj);
          }
        }
      }
    }
  }

  return removeReviewSummaryData;
};
export const removeCPMLMeals = (mealData) => {
  return Object.entries(mealData || {}).reduce(
    (acc, [segmentKey, passengers]) => {
      if (!passengers || typeof passengers !== 'object') return acc;
      const updatedPassengers = Object.entries(passengers).reduce(
        (paxAcc, [passengerKey, meals]) => {
          if (!Array.isArray(meals)) return paxAcc;
          // Filter out CPML meals but retain others
          const filteredMeals = meals.filter(
            (mealObj) => mealObj?.meal?.ssrCode !== ssrCodes?.cpml,
          );
          if (filteredMeals.length > 0) {
            paxAcc[passengerKey] = filteredMeals;
          }
          return paxAcc;
        },
        {},
      );
      if (Object.keys(updatedPassengers).length > 0) {
        acc[segmentKey] = updatedPassengers;
      }
      return acc;
    },
    {},
  );
};
