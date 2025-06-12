import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import merge from 'lodash/merge';
import { ANALTYTICS, dateFormats } from '../../constants';
import pushAnalytics from '../analyticsEvent';
import { flightDurationFormatterUnits } from '..';

/**
 * @param {import("../models/SearchPayload")} search
 */
export default (analyticsContext, item, loyaltyAnalyticsData) => {
  const {
    page: { pageInfo },
    product: { productInfo },
  } = analyticsContext;

  const { destination, origin, departure, arrival } = item.designator;

  const sector = [origin, destination].join('-');
  const airportCodePair = [origin, destination].sort().join('-');

  const flightNumbersSegment = [];

  item.segments.forEach((segment) => {
    const { carrierCode, identifier } = segment.identifier;
    flightNumbersSegment.push(`${carrierCode}${identifier}`);
  });

  pushAnalytics({
    event: ANALTYTICS.DATA_CAPTURE_EVENTS.ON_CLICK_RECOMMENDATION,
    data: merge({
      pageInfo: {
        searchResultCount: pageInfo.searchResultCount,
      },
      productInfo: {
        flightType: item.flightType,
        fareTag: item.fareTag,
        tripType: productInfo.tripType,
        airportCodePair,
        sector,
        departureDates: format(departure, dateFormats.ddMMyyyy),
        currencyCode: productInfo.currencyCode,
        specialFare: productInfo.specialFare,
        totalPax: productInfo.totalPax.toString(),
        adultPax: productInfo.adultPax.toString(),
        childPax: productInfo.childPax.toString(),
        infantPax: productInfo.infantPax.toString(),
        seniorPax: productInfo.seniorPax.toString(),
        tripDuration: flightDurationFormatterUnits(
          new Date(departure),
          new Date(arrival),
        ),
        daysUntilDeparture: differenceInCalendarDays(
          departure,
          new Date(),
        ).toString(),
        itinerarySelected: productInfo.itinerarySelected,
        productDetails: productInfo.productDetails,
        categoryFare: item.fare.Product,
        tripFares: item.fare.totalFareAmount.toString(),
        flightNumbers: flightNumbersSegment.join('~'),
      },
    }, loyaltyAnalyticsData),
  });
};
