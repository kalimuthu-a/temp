import React, { useEffect, useState } from 'react';
import UserIdentity from 'skyplus-design-system-app/src/functions/UserIdentity';

import { getBookings } from '../../services';
import WithPageLoader from '../../hoc/withPageLoader';
import useAppContext from '../../hooks/useAppContext';
import { webcheckinActions } from '../../context/reducer';
import FlightCard from '../../components/FlightCard/FlightCard';
import gtmEvent from '../../utils/gtmEvents';

import { GTM_ANALTYTICS } from '../../constants';

const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [loggedin, setLoggedin] = useState(
    () => !UserIdentity.isAnonymousUser(),
  );

  const { dispatch } = useAppContext();

  useEffect(() => {
    gtmEvent({
      event: GTM_ANALTYTICS.EVENTS.WEB_CHECK_HOME_PAGE_LOAD,
      data: {
        currency_code: '',
        OD: '',
        trip_type: '',
        pax_details: '',
        departure_date: '',
        special_fare: '',
        flight_sector: '',
        days_until_departure: '',
      },
    });

    const myBookings = async () => {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });

      try {
        const response = await getBookings();

        setBookings(response.data);
      } catch (error) {
        // Error Handling
      }

      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
    };

    if (loggedin) {
      myBookings();
    } else {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
    }

    UserIdentity.subscribeToLogin(() => {
      myBookings();
      setLoggedin(true);
    });

    UserIdentity.subscribeToLogout(() => {
      setBookings([]);
      setLoggedin(false);
    });
  }, []);

  if (!loggedin || bookings.length === 0) {
    return null;
  }

  return bookings.map((booking) => (
    // this condition is to hide hold and pay later card
    !(booking?.bookingStatus === 1 && (booking?.paymentStatus === 2 || booking?.paymentStatus === 4)) ?
      <FlightCard key={booking.journeyKey} booking={booking} />
      : null
  ));
};

Home.propTypes = {};

export default WithPageLoader(Home);
