import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';

import { localStorageKeys } from '../constants';
import LocalStorage from './LocalStorage';

/**
 *
 * @param {*} formData
 */
export const setBwCntxtVal = (formData, maxRecentSearchesCount) => {
  const value = {
    nationality: formData.nationality,
    seatWiseSelectedPaxInformation: {
      adultCount: 1,
      childrenCount: 2,
      seniorCitizenCount: 1,
      infantCount: 0,
      adultExtraDoubleSeat: 1,
      adultExtraTripleSeat: 1,
      seniorCitizenExtraDoubleSeat: 2,
      seniorCitizenExtraTripleSeat: 0,
      childrenExtraDoubleSeat: 0,
      childrenExtraTripleSeat: 1,
      totalAllowedCount: 0,
      totalCount: 1,
    },
    selectedCurrency: formData.currency,
    selectedDestinationCityInfo: {
      stationCode: 'MAA',
      inActive: false,
      allowed: true,
      icaoCode: 'VOMM',
      fullName: 'Chennai',
      shortName: 'Chennai',
      alternateCityName: null,
      macCode: null,
      currencyCode: 'INR',
      currencyName: 'Indian Rupee',
      conversionCurrencyCode: null,
      cultureCode: 'en-GB',
      class: 'A',
      seoEnabled: true,
      zoneCode: '33',
      countryName: 'India',
      airportName: 'Chennai International Airport',
      subZoneCode: '330',
      countryCode: 'IN',
      provinceStateCode: 'TN',
      cityCode: 'MAA',
      timeZoneCode: 'IN',
      isNationalityPopup: false,
      thirdPartyControlled: false,
      customsRequiredForCrew: false,
      weightType: 2,
      destinations: null,
      popularDestination: true,
      showCAPF: false,
      isInternational: false,
      latitude: 12.993333333333332,
      longitude: 80.17694444444444,
    },
    selectedJourneyType: {
      value: formData.triptype,
    },
    selectedPaxInformation: {
      types: [{ type: 'ADT', discountCode: '', count: 1 }],
    },
    selectedPromoInfo: '',
    selectedSourceCityInfo: {
      stationCode: 'DEL',
      inActive: false,
      allowed: true,
      icaoCode: 'VIDP',
      fullName: 'Delhi',
      shortName: 'Delhi',
      alternateCityName: null,
      macCode: null,
      currencyCode: 'INR',
      currencyName: 'Indian Rupee',
      conversionCurrencyCode: null,
      cultureCode: 'en-GB',
      class: 'A',
      seoEnabled: true,
      zoneCode: '33',
      countryName: 'India',
      airportName: 'Indira Gandhi International Airport',
      subZoneCode: '330',
      countryCode: 'IN',
      provinceStateCode: 'DL',
      cityCode: 'DEL',
      timeZoneCode: 'IN',
      isNationalityPopup: false,
      thirdPartyControlled: false,
      customsRequiredForCrew: false,
      weightType: 2,
      destinations: null,
      popularDestination: true,
      showCAPF: false,
      isInternational: false,
      latitude: 28.56638888888889,
      longitude: 77.10305555555556,
    },
    selectedSpecialFare: null,
    selectedTravelDatesInfo: { startDate: '2024-03-13', endDate: null },
    id: uniq(),
  };

  const previousSearches = LocalStorage.getAsJson(
    localStorageKeys.recent_searches,
    [],
  );
  previousSearches.unshift(value);
  const recentSearches = previousSearches.slice(0, maxRecentSearchesCount);

  LocalStorage.set(localStorageKeys.bw_cntxt_val, value);
  LocalStorage.set(localStorageKeys.recent_searches, recentSearches);
};

export const getBWCntxtVal = () => {
  return LocalStorage.getAsJson(localStorageKeys.bw_cntxt_val);
};
