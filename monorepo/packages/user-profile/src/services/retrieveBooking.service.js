import { URLS } from '../constants';
import request from '../utils/request';
import { GET_ITINERARY_DATA } from '../constants/common';

const retrieveBooking = (data) => {
  const retrieveUrl = URLS.GET_RETRIEVE_BOOKING_API;
  const url = new URL(retrieveUrl);
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      url.searchParams.append(key, element);
    }
  }

  return request(
    url.href,
    {
      headers: {
        user_key: URLS.USER_KEY_RETRIEVE_BOOKING,
      },
    },
    {
      errorAction: 'Click',
    },
    GET_ITINERARY_DATA,
  );
};
export default retrieveBooking;
