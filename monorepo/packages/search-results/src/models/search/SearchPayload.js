import { specialFareCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';

import add from 'date-fns/add';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { TripTypes, dateFormats } from '../../constants';
import { convertToDate, getCityName, isLoyalty as isLoyaltyFlow, isBurn } from '../../utils';

class SearchPayload {
  selectedJourneyType = null;

  payloadPromotionCode = '';

  seatWiseSelectedPaxInformation = {
    infantCount: 0,
    seniorCitizenCount: 0,
    totalCount: 0,
    adultCount: 0,
    childrenCount: 0,
  };

  selectedSpecialFare = null;

  isInternational = false;

  residentCountry = '';

  travellingFor = '';

  payWith = '';

  selectedPaxInformation = {
    types: [],
  };

  _segments = [];

  selectedTravelDatesInfo = {};

  selectedDatesFromCalender = [];

  isLoyalty = isLoyaltyFlow();

  criteriaArray = (obj) => {
    const {
      selectedSourceCityInfo,
      selectedDestinationCityInfo,
      selectedTravelDatesInfo,
      selectedMultiCityInfo,
    } = this;

    const { date, origin, destination, triptype } = obj;

    const getCriteria = (
      beginDate,
      originStationCodes,
      destinationStationCodes,
    ) => {
     const modifiedDate = beginDate instanceof Date
      ? `${beginDate.getFullYear()}-${(beginDate.getMonth() + 1)
          .toString().padStart(2, '0')}-${beginDate.getDate()
          .toString().padStart(2, '0')}`
      : beginDate;
      return ({
        dates: { beginDate: modifiedDate },
        flightFilters: { type: 'All' },
        stations: { originStationCodes, destinationStationCodes },
      });
    };

    let criteria = [];

    if (triptype === TripTypes.ONE_WAY) {
      const onwyBeginDate = date || selectedTravelDatesInfo?.startDate;
      criteria.push(
        getCriteria(
          format(onwyBeginDate, dateFormats.yyyyMMdd),
          [origin || selectedSourceCityInfo?.stationCode],
          [destination || selectedDestinationCityInfo?.stationCode],
        ),
      );
    } else {
      criteria.push(
        getCriteria(
          date || selectedTravelDatesInfo?.startDate,
          [origin || selectedSourceCityInfo?.stationCode],
          [destination || selectedDestinationCityInfo?.stationCode],
        ),
      );

      if (this.isRoundTrip()) {
        criteria.push(
          getCriteria(
            selectedTravelDatesInfo?.endDate,
            [selectedDestinationCityInfo?.stationCode],
            [selectedSourceCityInfo?.stationCode],
          ),
        );
      }

      if (this.isMulticityTrip()) {
        criteria = selectedMultiCityInfo.map((info) =>
          getCriteria(
            info.date,
            [info?.from?.stationCode],
            [info?.to?.stationCode],
          ),
        );
      }
    }

    return criteria;
  };

  getRequestpayload = (obj = {}) => {
    const {
      selectedCurrency,
      nationality,
      selectedPaxInformation,
      selectedJourneyType,
      payWith,
      isLoyalty,
    } = this;

    const criteria = this.criteriaArray(obj);

    return {
      codes: {
        currency: selectedCurrency?.value || 'INR',
        promotionCode: this.payloadPromotionCode,
      },
      criteria,
      passengers: {
        residentCountry: nationality?.countryCode || 'IN',
        types: selectedPaxInformation?.types,
      },
      taxesAndFees: 'TaxesAndFees',
      tripCriteria: selectedJourneyType?.value,
      ...(isLoyalty && {
        isRedeemTransaction: isBurn(payWith),
      }),
    };
  };

  getSegment() {
    if (this._segments.length > 0) {
      return this._segments;
    }
    const {
      selectedSourceCityInfo,
      selectedDestinationCityInfo,
      selectedTravelDatesInfo,
      selectedMultiCityInfo,
      selectedJourneyType,
    } = this;

    const startDate = new Date(selectedTravelDatesInfo?.startDate);

    if (!selectedJourneyType) {
      return [];
    }

    let segments = [
      {
        departureDate: startDate,
        selectedDate: startDate,
        minDate: this.minimumDateForFirstSegment(),
        originCityName: getCityName(selectedSourceCityInfo),
        origin: selectedSourceCityInfo?.stationCode,
        destinationCityName: getCityName(selectedDestinationCityInfo),
        destination: selectedDestinationCityInfo?.stationCode,
        id: 0,
        maxDate: add(new Date(), {
          years: 1,
        }),
        calenderSelectedDate: this.selectedDatesFromCalender[0],
      },
    ];

    if (this.isRoundTrip()) {
      segments[0].maxDate = add(new Date(), {
        years: 1,
      });
      segments.push({
        departureDate: new Date(selectedTravelDatesInfo?.endDate),
        selectedDate: new Date(selectedTravelDatesInfo?.endDate),
        minDate: new Date(selectedTravelDatesInfo?.startDate),
        originCityName: getCityName(selectedDestinationCityInfo),
        origin: selectedDestinationCityInfo?.stationCode,
        destinationCityName: getCityName(selectedSourceCityInfo),
        destination: selectedSourceCityInfo?.stationCode,
        maxDate: add(new Date(), {
          years: 1,
        }),
        id: 1,
        calenderSelectedDate: this.selectedDatesFromCalender[1],
      });
    }

    if (this.isMulticityTrip()) {
      segments = selectedMultiCityInfo.map((info, index, all) => {
        const prev = all[index - 1];
        const next = all[index + 1];

        return {
          departureDate: new Date(info.date),
          selectedDate: new Date(info.date),
          minDate: prev ? new Date(prev.date) : new Date(),
          maxDate: next
            ? new Date(next.date)
            : add(new Date(), {
                months: 2,
              }),
          originCityName: getCityName(info.from),
          origin: info.from?.stationCode,
          destinationCityName: getCityName(info.to),
          destination: info.to?.stationCode,
          id: index,
        };
      });
    }

    this._segments = segments;

    return this._segments;
  }

  isRoundTrip = () => {
    return this.selectedJourneyType?.value === TripTypes.ROUND;
  };

  isMulticityTrip = () => {
    return this.selectedJourneyType?.value === TripTypes.MULTI_CITY;
  };

  isOnewayTrip = () => {
    return this.selectedJourneyType?.value === TripTypes.ONE_WAY;
  };

  updateContext(newContext) {
    Object.assign(this, newContext);
    this._segments = [];

    this.selectedTravelDatesInfo.startDate = convertToDate(
      newContext?.selectedTravelDatesInfo?.startDate,
    );
    this.selectedDatesFromCalender[0] = this.selectedTravelDatesInfo.startDate;

    if (newContext?.selectedTravelDatesInfo?.endDate) {
      this.selectedTravelDatesInfo.endDate = convertToDate(
        newContext?.selectedTravelDatesInfo?.endDate,
      );

      this.selectedDatesFromCalender[1] = this.selectedTravelDatesInfo.endDate;
    }

    this.selectedTravelDatesInfo.minDate =
      this.selectedTravelDatesInfo.startDate;
  }

  isNoDataAvailable = () => {
    return this.selectedJourneyType === null;
  };

  minimumDateForFirstSegment() {
    const { selectedTravelDatesInfo, selectedSpecialFare } = this;

    const minDate =
      30 -
      differenceInCalendarDays(
        add(new Date(), { days: 29 }),
        selectedTravelDatesInfo?.startDate,
      );
    const d = new Date(selectedTravelDatesInfo?.minDate);

    if (selectedSpecialFare?.specialFareCode === specialFareCodes.VAXI) {
      const vaxiCondition = add(new Date(), { days: 7 });
      const diffDataFromVaxiCondition = differenceInCalendarDays(
        selectedTravelDatesInfo?.startDate,
        vaxiCondition,
      );
      return subDays(d, Math.min(diffDataFromVaxiCondition, minDate));
    }

    const differenceInDays = differenceInCalendarDays(d, new Date());

    return subDays(d, Math.min(differenceInDays, minDate));
  }

  // pax_details: "6 | 2 SS | 2 ADT| 2 CHD | 1 INF ",
  getPaxDetailsforGTM = () => {
    const { adultCount, childrenCount, seniorCitizenCount, infantCount } =
      this.seatWiseSelectedPaxInformation;
    const totalCount = adultCount + childrenCount + seniorCitizenCount;
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

  getFlightSectorType = () => {
    const analticStr = (isInt) => (isInt ? 'International' : 'Domestic');
    const {
      selectedSourceCityInfo,
      selectedDestinationCityInfo,
      selectedMultiCityInfo,
    } = this;

    let flightSectorTypes = [];
    const oneWaySectorStr = analticStr(selectedSourceCityInfo?.isInternational);
    flightSectorTypes.push(oneWaySectorStr);

    if (this.isRoundTrip()) {
      return analticStr(
        selectedDestinationCityInfo?.isInternational ||
          selectedSourceCityInfo?.isInternational,
      );
    }

    if (this.isMulticityTrip()) {
      flightSectorTypes = selectedMultiCityInfo?.map((info) =>
        analticStr(info?.from?.isInternational),
      );
    }

    return flightSectorTypes.join('|');
  };

  updateSearchContextFromCalender = (segments, resetRoundTrip) => {
    if (this.isRoundTrip()) {
      this.selectedTravelDatesInfo.endDate = segments[1].selectedDate;
      if (resetRoundTrip) {
        this.selectedDatesFromCalender[1] = segments[1].selectedDate;
        this._segments = [];
      }
    }

    this.selectedTravelDatesInfo.startDate = segments[0].selectedDate;
  };
}

SearchPayload.prototype.getTripType = function () {
  if (this.isRoundTrip()) {
    return 'RoundTrip';
  }
  if (this.isMulticityTrip()) {
    return 'MultiCity';
  }

  return 'OneWay';
};

export default SearchPayload;
