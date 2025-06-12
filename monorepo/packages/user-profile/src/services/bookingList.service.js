import getSessionToken from '../utils/getSessionToken';
import { URLS } from '../constants';
import request from '../utils/request';

export const getBookingList = async (searchFilterParam) => {
  try {
    return await request(`${URLS.GET_BOOKING_LIST_API}?BookingSearchFilter=${searchFilterParam}`, {
      headers: {
        user_key: URLS.USER_KEY_BOOKING_LIST,
        Authorization: getSessionToken(),
      },
    }).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
};
