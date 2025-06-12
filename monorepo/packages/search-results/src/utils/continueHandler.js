import { specialFareCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import format from 'date-fns/format';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { flightDurationFormatterUnits } from '.';
import {
  AIRCRAFT_TYPES,
  ANALTYTICS,
  GTM_ANALTYTICS,
  dateFormats,
  discountCodes,
} from '../constants';
import pushAnalytics from './analyticsEvent';
import pushGTMAnalytics from './gtmEvents';
import {
  getAnalyticsItemId,
  getAnalyticsItemName,
  getAnalyticsItemNameJourneyWise,
  getFlightDuration,
  getFlightTime,
  getFlightType,
  getItemCategory,
} from './analyticsUtils';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';

/**
 *
 * @param {array} selectedProductClassArray  // ["R", "J", "N"]
 * @param {object} flightSearchData
 */
export const checkIfFareInvalid = (
  selectedProductClassArray,
  flightSearchData,
) => {
  // pass the specialfarecode info and add acheck for the same.
  let inValidityFlag = false;
  let productClasses = selectedProductClassArray;
  productClasses = productClasses.filter(
    (item, index) => productClasses.indexOf(item) === index,
  );

  if (productClasses.length > 1) {
    const combinabilityData =
      flightSearchData?.configSettings?.combinabilityData || [];
    const combinerData = combinabilityData.filter((item) =>
      productClasses.includes(item.productClass),
    );
    combinerData.forEach((item) => {
      const activeProductClass = item.productClass;
      const tempCompareFareData = combinerData.filter(
        (tempItem) =>
          tempItem.productClass !== activeProductClass &&
          tempItem.pClassList.includes(activeProductClass),
      );
      if (!inValidityFlag) {
        inValidityFlag = !tempCompareFareData.length;
      }
    });
  }
  return inValidityFlag;
};

export const checkIfFlightOverlap = (selectedFlights, gapInHours = 1) => {
  const overlappingFlights = [];

  const flightsCopy = cloneDeep(selectedFlights);

  // Sort selectedFlights by departure time
  flightsCopy.sort(
    (a, b) =>
      new Date(a.designator.departure) - new Date(b.designator.departure),
  );

  for (let i = 0; i < selectedFlights.length; i += 1) {
    for (let j = i + 1; j < selectedFlights.length; j += 1) {
      // Convert departure and arrival times to Date objects for comparison
      const arrivalTime1 = new Date(selectedFlights[i].designator.arrival);
      const departureTime2 = new Date(selectedFlights[j].designator.departure);
      const minimumDepartureTime = new Date(arrivalTime1);
      minimumDepartureTime.setHours(arrivalTime1.getHours() + gapInHours);

      // Check if the departure time of the second flight is within the gap after the arrival time of the first flight
      if (departureTime2 < minimumDepartureTime) {
        overlappingFlights.push([selectedFlights[i], selectedFlights[j]]);
      }
    }
  }

  return overlappingFlights.length > 0;
};

export const isNextButtonEnable = (selectedFares, selectedTripIndex) => {
  if (!selectedFares[selectedTripIndex]) {
    return false;
  }

  const combinerData = selectedFares.map((selectedFare) => {
    return selectedFare?.fare?.combinabilityData || [];
  });

  return selectedFares.filter(Boolean).every((selectedFare) => {
    return combinerData.every((combinabilityData) => {
      return (
        combinabilityData.length === 0 ||
        combinabilityData.includes(selectedFare?.fare?.productClass)
      );
    });
  });
};

export const triggerNextAnalytics = (
  selectedFares,
  analyticsContext,
  googleAnalyticsContext,
  flightSearchData,
  appliedFilters,
  loyaltyAnalyticsData,
  searchContext,
) => {
  const {
    infantCount,
    seniorCitizenCount,
    adultCount,
    childrenCount,
    totalCount: totalPax,
  } = searchContext?.seatWiseSelectedPaxInformation || {};
  const {
    product: {
      productInfo = {},
    } = {}
  } = analyticsContext || {};
  const tripFares = [];
  const categoryFare = [];
  const flightNumbers = [];
  const tripDuration = [];
  const fareTags = [];
  const selectFlightData = {
    OD: [],
    fare_type: [],
    flight_fare: [],
    flight_number: [],
    flight_brand: [],
    flight_type: [],
    flight_tag: [],
    flight_option: [],
    flight_time: [],
    select_flight: '1',
    departure_date: [],
    daysUntilDeaparture: [],
  };
  const selectedFlightPosition = [];
  const sectors = [];
  const categoryFares = [];

  selectedFares.forEach((selectedFare) => {
    tripFares.push(selectedFare.fare.totalFareAmount);
    const flightNumbersSegment = [];
    const flighBrandSegment = [];
    const tripDurationSegment = [];
    const departureDates = [];
    const daysUntilDeparture = [];
    const { origin, destination } = selectedFare.designator;
    const sector = [origin, destination].join('-');
    sectors.push(sector);
    categoryFares.push(getItemCategory(selectedFare.segments));

    selectedFare.segments.forEach((segment) => {
      const { carrierCode, identifier } = segment.identifier;
      flightNumbersSegment.push(`${carrierCode}${identifier}`);
      flighBrandSegment.push(`${carrierCode}`);

      const { arrival, departure } = segment.designator;
      tripDurationSegment.push(
        flightDurationFormatterUnits(new Date(departure), new Date(arrival)),
      );
      departureDates.push(format(new Date(departure), dateFormats.ddMMyyyy));
      daysUntilDeparture.push(
        differenceInCalendarDays(new Date(departure), new Date()).toString(),
      );
    });

    flightNumbers.push(flightNumbersSegment.join('~'));
    tripDuration.push(tripDurationSegment.join('~'));
    categoryFare.push(selectedFare?.fare?.aemFare?.fareLabel);
    fareTags.push(selectedFare.fareTag);
    selectFlightData.OD.push(getAnalyticsItemName(selectedFare.segments));
    selectFlightData.fare_type.push(selectedFare.fare?.aemFare?.fareLabel);
    selectFlightData.flight_fare.push(selectedFare?.fare?.totalFareAmount);
    selectFlightData.flight_number.push(
      getAnalyticsItemId(selectedFare.aircrafts, '~'),
    );
    selectFlightData.flight_option.push(selectedFare.flightType);
    selectFlightData.flight_time.push(
      getFlightTime(selectedFare.segments, '~'),
    );
    selectedFlightPosition.push(selectedFare.index || 0);
    selectFlightData.flight_tag.push(selectedFare.fareTag);
    selectFlightData.departure_date.push(departureDates.join('~'));
    selectFlightData.daysUntilDeaparture.push(daysUntilDeparture.join('~'));
    selectFlightData.flight_brand.push(flighBrandSegment.join('~'));
  });

  pushAnalytics({
    event: ANALTYTICS.DATA_CAPTURE_EVENTS.ON_CLICK_NEXT,
    data: merge({
      productInfo: {
        ...analyticsContext?.product?.productInfo,
        tripFares: tripFares.join('|'),
        flightNumbers: flightNumbers.join('|'),
        categoryFare: categoryFare.join('|'),
        tripDuration: tripDuration.join('|'),
        fareTag: fareTags.join('|'),
      },
      productSelected: {
        flight: '1',
      },
    }, loyaltyAnalyticsData),
  });

  const tripType = googleAnalyticsContext.trip_type;

  const item = {
    applied_filter: [],
    item_id: [],
    item_brand: [],
    item_name: [],
    coupon_code: [],
    discount: [],
    item_category: [],
    fare_type: [],
    index: [],
    flight_list: [],
    item_category3: [],
    price: [],
    flight_option: [],
    flight_time: [],
    flight_duration: [],
    item_category4: [],
  };
  let amount = 0;

  selectedFares.forEach((selectedFare, index) => {
    if (selectedFare) {
      item.applied_filter.push(appliedFilters);
      item.item_id.push(getAnalyticsItemId(selectedFare.aircrafts, '~'));
      item.item_brand.push(
        selectedFare.aircrafts.map((row) => row.carrierCode).join('~'),
      );
      item.item_name.push(
        getAnalyticsItemNameJourneyWise(selectedFare.designator),
      );
      item.item_category4.push(
        getAnalyticsItemName(selectedFare.segments, '~'),
      );
      item.coupon_code.push('');
      item.discount.push(selectedFare.fare?.originalTotalDiscount);
      item.item_category.push(getItemCategory(selectedFare.segments));
      item.fare_type.push(selectedFare.fare?.aemFare?.fareLabel);
      item.index.push(selectedFare.index || 0);
      item.flight_list.push(getFlightType(tripType, index));
      item.price.push(selectedFare.fare.totalFareAmount);
      item.item_category3.push(selectedFare.fareTag);
      item.flight_option.push(selectedFare.flightType);
      item.flight_time.push(getFlightTime(selectedFare.segments, '~'));
      item.flight_duration.push(getFlightDuration(selectedFare.segments, '~'));
      amount += selectedFare.fare.totalFareAmount;
    }
  });

  pushGTMAnalytics({
    event: GTM_ANALTYTICS.EVENTS.ADD_TO_CART,
    data: {
      ...googleAnalyticsContext,
      selected_flight_position: selectedFlightPosition.join('|'),
      ecommerce: {
        currency_code: flightSearchData.currencyCode,
        value: amount,
        items: [
          {
            applied_filter: item.applied_filter.join('|'),
            item_id: item.item_id.join('|'),
            item_brand: item.item_brand.join('|'),
            item_name: item.item_name.join('|'),
            coupon_code: item.coupon_code.join('|'),
            discount: item.discount.join('|'),
            item_category: item.item_category.join('|'),
            fare_type: item.fare_type.join('|'),
            index: item.index.join('|'),
            flight_list: item.flight_list.join('|'),
            item_category3: item.item_category3.join('|'),
            item_category4: item.item_category4.join('|'),
            price: item.price.join('|'),
            flight_option: item.flight_option.join('|'),
            flight_time: item.flight_time.join('|'),
            flight_duration: item.flight_duration.join('|'),
          },
        ],
      },
      departure_date: selectFlightData.departure_date.join('|'),
      days_until_departure: selectFlightData.daysUntilDeaparture.join('|'),
    },
  });
    const loggedInUserData = Cookies.get('auth_user', true, true);

  pushGTMAnalytics({
    event: GTM_ANALTYTICS.EVENTS.SELECT_FLIGHT,
    data: {
      applied_filter: appliedFilters,
      OD: selectFlightData.OD.join('|'),
      fare_type: selectFlightData.fare_type.join('|'),
      flight_fare: selectFlightData.flight_fare.join('|'),
      flight_number: selectFlightData.flight_number.join('|'),
      flight_brand: selectFlightData.flight_brand.join('|'),
      flight_type: selectFlightData.flight_type.join('|'),
      flight_tag: selectFlightData.flight_tag.join('|'),
      flight_option: selectFlightData.flight_option.join('|'),
      flight_time: selectFlightData.flight_time.join('|'),
      select_flight: '1',
      selected_flight_position: selectedFlightPosition.join('|'),
      ...googleAnalyticsContext,
      departure_date: selectFlightData.departure_date.join('|'),
      days_until_departure: selectFlightData.daysUntilDeaparture.join('|'),
      
      sector: sectors.join('|'),
      currencyCode: googleAnalyticsContext?.currency_code,
      departureDates: selectFlightData.departure_date.join('|'),
      flightNumbers: selectFlightData.flight_number.join('|'),
      childPax: childrenCount,
      infantPax: infantCount,
      adultPax: adultCount,
      seniorPax: seniorCitizenCount,
      itinerarySelected: productInfo?.itinerarySelected,
      tripDuration: tripDuration?.join('|'),
      tripFares: tripFares?.join('|'),
      tripType: googleAnalyticsContext?.trip_type,
      totalPax: totalPax,
      categoryFares: categoryFares?.join('|'),
      FF_number: loggedInUserData?.loyaltyMemberInfo?.FFN || loggedInUserData?.loyaltyMemberInfo?.ffn || false,
      paxDetails: googleAnalyticsContext?.pax_details,
    },
  });
};

export const isDoubleTripleSeatsNotAllowed = (
  paxInfoArray,
  selectedFlight,
  specialfarecode,
  additional,
) => {
  let isCodeShare = false;
  const equipmentTypes = [];
  let errorMsg = { error: '', variation: 'Error' };

  const isDoubleSeatAdded = paxInfoArray.find((paxInfo) => {
    return paxInfo.discountCode.includes(discountCodes.DOUBLE_SEAT);
  });

  const isTripleSeatAdded = paxInfoArray.find((paxInfo) => {
    return paxInfo.discountCode.includes(discountCodes.TRIPLE_SEAT);
  });

  selectedFlight.segments.forEach((seg) => {
    if (seg.isCodeShare) {
      isCodeShare = true;
    }
    const { equipmentType } = seg.identifier;
    equipmentTypes.push(equipmentType);
  });

  if (equipmentTypes.includes(AIRCRAFT_TYPES.ATR) && isTripleSeatAdded) {
    errorMsg = {
      variation: 'Error',
      error: additional?.atrTripleSeatError?.html || '',
    };
  }
  if (isCodeShare && (isDoubleSeatAdded || isTripleSeatAdded)) {
    errorMsg = {
      variation: 'Info',
      error: additional?.codeShareDoubleTripeSeatError?.html || '',
    };
  }

  if (
    specialfarecode?.specialFareCode === specialFareCodes.UMNR &&
    isCodeShare
  ) {
    errorMsg = {
      error: additional?.codeShareUnaccompaniedError?.html || '',
      variation: 'Error',
    };
  }
  return errorMsg;
};

export const triggerFareDetailsAnalytics = (selectedFares) => {
  const sectors = [];
  const airportCodePairs = [];
  const fareTags = [];

  selectedFares.filter(Boolean).forEach((selectedFare) => {
    const { origin, destination } = selectedFare.designator;
    const sector = [origin, destination].join('-');
    const airportCodePair = [origin, destination].sort().join('-');
    sectors.push(sector);
    airportCodePairs.push(airportCodePair);
    fareTags.push(selectedFare.fareTag);
  });

  pushAnalytics({
    event: ANALTYTICS.DATA_CAPTURE_EVENTS.POP_UP_OPEN_FARE_DETAILS,
    data: {
      productInfo: {
        sector: sectors.join('|'),
        airportCodePair: airportCodePairs.join('|'),
        fareTag: fareTags.join('|'),
      },
    },
  });
};
