import { FEMALE_TITLE, MALE_GENDER_TYPE, MALE_TITLE } from '../constants/constants';
import { getDayMonthAndYear } from '../helpers';

const favTravellerPayload = (pax) => {
  return pax?.map((item) => {
    const { day, month, year } = getDayMonthAndYear(item?.info?.dateOfBirth);
    return {
      type: item?.passengerTypeCode,
      title: item?.gender === MALE_GENDER_TYPE ? MALE_TITLE : FEMALE_TITLE,
      firstname: item?.name?.first,
      lastname: item?.name?.last,
      dobDay: day ? `${day}` : '00',
      dobMonth: month ? `${month}` : '00',
      dobYear: year ? `${year}` : '00',
    };
  });
};

export default favTravellerPayload;
