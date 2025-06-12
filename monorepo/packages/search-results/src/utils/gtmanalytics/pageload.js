import { getDynamicPageInfo } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';
import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { differenceInCalendarDays, format } from 'date-fns';
import pushGTMAnalytics from '../gtmEvents';

import { GTM_ANALTYTICS, dateFormats } from '../../constants';
import { getFlightType } from '../analyticsUtils';

/**
 * @param {import("../models/SearchPayload")} search
 */
export default (search) => {
  const tripType = search.getTripType();
  const sectors = [];
  const currencyCode = search.selectedCurrency?.value || 'INR';
  const daysUntilDeparture = [];
  const departureDates = [];

  const specialFare = search.selectedSpecialFare
    ? search?.selectedSpecialFare?.specialFareLabel
    : '';
  const flightTypes = [];
  const segments = search.getSegment();

  const bookingPurpose = search.travellingFor;
  const bookingMode = search.payWith;

  segments.forEach((segment, index) => {
    const { destination, origin, departureDate } = segment;
    const sector = [origin, destination].join('-');
    sectors.push(sector);
    departureDates.push(format(new Date(departureDate), dateFormats.ddMMyyyy));
    flightTypes.push(getFlightType(tripType, index));

    daysUntilDeparture.push(
      differenceInCalendarDays(departureDate, new Date()),
    );
  });

  const { journeyFlow, pageName } = getDynamicPageInfo();

  const googleAnalyticsContext = {
    currency_code: currencyCode,
    trip_type: tripType,
    pax_details: search.getPaxDetailsforGTM(),
    departure_date: departureDates.join('|'),
    special_fare: specialFare,
    flight_sector: search.getFlightSectorType(),
    flight_type: flightTypes.join('|'),
    coupon_code: search.selectedPromoInfo ?? '',
    booking_purpose: bookingPurpose,
    booking_mode: bookingMode,
    OD: sectors.join('|'),
    page_name: pageName,
    site_section:
      window.pageType === Pages.SRP ? 'Booking Page' : 'Modification',
    journey_flow: journeyFlow,
    days_until_departure: daysUntilDeparture.join('|'),
  };

  pushGTMAnalytics({
    event: GTM_ANALTYTICS.EVENTS.PAGE_LOAD,
    data: googleAnalyticsContext,
  });
};
