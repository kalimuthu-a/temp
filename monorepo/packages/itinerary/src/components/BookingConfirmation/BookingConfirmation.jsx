import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ConfirmationBanner from './ConfirmationBanner/ConfirmationBanner';
import { findTripType } from '../Passengers/dataConfig';
import {
  dateDiffToString,
  formatDate,
  UTIL_CONSTANTS,
} from '../../utils';
import { CONSTANTS } from '../../constants';

// eslint-disable-next-line sonarjs/cognitive-complexity
const BookingConfirmation = ({ acknowledgePaymentStausFlag }) => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const priceObj = useSelector((state) => state.itinerary?.apiData?.priceBreakdown) || {};
  const isBurnFlow = useSelector((state) => state.itinerary?.isBurnFlow);
  const { totalPoints } = priceObj;
  const exploreCities = useSelector(
    (state) => state.itinerary?.exploreCitiesData,
  ) || [];
  const { itineraryMainByPath } = mfData;
  // eslint-disable-next-line max-len, no-unsafe-optional-chaining
  const { bookingStatus, earnedPtsLabel, pnrLabel, bookingConfirmRedirectUrl, defaultIataDetails } = itineraryMainByPath?.item || {};
  const { bookingDetails, contacts } = itineraryApiData;
  const { confirmationImage } = exploreCities?.[0] || '';
  const { PAYMENT_STATUS, BOOKING_STATUS, LOYALTYCONFIRMATION_AEMKEY } = CONSTANTS;

  let loyaltyProgramConfirmation = '';
  if (isBurnFlow
    && bookingDetails?.bookingStatus?.toLowerCase() === BOOKING_STATUS.CONFIRMED?.toLowerCase()) {
    loyaltyProgramConfirmation = LOYALTYCONFIRMATION_AEMKEY;
  }
  let currentBookingStatus = bookingDetails?.bookingStatus;
  if (bookingDetails?.bookingStatus === BOOKING_STATUS.HOLD_CANCELLED) {
    currentBookingStatus = BOOKING_STATUS.CANCELLED;
  }

  // eslint-disable-next-line max-len
  const bookingStatusData = bookingStatus?.filter((bookingState) => (bookingState?.key === (loyaltyProgramConfirmation || currentBookingStatus)))?.[0];// bookingDetails?.bookingStatus
  const [bookingStatusState, setBookingStatusState] = useState(bookingStatusData);
  const { journeydetail } = (journeyDetail && journeyDetail[0]) || {};
  const tripType = findTripType(journeyDetail);
  const pnr = bookingDetails?.recordLocator || '';
  const { hh: journeyHr, mm: journeyMin, days: journeyDays } = dateDiffToString(
    journeydetail?.utcdeparture,
    journeydetail?.utcarrival,
    true,
  );
  let journeyHrUpdated = journeyHr < 10 ? Number(journeyHr) : journeyHr;
  if (journeyDays > 0) { // if we have time difference in days then we have add those to hours count
    journeyHrUpdated = Number(journeyHrUpdated) + (Number(journeyDays) * 24);
  }
  const bannerProps = {
    title: bookingStatusState?.title || bookingStatusData?.title || '',
    source: journeydetail?.origin,
    destination: journeydetail?.destination,
    journeyType: tripType,
    redirectUrl: bookingConfirmRedirectUrl,
    earnPoints: earnedPtsLabel?.replace('{points}', totalPoints),
    // eslint-disable-next-line object-shorthand
    totalPoints: totalPoints,
    dateDeparture: journeydetail?.utcdeparture ? formatDate(
      journeydetail?.departure,
      UTIL_CONSTANTS.DATE_SPACE_DDDMMM,
    ) : '',
    time: journeydetail?.utcdeparture ? `${journeyHrUpdated}h ${journeyMin}m` : '',
    pnr: pnr ? pnrLabel?.replace('{pnr}', pnr) : '',
    imgUrl: confirmationImage?._publishUrl || defaultIataDetails?.confirmationImage?._publishUrl,
    imgAlt: bookingStatusState?.title || bookingStatusData?.title || '',
    bookingStatus: bookingDetails?.bookingStatus || bookingStatusData?.key,
    acknowledgePaymentStausFlag,
  };
  const emailId = contacts?.[0]?.emailAddress;
  const statusKey = (
    bookingDetails?.bookingStatus?.toLocaleLowerCase() === CONSTANTS.BOOKING_STATUS.ON_HOLD.toLocaleLowerCase())
    ? bookingDetails?.bookingStatus
    : (loyaltyProgramConfirmation || acknowledgePaymentStausFlag || bookingDetails?.bookingStatus);
  const descriptionText = bookingStatusState?.description || bookingStatusData?.description;
  const bookingHoldDate = bookingDetails?.holdDate
    ? formatDate(bookingDetails?.holdDate, UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER) : '';

  useEffect(() => {
    if (!bookingStatusState || (bookingStatusData?.key !== statusKey)) {
      const bookingData = bookingStatus?.filter(
        (bookingState) => (bookingState?.key === statusKey),
      )?.[0];
      setBookingStatusState(bookingData);
    }
  }, [!bookingStatusState, statusKey, bookingStatus]);
  const isPaymentCompleted = bookingDetails?.paymentStatus === PAYMENT_STATUS.COMPLETED;
  return (
    <>
      <div className="booking-confirmation">
        <ConfirmationBanner
          {...bannerProps}
          holdDescription={
            (bookingDetails?.paymentStatus === CONSTANTS?.PAYMENT_STATUS?.PENDING) && bookingDetails?.isFlexPay
              ? descriptionText?.html?.replace('{mail}', emailId)?.replace('{date}', bookingHoldDate)
              : null
          }
        />
      </div>
      {!bookingDetails?.isFlexPay && (
      <div className={`booking-confirmation__section ${isPaymentCompleted ? 'pb-32' : ''}`}>
        <div className="booking-confirmation__section__container">
          <div
            className="booking-confirmation__description text-secondary"
            dangerouslySetInnerHTML={{
              __html: descriptionText?.html.replace('{mail}', emailId).replace('{date}', bookingHoldDate),
            }}
          />
        </div>
      </div>
      )}
    </>
  );
};
BookingConfirmation.propTypes = {
  mfData: PropTypes.object,
  bookingDetails: PropTypes.any,
  journeyDetail: PropTypes.object,
  acknowledgePaymentStausFlag: PropTypes.string,
};
export default BookingConfirmation;
