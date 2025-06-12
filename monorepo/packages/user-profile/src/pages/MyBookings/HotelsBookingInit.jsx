import React, { useContext, useEffect } from 'react';
import './MyBookings.scss';
import HotelsBooking from './HotelsBooking/HotelsBooking';
import MyBookingsContext from './MyBookingsContext';

const MyHotelBookings = () => {
  return (
    <div className="my-bookings">
      <HotelsBooking />
    </div>
  );
};

export default MyHotelBookings;
