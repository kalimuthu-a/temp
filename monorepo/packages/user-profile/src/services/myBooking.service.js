import { API_LIST } from '.';
import getSessionToken from '../utils/getSessionToken';

// eslint-disable-next-line import/prefer-default-export
/**
 *
 * @param {*} searchFilter - 0 means current bookings, 1 means past bookings, 3 means for help page required 3 result
 * @returns
 */
export const getMyBookings = async (searchFilter = 0, pageLastIndex, isAgent = false, PAGINATION_SIZE = 50) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY_GET_MY_BOOKINGS,
    },
  };

  try {
    const startTimer = performance.now();
    const apiUrl = new URL(API_LIST.GET_MY_BOOKINGS);
    const params = new URLSearchParams();

    // Conditionally add query parameters
    if (searchFilter >= 0) {
      params.set('BookingSearchFilter', searchFilter);
    }

    if (pageLastIndex >= 0 && isAgent) {
      params.set('LastIndex', pageLastIndex * PAGINATION_SIZE);
      params.set('PageSize', PAGINATION_SIZE);
    }

    apiUrl.search = params.toString();

    const response = await fetch(apiUrl.toString(), config);
    const myBookingsResData = {
      url: response.url,
      status: (await response).status,
      responseTime: (performance.now() - startTimer) / 1000,
    };
    const myBookingsData = await response.json();
    if (myBookingsData.errors) {
      // error handeling
    } else {
      return myBookingsData.data;
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const getMyBookingsAemData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST.AEM_MY_BOOKINGS, config);
    const data = await response.json();
    return data?.data?.myBookingsByPath?.item;
  } catch (e) {
    console.log(e);
  }
};

export const getMyHotelBookings = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY_GET_MY_HOTEL_BOOKINGS,
    },
  };

  try {
    const apiUrl = new URL(API_LIST.GET_MY_HOTEL_BOOKINGS);
    const response = await fetch(apiUrl.toString(), config);
    const myHotelBookingsData = await response.json();
    if (myHotelBookingsData.errors) {
      // error handling
      console.log('error myHotelBookingsData API', myHotelBookingsData.errors);
      return null;
    }
    return myHotelBookingsData.data;
  } catch (error) {
    console.log('error', error);
  }
};
