/* eslint-disable prefer-destructuring */
/* eslint-disable sonarjs/cognitive-complexity */
import {
  FLIGHT_BOOKING,
  flightStatus,
  flightStatusColors,
  flightStatusLabel,
  flightTypeLabels,
  paymentStatuses,
  tripStatus,
  tripStatusColors,
  webCheckInStatus,
} from '../../../constants/common';
import { replaceCurlyBraces } from '../../../functions/utils';
import { flightTypes } from '../../../utils/analyticsConstants';
import {
  formatDateTime,
  getLabel,
  getTimeDifference,
  getWebCheckInMsgStatus,
} from '../../../utils/utilFunctions';

const createMyBookingsCardData = (data, labels, pastTrips = false) => {
  const cardData = {};
  const {
    flightToCityLabel,
    roundToCityLabel,
    multiCityTripLabel,
    webCheckInSubText,
  } = labels;
  const { journey, bookingStatus, paymentStatus, holdExpiry, isCompleted, lastName, bookingCategory } = data;
  let tripType = '';

  if (journey?.length === 0) {
    cardData.cardTitle = labels?.cancelledTripsLabel;
  }

  if (journey?.length === 1) {
    cardData.cardTitle = replaceCurlyBraces(
      flightToCityLabel,
      journey?.[0]?.journeyDetail?.destinationCityName,
    );
    tripType = flightTypes.ONEWAY;
  } else if (
    journey?.length === 2
    && journey?.[0]?.journeyDetail?.destinationCityName
    === journey?.[1]?.journeyDetail?.originCityName
    && journey?.[1]?.journeyDetail?.destinationCityName
    === journey?.[0]?.journeyDetail?.originCityName
  ) {
    cardData.cardTitle = replaceCurlyBraces(
      roundToCityLabel,
      journey?.[0]?.journeyDetail?.destinationCityName,
    );
    tripType = flightTypes.ROUND;
  } else if (journey?.length >= 2) {
    cardData.cardTitle = replaceCurlyBraces(
      multiCityTripLabel,
      journey?.[0]?.journeyDetail?.destinationCityName,
    );
    tripType = flightTypes.MULTI;
  }
  // if not journey then consider it as cancelled trip else according to booking status show the status
  cardData.bookingStatus = journey?.length === 0 ? tripStatus[3] : tripStatus[bookingStatus];
  cardData.bookingStatusColor = journey?.length === 0 ? tripStatusColors[3] : tripStatusColors[bookingStatus];
  // this condition is to show hold and pay later
  if (bookingStatus === 1 && (paymentStatus === 2 || paymentStatus === 4)) {
    cardData.bookingStatus = tripStatus[5];
    cardData.bookingStatusColor = tripStatusColors[5];
  }

  cardData.bookingCategory = bookingCategory;
  if (!bookingCategory) {
    cardData.bookingCategory = FLIGHT_BOOKING.CANCELLED;
    if (isCompleted && journey?.length) {
      cardData.bookingCategory = FLIGHT_BOOKING.COMPLETED;
    } else if (!isCompleted && journey?.length) {
      cardData.bookingCategory = FLIGHT_BOOKING.CURRENT;
    }
  }

  cardData.paymentStatus = paymentStatuses[paymentStatus];
  cardData.holdExpiry = holdExpiry;
  cardData.lastName = lastName;
  // cardData.bookingStatusColor = tripStatusColors[bookingStatus];
  cardData.isOneWay = journey?.length === 1;
  cardData.pnr = data?.recordLocator;
  cardData.partnerPnr = data?.locators?.recordLocators?.map((recordLocator) => recordLocator?.recordCode).join(' ');
  cardData.anyMultiNoShow = false; // if any journy in round or multi city no show happens make it true
  cardData.cancelledDate = data?.modifiedDateUTC;
  cardData.sector = '';
  cardData.departureDates = '';
  const journeyDetails = journey?.map((travelDetail, index) => {
    // eslint-disable-next-line sonarjs/prefer-object-literal
    const bookingInfoData = {};

    bookingInfoData.pnr = data?.recordLocator;

    const { locators } = data || {};
    const partnerPNR = locators?.recordLocators?.map((recordLocator) => recordLocator?.recordCode);
    if (partnerPNR?.length) {
      bookingInfoData.partnerPnr = partnerPNR.join(' ');
    }

    const { journeyDetail, segment, webCheckinInfo, flightType, boardingInfo } = travelDetail;

    const departureTerminal = segment?.[0]?.legs?.[0]?.legInfo?.departureTerminal || '';
    const arrivalTerminal = segment[segment.length - 1]?.legs?.[0]?.legInfo?.arrivalTerminal || '';

    bookingInfoData.flightNumbers = segment?.map(({ identifier, externalIdentifier }) => {
      if (externalIdentifier.identifier !== null && externalIdentifier.carrierCode !== null) {
        return `${externalIdentifier.carrierCode} ${externalIdentifier.identifier}`;
      }
      return `${identifier.carrierCode} ${identifier.identifier}`;
    });
    bookingInfoData.flightStatus = flightStatus.ON_TIME;
    if (pastTrips) {
      // TODO
      bookingInfoData.flightStatus = webCheckinInfo?.isAllPaxCheckedIn
        ? flightStatus.FLOWN
        : flightStatus.NO_SHOW;
      if (!webCheckinInfo?.isAllPaxCheckedIn) {
        // if no show
        cardData.anyMultiNoShow = true;
      }
    }
    if (!pastTrips) {
      bookingInfoData.flightStatus = journeyDetail?.estimatedArrival
        ? flightStatus.DELAYED
        : flightStatus.ON_TIME;
    }

    bookingInfoData.flightStatusLabel = flightStatusLabel[bookingInfoData.flightStatus];

    if (boardingInfo?.departureGate) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      bookingInfoData.flightStatusLabel += boardingInfo?.departureGate;
    }

    bookingInfoData.flightStatusColor = flightStatusColors[bookingInfoData.flightStatus];

    bookingInfoData.departureTime = formatDateTime(
      journeyDetail.departure,
    ).formattedTime;
    bookingInfoData.arrivalTime = formatDateTime(
      journeyDetail.arrival,
    ).formattedTime;
    bookingInfoData.originCode = journeyDetail.origin;
    bookingInfoData.destinationCode = journeyDetail.destination;
    bookingInfoData.originCity = `${journeyDetail.originCityName}${
      departureTerminal ? `, T${departureTerminal}` : ''
    }`;
    bookingInfoData.destinationCity = `${journeyDetail.destinationCityName}${
      arrivalTerminal ? `, T${arrivalTerminal}` : ''
    }`;
    bookingInfoData.travelTime = getTimeDifference(
      journeyDetail.utcArrival,
      journeyDetail.utcDeparture,
    );
    bookingInfoData.stops = flightTypeLabels[flightType];
    bookingInfoData.departureDate = formatDateTime(
      journeyDetail?.departure,
    ).formattedDateShort;
    cardData.sector = `${cardData.sector && '|'}${journeyDetail.origin}-${journeyDetail.destination}`;

    const departureDate = formatDateTime(
      journeyDetail?.departure,
    ).formatedDdMmYy;
    cardData.departureDates = `${cardData.departureDates && '|'}${departureDate}`;
    bookingInfoData.paxCount = `${data?.numberOfPassengers} ${labels?.paxLabel}`;
    bookingInfoData.webCheckinDate = `${replaceCurlyBraces(
      webCheckInSubText,
      '',
    )}${formatDateTime(webCheckinInfo?.checkinStartTime).formattedTimeAndDay}`;
    bookingInfoData.webCheckinStatus = webCheckinInfo?.isWebCheckinStatus;
    bookingInfoData.utcDepartureTime = journeyDetail?.utcDeparture;
    bookingInfoData.utcArrivalTime = journeyDetail?.utcArrival;
    bookingInfoData.isSmartCheckin = webCheckinInfo?.isSmartCheckin;
    bookingInfoData.isAllPaxCheckedIn = webCheckinInfo?.isAllPaxCheckedIn;
    bookingInfoData.isLastItem = journey?.length === index + 1;
    bookingInfoData.isFirstItem = index === 0;
    bookingInfoData.webCheckinMsgStatus = getWebCheckInMsgStatus(webCheckinInfo?.checkinStartTimeUTC);
    bookingInfoData.analyticsData = {
      currencyCode: data?.currencyCode || '',
      bookingReference: data?.bookingKey || '',
      specialFare: data?.specialFare || '',
      adultPax: data?.adultPax || '',
      childPax: data?.childPax || '',
      infantPax: data?.infantPax || '',
      seniorPax: data?.seniorPax || '',
      bookingPurpose: data?.bookingPurpose || '',
      marketType: data?.isInternational ? 'International' : 'Domestic',
      tripType,
      departureDates: cardData.departureDates,
      totalPax: data?.numberOfPassengers || '',
      daysUntilDeparture: data?.daysLeftDeparture || '',
      sector: cardData.sector, // TODO - calculate
      label: getLabel(webCheckinInfo),
      bookingCategory: cardData.bookingCategory,
    };

    return bookingInfoData;
  });

  cardData.bookingInfo = journeyDetails;

  return cardData;
};

export default createMyBookingsCardData;
