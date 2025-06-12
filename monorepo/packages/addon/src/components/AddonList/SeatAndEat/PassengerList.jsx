import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { getSlideDataWithFilteredMealsList } from '../Tiffin/TiffinUtils';
import TiffinSlidePane from '../Tiffin/TiffinSlidePane';
import { CLASS_PREFIX } from '../../../constants/index';

const PassengerList = (props) => {
  const {
    isOpenSlider,
    setOpenSlider,
    addonData,
    passengerDetails,
    fareDetails,
    passengerKey,
    segmentData,
    slidePaneDataMeal,
    bundleTotalPrice,
  } = props;
  const [selectedPaxIndex, setSelectedPaxIndex] = useState(0);
  const { state, dispatch } = React.useContext(AppContext);

  // commented for new design check
  // const capitalizeFirstLetter = (string) => {
  //   return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  // };
  // const getPassengerName = (pax) => {
  //   let title = '';
  //   let fullName = '';
  //   if (pax.name) {
  //     title = capitalizeFirstLetter(pax?.name?.title);
  //     fullName = pax?.name?.first;
  //     if (pax?.name?.middle) {
  //       fullName = `${title}. ${fullName} ${pax?.name?.middle}`;
  //     }
  //     fullName = `${title}. ${fullName} ${pax?.name?.last}`;
  //   } else {
  //     fullName = pax.passengerKey;
  //   }
  //   return fullName;
  // };

  useEffect(() => {
    if (isOpenSlider && state.bundleMeals.length !== 0) {
      dispatch({
        type: addonActions.RESET_SELECTED_MEALS,
        payload: state.bundleMeals,
      });
    }
  }, [state.bundleMeals, isOpenSlider]);

  let customMealData = [];

  if (addonData?.availableSSR?.length > 0) {
    customMealData = addonData.availableSSR.map(
      (segmentMealData, segmentIndex) => {
        if (segmentMealData.ssrs.length === 0) {
          return {};
        }
        return getSlideDataWithFilteredMealsList(
          addonData.availableSSR,
          addonData.availableSlidePaneData[1],
          state.mealFilters,
          state.mealSearch,
          segmentIndex,
          segmentMealData.limit,
          segmentData?.journeydetail?.departure,
        );
      },
    );
  }
  const firstAddedMeal = (paxKey) => {
    const selectedMealNamesAndDiet = [];

    for (const segment in state.bundleMeals[state.tripIndex]) {
      if (state.bundleMeals[state.tripIndex]?.[segment]?.[paxKey]) {
        const passengerKeyDefinedMeals = state.bundleMeals[state.tripIndex][
          segment
        ][paxKey].filter((pk) => pk);

        for (const pk in passengerKeyDefinedMeals) {
          if (passengerKeyDefinedMeals[pk]) {
            const obj = {
              name: passengerKeyDefinedMeals[pk].meal.ssrName
                ? passengerKeyDefinedMeals[pk].meal.ssrName
                : passengerKeyDefinedMeals[pk].meal.name,
              diet: passengerKeyDefinedMeals[pk].meal.preference,
              mealImage: passengerKeyDefinedMeals[pk].meal.image,
            };
            selectedMealNamesAndDiet.push(obj);
          }
        }
      }
    }
    return selectedMealNamesAndDiet[0];
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
      <div className={`${CLASS_PREFIX}-seat-eat__meals-list-container`}>
        {passengerDetails.map((pax) => {
          // TD: - commented for new design
          // const fullName = getPassengerName(pax);
          // const firstMealLabel = firstMeal
          //   ? `${firstMeal.name.slice(0, 15)}...`
          //   : slidePaneData.selectMealLabel;

          const firstMeal = firstAddedMeal(pax.passengerKey);
          return (
            firstMeal && (
              <div
                className={`${CLASS_PREFIX}-seat-eat__meals-list`}
                key={pax.passengerKey}
              >
                <div className={`${CLASS_PREFIX}-seat-eat__meals-list-img`}>
                  <img
                    src={firstMeal.image._publishUrl}
                    alt={firstMeal.name}
                  />
                </div>
                <div className={`${CLASS_PREFIX}-seat-eat__meals-list-desc`}>
                  <div
                    className={`${CLASS_PREFIX}-seat-eat__meals-list-desc-title tags-small`}
                  >
                    {firstMeal.diet}
                  </div>
                  <div
                    className={`${CLASS_PREFIX}-seat-eat__meals-list-desc-subtitle body-small-regular`}
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
            )
          );
        })}
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
          overlayCustomClass="seateat-nested-sliderpane"
          bundleTotalPrice={bundleTotalPrice}
          addonData={addonData}
        />
      )}
    </>
  );
};

PassengerList.propTypes = {
  isOpenSlider: PropTypes.bool,
  setOpenSlider: PropTypes.func,
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
  passengerDetails: PropTypes.shape({
    map: PropTypes.func,
  }),
  passengerKey: PropTypes.any,
  segmentData: PropTypes.any,
  slidePaneData: PropTypes.shape({
    complimentaryLabel: PropTypes.any,
    selectMealLabel: PropTypes.any,
  }),
  slidePaneDataMeal: PropTypes.any,
};

export default PassengerList;
