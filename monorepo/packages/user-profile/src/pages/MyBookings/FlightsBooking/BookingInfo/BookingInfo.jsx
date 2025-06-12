import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import './BookingInfo.scss';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import BookingInfoCta from './BookingInfoCTA';
import { replaceCurlyBraces } from '../../../../functions/utils';
import WebCheckInMsg from './WebCheckInMsg';

const BookingInfo = (props) => {
  const {
    bookingStatus,
    bookingData,
    bottomDivider,
    isOneWay,
    isPastTrip = true,
    isUpcomingTrip,
    paymentStatus,
    anyMultiNoShow,
    labels,
    partnerPNR,
    holdExpiry,
    lastName,
    codeShare,
  } = props;
  const isBurn = false; // TODO from API;
  const points = 0; // for earn it will be earnpoints from api,burn also burn point
  const [isTimerZero, setIsTimerZero] = useState(false);
    const loyaltyInfo = {
    className: isBurn ? 'burn-points-chip' : 'earn-points-chip',
    label: '',
  };
  if (isBurn && !window.disableLoyalty && points) {
    loyaltyInfo.label = `Redeemed -${points} pts`;
  } else if (!window.disableLoyalty && points) {
    loyaltyInfo.label = `Earned +${points} pts`;
  }
  function roundedClass() {
    if (bookingData?.isFirstItem) return 'rounded-top-3';
    if (bookingData?.isLastItem) return 'rounded-bottom-3';
    return '';
  }

  const getLogo = (carrierCode) => {
    if (codeShare && codeShare.length) {
      const filteredCarrrierCode = codeShare.find((cShare) => cShare.carrierCode === carrierCode);
      return filteredCarrrierCode?.carrierCodePopupIcon?._publishUrl;
    }
    return '';
  };

  return (
    <>
      {bottomDivider ? (
        <div className="bg-white d-flex w-100">
          <div className="my-bookings__card-divider-dark my-12 mx-6 w-100" />
        </div>
      ) : null}

      <div className={`bg-white bg-white p-6 p-md-10 my-bookings__card-info ${roundedClass()}`}>
        <div className="mb-7 mb-md-8">
          <p
            className="rounded-pill  px-4 py-1 tags-small
          d-inline gap-2 align-items-center fw-inc"
            style={{
              color: bookingData?.flightStatusColor.text,
              backgroundColor: bookingData?.flightStatusColor.bg,
            }}
          >
            {bookingData?.flightStatusLabel}
          </p>
          {!!loyaltyInfo.label && (
          <Chip
            containerClass={`booking-info-loyalty-chip ${loyaltyInfo.className}`}
            key={uniq()}
            variant="filled"
            txtcol="text-primary"
            size="sm"
            color="secondary-light"
            onClick={null}
          > {loyaltyInfo.label}
          </Chip>
          )}
        </div>
        <div className="d-flex gap-2 justify-content-between align-items-center mb-5 mb-md-10">
          <div className={`${bookingData?.flightNumbers?.length > 2 ? 'flightNumbersMore' : 'flightNumbers'}`}>
            {bookingData?.flightNumbers?.map((num) => (
              <div className="text-tertiary tags-regular d-flex align-center" key={uniq()}>
                <img
                  src={getLogo(num?.split(' ')[0])}
                  alt="CS"
                  className="codeshare-icon me-4"
                  width="16px"
                  height="16px"
                />
                {num}
              </div>
            ))}
          </div>
          <p className="d-none d-md-inline">
            <span className="body-small-regular text-secondary">
              {replaceCurlyBraces(labels?.pnrLabel, '')}
            </span>
            <span className="body-small-medium text-secondary">{bookingData?.pnr}</span>
            {partnerPNR
              && (
              <span className="ms-8">
                <span className="body-small-regular text-secondary">
                  {replaceCurlyBraces(labels?.partnerPnrLabel, '')}
                </span>
                <span className="body-small-medium text-secondary">{partnerPNR}</span>
              </span>
              )}
          </p>
        </div>
        <div className="d-grid my-bookings__card-flight-time justify-content-center align-items-center">
          <div className="d-flex justify-content-start flex-column">
            <p className="text-light deptTime">{bookingData?.departureTime}</p>
            <div className="align-items-center d-md-flex gap-10">
              <Heading heading="h7" mobileHeading="h7" containerClass="headingFont cityCode">
                {bookingData?.originCode}
              </Heading>
              <p className="cityFont text-secondary">{bookingData?.originCity}</p>
            </div>
          </div>
          <div className="d-flex justify-content-center flex-column align-items-center position-relative">
            <p className="tags-light text-tertiary">{bookingData?.travelTime}</p>
            <div className="my-bookings__card-divider-imgs d-flex justify-content-between w-100 align-items-center">
              <svg
                className="my-bookings__card-divider-imgs-left"
                width="65"
                height="19"
                viewBox="0 0 65 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.78831 5.16615L5.68104 8.81415L7.89594 8.81415C8.23019 8.81415 8.5 9.12043
                8.5 9.49986C8.5 9.87929 8.23019 10.1856 7.89594 10.1856L5.68104 10.1856L3.78831
                13.8336C3.71582 13.9799 3.57487 14.0713 3.42587 14.0713C3.14398 14.0713 2.94262
                13.765 3.01914 13.4587L3.86482 10.1856L1.65395 10.1856L1.1103 11.2187C1.07405
                11.2873 1.00559 11.3284 0.937133 11.3284L0.735779 11.3284L0.703562 11.3284C0.570668
                11.3284 0.474018 11.1867 0.506235 11.045L0.800212 9.71015L0.848537 9.49986L0.812293
                9.32615L0.767995 9.13415L0.574695 8.26557L0.506235 7.95929C0.474018 7.813 0.570668
                7.67586 0.703562 7.67586L0.852564 7.67586L0.937133 7.67586C1.00962 7.67586 1.07405
                7.717 1.1103 7.78557L1.65395 8.81415L3.86885 8.81415L3.02316 5.541C2.94262 5.23472
                3.14398 4.92843 3.42587 4.92843C3.57487 4.92843 3.71582 5.01986 3.78831 5.16615Z"
                  fill="#E2EBF2"
                />
                <path
                  d="M8.5 9.5H64.5"
                  stroke="#E2EBF2"
                  strokeLinecap="round"
                  strokeDasharray="0.1 2"
                />
              </svg>
              <svg
                className="my-bookings__card-divider-imgs-right"
                width="61"
                height="5"
                viewBox="0 0 61 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.5 2.5H56.5"
                  stroke="#E2EBF2"
                  strokeLinecap="round"
                  strokeDasharray="0.1 2"
                />
                <path
                  d="M60.5 2.5C60.5 1.39543 59.6046 0.5 58.5 0.5C57.3954 0.5 56.5 1.39543 56.5 2.5
                    C56.5 3.60457 57.3954 4.5 58.5 4.5C59.6046 4.5 60.5 3.60457 60.5 2.5Z"
                  stroke="#E2EBF2"
                />
              </svg>
            </div>
            <p className="tags-regular text-tertiary fw-inc">{bookingData?.stops}</p>
          </div>
          <div className="d-flex justify-content-end flex-column align-items-end">
            <p className="text-light arrivalTime">{bookingData?.arrivalTime}</p>
            <div className="align-items-center d-md-flex gap-10 flex-row-reverse">
              <Heading heading="h7" mobileHeading="h7" containerClass="reverse headingFont cityCode">
                {bookingData?.destinationCode}
              </Heading>
              <p className="cityFont text-secondary">{bookingData?.destinationCity}</p>
            </div>
          </div>
        </div>
        <div className="my-bookings__card-divider divider-spacing" />
        <div className="d-flex gap-25">
          <p className="d-flex gap-4 justify-content-center">
            <span className="icon-calender icon-size-sm text-secondary" />
            <span className="body-small-medium text-secondary">
              {bookingData?.departureDate}
            </span>
          </p>
          <p className="d-flex gap-4 align-items-center ">
            <span className="icon-Passenger icon-size-sm text-secondary" />
            <span className="body-small-medium text-secondary">{bookingData?.paxCount}</span>
          </p>
        </div>
        <div className="my-bookings__card-divider divider-spacing" />

        {isUpcomingTrip ? (
          <WebCheckInMsg
            labels={labels}
            msgStatus={bookingData?.webCheckinMsgStatus}
            checkinDate={bookingData?.webCheckinDate}
            checkinStatus={bookingData?.webCheckinStatus}
            holdExpiry={holdExpiry}
            bookingStatus={bookingStatus}
            paymentStatus={paymentStatus}
            setIsTimerZero={setIsTimerZero}
          />
        ) : null}
        <BookingInfoCta
          bookingStatus={bookingStatus}
          paymentStatus={paymentStatus}
          isOneWay={isOneWay}
          isPastTrip={isPastTrip}
          isUpcomingTrip={isUpcomingTrip}
          bookingData={bookingData}
          labels={labels}
          anyMultiNoShow={anyMultiNoShow}
          holdExpiry={holdExpiry}
          lastName={lastName}
          isTimerZero={isTimerZero}
        />
      </div>
    </>
  );
};

BookingInfo.propTypes = {
  bookingData: PropTypes.object,
  bottomDivider: PropTypes.bool,
  isPastTrip: PropTypes.bool,
  bookingStatus: PropTypes.string,
  holdExpiry: PropTypes.string,
  isOneWay: PropTypes.bool,
  paymentStatus: PropTypes.string,
  labels: PropTypes.object,
  isUpcomingTrip: PropTypes.bool,
  anyMultiNoShow: PropTypes.bool,
  partnerPNR: PropTypes.string,
  lastName: PropTypes.string,
  codeShare: PropTypes.array,
};

export default BookingInfo;
