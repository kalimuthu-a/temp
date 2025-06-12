import parse from 'date-fns/parse';
import { specialFareCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import add from 'date-fns/add';
import subDays from 'date-fns/subDays';

import {
  TRIP_CRITERIA,
  TripTypes,
  dateFormats,
  localStorageKeys,
} from '../../constants';
import LocalStorage from '../../utils/LocalStorage';
import SearchPayload from './SearchPayload';

const convertToDate = (dateStr) => {
  if (!dateStr) {
    return new Date();
  }

  const dateWithoutTime = dateStr.split('T')?.[0];
  return parse(dateWithoutTime, dateFormats.yyyyMMdd, new Date());
};

class ChangeFlow extends SearchPayload {
  criteria;

  isModificationFlow = true;

  constructor() {
    super();

    const context = LocalStorage.getAsJson(localStorageKeys.c_m_d, {
      criteria: [],
    });
    const { criteria, tripCriteria, codes } = context;
    this.criteria = criteria;
    const lengthCriteria = criteria.length;

    if (lengthCriteria === 0) {
      return;
    }

    this.selectedTravelDatesInfo = {
      startDate: convertToDate(criteria[0].dates.beginDate),
      minDate: convertToDate(criteria[0].dates.beginDate),
    };

    this.selectedSourceCityInfo = {
      stationCode: criteria[0].stations.originStationCodes[0],
      city: criteria[0].stations.originCity,
    };

    this.selectedCurrency = { value: context?.codes?.currency || 'INR' };

    if (tripCriteria === TRIP_CRITERIA.ONE_WAY) {
      this.selectedDestinationCityInfo = {
        stationCode: criteria[0].stations.destinationStationCodes[0],
        city: criteria[0].stations.destinationCity,
      };

      this.selectedDatesFromCalender = [this.selectedTravelDatesInfo.startDate];
    } else {
      this.selectedDestinationCityInfo = {
        stationCode:
          criteria[lengthCriteria - 1].stations.originStationCodes[0],
        city: criteria[lengthCriteria - 1].stations.originCity,
      };
    }

    if (tripCriteria === TRIP_CRITERIA.ROUND_TRIP) {
      this.selectedTravelDatesInfo.endDate = convertToDate(
        criteria[1].dates.beginDate,
      );
      this.selectedDatesFromCalender = [
        this.selectedTravelDatesInfo.startDate,
        this.selectedTravelDatesInfo.endDate,
      ];
    }

    const journeyCriteriaMap = {
      OneWay: TripTypes.ONE_WAY,
      RoundTrip: TripTypes.ROUND,
      MultiCity: TripTypes.MULTI_CITY,
    };

    this.selectedJourneyType = {
      value: journeyCriteriaMap[tripCriteria],
    };

    this.selectedMultiCityInfo = criteria.map((info) => ({
      date: convertToDate(info.dates.beginDate),
      from: {
        stationCode: info.stations.originStationCodes[0],
        city: info.stations.originCity,
      },
      to: {
        stationCode: info.stations.destinationStationCodes[0],
        city: info.stations.destinationCity,
      },
    }));

    Object.assign(this, context);

    this.payloadPromotionCode = codes?.promotionCode ?? '';
  }

  getRequestpayload = (obj = {}) => {
    const criteria = this.criteriaArray(obj);

    return {
      codes: this.codes,
      originaljourney: this.originaljourney,
      passengers: this.passengers,
      criteria,
      taxesAndFees: 'TaxesAndFees',
      tripCriteria: 'OneWay',
    };
  };

  getSegment() {
    const segments = super.getSegment();

    if (this.isRoundTrip()) {
      return segments;
    }

    this._segments = segments.map((row, index) => {
      const daysRange = this.minimumDateForSegment(
        this.criteria[index]?.dates?.minDate,
        this.criteria[index]?.dates?.maxDate,
        row.departureDate,
      );

      return {
        ...this.criteria[index].dates,
        ...row,
        ...daysRange,
        nextDeparture: this.criteria[index]?.dates?.nextDeparture,
        prevArrival: this.criteria[index]?.dates?.prevArrival,
      };
    });

    return this._segments;
  }

  minimumDateForSegment(minDateStr, maxDateStr, departureDate) {
    const minDate = convertToDate(minDateStr);
    const maxDate = convertToDate(maxDateStr);
    const { selectedTravelDatesInfo, selectedSpecialFare } = this;

    const futureDays = differenceInCalendarDays(maxDate, departureDate);
    const pastDays = differenceInCalendarDays(departureDate, minDate);

    const days = 30 - Math.min(futureDays, 14);

    if (selectedSpecialFare?.specialFareCode === specialFareCodes.VAXI) {
      const vaxiCondition = add(new Date(), { days: 7 });
      const diffDataFromVaxiCondition = differenceInCalendarDays(
        selectedTravelDatesInfo?.startDate,
        vaxiCondition,
      );
      return subDays(days, Math.min(diffDataFromVaxiCondition, minDate));
    }

    return {
      minDate: subDays(departureDate, Math.min(pastDays, days)),
      maxDate,
    };
  }
}

export default ChangeFlow;
