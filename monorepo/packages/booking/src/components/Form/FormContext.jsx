import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { PayWithModes } from 'skyplus-design-system-app/src/functions/globalConstants';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { useCustomEventListener,
  useCustomEventDispatcher } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import add from 'date-fns/add';

import { formActions, formReducer } from './formReducer';
import { customEvents, specialFareCodes } from '../../constants';
import { getMaxDateForCalendar, isBefore7Days } from '../../utils';
import { getPaxTypes } from '../../constants/form';
import { specialFareListForContext } from '../../utils/specialFareUtils';
import useAppContext from '../../hooks/useAppContext';
import { generateSearchResultPayload } from '../../utils/searchResultsUtils';
import { setBwCntxtVal } from '../../utils/localStorageUtils';

/**
 * @type {React.Context<{formState ?: {
 *    selectedSpecialFare?: any,
 *    journies?: any,
 *    triptype?: {value: string, label: string},
 *    travellingFor?: string,
 *    payWith?: string,
 *    nationality?: any,
 *    paxInfo?: any,
 *    currency?: any,
 *    specialFares?: Array<*>,
 * }, dispatch ?: React.Dispatch<*>}>}
 */
const FormContext = React.createContext({});

const initialState = {
  currency: {
    currencyCode: 'INR',
    currencySymbol: '₹',
  },
  nationality: {
    countryCode: '',
    name: '',
  },
  triptype: {
    value: TripTypes.ONE_WAY,
    journeyTypeCode: 'OneWay',
    journeyTypeLabel: 'One Way',
    label: 'One Way',
  },
  paxInfo: {
    ADT: {
      Count: 1,
      maxCount: 9,
      minCount: 1,
      ExtraDoubleSeat: 0,
      maxExtraDoubleSeat: 0,
      ExtraTripleSeat: 0,
      maxExtraTripleSeat: 0,
      maxAllowed: 9,
      totalSeatCount: 1,
    },
    SRCT: {
      Count: 0,
      maxCount: 8,
      minCount: 0,
      ExtraDoubleSeat: 0,
      maxExtraDoubleSeat: 0,
      ExtraTripleSeat: 0,
      maxExtraTripleSeat: 0,
      maxAllowed: 9,
      totalSeatCount: 0,
    },
    CHD: {
      Count: 0,
      maxCount: 4,
      minCount: 0,
      ExtraDoubleSeat: 0,
      maxExtraDoubleSeat: 0,
      ExtraTripleSeat: 0,
      maxExtraTripleSeat: 0,
      maxAllowed: 4,
      totalSeatCount: 0,
    },
    INFT: {
      Count: 0,
      maxCount: 1,
      minCount: 0,
      ExtraDoubleSeat: 0,
      maxExtraDoubleSeat: 0,
      ExtraTripleSeat: 0,
      maxExtraTripleSeat: 0,
      maxAllowed: 4,
      totalSeatCount: 0,
    },
  },
  vaccineDose: '',
  travellingFor: '',
  payWith: PayWithModes.CASH,
  journies: [
    {
      destinationCity: null,
      sourceCity: null,
      isNationalityPopup: false,
      departureDate: add(new Date(), { days: 1 }),
      arrivalDate: null,
      minDate: new Date(),
      key: uniq(),
      maxDate: getMaxDateForCalendar(),
    },
  ],
  selectedSpecialFare: null,
  specialFares: [],
  specialFareError: '',
  sixEExclusiveError: '',
  promocode: {
    code: '',
    error: '',
    success: false,
    card: '',
  },
  tempState: {},
  isInternational: false,
  toast: {
    show: false,
    description: '',
  },
  LOYALTY_NOMINEE_COUNT: {
    ADT_COUNT: 0,
    SRCT_COUNT: 0,
    CHD_COUNT: 0,
  },
  showBestHotelDeals: false,
};

const FormContextProvider = ({ children, context }) => {
  const {
    state: { additional, airportsData, main },
  } = useAppContext();

  const {
    journies,
    specialFares,
    triptype,
    selectedSpecialFare,
    currency = {},
  } = context.payload;
  const { departureDate } = journies[0];
  const data = specialFares?.filter(
    (row) => row.specialFareCode === specialFareCodes.VAXI,
  );

  const isWithinAdvancePeriod = isBefore7Days(departureDate, data?.[0]?.bookingAllowedAfterDays) &&
    specialFares.findIndex(
      (row) => row.specialFareCode === specialFareCodes.VAXI,
    ) !== -1;
  const { journeyTypeCode } = triptype || { journeyTypeCode: 'OneWay' };

  let paxInfo = context.payload?.paxInfo;

  if (!paxInfo) {
    paxInfo = getPaxTypes({});
  }

  const { isInternational, specialFaresList } = specialFareListForContext(
    specialFares,
    journies,
    journeyTypeCode,
  );

  const [state, dispatch] = React.useReducer(formReducer, {
    ...initialState,
    journies,
    ...context.payload,
    specialFares: specialFaresList.map((row) => ({
      ...row,
      checked: selectedSpecialFare?.specialFareCode === row.specialFareCode,
    })),
    sixEExclusiveError: isWithinAdvancePeriod
      ? additional.beforeWeek6EExclusiveError?.html
      : '',
    paxInfo,
    isInternational,
    currency,
  });

  const dipatchModifySearch = useCustomEventDispatcher();

  const updateDateFromSRP = ({ index, dates }) => {
    dispatch({
      type: formActions.UPDATE_DATE_FROM_SRP,
      payload: {
        index,
        dates,
        sixEExclusiveErrorlabel: additional.beforeWeek6EExclusiveError?.html,
      },
    });
  };

  const updatePaywithFromSRP = ({ payWith }) => {
    if (payWith === PayWithModes.CASH) {
      dispatch({
        type: formActions.CHANGE_FORM_ITEM,
        payload: { payWith: PayWithModes.CASH },
      });
      const value = generateSearchResultPayload({ ...state, payWith });
      dipatchModifySearch(customEvents.CALL_SEARCH_RESULT_API, value);
      setBwCntxtVal({ ...state, payWith }, main?.recentSearchCount);
    }
  };

  const updateContextFromOutside = ({
    origin,
    destination,
    vaxiFromTarget,
    incomingTripType,
  }) => {
    let originCity = origin;
    let destinationCity = destination;

    airportsData.forEach((airport) => {
      if (airport.stationCode === origin) {
        originCity = airport;
      } else if (airport.stationCode === destination) {
        destinationCity = airport;
      }
    });
    if (incomingTripType) {
      dispatch({
        type: formActions.CHANGE_TRIP_TYPE,
        payload: incomingTripType,
      });
    }

    dispatch({
      type: formActions.UPDATE_CONTEXT_FROM_OUTSIDE,
      payload: {
        origin: originCity,
        destination: destinationCity,
        vaxiFromTarget,
      },
    });
  };

  const updateContextFromXplore = (sourceCity) => {
    if (sourceCity?.value) {
      dispatch({
        type: formActions.CHANGE_JOURNEY_ROW_ITEM,
        payload: {
          index: 0,
          objData: { sourceCity: sourceCity?.value },
          identicalDestinationsErrorMessage: '',
        },
      });
    }
  };

  useCustomEventListener(
    customEvents.SOURCE_CITY_FROM_EXPLORE,
    updateContextFromXplore,
  );
  useCustomEventListener(customEvents.DATE_CHANGE_EVENT, updateDateFromSRP);
  useCustomEventListener(customEvents.LOYALTY_PAYWITH_EVENT, updatePaywithFromSRP);
  useCustomEventListener(
    customEvents.SET_CONTEXT_FROM_OUTSIDE_EVENT,
    updateContextFromOutside,
  );

  const value = useMemo(() => ({ formState: state, dispatch }), [state]);

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

FormContextProvider.propTypes = {
  children: PropTypes.any,
  context: PropTypes.any,
};

export { FormContextProvider, FormContext };
