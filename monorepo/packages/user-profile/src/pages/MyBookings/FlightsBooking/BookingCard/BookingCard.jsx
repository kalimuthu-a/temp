import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { replaceCurlyBraces } from '../../../../functions/utils';
import { FLIGHT_BOOKING, tripStatus } from '../../../../constants/common';
import '../BookingInfo/BookingInfo.scss';

const BookingCard = (props) => {
  // eslint-disable-next-line no-unused-vars
  const {
    children,
    bookingData,
    labels,
    containerClass = '',
  } = props;
  // console.log('bookingData', bookingData);

  const statusIcon = (status) => {
    switch (status) {
      case tripStatus[1]:
        return 'icon-info';
      case tripStatus[3]:
        return 'icon-close-solid';
      default:
        return 'icon-check';
    }
  };

  const partnerPNR = bookingData?.bookingInfo?.map((bInfo) => bInfo?.partnerPnr).join(' ').trim();

  /* the condition is to show the Confirmed in case of upcoming trip */
  const getTripStatus = () => {
    if (bookingData?.bookingCategory === FLIGHT_BOOKING.CURRENT && bookingData?.bookingStatus === tripStatus[2]) {
      return tripStatus[7];
    }
    if (bookingData?.bookingCategory === FLIGHT_BOOKING.COMPLETED && bookingData?.bookingStatus === tripStatus[2]) {
      return tripStatus[2];
    }
    return bookingData?.bookingStatus;
  };

  return (
    <div
      className={`my-bookings__card rounded-3 overflow-hidden box-shadow-card-soft ${containerClass}`}
      style={{ backgroundColor: bookingData?.bookingStatusColor?.cardBg }}
    >
      <div className="d-flex justify-content-between px-8 py-6 my-md-2 align-items-end">
        <div className="d-flex flex-column">
          <Heading
            heading="my-bookings__card-title"
            mobileHeading="my-bookings__card-title"
          >
            {bookingData?.cardTitle}
          </Heading>
          <p className="d-md-none text-secondary">
            <span className="body-small-light">
              {replaceCurlyBraces(labels?.pnrLabel, '')}
            </span>
            <span className="body-small-medium">{bookingData?.pnr}</span>
            {partnerPNR && (
              <>
                <span className="body-small-light ms-4">
                  {replaceCurlyBraces(labels?.partnerPnrLabel, '')}
                </span>
                <span className="body-small-medium">{partnerPNR}</span>
              </>
            )}
          </p>
        </div>
        <p
          className="rounded-pill p-1 pe-4 tags-small d-flex gap-2 align-items-center fw-inc"
          style={{
            backgroundColor: bookingData?.bookingStatusColor?.text,
            color: bookingData?.bookingStatusColor?.textBg,
          }}
        >
          <span
            className={`${statusIcon(bookingData?.bookingStatus)} icon-size-sm`}
          />
          {getTripStatus()}
        </p>
      </div>
      {children}
    </div>
  );
};

BookingCard.propTypes = {
  children: PropTypes.node,
  bookingData: PropTypes.shape({
    bookingInfo: PropTypes.array,
    bookingStatus: PropTypes.string,
    cardTitle: PropTypes.string,
    pnr: PropTypes.string,
    bookingCategory: PropTypes.string,
    bookingStatusColor: PropTypes.shape({
      textBg: PropTypes.string,
      text: PropTypes.string,
      cardBg: PropTypes.string,
    }),
  }),
  labels: PropTypes.object,
  containerClass: PropTypes.string,
};

export default BookingCard;
