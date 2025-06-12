import React from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { STRING_TYPE } from '../../../constants';
import { removeSpacesAndToLowerCase } from './TiffinUtils';
import { updateStateAfterSelectedMeal, updateStateAfterRemoveMeal } from '../../../store/addonReducerHelpers';
import MealCard from './MealCard';

// Old Code:
// import { Alert } from 'reactstrap';
const MealsList = (props) => {
  const {
    addonData,
    journeyKey,
    segmentKey,
    passengerIndex,
    passengerDetails,
    segmentIndex,
    categoryBundleCode,
    bundleTotalPrice,
    slidePaneData,
    searchResultList,
    customMealListCategoryWise,
    handleContinue,
    isMainCard,
  } = props || {};
  const { state, dispatch } = React.useContext(AppContext);
  const { CSS_ID } = STRING_TYPE;
  const getFlatMealFromContextMeals = (contextMeals) => {
    const meals = [];
    for (const tripkey in contextMeals) {
      for (const segKey in contextMeals[tripkey]) {
        for (const passengerKey in contextMeals[tripkey][segKey]) {
          for (const item in contextMeals[tripkey][segKey][passengerKey]) {
            const mealItem =
              contextMeals[tripkey][segKey][passengerKey][item];

            meals.push({
              ...mealItem.meal,
              tripkey,
              journeyKey: mealItem.journeyKey,
              segmentKey: segKey,
              passengerKey,
              ssrCode: mealItem.meal.ssrCode,
              ssrCategory: mealItem.ssrCategory,
              takenSsrKey: mealItem.passengerSSRKey.takenSsrKey,
            });
          }
        }
      }
    }

    return meals;
  };

  const tmeals = getFlatMealFromContextMeals(state.takenMeals);

  const onAdd = (meal) => {
    const notATakenMeal = tmeals.find(
      (_tmeals) => _tmeals.ssrCode === meal.ssrCode &&
        _tmeals.journeyKey === journeyKey &&
        _tmeals.segmentKey === segmentKey &&
        _tmeals.passengerKey ===
          meal.passengersSSRKey[passengerIndex].passengerKey,
    );

    dispatch({
      type: addonActions.SET_SELECTED_MEALS,
      payload: {
        meal,
        isTaken: !!notATakenMeal,
        segmentIndex,
        passengerIndex,
        passengerSSRKey: meal.passengersSSRKey[passengerIndex],
        segmentKey,
        journeyKey,
        ssrCategory: categoryBundleCode,
        bundleTotalPrice: bundleTotalPrice || null,
      },
    });

    if (isMainCard) {
      const updatedState = updateStateAfterSelectedMeal(state, { payload: {
        meal,
        isTaken: !!notATakenMeal,
        segmentIndex,
        passengerIndex,
        passengerSSRKey: meal.passengersSSRKey[passengerIndex],
        segmentKey,
        journeyKey,
        ssrCategory: categoryBundleCode,
        bundleTotalPrice: bundleTotalPrice || null,
      } });
      handleContinue(updatedState);
    }
  };

  const onRemove = (meal) => {
    dispatch({
      type: addonActions.REMOVE_SELECTED_MEALS,
      payload: {
        meal,
        segmentIndex,
        passengerIndex,
        passengerSSRKey: meal.passengersSSRKey[passengerIndex],
        segmentKey,
        journeyKey,
      },
    });

    if (isMainCard) {
      const updatedState = updateStateAfterRemoveMeal(state, { payload: {
        meal,
        segmentIndex,
        passengerIndex,
        passengerSSRKey: meal.passengersSSRKey[passengerIndex],
        segmentKey,
        journeyKey,
      } });
      handleContinue(updatedState);
    }
  };

  const addedCheck = (selectedMealsByUser, meal) => {
    return !!selectedMealsByUser.find((addedMeal) => {
      return addedMeal.meal.ssrCode === meal.ssrCode;
    });
  };

  const canBeRemovedCheck = (selectedMealsByUser, meal) => {
    return selectedMealsByUser.filter((addedMeal) => {
      return (addedMeal.meal.ssrCode === meal.ssrCode && addedMeal.canBeRemoved !== false);
    }).length > 0;
  };

  const getLatestThreeMeals = () => {
    const mealArray = [];
    let counter = 0;
    customMealListCategoryWise?.order?.forEach((categoryMeal) => {
      customMealListCategoryWise[categoryMeal]?.data?.forEach((meal) => {
        counter += 1;
        const selectedMealsByUser = state.selectedMeals[state.tripIndex] &&
                state.selectedMeals[state.tripIndex][segmentKey]
          ? state.selectedMeals[state.tripIndex][segmentKey][
            meal.passengersSSRKey[passengerIndex].passengerKey
          ] || []
          : [];

        const isAdded = selectedMealsByUser.filter((addedMeal) => {
          return addedMeal.meal.ssrCode === meal.ssrCode;
        }).length > 0;

        const isCanBeRemoved = selectedMealsByUser.filter((addedMeal) => {
          return (addedMeal.meal.ssrCode === meal.ssrCode && addedMeal.canBeRemoved !== false);
        }).length > 0;

        if (counter > 3 && isAdded) {
          mealArray.unshift({ ...meal, isAdded, isCanBeRemoved });
          return;
        }

        mealArray.push({ ...meal, isAdded, isCanBeRemoved });
      });
    });

    return mealArray.slice(0, 3);
    // Old Code:
    // mealArray.sort((a, b) => {
    //   if (a.isAdded && !b.isAdded) return -1;
    //   return 1;
    // });
    // return mealArray.slice(0, 3);
  };

  const getNutritionalInfoData = (meal) => {
    const mealSsr = addonData?.ssrList?.filter((item) => item?.ssrCode === meal?.ssrCode)?.[0] || {};
    return {
      nutritionalInfoLabel: mealSsr?.nutritionalInfoLabel,
      nutritionalInformation: mealSsr?.nutritionalInformation,
      servingPerContainer: mealSsr?.servingPerContainer,
      nutritionalFacts: mealSsr?.nutritionalFacts,
      dailyValueNote: mealSsr?.dailyValueNote,
    };
  };

  const displayMealCard = (meal) => {
    const selectedMealsByUser = state.selectedMeals[state.tripIndex] &&
      state.selectedMeals[state.tripIndex][segmentKey]
      ? state.selectedMeals[state.tripIndex][segmentKey][
        meal.passengersSSRKey[passengerIndex].passengerKey
      ] || []
      : [];

    const isAdded = selectedMealsByUser.filter((addedMeal) => {
      return addedMeal.meal.ssrCode === meal.ssrCode;
    }).length > 0;

    const isCanBeRemoved = selectedMealsByUser.filter((addedMeal) => {
      return (addedMeal.meal.ssrCode === meal.ssrCode && addedMeal.canBeRemoved !== false);
    }).length > 0;

    const reachedLimitForEachMealSelection = selectedMealsByUser.filter((addedMeal) => {
      return addedMeal.meal.ssrCode === meal.ssrCode;
    }).length === meal.limitPerPassenger;

    const nutritionalInfoData = getNutritionalInfoData(meal);

    return (
      <MealCard
        {...meal}
        passengerIndex={passengerIndex}
        passengerDetails={passengerDetails}
        categoryBundleCode={categoryBundleCode}
        slidePaneData={slidePaneData}
        onAdd={() => onAdd(meal)}
        onRemove={() => onRemove(meal)}
        added={isAdded}
        canBeRemoved={isCanBeRemoved}
        reachedLimitForEachMealSelection={reachedLimitForEachMealSelection}
        key={meal.ssrCode}
        isMainCard={isMainCard}
        handleContinue={handleContinue}
        showDivider={customMealListCategoryWise?.order?.length > 1 ||
          customMealListCategoryWise[meal.category]?.data?.length > 1}
        nutritionalInfoData={nutritionalInfoData}
      />
    );
  };

  const noResultFoundData = (status) => {
    return (
      <div className="meals-list__no-match-meal">
        <img
          src={slidePaneData?.noMatchFoundImage?._publishUrl}
          alt="no-match-found"
          className="meals-list__noresult-image"
        />
        <div className="meals-list__noresult-container">
          <div className="meals-list__noresult-title">{slidePaneData.noMatchFoundLabel}</div>
          <div className="meals-list__noresult-subtitle">{slidePaneData.noMatchFoundDescription ||
                 'We could not find any matching results. Let’s try something new!'}
          </div>
        </div>
        {status && <p />}
      </div>
    );
  };

  return (
    <div className={`${isMainCard ? 'main-card-meals-list' : 'meals-list'}`}>
      {state.mealSearch.length > 0 ? (
        <div className="meals-list__search">
          {searchResultList.length > 0 && (
          <div className="meals-list__category">
            <div className="sh7">{slidePaneData.searchResultsLabel}</div>
          </div>
          )}
          {searchResultList.length > 0 ? (
            <div className="meals-list__wrap">
              {searchResultList.map((meal) => {
                const selectedMealsByUser =
                  state.selectedMeals[state.tripIndex] &&
                  state.selectedMeals[state.tripIndex][segmentKey]
                    ? state.selectedMeals[state.tripIndex][segmentKey][
                      meal.passengersSSRKey[passengerIndex].passengerKey
                    ] || []
                    : [];
                const nutritionalInfoData = getNutritionalInfoData(meal);

                return (
                  <MealCard
                    {...meal}
                    passengerDetails={passengerDetails}
                    passengerIndex={passengerIndex}
                    slidePaneData={slidePaneData}
                    onAdd={() => onAdd(meal)}
                    onRemove={() => onRemove(meal)}
                    // added={
                    // !!selectedMealsByUser.find((addedMeal) => {
                    // return addedMeal.meal.ssrCode === meal.ssrCode;
                    // })
                    // }
                    added={addedCheck(selectedMealsByUser, meal)}
                    canBeRemoved={canBeRemovedCheck(selectedMealsByUser, meal)}
                    key={meal.ssrCode}
                    nutritionalInfoData={nutritionalInfoData}
                  />
                );
              })}
            </div>
          ) : (
            noResultFoundData(true)
          )}
        </div>
      ) : (
        (!isMainCard && state.mealFilters.length > 0 && customMealListCategoryWise?.order.length === 0) && (
          noResultFoundData(false)
        )
      )}

      {!isMainCard && customMealListCategoryWise?.order.map((item) => (
        <>
          <div
            className="meals-list__category"
            id={removeSpacesAndToLowerCase(item, CSS_ID)}
          >
            <div>{item}</div>
          </div>
          <div className="meals-list__wrap">
            {customMealListCategoryWise[item].data.map(displayMealCard)}
          </div>
        </>
      ))}
      {
        isMainCard && getLatestThreeMeals().map(displayMealCard)
      }
      {/* Old Code: {props?.slidePaneData?.comboAlertMessage && (
        <Alert color="warning" className="mt-3 meal-disclaimer">
          {props.slidePaneData.comboAlertMessage}
        </Alert>
      )} */}
    </div>
  );
};

MealsList.propTypes = {
  availableCuisineList: PropTypes.array,
  bundleTotalPrice: PropTypes.any,
  categoryBundleCode: PropTypes.any,
  customMealListCategoryWise: PropTypes.object,
  journeyKey: PropTypes.any,
  passengerIndex: PropTypes.number,
  searchResultList: PropTypes.object,
  segmentIndex: PropTypes.number,
  segmentKey: PropTypes.string,
  slidePaneData: PropTypes.object,
  passengerDetails: PropTypes.any,
};

export default MealsList;
