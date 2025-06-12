import React from 'react';

import HotelStrip from './HotelStrip';
import { HOTEL_STRIPS_DETAILS } from '../../constants';
import { hotelAPI, hotelRecommendations } from './mock';

export default {
  title: 'Skyplus/HotelStrip',
  component: HotelStrip,
};

export const Default = () => {
  const props = {
    hotelList: hotelAPI?.data?.data?.response,
    arrivalCityName: 'Delhi',
    isBookingFlow: true,
    isModificationFlow: false,
    isCancelFlightFlow: false,
    showMoreUrl: 'https://www.goindigo.in/',
    hotelRecommendations,
    stripType: HOTEL_STRIPS_DETAILS.HOTEL_TRAVELTIPS_VARIATION.HOTELSTRIP,
  };

  return (
    <div>
      <HotelStrip {...props} />
    </div>
  );
};
