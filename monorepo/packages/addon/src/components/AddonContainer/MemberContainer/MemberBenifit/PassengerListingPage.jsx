import React, { useState } from 'react';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import StepperInput from 'skyplus-design-system-app/dist/des-system/StepperInput';
import PropTypes from 'prop-types';
import { genderType, paxCodes, paxTrevelType, categoryCodes } from '../../../../constants';
import { calculateYearsFromDate } from '../../../../functions/utils';
import { getPassengerName } from '../../../../functions';

function PassengerListingPage(props) {
  const {
    passengerData,
    index,
    paxIndex,
    bunldeObjectData,
    checkPassengerIsNotNomini,
    formatCurrencyModifyer,
    couponList,
    updateBundleDataCouponStatus,
    passengerCouponList,
    additionSliderData,
    totalCoupon,
    sliderData,
    updateMealCouponStatus,
    couponSelected,
    mealCategory,
    mealCouponsLeft,
    setCouponSelected,
    currentCouponSelectionCount,
  } = props;
  let couponSelectedMax = 0;
  Object.keys(couponSelected).map(paxkey=>{
    if(paxkey !== passengerData.passengerKey){
      couponSelectedMax +=couponSelected[paxkey];
    }
    })
  const isCouponNotAvailable = mealCouponsLeft <= couponSelectedMax;
  const mealsToConsider =
    mealCouponsLeft <= passengerData?.mealsSelected
      ? mealCouponsLeft
      : passengerData?.mealsSelected;
  const maxStepperValue =
    (currentCouponSelectionCount === 2 || isCouponNotAvailable)
      ? 0
      : Math.min(mealsToConsider || 0, 2);
  const [voucherValue, setVoucherValue] = useState(0);
  const setPassengerCheckBox = (coupon, paxIndexValue) => {
    if (coupon && paxIndexValue !== undefined) {
      updateBundleDataCouponStatus(
        coupon,
        paxIndexValue,
        sliderData?.categoryBundleCode || '',
      );
    }
  };

  const isMealFlow = sliderData?.categoryBundleCode === categoryCodes?.meal;
  const isPrimeFlow = sliderData?.categoryBundleCode === categoryCodes?.prim;
  const getMealCouponSelected = (passengerMealData, selectedCoupon) => {
    if (passengerMealData?.passengerKey && selectedCoupon !== undefined) {
      updateMealCouponStatus(passengerMealData, selectedCoupon);
    }
  };

  const getPaxType = (passenger) => {
    switch (passenger?.passengerTypeCode) {
      case paxCodes.adult.code: {
        if (passenger?.discountCode === paxCodes.seniorCitizen.discountCode) {
          return paxCodes.seniorCitizen.label;
        }
        return paxCodes.adult.label;
      }

      case paxCodes.children.code: {
        return paxCodes.children.label;
      }

      case paxCodes.infant.code: {
        return paxCodes.infant.label;
      }

      default:
        return '';
    }
  };

  const getPassengerAge = (DateOfBirth) => {
    if (!DateOfBirth) return '';
    const dob = DateOfBirth?.split('T')[0];
    const newDOB = dob?.split('-');
    const date = new Date();
    return `${calculateYearsFromDate(newDOB?.[0], newDOB?.[1], newDOB?.[2], date)} Years`;
  };

  const getIsNominee = (passeger) => {
    const documentNumber = passeger?.travelDocuments?.[0]?.number || '';
    return documentNumber.split('|')?.[0]?.trim() === paxTrevelType.nominee;
  };

  const getCouponCode = (coupons, couponIndex, paxIndexValue) => {
    if (coupons[couponIndex]?.couponCode?.length <= passengerCouponList?.length) {
      return coupons[couponIndex]?.couponCode?.[0];
    }
    return coupons[couponIndex]?.couponCode[paxIndexValue];
  };
  const getCoupon = (coupons) => {
    const coupon = coupons.find(
      (item) => item?.category === sliderData?.categoryBundleCode,
    );
    return coupon?.couponCode?.[0];
  };

  const getMealPrice = () => {
    const mealPrice = () => {
      return passengerData?.meals?.reduce((acc, meal) => {
        const mPrice = meal?.meal?.price || 0;
        return acc + mPrice;
      }, 0) || 0;
    };

    if ((checkPassengerIsNotNomini(passengerData) ||
      (!mealCouponsLeft && !passengerCouponList?.[paxIndex]?.couponcode))) {
      return formatCurrencyModifyer(
        mealPrice(),
        bunldeObjectData?.currencyCode || '',
      );
    }
    return (
      <div className="skyplus-loyalty-member-benifit__price-value">
        {mealCategory?.passesAvailableInformation?.freeLabel || 'FREE'}
      </div>
    );
  };

  const getPrimePrice = () => {
    return (
      <div
        className={`skyplus-loyalty-member-benifit__price-value sh6 
        ${
        (checkPassengerIsNotNomini(passengerData) ||
          (!totalCoupon && !passengerCouponList?.[paxIndex]?.couponcode)) &&
        'skyplus-loyalty-member-benifit__desabled-text'
        }`}
      >
        {passengerCouponList?.[paxIndex]?.couponcode ? (
          <del>
            {formatCurrencyModifyer(
              bunldeObjectData?.totalPrice || 0,
              bunldeObjectData?.currencyCode || '',
            )}
          </del>
        ) : (
          formatCurrencyModifyer(
            bunldeObjectData?.totalPrice || 0,
            bunldeObjectData?.currencyCode || '',
          )
        )}
      </div>
    );
  };

  const getMealPrimeVoucherContent = () => {
    return (
      <div
        className={`skyplus-loyalty-member-benifit__price-container 
    ${
      (checkPassengerIsNotNomini(passengerData) ||
        (!totalCoupon && !passengerCouponList?.[paxIndex]?.couponcode)) &&
      'skyplus-loyalty-member-benifit_desabled-container'
    }`}
      >
        <div
          className={`skyplus-loyalty-member-benifit__price-title 
      ${
        (checkPassengerIsNotNomini(passengerData) ||
          (!totalCoupon && !passengerCouponList?.[paxIndex]?.couponcode)) &&
        'skyplus-loyalty-member-benifit__desabled-text'
      }`}
        >
          {isMealFlow
            ? `${mealCategory?.passesAvailableInformation?.sixEVoucherLabel || '6E Eat'}`
            : additionSliderData?.priceLabel}
        </div>

        {isMealFlow && getMealPrice()}
        {isPrimeFlow && getPrimePrice()}
      </div>
    );
  };

  const couponsCount = isPrimeFlow ? totalCoupon : mealCouponsLeft;

  return (
    <div
      className={`skyplus-loyalty-member-benifit__head-card 
      ${
        (checkPassengerIsNotNomini(passengerData) ||
          (!couponsCount && !passengerCouponList?.[paxIndex]?.couponcode)) &&
        'skyplus-loyalty-member-benifit__desabled'
      }`}
      key={passengerData?.passengerKey}
    >
      <div className="skyplus-loyalty-member-benifit__head-root">
        <div
          className={`skyplus-loyalty-member-benifit__header-left 
            ${
              (checkPassengerIsNotNomini(passengerData) ||
                (!totalCoupon && !passengerCouponList?.[paxIndex]?.couponcode)) &&
              'skyplus-loyalty-member-benifit__header-left-desabled'
            }`}
        />
        <div className="skyplus-loyalty-member-benifit__header-right">
          <div className="skyplus-loyalty-member-benifit__header-container">
            <div className="skyplus-loyalty-member-benifit__header-name body-medium-regular">
              {getPassengerName(passengerData) || ''}
            </div>
            {!(
              checkPassengerIsNotNomini(passengerData) ||
              (!couponsCount && !passengerCouponList?.[paxIndex]?.couponcode)
            ) && sliderData?.categoryBundleCode === categoryCodes?.meal && (
              <StepperInput
                minValue={0}
                value={voucherValue}
                maxValue={maxStepperValue}
                onChange={(value) => {
                  setVoucherValue(value);
                  setCouponSelected({
                    ...couponSelected,
                    [passengerData?.passengerKey]: value,
                  });
                  getMealCouponSelected(passengerData, value);
                  setPassengerCheckBox(
                    getCoupon(couponList, value - 1),
                    paxIndex,
                  );
                }}
              />
            )}
            {!(
              checkPassengerIsNotNomini(passengerData) ||
              (!totalCoupon && !passengerCouponList?.[paxIndex]?.couponcode)
            ) && sliderData?.categoryBundleCode === categoryCodes?.prim && (
              (
                <Checkbox
                  onChangeHandler={(e) => {
                    setVoucherValue(e.target.checked ? 1 : 0);
                    setPassengerCheckBox(
                      passengerCouponList?.[paxIndex]?.couponcode
                        ? passengerCouponList?.[paxIndex]?.couponcode
                        : getCouponCode(couponList, index, paxIndex),
                      paxIndex,
                    );
                  }}
                  checked={passengerCouponList?.[paxIndex]?.couponcode}
                  id={passengerData?.passengerKey}
                />
              ))}
          </div>
          <div className="skyplus-loyalty-member-benifit__subtitle-container body-small-regular">
            <div>{getPaxType(passengerData)}</div>
            <spna className="skyplus-loyalty-member-benifit__subtitle-container-line">
              {genderType?.[passengerData?.info?.gender] && '|'}
            </spna>
            <div>{genderType?.[passengerData?.info?.gender]}</div>
            {passengerData?.info?.dateOfBirth && (
              <spna className="skyplus-loyalty-member-benifit__subtitle-container-line">
                |
              </spna>
            )}
            {passengerData?.info?.dateOfBirth && (
              <div>{getPassengerAge(passengerData?.info?.dateOfBirth)}</div>
            )}
            <spna className="skyplus-loyalty-member-benifit__subtitle-container-line">
              {getIsNominee(passengerData) && '| Nominee'}
            </spna>
          </div>
        </div>
      </div>
      {!checkPassengerIsNotNomini(passengerData) && voucherValue > 0 && getMealPrimeVoucherContent()}
      {checkPassengerIsNotNomini(passengerData) && getMealPrimeVoucherContent()}

    </div>
  );
}

PassengerListingPage.propTypes = {
  passengerData: PropTypes.object,
  index: PropTypes.number,
  paxIndex: PropTypes.number,
  bunldeObjectData: PropTypes.object,
  checkPassengerIsNotNomini: PropTypes.func,
  formatCurrencyModifyer: PropTypes.func,
  couponList: PropTypes.array,
  updateBundleDataCouponStatus: PropTypes.func,
  passengerCouponList: PropTypes.array,
  additionSliderData: PropTypes.object,
  totalCoupon: PropTypes.number,
  sliderData: PropTypes.object,
  updateMealCouponStatus: PropTypes.func,
  couponSelected: PropTypes.number,
  mealCategory: PropTypes.object,
  mealCouponsLeft: PropTypes.number,
  currentCouponSelectionCount: PropTypes.number,
  setCouponSelected: PropTypes.func,
};
export default PassengerListingPage;
