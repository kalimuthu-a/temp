import add from 'date-fns/add';
import isSameDay from 'date-fns/isSameDay';
import { LOYALTY_KEY } from 'skyplus-design-system-app/src/functions/globalConstants';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { ANALTYTICS, specialFareCodes } from '../../constants';
import { getPaxTypes } from '../../constants/form';
import { specialFareListForContext } from '../../utils/specialFareUtils';

import pushAdobeAnalytics from '../../utils/analyticsEvent';

export const getCity = (city, internationalAllowed) => {
  return city?.isInternational && !internationalAllowed ? null : city;
};

export const onChangeSelectedFare = (state, payload) => {
  const { internationalAllowed, specialFareCode } = payload?.key === LOYALTY_KEY ? payload.data : payload;
  const value = payload?.key === LOYALTY_KEY ? payload.data : payload;

  const selectedSpecialFareAlreadyApplied =
    specialFareCode === state?.selectedSpecialFare?.specialFareCode;

  const paxInfo = getPaxTypes(selectedSpecialFareAlreadyApplied ? {} : payload);

  const { journies, specialFares } = state;

  const newJournies = [];

  journies.forEach((journey, index) => {
    let journeyItem = journey;
    const data = specialFares?.filter(
      (item) => item.specialFareCode === specialFareCodes.VAXI,
    );
    if (!selectedSpecialFareAlreadyApplied) {
      journeyItem = {
        ...journey,
        destinationCity: getCity(journey.destinationCity, internationalAllowed),
        sourceCity: getCity(journey.sourceCity, internationalAllowed),
      };
      if (specialFareCodes.VAXI === specialFareCode && index === 0) {
        journeyItem.minDate = add(new Date(), { days: data?.[0]?.bookingAllowedAfterDays || 0 });
      }
      if (specialFareCodes.VAXI !== specialFareCode && index === 0) {
        journeyItem.minDate = new Date();
      }
    } else if (index === 0) {
      journeyItem.minDate = new Date();
    }

    const prevItem = newJournies[index - 1];
    if (
      prevItem &&
      !selectedSpecialFareAlreadyApplied &&
      specialFareCodes.VAXI === specialFareCode
    ) {
      journeyItem.minDate = prevItem.departureDate || prevItem.minDate;
    }

    newJournies.push(journeyItem);
  });

  return {
    ...state,
    selectedSpecialFare: selectedSpecialFareAlreadyApplied ? null : value,
    paxInfo,
    specialFares: specialFares.map((row) => ({
      ...row,
      checked:
        !selectedSpecialFareAlreadyApplied &&
        row.specialFareCode === specialFareCode,
    })),
    journies: newJournies,
  };
};

export const onChangeTripType = (state, payload) => {
  const { journies, specialFares } = state;
  const { value, journeyTypeCode } = payload;

  const { isInternational, specialFaresList } = specialFareListForContext(
    specialFares,
    journies,
    journeyTypeCode,
  );

  return {
    triptype: payload,
    journies: journies.slice(0, 1).map((row) => ({
      ...row,
      // arrivalDate: value === TripTypes.ROUND ? row?.arrivalDate || add(row?.departureDate, { days: 1 }) : null,
      arrivalDate: value === TripTypes.ROUND ? row?.arrivalDate : null,
        // set the default arrival date here
    })),
    specialFares: specialFaresList,
    isInternational,
  };
};

export const analyticsErrorEvent = ({ description, ...others }) => {
  pushAdobeAnalytics({
    event: ANALTYTICS.DATA_CAPTURE_EVENTS.UX_ERROR,
    data: {
      errorObj: {
        code: '',
        type: 'FE Error',
        source: 'FE Error',
        apiURL: 'FE Error',
        statusCode: 'FE Error',
        statusMessage: 'FE Error',
        displayMessage: description,
        ...others,
      },
    },
  });
};

export const duplicateJourneyToast = (journies, message) => {
  let newToast = { show: false, description: '' };

  if (journies.length === 1) {
    return newToast;
  }

  const isNotUnqiue = journies.some((row, ind, all) => {
    const others = [...all.slice(0, ind), ...all.slice(ind + 1)];

    return others.some((nextRow) => {
      return (
        nextRow &&
        row?.sourceCity?.stationCode &&
        row?.destinationCity?.stationCode &&
        row?.sourceCity?.stationCode === nextRow?.sourceCity?.stationCode &&
        row?.destinationCity?.stationCode ===
          nextRow?.destinationCity?.stationCode &&
        isSameDay(row.departureDate, nextRow.departureDate)
      );
    });
  });

  if (isNotUnqiue) {
    newToast = {
      variation: 'Error',
      show: true,
      description: message,
    };

    analyticsErrorEvent({
      description: message,
      component: 'Booking Widget',
      action: 'Link/ButtonClick',
    });
  }

  return newToast;
};

export const updateContextFormOutsideEvent = ({ state, payload }) => {
  const [firstJourney] = state.journies;
  const { origin = false, destination = false, vaxiFromTarget } = payload;

  const { selectedSpecialFare, specialFares } = state;

  firstJourney.sourceCity = origin === false ? firstJourney.sourceCity : origin;
  firstJourney.destinationCity =
    destination === false ? firstJourney.destinationCity : destination;

  if (vaxiFromTarget && !selectedSpecialFare) {
    const vaxiSpecialFare = specialFares.find(
      (row) => row.specialFareCode === specialFareCodes.VAXI,
    );

    if (vaxiSpecialFare) {
      return onChangeSelectedFare(state, vaxiSpecialFare);
    }
  }

  return {
    specialFares,
    selectedSpecialFare,
    journies: [firstJourney, ...state.journies.slice(1)],
  };
};

export const onChangeNomineeDetail = ({ payload }) => {
  const { adultCount, seniorCitizenCount, childrenCount } = payload;

  return {
    ADT_COUNT: adultCount,
    SRCT_COUNT: seniorCitizenCount,
    CHD_COUNT: childrenCount,
  };
};
