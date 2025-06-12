import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import TiffinSlidePane from '../Tiffin/TiffinSlidePane';
import { getSlideDataWithFilteredMealsList } from '../Tiffin/TiffinUtils';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { CLASS_PREFIX, categoryCodes } from '../../../constants/index';
import { dietTypeCodes } from '../../../constants/aemAuthoring';

const PassengerListPrime = (props) => {
  const {
    isOpenSlider,
    setOpenSlider,
    addonData,
    slidePaneDataMeal,
    bundleTotalPrice,
    passengerDetails,
    // configData,
    fareDetails,
    passengerKey,
    segmentData,
    sliderPaneConfigData,
  } = props;
  const [selectedPaxIndex, setSelectedPaxIndex] = useState(0);
  const { state, dispatch } = React.useContext(AppContext);

  /* TD: - check functionality for new desing
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  };
  const getPassengerName = (pax) => {
    let title = '';
    let fullName = '';
    if (pax.name) {
      title = capitalizeFirstLetter(pax?.name?.title);
      fullName = pax?.name?.first;
      if (pax?.name?.middle) {
        fullName = `${title}. ${fullName} ${pax?.name?.middle}`;
      }
      fullName = `${title}. ${fullName} ${pax?.name?.last}`;
    } else {
      fullName = pax.passengerKey;
    }

    return fullName;
  };

  const toggleTiffinSlidPane = (paxIndex) => {
    if (state.underTwelveHourFlight) {
      return;
    }
    setSelectedPaxIndex(paxIndex);
    setOpenSlider(!isOpenSlider);
  }; */

  useEffect(() => {
    if (isOpenSlider && state.bundleMeals.length !== 0) {
      dispatch({
        type: addonActions.RESET_SELECTED_MEALS,
        payload: state.bundleMeals,
      });
    }
  }, [state.bundleMeals, isOpenSlider]);

  let customMealData = [];

  const getSlidePaneDataForMeal = () => {
    return addonData.availableSlidePaneData.find((aemItem) => {
      return aemItem.categoryBundleCode === categoryCodes.meal;
    });
  };

  if (addonData?.availableSSR?.length > 0) {
    customMealData = addonData.availableSSR.map(
      (segmentMealData, segmentIndex) => {
        if (segmentMealData.ssrs.length === 0) {
          return {};
        }
        return getSlideDataWithFilteredMealsList(
          // props.addonData,
          addonData.availableSSR,
          getSlidePaneDataForMeal(),
          state.mealFilters,
          state.mealSearch,
          segmentIndex,
          segmentMealData.limit,
          segmentData?.journeydetail?.departure,
        );
      },
    );
  }
  /* Old Code:
  const firstAddedMeal = (passengerKey) => {
  const selectedMealNamesAndDiet = [];

  for (const segment in state.bundleMeals[state.tripIndex]) {
  if (state.bundleMeals[state.tripIndex]?.[segment]?.[passengerKey]) {
  const passengerKeyDefinedMeals = state.bundleMeals[state.tripIndex][
  segment
  ][passengerKey].filter((pk) => pk);
  // ][passengerKey].filter((pk) => pk && pk.ssrCategory !== categoryCodes.meal);

  for (const pk in passengerKeyDefinedMeals) {
  const obj = {
  name: passengerKeyDefinedMeals[pk].meal.ssrName
  ? passengerKeyDefinedMeals[pk].meal.ssrName
  : passengerKeyDefinedMeals[pk].meal.name,
  diet: passengerKeyDefinedMeals[pk].meal.dietaryPreference,
  };
  selectedMealNamesAndDiet.push(obj);
  }
  }
  }

  return selectedMealNamesAndDiet[0];
  }; */

  const getBundledMeals = () => {
    const selectedMealNamesAndDiet = [];
    for (const segment in state.bundleMeals[state.tripIndex]) {
      const segmentDataBundle = Object.values(state.bundleMeals[state.tripIndex]?.[segment] || {}).flat();
      segmentDataBundle.forEach((sMeal) => {
        const { meal } = sMeal || { meal: {}};
        const repeatedMeal = selectedMealNamesAndDiet.find((selectedMeal) => (selectedMeal.name === meal.name)
         || (selectedMeal.name === meal.ssrName));

        if (repeatedMeal) {
          repeatedMeal.count += 1;
        } else {
          const obj = {
            name: meal.name || meal.ssrName,
            diet: meal.preference,
            mealImage: meal.image,
            count: 1,
          };

          selectedMealNamesAndDiet.push(obj);
        }
      });
    }

    return selectedMealNamesAndDiet;
  };

  const handleTiffinSliderClose = () => {
    dispatch({
      type: addonActions.CLEAR_SELECTED_MEALS,
    });
    return setOpenSlider(false);
  };

  const handleDone = () => {
    dispatch({
      type: addonActions.SET_BUNDLE_MEALS,
      payload: {
        meals: state.selectedMeals,
        priceAndCount: state.totalMealsPriceCount,
      },
    });
    handleTiffinSliderClose();
  };

  return (
    <>
      <div className="prime__head">
        {getBundledMeals()?.map((meal) => {
          return (
            <div
              className={`${CLASS_PREFIX}-prime__meals-list`}
              key={meal.passengerKey}
            >
              <div className={`${CLASS_PREFIX}-prime__meals-list-img`}>
                <img
                  src={meal?.mealImage?._publishUrl}
                  alt={meal?.name}
                />
              </div>
              <div className={`${CLASS_PREFIX}-prime__meals-list-desc`}>
                <div
                  className={`${CLASS_PREFIX}-prime__meals-list-desc-title tags-small`}
                >
                  {!!meal.diet && (
                  <i
                    className={`skyplus-meal-card__icon ${
                      meal.diet === dietTypeCodes.nonveg
                        ? 'icon-non-veg'
                        : 'icon-veg'
                    }`}
                  />
                  )}
                  &nbsp;
                  {meal.diet}
                </div>
                <div
                  className={`${CLASS_PREFIX}-prime__meals-list-desc-subtitle body-small-regular`}
                >
                  {meal.name}
                </div>
              </div>
              <div
                className={`${CLASS_PREFIX}-seat-eat__meals-frequency body-medium-medium`}
              >
                {meal.count}&nbsp;x
              </div>
            </div>
          );
        })}
        {/* Old Code: {passengerDetails.map((pax) => {
          console.log(passengerDetails, 'passenger details');
          const firstMeal = firstAddedMeal(pax.passengerKey);
          // TD: - commented for new desing logic change
          // const fullName = getPassengerName(pax);
          // const firstMealLabel = firstMeal
          //   ? `${firstMeal.name.slice(0, 15)}...`
          //   : slidePaneData.selectMealLabel;
          console.log(firstMeal, 'first meal');
          return firstMeal && (
            <div
              className={`${CLASS_PREFIX}-prime__meals-list`}
              key={pax.passengerKey}
            >
              <div className={`${CLASS_PREFIX}-prime__meals-list-img`}>
                <img src={firstMeal.image._path} alt="broken img" />
              </div>
              <div className={`${CLASS_PREFIX}-prime__meals-list-desc`}>
                <div
                  className={`${CLASS_PREFIX}-prime__meals-list-desc-title tags-small`}
                >
                  {!!firstMeal.diet && (
                  <i
                    className={`skyplus-meal-card__icon ${
                      firstMeal.diet === dietTypeCodes.nonveg
                        ? 'icon-non-veg'
                        : 'icon-veg'
                    }`}
                  />
                  )}
                  &nbsp;
                  {firstMeal.diet}
                </div>
                <div
                  className={`${CLASS_PREFIX}-prime__meals-list-desc-subtitle body-small-regular`}
                >
                  {firstMeal.name}
                </div>
              </div>
              <div
                className={`${CLASS_PREFIX}-seat-eat__meals-frequency body-medium-medium`}
              >
                1X
              </div>
            </div>
          );
        })} */}
      </div>
      {!state.underTwelveHourFlight && (
        <TiffinSlidePane
          open={isOpenSlider}
          onClose={() => handleTiffinSliderClose()}
          fareDetails={fareDetails}
          passengerDetails={passengerDetails}
          passengerKey={passengerKey}
          customMealData={customMealData}
          categoryTitle={addonData.title}
          categoryBundleCode={addonData.categoryBundleCode}
          segmentData={segmentData}
          slidePaneData={slidePaneDataMeal}
          selectedPaxIndex={selectedPaxIndex}
          setSelectedPaxIndex={(i) => setSelectedPaxIndex(i)}
          handleDone={() => handleDone()}
          overlayCustomClass="prime-nested-sliderpane"
          bundleTotalPrice={bundleTotalPrice}
          nextLabel={sliderPaneConfigData?.nextCtaLabel}
          addonData={addonData}
        />
      )}
    </>
  );
};

PassengerListPrime.propTypes = {
  addonData: PropTypes.shape({
    availableSSR: PropTypes.shape({
      length: PropTypes.number,
      map: PropTypes.func,
    }),
    availableSlidePaneData: PropTypes.any,
    categoryTitle: PropTypes.any,
    categoryBundleCode: PropTypes.any,
    title: PropTypes.string,
  }),
  bundleTotalPrice: PropTypes.any,
  configData: PropTypes.shape({
    doneCtaLabel: PropTypes.any,
  }),
  fareDetails: PropTypes.any,
  passengerDetails: PropTypes.array,
  passengerKey: PropTypes.any,
  segmentData: PropTypes.any,
  slidePaneData: PropTypes.shape({
    complimentaryLabel: PropTypes.any,
    selectMealLabel: PropTypes.any,
  }),
  slidePaneDataMeal: PropTypes.any,
  isOpenSlider: PropTypes.bool,
  setOpenSlider: PropTypes.func,
  sliderPaneConfigData: PropTypes.object,
};

export default PassengerListPrime;
