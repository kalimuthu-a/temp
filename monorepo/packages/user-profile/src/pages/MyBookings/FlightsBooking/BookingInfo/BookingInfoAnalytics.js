import analyticEvents from '../../../../utils/analyticEvents';
import { aaEvents, analyticsTripCatLabel, eventNames } from '../../../../utils/analyticsConstants';

// eslint-disable-next-line import/prefer-default-export
export const ctaAnalytics = (data) => {
  const {
    tripType,
    departureDates,
    totalPax,
    daysUntilDeparture,
    sector,
    currencyCode,
    bookingReference,
    specialFare,
    adultPax,
    childPax,
    infantPax,
    seniorPax,
    bookingPurpose,
    marketType,
  } = data;
  analyticEvents({
    event: aaEvents.BOOKING_CARD_BTN,
    data: {
      _event: eventNames.CLICK,
      productInfo: {
        tripType,
        departureDates,
        totalPax,
        daysUntilDeparture,
        sector,
        promotionalCode: '6E Indigo',
        currencyCode,
        bookingReference,
        specialFare,
        adultPax,
        childPax,
        infantPax,
        seniorPax,
        bookingPurpose,
        marketType,
      },
      eventInfo: {
        name: data?.label,
        position: 'Flight',
        component: analyticsTripCatLabel(data?.bookingCategory),
      },
    },
  });
};
