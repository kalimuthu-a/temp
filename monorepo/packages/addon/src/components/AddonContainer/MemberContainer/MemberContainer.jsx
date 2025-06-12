import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AppContext } from '../../../context/AppContext';
import MemberCard from './MemberCard';
import MemberBenifit from './MemberBenifit/MemberBenifit';
import { addonActions } from '../../../store/addonActions';
import { getAddReviewSummaryData, removeCPMLMeals } from '../../../functions/mealUtils';
import eventService from '../../../services/event.service';
import { primeVoucherLabel } from '../../../constants';
import { categoryTitleCodes } from '../../../constants/aemAuthoring';

function MemberContainer(props) {
  const {
    mfData,
    categoryCodes,
    tripIndex,
    passengerDetails,
    sliderConfiData,
    isModifyFlow,
    additionSliderData,
    isChangeFlow,
    isVoucherSelected,
    setIsVoucherSelected,
    setVoucherToggle,
    setOpenSlider,
    isOpenSlider,
    isMealWithCoupon,
    setIsOpenPrime,
    isOpenPrime,
    openMemberBenifit,
    setOpenMemberBenifit,
  } = props;

  const {
    state: {
      getAddonData,
      primBundleFare,
      mlstBundleFare,
      selectedMeals,
      confirmedMeals,
      couponData,
      redeemCoupon,
      underTwelveHourFlight,
      totalMealsPriceCount,
      page,
      mealVoucherData,
      passengerMealData,
      mealRedeemCoupon,
      journeyPaxCount,
    },
    dispatch,
  } = React.useContext(AppContext);
  const [isMobile] = useIsMobile();

  const useSsrJourneyCheck = () => {
    if (!confirmedMeals || !getAddonData?.ssr) return false;

    const journeyKeys = Object.values(getAddonData.ssr).map(
      (item) => item.journeyKey,
    );
    const currentJourneyKey = journeyKeys[tripIndex];
    const segmentKeys = getAddonData?.ssr
      ?.find((j) => j?.journeyKey === currentJourneyKey)
      ?.segments?.map((segment) => segment?.segmentKey) || [];
    const ssrJourneyKeys = []; // confirmedMeals?.flatMap((obj) => Object.keys(obj));

    confirmedMeals?.forEach((item) => {
      for (const journeyKey in item) {
        const paxGroups = item[journeyKey] || {};

        const hasValidPax = Object.values(paxGroups).some((paxVal) => paxVal); // checks for any truthy value

        if (hasValidPax) {
          ssrJourneyKeys.push(journeyKey);
        }
      }
    });

    const isJourneyKeyIncluded = ssrJourneyKeys.includes(
      journeyKeys[tripIndex],
    );
    const isSegmentKeyIncluded = segmentKeys?.some((segmentKey) => ssrJourneyKeys?.includes(segmentKey));
    return {
      isJourneyKeyIncluded,
      isSegmentKeyIncluded,
    };
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSliderConfigIndex, setCurrentSliderConfigIndex] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [bundleDataList, setBundleDataList] = useState([]);
  const [mealCount, setMealCount] = useState(0);
  const coupons = couponData?.couponData ?? getAddonData?.Loyalty?.coupons ?? [];
  const [toDisplayCouponsLeft, setToDisplayCouponLeft] = useState(null);
  const benefitCategories = new Set(
    mfData?.memberBenefitsDetails?.map((benefit) => benefit?.markerLabels?.categoryBundleCode) || [],
  );
  const [mealCouponsLeft, setMealCouponsLeft] = useState(0);
  const [initialMealCoupons, setInitialMealCoupons] = useState(0);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isCategory, setIsCategory] = useState("")
  coupons?.forEach((coupon, index) => {
    if (!benefitCategories.has(coupon.category)) {
      coupons.splice(index, 1);
    }
  });

  useEffect(() => {
    const mealCoupon = mealRedeemCoupon?.mealRedeemCoupon?.find(
      (item) => item?.category === categoryCodes.meal,
    )?.couponCode;
    if (mealCoupon?.length) {
      setInitialMealCoupons(mealCoupon?.length || 0);
      return;
    }
    const mealCouponObj =
      getAddonData?.Loyalty?.coupons?.find(
        (item) => item?.category === categoryCodes.meal,
      ) || {};
    setInitialMealCoupons(mealCouponObj?.couponCode?.length || 0);
  }, [getAddonData]);

  const hasPrimeCoupon = coupons.some((coupon) => coupon.category === categoryCodes.prim);
  const hasMealCoupon = coupons.some((coupon) => coupon.category === categoryCodes.meal);

  const extraCoupon = {
    isEmptyPrimeCouponList: true,
    category: categoryCodes.prim,
    couponCode: [],
    couponLeft: 0,
    discountType: null,
    discountValue: 0,
    expiryDate: null,
    name: categoryTitleCodes.prim,
    seriesId: null,
  };
  const extraCouponMeal = {
    isEmptyPrimeCouponList: true,
    category: categoryCodes.meal,
    couponCode: [],
    couponLeft: 0,
    discountType: null,
    discountValue: 0,
    expiryDate: null,
    name: categoryTitleCodes.meal,
    seriesId: null,
  };
  const hasPassengerCoupons = primBundleFare[tripIndex]?.passengerKeysWithCoupon?.length > 0;
  const shouldAddExtraCoupon = hasPassengerCoupons && !hasPrimeCoupon;
  const shouldAddMealCoupon = getAddonData?.Loyalty?.redeemCoupons?.[0]?.couponCode?.length > 0 && !hasMealCoupon;
  let couponList = coupons;

  if (shouldAddExtraCoupon) {
    couponList = [extraCoupon, ...couponList];
  }
  if (shouldAddMealCoupon) {
    couponList = [extraCouponMeal, ...couponList];
  }
  const getCurrentJourneyKey = () => {
    return getAddonData?.ssr?.[tripIndex]?.journeyKey;
  };

  function addNewBundles(data, newBundles) {
    const result = Object.values(data || {});

    newBundles.forEach(({ bundleCode, newTotalPrice }) => {
      result?.push({
        ...result[0],
        pricesByJourney: result?.[0]?.pricesByJourney?.map((journey) => ({
          ...journey,
          totalPrice: newTotalPrice,
        })),
        bundleCode,
      });
    });

    return result;
  }

  useEffect(() => {
    const newBundles = [
      { bundleCode: categoryCodes.meal, newTotalPrice: 0 },
    ];
    const updatedJson = addNewBundles(getAddonData?.bundles, newBundles);
    setBundleDataList(updatedJson);
  }, []);

  useEffect(() => {
    let couponUtilize = 0;
    mealVoucherData?.forEach((item) => {
      item?.SsrDetails?.forEach((ssr) => {
        if (ssr?.CouponCodes) {
          couponUtilize += 1;
        }
      });
    });
    let redeemedAlready = 0;
    redeemedAlready += redeemCoupon?.redeemCoupon?.[0]?.couponCode?.length || 0;
    setMealCouponsLeft(initialMealCoupons + redeemedAlready - couponUtilize);
  }, [mealVoucherData, redeemCoupon, initialMealCoupons]);

  const departureDate = getAddonData?.ssr[tripIndex]?.journeydetail?.departure;

  const filteredBundleList = sliderConfiData?.filter(
    (bundleData) => bundleData.categoryBundleCode === categoryCodes.meal ||
      bundleData.categoryBundleCode === categoryCodes.prim,
  );

  const filterCouponList = () => {
    const newCouponList = [];
    primBundleFare[tripIndex]
      ?.passengerKeysWithCoupon?.forEach((coupon) => {
        if (coupon?.couponcode !== '') {
          newCouponList.push(coupon.couponcode);
        }
      });
    couponData?.couponData?.forEach((couponItem, couponIndex) => {
      if (couponItem.category === categoryCodes?.prim) {
        couponData.couponData[couponIndex].couponCode = [
          ...couponItem.couponCode,
          ...newCouponList,
        ];
        couponData.couponData[couponIndex].couponLeft += newCouponList.length;
      }
    });
    
    dispatch({
      type: addonActions.SET_COUPON_DATA,
      payload: {
        couponData: couponData?.couponData,
      },
    });
  };

  const updateSummaryBundleData = (category) => {
    const segmentData = getAddonData?.ssr[tripIndex];
    let totalPrice = 0;
    const mealsBundleData = cloneDeep(confirmedMeals);
    const ssrObjListToRemove = [];

    getAddonData?.bundles?.forEach((bundleList) => {
      if (bundleList?.bundleCode === category) {
        totalPrice = bundleList?.pricesByJourney?.[tripIndex]?.totalPrice;
      }
    });

    passengerDetails?.forEach((paxObj) => {
      segmentData?.segments?.forEach((segment) => {
        const newMealBuldleData = mealsBundleData?.[tripIndex]?.[segment?.segmentKey]
          ?.[paxObj?.passengerKey]?.[0];
        if (newMealBuldleData && !underTwelveHourFlight) {
          mealsBundleData[tripIndex][segment.segmentKey][paxObj.passengerKey][0].bundleTotalPrice = totalPrice;
          const ssrObj = {
            ssrCode: categoryCodes.primv,
            passengerKey: paxObj?.passengerKey,
            journeyKey: newMealBuldleData?.journeyKey,
            action: 'remove',
          };
          ssrObjListToRemove.push(ssrObj);
        }
      });
    });

    dispatch({
      type: addonActions.SET_BUNDLE_MEALS,
      payload: {
        meals: mealsBundleData,
        priceAndCount: totalMealsPriceCount,
      },
    });

    dispatch({
      type: addonActions.SET_CONFIRMED_MEALS,
      payload: {
        meals: mealsBundleData,
        priceAndCount: totalMealsPriceCount,
      },
    });
    const loyaltyBundleTitle = sliderConfiData?.find(
      (data) => data?.categoryBundleCode === categoryCodes.prim,
    )?.sliderTitle;

    const addReviewSummaryData = getAddReviewSummaryData(
      mealsBundleData,
      loyaltyBundleTitle,
      category,
      totalPrice,
      underTwelveHourFlight,
      {
        passengerDetails,
        segmentData,
      },
      [],
    );
    if (category === categoryCodes.meal) {
      let ssrObj;
      confirmedMeals.forEach((item) => {
        for (const journeyKey in item) {
          const paxGroups = item[journeyKey] || {};
          for (const paxKey in paxGroups) {
            ssrObj = {
              ssrCode: categoryCodes.mealVoucher,
              passengerKey: paxKey,
              journeyKey,
              action: 'remove',
            };
          }
        }
      });
      ssrObjListToRemove.push(ssrObj);
    }
    eventService.update(addReviewSummaryData, ssrObjListToRemove);
  };

  const updateChangeSummaryBundleData = (category) => {
    const segmentData = getAddonData?.ssr[tripIndex];
    let totalPrice = 0;
    const mealsBundleData = cloneDeep(confirmedMeals);
    const ssrObjList = [];

    getAddonData?.ssr?.forEach((ssrData, tripIndexVal) => {
      if (primBundleFare[tripIndexVal]?.isSelected) {
        passengerDetails?.forEach((paxObj) => {
          getAddonData?.bundles?.forEach((bundleList) => {
            if (bundleList?.bundleCode === category) {
              totalPrice = bundleList?.pricesByJourney?.[tripIndexVal]?.totalPrice;
            }
          });

          ssrData?.segments?.forEach((segment) => {
            const newMealBuldleData = mealsBundleData?.[tripIndexVal]?.[segment?.segmentKey]
              ?.[paxObj?.passengerKey]?.[0];
            if (newMealBuldleData && !underTwelveHourFlight) {
              mealsBundleData[tripIndexVal][segment.segmentKey][paxObj.passengerKey][0].bundleTotalPrice = totalPrice;
              primBundleFare?.[tripIndexVal]?.passengerKeysWithCoupon?.forEach((pass) => {
                if (pass?.keys
                  === paxObj.passengerKey
                  && pass?.couponcode
                  && primBundleFare?.[tripIndexVal]?.journeyKey
                  === ssrData?.journeyKey) {
                  // mealsBundleData[tripIndexVal][segment.segmentKey][paxObj.passengerKey][0].bundleTotalPrice = 0;
                  const ssrObj = {
                    addonName: primeVoucherLabel,
                    passengerKey: paxObj.passengerKey,
                    multiplier: 1,
                    ssrCode: categoryCodes.primv,
                    price: mealsBundleData[tripIndexVal]
                      ?.[segment.segmentKey]
                      ?.[paxObj.passengerKey]
                      ?.[0]
                      ?.bundleTotalPrice
                      || totalPrice,
                    journeyKey: newMealBuldleData?.journeyKey,
                    name: primeVoucherLabel,
                    category: categoryCodes.primv,
                    segmentKey: '',
                    earnPoints: 0,
                    discountPercentage: 0,
                    originalPrice: 0,
                    action: 'add',
                  };
                  ssrObjList.push(ssrObj);
                }
              });
            }
          });
        });
      } else {
        passengerDetails?.forEach((paxObj) => {
          ssrData?.segments?.forEach((segment) => {
            const newMealBuldleData = mealsBundleData?.[tripIndexVal]?.[segment?.segmentKey]
              ?.[paxObj?.passengerKey]?.[0];
            if (newMealBuldleData && !underTwelveHourFlight) {
              mealsBundleData[tripIndexVal][segment.segmentKey][paxObj.passengerKey][0].bundleTotalPrice = totalPrice;
            }
          });
        });
      }
    });

    dispatch({
      type: addonActions.SET_BUNDLE_MEALS,
      payload: {
        meals: mealsBundleData,
        priceAndCount: totalMealsPriceCount,
      },
    });

    dispatch({
      type: addonActions.SET_CONFIRMED_MEALS,
      payload: {
        meals: mealsBundleData,
        priceAndCount: totalMealsPriceCount,
      },
    });
    const loyaltyBundleTitle = sliderConfiData?.find(
      (data) => data?.categoryBundleCode === categoryCodes.prim,
    )?.sliderTitle;

    const addReviewSummaryData = getAddReviewSummaryData(
      mealsBundleData,
      loyaltyBundleTitle,
      category,
      totalPrice,
      underTwelveHourFlight,
      {
        passengerDetails,
        segmentData,
      },
      [],
    );
    const updatedReviewSummaryData = [...addReviewSummaryData, ...ssrObjList];
    eventService.update(updatedReviewSummaryData, []);
  };

  const dispatchReviewSummaryMealVocherRemoval = () => {
    const segmentData = getAddonData?.ssr?.[tripIndex];
    const removeArr = [];
    let tempVo = [...mealVoucherData];
    // construct the object similar to prime,
    // active journey using the current trip index, don't remove the entire journey

    passengerDetails?.forEach((paxObj) => {
      segmentData?.segments?.forEach(() => {
        const currentJourneyKey = getAddonData?.ssr?.[tripIndex]?.journeyKey;
        if (currentJourneyKey && !underTwelveHourFlight) {
          // mealsBundleData[tripIndex][segment.segmentKey][paxObj.passengerKey][0].bundleTotalPrice = totalPrice;
          const ssrObj = {
            ssrCode: categoryCodes.mealVoucher,
            passengerKey: paxObj?.passengerKey,
            journeyKey: currentJourneyKey,
            action: 'remove',
            segmentKey: '', // segment?.segmentKey,
          };
          tempVo = tempVo.filter((i) => i?.JourneyKey !== currentJourneyKey);
          removeArr.push(ssrObj);
        }
      });
    });
    if (removeArr?.length > 0) {
      // eventService.update([], removeArr);
      dispatch({
        type: addonActions.SET_MEAL_COUPON_DATA,
        payload: {
          mealVoucherData: [...tempVo],
        },
      });
      dispatch({
        type: addonActions.SET_PASSENGER_MEAL_DATA,
        payload: {
          passengerMealData: [...tempVo],
        },
      });
    }
  };

  const removeAddedCoupon = () => {
    if (mlstBundleFare[0]?.bundleCode === categoryCodes.meal) {
      dispatch({
        type: addonActions.MLST_BUNDLE_FARE_SELECTED,
        payload: {
          ...mlstBundleFare[tripIndex],
          passengerKeysWithCoupon: [],
        },
      });
      updateSummaryBundleData();
    } else if (primBundleFare[tripIndex]?.bundleCode === categoryCodes.prim || primBundleFare[tripIndex]?.isSelected) {
      dispatch({
        type: addonActions.PRIM_BUNDLE_FARE_SELECTED,
        payload: {
          ...primBundleFare[tripIndex],
          passengerKeysWithCoupon: [],
        },
      });
      if (primBundleFare[tripIndex]?.passengerKeysWithCoupon) {
        filterCouponList();
      }
      updateSummaryBundleData(categoryCodes.prim);
    }

    if (
      isMealWithCoupon?.length > 0 ||
      mealVoucherData?.length > 0 ||
      redeemCoupon?.redeemCoupon?.[0]?.couponCode?.length
    ) {
      dispatchReviewSummaryMealVocherRemoval();
      const mealCoupon = JSON.parse(JSON.stringify(couponData));
      const mealCouponIndex = couponData?.couponData?.findIndex(
        (cItem) => cItem.category === categoryCodes.meal,
      );
      const obj = couponData?.couponData?.[mealCouponIndex] || {};

      const foundRedeemCoupons = redeemCoupon?.redeemCoupon || [];
      foundRedeemCoupons.forEach((i) => {
        if (!Array.isArray(i.couponCode)) {
          i.couponCode = [];
        }
        if (Array.isArray(obj.couponCode)) {
          i.couponCode.push(...obj.couponCode);
        }
      });

      if (foundRedeemCoupons?.[0]?.couponCode?.length > 0) {
        foundRedeemCoupons[0].couponLeft =
          foundRedeemCoupons?.[0]?.couponCode?.length;

        mealCoupon.couponData[mealCouponIndex] = foundRedeemCoupons?.[0];

        setInitialMealCoupons(foundRedeemCoupons?.[0]?.couponCode?.length);
        couponList = mealCoupon;

        dispatch({
          type: addonActions.SET_MEAL_REDEEM_DATA,
          payload: {
            mealRedeemCoupon: mealCoupon?.couponData,
          },
        });
        dispatch({
          type: addonActions.SET_REDEEM_COUPON_DATA,
          payload: {
            redeemCoupon: [],
          },
        });
      }
      // old code
      // filterCouponList();
    }
  };
  const removeMealCouponByJourney = () => {
    removeAddedCoupon();
  };

  const addRemoveMemberCoupon = (index, category) => {
    const { isSegmentKeyIncluded } = useSsrJourneyCheck();
    setIsCategory(category)
    if (category === categoryCodes.meal && !isSegmentKeyIncluded) {
      setOpenSlider(true);
      setOpenMemberBenifit(true);
    } else if (category === categoryCodes.prim && primBundleFare[tripIndex]?.isSelected !== true) {
      setIsOpenPrime(true);
    } else if (!isModifyFlow) {
      if (
        isVoucherSelected?.meal ||
        isVoucherSelected?.prime ||
        redeemCoupon?.redeemCoupon?.[0]?.couponCode?.length
      ) {
        setOpenMemberBenifit(false);
        removeAddedCoupon();
        setToDisplayCouponLeft(null);
        // setIsVoucherSelected({ meal: false, prime: false });
        setSelectedCoupon(null);
      } else {
        setOpenMemberBenifit(true);
      }
      if (category !== categoryCodes.meal) setVoucherToggle(true);
    }
   
    setCurrentIndex(index);
    const foundIndex = sliderConfiData?.findIndex((i) => i?.categoryBundleCode === category);
    setCurrentSliderConfigIndex(foundIndex);
  };

  useEffect(() => {
    const index = couponList.findIndex(
      (item) => item.category === categoryCodes.prim,
    );
    
    if (primBundleFare[tripIndex]?.isSelected && primBundleFare?.length >= 0 && isCategory === categoryCodes?.prim) {
      addRemoveMemberCoupon(index, categoryCodes?.prim);
      setOpenMemberBenifit(true)
    }
  }, [isOpenPrime]);
 
  const calculateCouponCounts = (redeemCoupons) => {
    return redeemCoupons?.filter((coupon) => coupon?.ssrKey !== null)?.reduce((acc, current) => {
      const existingEntry = acc?.find(
        (entry) => entry.PassengerKey === current?.passengerKey &&
          entry.JourneyKey === current?.journeyKey,
      );
      if (existingEntry) {
        existingEntry.CouponCount += 1;
      } else {
        acc.push({
          PassengerKey: current?.passengerKey,
          JourneyKey: current?.journeyKey,
          CouponCount: 1,
        });
      }
      return acc;
    }, []);
  };
  const getMealCoupon = () => {
    const mealCoupon = mealRedeemCoupon?.mealRedeemCoupon?.find(
      (item) => item?.category === categoryCodes.meal,
    )?.couponCode;
    if (mealCoupon?.length) {
      return mealCoupon;
    }

    const mealCoupons =
      getAddonData?.Loyalty?.coupons?.find(
        (coupon) => coupon?.category === categoryCodes.meal,
      )?.couponCode || [];

    const redeemedCoupons = getAddonData?.Loyalty?.redeemCoupons
      ?.filter((coupon) => coupon?.ssrKey) // filtering out null/undefined/empty ssrKeys
      .map((coupon) => coupon.couponCode);
    return [...redeemedCoupons, ...mealCoupons];
  };
  const couponsBindingToSsrs = (ssrArray) => {
    let couponIndex = 0;
    return ssrArray?.map((journey) => ({
      ...journey,
      SsrDetails: journey?.SsrDetails?.map((ssrDetail) => {
        const couponCode = getMealCoupon()?.[couponIndex];
        couponIndex += 1;
        return {
          ...ssrDetail,
          CouponCodes: couponCode,
        };
      }),
    }));
  };
  // Count meals for each passengerKey
  const appendMealsSelectedToPassengers = (mealData, passengerDetail) => {
    const mealsSelectedCount = mealData && Object.entries(mealData)?.reduce(
      (acc, [, passengers]) => {
        Object.entries(passengers || {})?.forEach(([passengerKey, meals]) => {
          const validMeals = meals?.filter((meal) => meal?.meal?.price > 0) || [];
          acc[passengerKey] = {
            count: (acc?.[passengerKey]?.count || 0) + (validMeals?.length || 0),
            meals: [...(acc?.[passengerKey]?.meals || []), ...validMeals],
          };
        });
        return acc;
      },
      {},
    );
    return passengerDetail?.map((passenger) => {
      const { passengerKey } = passenger;
      return {
        ...passenger,
        mealsSelected: mealsSelectedCount?.[passengerKey]?.count || 0,
        meals: mealsSelectedCount?.[passengerKey]?.meals || [],
      };
    });
  };

  const onPrimeRemove = () => {
    if (!isModifyFlow) {
      setIsVoucherSelected({ prime: false });
      setSelectedCoupon(null);
    }
  };
  const updatePassengerDataArray = (passengerKey, ssrDetails, journeyKey) => {
    const tempPassengerMealData = [...passengerMealData];
    const existingIndex = tempPassengerMealData?.findIndex(
      (pax) => pax?.PassengerKey === passengerKey && pax?.JourneyKey === journeyKey,
    );
    const updatedCouponData = [...tempPassengerMealData];
    if (existingIndex !== -1) {
      updatedCouponData[existingIndex].SsrDetails = ssrDetails;
    } else {
      updatedCouponData.push({
        JourneyKey: journeyKey,
        PassengerKey: passengerKey,
        SsrDetails: ssrDetails,
      });
    }
    dispatch({
      type: addonActions.SET_PASSENGER_MEAL_DATA,
      payload: {
        passengerMealData: updatedCouponData,
      },
    });
    return updatedCouponData;
  };
  const updateMealCouponStatus = (
    passengerData,
    voucherSelected,
    index,
    mealPassengerData,
    isVoucherAppliedMealChanged,
  ) => {
    let tIndex;
    if (getAddonData?.ssr?.length >= 2 && index !== undefined) {
      tIndex = index;
      const sameJourneyKey = mealPassengerData?.every(
        (passenger, _, arr) => passenger?.journeyKey === arr?.[0]?.journeyKey,
      );
      if (mealPassengerData?.length === 1 || sameJourneyKey) {
        tIndex =
          passengerData?.meals?.[0]?.journeyKey === getCurrentJourneyKey()
            ? 0
            : 1;
      }
    } else {
      tIndex = tripIndex;
    }
    const segmentData = getAddonData?.ssr[tIndex];
    const passengerKey = passengerData?.passengerKey;
    const segmentKeys = segmentData?.segments?.map(
      (segment) => segment?.segmentKey,
    );
    let combinedMealsData = [];

    segmentKeys?.forEach((segmentKey) => {
      const mealsData =
      confirmedMeals?.[tIndex]?.[segmentKey]?.[passengerKey];
      if (mealsData) {
        const passengerMeals = mealsData?.filter((meal) => meal?.meal?.passengersSSRKey?.some(
          (pax) => pax?.passengerKey === passengerKey,
        ));

        combinedMealsData = [
          ...combinedMealsData,
          ...passengerMeals.map((meal) => ({ ...meal, segmentKey })),
        ];
      }
    });

    let sortedMeals = combinedMealsData.sort(
      (a, b) => b.meal.price - a.meal.price,
    );
    if (isModifyFlow && !isVoucherAppliedMealChanged) {
      sortedMeals = combinedMealsData.sort(
        (a, b) => a.isTaken - b.isTaken || b.meal.price - a.meal.price,
      );
    }
    const appliedMeals = new Set();
    const couponApplied = [];
    let vouchersRemaining = voucherSelected;

    // Special condition: Apply vouchers to both identical meals
    if (voucherSelected === 2 && combinedMealsData?.length === 2) {
      const [meal1, meal2] = combinedMealsData;
      if (meal1?.meal?.ssrCode === meal2?.meal?.ssrCode) {
        couponApplied.push({
          PassengerKey: passengerKey,
          JourneyKey: passengerData?.meals?.[0]?.journeyKey,
          SsrKey: meal1?.meal?.passengersSSRKey?.find(
            (pax) => pax?.passengerKey === passengerKey,
          )?.ssrKey || null,
          Price: meal1?.meal?.price || null,
          SegmentKey: meal1?.segmentKey,
        });
        vouchersRemaining -= 1;

        couponApplied.push({
          PassengerKey: passengerKey,
          JourneyKey: passengerData?.meals?.[0]?.journeyKey,
          SsrKey: meal2?.meal?.passengersSSRKey?.find(
            (pax) => pax?.passengerKey === passengerKey,
          )?.ssrKey || null,
          Price: meal2?.meal?.price || null,
          SegmentKey: meal2?.segmentKey,
        });
        vouchersRemaining -= 1;
        return updatePassengerDataArray(passengerKey, couponApplied, passengerData?.meals?.[0]?.journeyKey);
      }
    }
    // Default logic: Apply vouchers in descending price order
    sortedMeals.forEach((meal) => {
      const mealType = meal?.meal?.ssrCode;
      const isMealAlreadyApplied = appliedMeals.has(mealType);
      // Apply voucher only if the meal type is not already applied in another segment
      if (!isMealAlreadyApplied && vouchersRemaining > 0 && meal?.meal?.price > 0) {
        couponApplied.push({
          PassengerKey: passengerKey,
          JourneyKey: passengerData?.meals?.[0]?.journeyKey,
          SsrKey: meal?.meal?.passengersSSRKey?.find(
            (pax) => pax?.passengerKey === passengerKey,
          )?.ssrKey || null,
          Price: meal?.meal?.price || null,
          SegmentKey: meal?.segmentKey,
        });
        appliedMeals.add(mealType);
        vouchersRemaining -= 1;
      }
    });
    return updatePassengerDataArray(passengerKey, couponApplied, passengerData?.meals?.[0]?.journeyKey);
  };
  const handleOnChangeMealForVocher = () => {
    let temp = [...mealVoucherData];
    let isAnychange = false;
    const currentJourneyKey = getAddonData?.ssr?.[tripIndex]?.journeyKey;
    const mealVocherIndex = temp.findIndex(
      (m) => m.JourneyKey === currentJourneyKey,
    );
    const newConfirmedMeal = isModifyFlow ? removeCPMLMeals(confirmedMeals?.[tripIndex]) : confirmedMeals?.[tripIndex];
    if (mealVocherIndex !== -1) {
      const mealsWisePassengerData = appendMealsSelectedToPassengers(
        newConfirmedMeal,
        passengerDetails,
      );
      let couponCount = [];
      if (journeyPaxCount?.length > 0) {
        couponCount = journeyPaxCount;
      } else {
        couponCount = calculateCouponCounts(
          getAddonData?.Loyalty?.redeemCoupons,
        );
      }
      if (couponCount?.length > 0) {
        mealsWisePassengerData?.forEach((passenger) => {
          const matchingCoupon = couponCount?.find(
            (coupon) => coupon?.PassengerKey === passenger?.passengerKey,
          );
          passenger.couponAppliedCount = matchingCoupon
            ? matchingCoupon?.CouponCount
            : 0;
        });
        let formedSsrArray = [];
        const redeemedCoupons = getAddonData?.Loyalty?.redeemCoupons;
        mealsWisePassengerData.forEach((passengerData) => {
          const isVoucherAppliedMealChanged = redeemedCoupons?.filter((coupon) => coupon?.ssrKey)
            ?.filter(
              (coupon) => coupon?.passengerKey === passengerData?.passengerKey,
            )
            ?.every((coupon) => passengerData?.meals?.some(
              (meal) => meal?.passengerSSRKey &&
                meal?.passengerSSRKey?.takenSsrKey === coupon?.ssrKey,
            ));
          formedSsrArray = updateMealCouponStatus(
            passengerData,
            passengerData?.couponAppliedCount,
            undefined,
            undefined,
            isVoucherAppliedMealChanged,
          );
        });
        if (formedSsrArray?.length) {
          temp = couponsBindingToSsrs(formedSsrArray);
        }
        temp = temp?.filter((item) => item?.SsrDetails?.length > 0);
        dispatch({
          type: addonActions.SET_MEAL_COUPON_DATA,
          payload: {
            mealVoucherData: [...temp],
          },
        });
        dispatch({
          type: addonActions.SET_PASSENGER_MEAL_DATA,
          payload: {
            passengerMealData: [...temp],
          },
        });
      }

      temp?.[mealVocherIndex]?.SsrDetails?.forEach((sItem) => {
        const ssrKeyInVocher = sItem?.SsrKey;
        const vocherPaxKey = sItem?.PassengerKey;
        const listofSSR = [];
        const currentJourneySelectedMeal = newConfirmedMeal || {};
        const paxwiseMeal = Object.values(currentJourneySelectedMeal) || [];
        let currentPaxMeal = [];

        paxwiseMeal.forEach((t) => {
          const container = t[vocherPaxKey] || [];
          currentPaxMeal = [...currentPaxMeal, ...container];
        });

        currentPaxMeal.forEach((item) => {
          listofSSR.push(item?.passengerSSRKey?.ssrKey);
          listofSSR.push(item?.passengerSSRKey?.takenssrkey);
        });

        if (!listofSSR.includes(ssrKeyInVocher)) {
          temp[mealVocherIndex].SsrDetails = temp[
            mealVocherIndex
          ].SsrDetails.filter((item) => item.SsrKey !== ssrKeyInVocher);
          isAnychange = true;
        }
      });
      const filteredPassengers = mealsWisePassengerData.filter((passenger) => passenger.meals.length > 0);
      temp = temp?.filter(
        (ssr) => (filteredPassengers?.some(
          (passenger) => passenger?.passengerKey === ssr?.PassengerKey &&
              passenger?.meals?.some((meal) => meal?.meal?.ssrCode),
        ) ||
            ssr?.JourneyKey !== currentJourneyKey ||
            filteredPassengers?.some(
              (passenger) => passenger?.passengerKey === ssr?.PassengerKey &&
                passenger?.meals?.length > 0,
            )) &&
          ssr?.SsrDetails?.every((detail) => detail?.CouponCodes !== undefined),
      );
      dispatch({
        type: addonActions.SET_MEAL_COUPON_DATA,
        payload: {
          mealVoucherData: [...temp],
        },
      });
      dispatch({
        type: addonActions.SET_PASSENGER_MEAL_DATA,
        payload: {
          passengerMealData: [...temp],
        },
      });
    }

    if (isAnychange) {
      const filteredData = temp.filter((item) => item?.SsrDetails?.length > 0);
      dispatch({
        type: addonActions.SET_MEAL_COUPON_DATA,
        payload: {
          mealVoucherData: [...filteredData],
        },
      });
      dispatch({
        type: addonActions.SET_PASSENGER_MEAL_DATA,
        payload: {
          passengerMealData: [...filteredData],
        },
      });
      // dispatchReviewSummaryMealVocherRemoval();
    }
  };
  useEffect(() => {
    const couponDataList = couponList;
    dispatch({
      type: addonActions.SET_COUPON_DATA,
      payload: {
        couponData: couponDataList,
      },
    });
    if (toDisplayCouponsLeft) setToDisplayCouponLeft(null);
  }, [openMemberBenifit,couponList]);
  useEffect(() => {
    if (confirmedMeals?.length > 0) {
      let totalMealCount = 0;
      confirmedMeals?.forEach((journey) => {
        if (journey) {
          Object.keys(journey).forEach((journeyKey) => {
            const journeyData = journey?.[journeyKey];
            if (journeyData && Object.keys(journeyData)?.length > 0) {
              Object.keys(journeyData).forEach((passengerKey) => {
                const meals = journeyData?.[passengerKey];

                if (Array.isArray(meals)) {
                  totalMealCount += meals.length;
                }
              });
            }
          });
        }
      });
      setMealCount(totalMealCount);
    }
    // handling on remove meal then associated coupon also should get removed - START
    if (!isSubmitClicked) {
      handleOnChangeMealForVocher();
    }
    setIsSubmitClicked(false);
    // handling on remove meal then associated coupon also should get removed - END
  }, [confirmedMeals]);

  const formatRedeemCouponToMealVoucher = () => {
    // Use the extracted function to calculate coupon counts
    let mealsWisePassengerData = [];
    confirmedMeals.forEach((journey) => {
      const passengerData = appendMealsSelectedToPassengers(
        journey,
        passengerDetails,
      );
      mealsWisePassengerData = [...mealsWisePassengerData, ...passengerData];
    });
    const transformedData = calculateCouponCounts(
      getAddonData?.Loyalty?.redeemCoupons,
    );
    mealsWisePassengerData?.forEach((passenger) => {
      const matchingCoupon = transformedData?.find(
        (coupon) => coupon?.PassengerKey === passenger?.passengerKey &&
          coupon?.JourneyKey === passenger?.meals?.[0]?.journeyKey,
      );
      passenger.couponAppliedCount = matchingCoupon ? matchingCoupon.CouponCount : 0;
    });
    const formedArr = [];

    let formedSsrArray = [];
    mealsWisePassengerData = mealsWisePassengerData?.filter((passenger) => passenger?.couponAppliedCount > 0);
    mealsWisePassengerData.forEach((passengerData, index) => {
      formedSsrArray =
        updateMealCouponStatus(
          passengerData,
          passengerData?.couponAppliedCount,
          index,
          mealsWisePassengerData,
        );
      formedArr.push(formedSsrArray?.[0]);
    });
    let tempData = couponsBindingToSsrs(formedArr);
    tempData = tempData?.filter((item) => item?.SsrDetails?.length > 0);
    dispatch({
      type: addonActions.SET_MEAL_COUPON_DATA,
      payload: {
        mealVoucherData: [...tempData],
      },
    });
    dispatch({
      type: addonActions.SET_PASSENGER_MEAL_DATA,
      payload: {
        passengerMealData: [...tempData],
      },
    });
  };

  useEffect(() => {
    if (!primBundleFare[tripIndex]?.isSelected) {
      const selectedJourney = mealVoucherData?.find((item) => item?.JourneyKey === getCurrentJourneyKey());
      const isMealSelected = selectedJourney?.SsrDetails?.length > 0;
      setIsVoucherSelected({ prime: false, meal: isMealSelected });
    } else if (primBundleFare[tripIndex]?.isSelected) {
      const isPrimeVocherSelected = primBundleFare[tripIndex]?.passengerKeysWithCoupon?.length > 0;
      setIsVoucherSelected({ prime: isPrimeVocherSelected });
      setSelectedCoupon(primBundleFare[tripIndex]?.bundleCode);
    }
    const isJourneyKeySame = mealVoucherData?.some((entry1) => primBundleFare?.some(
      (entry2) => entry2?.journeyKey === entry1?.JourneyKey,
    ));
    if (primBundleFare[tripIndex]?.isSelected && isVoucherSelected?.meal && isJourneyKeySame) {
      // we need to remove the meal coupon from the meal bundle if the prime bundle is selected
      removeMealCouponByJourney();
    }
  }, [primBundleFare[tripIndex]?.isSelected, primBundleFare[tripIndex]?.passengerKeysWithCoupon]);
  useEffect(() => {
    const selectedJourney = mealVoucherData?.find((item) => item?.JourneyKey === getCurrentJourneyKey());
    if (!selectedJourney?.SsrDetails?.length) {
      const isPrimeVocherSelected = primBundleFare[tripIndex]?.passengerKeysWithCoupon?.length > 0;
      setIsVoucherSelected({ meal: false, prime: isPrimeVocherSelected });
    } else if (selectedJourney?.SsrDetails?.length) {
      setIsVoucherSelected({ meal: true });
    }
  }, [
    mealVoucherData,
    tripIndex,
  ]);
  useEffect(() => {
    if (getAddonData?.Loyalty?.redeemCoupons?.length > 0) {
      updateChangeSummaryBundleData(categoryCodes.prim);
    }
  }, [getAddonData?.Loyalty?.redeemCoupons, primBundleFare]);
  useEffect(() => {
    setTimeout(() => {
      if (
        getAddonData?.Loyalty?.redeemCoupons?.length &&
        confirmedMeals?.length > 0
      ) {
        formatRedeemCouponToMealVoucher();
      }
    }, 200);
  }, []);

  const { memberBenefitsLabel } = mfData || {};

  return (
    getAddonData?.Loyalty && (
      <>
        <div className={`${!isMobile && 'skyplus-addon-mf__carousel addon-carousel'}`}>
          <div className="skyplus-loyalty-member__heading">{memberBenefitsLabel}</div>
          <div className="voucher-container">
            {couponList?.map((couponDataList, index) => (
              <MemberCard
                {...couponDataList}
                setOpenMemberBenifit={setOpenMemberBenifit}
                mfData={mfData}
                index={index}
                isModifyFlow={isModifyFlow}
                primeBundleData={primBundleFare}
                mealBundleData={mlstBundleFare}
                isVoucherSelected={isVoucherSelected}
                selectedCoupon={selectedCoupon}
                addRemoveMemberCoupon={addRemoveMemberCoupon}
                useSsrJourneyCheck={useSsrJourneyCheck}
                bundleDataList={bundleDataList}
                passengerDetails={passengerDetails}
                tripIndex={tripIndex}
                isChangeFlow={isChangeFlow}
                departureDate={departureDate}
                couponDetailList={couponData}
                onPrimeRemove={onPrimeRemove}
                mealCouponsLeft={mealCouponsLeft}
                setOpenSlider={setOpenSlider}
                mealCount={mealCount}
                page={page}
                segmentData={getAddonData?.ssr?.[tripIndex]}
                toDisplayCouponsLeft={toDisplayCouponsLeft}
                setToDisplayCouponLeft={setToDisplayCouponLeft}
                getCurrentJourneyKey={getCurrentJourneyKey}
                additionSliderData={additionSliderData}
              />
            ))}
          </div>
          {
            !isMobile
            && (
            <div className="skyplus-loyalty-member__info-container">
              <i className="icon-info" />
              <span
                dangerouslySetInnerHTML={{
                  __html: mfData?.addOnActivateVoucherText?.html,
                }}
              />
            </div>
            )
}
        </div>
        {openMemberBenifit && (
          <MemberBenifit
            segmentData={getAddonData?.ssr[tripIndex]}
            ssrCategory={categoryCodes.prim}
            setOpenMemberBenifit={setOpenMemberBenifit}
            passengerDetails={passengerDetails}
            sliderConfiData={filteredBundleList}
            index={currentIndex}
            mfData={mfData}
            couponList={couponList}
            bundleDataList={bundleDataList}
            primeBundleData={primBundleFare}
            mealBundleData={mlstBundleFare}
            tripIndex={tripIndex}
            isOpen={openMemberBenifit}
            setIsVoucherSelected={setIsVoucherSelected}
            isVoucherSelected={isVoucherSelected}
            setSelectedCoupon={setSelectedCoupon}
            additionSliderData={additionSliderData}
            confirmedMeals={confirmedMeals}
            couponDetailList={couponData}
            underTwelveHourFlight={underTwelveHourFlight}
            totalMealsPriceCount={totalMealsPriceCount}
            selectedMeals={selectedMeals}
            initialCoupons={mealCouponsLeft}
            mealCouponsLeft={mealCouponsLeft}
            sliderConfiAemData={sliderConfiData}
            page={page}
            passengerMealData={passengerMealData}
            setToDisplayCouponLeft={setToDisplayCouponLeft}
            currentSliderConfigIndex={currentSliderConfigIndex}
            updateMealCouponStatus={updateMealCouponStatus}
            couponsBindingToSsrs={couponsBindingToSsrs}
            setIsSubmitClicked={setIsSubmitClicked}
            isCategory={isCategory}
          />
        )}
      </>
    )
  );
}

MemberContainer.propTypes = {
  mfData: PropTypes.object,
  categoryCodes: PropTypes.string,
  tripIndex: PropTypes.number,
  passengerDetails: PropTypes.object,
  sliderConfiData: PropTypes.object,
  isModifyFlow: PropTypes.bool,
  additionSliderData: PropTypes.object,
  isChangeFlow: PropTypes.bool,
  isVoucherSelected: PropTypes.object,
  setIsVoucherSelected: PropTypes.func,
  setVoucherToggle: PropTypes.func,
  setOpenSlider: PropTypes.func,
  isOpenSlider: PropTypes.bool,
  isMealWithCoupon: PropTypes.any,
  setIsOpenPrime: PropTypes.func,
  isOpenPrime: PropTypes.bool,
  openMemberBenifit: PropTypes.bool,
  setOpenMemberBenifit: PropTypes.func,
};

export default MemberContainer;
