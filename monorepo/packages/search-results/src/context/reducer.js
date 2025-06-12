import AEMAdditional from '../models/AEMAdditional';
import AEMMain from '../models/AEMMain';
import { getLoyaltyAnalyticsData } from '../utils';
import feuxerror from '../utils/adobeanalytics/feuxerror';
import analyticsResponseContext from '../utils/analyticsResponseContext';
import {
  combinabilityDataMap,
  defaultFilterState,
  isCombinableClass,
  upgradeFares,
} from './reducerUtils';

export const srpActions = {
  SET_API_DATA: 'SET_API_DATA',
  SET_SEGMENT_API_DATA: 'SET_SEGMENT_API_DATA',
  CHANGE_SELECTED_TRIP_INDEX: 'CHANGE_SELECTED_TRIP_INDEX',
  SET_SELECTED_FARES: 'SET_SELECTED_FARES',
  SET_RECOMMENDED_FARES: 'SET_RECOMMENDED_FARES',
  SEGMENT_LOADING: 'SEGMENT_LOADING',
  SET_SORT: 'SET_SORT',
  APPLY_FILTERS: 'APPLY_FILTERS',
  UPGRADE_FARES: 'UPGRADE_FARES',
  INIT_APP: 'INIT_APP',
  SET_TOAST: 'SET_TOAST',
  APP_UPDATE_SEARCH_CONTEXT: 'APP_UPDATE_SEARCH_CONTEXT',
  SELECT_RECOMMENDED_FARE: 'SELECT_RECOMMENDED_FARE',
  SET_NEW_CALANDAR_DATA: 'SET_NEW_CALANDAR_DATA',
  SET_AUTH_USER: 'SET_AUTH_USER',
  SET_NOMINEE_DETAILS: 'SET_NOMINEE_DETAILS',
  SET_LOYALTY_FLOW: 'SET_LOYALTY_FLOW',
  SET_ENROLLMENT_POPUP: 'SET_ENROLLMENT_POPUP',

};

export const srpReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case srpActions.INIT_APP: {
      const { main, additional, api, calendarResponses } = payload;
      const { trips, noFlightfoundReason, ...flightSearchData } = api;
      const { loyaltyAnalyticsData } = state || {};

      const combinabilityMap = combinabilityDataMap(
        flightSearchData?.configSettings?.combinabilityData ?? [],
      );

      const { adobeAnalyticsContext, googleAnalyticsContext } =
        analyticsResponseContext(
          trips,
          state.searchContext,
          noFlightfoundReason,
          loyaltyAnalyticsData,
        );

      // changeflight changes for loyalty
      let isBurn = state?.isBurn;
      let isEarn = state?.isEarn;
      if (state?.isLoyalty && state?.isChangeFlightFlow) {
        isBurn = flightSearchData?.configSettings?.isRedeemTransaction;
        isEarn = !isBurn;
      }

      return {
        ...state,
        flightSearchData,
        selectedTripIndex: 0,
        trips,
        selectedFares: Array.from({ length: trips.length }).fill(null),
        appLoading: false,
        analyticsContext: adobeAnalyticsContext,
        googleAnalyticsContext,
        main: new AEMMain(main),
        additional: new AEMAdditional(additional),
        showFooter: false,
        calendarResponses,
        combinabilityMap,
        isBurn,
        isEarn,
      };
    }

    case srpActions.SET_API_DATA: {
      const { flightsData, calendarResponses } = payload;
      const {
        trips,
        noFlightfoundReason = '',
        ...flightSearchData
      } = flightsData;

      const combinabilityMap = combinabilityDataMap(
        flightSearchData?.configSettings?.combinabilityData ?? [],
      );

      const { adobeAnalyticsContext, googleAnalyticsContext } =
        analyticsResponseContext(
          trips,
          state.searchContext,
          noFlightfoundReason,
          false,
        );

      return {
        ...state,
        flightSearchData,
        selectedTripIndex: 0,
        trips,
        selectedFares: Array.from({ length: trips.length }).fill(null),
        appLoading: false,
        analyticsContext: adobeAnalyticsContext,
        googleAnalyticsContext,
        showFooter: false,
        calendarResponses,
        combinabilityMap,
        sort: {
          label: '',
          value: '',
        },
        filters: { ...defaultFilterState },
      };
    }

    case srpActions.CHANGE_SELECTED_TRIP_INDEX: {
      return {
        ...state,
        selectedTripIndex: payload,
        sort: {
          label: '',
          value: '',
        },
        filters: { ...defaultFilterState },
      };
    }

    case srpActions.SET_SELECTED_FARES: {
      const { selectedFares, selectedTripIndex } = state;
      selectedFares[selectedTripIndex] = payload;

      return {
        ...state,
        selectedFares,
        showFooter: true,
      };
    }

    case srpActions.SET_RECOMMENDED_FARES: {
      const { selectedTripIndex, firstTimeLoad } = state;
      const { recommended, isProjectNextEnabled } = payload;
      return {
        ...state,
        recommended,
        isProjectNextEnabled,
        firstTimeLoad: { ...firstTimeLoad, [selectedTripIndex]: false },
      };
    }

    case srpActions.APP_UPDATE_SEARCH_CONTEXT: {
      return {
        ...state,
        appLoading: true,
        searchContext: payload,
        segments: payload.getSegment(),
        showFooter: false,
      };
    }

    case srpActions.SET_SORT: {
      return {
        ...state,
        sort: payload,
      };
    }

    case srpActions.APPLY_FILTERS: {
      return {
        ...state,
        filters: payload,
      };
    }

    case srpActions.UPGRADE_FARES: {
      const { productClass, toastMsg } = payload;
      return {
        ...state,
        selectedFares: upgradeFares(state.selectedFares, productClass),
        toast: {
          show: true,
          description: toastMsg,
          variation: 'Success',
        },
      };
    }

    case srpActions.SEGMENT_LOADING: {
      const { searchContext } = state;

      return {
        ...state,
        segmentLoading: payload,
        segments: searchContext.getSegment(),
        trips: [],
      };
    }

    case srpActions.SET_SEGMENT_API_DATA: {
      const { selectedFares } = state;
      const { trips, indexToReset } = payload;

      const filterselectedFares = selectedFares.map((fare, index) => {
        return indexToReset.includes(index) ? null : fare;
      });

      const fareExist = filterselectedFares.filter((fare) => Boolean(fare));

      return {
        ...state,
        trips,
        segmentLoading: false,
        selectedFares: filterselectedFares,
        showFooter: fareExist.length > 0,
      };
    }

    case srpActions.SET_TOAST: {
      if (payload.analyticsData) {
        feuxerror({
          description: payload.description,
          source: 'FE Error',
          ...payload.analyticsData,
        });
      }

      return {
        ...state,
        toast: payload,
      };
    }

    case srpActions.SET_NEW_CALANDAR_DATA: {
      return {
        ...state,
        calendarResponses: new Map([...state.calendarResponses, ...payload]),
      };
    }

    case srpActions.SELECT_RECOMMENDED_FARE: {
      const { selectedFares, selectedTripIndex, isEarn } = state;
      const { pClassList, productClass } = payload.fare;

      const selectedFaresCombinability = selectedFares
        .filter(Boolean)
        .map((row) => row.fare.combinabilityData);

      const newSelectedFares = selectedFares;
      newSelectedFares[selectedTripIndex] = payload;
      selectedFares.forEach((selectedFare, index) => {
        if (selectedFare) {
          if (isEarn || isCombinableClass(selectedFaresCombinability, productClass)) {
            return;
          }

          const passengerFare = selectedFare.passengerFares.find(
            (row) => row.pClassList === pClassList,
          );
          if (passengerFare) {
            newSelectedFares[index].fare = passengerFare;
          }
        }
      });

      return {
        ...state,
        selectedFares: newSelectedFares,
        showFooter: true,
      };
    }

    case srpActions.SET_AUTH_USER: {
      return {
        ...state,
        authUser: payload,
        userSignedInSrp: !!payload,
      };
    }

    case srpActions.SET_NOMINEE_DETAILS: {
      return {
        ...state,
        nomineeDetails: payload,
      };
    }

    case srpActions.SET_LOYALTY_FLOW: {
      return {
        ...state,
        isEarn: payload?.isEarn,
        isBurn: payload?.isBurn,
        loyaltyAnalyticsData: getLoyaltyAnalyticsData(payload?.payWith),
      };
    }

    case srpActions.SET_ENROLLMENT_POPUP: {
      return {
        ...state,
        enrollmentPopUp: payload,
      };
    }

    default:
      return state;
  }
};
