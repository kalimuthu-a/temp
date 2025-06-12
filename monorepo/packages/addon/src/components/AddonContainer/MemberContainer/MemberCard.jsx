import React, { useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { categoryCodes, SAVER } from '../../../constants';
import { AppContext } from '../../../context/AppContext';
import AnalyticHelper from '../../../helpers/analyticHelper';
import { getSSRData } from '../CardContainer/CardContainer';

function MemberCard(props) {
  const {
    CardTitle,
    couponLeft,
    category,
    name,
    expiryDate,
    image,
    mfData,
    index,
    isModifyFlow,
    primeBundleData,
    isVoucherSelected,
    addRemoveMemberCoupon,
    departureDate,
    tripIndex,
    mealBundleData,
    onPrimeRemove,
    mealCouponsLeft,
    toDisplayCouponsLeft,
    useSsrJourneyCheck,
    segmentData,
    getCurrentJourneyKey,
    additionSliderData,
  } = props;

  const {
    state: { page, mealVoucherData, getAddonData },
  } = React.useContext(AppContext);

  const [isMobile] = useIsMobile();
  const [primeHeading, setPrimeHeading] = useState('');
  const [mealHeading, setMealHeading] = useState('');

  const checkSSRExistence = React.useMemo(() => {
    if (!getAddonData) return false;

    const newCombineAddons = getSSRData(
      getAddonData,
      mfData,
      additionSliderData,
      tripIndex,
    );

    if (newCombineAddons?.length) {
      const mealAddonData = newCombineAddons?.find(
        (cAddonData) => cAddonData?.categoryBundleCode === categoryCodes?.meal,
      );

      if (!isEmpty(mealAddonData)) {
        return mealAddonData?.availableSSR?.some((eachSsr) => {
          return eachSsr?.ssrs?.length > 0;
        });
      }
    }
    return false;
  }, [getAddonData, mfData, additionSliderData, tripIndex]);

  const isDMinus12 = !checkSSRExistence;
  const isMeal = category === categoryCodes?.meal;
  const isPrime = category === categoryCodes?.prim;
  const isPrimeAddonSelected = primeBundleData?.[tripIndex]?.isSelected;
  const isMlstSelected = mealBundleData?.[tripIndex]?.isSelected; // 6E seat and eat

  const commonValidation = (bundleData) => {
    return !(new Date(departureDate) < new Date(expiryDate) && bundleData[tripIndex]?.title);
  };

  const getDisabledState = () => {
    if (isMeal && (segmentData?.fareType?.toLowerCase() !== SAVER)) {
      return true;
    }
    if (isDMinus12) return true;
    if (isMeal && mealCouponsLeft < 1 && !isVoucherSelected?.meal) {
      return true;
    }
    if (isMeal && isMlstSelected) return true;
    if (
      (isMeal && !isModifyFlow && !isPrimeAddonSelected) ||
      (isMeal && isVoucherSelected?.meal)
    ) {
      return false;
    }
    if (isVoucherSelected?.meal && isPrime) {
      return true;
    }
    if (
      (isPrime && couponLeft > 0) ||
      (isPrime && primeBundleData?.[tripIndex]?.passengerKeysWithCoupon?.[0]?.couponcode)
    ) {
      if (!isModifyFlow) {
        return false;
      }
      return commonValidation(primeBundleData);
    }
    return true;
  };

  const getBundleTitle = () => {
    let headingPrime = '';
    let headingMlst = '';
    mfData?.memberBenefitsDetails?.forEach((bundle) => {
      if (bundle?.markerLabels?.categoryBundleCode === categoryCodes.prim) {
        headingPrime = bundle.heading;
      } else {
        headingMlst = bundle.heading;
      }
    });
    setPrimeHeading(headingPrime);
    setMealHeading(headingMlst);
  };
  let exists;
  if (mealVoucherData) {
    exists = mealVoucherData.some((item) => item.JourneyKey === getCurrentJourneyKey());
  }
  const buttonProps = {
    variant:
      (isPrime && isVoucherSelected?.prime) ||
      (isMeal && isVoucherSelected?.meal) ||
       (isMeal && exists && mealVoucherData.length > 0)
        ? 'outline'
        : 'filled',
    size: 'small',
    block: !isMobile,
  };

  const getCouponTitle = () => {
    if (isPrime) {
      return primeHeading;
    }
    if (isMeal) {
      return mealHeading;
    }
    return name;
  };
  const getSelectedCategoryDetails = () => {
    return mfData?.memberBenefitsDetails?.find(
      (slider) => slider?.markerLabels?.categoryBundleCode === category,
    );
  };

  useEffect(() => {
    getBundleTitle();
  }, [isVoucherSelected]);

  useEffect(() => {
    if (!primeBundleData[tripIndex]?.isSelected) {
      onPrimeRemove();
    }
  }, [primeBundleData[tripIndex]?.isSelected]);

  const isDisabled = getDisabledState();
  const couponLeftCount = isMeal
    ? Math.max(toDisplayCouponsLeft ?? mealCouponsLeft, 0)
    : couponLeft;
  const couponAddRemoveLabel = () => {
    if (
      (isMeal && isVoucherSelected?.meal) || (isMeal && mealVoucherData?.length && exists) ||
      (isPrime && isVoucherSelected?.prime)
    ) {
      return mfData?.removeLabel;
    }
    if (isPrimeAddonSelected && isPrime) {
      return mfData?.memberBenefitsDetails[1]?.primaryCtaLabel;
    }
    const { isSegmentKeyIncluded } = useSsrJourneyCheck();
    if ((isSegmentKeyIncluded && isMeal && !isVoucherSelected?.meal &&
      !isMlstSelected && !isPrimeAddonSelected)) {
      return mfData?.memberBenefitsDetails[0]?.primaryCtaLabel;
    }
    return getSelectedCategoryDetails()?.ctaLabel;
  };

  return (
    <div className="skyplus-loyalty-member__card">
      <div className="skyplus-loyalty-member__details-container">
        <div className="skyplus-loyalty-member__details">
          <div className="skyplus-loyalty-member__title-container">
            <div className="sh5 title">
              {getCouponTitle()}
            </div>
            <div className="skyplus-loyalty-member__coupon-card">
              <spna className="skyplus-loyalty-member__coupon-card--text">
                {mfData?.leftLabel?.replace(
                  '{number}',
                  couponLeftCount,
                )}
              </spna>
            </div>
          </div>
          {expiryDate ? (
            <div className="body-small-light">
              {getSelectedCategoryDetails()?.note}
              {` : ${expiryDate?.split('T')[0]}`}
            </div>
          ) : ' ' }
        </div>
        <div className={`skyplus-loyalty-member__button ${!isMobile && 'skyplus-loyalty-member__button--full-width'}`}>
          {!isMobile && (
            <Button
              {...buttonProps}
              disabled={isDisabled}
              onClick={() => {
                addRemoveMemberCoupon(index, category);
                AnalyticHelper.addRedeemClick(page, isMobile, isModifyFlow);
              }}
            >
              {couponAddRemoveLabel()}
            </Button>
          )}
        </div>
      </div>
      {!isMobile ? (
        <div className="skyplus-loyalty-member__image-container skyplus-loyalty-member__member-card-image">
          <img
            src={mfData?.memberBenefitsDetails[index]?.image?._publishUrl}
            alt={CardTitle || image}
            className="skyplus-loyalty-member__image"
          />
        </div>
      ) : (
        <div className={`skyplus-loyalty-member__button ${!isMobile && 'skyplus-loyalty-member__button--full-width'}`}>
          <Button
            {...buttonProps}
            disabled={isDisabled}
            onClick={() => {
              addRemoveMemberCoupon(index, category);
              AnalyticHelper.addRedeemClick(page, isMobile, isModifyFlow);
            }}
          >
            {couponAddRemoveLabel()}
          </Button>
        </div>
      )}
    </div>
  );
}

MemberCard.propTypes = {
  CardTitle: PropTypes.string,
  couponLeft: PropTypes.number,
  category: PropTypes.string,
  name: PropTypes.string,
  expiryDate: PropTypes.string,
  image: PropTypes.string,
  mfData: PropTypes.object,
  index: PropTypes.number,
  isModifyFlow: PropTypes.bool,
  primeBundleData: PropTypes.object,
  mealBundleData: PropTypes.object,
  isVoucherSelected: PropTypes.object,
  selectedCoupon: PropTypes.object,
  addRemoveMemberCoupon: PropTypes.func,
  bundleDataList: PropTypes.array,
  passengerDetails: PropTypes.object,
  isChangeFlow: PropTypes.bool,
  departureDate: PropTypes.string,
  tripIndex: PropTypes.number,
  couponDetailList: PropTypes.object,
  onPrimeRemove: PropTypes.func,
  mealCouponsLeft: PropTypes.number,
  segmentData: PropTypes.object,
  toDisplayCouponsLeft: PropTypes.any,
  useSsrJourneyCheck: PropTypes.func,
  getCurrentJourneyKey: PropTypes.func,
  additionSliderData: PropTypes.object,
};

export default MemberCard;
