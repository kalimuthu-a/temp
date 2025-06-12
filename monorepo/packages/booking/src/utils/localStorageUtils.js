/* eslint-disable indent */

import isPast from 'date-fns/isPast';
import unique from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import { localStorageKeys } from '../constants';
import SearchItemModel from '../models/SearchItemModel';
import LocalStorage from './LocalStorage';
import { generateSearchResultPayload } from './searchResultsUtils';

/**
 *
 * @param {*} formData
 */
export const setBwCntxtVal = (formData, maxRecentSearchesCount, pageType) => {
  const value = generateSearchResultPayload(formData);

  const previousSearches = LocalStorage.getAsJson(
    localStorageKeys.recent_searches,
    [],
  );
  previousSearches.unshift(value);
  const recentSearches = previousSearches.slice(0, maxRecentSearchesCount);
  LocalStorage.set(localStorageKeys.bw_cntxt_val, value);
  // Check for xplore page as xplore page dont have destination information
  if (pageType !== Pages.XPLORE) {
    LocalStorage.set(localStorageKeys.recent_searches, recentSearches);
  }
};

export const getRecentSearches = (maxCount) => {
  return LocalStorage.getAsJson(localStorageKeys.recent_searches, [])
    .slice(0, maxCount)
    .map((row) => {
      if (
        isPast(new Date(`${row.selectedTravelDatesInfo.startDate} 23:59:59`))
      ) {
        return null;
      }
      return new SearchItemModel(row);
    })
    .filter(Boolean);
};

export const getRecentCitySearch = (key = 'selectedSourceCityInfo') => {
  return uniqBy(
    LocalStorage.getAsJson(localStorageKeys.recent_searches, []).map(
      (row) => row[key],
    ),
    'stationCode',
  );
};

export const setRecentCitySearch = (item) => {
  const searches = getRecentCitySearch();

  const ifAlreadyExist = searches.find(
    (search) => search.stationCode === item.stationCode,
  );
  if (!ifAlreadyExist) {
    searches.unshift(item);
  }

  LocalStorage.set(
    localStorageKeys.recent_city_searches,
    searches.slice(0, 2),
    true,
  );
};

export const getRecentCurrencySearch = () => {
  return unique(
    LocalStorage.getAsJson(localStorageKeys.recent_searches, [])
      .map((r) => r?.selectedCurrency?.value)
      .filter(Boolean),
  );
};
