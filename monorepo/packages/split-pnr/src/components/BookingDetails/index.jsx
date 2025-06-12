import React, { useMemo } from 'react';
import { getJourneyDetail } from '../../utils';

import useAppContext from '../../hooks/useAppContext';
import BookingInfo from '../BookingInfo';

function BookingDetails() {
  const { state: { main, api } } = useAppContext();
  const { pnrLabel, paxLabel, pnrStatus, codeShare } = main || {};
  const { bookingDetails, journeysDetail = [], passengers = [] } = api?.bookingInfo || {};

  if (!bookingDetails) return null;

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
}

export default BookingDetails;
