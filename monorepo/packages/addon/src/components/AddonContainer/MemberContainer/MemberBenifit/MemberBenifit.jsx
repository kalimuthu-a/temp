import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import MemberBenifitSlider from './MemberBenifitSlider';
import { categoryCodes, primeVoucherLabel, mealVoucherLabel } from '../../../../constants';
import { addonActions } from '../../../../store/addonActions';
import { getAddReviewSummaryData } from '../../../../functions/mealUtils';
import eventService from '../../../../services/event.service';
import { AppContext } from '../../../../context/AppContext';

function MemberBenifit(props) {
  const {
    state: { page, getAddonData, mealRedeemCoupon, journeyPaxCount, ...state },
    dispatch,
  } = React.useContext(AppContext);

  const {
    passengerDetails,
    setOpenMemberBenifit,
    sliderConfiData,
    index,
    couponList,
    bundleDataList,
    primeBundleData,
    mealBundleData,
    tripIndex,
    isOpen,
    isVoucherSelected,
    setSelectedCoupon,
    mfData,
    additionSliderData,
    confirmedMeals,
    segmentData,
    couponDetailList,
    underTwelveHourFlight,
    totalMealsPriceCount,
    initialCoupons,
    mealCouponsLeft,
    setIsCouponApplied,
    passengerMealData,
    setToDisplayCouponLeft,
    currentSliderConfigIndex,
    updateMealCouponStatus,
    couponsBindingToSsrs,
    setIsSubmitClicked,
    isCategory,
  } = props || {};
  useEffect(() => {
    return () => {
      setToDisplayCouponLeft(null);
    };
  }, []);

  const [passengerCouponList, setPassengerCouponList] = useState([]);
  const isPrimeSelected = primeBundleData?.[tripIndex]?.isSelected;
  const isMeal = !isPrimeSelected;

  const loyaltyBundleTitle = sliderConfiData[currentSliderConfigIndex].sliderTitle;

  const updateSummaryBundleData = (bundleDataListWithCoupon) => {
    const mealsBundleData = cloneDeep(confirmedMeals);
    const ssrObjList = [];

    const label = isMeal ? mealVoucherLabel : primeVoucherLabel;
    const code = isMeal ? categoryCodes.mealVoucher : categoryCodes.primv;
    const multiplier = 1;

    if (!isMeal) {
      bundleDataListWithCoupon?.forEach((paxObj) => {
        if (paxObj?.couponcode !== '') {
          segmentData?.segments?.forEach((segment) => {
            const newMealBuldleData = mealsBundleData?.[tripIndex]?.[segment?.segmentKey];
            if (newMealBuldleData && !underTwelveHourFlight) {
              // mealsBundleData[tripIndex][segment.segmentKey][paxObj.keys][0].bundleTotalPrice = 0;
              const ssrObj = {
                addonName: label,
                passengerKey: paxObj.keys,
                multiplier,
                ssrCode: code,
                price: mealsBundleData[tripIndex][segment.segmentKey][paxObj.keys][0].bundleTotalPrice,
                journeyKey: newMealBuldleData?.[paxObj.keys]?.[0]?.journeyKey,
                name: label,
                category: code,
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
    }
    let bunldePrice = 0;
    bundleDataList?.forEach((bundleList) => {
      if (bundleList?.bundleCode === categoryCodes?.prim) {
        bunldePrice = bundleList?.pricesByJourney?.[tripIndex]?.totalPrice;
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

    const addReviewSummaryData = getAddReviewSummaryData(
      mealsBundleData,
      loyaltyBundleTitle,
      primeBundleData[tripIndex]?.bundleCode,
      bunldePrice,
      underTwelveHourFlight,
      {
        passengerDetails,
        segmentData,
      },
      bundleDataListWithCoupon,
    );
    if (!isMeal) {
      const toPassSsrObj = ssrObjList;
      const updatedReviewSummaryData = [
        ...addReviewSummaryData,
        ...toPassSsrObj,
      ];

      eventService.update(updatedReviewSummaryData, []);
    }
  };

  // Submit function
  const memberSubmitHandler = (passengerMealCouponData) => {
    if (isMeal) {
      dispatch({
        type: addonActions.MLST_BUNDLE_FARE_SELECTED,
        payload: {
          ...mealBundleData[tripIndex],
          passengerKeysWithCoupon: passengerCouponList,
        },
      });
      setSelectedCoupon(categoryCodes.meal);
      updateSummaryBundleData(passengerCouponList);
    } else {
      dispatch({
        type: addonActions.PRIM_BUNDLE_FARE_SELECTED,
        payload: {
          ...primeBundleData[tripIndex],
          passengerKeysWithCoupon: passengerCouponList,
        },
      });
      setSelectedCoupon(categoryCodes.prim);
      updateSummaryBundleData(passengerCouponList);
    }
    setOpenMemberBenifit(false);
  };

  const filterCouponList = () => {
    const newCouponList = [];
    passengerCouponList?.forEach((coupon) => {
      if (coupon?.couponcode !== '') {
        newCouponList.push(coupon.couponcode);
      }
    });
    couponDetailList?.couponData
      ?.forEach((couponItem, couponIndex) => {
        if (couponItem.category === categoryCodes?.prim && isCategory=== categoryCodes?.prim) {
          couponDetailList.couponData[couponIndex].couponCode = [
            ...couponItem.couponCode,
            ...newCouponList,
          ];
          couponDetailList.couponData[couponIndex].couponLeft +=
            newCouponList.length;
        }
      });
    dispatch({
      type: addonActions.SET_COUPON_DATA,
      payload: {
        couponData: couponDetailList?.couponData,
      },
    });
  };

  const submitDetails = () => {
    let couponData;
    if (passengerMealData) {
      couponData = couponsBindingToSsrs(passengerMealData);
      const result = couponData?.map((entry) => ({
        PassengerKey: entry?.PassengerKey,
        JourneyKey: entry?.JourneyKey,
        CouponCount: entry?.SsrDetails?.length,
      }));
      const tempCountMap = new Map();
      journeyPaxCount?.forEach((entry) => {
        const uniqueKey = `${entry?.PassengerKey}-${entry?.JourneyKey}`;
        tempCountMap.set(uniqueKey, entry);
      });
      result?.forEach((entry) => {
        const uniqueKey = `${entry?.PassengerKey}-${entry?.JourneyKey}`;
        tempCountMap.set(uniqueKey, entry);
      });
      const tempCount = Array.from(tempCountMap?.values());
      setIsSubmitClicked(true);
      dispatch({
        type: addonActions.SET_JOURNEY_PAX_COUNT,
        payload: {
          journeyPaxCount: tempCount,
        },
      });

      dispatch({
        type: addonActions.SET_MEAL_COUPON_DATA,
        payload: {
          mealVoucherData: couponData,
        },
      });
    }
    memberSubmitHandler(couponData);
  };

  // Member data object
  const addOnCardMemberProps = {
    setOpenSlider: () => setOpenMemberBenifit(true),
    onClose: () => {
      setOpenMemberBenifit(false);
      filterCouponList();
      const removePasenger = passengerMealData?.filter(
        (item) => item.JourneyKey !== getAddonData?.ssr?.[tripIndex]?.journeyKey,
      );
      
      if(passengerMealData)
      {
        dispatch({
          type: addonActions.SET_PASSENGER_MEAL_DATA,
          payload: {
            passengerMealData: removePasenger,
          },
        });
      }
    },
    onSubmitHandler: () => memberSubmitHandler(),
  };

  return (
    <div key={index}>
      <MemberBenifitSlider
        addOnCardMemberProps={addOnCardMemberProps}
        passengerDetails={passengerDetails}
        sliderConfiData={sliderConfiData}
        index={index}
        couponList={couponList}
        mfData={mfData}
        bundleDataList={bundleDataList}
        primeBundleData={primeBundleData}
        mealBundleData={mealBundleData}
        tripIndex={tripIndex}
        isOpen={isOpen}
        setPassengerCouponList={setPassengerCouponList}
        passengerCouponList={passengerCouponList}
        isVoucherSelected={isVoucherSelected}
        additionSliderData={additionSliderData}
        couponDetailList={couponDetailList}
        confirmedMeals={confirmedMeals}
        segmentData={segmentData}
        initialCoupons={initialCoupons}
        mealCouponsLeft={mealCouponsLeft}
        passengerMealData={passengerMealData}
        setIsCouponApplied={setIsCouponApplied}
        couponListData={couponList}
        setToDisplayCouponLeft={setToDisplayCouponLeft}
        submitDetails={submitDetails}
        updateMealCouponStatus={updateMealCouponStatus}
        page={page}
      />
    </div>
  );
}

export default MemberBenifit;
