import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { PayWithModes } from 'skyplus-design-system-app/src/functions/globalConstants';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import {
  ANALTYTICS,
  GTM_ANALTYTICS,
  dateFormats,
  localStorageKeys,
} from '../constants';
import { getPaxTypes } from '../constants/form';
import analyticsEvent from '../utils/analyticsEvent';
import gtmPushAnalytic from '../utils/gtmEvents';
import LocalStorage from '../utils/LocalStorage';

class SearchItemModel {
  journeyinfo;

  count;

  date;

  journeryCities;

  dateInfo = '';

  journeyDateWithFormat;

  triptype;

  localStorageValue;

  constructor(obj) {
    Object.assign(this, obj);

    this.localStorageValue = obj;

    const {
      selectedSourceCityInfo,
      selectedDestinationCityInfo,
      seatWiseSelectedPaxInformation,
      selectedTravelDatesInfo,
      selectedJourneyType,
    } = obj;

    this.journeyinfo = `${selectedSourceCityInfo.stationCode} - ${selectedDestinationCityInfo.stationCode}`;
    this.journeyCities = `${selectedSourceCityInfo.shortName} - ${selectedDestinationCityInfo.shortName}`;

    this.count =
      seatWiseSelectedPaxInformation.adultCount +
      seatWiseSelectedPaxInformation.childrenCount +
      seatWiseSelectedPaxInformation.seniorCitizenCount;

    this.date = format(selectedTravelDatesInfo.startDate, dateFormats.ddMMM);

    if (this.isOneWay()) {
      this.dateInfo = format(
        selectedTravelDatesInfo.startDate,
        dateFormats.doMMM,
      );
    } else {
      this.dateInfo = [
        format(selectedTravelDatesInfo.startDate, dateFormats.doMMM),
        format(selectedTravelDatesInfo.startDate, dateFormats.doMMM),
      ].join('');
    }

    this.triptype = selectedJourneyType;
  }

  getJournies = () => {
    const {
      selectedMultiCityInfo,
      selectedDestinationCityInfo,
      selectedSourceCityInfo,
      selectedTravelDatesInfo,
    } = this;
    return this.isMultiCity()
      ? selectedMultiCityInfo.map((row) => ({
          ...row,
          date: new Date(row.date),
          departureDate: new Date(row.departureDate),
          maxDate: row.maxDate ? new Date(row.maxDate) : null,
          minDate: new Date(row.minDate),
        }))
      : [
          {
            destinationCity: selectedDestinationCityInfo,
            sourceCity: selectedSourceCityInfo,
            isNationalityPopup: false,
            departureDate: new Date(selectedTravelDatesInfo.startDate),
            arrivalDate: this.isRoundTrip()
              ? new Date(selectedTravelDatesInfo.endDate)
              : null,
            minDate: new Date(),
            key: uniq(),
          },
        ];
  };

  get payload() {
    const {
      seatWiseSelectedPaxInformation,
      selectedJourneyType,
      selectedCurrency,
      nationality,
      selectedSpecialFare,
      travellingFor,
      payWith,
      selectedPromoInfo,
    } = this;

    const paxInfo = getPaxTypes(selectedSpecialFare?.specialFareCode);

    paxInfo.ADT = {
      ...paxInfo.ADT,
      Count: seatWiseSelectedPaxInformation.adultCount,
      ExtraDoubleSeat: seatWiseSelectedPaxInformation.adultExtraDoubleSeat,
      ExtraTripleSeat: seatWiseSelectedPaxInformation.adultExtraTripleSeat,
    };

    paxInfo.CHD = {
      ...paxInfo.CHD,
      Count: seatWiseSelectedPaxInformation.childrenCount,
      ExtraDoubleSeat: seatWiseSelectedPaxInformation.childrenExtraDoubleSeat,
      ExtraTripleSeat: seatWiseSelectedPaxInformation.childrenExtraTripleSeat,
    };

    paxInfo.SRCT = {
      ...paxInfo.ADT,
      Count: seatWiseSelectedPaxInformation.seniorCitizenCount,
      ExtraDoubleSeat:
        seatWiseSelectedPaxInformation.seniorCitizenExtraDoubleSeat,
      ExtraTripleSeat:
        seatWiseSelectedPaxInformation.seniorCitizenExtraTripleSeat,
    };

    paxInfo.INFT = {
      ...paxInfo.INFT,
      Count: seatWiseSelectedPaxInformation.infantCount,
    };

    const journies = this.getJournies();

    return {
      currency: {
        currencyCode: selectedCurrency.value,
        currencySymbol: selectedCurrency.label,
      },
      nationality: nationality?.countryCode ? nationality : null,
      triptype: selectedJourneyType,
      paxInfo,
      vaccineDose: '',
      travellingFor,
      payWith,
      journies,
      selectedSpecialFare,
      promocode: {
        code: selectedPromoInfo,
        error: '',
        success: Boolean(selectedPromoInfo),
        card: selectedPromoInfo,
      },
    };
  }

  setAnalyticsEvent(index, isLoyaltyEnabled) {
    const {
      selectedJourneyType,
      selectedCurrency,
      selectedSpecialFare,
      travellingFor,
      payWith,
      seatWiseSelectedPaxInformation,
      triptype,
      selectedPromoInfo = '',
    } = this;

    const journies = this.getJournies();

    const departureDates = [];
    const airportCodePairs = [];
    const sectors = [];
    let marketTypes = [];
    const daysUntilDeparture = [];

    journies.forEach((journery) => {
      const { departureDate, sourceCity, destinationCity, arrivalDate } =
        journery;

      daysUntilDeparture.push(
        differenceInCalendarDays(departureDate, new Date()),
      );
      departureDates.push(format(departureDate, dateFormats.ddMMYYYY));
      const sourceCityCode = sourceCity.stationCode;
      const destinationCityCode = destinationCity.stationCode;

      sectors.push(`${sourceCityCode}-${destinationCityCode}`);
      if (sourceCityCode > destinationCityCode) {
        airportCodePairs.push(`${destinationCityCode}-${sourceCityCode}`);
      } else {
        airportCodePairs.push(`${sourceCityCode}-${destinationCityCode}`);
      }

      const isInternational =
        destinationCity.isInternational || sourceCity.isInternational;
      marketTypes.push(isInternational ? 'International' : 'Domestic');

      if (triptype.value === TripTypes.ROUND) {
        daysUntilDeparture.push(
          differenceInCalendarDays(arrivalDate, new Date()),
        );
        departureDates.push(format(arrivalDate, dateFormats.ddMMYYYY));
        sectors.push(`${destinationCityCode}-${sourceCityCode}`);
        airportCodePairs.push(airportCodePairs[0]);
        marketTypes = [isInternational ? 'International' : 'Domestic'];
      }
    });

    function getPayType() {
      if (isLoyaltyEnabled) {
        return {
          payType: payWith,
        };
      }
      return null;
    }

    const totalPax = seatWiseSelectedPaxInformation.totalCount;
    const adultPax = seatWiseSelectedPaxInformation.adultCount;
    const childPax = seatWiseSelectedPaxInformation.childrenCount;
    const infantPax = seatWiseSelectedPaxInformation.infantCount;
    const seniorPax = seatWiseSelectedPaxInformation.seniorCitizenCount;
    const doubleSeatSelected =
      seatWiseSelectedPaxInformation.adultExtraDoubleSeat +
      seatWiseSelectedPaxInformation.seniorCitizenExtraDoubleSeat +
      seatWiseSelectedPaxInformation.childrenExtraDoubleSeat;
    const tripleSeatSelected =
      seatWiseSelectedPaxInformation.adultExtraTripleSeat +
      seatWiseSelectedPaxInformation.childrenExtraTripleSeat +
      seatWiseSelectedPaxInformation.childrenExtraTripleSeat;

    const adobeAnalytics = {
      tripType: selectedJourneyType?.journeyTypeCode || '',
      airportCodePair: airportCodePairs.join('|'),
      sector: sectors.join('|'),
      departureDates: departureDates.join('|'),
      daysUntilDeparture: daysUntilDeparture.join('|'),
      currencyCode: selectedCurrency?.value || '',
      specialFare: selectedSpecialFare?.specialFareLabel || '',
      bookingPurpose: travellingFor,
      ...getPayType(),
      selectedPromoInfo,
      marketType: marketTypes.join('|'),
      totalPax: totalPax.toString(),
      adultPax: adultPax.toString(),
      childPax: childPax.toString(),
      infantPax: infantPax.toString(),
      seniorPax: seniorPax.toString(),
      doubleSeatSelected: doubleSeatSelected.toString(),
      tripleSeatSelected: tripleSeatSelected.toString(),
    };

    const loyaltyAnalytics = isLoyaltyEnabled ? {
      earn: payWith === PayWithModes.CASH ? '1' : '0',
      burn: payWith !== PayWithModes.CASH ? '1' : '0',
    } : { };

    const gtmAnalytics = {
      OD: adobeAnalytics.sector,
      trip_type: adobeAnalytics.tripType,
      pax_details: this.getPaxDetailsforGTM(),
      departure_date: adobeAnalytics.departureDates,
      special_fare: adobeAnalytics.specialFare,
      currency_code: adobeAnalytics.currencyCode,
      flight_sector: adobeAnalytics.marketType,
      coupon_code: adobeAnalytics.promotionalCode,
      days_until_departure: adobeAnalytics.daysUntilDeparture,
      recent_search: '1',
      site_section: 'Destination',
      line_of_business: 'Flight',
      double_seat_selected: doubleSeatSelected,
      triple_seat_selected: tripleSeatSelected,
      booking_purpose: adobeAnalytics.bookingPurpose,
      booking_mode: adobeAnalytics.bookingMode,
    };

    analyticsEvent({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.RECENT_SEARCH_CLICK,
      data: {
        eventInfo: {
          position: (index + 1).toString(),
        },
        productInfo: adobeAnalytics,
        ...(isLoyaltyEnabled ? { points: loyaltyAnalytics } : null),
      },
    });

    gtmPushAnalytic({
      event: GTM_ANALTYTICS.EVENTS.RECENT_SEARCH,
      data: gtmAnalytics,
    });
  }

  // pax_details: "6 | 2 SS | 2 ADT| 2 CHD | 1 INF ",
  getPaxDetailsforGTM = () => {
    const {
      totalCount,
      adultCount,
      childrenCount,
      infantCount,
      seniorCitizenCount,
    } = this.seatWiseSelectedPaxInformation;
    const values = [totalCount];

    if (seniorCitizenCount > 0) {
      values.push(`${seniorCitizenCount} SS`);
    }
    if (adultCount > 0) {
      values.push(`${adultCount} ADT`);
    }
    if (childrenCount > 0) {
      values.push(`${childrenCount} CHD`);
    }
    if (infantCount > 0) {
      values.push(`${infantCount} INF`);
    }

    return values.join('|');
  };
}

SearchItemModel.prototype.isRoundTrip = function () {
  return this.selectedJourneyType.value === TripTypes.ROUND;
};

SearchItemModel.prototype.isOneWay = function () {
  return this.selectedJourneyType.value === TripTypes.ONE_WAY;
};

SearchItemModel.prototype.isMultiCity = function () {
  return this.selectedJourneyType.value === TripTypes.MULTI_CITY;
};

SearchItemModel.prototype.setBwContext = function () {
  LocalStorage.set(localStorageKeys.bw_cntxt_val, this.localStorageValue);
};

export default SearchItemModel;
