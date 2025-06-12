import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import OffCanvasFooter from '../../../common/OffCanvasFooter/OffCanvasFooter';
import { paxTrevelType, categoryCodes } from '../../../../constants';
import { addonActions } from '../../../../store/addonActions';
import PassengerListingPage from './PassengerListingPage';
import { AppContext } from '../../../../context/AppContext';

function MemberBenifitSlider(props) {
  const {
    state: {
      page,
      getJourneyKey,
      getAddonData,
      ...state
    },
    dispatch
  } = React.useContext(AppContext);
  const {
    addOnCardMemberProps,
    passengerDetails,
    sliderConfiData,
    index,
    // couponList,
    bundleDataList,
    mealBundleData,
    primeBundleData,
    tripIndex,
    isOpen,
    setPassengerCouponList,
    passengerCouponList,
    isVoucherSelected,
    // mfData,
    additionSliderData,
    couponDetailList,
    confirmedMeals,
    segmentData,
    initialCoupons,
    mealCouponsLeft,
    passengerMealData,
    setToDisplayCouponLeft,
    submitDetails,
    updateMealCouponStatus,
  } = props || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCoupon, setTotalCoupon] = useState(null);
  const [selectAllPassenger, setSelectAllPassenger] = useState(false);
  const [totalActivePassenger, setTotalActivePassenger] = useState(0);
  const [maxPaxCanHaveCoupon, setMaxPaxCanHaveCoupon] = useState(0);
  const [selfAndNomineeCount, setSelfAndNomineeCount] = useState(0);
  const [bunldeObjectData, setBunldeObjectData] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [couponSelected, setCouponSelected] = useState({});
  let currentCouponSelectionCount = 0;
    Object.keys(couponSelected).map(paxkey=>{
      currentCouponSelectionCount += couponSelected[paxkey];
    })
  const toShowMealCoupons = mealCouponsLeft - currentCouponSelectionCount;
  useEffect(() => {
    return () => {
      setToDisplayCouponLeft(null);
    };
  }, []);

  const updateCouponDataList = (count, couponCode) => {
    const couponListData = cloneDeep(couponDetailList);
    couponListData.couponData[index].couponLeft = count;
    let newCouponList = [];
    let couponList = [];
    const removedCouponList = [];
    if (Array.isArray(couponCode)) {
      couponCode?.forEach((couponItem) => {
        if (couponItem.couponcode !== '') {
          removedCouponList?.push(couponItem.couponcode);
          couponList = couponListData.couponData[index]?.couponCode || [];
          newCouponList = couponList?.filter(
            (code) => code !== couponItem.couponcode,
          );
          couponListData.couponData[index].couponCode = newCouponList;
        }
      });
    } else {
      couponList = couponListData.couponData[index]?.couponCode || [];
      newCouponList = couponList?.filter((code) => code !== couponCode);
      removedCouponList?.push(couponCode);
    }

    if (couponList?.length > newCouponList?.length) {
      couponListData.couponData[index].couponCode = newCouponList;
    } else {
      const combinedCouponList = [...couponList, ...removedCouponList];
      couponListData.couponData[index].couponCode =
        combinedCouponList.length === count
          ? combinedCouponList
          : newCouponList;
    }

    dispatch({
      type: addonActions.SET_COUPON_DATA,
      payload: {
        couponData: couponListData?.couponData,
      },
    });
    setTotalCoupon(couponListData?.couponData[index]?.couponLeft);
  };

  // check nominee from passenger list
  const checkPassengerIsNotNomini = (passengerData) => {
    const isNominiOrSelf =
      passengerData?.travelDocuments[0]?.number.split('|')[0];
    return !(
      paxTrevelType.self === isNominiOrSelf.trim() ||
      paxTrevelType.nominee === isNominiOrSelf.trim()
    );
  };

  // Create passeger coupon object
  const createPassengrCouponObject = () => {
    const paxTempData = [];
    let count = 0;
    for (let i = 0; i < passengerDetails.length; i += 1) {
      const paxObject = { keys: '', couponcode: '' };
      paxObject.keys = passengerDetails[i]?.passengerKey;
      paxTempData.push(paxObject);
      const isNotNominee = checkPassengerIsNotNomini(passengerDetails[i]);
      if (!isNotNominee) {
        count += 1;
        setSelfAndNomineeCount(count);
      }
    }
    setPassengerCouponList(paxTempData);
    setMaxPaxCanHaveCoupon(count);
  };

  // update if opening in change flow
  const updateCouponData = (bundleDataCouponList) => {
    let totalSelectedPax = 0;
    let validPaxCount = 0;
    const newTotalPrice =
      (bunldeObjectData?.totalPrice ?? 0) * (passengerDetails?.length ?? 0);
    const singlePaxPrice = bunldeObjectData?.totalPrice;
    const totalCouponLeft = couponDetailList?.couponData?.[index]?.couponLeft;

    bundleDataCouponList?.forEach((coupon, paxIndex) => {
      if (coupon.couponcode) {
        totalSelectedPax += 1;
      }
      // if(passengerDetails[index]?.travelDocuments.)
      if (checkPassengerIsNotNomini(passengerDetails[paxIndex])) {
        validPaxCount += 1;
      }
    });

    // Select All passenger check Box status
    if (validPaxCount !== 0 && validPaxCount === totalSelectedPax) {
      setSelectAllPassenger(true);
    }
    if (totalSelectedPax) {
      setTotalCoupon(totalCouponLeft);
      setTotalPrice(newTotalPrice - singlePaxPrice * totalSelectedPax);
      setTotalActivePassenger(totalSelectedPax);
    } else {
      setTotalCoupon(totalCouponLeft);
      setTotalPrice(newTotalPrice);
      setTotalActivePassenger(0);
    }
  };

  // Load passenger data on page load
  const getPassengerDetails = () => {
    const bundleDataCouponList =
      primeBundleData[tripIndex]?.passengerKeysWithCoupon ||
      mealBundleData[tripIndex]?.passengerKeysWithCoupon;
    if (bundleDataCouponList?.length) {
      setPassengerCouponList(bundleDataCouponList);
    } else {
      createPassengrCouponObject();
    }
    updateCouponData(bundleDataCouponList);
  };

  const getTotalCouponsApplied = (data) => {
    return data.reduce((total, passenger) => {
      if (
        passenger &&
        passenger?.SsrDetails &&
        Array.isArray(passenger?.SsrDetails)
      ) {
        return total + passenger.SsrDetails.length;
      }
      return total;
    }, 0);
  };

  const btnProps = {
    label: 'Continue',
    color: 'primary',
    variant: 'filled',
    size: 'small',
    disabled: false,
  };

  const setPassengerWithCouponObject = (
    coupnListData,
    couponcode,
    paxIndex,
    price,
  ) => {
    const newCouponListData = cloneDeep(coupnListData);
    if (couponcode) {
      newCouponListData[paxIndex].couponcode = couponcode;
      updateCouponDataList(totalCoupon - 1, couponcode);
      setTotalActivePassenger(totalActivePassenger + 1);
      setTotalPrice(totalPrice - price);
    } else if (!couponcode && totalCoupon > 0) {
      newCouponListData[paxIndex].couponcode =
        couponDetailList?.couponData?.[index]?.couponCode[0] || '';
      updateCouponDataList(totalCoupon - 1, couponcode);
      setTotalActivePassenger(totalActivePassenger + 1);
      setTotalPrice(totalPrice - price);
    }
    if (totalActivePassenger + 1 === maxPaxCanHaveCoupon) {
      setSelectAllPassenger(true);
    } else {
      setSelectAllPassenger(false);
    }
    return newCouponListData;
  };
  // Based on bundle data type
  const updateBundleDataCouponStatus = (couponcode, paxIndex, bundleType) => {
    let updatedCouponList = cloneDeep(passengerCouponList);
    const price = bunldeObjectData?.totalPrice;

    if (updatedCouponList[paxIndex]?.couponcode === couponcode) {
      updatedCouponList[paxIndex].couponcode = '';
      updateCouponDataList(totalCoupon + 1, couponcode); // Increment available coupons
      setTotalActivePassenger(totalActivePassenger - 1);
      setTotalPrice(totalPrice + price);
      setSelectAllPassenger(false);
    } else if (totalCoupon > 0) {
      updatedCouponList = setPassengerWithCouponObject(
        updatedCouponList,
        couponcode,
        paxIndex,
        price,
      );
    }
    if (bundleType === categoryCodes.meal) {
      setPassengerCouponList((prevState) => {
        const updatedList = [...prevState, updatedCouponList].flat();

        return updatedList.reduce((acc, { keys, couponcode: couponCodes }) => {
          const existing = acc.find((item) => item.keys === keys);
          const coupons = Array.isArray(couponCodes)
            ? couponCodes.flat()
            : [couponCodes];

          if (existing) {
            existing.couponcode = [
              ...new Set([...existing.couponcode, ...coupons]),
            ]; // Remove duplicates
          } else {
            acc.push({ keys, couponcode: [...new Set(coupons)] });
          }
          return acc;
        }, []);
      });
    } else {
      setPassengerCouponList(updatedCouponList);
    }
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

  const updatePassengerCouponList = (paxData) => {
    const newCouponObj = cloneDeep(paxData);
    newCouponObj?.forEach((_, paxIndex) => {
      newCouponObj[paxIndex].couponcode = '';
    });
    setPassengerCouponList(newCouponObj);
  };

  // select All passenger for bundle
  const selectCouponForAllPassenger = () => {
    const totalCouponLeft = couponDetailList?.couponData?.[index]?.couponLeft;
    let couponAdded = 0;
    if (selectAllPassenger) {
      setSelectAllPassenger(false);
      const paxTempData = [];
      passengerCouponList?.forEach((passengerData) => {
        const paxObject = { keys: '', couponcode: '' };
        paxObject.keys = passengerData?.keys;
        paxObject.couponcode = passengerData?.couponcode;
        if (passengerData?.couponcode !== '') {
          couponAdded += 1;
        }
        paxTempData.push(paxObject);
      });

      updatePassengerCouponList(paxTempData);
      const newPrice =
        totalPrice + bunldeObjectData.totalPrice * totalActivePassenger;
      setTotalPrice(newPrice);
      updateCouponDataList(totalCouponLeft + couponAdded, paxTempData);
      setTotalActivePassenger(0);
    } else {
      const paxTempData = [];
      let count = 0;
      let activePaxCount = 0;

      passengerDetails?.forEach((passengerData, paxIndex) => {
        const paxObject = { keys: '', couponcode: '' };
        if (!checkPassengerIsNotNomini(passengerData) && totalCoupon >= count) {
          paxObject.keys = passengerData?.passengerKey;
          if (passengerCouponList[paxIndex]?.couponcode !== '') {
            paxObject.couponcode =
              passengerCouponList[paxIndex]?.couponcode || '';
            activePaxCount += 1;
          } else {
            paxObject.couponcode =
              totalCoupon === 1
                ? couponDetailList?.couponData?.[index]?.couponCode[0] || ''
                : couponDetailList?.couponData?.[index]?.couponCode[count] ||
                  '';
            count += 1;
            activePaxCount += 1;
          }
        } else {
          paxObject.keys = passengerData?.passengerKey;
          paxObject.couponcode = '';
        }
        paxTempData.push(paxObject);
      });
      setPassengerCouponList(paxTempData);
      setSelectAllPassenger(true);
      updateCouponDataList(totalCouponLeft - count, paxTempData);
      setTotalActivePassenger(activePaxCount);
      const newPrice =
        bunldeObjectData.totalPrice * passengerDetails.length -
        bunldeObjectData.totalPrice * activePaxCount;
      setTotalPrice(newPrice);
    }
  };

  // forat currency function
  const formatCurrencyModifyer = (price, code) => {
    return typeof price === 'string'
      ? price
      : formatCurrency(price, code || 'INR', {
        minimumFractionDigits: 0,
      });
  };

  const getSelectSliderData = () => {
    return sliderConfiData?.filter((sliderInfo) => {
      return (
        sliderInfo?.categoryBundleCode ===
        couponDetailList?.couponData?.[index].category
      );
    });
  };
  useEffect(() => {
    if (sliderConfiData) {
      const data = getSelectSliderData();
      setSliderData(data[0]);
    }
  }, [sliderConfiData]);

  const getSliderTitle = () => {
    const sliderTitle = getSelectSliderData();
    return sliderTitle[0]?.sliderTitle;
  };

  const getPassesTitle = () => {
    const passesTitle = getSelectSliderData();
    return passesTitle[0]?.passesAvailableInformation?.passesAvailable;
  };
  const getNoteDescription = () => {
    const noteDescription = getSelectSliderData();
    return noteDescription?.[0]?.passesAvailableInformation?.passesAvailableDescription?.html;
  };

  const redeemPassesDescription = () => {
    const redeemDescription = getSelectSliderData();
    return redeemDescription[index]?.passesAvailableInformation
      ?.redeemPassesDescription?.html;
  };
  const mealCategory = additionSliderData?.sliderConfiguration?.find(
    (item) => item.categoryBundleCode === categoryCodes.meal,
  );
  useEffect(() => {
    getPassengerDetails();
    const filteredBundleList = bundleDataList.filter(
      (bundleIem) => bundleIem?.bundleCode ===
        couponDetailList?.couponData?.[index]?.category,
    );
    const newBundleData = filteredBundleList[0]?.pricesByJourney?.[tripIndex];
    setBunldeObjectData(newBundleData);
  }, [isOpen, isVoucherSelected, bunldeObjectData]);

  useEffect(() => {
    appendMealsSelectedToPassengers(confirmedMeals?.[tripIndex], passengerDetails);
  }, [couponDetailList]);

  useEffect(() => {
    setToDisplayCouponLeft(toShowMealCoupons);
  }, [couponSelected]);

  // Onsubmit handler

  const clearPassengerMealData = () => {
    passengerDetails?.forEach((passenger) => {
      updateMealCouponStatus(
        passenger?.passengerKey,
        0,
      );
    });
    setToDisplayCouponLeft(null);
    addOnCardMemberProps.onClose();
  };

  return (
    <OffCanvas
      {...addOnCardMemberProps}
      onClose={clearPassengerMealData}
    >
      <div className="skyplus-loyalty-member-benifit">
        <div className="skyplus-loyalty-member-benifit__head-container">
          <div className="skyplus-loyalty-member-benifit__title h0">
            {getSliderTitle()}
          </div>
          <div className="skyplus-loyalty-member-benifit__coupon-card">
            <span className="skyplus-loyalty-member-benifit__coupon-card--title">
              {sliderData?.categoryBundleCode === categoryCodes.meal
                ? `${toShowMealCoupons} ${getPassesTitle()}`
                : `${totalCoupon} ${getPassesTitle()}`}
            </span>
          </div>
        </div>

        <div
          className="skyplus-loyalty-member-benifit__desctiption h4"
          dangerouslySetInnerHTML={{
            __html: redeemPassesDescription(),
          }}
        />
        <div
          className={`${
            selfAndNomineeCount > 1
              ? ''
              : 'skyplus-loyalty-member-benifit__select-all-container-disabed'
          }`}
        >
          {selfAndNomineeCount > 1 &&
            sliderData?.categoryBundleCode !== categoryCodes.meal && (
              <div className="skyplus-loyalty-member-benifit__select-all-container">
                <div className="skyplus-loyalty-member-benifit__select-all-container--tile">
                  {additionSliderData?.selectAllLabel}
                </div>
                <div>
                  <Checkbox
                    onChangeHandler={() => selectCouponForAllPassenger()}
                    checked={selectAllPassenger}
                    id="keyName"
                    disabled={
                      totalCoupon === 0 || totalCoupon < selfAndNomineeCount
                    }
                  />
                </div>
              </div>
          )}
          {appendMealsSelectedToPassengers(
            confirmedMeals?.[tripIndex],
            passengerDetails,
          )?.map((passengerData, paxIndex) => {
            return (
              <div key={passengerData.passengerKey}>
                <PassengerListingPage
                  passengerData={passengerData}
                  index={index}
                  paxIndex={paxIndex}
                  bunldeObjectData={bunldeObjectData}
                  checkPassengerIsNotNomini={checkPassengerIsNotNomini}
                  formatCurrencyModifyer={formatCurrencyModifyer}
                  couponList={couponDetailList?.couponData}
                  updateBundleDataCouponStatus={updateBundleDataCouponStatus}
                  updateMealCouponStatus={updateMealCouponStatus}
                  passengerCouponList={passengerCouponList}
                  additionSliderData={additionSliderData}
                  totalCoupon={totalCoupon}
                  initialCoupons={initialCoupons}
                  sliderData={sliderData}
                  couponSelected={couponSelected}
                  mealCategory={mealCategory}
                  mealCouponsLeft={mealCouponsLeft}
                  currentCouponSelectionCount={currentCouponSelectionCount}
                  setCouponSelected={setCouponSelected}
                />
              </div>
            );
          })}
        </div>
        <div className="skyplus-loyalty-member-benifit__note-container">
          <div
            className="skyplus-loyalty-member-benifit__note"
            dangerouslySetInnerHTML={{
              __html: getNoteDescription(),
            }}
          />
        </div>
      </div>

      <OffCanvasFooter
        titleData={totalPrice}
        title={
          sliderData?.categoryBundleCode === categoryCodes.meal
            ? mealCategory?.passesAvailableInformation?.totalFreeVouchersLabel
            : additionSliderData?.totalPriceLabel
        }
        subTitle="Save ₹ 753 with Recommendation"
        buttonTitle="Continue"
        isFooterVisible={false}
        btnProps={btnProps}
        buttonIcon={false}
        postButtonIcon="icon-accordion-left-24"
        onSubmit={submitDetails}
        disabled={
          sliderData?.categoryBundleCode === categoryCodes.meal
            ? currentCouponSelectionCount < 1
            : !totalActivePassenger
        }
        couponSelected={currentCouponSelectionCount}
        currencycode={bunldeObjectData?.currencyCode}
        isMealSsr={sliderData?.categoryBundleCode === categoryCodes.meal}
        page={page}
      />
    </OffCanvas>
  );
}

export default MemberBenifitSlider;
