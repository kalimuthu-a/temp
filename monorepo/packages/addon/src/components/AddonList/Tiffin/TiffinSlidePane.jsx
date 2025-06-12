import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import DoubleTabsContainer from 'skyplus-design-system-app/dist/des-system/DoubleTabsContainer';
import AddonSlider from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import eventService from '../../../services/event.service';
import { categoryCodes, productClassCodes } from '../../../constants';
import {
  getAddReviewSummaryData,
  getRemoveReviewSummaryData,
} from '../../../functions/mealUtils';
import MealsList from './MealsList';
import Filter from './Filter';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';
import { createEventForAddonModification } from '../../../functions';

// TD:
const slashedPrice = 3750;

const TiffinSlidePane = (props) => {
  const {
    customMealData,
    selectedPaxIndex,
    slidePaneData,
    segmentData,
    passengerDetails,
    categoryBundleCode,
    bundleTotalPrice,
    categoryTitle,
    onClose,
    onSubmit,
    open,
    isModifyFlow,
    fareDetails,
    overlayCustomClass,
    handleDone,
    isMainCard = false,
    sliderPaneConfigData,
    nextLabel,
    activeAccordionIndex,
    addonData,
  } = props || {};
  const { state, dispatch } = React.useContext(AppContext);

  const defaultSegmentIndex = customMealData.findIndex((segMeal) => {
    return !isEmpty(segMeal);
  });

  const [activeParentTabIndx, setActiveParentTabIndx] = useState(
    defaultSegmentIndex > 0 ? defaultSegmentIndex : 0,
  );
  const [bundleNextBtnPax, setbundleNextBtnPax] = useState(selectedPaxIndex);

  const mealCategoriesRef = useRef();
  const filterElem = useRef();
  // Old Code:
  // const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    dispatch({
      type: addonActions.SET_LIMIT,
      payload: customMealData[activeParentTabIndx].limit,
    });
  }, [activeParentTabIndx]);

  useEffect(() => {
    setbundleNextBtnPax(selectedPaxIndex);
  }, [selectedPaxIndex]);

  const createPassengerDetailsForTabContainer = (segmentIndex) => {
    return passengerDetails.map((passenger) => {
      const { segmentKey } = segmentData.segments[segmentIndex];
      const { passengerKey } = passenger;
      let title = passenger?.name?.first;
      title = passenger?.name?.middle
        ? `${title} ${passenger?.name?.middle}`
        : `${title} ${passenger?.name?.last}`;

      /* Old Code:
      const selectedMealForAPax =
        state.selectedMeals?.[state.tripIndex]?.[segmentKey]?.[
          passengerKey
        ]?.[0]?.meal;
      const mealName = selectedMealForAPax?.ssrName
        ? selectedMealForAPax.ssrName
        : selectedMealForAPax?.name;
      const description = state.selectedMeals?.[state.tripIndex]?.[
        segmentKey
      ]?.[passengerKey]
        ? mealName
        : slidePaneData.selectMealLabel; */

      const isChecked = !!(
        state.selectedMeals[state.tripIndex] &&
        state.selectedMeals[state.tripIndex][segmentKey] &&
        state.selectedMeals[state.tripIndex][segmentKey][passengerKey]
      );

      return {
        title,
        // description,
        checked: isChecked,
      };
    });
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const setAddonData = (selectedMeal) => {
    let selectedAddonTiffinData = [];

    for (const segmentKey in selectedMeal?.[state?.tripIndex]) {
      for (const passengerKey in selectedMeal?.[state?.tripIndex]?.[
        segmentKey
      ]) {
        for (const item in selectedMeal?.[state?.tripIndex]?.[segmentKey]?.[
          passengerKey
        ]) {
          const selectedAddonItem = {
            passengerKey:
              selectedMeal?.[state?.tripIndex]?.[segmentKey]?.[passengerKey]?.[
                item
              ]?.passengerSSRKey?.passengerKey,
            addonName: categoryTitle,
            ssrCode:
              selectedMeal?.[state?.tripIndex]?.[segmentKey]?.[passengerKey]?.[
                item
              ]?.meal?.ssrCode,
          };
          selectedAddonTiffinData.push(selectedAddonItem);
        }
      }
    }

    selectedAddonTiffinData = uniqBy(selectedAddonTiffinData, 'passengerKey');

    let selectedAddonData = {};

    if (
      state?.setGetSelectedAddon?.[state?.tripIndex]?.selectedAddone?.length
    ) {
      selectedAddonData = { ...state.setGetSelectedAddon };

      const nonTiffinAddonData = selectedAddonData[
        state.tripIndex
      ].selectedAddone.filter((oldAddon) => {
        return categoryTitle !== oldAddon.addonName;
      });
      selectedAddonData[state.tripIndex].selectedAddone = [
        ...nonTiffinAddonData,
        ...selectedAddonTiffinData,
      ];
    } else {
      selectedAddonData = { ...state.setGetSelectedAddon };
      selectedAddonData[state.tripIndex] ||= [];
      selectedAddonData[state.tripIndex].selectedAddone ||= [];

      selectedAddonTiffinData.forEach((keyObj) => {
        selectedAddonData[state.tripIndex].selectedAddone.push(keyObj);
      });
    }

    dispatch({
      type: addonActions.SET_GET_SELECTED_ADDON,
      payload: selectedAddonData,
    });
  };

  const handleContinue = (updatedState) => {
    // Old Code:
    // const selectedMeal = state.selectedMeals;
    const selectedMeal = isMainCard
      ? updatedState.selectedMeals
      : state.selectedMeals;
    const totalMealsPriceCount = isMainCard
      ? updatedState.totalMealsPriceCount
      : state.totalMealsPriceCount;

    setAddonData(selectedMeal);
    const addReviewSummaryData = getAddReviewSummaryData(
      selectedMeal,
      categoryTitle,
    );
    const removeReviewSummaryData = getRemoveReviewSummaryData(
      state.confirmedMeals,
      state.underTwelveHourFlight,
      {
        segmentData,
      },
    );

    dispatch({
      type: addonActions.SET_CONFIRMED_MEALS,
      payload: {
        meals: selectedMeal,
        priceAndCount: totalMealsPriceCount,
      },
    });

    if (!isMainCard) {
      onClose();
    }
    onSubmit();
    eventService.update([], removeReviewSummaryData); // Remove
    eventService.update(addReviewSummaryData, []); // Add

    let newlyAddedMeals = [];
    const previousAddedMeals = [];

    const { journeyKey, segments } = segmentData;

    segments.forEach((segment) => {
      const mealSSR = segment.segmentSSRs.find((r) => r.category === 'Meal');

      if (mealSSR) {
        mealSSR.takenssr.forEach((takenMeal) => {
          previousAddedMeals.push({
            ...takenMeal,
            journeyKey,
            segmentKey: segment.segmentKey,
          });
        });
      }
    });
    // Not REQUIRED FOR NOW - FUTURE IMPROVEMENT - START
    // previousAddedMeals.forEach((meal) => {
    //   const findMeal = newlyAddedMeals.find((pmeal) => {
    //     return (
    //       pmeal.ssrCode === meal.ssrCode &&
    //       pmeal.passengerKey === meal.passengerKey &&
    //       pmeal.journeyKey === meal.journeyKey &&
    //       pmeal.segmentKey === meal.segmentKey
    //     );
    //   });
      
    //   newlyAddedMeals.push({
    //     ...meal,
    //     actualPrice: -meal.price,
    //     action: findMeal ? 'remove' : 'add',
    //     ar: 2,
    //   });

    //   newlyAddedMeals.push({ ...meal, actualPrice: findMeal ? 0 : meal.price });
    // });
    // Not REQUIRED FOR NOW - FUTURE IMPROVEMENT - START

    addReviewSummaryData.forEach((meal) => {
      const findMeal = previousAddedMeals.find((pmeal) => {
        return (
          pmeal.ssrCode === meal.ssrCode &&
          pmeal.passengerKey === meal.passengerKey &&
          pmeal.journeyKey === meal.journeyKey &&
          pmeal.segmentKey === meal.segmentKey
        );
      });

      newlyAddedMeals.push({
        ...meal,
        actualPrice: findMeal && !findMeal.bundleCode ? 0 : meal.price,
      });
    });

    newlyAddedMeals = newlyAddedMeals.filter(
      (meal) => meal.journeyKey === segmentData.journeyKey,
    );

    createEventForAddonModification(newlyAddedMeals, removeReviewSummaryData);
  };

  const getPassengerTabData = (mealList, segmentIndex) => {
    const customPassengerDetails =
      createPassengerDetailsForTabContainer(segmentIndex);

    let defaultActiveTab = null;
    if (isMainCard) {
      defaultActiveTab = activeAccordionIndex;
    } else if (!isMainCard) {
      if (categoryBundleCode === categoryCodes.meal) {
        defaultActiveTab = state.paxIndex.filter((item) => item)[0].paxIndex;
      } else {
        defaultActiveTab = bundleNextBtnPax;
      }
    }
    return {
      tabs: customPassengerDetails,
      content: customPassengerDetails.map((_, idx) => {
        return (
          <MealsList
            {...mealList}
            categoryBundleCode={categoryBundleCode}
            slidePaneData={slidePaneData}
            segmentIndex={segmentIndex}
            passengerIndex={idx}
            passengerDetails={passengerDetails}
            segmentKey={segmentData.segments[segmentIndex].segmentKey}
            journeyKey={segmentData.journeyKey}
            key={segmentData.journeyKey}
            bundleTotalPrice={bundleTotalPrice || null}
            isMainCard={isMainCard}
            handleContinue={handleContinue}
            addonData={addonData}
          />
        );
      }),
      defaultActiveTab,
      // TD: old code
      // categoryBundleCode === categoryCodes.meal
      //   ? state.paxIndex.filter((item) => item)[0].paxIndex
      //   : bundleNextBtnPax, // props.selectedPaxIndex,
      showSingleTabBtn: false,
      component: isMainCard ? null : (
        <div className="tiffin-filter-wrapper">
          <Filter
            slidePaneData={slidePaneData}
            availableCuisineList={mealList?.availableCuisineList}
            // scrollCategory={categoryName}
          />
          {props?.slidePaneData?.addUpToMealPerPassenger && (
            <div className="skyplus-tiffin-slide__caution-msg mt-12 p-6">
              <div className="me-6 d-flex">
                <img
                  src={
                    addonData?.cautionIcon ||
                    `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAy
                NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjAwMzkgMTIu
                Njg1MVY4IiBzdHJva2U9IiNBOTdEMEUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9r
                ZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTExLjk5NjEgMTZIMTIuMDA2MSIgc3Ryb2tlPSIjQTk3RDBFIiBzdHJv
                a2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9
                Ik0xMi4wMDM5IDIxLjI1MzlDMTcuMTEyNSAyMS4yNTM5IDIxLjI1MzkgMTcuMTEyNSAyMS4yNTM5IDEyLjAwMzlDMjEuMjUz
                OSA2Ljg5NTI3IDE3LjExMjUgMi43NTM5MSAxMi4wMDM5IDIuNzUzOTFDNi44OTUyNyAyLjc1MzkxIDIuNzUzOTEgNi44OTUy
                NyAyLjc1MzkxIDEyLjAwMzlDMi43NTM5MSAxNy4xMTI1IDYuODk1MjcgMjEuMjUzOSAxMi4wMDM5IDIxLjI1MzlaIiBzdHJ
                va2U9IiNBOTdEMEUiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjwvc3ZnPgo=`
                  }
                  alt=""
                />
              </div>
              <div
                className="skyplus-tiffin-slide__caution-msg-description"
                dangerouslySetInnerHTML={{
                  __html: props?.slidePaneData?.addUpToMealPerPassenger
                    ?.replace('{mealcount}', state.limit)
                    .replace('{FareType}', fareDetails?.fareLabel),
                }}
              />
            </div>
          )}
        </div>
      ),
    };
  };

  const segmentTabData = segmentData.segments.map((segment, segmentIndx) => {
    return {
      title: `<span>${segment.segmentDetails.origin}</span><span>${segment.segmentDetails.destination}</span>`,
      disabled: !!isEmpty(customMealData[segmentIndx]?.customMealListCategoryWise?.order),
    };
  });

  const doubleTabContainerProps = {
    parentTab: {
      tabs: segmentTabData || [],
      defaultActiveTab: segmentTabData?.[activeParentTabIndx] ? activeParentTabIndx : 0,
      showSingleTabBtn: false,
    },
    childTab: segmentTabData.map((_, idx) => {
      return getPassengerTabData(customMealData[idx], idx);
    }),
    getCurrentParentTabIndex: (index) => {
      setActiveParentTabIndx(index);
    },
    onChangeChildTab: (index) => {
      setbundleNextBtnPax(index);
    },
  };

  const handleNextBtn = () => {
    if (bundleNextBtnPax === passengerDetails.length - 1) {
      setbundleNextBtnPax(0);
    } else {
      setbundleNextBtnPax(bundleNextBtnPax + 1);
    }
  };

  const checkBundleMealSelectedForAllPax = () => {
    let count = 0;
    for (const segment in state.selectedMeals[state.tripIndex]) {
      if (segment) {
        for (const passenger in state.selectedMeals[state.tripIndex]?.[
          segment
        ]) {
          if (
            state.selectedMeals[state.tripIndex]?.[segment]?.[passenger]
              ?.length > 0
          ) {
            count +=
              state.selectedMeals[state.tripIndex][segment][passenger].length;
          }
        }
      }
    }

    return count === state.limit * passengerDetails.length;
  };

  const checkUpdateInMealSelection = () => {
    const removeNullData = (mealsArry) => {
      const filteredMealsArry = [];

      mealsArry.forEach((meal) => {
        if (meal) {
          Object.keys(meal).forEach((segKey) => {
            if (meal[segKey]) {
              Object.keys(meal[segKey]).forEach((paxKey) => {
                if (meal[segKey][paxKey]) {
                  filteredMealsArry.push({
                    [segKey]: {
                      [paxKey]: meal[segKey][paxKey],
                    },
                  });
                }
              });
            }
          });
        }
      });

      return filteredMealsArry;
    };

    const filteredSelectedMeals = removeNullData(state.selectedMeals);
    const filteredConfirmedMeals = removeNullData(state.confirmedMeals);

    return (
      !isEqual(filteredConfirmedMeals, filteredSelectedMeals) ||
      state.totalMealsPriceCount[state.tripIndex]?.count > 0
    );
  };

  const isCheckUpdateInMealSelection = open
    ? checkUpdateInMealSelection()
    : false;

  useEffect(() => {
    mealCategoriesRef.current = document.querySelectorAll(
      '.meals-list__category',
    );
    filterElem.current = document.querySelector('.filter__category-name');
  }, []);

  const continueBtnDisabled = useCallback(() => {
    if (
      (isModifyFlow ||
        fareDetails?.productClass === productClassCodes.super6e) &&
      state.takenMeals &&
      state.takenMeals.length &&
      state.selectedMeals &&
      state.selectedMeals.length
    ) {
      let mealRemoved = false;

      if (state.selectedMeals[state.tripIndex]) {
        Object.keys(state.selectedMeals[state.tripIndex]).forEach((sKey) => {
          passengerDetails.every((pDetails) => {
            const takenMealsAPax =
              state?.takenMeals?.[state?.tripIndex]?.[sKey]?.[
                pDetails?.passengerKey
              ] || [];
            const selectedMealsAPax =
              state?.selectedMeals?.[state?.tripIndex]?.[sKey]?.[
                pDetails?.passengerKey
              ] || [];

            if (
              (takenMealsAPax?.length && !selectedMealsAPax) ||
              takenMealsAPax?.length > selectedMealsAPax?.length
            ) {
              mealRemoved = true;
              return false;
            }
            return true;
          });
        });
      }

      return mealRemoved;
    }
    return false;
  }, [state.takenMeals, state.selectedMeals]);

  /* TD:
    const getCurrencyCode = () => {
    let currencycode = 'INR'
    addonData?.availableSSR?.forEach((ssrItem) => {
      if (ssrItem.ssrs?.length > 0) {
        currencycode = ssrItem.ssrs[0]?.currencycode;
      }
    })
    return currencycode;
  } */

  const { price } = state.totalMealsPriceCount[state.tripIndex] || {};
  const currencycode =
    state?.getAddonData?.bookingDetails?.currencyCode || 'INR';
  // state.totalMealsPriceCount[state.tripIndex]?.currencycode || getCurrencyCode();
  const isTiffinSubmitDisabled =
    continueBtnDisabled() ||
    !(
      isCheckUpdateInMealSelection &&
      categoryBundleCode !== categoryCodes.mlst &&
      categoryBundleCode !== categoryCodes.prim
    );

  let footerBtnProps = {};

  const isBundleButtonEnabled = () => {
    const selectedTripMeal = state.selectedMeals[state.tripIndex];
    if (selectedTripMeal) {
      let isActive = 0;
      const passengerWiseSelectedMeal = Object.values(selectedTripMeal);
      if (passengerWiseSelectedMeal) {
        Object.values(passengerWiseSelectedMeal).forEach((paxMealData) => {
          if (paxMealData) {
            const fileredPaxMealData = Object.values(paxMealData).filter(
              (p) => p,
            );
            if (fileredPaxMealData.length) {
              isActive = true;
            } else {
              isActive = false;
            }
          }
        });
      }
      return isActive;
    }
    return false;
  };

  if (!bundleTotalPrice) {
    footerBtnProps = {
      title: sliderPaneConfigData?.totalPriceLabel,
      subTitle: '', // sliderPaneConfigData?.saveRecommendationLabel.replace('{amount}', 735), // TD: - API data
      titleData: price || 0,
      currencycode,
      subTitleData: slashedPrice, // TD: - API data
      buttonTitle: slidePaneData?.sliderButtonLabel,
      onSubmit: handleContinue,
      disabled: isTiffinSubmitDisabled,
      buttonIcon: 'icon-accordion-left-24',
    };
  } else {
    const buttonTitle =
      !checkBundleMealSelectedForAllPax() && passengerDetails.length >= 2
        ? nextLabel
        : slidePaneData?.sliderButtonLabel;

    footerBtnProps.title = sliderPaneConfigData?.totalPriceLabel;
    footerBtnProps.subTitle = '';
    // sliderPaneConfigData?.saveRecommendationLabel.replace('{amount}', 735), // TD: - API data
    footerBtnProps.titleData = bundleTotalPrice;
    footerBtnProps.currencycode = currencycode;
    footerBtnProps.subTitleData = 0; // TD: - API data
    footerBtnProps.buttonTitle = buttonTitle;
    // footerBtnProps.buttonTitle = checkBundleMealSelectedForAllPax() ?
    //  slidePaneData?.sliderButtonLabel : (paxlength < 2 ? slidePaneData?.sliderButtonLabel : nextLabel);
    footerBtnProps.onSubmit = checkBundleMealSelectedForAllPax()
      ? handleDone
      : handleNextBtn;
    footerBtnProps.disabled = !isBundleButtonEnabled();
  }

  const sliderContent = () => {
    return (
      <div className="skyplus-tiffin-slide">
        <div className={!isMainCard && 'skyplus-tiffin-slide__double-tab'}>
          <DoubleTabsContainer
            {...doubleTabContainerProps}
            isMainCard={isMainCard}
          />
        </div>
        {!isMainCard && <OffCanvasFooter {...footerBtnProps} />}
      </div>
    );
  };

  const addonSlider = () => {
    return open ? (
      <AddonSlider
        overlayCustomClass={overlayCustomClass}
        modalCustomClass="tiffin-slide-pane"
        ariaLabel="close button"
        onClose={onClose}
        containerClassName={
          bundleTotalPrice
            ? 'skyplus-offcanvas__child skyplus-offcanvas__addon-mf'
            : 'skyplus-offcanvas__addon-mf'
        }
      >
        {sliderContent()}
      </AddonSlider>
    ) : null;
  };

  return isMainCard ? sliderContent() : addonSlider();
};

TiffinSlidePane.propTypes = {
  bundleTotalPrice: PropTypes.any,
  categoryBundleCode: PropTypes.any,
  categoryTitle: PropTypes.any,
  customMealData: PropTypes.array,
  fareDetails: PropTypes.shape({
    fareLabel: PropTypes.any,
    productClass: PropTypes.any,
  }),
  handleDone: PropTypes.any,
  isModifyFlow: PropTypes.any,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  open: PropTypes.bool,
  overlayCustomClass: PropTypes.string,
  passengerDetails: PropTypes.array,
  segmentData: PropTypes.object,
  selectedPaxIndex: PropTypes.any,
  slidePaneData: PropTypes.object,
  nextLabel: PropTypes.string,
};

TiffinSlidePane.defaultProps = {
  overlayCustomClass: '',
};

export default TiffinSlidePane;
