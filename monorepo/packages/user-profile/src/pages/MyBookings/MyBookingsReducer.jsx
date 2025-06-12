export const myBookingsActions = {
  SET_MY_BOOKINGS: 'SET_MY_BOOKINGS',
  SET_MY_HOTEL_BOOKINGS: 'SET_MY_HOTEL_BOOKINGS',
  SET_MY_BOOKINGS_AEM_DATA: 'SET_MY_BOOKINGS_AEM_DATA',
  SET_LOADER: 'SET_LOADER',
  SET_INIT_GET_BOOKING_CALL_STATUS: 'SET_INIT_GET_BOOKING_CALL_STATUS',
  SET_AUTH: 'SET_AUTH',
};

export const myBookingsReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case myBookingsActions.SET_MY_BOOKINGS: {
      return {
        ...state,
        myBookingsData: payload,
      };
    }

    case myBookingsActions.SET_MY_HOTEL_BOOKINGS: {
      return {
        ...state,
        myHotelBookingsData: payload,
      };
    }

    case myBookingsActions.SET_MY_BOOKINGS_AEM_DATA: {
      return {
        ...state,
        myBookingsAemData: payload,
      };
    }

    case myBookingsActions.SET_LOADER: {
      return {
        ...state,
        loader: payload,
      };
    }

    case myBookingsActions.SET_INIT_GET_BOOKING_CALL_STATUS: {
      return {
        ...state,
        initGetBookingDone: payload,
      };
    }
    
    case myBookingsActions.SET_AUTH: {
      return {
        ...state,
        isLoggedIn: payload,
      };
    }
    default:
      return state;
  }
};
