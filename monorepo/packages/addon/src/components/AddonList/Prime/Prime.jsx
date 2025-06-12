import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import AddonCard from '../../common/AddonCard/AddonCard';
import PrimeSlidePane from './PrimeSliderPane';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { categoryCodes } from '../../../constants/index';
import eventService from '../../../services/event.service';
import { getRemoveReviewSummaryData } from '../../../functions/mealUtils';
import { formatCurrencyFunc } from '../../../functions/utils';
import RecommendedCard from '../../common/RecommendedCard/RecommendedCard';
import { createEventForAddonModification } from '../../../functions';

// Old Code:
// import TooltipContent from './TooltipContent';
// import PopOver from '../../../common/Popover/PopOver';
// import SuccessPopup from 'skyplus-design-system-app/dist/des-system/SuccessPopup';

const Prime = (props) => {
  const [isOpenSlider, setOpenSlider] = useState(false);
  const [isShowSuccessPopup, setShowSuccessPopup] = useState(false);
  const { state, dispatch } = React.useContext(AppContext);

  const {
    addonData,
    passengerDetails,
    segmentData,
    ssrCategory,
    configData,
    fareDetails,
    passengerKey,
    sliderPaneConfigData,
    isRecommended,
    recomendedData,
    isModifyFlow,
    isOpenPrime,
    setIsOpenPrime,
    setOpenMemberBenifit,
  } = props || {};

  const setAddonDataOnCardRemoveBtn = () => {
    if (
      state.setGetSelectedAddon &&
      state.setGetSelectedAddon[state.tripIndex].selectedAddone.length > 0
    ) {
      const selectedAddonData = { ...state.setGetSelectedAddon };

      selectedAddonData[state.tripIndex].selectedAddone = selectedAddonData[
        state.tripIndex
      ].selectedAddone.filter(
        (selectedAddon) => selectedAddon?.addonName !== addonData?.title,
      );

      dispatch({
        type: addonActions.SET_GET_SELECTED_ADDON,
        payload: selectedAddonData,
      });
    }
  };

  const filterCouponList = () => {
    const newCouponList = [];
    state.primBundleFare[state.tripIndex]?.passengerKeysWithCoupon?.forEach(
      (coupon) => {
        if (coupon?.couponcode !== '') {
          newCouponList.push(coupon.couponcode);
        }
      },
    );
    state.couponData?.couponData?.forEach((couponItem, couponIndex) => {
      if (couponItem.category === categoryCodes?.prim) {
        state.couponData.couponData[couponIndex].couponCode = [
          ...couponItem.couponCode,
          ...newCouponList,
        ];
        state.couponData.couponData[couponIndex].couponLeft +=
          newCouponList.length;
      }
    });
    dispatch({
      type: addonActions.SET_COUPON_DATA,
      payload: {
        couponData: state.couponData?.couponData,
      },
    });
  };

  const removeAddedMeal = () => {
    if (state.primBundleFare[state.tripIndex]?.passengerKeysWithCoupon) {
      filterCouponList();
    }
    setAddonDataOnCardRemoveBtn();
    let removeReviewSummaryData = getRemoveReviewSummaryData(
      state.confirmedMeals,
      state.underTwelveHourFlight,
      {
        passengerDetails,
        segmentData,
        ssrCategory,
      },
    );

    dispatch({
      type: addonActions.REMOVE_ALL_CONFIRMED_MEALS_FOR_BUNDLE,
    });

    dispatch({
      type: addonActions.SEAT_ADDED,
      payload: false,
    });
    dispatch({
      type: addonActions.PRIM_BUNDLE_FARE_SELECTED,
      payload: {},
    });

    eventService.update([], removeReviewSummaryData); // Remove

    const isPrimePurchased = addonData?.availableSSR?.[0]?.takenssr?.find(
      (sr) => sr.bundleCode === 'PRIM',
    );

    const _price = addonData?.availableBundlePriceByJourney?.totalPrice || 0;

    removeReviewSummaryData = removeReviewSummaryData.map((r) => ({
      ...r,
      action: isPrimePurchased ? 'add' : 'remove',
      actualPrice: -_price,
    }));

    createEventForAddonModification([], removeReviewSummaryData);
  };

  const selectedAddOnName = () => {
    return state.primBundleFare[state.tripIndex]?.isSelected
      ? configData.addedLabel
      : null;
  };

  const addOnCardPrimeProps = {
    title: addonData?.title,
    image: addonData?.image,
    discription: addonData?.description?.html,
    uptoLabel: '',
    discountLabel: '',
    addLabel: configData?.addLabel,
    addedLabel: configData?.addedLabel,
    removeLable: configData?.removeLabel,
    addInfoLable: false,
    addonType: '6E prime',
    addonSelected: !!selectedAddOnName(),
    selectedAddonName: selectedAddOnName(),
    selectedAddonPrice: formatCurrencyFunc({
      price: addonData?.availableBundlePriceByJourney?.totalPrice,
      currencycode: addonData?.availableBundlePriceByJourney?.currencyCode,
    }),
    isCheckboxVisible: false,
    isCheckboxSelected: false,
    isCheckboxId: '',
    isCheckboxLabel: '',
    selfSelectedAddobe: false,
    disableCTA: false,
    hideRemoveCTA: false,
    isInformationIcon: true,
    // setAddonSelected: () => setAddonSelect(true),
    setRemoveSelected: () => removeAddedMeal(), // setAddonSelect(false),
    setOpenSlider: () => {setOpenSlider(true)}
  };

  const recommendedAddonDescPlural = configData?.addonDescPlural?.html
    ?.replace('{user}', passengerDetails[0]?.name?.first)
    ?.replace('{count}', passengerDetails.length - 1);
  const recommendedAddonDescSingular = configData?.addonDescSingular?.html
    ?.replace('{user}', passengerDetails[0]?.name?.first);

  const recommendedCardSeatAndEatProps = {
    addedLabel: configData.addedLabel,
    setRemoveSelected: () => removeAddedMeal(),
    title: addonData?.title,
    subTitle: passengerDetails?.length > 1 ? recommendedAddonDescPlural : recommendedAddonDescSingular,
    offeredPrice: addonData?.availableBundlePriceByJourney?.totalPrice || 0,
    slashedPrice: '',
    disableCTA: false,
    selfSelectedAddobe: false,
    setOpenSlider: () => setOpenSlider(true),
    currencyCode: addonData?.availableBundlePriceByJourney?.currencyCode,
    addonSelected: !!selectedAddOnName(),
    recomendedData,
    removeConfirmationPopup: sliderPaneConfigData?.removeCombo,
    isTakenSSRInModifyFlow: state.primBundleFare[state.tripIndex]?.isSelected && isModifyFlow,
    eachLabel: configData?.eachLabel,
  };

  const getSlidePaneDataForPrim = () => {
    return addonData.availableSlidePaneData.find((aemItem) => {
      return aemItem.categoryBundleCode === ssrCategory;
    });
  };

  const getSlidePaneDataForMeal = () => {
    return addonData.availableSlidePaneData.find((aemItem) => {
      return aemItem.categoryBundleCode === categoryCodes.meal;
    });
  };

  const handlePrimSliderClose = () => {
    dispatch({
      type: addonActions.CLEAR_BUNDLE_MEALS,
    });
    setOpenSlider(false);
    if (isOpenPrime ) {
      setIsOpenPrime(false);
    }
  };

  
  /* Old Code:
  const getLocations = () => {
    const locationList = [];
    const locationItem = {
      from: segmentData.journeydetail.origin,
      to: segmentData.journeydetail.destination,
    };
    locationList.push(locationItem);

    return locationList;
  };

  const successPopupProps = {
    title: configData?.serviceSuccessfullyAddedPopupLabel,
    message: addonData?.title,
    location: getLocations(),
  }; */

  useEffect(() => {
    if (isShowSuccessPopup) {
      setTimeout(() => setShowSuccessPopup(false), 5000);
    }
  }, [isShowSuccessPopup]);

  const slidePaneData = getSlidePaneDataForPrim();

  return (
    <>
      {isRecommended && <RecommendedCard {...recommendedCardSeatAndEatProps} />}
      {!isRecommended && (
        <AddonCard
          {...addOnCardPrimeProps}
          /* Old Code:
        renderTitlePopover={() => {
          return (
            <PopOver
              tooltipContent={
                <TooltipContent
                  addonData={props.addonData}
                  slidePaneData={slidePaneData}
                />
              }
              withClose
              TargetElem={<span className="m-1 icon-info_24 indigoIcon" />}
              withClickHandler
              className="prime-title-popover-content"
            />
          );
        }} */
        />
      )}
      {(isOpenSlider || isOpenPrime) && (
        <PrimeSlidePane
          isOpen={isOpenSlider || isOpenPrime }
          onClose={() => handlePrimSliderClose()}
          fareDetails={fareDetails}
          passengerDetails={passengerDetails}
          passengerKey={passengerKey}
          addonData={addonData}
          categoryTitle={addonData.title}
          segmentData={segmentData}
          configData={configData}
          slidePaneData={slidePaneData}
          slidePaneDataMeal={getSlidePaneDataForMeal()}
          setShowSuccessPopup={setShowSuccessPopup}
          ssrCategory={ssrCategory || ''}
          sliderPaneConfigData={sliderPaneConfigData}
          isOpenPrime={isOpenPrime}
        />
      )}
      {/* Old Code: {isShowSuccessPopup && <SuccessPopup {...successPopupProps} />} */}
    </>
  );
};

Prime.propTypes = {
  isRecommended: PropTypes.bool,
  addonData: PropTypes.shape({
    availableBundlePriceByJourney: PropTypes.shape({
      currencyCode: PropTypes.any,
      totalPrice: PropTypes.any,
    }),
    availableSlidePaneData: PropTypes.shape({
      find: PropTypes.func,
    }),
    categoryDescription: PropTypes.any,
    categoryImage: PropTypes.any,
    categoryTitle: PropTypes.any,
  }),
  categoryTitle: PropTypes.string,
  configData: PropTypes.shape({
    addAddonCtaLabel: PropTypes.any,
    addonAddedCtaLabel: PropTypes.any,
    removeAddonCtaLabel: PropTypes.any,
    serviceSuccessfullyAddedPopupLabel: PropTypes.any,
  }),
  fareDetails: PropTypes.any,
  passengerDetails: PropTypes.any,
  passengerKey: PropTypes.any,
  segmentData: PropTypes.shape({
    journeyKey: PropTypes.any,
    journeydetail: PropTypes.shape({
      departure: PropTypes.any,
      destination: PropTypes.any,
      origin: PropTypes.string,
    }),
    segments: PropTypes.any,
  }),
  ssrCategory: PropTypes.string,
  isModifyFlow: PropTypes.string,
};

export default Prime;
