import React, { createContext, useReducer, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PayWithModes } from 'skyplus-design-system-app/src/functions/globalConstants';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { cargoReducer } from './CargoReducer';
import { getMaxDateForCalendar } from '../../utils';

// Create Context
const CargoContext = createContext();

// Provider Component
export function CargoProvider({ children, context }) {
  const initialState = { context,
    currency: {
      currencyCode: 'INR',
      currencySymbol: '₹',
    },
    triptype: {
      value: 'domestic',
      journeyTypeCode: 'Domestic',
      journeyTypeLabel: 'Domestic',
      label: 'Domestic',
    },
    transportedBy: '',
    goodsType: '',
    quantity: '',
    journeys:
      {
        destinationCity: null,
        sourceCity: {
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
          latitude: 28.56861111111111,
          longitude: 77.11222222222221,
        },
        isNationalityPopup: false,
        departureDate: new Date(),
        arrivalDate: null,
        minDate: new Date(),
        key: uniq(),
        maxDate: getMaxDateForCalendar(),
      },
    payWith: PayWithModes.CASH,
   }; // Set initial state from props
  const [state, dispatch] = useReducer(cargoReducer, initialState);

  // Use useMemo to avoid unnecessary re-renders
  const value = useMemo(() => ({ state, dispatch }), [state]);

  // const updateContextFromXplore = (sourceCity) => {
  //   if (sourceCity?.value) {
  //     dispatch({
  //       type: formActions.CHANGE_JOURNEY_ROW_ITEM,
  //       payload: {
  //         index: 0,
  //         objData: { sourceCity: sourceCity?.value },
  //         identicalDestinationsErrorMessage: '',
  //       },
  //     });
  //   }
  // };

  // useCustomEventListener(
  //   customEvents.SOURCE_CITY_FROM_EXPLORE,
  //   updateContextFromXplore,
  // );
  return (
    <CargoContext.Provider value={value}>
      {children}
    </CargoContext.Provider>
  );
}

// PropTypes for CargoProvider
CargoProvider.propTypes = {
  children: PropTypes.node.isRequired,
  context: PropTypes.object, // Ensure it's a number
};

// Default Props
CargoProvider.defaultProps = {
  context: {}, // Default count if not provided
};

// Custom Hook for easier usage
export function useCargo() {
  const context = useContext(CargoContext);
  if (!context) {
    throw new Error('useCargo must be used within a CargoProvider');
  }
  return context;
}
