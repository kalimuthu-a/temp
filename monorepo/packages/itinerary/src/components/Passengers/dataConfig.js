import { CONSTANTS } from '../../constants';

export const getSalutionLabel = (code) => {
  const filtered = CONSTANTS.SALUTATION_ADULT.find((i) => i.value === code);
  return filtered && filtered.label ? filtered.label : code;
};
export const getSegmentBasedPassengerInfo = (passengerArray, segmentKey) => {
  const data = [];
  passengerArray.forEach((pItem) => {
    let obj = {
      name: '',
      passengerKey: '',
      eTicketNumber: '',
      matchedJourney: {
        journeyKey: '',
        matchLookSegmentKey: segmentKey,
        matchedSegment: {

        },
      },
    };

    const title = pItem.name && getSalutionLabel(pItem.name.title);
    obj.passengerName = pItem.name
      ? `${title} ${pItem.name.first} ${pItem.name.last}`
      : '';
    obj.passengerKey = pItem.passengerKey;
    obj.eTicketNumber = pItem.eTicketNumber;
    const journeyList = pItem.seatsAndSsrs?.journeys || [];

    journeyList.forEach((jItem) => {
      const foundSegment = jItem.segments?.find((sItem) => sItem.segmentKey === segmentKey) || null;
      if (foundSegment) {
        obj.matchedJourney = {
          ...obj.matchedJourney,
          journeyKey: jItem.journeyKey,
          journeyDetails: jItem.journeyDetails,
          matchedSegment: {
            ...foundSegment,

          },
        };
      }
    });
    obj = {
      ...pItem,
      ...obj,
    };
    // NOSONAR
    // eslint-disable-next-line max-len
    // if ([CONSTANTS.PASSENGER_EXTRA_SEAT.DOUBLE_SEAT_DISCOUNT_CODE, CONSTANTS.PASSENGER_EXTRA_SEAT.TRIPLE_SEAT_DISCOUNT_CODE].includes(pItem.discountCode)) {
    // eslint-disable-next-line max-len
    //   let foundInNewData = passengerArray.filter(item => item.eTicketNumber === pItem.eTicketNumber && pItem.discountCode === item.discountCode);
    //   if (foundInNewData && foundInNewData.length > 0) {
    //     data.map((dItem, index) => {
    //       if (dItem.eTicketNumber === pItem.eTicketNumber && pItem.discountCode === dItem.discountCode) {
    //         let extraSeats = obj?.matchedJourney?.matchedSegment?.seats || [];
    //         dItem[index].matchedJourney.matchedSegment.seats.push(...extraSeats);
    //       }
    //     });
    //   }
    // } else {
    data.push(obj);
    // }
  });
  return data;
};

export const mergeSegmentWiseDataWithExtraSeat = (passengerArray, segmentKey) => {
  const tempArray = getSegmentBasedPassengerInfo(passengerArray, segmentKey);
  const allPassengerOnly = tempArray.filter((tItem) => ![CONSTANTS.PASSENGER_EXTRA_SEAT.DOUBLE_SEAT_DISCOUNT_CODE,
    CONSTANTS.PASSENGER_EXTRA_SEAT.TRIPLE_SEAT_DISCOUNT_CODE]
    .includes(tItem.discountCode));
  const allDoubleSeatItems = tempArray.filter((tItem) => tItem.discountCode === CONSTANTS
    .PASSENGER_EXTRA_SEAT.DOUBLE_SEAT_DISCOUNT_CODE);
  const allTripleSeatItems = tempArray.filter((tItem) => tItem.discountCode === CONSTANTS
    .PASSENGER_EXTRA_SEAT.TRIPLE_SEAT_DISCOUNT_CODE);
  let doubleSeatCount = 0;
  let tripleSeatCount = 0;
  allPassengerOnly.forEach((item, index) => {
    const seatData = allPassengerOnly[index]?.matchedJourney?.matchedSegment?.seats || [];
    if (item.ExtraSeatTag === CONSTANTS.PASSENGER_EXTRA_SEAT.EXTRASEATTAG_DOUBLE) {
      const extraSeatItem = allDoubleSeatItems[doubleSeatCount].matchedJourney?.matchedSegment?.seats || [];
      allPassengerOnly[index].matchedJourney.matchedSegment.seats = [...seatData, ...extraSeatItem];
      doubleSeatCount += 1;
    } else {
      const extraSeatItem = allTripleSeatItems[tripleSeatCount].matchedJourney?.matchedSegment?.seats || [];
      allPassengerOnly[index].matchedJourney.matchedSegment.seats = [...seatData, ...extraSeatItem];
      tripleSeatCount += 1;
    }
  });
  return allPassengerOnly;
};

export const findTripType = (journeyList = []) => {
  if (journeyList?.length === 0) {
    return '';
  }
  let tripType = '';
  if (journeyList?.length === 2
    && journeyList[0]?.journeydetail?.destination === journeyList[1]?.journeydetail?.origin) {
    tripType = CONSTANTS.PNR_TYPE.ROUND_TRIP;
  } else if (journeyList?.length === 1) {
    tripType = CONSTANTS.PNR_TYPE.ONE_WAY;
  } else {
    tripType = CONSTANTS.PNR_TYPE.MULTY_CITY;
  }
  return tripType;
};

export const onClickViewBoardingPass = (activeJourneyKey, passengerKeys, viewBoardingPassPath = '/') => {
  const body = {
    journeyKey: activeJourneyKey,
    segmentKeys: [],
    passengerKeys: [],
  };
  if (passengerKeys?.length) {
    body.passengerKeys = [...passengerKeys];
  }
  localStorage.setItem(CONSTANTS.BROWSER_STORAGE_KEYS.BOARDING_PASS_PAYLOAD, JSON.stringify(body));
  window.location.href = viewBoardingPassPath;
};

export const getFlightType = (tripType, index) => {
  return tripType === 'RoundTrip' && index === 1 ? 'Returning' : 'Departing';
};
