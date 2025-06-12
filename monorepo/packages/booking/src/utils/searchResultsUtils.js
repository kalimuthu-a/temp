/* eslint-disable implicit-arrow-linebreak */
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import format from 'date-fns/format';
import { dateFormats, discountCodes } from '../constants';

export const createSelectedPaxInformation = (type, discountCode, count) => {
  return {
    count,
    discountCode,
    type,
  };
};

export const generateSearchResultPayload = (formData) => {
  const { triptype, journies, nationality, paxInfo, travellingFor, payWith, promocode } =
    formData;

  const { SRCT, ADT, CHD, INFT } = paxInfo;

  const value = {
    nationality: nationality?.countryCode ? nationality : null,
    seatWiseSelectedPaxInformation: {
      adultCount: ADT.Count,
      childrenCount: CHD.Count,
      seniorCitizenCount: SRCT.Count,
      infantCount: INFT.Count,
      adultExtraDoubleSeat: ADT.ExtraDoubleSeat,
      adultExtraTripleSeat: ADT.ExtraTripleSeat,
      seniorCitizenExtraDoubleSeat: SRCT.ExtraDoubleSeat,
      seniorCitizenExtraTripleSeat: SRCT.ExtraTripleSeat,
      childrenExtraDoubleSeat: CHD.ExtraDoubleSeat,
      childrenExtraTripleSeat: CHD.ExtraTripleSeat,
      totalAllowedCount: 0,
      totalCount: SRCT.Count + ADT.Count + CHD.Count,
    },
    selectedCurrency: {
      label: formData.currency.currencySymbol,
      value: formData.currency.currencyCode,
    },
    selectedDestinationCityInfo: formData.journies[0].destinationCity,
    selectedJourneyType: triptype,
    selectedPromoInfo: promocode ? promocode.code || promocode.card : '',
    selectedSourceCityInfo: formData.journies[0].sourceCity,
    selectedPromoNav: promocode ? promocode.indigoCode || promocode.card : '',
    couponUseCode: promocode.couponUseCode,
    selectedSpecialFare: formData.selectedSpecialFare,
    selectedTravelDatesInfo: {
      startDate: format(
        formData.journies[0].departureDate,
        dateFormats.yyyyMMdd,
      ),
      ...(triptype.value === TripTypes.ROUND && {
        endDate: format(formData.journies[0].arrivalDate, dateFormats.yyyyMMdd),
      }),
    },
    selectedVaccineDose: formData.vaccineDose,
    id: uniq(),
    selectedPaxInformation: {
      types: [],
    },
    travellingFor,
    payWith,
    selectedMultiCityInfo:
      triptype.value !== TripTypes.MULTI_CITY
        ? null
        : journies.map((journey) => ({
            ...journey,
            date: format(journey.departureDate, dateFormats.yyyyMMdd),
            departureDate: format(journey.departureDate, dateFormats.yyyyMMdd),
            from: journey.sourceCity,
            to: journey.destinationCity,
            minDate: format(journey.minDate, dateFormats.yyyyMMdd),
            maxDate: format(journey.maxDate, dateFormats.yyyyMMdd),
          })),
  };

  // Adult
  if (ADT.Count) {
    value.selectedPaxInformation.types.push(
      createSelectedPaxInformation('ADT', '', ADT.Count),
    );
  }

  // Senior Citizen
  if (SRCT.Count) {
    value.selectedPaxInformation.types.push(
      createSelectedPaxInformation('ADT', 'SRCT', SRCT.Count),
    );
  }

  // CHildren
  if (CHD.Count) {
    value.selectedPaxInformation.types.push(
      createSelectedPaxInformation('CHD', '', CHD.Count),
    );
  }

  // Infant
  if (INFT.Count) {
    value.selectedPaxInformation.types.push(
      createSelectedPaxInformation('INFT', '', INFT.Count),
    );
  }

  // Double Seat
  const allDoubleSeat =
    ADT.ExtraDoubleSeat + SRCT.ExtraDoubleSeat + CHD.ExtraDoubleSeat;
  if (allDoubleSeat) {
    value.selectedPaxInformation.types.push(
      createSelectedPaxInformation(
        'ADT',
        discountCodes.DOUBLE_SEAT,
        allDoubleSeat,
      ),
    );
  }

  // Tripe Seat
  const allTripleSeat =
    ADT.ExtraTripleSeat + SRCT.ExtraTripleSeat + CHD.ExtraTripleSeat;
  if (allTripleSeat) {
    value.selectedPaxInformation.types.push(
      createSelectedPaxInformation(
        'ADT',
        discountCodes.TRIPLE_SEAT,
        allTripleSeat,
      ),
    );
  }

  return value;
};

// pax_details: "6 | 2 SS | 2 ADT| 2 CHD | 1 INF ",
export const getPaxDetailsforGTM = (seatWiseSelectedPaxInformation) => {
  const {
    totalCount,
    adultCount,
    childrenCount,
    infantCount,
    seniorCitizenCount,
  } = seatWiseSelectedPaxInformation;
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
