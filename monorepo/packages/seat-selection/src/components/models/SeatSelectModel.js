import format from 'date-fns/format';

import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { dateFormats } from '../../constants';

class SeatSelectModel {
  journeyinfo;

  count;

  date;

  journeryCities;

  dateInfo = '';

  journeyDateWithFormat;

  constructor(obj) {
    Object.assign(this, obj);

    const {
      selectedSourceCityInfo,
      selectedDestinationCityInfo,
      seatWiseSelectedPaxInformation,
      selectedTravelDatesInfo,
    } = obj;

    this.journeyinfo = `${selectedSourceCityInfo.stationCode} - ${selectedDestinationCityInfo.stationCode}`;
    this.journeyCities = `${selectedSourceCityInfo.shortName} - ${selectedDestinationCityInfo.shortName}`;
    const { adultCount, childrenCount, seniorCitizenCount } = seatWiseSelectedPaxInformation || {};

    this.count = (adultCount || 0)
      + (childrenCount || 0)
      + (seniorCitizenCount || 0);

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
  }

  getJournies = () => {
    const {
      selectedMultiCityInfo,
      selectedDestinationCityInfo,
      selectedSourceCityInfo,
      selectedTravelDatesInfo,
    } = this;
    return this.isMultiCity()
      ? selectedMultiCityInfo
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
      selectedJourneyType,
      selectedCurrency,
      nationality,
      selectedSpecialFare,
      travellingFor,
      payWith,
      selectedPromoInfo,
    } = this;

    const journies = this.getJournies();

    return {
      currency: {
        currencyCode: selectedCurrency.value,
        currencySymbol: selectedCurrency.label,
      },
      nationality: {
        countryCode: nationality,
        name: '',
      },
      triptype: selectedJourneyType,
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

// eslint-disable-next-line func-names
SeatSelectModel.prototype.isRoundTrip = function () {
  return this.selectedJourneyType.value === TripTypes.ROUND;
};

// eslint-disable-next-line func-names
SeatSelectModel.prototype.isOneWay = function () {
  return this.selectedJourneyType.value === TripTypes.ONE_WAY;
};

// eslint-disable-next-line func-names
SeatSelectModel.prototype.isMultiCity = function () {
  return this.selectedJourneyType.value === TripTypes.MULTI_CITY;
};

export default SeatSelectModel;
