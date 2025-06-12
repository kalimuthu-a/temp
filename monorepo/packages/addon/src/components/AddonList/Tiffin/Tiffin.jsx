import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TiffinSlidePane from './TiffinSlidePane';
import { getSlideDataWithFilteredMealsList } from './TiffinUtils';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import TiffinCard from './TiffinCard';
import { categoryTitleCodes } from '../../../constants/aemAuthoring';
import { categoryCodes } from '../../../constants';
// Old Code:
// import eventService from '../../../services/event.service';
// import {
//   getAddReviewSummaryData,
//   getRemoveReviewSummaryData,
// } from '../../../functions/mealUtils';
// import { removeConfirmedMealsForAPax } from '../../../store/addonReducerHelpers';
// import SuccessPopup from 'skyplus-design-system-app/dist/des-system/SuccessPopup';
// import { emptyFn, formatCurrencyFunc } from '../../../functions/utils';
// import AddedButton from './AddedButton';
// import RemoveAddonPopup from '../../../common/RemoveAddonPopup/RemoveAddonPopup';

const Tiffin = (props) => {
  const {
    selectedPax,
    addonData,
    segmentData,
    isModifyFlow,
    configData,
    fareDetails,
    passengerDetails,
    passengerKey,
    ssrCategory,
    sliderPaneConfigData,
    isMainCard,
    onClose,
    activeAccordionIndex,
  } = props;

  const { state, dispatch } = React.useContext(AppContext);
  const [isOpenSlider, setOpenSlider] = useState(() => isMainCard);
  const [isAddonSubmit, setAddonSubmit] = useState(false);
  /* Old Code:
  const [isShowSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isRemoveAddonPopup, setRemoveAddonPopup] = useState(false);
  const selectedSegKeysForRemoval = useRef([]); */

  const firstAddedMeal = () => {
    const selectedMealNames = [];

    for (const segment in state.confirmedMeals[state.tripIndex]) {
      if (
        state.confirmedMeals[state.tripIndex]?.[segment]?.[
          selectedPax.passengerKey
        ]
      ) {
        const passengerKeyDefinedMeals = state.confirmedMeals[state.tripIndex][
          segment
        ][selectedPax.passengerKey].filter((pk) => pk);

        for (const pk in passengerKeyDefinedMeals) {
          if (pk) {
            selectedMealNames.push(
              passengerKeyDefinedMeals[pk].meal.ssrName
                ? passengerKeyDefinedMeals[pk].meal.ssrName
                : passengerKeyDefinedMeals[pk].meal.name,
            );
          }
        }
      }
    }

    return selectedMealNames.join(' & ');
  };

  /* Old Code:

  const onRemoveAddonPopupCloseHandler = () => {
    setRemoveAddonPopup(false);
  };

  const removeAddedMeal = (selectedSegKeysForRemoveLocal) => {
    const payloadData = {
      passengerKey: selectedPax.passengerKey,
      segmentKeys: selectedSegKeysForRemoveLocal,
      category: addonData.title,
    };
    const updatedState = removeConfirmedMealsForAPax(state, {
      type: addonActions.REMOVE_CONFIRMED_MEALS_FOR_A_PAX,
      payload: payloadData,
    });
    dispatch({
      type: addonActions.REMOVE_CONFIRMED_MEALS_FOR_A_PAX,
      payload: payloadData,
    });
    if (isRemoveAddonPopup) {
      onRemoveAddonPopupCloseHandler();
    }
    const addReviewSummaryData = getAddReviewSummaryData(
      updatedState.confirmedMeals,
      addonData.title,
    );
    const removeReviewSummaryData = getRemoveReviewSummaryData(
      state.confirmedMeals,
      state.underTwelveHourFlight,
      {
        segmentData,
      },
    );
    eventService.update([], removeReviewSummaryData); // Remove
    eventService.update(addReviewSummaryData, []); // Add
  };

  const checkMealForAPaxForAllSegment = () => {
    selectedSegKeysForRemoval.current = [];
    for (const segmentKey in state.confirmedMeals[state.tripIndex]) {
      if (segmentKey) {
        for (const passKey in state.confirmedMeals[state.tripIndex][
          segmentKey
        ]) {
          if (
            selectedPax.passengerKey === passKey &&
          !!state.confirmedMeals[state.tripIndex][segmentKey][passKey]
          ) {
            selectedSegKeysForRemoval.current.push(segmentKey);
            break;
          }
        }
      }
    }

    return selectedSegKeysForRemoval;
  };

  const onRemoveBtnClick = () => {
    const selectedSegKeyForRemoval = checkMealForAPaxForAllSegment();
    if (selectedSegKeyForRemoval.current.length > 1) {
      setRemoveAddonPopup(true);
    } else {
      removeAddedMeal(selectedSegKeyForRemoval.current);
    }
  };

  const segmentList = segmentData.segments
    .map((segment) => {
      const isSegmentPresent = selectedSegKeysForRemoval.current.some(
        (segKey) => segKey === segment.segmentKey,
      );

      if (isSegmentPresent) {
        return {
          label: `${segment.segmentDetails.origin} - ${segment.segmentDetails.destination}`,
          checked: isSegmentPresent,
          id: segment.segmentKey,
          disabled: false,
          className: '',
        };
      }

      return undefined;
    })
    .filter((s) => !!s);

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
  };

  const copyTotalMealsPriceCount = get(
    state,
    ['copyTotalMealsPriceCount', state.tripIndex],
    null,
  );
  let amount = '';
  if (copyTotalMealsPriceCount) {
    amount = formatCurrency(
      copyTotalMealsPriceCount.price,
      copyTotalMealsPriceCount.currencycode,
      {
        minimumFractionDigits: 0,
      },
    );
  }

  const disableCTA = () => {
    return (
      (addonData?.categoryBundleCode === categoryCodes.meal &&
        (state.mlstBundleFare[state.tripIndex]?.isSelected ||
          state.primBundleFare[state.tripIndex]?.isSelected ||
          (state.underTwelveHourFlight &&
            state.flexiPlusSuper6ECorpFareForMeal))) ||
      (state.underTwelveHourFlight && isModifyFlow)
    );
  };

  const hideRemoveCTA = () => {
    const { canBeRemoved = true } =
      props?.addonData?.availableSSR?.[0]?.takenssr?.find(
        (ssr) => ssr.passengerKey === selectedPax.passengerKey,
      ) ?? { canBeRemoved: true };

    return (
      addonData?.categoryBundleCode === categoryCodes.meal &&
      (state.mlstBundleFare[state.tripIndex]?.isSelected ||
        state.primBundleFare[state.tripIndex]?.isSelected ||
        (state.underTwelveHourFlight &&
          state.flexiPlusSuper6ECorpFareForMeal) ||
        isModifyFlow ||
        !canBeRemoved)
    );
  }; */

  const selectedAddOnName = () => {
    if (
      addonData?.categoryBundleCode === categoryCodes.meal &&
      state.underTwelveHourFlight
    ) {
      if (
        state.mlstBundleFare[state.tripIndex]?.isSelected ||
        state.primBundleFare[state.tripIndex]?.isSelected
      ) {
        return configData.includedLabel;
      }
      if (state.flexiPlusSuper6ECorpFareForMeal) {
        return configData.selectOnBoardLabel;
      }
      return configData?.addedLabel;
    }
    return firstAddedMeal();
  };

  const addInfoLable = () => {
    const includedAsPartOfBundleLabel = configData?.includedAsPartOfBundleLabel;
    const primeBundleLabel = categoryTitleCodes.prim;
    const seatAndEatBundleLabel = categoryTitleCodes.mlst;
    let labelText = '';
    if (state.mlstBundleFare[state.tripIndex]?.isSelected) {
      labelText = includedAsPartOfBundleLabel?.replace(
        '{}',
        seatAndEatBundleLabel,
      );
    }
    if (state.primBundleFare[state.tripIndex]?.isSelected) {
      labelText = includedAsPartOfBundleLabel?.replace(
        '{}',
        primeBundleLabel,
      );
    }
    return labelText?.length ? labelText : null;
  };

  const uptoLabel = () => {
    if (state.flexiPlusSuper6ECorpFareForMeal) {
      return configData?.includedWithFareLabel?.replace(
        '{}',
        fareDetails?.fareLabel,
      );
    }
    return '';
  };

  /* Old Code:
  const addOnCardTiffinProps = {
    title: addonData?.title,
    image: addonData?.image,
    discription: addonData.description?.html,
    uptoLabel: uptoLabel(),
    discountLabel: '',
    addLabel: configData?.addLabel,
    addedLabel: configData?.addedLabel,
    removeLable: configData?.removeLabel,
    addInfoLable: addInfoLable(),
    addonType: '6E-Tiffin',
    addonSelected: !!selectedAddOnName(),
    selectedAddonName: selectedAddOnName(),
    selectedAddonPrice: null,
    isInformationIcon: false,
    isCheckboxVisible: false,
    isCheckboxId: '',
    isCheckboxLabel: '',
    selfSelectedAddobe: false,
    disableCTA: disableCTA(),
    hideRemoveCTA: hideRemoveCTA(),
    setRemoveSelected: () => onRemoveBtnClick(),
    setOpenSlider: () => setOpenSlider(true),
    imageText: 'Image Text',
    imageSubText: 'Image sub text',
  }; */
  let customMealData = [];

  if (addonData?.availableSSR?.length > 0) {
    customMealData = addonData.availableSSR.map(
      (segmentMealData, segmentIndex) => {
        if (segmentMealData?.ssrs?.length === 0) {
          return {};
        }
        return getSlideDataWithFilteredMealsList(
          addonData.availableSSR,
          addonData.availableSlidePaneData[0],
          state.mealFilters,
          state.mealSearch,
          segmentIndex,
          segmentMealData.limit,
          segmentData?.journeydetail?.departure,
        );
      },
    );
  }

  const handleTiffinSliderClose = () => {
    dispatch({
      type: addonActions.CLEAR_SELECTED_MEALS,
      // payload: state.confirmedMeals,
    });
    if (isMainCard) {
      onClose();
    }
    return setOpenSlider(false);
  };

  useEffect(() => {
    if (state.confirmedMeals.length !== 0) {
      dispatch({
        type: addonActions.RESET_SELECTED_MEALS,
        payload: state.confirmedMeals,
      });
    }
  }, [state.confirmedMeals]);

  useEffect(() => {
    const { tripId = 0 } = props;
    const mealsData = state.confirmedMeals[tripId];
    let mealsCount = 0;

    for (const segment in mealsData) {
      if (segment) {
        for (const passKey in mealsData[segment]) {
          if (passKey) {
            mealsCount += mealsData[segment][passKey]?.length || 0;
          }
        }
      }
    }

    if (mealsCount > 0 && isAddonSubmit) {
      // Old Code
      // setShowSuccessPopup(true);
      // setTimeout(() => setShowSuccessPopup(false), 5000);
    }

    setAddonSubmit(false);
  }, [isAddonSubmit]);

  const addInfoLableText = addInfoLable();

  const getTiffinSlidePane = () => (
    <TiffinSlidePane
      open={isOpenSlider}
      onClose={() => handleTiffinSliderClose()}
      onSubmit={() => setAddonSubmit(true)}
      fareDetails={fareDetails}
      passengerDetails={passengerDetails}
      passengerKey={passengerKey}
      customMealData={customMealData}
      categoryTitle={addonData.title}
      categoryBundleCode={addonData.categoryBundleCode}
      segmentData={segmentData}
      slidePaneData={addonData.availableSlidePaneData[0]}
      ssrCategory={ssrCategory || ''}
      isModifyFlow={isModifyFlow}
      sliderPaneConfigData={sliderPaneConfigData}
      addonData={addonData}
    />
  );

  if (isMainCard) {
    return getTiffinSlidePane();
  }

  return (
    <>
      <TiffinCard
        onClose={() => handleTiffinSliderClose()}
        onSubmit={() => setAddonSubmit(true)}
        fareDetails={fareDetails}
        passengerDetails={passengerDetails}
        passengerKey={passengerKey}
        customMealData={customMealData}
        categoryTitle={addonData.title}
        categoryBundleCode={addonData.categorybundlecode}
        segmentData={segmentData}
        slidePaneData={addonData.availableSlidePaneData[0]}
        ssrCategory={ssrCategory || ''}
        isModifyFlow={isModifyFlow}
        setOpenSlider={() => setOpenSlider(true)}
        isMainCard
        activeAccordionIndex={activeAccordionIndex}
        addonData={addonData}
        uptoLabel={uptoLabel}
        addInfoLableText={addInfoLableText}
        sliderPaneConfigData={sliderPaneConfigData}
        selectedAddOnName={selectedAddOnName()}
      />

      {isOpenSlider && (
        getTiffinSlidePane()
      )}
    </>
  );
};

Tiffin.propTypes = {
  addonData: PropTypes.object,
  configData: PropTypes.object,
  fareDetails: PropTypes.shape({
    fareLabel: PropTypes.any,
    productClass: PropTypes.any,
  }),
  isModifyFlow: PropTypes.any,
  passengerDetails: PropTypes.array,
  passengerKey: PropTypes.any,
  segmentData: PropTypes.object,
  selectedPax: PropTypes.shape({
    name: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.any,
    }),
    passengerKey: PropTypes.any,
  }),
  ssrCategory: PropTypes.string,
  tripId: PropTypes.number,
  sliderPaneConfigData: PropTypes.object,
  isMainCard: PropTypes.bool,
  onClose: PropTypes.func,
  activeAccordionIndex: PropTypes.bool,
};

export default Tiffin;
