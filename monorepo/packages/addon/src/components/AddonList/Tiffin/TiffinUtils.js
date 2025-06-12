import { dietTypeCodes } from '../../../constants/aemAuthoring';
import { STRING_TYPE } from '../../../constants';

const { CSS_ID } = STRING_TYPE;

const getMealByTimeStamp = (meals, departureDate) => {
  const currentDate = new Date(departureDate);
  return meals?.filter((meal) => {
    if (!meal.mealStartDate && !meal.mealEndDate) {
      return true;
    }
    const mealStartDate = new Date(meal.mealStartDate);
    const mealEndDate = new Date(meal.mealEndDate);

    return mealStartDate <= currentDate && mealEndDate >= currentDate;
  });
};

const getMealsList = (
  addonDataAvailableSsr,
  addonDataavailableSlidePaneData,
  segmentIndex,
  departureDate,
  filters = [],
) => {
  const apiMeals = addonDataAvailableSsr[segmentIndex].ssrs;
  const aemMealList = addonDataavailableSlidePaneData.ssrList;

  const mergedMealList = apiMeals
    ?.map((apiMeal) => {
      const mealInAem = aemMealList?.find(
        (aemMeal) => aemMeal.ssrCode === apiMeal.ssrCode,
      );
      if (!mealInAem) {
        return null;
      }

      return {
        ...mealInAem,
        ...apiMeal,
        filterFields: [
          ...(mealInAem?.mealCuisines || []),
          mealInAem?.preference,
        ],
        category: mealInAem.category,
      };
    })
    .filter((d) => d);

  /**
   * Sorting addon list as per AEM configuration
   */
  const sortedMergedMealList = [];
  const tempMergedMealList = [...mergedMealList];
  for (const item of aemMealList) {
    const newItem =
      tempMergedMealList[
        tempMergedMealList.findIndex((elem) => elem.ssrCode === item.ssrCode)
      ];
    if (newItem) sortedMergedMealList.push(newItem);
  }
  const meals = getMealByTimeStamp(sortedMergedMealList, departureDate);

  if (filters.length === 0) {
    return meals;
  }

  let mealList = meals.filter((meal) => {
    const common = filters.filter((filterStr) => {
      if (
        filters.length === 1 &&
        (filters[0] === dietTypeCodes.veg ||
          filters[0] === dietTypeCodes.nonveg)
      ) {
        return true;
      }
      return (
        meal.filterFields.includes(filterStr) &&
        filterStr !== dietTypeCodes.veg &&
        filterStr !== dietTypeCodes.nonveg
      );
    });
    return common.length > 0;
  });

  if (
    filters.includes(dietTypeCodes.veg) ||
    filters.includes(dietTypeCodes.nonveg)
  ) {
    mealList = mealList.filter((meal) => {
      return filters.includes(meal.filterFields[meal.filterFields.length - 1]);
    });
  }

  return mealList;
};

const getMealByCategory = (meals) => {
  const mealsByCategory = {};
  const mealsCategories = [];

  meals?.forEach((meal) => {
    meal.category?.forEach((mealCategory) => {
      if (!mealsByCategory[mealCategory]) {
        mealsCategories.push(mealCategory);
        mealsByCategory[mealCategory] = {
          data: [],
        };
      }
      mealsByCategory[mealCategory].data.push(meal);
    });
  });

  mealsByCategory.order = mealsCategories;

  return mealsByCategory;
};

const getAllCuisines = (meals) => {
  const cuisines = [];

  meals?.forEach((meal) => {
    meal?.cuisines?.forEach((mealCuisine) => {
      if (cuisines.indexOf(mealCuisine) === -1) {
        cuisines.push(mealCuisine);
      }
    });
  });

  return cuisines;
};

const getSearchList = (meals, key) => {
  const searchTerm = key.toLowerCase();
  return meals.filter((meal) => {
    const aemMealName = meal.ssrName
      ?.toLowerCase()
      ?.match(new RegExp(searchTerm, 'g'));
    const apiMealName = meal.name
      ?.toLowerCase()
      ?.match(new RegExp(searchTerm, 'g'));
    return aemMealName || apiMealName;
  });
};

export const getSlideDataWithFilteredMealsList = (
  addonDataAvailableSsr,
  addonDataavailableSlidePaneData,
  filters,
  searchKey,
  segmentIndex,
  limit,
  departureDate,
) => {
  const mergedFilteredMealList = getMealsList(
    addonDataAvailableSsr,
    addonDataavailableSlidePaneData,
    segmentIndex,
    departureDate,
    filters,
  );
  const initialMergedMealList = getMealsList(
    addonDataAvailableSsr,
    addonDataavailableSlidePaneData,
    segmentIndex,
    departureDate,
    [],
  );

  const searchResultList =
    searchKey.length > 0
      ? getSearchList(mergedFilteredMealList, searchKey)
      : [];

  return {
    customMealListCategoryWise: getMealByCategory(mergedFilteredMealList),
    availableCuisineList: getAllCuisines(initialMergedMealList),
    searchResultList,
    limit,
  };
};

/**
 * remove space and convert to lowercase and format as per string type
 * @param {String} str
 * @param {String} type
 * @returns formatted string
 */
export const removeSpacesAndToLowerCase = (str, type) => {
  if (!str) return '';
  let newStr = str;

  newStr = newStr.replace(/\s/g, '');

  if (type === CSS_ID) {
    // removing leading numbers
    newStr = newStr.replace(/^\d+\s*/, '');

    // removing  # special character
    newStr = newStr.replace('#', '');
  }

  return newStr.toLowerCase();
};
