import { specialFareCodes } from '../constants';
import { isBefore7Days } from '.';

export const checkVaxiSpecialFareDisabled = (fare, departureDate, advancePurchaseDays) => {
  const isBefore7DaysDate = isBefore7Days(departureDate, advancePurchaseDays);

  return isBefore7DaysDate && fare.specialFareCode === specialFareCodes.VAXI;
};

export const specialFareListForContext = (
  specialFares,
  journies,
  journeyTypeCode,
) => {
  const { departureDate } = journies[0];

  const isInternational = journies.some((journey) => {
    return (
      journey?.destinationCity?.isInternational ||
      journey?.sourceCity?.isInternational
    );
  });

  const _specialFares = specialFares.map((row) => {
    const data = specialFares?.filter(
      (item) => item.specialFareCode === specialFareCodes.VAXI,
    );

    return {
      ...row,
      disabled:
        !row.journeyTypesAllowed.includes(journeyTypeCode) ||
        checkVaxiSpecialFareDisabled(row, departureDate, data?.[0]?.bookingAllowedAfterDays) ||
        (isInternational && !row.internationalAllowed),
    };
  });

  return { specialFaresList: _specialFares, isInternational };
};
