import { PASSENGER_TYPE, PASSENGER_TYPE_NAME } from '../constants/constants';
import { padNumber } from '../helpers';
import { isValidAndNotFutureDate } from './checkFutureOrValidDate';
import getAgeMoment from './getAgeMoment';

// In this function we are sorting the fav favTraveller.
// If user has only adult, srcitizen in passengre list then savedpassenger should only display those passenger
const favTraveller = (passengers, favoriteTraveller, configurations, ssr) => {
  const travelDate = ssr?.[0]?.journeydetail?.departure;
  const paxTypeCode = passengers?.map((pax) => {
    return pax.passengerTypeCode;
  });
  const sortedFavTraveller = favoriteTraveller
    ?.map((obj) => {
      const favPax = obj;
      if (
        favPax?.type?.toLowerCase()
        === PASSENGER_TYPE_NAME.ADULT.toLowerCase()
      ) favPax.type = PASSENGER_TYPE.ADULT;
      if (
        favPax?.type?.toLowerCase()
        === PASSENGER_TYPE_NAME.CHILD.toLowerCase()
      ) favPax.type = PASSENGER_TYPE.CHILD;
      if (
        favPax?.type?.toLowerCase()
        === PASSENGER_TYPE_NAME.INFANT.toLowerCase()
      ) favPax.type = PASSENGER_TYPE.INFANT;
      return favPax;
    })
    ?.filter((obj) => paxTypeCode.includes(obj.type));

  const sortedWithSrctTag = sortedFavTraveller?.map((pax) => {
    const passenger = pax;
    const birthString = `${padNumber(pax.dobDay)}-${padNumber(pax.dobMonth)}-${padNumber(pax.dobYear, 4)}`;
    const isValidDate = isValidAndNotFutureDate(birthString);
    const paxAge = isValidDate ? getAgeMoment(birthString, travelDate) : 0;
    if (configurations?.srctCount && paxAge >= 60) passenger.isSrct = true;
    return passenger;
  });

  return sortedWithSrctTag?.filter((item) => {
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (
      (configurations?.srctCount
        && item.isSrct
        && item.type === PASSENGER_TYPE.ADULT)
      || (configurations?.adultCount
        && item.type === PASSENGER_TYPE.ADULT)
      || (configurations?.childCount
        && !item.isSrct
        && item.type === PASSENGER_TYPE.CHILD)
    ) {
      return true;
    }
    return false;
  });
};

export default favTraveller;
