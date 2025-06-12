import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getJourneyDetail } from '../../utils';

import useAppContext from '../../hooks/useAppContext';
import BookingInfo from '../BookingInfo';

const SplitPnrBookingDetails = ({ splitPnrBooking }) => {
  const {
    state: { main },
  } = useAppContext();

  const { pnrLabel, paxLabel, pnrStatus, codeShare } = main || {};
  const {
    bookingDetails = {},
    journeysDetail = [],
    passengers = [],
  } = splitPnrBooking || {};
  const [journeyDetailFlightDate, sectors] = useMemo(() => getJourneyDetail(journeysDetail || []), [journeysDetail]);

  return (
    <BookingInfo
      bookingDetails={bookingDetails}
      passengerListArray={passengers}
      journeyDetailFlightDate={journeyDetailFlightDate}
      sectors={sectors}
      pnrStatus={pnrStatus}
      pnrLabel={pnrLabel}
      paxLabel={paxLabel}
      codeShare={codeShare}
    />
  );
};

SplitPnrBookingDetails.propTypes = {
  splitPnrBooking: PropTypes.shape({
    bookingDetails: PropTypes.shape({}),
    journeysDetail: PropTypes.array,
    passengers: PropTypes.array,
  }),
};

export default SplitPnrBookingDetails;
