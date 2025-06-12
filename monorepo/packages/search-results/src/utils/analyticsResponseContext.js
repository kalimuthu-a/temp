import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import { getDynamicPageInfo } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';
import { differenceInCalendarDays, format } from 'date-fns';
import merge from 'lodash/merge';
import pushAnalytics from './analyticsEvent';
import pushGTMAnalytics from './gtmEvents';

import { ANALTYTICS, GTM_ANALTYTICS, dateFormats } from '../constants';
import { getFlightType } from './analyticsUtils';

const productDetailsFormat =
  ';{tripType}|{sector}|{departureDates}|{adultPax}:{seniorPax}:{childPax};;;;eVar19={origin}|eVar20={destination}';

const itinerarySelectedFormat =
  '{tripType}|{sector}|{departureDates}|{adultPax}:{seniorPax}:{childPax}';

/**
 * @param {import("../models/SearchPayload")} search
 * @param {string} noFlightfoundReason
 */
export default (
  apiresponse,
  search,
  noFlightfoundReason,
  loyaltyAnalyticsData,
  triggerPageLoad = true,
) => {
  const tripType = search.getTripType();
  const airportCodePairs = [];
  const sectors = [];
  const currencyCode = search.selectedCurrency?.value || 'INR';
  const daysUntilDeparture = [];
  const departureDates = [];
  const {
    infantCount,
    seniorCitizenCount,
    totalCount,
    adultCount,
    childrenCount,
  } = search.seatWiseSelectedPaxInformation;

  const adultPax = adultCount;
  const childPax = childrenCount;
  const infantPax = infantCount;
  const seniorPax = seniorCitizenCount;
  const searchResultCounts = [];
  const specialFare = search.selectedSpecialFare
    ? search.selectedSpecialFare.specialFareLabel
    : '';

  const totalPax = totalCount;
  const flightTypes = [];
  const segments = search.getSegment();

  const bookingPurpose = search.travellingFor;
  const bookingMode = search.payWith;

  segments.forEach((segment, index) => {
    const { destination, origin, departureDate } = segment;
    const sector = [origin, destination].join('-');
    const airportCodePair = [origin, destination].sort().join('-');
    sectors.push(sector);
    airportCodePairs.push(airportCodePair);
    departureDates.push(format(new Date(departureDate), dateFormats.ddMMyyyy));
    flightTypes.push(getFlightType(tripType, index));

    daysUntilDeparture.push(
      differenceInCalendarDays(departureDate, new Date()).toString(),
    );
  });

  apiresponse.forEach((trip) => {
    const { destination, origin, journeysAvailable } = trip;
    const sector = [origin, destination].join('-');
    searchResultCounts.push(`${journeysAvailable.length}:${sector}`);
  });

  const adobeAnalyticsContext = {
    page: {
      pageInfo: {
        searchResultCount: searchResultCounts.join('|'),
      },
    },
    product: {
      productInfo: {
        tripType,
        airportCodePair: airportCodePairs.join('|'),
        sector: sectors.join('|'),
        departureDates: departureDates.join('|'),
        currencyCode,
        specialFare,
        totalPax: totalPax.toString(),
        adultPax: adultCount.toString(),
        childPax: childPax.toString(),
        infantPax: infantPax.toString(),
        seniorPax: seniorPax.toString(),
        daysUntilDeparture: daysUntilDeparture.join('|'),
        itinerarySelected: formattedMessage(itinerarySelectedFormat, {
          tripType,
          sector: sectors.join(':'),
          departureDates: departureDates.join(':'),
          adultPax,
          seniorPax,
          childPax,
        }),
        productDetails: formattedMessage(productDetailsFormat, {
          tripType,
          sector: sectors.join(':'),
          departureDates: departureDates.join(':'),
          adultPax,
          seniorPax,
          childPax,
          origin: search.selectedSourceCityInfo?.stationCode,
          destination: search.selectedDestinationCityInfo?.stationCode,
        }),
        promoCode: search.selectedPromoInfo ?? '',
        bookingPurpose,
        bookingMode,
      },
    },
  };

  const { journeyFlow, pageName } = getDynamicPageInfo();

  const googleAnalyticsContext = {
    currency_code: currencyCode,
    trip_type: tripType,
    pax_details: search.getPaxDetailsforGTM(),
    departure_date: departureDates.join('|'),
    special_fare: adobeAnalyticsContext.product.productInfo.specialFare,
    flight_sector: search.getFlightSectorType(),
    flight_type: flightTypes.join('|'),
    coupon_code: adobeAnalyticsContext.product.productInfo.promoCode,
    booking_purpose: adobeAnalyticsContext.product.productInfo.bookingPurpose,
    booking_mode: adobeAnalyticsContext.product.productInfo.bookingMode,
    OD: sectors.join('|'),
    page_name: pageName,
    site_section:
      window.pageType === 'srp' ? 'Booking Page' : 'Modification Page',
    journey_flow: journeyFlow,
    days_until_departure:
      adobeAnalyticsContext.product.productInfo.daysUntilDeparture,
  };

  if (triggerPageLoad) {
    const onLoadProductInfo = { ...adobeAnalyticsContext.product.productInfo };
    delete onLoadProductInfo.bookingMode;

    const onLoadLoyaltyAnaltyics = { ...loyaltyAnalyticsData.loyalty };
    delete onLoadLoyaltyAnaltyics.pointsBurned;
    delete onLoadLoyaltyAnaltyics.pointsEarned;

    pushAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.ON_PAGE_LOAD,
      changeFlightFlow: search.changeFlightFlow,
      data: merge({
        pageInfo: adobeAnalyticsContext.page.pageInfo,
        productInfo: onLoadProductInfo,
        productViewed: {
          flight: '1',
        },
      }, { productInfo: loyaltyAnalyticsData.productInfo, loyalty: onLoadLoyaltyAnaltyics }),
    });
  }

  if (searchResultCounts.length === 0) {
    pushAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.NO_FLIGHT_FOUND,
      changeFlightFlow: search.changeFlightFlow,
      data: {
        pageInfo: {
          ...adobeAnalyticsContext.page.pageInfo,
          noFlightfoundReason,
        },
        productInfo: adobeAnalyticsContext.product.productInfo,
        productViewed: {
          flight: '1',
        },
      },
    });

    pushGTMAnalytics({
      event: GTM_ANALTYTICS.EVENTS.NO_FLIGHTS_FOUND,
      data: googleAnalyticsContext,
    });
  }

  return {
    adobeAnalyticsContext,
    googleAnalyticsContext,
  };
};
