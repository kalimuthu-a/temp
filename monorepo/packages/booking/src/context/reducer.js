/* eslint-disable no-inner-declarations */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import isEqual from 'lodash/isEqual';
import { getRecentSearches } from '../utils/localStorageUtils';
import { getCurrencySymbol } from '../utils/functions';
import AEMAdditionalModel from '../models/AEMAdditionalModel';
import WidgetModal from '../models/WidgetModal';
import AEMMainModel from '../models/AEMMainModel';

export const bookingActions = {
  SET_SELECTED_SPECIAL_FARE: 'SET_SELECTED_SPECIAL_FARE',
  SET_PROMO_CODE: 'SET_PROMO_CODE',
  SET_API_DATA: 'SET_API_DATA',
  SHOW_FULL_FORM_IN_SRP: 'SHOW_FULL_FORM_IN_SRP',
  SET_FARE_CALENDAR: 'SET_FARE_CALENDAR',
  SET_LOADER: 'SET_LOADER',
  SET_SOURCE_CITY: 'SET_SOURCE_CITY',
  SET_SHOW_LOYALTY_BOX: 'SET_SHOW_LOYALTY_BOX',
  SET_AUTH_USER: 'SET_AUTH_USER',
  SET_NOMINEE_DETAILS: 'SET_NOMINEE_DETAILS',
  POPULAR_SEARCH: 'POPULAR_SEARCH',
  SET_FINAL_CITY_LIST: 'SET_FINAL_CITY_LIST',
};

export const bookingReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case bookingActions.SET_SELECTED_SPECIAL_FARE: {
      return {
        ...state,
        selectedSpecialFare: isEqual(state.selectedSpecialFare, payload)
          ? null
          : payload,
      };
    }

    case bookingActions.SET_API_DATA: {
      const {
        widgetApiData: {
          masterDataModel,
          activeCountryModel,
          activeCurrencyModel,
          widgetsModel,
          ...apiData
        },
        additional,
        main,
        offers,
        popSearch,
      } = payload;

      const aemAirports = new Map();

      additional.airportsData.forEach((airport) => {
        aemAirports.set(airport.cityCode, airport);
      });

      const airportCityMap = new Map();

    const airportsData = masterDataModel.map((airport) => {
        const { stationCode } = airport;
        const row = {
          ...airport,
          ...aemAirports.get(stationCode),
        };

        airportCityMap.set(stationCode, row);
        return row;
      });

      const popSearchCityCodeOrigins = popSearch?.origins;
      const popSearchCityCodeDestinations = popSearch?.destinations;

return {
        ...state,
        ...apiData,
        activeCurrencyModel: activeCurrencyModel.map((row) => ({
          ...row,
          currencySymbol: getCurrencySymbol(row.currencyCode),
        })),
        activeCountryModel: activeCountryModel.sort((a, b) => {
          const fa = a.name.toLowerCase();
          const fb = b.name.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        }),
        airportsData,
        main: new AEMMainModel(main),
        additional: new AEMAdditionalModel(additional),
        offers,
        recentSearches: getRecentSearches(main.recentSearchCount),
        widgetsModel: new WidgetModal(widgetsModel[0], main, additional),
        loading: false,
        popSearch: [popSearchCityCodeOrigins?.map((stationCode) => airportCityMap.get(stationCode)),
          popSearchCityCodeDestinations?.map((stationCode) => airportCityMap.get(stationCode))],

      };
    }

    case bookingActions.SHOW_FULL_FORM_IN_SRP: {
      return {
        ...state,
        showFullFormInSrp: payload,
      };
    }

    case bookingActions.SET_LOADER: {
      return {
        ...state,
        loading: payload,
      };
    }

    case bookingActions.SET_FARE_CALENDAR: {
      const { response, origin, destination } = payload;
      const {
        response: prevResponse,
        origin: prevOrigin,
        destination: prevDestination,
      } = state.fareCalendar;

      let mergedResponse = response;

      if (prevOrigin === origin && prevDestination === destination) {
        mergedResponse = new Map([...response, ...prevResponse]);
      }

      return {
        ...state,
        fareCalendar: {
          origin,
          destination,
          response: mergedResponse,
        },
      };
    }

    case bookingActions.SET_SOURCE_CITY: {
      return {
        ...state,
        sourceCity: payload,
      };
    }

    case bookingActions.SET_SHOW_LOYALTY_BOX: {
      return {
        ...state,
        showLoyaltyBox: payload,
      };
    }

    case bookingActions.SET_AUTH_USER: {
      return {
        ...state,
        authUser: payload,
      };
    }

    case bookingActions.SET_NOMINEE_DETAILS: {
      return {
        ...state,
        nomineeDetails: payload,
      };
    }

    case bookingActions.SET_FINAL_CITY_LIST: {
      return {
        ...state,
        finalCityList: [...payload],
      };
    }

    default:
      return state;
  }
};
