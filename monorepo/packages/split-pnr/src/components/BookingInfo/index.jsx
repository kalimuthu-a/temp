/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import BookingInfoHeader from './BookingInfoHeader';
import BookingInfoContainer from './BookingInfoContainer';

const BookingInfo = ({
  sectors,
  bookingDetails,
  codeShare,
  partnerPnrBookingLabel,
  pnrLabel,
  pnrStatus,
  journeyDetailFlightDate,
  passengerListArray,
  paxLabel,
}) => (
  <div className="split_pnr--booking-info">
    <BookingInfoHeader sectors={sectors} />
    <BookingInfoContainer
      bookingDetails={bookingDetails}
      codeShare={codeShare}
      partnerPnrBookingLabel={partnerPnrBookingLabel}
      pnrLabel={pnrLabel}
      pnrStatus={pnrStatus}
      journeyDetailFlightDate={journeyDetailFlightDate}
      passengerListArray={passengerListArray}
      paxLabel={paxLabel}
    />
  </div>
);

BookingInfo.propTypes = {
  sectors: PropTypes.array,
  bookingDetails: PropTypes.shape({
    journeyType: PropTypes.string,
    recordLocators: PropTypes.array,
    recordLocator: PropTypes.any,
    hasModification: PropTypes.bool,
    bookingStatus: PropTypes.string,
  }),
  pnrStatus: PropTypes.shape({
    notGenerated: PropTypes.string,
  }),
  pnrLabel: PropTypes.string,
  codeShare: PropTypes.array,
  partnerPnrBookingLabel: PropTypes.string,
  journeyDetailFlightDate: PropTypes.array,
  passengerListArray: PropTypes.array,
  paxLabel: PropTypes.string,
};

export default memo(BookingInfo);
