import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInHours from 'date-fns/differenceInHours';
import format from 'date-fns/format';

import {
  ANALTYTICS,
  dateFormats,
  JOURNEY_TYPE,
  PAX_SHORT_NAME,
} from '../../constants';

const { INTERACTION, PAGE_NAME } = ANALTYTICS;

export const adobeAnalytic = () => {
  return {
    interactionType: INTERACTION.PAGELOAD,
    page: {
      pageInfo: {
        pageName: PAGE_NAME.WEB_CHECK_IN_HOME,
      },
    },
    product: {
      productInfo: {
        tripType: '',
        departureDates: '',
        specialFare: '',
        totalPax: '',
        adultPax: '',
        childPax: '',
        infantPax: '',
        seniorPax: '',
        daysUntilDeparture: '',
        sector: '',
        isCheckinClosed: '',
        pnr: '',
        hoursUntilDeparture: '',
      },
    },
  };
};

export const gtmAnalytic = () => {};

export const setAnaltyicsContext = (apiResponse, journeyKey) => {
  const { bookingAnalyticsDetails, passengerAnalyticsDetails } = apiResponse
    ?.data?.bookingAnalytics || {
    bookingAnalyticsDetails: {},
    passengerAnalyticsDetails: {},
  };

  const journies = [
    ...(apiResponse?.data?.journeysDetail ?? []),
    ...(apiResponse?.data?.smartCheckinJourneysDetail?.map((row) => ({
      ...row,
      underCheckInWindow: true,
    })) ?? []),
  ];

  const sectors = [];
  const checkinClosed = [];
  const departureDates = [];
  let OD = '';
  let daysUntilDeparture = null;
  let hoursUntilDeparture = null;
  const flightSector = apiResponse?.data?.bookingDetails?.isInternational
    ? 'International'
    : 'Domestic';

  let travelDate = '';
  const journeyOD = [];

  const journiesGtm = {};

  journies.forEach((journey, index) => {
    const {
      journeydetail: { destination, origin, departure },
      underCheckInWindow,
      journeyKey: jKey,
      segments,
    } = journey;

    sectors.push(`${origin}-${destination}`);
    checkinClosed.push(underCheckInWindow ? 0 : 1);

    departureDates.push(format(new Date(departure), dateFormats.ddMMyyyy));

    if (index === 0) {
      travelDate = format(new Date(departure), dateFormats.ddMMyyyy);
      journeyOD.push(origin);
    }

    if (journies.length - 1 === index) {
      journeyOD.push(destination);
    }

    if (underCheckInWindow && daysUntilDeparture === null) {
      daysUntilDeparture = differenceInCalendarDays(
        departure,
        new Date(),
      ).toString();
      hoursUntilDeparture = differenceInHours(departure, new Date()).toString();

      const isInt = segments.some((segment) => segment.international);

      const airlines = segments.map(
        (segment) => segment?.segmentDetails?.identifier?.carrierCode,
      );

      journiesGtm[jKey] = {
        OD: `${origin}-${destination}`,
        daysUntilDeparture,
        flight_sector: isInt
          ? JOURNEY_TYPE.INTERNATIONAL
          : JOURNEY_TYPE.DOMESTIC,
        Airline: airlines.join('|'),
        departure_date: format(new Date(departure), dateFormats.ddMMyyyy),
      };
    }

    if (journeyKey === journey.journeyKey) {
      OD = `${origin}-${destination}`;
    }
  });

  const { TotalPax, AdultPax, ChildPax, SeniorPax, InfantPax } =
    passengerAnalyticsDetails ?? {
      TotalPax: 0,
      AdultPax: 0,
      ChildPax: 0,
      SeniorPax: 0,
      InfantPax: 0,
    };

  const paxDetails = [TotalPax];

  if (SeniorPax) {
    paxDetails.push(`${SeniorPax}${PAX_SHORT_NAME.SS}`);
  }

  if (AdultPax) {
    paxDetails.push(`${AdultPax}${PAX_SHORT_NAME.ADT}`);
  }

  if (ChildPax) {
    paxDetails.push(`${ChildPax}${PAX_SHORT_NAME.CHD}`);
  }

  if (InfantPax) {
    paxDetails.push(`${InfantPax}${PAX_SHORT_NAME.INFT}`);
  }

  window.pnr = apiResponse?.data?.bookingDetails?.recordLocator;

  return {
    productInfo: {
      tripType: bookingAnalyticsDetails?.TripType ?? '',
      departureDates: departureDates.join('|'),
      specialFare: bookingAnalyticsDetails?.SpecialFare ?? '',
      totalPax: passengerAnalyticsDetails?.TotalPax?.toString(),
      adultPax: passengerAnalyticsDetails?.AdultPax?.toString(),
      childPax: passengerAnalyticsDetails?.ChildPax?.toString(),
      infantPax: passengerAnalyticsDetails?.InfantPax?.toString(),
      seniorPax: passengerAnalyticsDetails?.SeniorPax?.toString(),
      daysUntilDeparture,
      sector: sectors.join('|'),
      isCheckinClosed: checkinClosed.join('|'),
      pnr: apiResponse?.data?.bookingDetails?.recordLocator,
      hoursUntilDeparture,
    },
    bookingChannel: bookingAnalyticsDetails?.BookingChannel?.toString() ?? '',
    gtmData: {
      OD: journeyKey ? OD : journeyOD.join('-'),
      pax_details: paxDetails.join('|'),
      flight_sector: flightSector,
      departure_date: travelDate,
      PNR: apiResponse?.data?.bookingDetails?.recordLocator,
    },
    journies: journiesGtm,
  };
};
