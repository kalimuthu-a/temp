import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import JourneyInfo from './JourneyInfo';
import PnrInfo from './PnrInfo';

import { renderBookingStatus } from '../../../utils';

const classNameText = 'split_pnr--booking-info-container';

const BookingInfoContainer = (props) => {
  const {
    bookingDetails,
    codeShare,
    partnerPnrBookingLabel,
    pnrLabel,
    pnrStatus,
    journeyDetailFlightDate,
    passengerListArray,
    paxLabel,
  } = props;

  const bookingStatusClass = useMemo(() => {
    if (!bookingDetails?.recordLocator) return ['', '', ''];

    return renderBookingStatus(bookingDetails?.bookingStatus);
  }, [bookingDetails]);

  const isCodeShare = useMemo(
    () => (bookingDetails?.recordLocators?.length ? 'codeShare' : ''),
    [bookingDetails],
  );

  return (
    <div className={`${classNameText} ${isCodeShare}`}>
      <JourneyInfo
        journeyDetailFlightDate={journeyDetailFlightDate}
        passengerListArray={passengerListArray}
        paxLabel={paxLabel}
      />

      <div className="pnr-section">
        <PnrInfo
          classNameText={classNameText}
          pnrLabel={pnrLabel}
          pnr={bookingDetails?.recordLocator}
          pnrStatus={pnrStatus}
          bookingStatus={bookingDetails?.bookingStatus}
          bookingStatusClass={bookingStatusClass}
          icon={isCodeShare ? true : undefined}
        />
        {isCodeShare
          && bookingDetails?.recordLocators?.map?.((recordItem) => {
            const { owningSystemCode, recordCode, bookingStatus } = recordItem || {};
            // eslint-disable-next-line react/prop-types
            const { carrierCodeIcon } = codeShare?.find(
              ({ carrierCode }) => carrierCode === owningSystemCode,
            ) || {};
            const bookingStatusClass1 = renderBookingStatus(bookingStatus);

            return (
              <PnrInfo
                classNameText={classNameText}
                pnrLabel={partnerPnrBookingLabel || 'Partner PNR'}
                pnr={recordCode}
                pnrStatus={pnrStatus}
                bookingStatus={bookingStatus}
                bookingStatusClass={bookingStatusClass1}
                imgData={carrierCodeIcon}
              />
            );
          })}
      </div>
    </div>
  );
};

BookingInfoContainer.propTypes = {
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

export default BookingInfoContainer;
