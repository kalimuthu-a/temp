import {
  Pages,
  TripTypes,
  specialFareCodes,
  paxCodes,
  PayWithModes,
} from 'skyplus-design-system-app/src/functions/globalConstants';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import add from 'date-fns/add';
import parse from 'date-fns/parse';
import upperFirst from 'lodash/upperFirst';
import format from 'date-fns/format';
import { getPaxTypes } from '../constants/form';
import LocalStorage from '../utils/LocalStorage';
import { dateFormats, localStorageKeys } from '../constants';
import { getMaxDateForCalendar } from '../utils';
import { getCurrencySymbol } from '../utils/functions';

const convertToDate = (dateStr) => {
  if (!dateStr) {
    return new Date();
  }

  const dateWithoutTime = dateStr.split('T')?.[0];
  return parse(dateWithoutTime, dateFormats.yyyyMMdd, new Date());
};

class ModificationModel {
  currency = {
    currencyCode: 'INR',
    currencySymbol: '₹',
  };

  nationality = '';

  triptype = { value: TripTypes.ONE_WAY, journeyTypeCode: 'OneWay' };

  vaccineDose = '';

  travellingFor = '';

  payWith = PayWithModes.CASH;

  journies = [
    {
      destinationCity: null,
      sourceCity: null,
      isNationalityPopup: false,
      departureDate: add(new Date(), { days: 1 }),
      arrivalDate: null,
      minDate: new Date(),
      key: uniq(),
      maxDate: getMaxDateForCalendar(),
    },
  ];

  selectedSpecialFare = null;

  promocode = {
    code: '',
    error: '',
    success: false,
    card: '',
  };

  isModificationFlow = false;

  modificationContext = {};

  bookingContext = {};

  airportsData = [];

  seatWiseSelectedPaxInformation = {};

  specialFareDate = 0;

  constructor({
    pageType,
    airportsData = [],
    activeCurrencyModel = [],
    tripTypes = [],
    specialFares = [],
    startDate,
  }) {
    this.pageType = pageType;
    this.isModificationFlow = pageType === Pages.FLIGHT_SELECT_MODIFICATION;
    this.specialFareDate = startDate;
    if (this.isModificationFlow) {
      this.modificationContext = LocalStorage.getAsJson(
        localStorageKeys.c_m_d,
        {},
      );
      const fareCodeData = this.modificationContext?.codes?.promotionCode;
      const [selectedFare] = specialFares.filter((item) => item.specialfarecode === fareCodeData);
      this.selectedSpecialFare = selectedFare;
      const { codes, tripCriteria, passengers } = this.modificationContext;
      const { currency } = codes;

      const selectedCurrency = activeCurrencyModel.find(
        (r) => r.currencyCode === currency,
      );
      this.selectedCurrency = {
        label: getCurrencySymbol(currency),
        value: selectedCurrency?.currencyCode,
      };

      this.airportsData = airportsData;
      this.selectedJourneyType = tripTypes.find(
        (row) => row.journeyTypeCode === tripCriteria,
      );

      const adultCount = passengers?.types
        ?.filter((r) => r.type !== paxCodes.infant.code)
        ?.reduce((a, b) => a + b.count, 0);

      this.seatWiseSelectedPaxInformation = {
        adultCount,
        childrenCount: 0,
        seniorCitizenCount: 0,
        infantCount: 0,
        adultExtraDoubleSeat: 0,
        adultExtraTripleSeat: 0,
        seniorCitizenExtraDoubleSeat: 0,
        seniorCitizenExtraTripleSeat: 0,
        childrenExtraDoubleSeat: 0,
        childrenExtraTripleSeat: 0,
        totalAllowedCount: 0,
        totalCount: adultCount,
      };
    } else if (pageType === Pages.XPLORE) {
      const bookingContext = LocalStorage.getAsJson(
        localStorageKeys.bw_cntxt_val,
        {},
      );
      if (Object.keys(bookingContext).length < 1) {
        const sourceCity = this.airportsData?.find(
          (r) => r.stationCode === 'DEL', // default value for Xplore page
        );
        const initialBwCntxt = {
          nationality: null,
          seatWiseSelectedPaxInformation: {
            adultCount: 1,
            childrenCount: 0,
            seniorCitizenCount: 0,
            infantCount: 0,
            adultExtraDoubleSeat: 0,
            adultExtraTripleSeat: 0,
            seniorCitizenExtraDoubleSeat: 0,
            seniorCitizenExtraTripleSeat: 0,
            childrenExtraDoubleSeat: 0,
            childrenExtraTripleSeat: 0,
            totalAllowedCount: 0,
            totalCount: 1,
          },
          selectedCurrency: this.currency,
          selectedDestinationCityInfo: {},
          selectedJourneyType: this.triptype,
          selectedPromoInfo: '',
          selectedSourceCityInfo: sourceCity,
          selectedPromoNav: '',
          couponUseCode: [],
          selectedSpecialFare: null,
          selectedTravelDatesInfo: {
            startDate: format(
              add(new Date(), { days: 1 }),
              dateFormats.yyyyMMdd,
            ),
          },
          selectedVaccineDose: '',
          selectedPaxInformation: {
            types: [
              {
                count: 1,
                discountCode: '',
                type: paxCodes?.adult?.code,
              },
            ],
          },
          travellingFor: '',
          selectedMultiCityInfo: null,
        };
        Object.assign(this, initialBwCntxt);
      } else {
        Object.assign(this, bookingContext);

        this.selectedMultiCityInfo = bookingContext.selectedMultiCityInfo?.map(
          (row) => ({
            ...row,
            departureDate: convertToDate(row.departureDate),
            maxDate: convertToDate(row.maxDate),
            minDate: convertToDate(row.minDate),
          }),
        );
      }
    } else {
      const bookingContext = LocalStorage.getAsJson(
        localStorageKeys.bw_cntxt_val,
        {},
      );

      Object.assign(this, bookingContext);

      this.selectedMultiCityInfo = bookingContext?.selectedMultiCityInfo?.map(
        (row) => ({
          ...row,
          departureDate: convertToDate(row.departureDate || row.date),
          maxDate: convertToDate(row.maxDate),
          minDate: convertToDate(row.minDate),
        }),
      );
    }
  }

  getJournies = () => {
    if (this.isModificationFlow) {
      const { criteria = [], tripCriteria } = this.modificationContext;
      let criteriaArray = [];

      criteriaArray = criteria.map((c) => {
        const { dates, stations } = c;
        const { originStationCodes, destinationStationCodes } = stations;

        const destinationCity = this.airportsData.find(
          (r) => r.stationCode === destinationStationCodes[0],
        );
        const sourceCity = this.airportsData.find(
          (r) => r.stationCode === originStationCodes[0],
        );

        return {
          destinationCity,
          sourceCity,
          isNationalityPopup: false,
          departureDate: convertToDate(dates.beginDate),
          arrivalDate: null,
          minDate: add(new Date(), { days: this.specialFareDate }),
          key: uniq(),
          maxDate: convertToDate(dates.maxDate),
        };
      });

      if (tripCriteria === 'RoundTrip') {
        criteriaArray[0].arrivalDate = criteriaArray[1].departureDate;
        criteriaArray[0].maxDate = getMaxDateForCalendar();
        // criteriaArray[0].maxReturnDate = criteriaArray[1].maxDate;
        return criteriaArray.slice(0, 1);
      }

      return criteriaArray;
    }

    const {
      selectedMultiCityInfo,
      selectedDestinationCityInfo,
      selectedSourceCityInfo,
      selectedTravelDatesInfo,
      selectedSpecialFare,
      selectedJourneyType,
    } = this;

    if (!selectedJourneyType) {
      return [];
    }

    return this.isMultiCity()
      ? selectedMultiCityInfo.map((row) => ({
          sourceCity: row.from,
          destinationCity: row.to,
          ...row,
          maxDate: getMaxDateForCalendar(),
        }))
      : [
          {
            destinationCity: selectedDestinationCityInfo,
            sourceCity: selectedSourceCityInfo,
            isNationalityPopup: false,
            departureDate: convertToDate(selectedTravelDatesInfo.startDate),
            arrivalDate: this.isRoundTrip()
              ? convertToDate(selectedTravelDatesInfo.endDate)
              : null,
            minDate:
              selectedSpecialFare?.specialfarecode === specialFareCodes.VAXI
                ? add(new Date(), { days: this.specialFareDate })
                : new Date(),
            key: uniq(),
            maxDate: getMaxDateForCalendar(),
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
    } = this;
    let { selectedPromoInfo = '' } = this;
    const { selectedPromoNav = '', couponUseCode = [] } = this;
    // let { selectedPromoInfo = '' } = this;

    // Coming From Meta
    if (selectedJourneyType.icon_id) {
      selectedJourneyType.journeyTypeCode = upperFirst(
        selectedJourneyType.value,
      );
    }

    const paxInfo = getPaxTypes(selectedSpecialFare?.specialFareCode);

    paxInfo.ADT = {
      ...paxInfo.ADT,
      Count: seatWiseSelectedPaxInformation.adultCount,
      ExtraDoubleSeat: seatWiseSelectedPaxInformation.adultExtraDoubleSeat,
      ExtraTripleSeat: seatWiseSelectedPaxInformation.adultExtraTripleSeat,
      maxExtraDoubleSeat:
        seatWiseSelectedPaxInformation.adultCount -
        seatWiseSelectedPaxInformation.adultExtraTripleSeat,
      maxExtraTripleSeat:
        seatWiseSelectedPaxInformation.adultCount -
        seatWiseSelectedPaxInformation.adultExtraDoubleSeat,
    };

    paxInfo.CHD = {
      ...paxInfo.CHD,
      Count: seatWiseSelectedPaxInformation.childrenCount,
      ExtraDoubleSeat: seatWiseSelectedPaxInformation.childrenExtraDoubleSeat,
      ExtraTripleSeat: seatWiseSelectedPaxInformation.childrenExtraTripleSeat,
      maxExtraDoubleSeat:
        seatWiseSelectedPaxInformation.childrenCount -
        seatWiseSelectedPaxInformation.childrenExtraTripleSeat,
      maxExtraTripleSeat:
        seatWiseSelectedPaxInformation.childrenCount -
        seatWiseSelectedPaxInformation.childrenExtraDoubleSeat,
    };

    paxInfo.SRCT = {
      ...paxInfo.SRCT,
      Count: seatWiseSelectedPaxInformation.seniorCitizenCount,
      ExtraDoubleSeat:
        seatWiseSelectedPaxInformation.seniorCitizenExtraDoubleSeat,
      ExtraTripleSeat:
        seatWiseSelectedPaxInformation.seniorCitizenExtraTripleSeat,
      maxExtraDoubleSeat:
        seatWiseSelectedPaxInformation.seniorCitizenCount -
        seatWiseSelectedPaxInformation.seniorCitizenExtraTripleSeat,
      maxExtraTripleSeat:
        seatWiseSelectedPaxInformation.seniorCitizenCount -
        seatWiseSelectedPaxInformation.seniorCitizenExtraDoubleSeat,
    };

    paxInfo.INFT = {
      ...paxInfo.INFT,
      Count: seatWiseSelectedPaxInformation.infantCount,
      maxCount: Math.min(
        seatWiseSelectedPaxInformation.adultCount +
          seatWiseSelectedPaxInformation.seniorCitizenCount,
        4,
      ),
      maxAllowed: 4,
    };

    const journies = this.getJournies();

    const deepLinkPromoCode = sessionStorage.getItem('deepLinkPromoCode');
    if (deepLinkPromoCode) {
      const { value } = JSON.parse(deepLinkPromoCode);
      if (value?.promoCode === selectedPromoInfo) {
        selectedPromoInfo = '';
      }
    }

    this.selectedPromoInfo = selectedPromoInfo;
    this.selectedPromoNav = selectedPromoNav;
    this.couponUseCode = couponUseCode;
    return {
      currency: {
        currencyCode: selectedCurrency?.value,
        currencySymbol: getCurrencySymbol(selectedCurrency?.value),
      },
      nationality: nationality?.countryCode ? nationality : {},
      triptype: selectedJourneyType,
      paxInfo,
      vaccineDose: '',
      travellingFor,
      payWith: this.payWith || '',
      journies,
      selectedSpecialFare,
      promocode: {
        code: selectedPromoInfo,
        error: '',
        success: Boolean(selectedPromoInfo),
        indigoCode: this.selectedPromoNav,
        card: selectedPromoInfo,
        couponUseCode,
      },
    };
  }
}

ModificationModel.prototype.isRoundTrip = function () {
  return this.selectedJourneyType?.value === TripTypes.ROUND;
};

ModificationModel.prototype.isOneWay = function () {
  return this.selectedJourneyType?.value === TripTypes.ONE_WAY;
};

ModificationModel.prototype.isMultiCity = function () {
  return this.selectedJourneyType?.value === TripTypes.MULTI_CITY;
};

export default ModificationModel;
