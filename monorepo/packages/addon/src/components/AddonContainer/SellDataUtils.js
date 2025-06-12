import { categoryCodes } from '../../constants/index';

export const removeDuplicatesBySsrKey = (data) => {
  const ssrMap = {};

  data?.forEach((item) => {
    if (!item?.ssrKey) return;

    const existing = ssrMap[item?.ssrKey];

    // Prefer item with couponCode
    if (!existing || (!existing?.couponCode && item?.couponCode)) {
      ssrMap[item?.ssrKey] = item;
    }
  });

  return Object.values(ssrMap);
};

export const handelTakenSSRkeyRemoval = (data, redeemCoupons,mealVocherData) => {
  const takenSsrKeysWithCoupon = [];
  const takenSellSsrMealKeysWithoutCoupon = [];
  const validRedeemCoupons =
      redeemCoupons?.filter((item) => item?.ssrKey !== null) || [];

  data?.forEach((segmentObj) => {
    Object.values(segmentObj || {}).forEach((passengerMap) => {
      Object.values(passengerMap || {}).forEach((ssrArray) => {
        ssrArray?.forEach((ssr) => {
          const journeyKey = ssr?.journeyKey;
          const takenSsrKey = ssr?.passengerSSRKey?.takenssrkey || ssr?.passengerSSRKey?.takenSsrKey;
          const couponCode = ssr?.passengerSSRKey?.couponCode || '';
          // When reassigning the coupon , prev selected meals which has the coupon code should get resell
          const isCouponSoldBefore = validRedeemCoupons?.find(
            (iu) => iu.ssrKey === takenSsrKey && iu.couponCode === couponCode,
          );
          const isMealSoldWithCoupon = validRedeemCoupons?.find(
            (iu) => iu.ssrKey === takenSsrKey
          );
            if (takenSsrKey && !couponCode && isMealSoldWithCoupon) {
              const obj = {
                ssrKey:  ssr?.passengerSSRKey?.ssrKey,
                count: 1,
                note: '',
                journeyKey,
                ssrCategory: ssr?.ssrCategory,
              };
              takenSellSsrMealKeysWithoutCoupon.push(obj);
              takenSsrKeysWithCoupon.push({ ssrRemoveKeys: takenSsrKey });
            }
          if ((takenSsrKey && couponCode) && !isCouponSoldBefore) {
            const obj = {
              ssrKey: ssr?.passengerSSRKey.ssrKey,
              count: 1,
              note: '',
              journeyKey,
              ssrCategory: ssr?.ssrCategory,
            };
            if (couponCode) {
              obj.couponCode = couponCode;
            }
            takenSellSsrMealKeysWithoutCoupon.push(obj);
            takenSsrKeysWithCoupon.push({ ssrRemoveKeys: takenSsrKey });
          }
        });
      });
    });
  });

  // Logic to remove vocher from meal where that vocher only removed from 1 journey and assign to next - START
  // redeem -> ssr -> find actualssr => meal la exist =? if not exist => then send remove request

  validRedeemCoupons?.forEach((redeemCoupon) => {
    const jKey = redeemCoupon?.journeyKey;
    const redeemSsrKey = redeemCoupon?.ssrKey;
    const currentJourenyMealVocher = mealVocherData?.filter((mI) => mI?.JourneyKey === jKey);
    const currentJourneyMealSSR = currentJourenyMealVocher.flatMap(
      (mI) => mI.SsrDetails || [],
    );
    let actualssr = '';
    const currentJourneyConfirmMeal = data?.find((i) => i?.[jKey]);
    Object.values(currentJourneyConfirmMeal || {}).forEach((passengerMap) => {
       Object.values(passengerMap || {}).forEach((ssrArray) => {
         ssrArray?.forEach((ssr) => {
           const takenSsrKey =
             ssr?.passengerSSRKey?.takenSsrKey ||
             ssr?.passengerSSRKey?.takenssrkey;
           if (redeemSsrKey === takenSsrKey)
             actualssr = ssr?.passengerSSRKey?.ssrKey;
         });
       });
     });
    const isFoundInCurrentMeal = currentJourneyMealSSR?.find(
      (i) => i.SsrKey === actualssr,
    );
    if (!isFoundInCurrentMeal) {
    // SSR not found in current meal list, prepare to remove,
      if(actualssr)
      {
          const obj = {
            ssrKey: actualssr,
            count: 1,
            note: '',
            journeyKey: jKey,
            ssrCategory: 'Meal',
          };
          takenSellSsrMealKeysWithoutCoupon.push(obj);
          takenSsrKeysWithCoupon.push({ ssrRemoveKeys: redeemSsrKey });
      }
    }
  });
  // Logic to remove vocher from meal where that vocher only removed from 1 journey and assign to next - END

  return { takenSsrKeysWithCoupon, takenSellSsrMealKeysWithoutCoupon };
};


export const mergeCouponCodes = (originalData, newData) => {
  const couponMap = new Map();
  newData?.forEach((passenger) => {
    passenger?.SsrDetails?.forEach((ssr) => {
      const key = `${passenger?.PassengerKey}_${ssr?.SsrKey}`;
      couponMap?.set(key, ssr?.CouponCodes);
    });
  });

  originalData?.forEach((entry) => {
    Object.values(entry || {})?.forEach((passengerGroup) => {
      if (!passengerGroup) return;
      Object.values(passengerGroup)?.forEach((passengerArray) => {
        passengerArray?.forEach((item) => {
          const passengerSSR = item?.passengerSSRKey;
          const key = `${passengerSSR?.passengerKey}_${passengerSSR?.ssrKey}`;
          if (couponMap?.has(key)) {
            passengerSSR.couponCode = couponMap?.get(key);
          }
        });
      });
    });
  });

  return originalData;
};

export const sellMealDataForTiffinPrimMlst = (
  confirmedMeals,
  voucherToggle = false,
) => {
  const mealSelectedData = [];
  for (const tripkey in confirmedMeals) {
    for (const segmentKey in confirmedMeals[tripkey]) {
      for (const passengerKey in confirmedMeals[tripkey][segmentKey]) {
        for (const item in confirmedMeals[tripkey][segmentKey][passengerKey]) {
          const mealItem =
            confirmedMeals[tripkey][segmentKey][passengerKey][item];

          if (
            !mealItem.isTaken ||
            (mealItem.isTaken && voucherToggle && mealItem.ssrCategory === categoryCodes.prim)
          ) {
            const sellItem = {
              ssrKey: mealItem?.passengerSSRKey.ssrKey,
              count: 1,
              note: '',
              journeyKey: mealItem?.journeyKey,
              ssrCategory: mealItem?.ssrCategory,
              couponCode: mealItem?.passengerSSRKey?.couponCode,
            };
            mealSelectedData.push(sellItem);
          }
        }
      }
    }
  }

  return mealSelectedData;
};

const takenMealsDataForATrip = (takenMeals, bundleTripKey) => {
  let takenMealSsrCategory = '';
  let takenJourneyKey = '';
  const takenPassengerKey = [];

  if (takenMeals.length > 0) {
    for (const segmentKey in takenMeals[bundleTripKey]) {
      for (const passengerKey in takenMeals[bundleTripKey][segmentKey]) {
        for (const item in takenMeals[bundleTripKey][segmentKey][
          passengerKey
        ]) {
          const paxObj = {
            keys: takenMeals[bundleTripKey][segmentKey][passengerKey][item]
              .passengerSSRKey.passengerKey,
          };
          takenMealSsrCategory =
            takenMeals[bundleTripKey][segmentKey][passengerKey][item]
              .ssrCategory;
          takenJourneyKey =
            takenMeals[bundleTripKey][segmentKey][passengerKey][item]
              .journeyKey;
          takenPassengerKey.push(paxObj);
          if (takenMealSsrCategory) {
            break;
          }
        }
      }
      if (takenMealSsrCategory) {
        break;
      }
    }
  }

  return { takenMealSsrCategory, takenJourneyKey, takenPassengerKey };
};

const primeMealbundleData = (mlstBundleFare, primBundleFare, takenMeals, bundleSelectedData) => {
  if (mlstBundleFare?.length) {
    for (const tripKey in mlstBundleFare) {
      const takenMealDataForATrip = takenMealsDataForATrip(takenMeals, tripKey);
      if (
        !!mlstBundleFare[tripKey] &&
        !!mlstBundleFare[tripKey].bundleCode &&
        mlstBundleFare[tripKey].bundleCode !==
          takenMealDataForATrip.takenMealSsrCategory
      ) {
        const bundleSellItem = {
          journeyKey: mlstBundleFare[tripKey].journeyKey,
          passengerKeys: mlstBundleFare[tripKey].passengerKeys,
          bundleCode: mlstBundleFare[tripKey].bundleCode,
        };

        bundleSelectedData.push(bundleSellItem);
      } else if (
        !!mlstBundleFare[tripKey] &&
        !mlstBundleFare[tripKey].bundleCode &&
        takenMealDataForATrip.takenMealSsrCategory === categoryCodes.mlst &&
        (!primBundleFare[tripKey] ||
          primBundleFare[tripKey].bundleCode !== categoryCodes.prim)
      ) {
        const bundleSellItem = {
          journeyKey: takenMealDataForATrip.takenJourneyKey,
          passengerKeys: takenMealDataForATrip.takenPassengerKey,
          bundleCode: 'BNDR',
        };

        bundleSelectedData.push(bundleSellItem);
      }
    }
  } else if (takenMeals.length > 0) {
    for (const tripKey in takenMeals) {
      const takenMealDataForATrip = takenMealsDataForATrip(
        takenMeals,
        tripKey,
      );
      if (takenMealDataForATrip.takenMealSsrCategory === categoryCodes.mlst) {
        const bundleSellItem = {
          journeyKey: takenMealDataForATrip.takenJourneyKey,
          passengerKeys: takenMealDataForATrip.takenPassengerKey,
          bundleCode: 'BNDR',
        };

        bundleSelectedData.push(bundleSellItem);
      }
    }
  }
};
export const sellBundleDataForPrimMlst = (stateArg) => {
  const { mlstBundleFare, primBundleFare, takenMeals } = stateArg;
  const bundleSelectedData = [];

  primeMealbundleData(mlstBundleFare, primBundleFare, takenMeals, bundleSelectedData);
  if (primBundleFare?.length) {
    for (const tripKey in primBundleFare) {
      const takenMealDataForATrip = takenMealsDataForATrip(takenMeals, tripKey);

      if (
        !!primBundleFare[tripKey] &&
        !!primBundleFare[tripKey].bundleCode
        // to send bundle info in change flow
        // &&
        // primBundleFare[tripKey].bundleCode !==
        //   takenMealDataForATrip.takenMealSsrCategory
      ) {
        const bundleSellItem = {
          journeyKey: primBundleFare[tripKey].journeyKey,
          passengerKeys: primBundleFare[tripKey]?.passengerKeysWithCoupon
            ?.length
            ? primBundleFare[tripKey].passengerKeysWithCoupon
            : primBundleFare[tripKey].passengerKeys,
          bundleCode: primBundleFare[tripKey].bundleCode,
        };

        bundleSelectedData.push(bundleSellItem);
      } else if (
        !!primBundleFare[tripKey] &&
        !primBundleFare[tripKey].bundleCode &&
        takenMealDataForATrip.takenMealSsrCategory === categoryCodes.prim &&
        (!mlstBundleFare[tripKey] ||
          mlstBundleFare[tripKey].bundleCode !== categoryCodes.mlst)
      ) {
        const bundleSellItem = {
          journeyKey: takenMealDataForATrip.takenJourneyKey,
          passengerKeys: takenMealDataForATrip.takenPassengerKey,
          bundleCode: 'BNDR',
        };

        bundleSelectedData.push(bundleSellItem);
      }
    }
  } else if (takenMeals.length > 0) {
    for (const tripKey in takenMeals) {
      const takenMealDataForATrip = takenMealsDataForATrip(
        takenMeals,
        tripKey,
      );

      if (takenMealDataForATrip.takenMealSsrCategory === categoryCodes.prim) {
        const bundleSellItem = {
          journeyKey: takenMealDataForATrip.takenJourneyKey,
          passengerKeys: takenMealDataForATrip.takenPassengerKey,
          bundleCode: 'BNDR',
        };

        bundleSelectedData.push(bundleSellItem);
      }
    }
  }

  return bundleSelectedData;
};
