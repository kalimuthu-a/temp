import { CONSTANTS } from '../../constants';

export const getSalutionLabel = (code) => {
  const filtered = CONSTANTS.SALUTATION_ADULT.find((i) => i.value === code);
  return filtered && filtered.label ? filtered.label : code;
};
export const getSegmentBasedPassengerInfo = (passengerArray, segmentKey) => {
  const data = [];
  passengerArray?.forEach((pItem) => {
    let obj = {
      name: pItem.name,
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

    data.push(obj);
  });
  return data;
};

export const findTripType = (journeyList) => {
  let tripType = '';
  if (journeyList.length === 2
     && journeyList[0]?.journeydetail?.destination === journeyList[1]?.journeydetail?.origin) {
    tripType = CONSTANTS.PNR_TYPE.ROUND_TRIP;
  } else if (journeyList.length === 1) {
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

export const bindWithDeepLinkUrl = (refurlPath, bookingDetails, passengers) => {
  const pnr = bookingDetails?.recordLocator || '';
  let baseUrl = 'https://comm-uat.goindigo.in/IndiGo-Dev2/Booking/SkyplusGenericDeepLinkApp?cid=skyplus';
  if (window?.msdv2?.bridgeDeepLinkPath) {
    baseUrl = window.msdv2.bridgeDeepLinkPath;
  }
  const refurl = refurlPath?.startsWith('/') ? window.location.origin + refurlPath : refurlPath;
  const lastname = passengers?.[0]?.name?.last || '';
  return `${baseUrl}&pnr=${pnr}&lastname=${lastname}&refurl=${refurl}`;
};
