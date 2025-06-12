import cloneDeep from 'lodash/cloneDeep';

import { getCurrencySymbol } from '../../utils/functions';
import {
  duplicateJourneyToast,
  getCity,
  onChangeSelectedFare,
  onChangeTripType,
  updateContextFormOutsideEvent,
  onChangeNomineeDetail,
} from './formReducerUtil';
import { specialFareListForContext } from '../../utils/specialFareUtils';
import { specialFareCodes } from '../../constants';
import { isBefore7Days } from '../../utils';

export const formActions = {
  CHANGE_TRIP_TYPE: 'CHANGE_TRIP_TYPE',
  CHANGE_PAX_INFO: 'CHANGE_PAX_INFO',
  CHANGE_JOURNEY_ROW_ITEM: 'CHANGE_JOURNEY_ROW_ITEM',
  CHANGE_FORM_ITEM: 'CHANGE_FORM_ITEM',
  PROMO_CODE_APPLIED: 'PROMO_CODE_APPLIED',
  SET_PROMO_CODE: 'SET_PROMO_CODE',
  SET_SELECTED_SPECIAL_FARE: 'SET_SELECTED_SPECIAL_FARE',
  UPDATE_DATE_FROM_SRP: 'UPDATE_DATE_FROM_SRP',
  SET_TEMP_FORM_STATE: 'SET_TEMP_FORM_STATE',
  RESET_FORM_STATE: 'RESET_FORM_STATE',
  SET_TOAST: 'SET_TOAST',
  UPDATE_CONTEXT_FROM_OUTSIDE: 'UPDATE_CONTEXT_FROM_OUTSIDE',
  REMOVE_JORNEY_ITEM: 'REMOVE_JORNEY_ITEM',
  SET_LOYALTY_NOMINEE_COUNT: 'SET_LOYALTY_NOMINEE_COUNT',
  SHOW_BEST_HOTEL_DEALS: 'SHOW_BEST_HOTEL_DEALS',
};

export const formReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case formActions.SET_SELECTED_SPECIAL_FARE: {
      return {
        ...state,
        ...onChangeSelectedFare(state, payload),
      };
    }

    case formActions.CHANGE_TRIP_TYPE: {
      return {
        ...state,
        ...onChangeTripType(state, payload),
      };
    }

    case formActions.CHANGE_PAX_INFO: {
      const { SRCT } = payload;
      return {
        ...state,
        paxInfo: payload,
        journies: state.journies?.map((journey) => {
          return {
            ...journey,
            destinationCity: getCity(journey.destinationCity, SRCT.Count === 0),
            sourceCity: getCity(journey.sourceCity, SRCT.Count === 0),
          };
        }),
      };
    }

    case formActions.CHANGE_FORM_ITEM: {
      const { journies = [], identicalDestinationsErrorMessage } = payload;

      const toast = duplicateJourneyToast(
        journies,
        identicalDestinationsErrorMessage,
      );

      return {
        ...state,
        ...payload,
        toast,
      };
    }

    case formActions.REMOVE_JORNEY_ITEM: {
      const {
        journies = [],
        identicalDestinationsErrorMessage,
        isInternational,
      } = payload;

      const toast = duplicateJourneyToast(
        journies,
        identicalDestinationsErrorMessage,
      );

      return {
        ...state,
        ...payload,
        isInternational,
        toast,
      };
    }

    case formActions.CHANGE_JOURNEY_ROW_ITEM: {
      const { index, objData, identicalDestinationsErrorMessage } = payload;
      const { currency, journies, specialFares, triptype } = state;
      const { journeyTypeCode } = triptype;

      if (index === 0 && Reflect.has(objData, 'sourceCity')) {
        currency.currencyCode = objData.sourceCity.currencyCode;
        currency.currencySymbol = getCurrencySymbol(currency.currencyCode);
      }

      const updatedJournies = [
        ...journies.slice(0, index),
        {
          ...journies[index],
          ...objData,
        },
        ...journies.slice(index + 1),
      ];

      const toast = duplicateJourneyToast(
        updatedJournies,
        identicalDestinationsErrorMessage,
      );

      const { specialFaresList, isInternational } = specialFareListForContext(
        specialFares,
        updatedJournies,
        journeyTypeCode,
      );

      return {
        ...state,
        journies: updatedJournies,
        currency,
        specialFares: specialFaresList,
        isInternational,
        toast,
      };
    }

    case formActions.SET_PROMO_CODE: {
      return {
        ...state,
        promocode: payload,
      };
    }

    case formActions.UPDATE_DATE_FROM_SRP: {
      const { index, dates, sixEExclusiveErrorlabel } = payload;
      const { journies, specialFares, triptype } = state;
      const { journeyTypeCode } = triptype;

      const journeyItem = journies[index];

      const [departureDate, arrivalDate] = dates;
      journeyItem.departureDate = departureDate;
      journeyItem.arrivalDate = arrivalDate;

      const { specialFaresList } = specialFareListForContext(
        specialFares,
        [journies[0]],
        journeyTypeCode,
      );
      const data = specialFares?.filter(
        (row) => row.specialFareCode === specialFareCodes.VAXI,
      );
      const isBefore7DaysDate =
        isBefore7Days(departureDate, data?.[0]?.bookingAllowedAfterDays) &&
        specialFares.findIndex(
          (row) => row.specialFareCode === specialFareCodes.VAXI,
        ) !== -1;

      return {
        ...state,
        journies: [
          ...journies.slice(0, index - 1),
          journeyItem,
          ...journies.slice(index + 1),
        ],
        specialFares: specialFaresList,
        sixEExclusiveError: isBefore7DaysDate ? sixEExclusiveErrorlabel : '',
      };
    }

    case formActions.SET_TEMP_FORM_STATE: {
      return {
        ...state,
        tempState: cloneDeep(state),
      };
    }

    case formActions.RESET_FORM_STATE: {
      return {
        ...state.tempState,
        tempState: {},
      };
    }

    case formActions.SET_TOAST: {
      return {
        ...state,
        toast: payload,
      };
    }

    case formActions.UPDATE_CONTEXT_FROM_OUTSIDE: {
      const [firstJourney] = state.journies;
      const { origin = false, destination = false } = payload;

      firstJourney.sourceCity =
        origin === false ? firstJourney.sourceCity : origin;
      firstJourney.destinationCity =
        destination === false ? firstJourney.destinationCity : destination;

      return {
        ...state,
        ...updateContextFormOutsideEvent({ state, payload }),
      };
    }

    case formActions.SET_LOYALTY_NOMINEE_COUNT: {
      const loyaltyData = onChangeNomineeDetail({ payload });
      return {
        ...state,
        LOYALTY_NOMINEE_COUNT: loyaltyData,
      };
    }

    case formActions.SHOW_BEST_HOTEL_DEALS: {
      return {
        ...state,
        showBestHotelDeals: payload,
      };
    }
    default:
      return state;
  }
};
