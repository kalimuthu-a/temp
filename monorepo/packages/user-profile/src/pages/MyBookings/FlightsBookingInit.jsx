import React, { useContext, useEffect } from 'react';
import { getMyBookings, getMyBookingsAemData, getMyHotelBookings } from '../../services/myBooking.service';
import MyBookingsContext from './MyBookingsContext';
import { myBookingsActions } from './MyBookingsReducer';
import './MyBookings.scss';
import FlightsBooking from './FlightsBooking/FlightsBooking';
import { MY_BOOKING_STATIC_ID } from '../../constants/common';
import Loader from '../../components/common/Loader/Loader';

const MyBookings = () => {
  const {
    state: {
      isLoggedIn,
      loader,
    },
    dispatch,
  } = useContext(MyBookingsContext);

  useEffect(() => {
    if (isLoggedIn) {
      document.getElementById(MY_BOOKING_STATIC_ID).style.display = 'none';
    }
  }, [isLoggedIn]);

  const setInitMyBookingData = async () => {
    dispatch({
      type: myBookingsActions.SET_LOADER,
      payload: true,
    });
    const getMyHotelBookingsData = await getMyHotelBookings();
    dispatch({
      type: myBookingsActions.SET_MY_HOTEL_BOOKINGS,
      payload: getMyHotelBookingsData,
    });
    dispatch({
      type: myBookingsActions.SET_INIT_GET_BOOKING_CALL_STATUS,
      payload: true,
    });
    const getMyBookingsAemLabels = await getMyBookingsAemData();
    dispatch({
      type: myBookingsActions.SET_MY_BOOKINGS_AEM_DATA,
      payload: getMyBookingsAemLabels,
    });
    dispatch({
      type: myBookingsActions.SET_LOADER,
      payload: false,
    });
  };

  useEffect(() => {
    setInitMyBookingData();
  }, []);

  return (
    <div className="my-bookings">
      <div>{loader ? <Loader /> : null}</div>
      <FlightsBooking />
    </div>
  );
};

export default MyBookings;
