import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FlightJourneyTabs from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';
import { useSelector } from 'react-redux';
import { formatDate, UTIL_CONSTANTS } from '../../utils';
import { CONSTANTS } from '../../constants';

const BookingInfo = ({
  isCancelFlight,
}) => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const bookingDetails = (itineraryApiData && itineraryApiData.bookingDetails) || {};
  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const passengerListArray = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  // eslint-disable-next-line no-unused-vars, no-unsafe-optional-chaining
  const { pnrLabel, paxLabel, codeShare,
    partnerPnrBookingLabel, pnrStatus } = mfData?.itineraryMainByPath.item || {}; // NOSONAR
  const [sectors, setSectors] = useState([]);
  const [tripIndex, setTripIndex] = useState(0);
  const { BOOKING_STATUS, BOOKING_STATUS_LABEL } = CONSTANTS;
  const pnrLabelText = pnrLabel?.replace(
    '{pnr}',
    '',
  );
  const pnrLabelValue = pnrLabel?.replace('PNR:', '')?.replace(
    '{pnr}',
    bookingDetails?.recordLocator || '',
  );

  const journeyDetailFlightDate = journeyDetail?.map((item) => {
    return formatDate(
      item?.journeydetail?.departure,
      UTIL_CONSTANTS.DATE_SPACE_DDMMMMYYYY,
    );
  });

  useEffect(() => {
    const sectorList = [];
    journeyDetail?.forEach((ssrObj, ssrIndex) => {
      const sectorObj = {
        origin: ssrObj?.journeydetail?.origin,
        destination: ssrObj?.journeydetail?.destination,
        key: ssrIndex,
      };
      sectorList.push(sectorObj);
    });
    setSectors(sectorList);
  }, [journeyDetail]);

  const renderBookingStatus = (bookingStatus) => {
    let className = '';
    let label = '';
    let iconClassName = '';
    switch (bookingStatus) {
      case BOOKING_STATUS.CONFIRMED:
      case BOOKING_STATUS.NEEDS_PAYMENT:
        label = BOOKING_STATUS_LABEL.CONFIRMED;
        className = 'confirmed bg-green';
        iconClassName = 'icon-check text-forest-green';
        break;
      case BOOKING_STATUS.HOLD:
        label = BOOKING_STATUS_LABEL.HOLD;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        className = 'holdcancelled bg-red';
        break;
      case BOOKING_STATUS.IN_PROGRESS:
        label = BOOKING_STATUS_LABEL.IN_PROGRESS;
        className = 'inprogress bg-orange';
        break;
      case BOOKING_STATUS.HOLD_CANCELLED:
        label = BOOKING_STATUS_LABEL.HOLD_CANCELLED;
        className = 'holdcancelled bg-red';
        break;
      case BOOKING_STATUS.CANCELLED:
      case BOOKING_STATUS.CLOSED:
        label = BOOKING_STATUS_LABEL.CANCELLED;
        className = 'holdcancelled bg-red';
        break;
      case BOOKING_STATUS.PENDING:
      case BOOKING_STATUS.ONHOLD:
        label = BOOKING_STATUS_LABEL.HOLD;
        className = 'holdcancelled bg-orange';
        break;
      case BOOKING_STATUS.COMPLETED:
        label = BOOKING_STATUS_LABEL.COMPLETED;
        className = 'confirmed bg-green ';
        iconClassName = 'icon-check text-forest-green';
        break;
      default:
        // eslint-disable-next-line no-undef
        label = bookingStatus;
        className = 'inprogress bg-orange';
        break;
    }
    return [label, className, iconClassName];
  };
  const isCodeshareEnabled = bookingDetails?.recordLocators?.length > 0;
  const pnrNotGeneratedLabel = pnrStatus?.notGenerated || 'Not generated';
  return (
    <div className={`booking-info ${isCancelFlight ? 'booking-info-cancel-flight' : ''}`}>
      <div className={`booking-info-header ${isCancelFlight ? 'booking-info__cancel' : ''}`}>
        {sectors?.length > 0 && (
        <FlightJourneyTabs
          sectors={sectors}
          onChangeCallback={(ssrIndex) => (ssrIndex !== tripIndex ? setTripIndex(ssrIndex) : '')}
          containerClass={bookingDetails?.journeyType?.toLowerCase()}
        />
        )}

      </div>
      <div className={`booking-info-container ${isCodeshareEnabled ? 'codeshare' : ''}`}>
        <div className={`booking-info-container-other-info ${isCodeshareEnabled ? 'codeshare-other-info' : ''}`}>
          {(journeyDetail?.length > 0) && journeyDetailFlightDate && (
            <div className="booking-info-container-other-info__date">
              <i className="icon-calender" />
              <span>{journeyDetailFlightDate?.join('-')}</span>
            </div>
          )}
          {passengerListArray?.length > 0 ? (
            <div className="booking-info-container-other-info__pax-info">
              <i className="icon-Passenger" />
              <span>{`${passengerListArray?.length} ${paxLabel
              }`}
              </span>
            </div>
          ) : null}
        </div>

        {isCodeshareEnabled
          ? (
            <div className="booking-info-container-pnrs-block">
              <div className="booking-info-container-transaction transaction">
                <div className="booking-info-container-transaction-block">
                  <div className="booking-info-container-transaction-pnr transaction-prn">
                    <span className="icon-flight">
                      <span className="path1" />
                      <span className="path2" />
                      <span className="path3" />
                      <span className="path4" />
                    </span>
                    <span className="booking-info-container-transaction-pnr-label">
                      {pnrLabelText}
                    </span>
                    <strong className="booking-info-container-transaction-pnr-value">
                      {pnrLabelValue}
                    </strong>
                  </div>
                  {!bookingDetails?.recordLocator
                    ? (
                      <span className="booking-info-container-transaction__withoutprn">
                        <i className="icon-close-circle" />{pnrNotGeneratedLabel}
                      </span>
                    )
                    : !bookingDetails?.hasModification && (
                    <span
                      className={`booking-info-container-transaction__status status 
                ${renderBookingStatus(bookingDetails?.bookingStatus)[1]}`}
                    >
                      <span className={renderBookingStatus(bookingDetails?.bookingStatus)[2]} />
                      {
                  bookingDetails?.bookingStatus
                }
                    </span>
                    )}
                </div>
              </div>
              {bookingDetails?.recordLocators?.length > 0 && (
                bookingDetails?.recordLocators.map((recordItem) => {
                  const segmentCodeshareObj = codeShare?.find(
                    (cItem) => cItem?.carrierCode === recordItem?.owningSystemCode,
                  );
                  return (
                    <div className="booking-info-container-partner-bookingstatus" key={recordItem?.recordCode}>
                      <div className="booking-info-container-partner-bookingstatus-bookingreference">
                        {segmentCodeshareObj?.carrierCodeIcon
                        && (
                        <img
                          src={segmentCodeshareObj?.carrierCodeIcon?._publishUrl}
                          className="flightLogo"
                          alt="Partner PNR logo"
                        />
                        )}
                        {partnerPnrBookingLabel || 'Partner PNR:'}
                      </div>
                      <div className="booking-info-container-partner-bookingstatus-pnrstatus">

                        <div className="booking-info-container-partner-bookingstatus-pnrstatus-pnr">
                          {recordItem?.recordCode
                            ? (
                              <span className="booking-info-container-partner-bookingstatus-pnrstatus-pnr-label">
                                {recordItem?.recordCode}
                              </span>
                            )
                            : (
                              <span className="booking-info-container-transaction__withoutprn mx-0">
                                <i className="icon-close-circle" />{pnrNotGeneratedLabel}
                              </span>
                            )}
                        </div>
                        <div className={`booking-info-container-transaction__status status
                    ${renderBookingStatus(recordItem?.bookingStatus)[1]} pnr-status`}
                        >
                          {recordItem?.bookingStatus && (
                          <>
                            <span className={renderBookingStatus(recordItem?.bookingStatus)[2]} />
                            <span className="pnr-status">{recordItem?.bookingStatus}</span>
                          </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )
          : (
            <div className="booking-info-container-pnrs-info">
              <div className="booking-info-container-transaction">
                <div className="booking-info-container-transaction-block">
                  <div className="booking-info-container-transaction-pnr">
                    <span className="booking-info-container-transaction-pnr-label">
                      {pnrLabelText}
                    </span>
                    <strong className="booking-info-container-transaction-pnr-value">
                      {pnrLabelValue}
                    </strong>
                  </div>
                  {!bookingDetails?.recordLocator
                    ? (
                      <span className="booking-info-container-transaction__withoutprn">
                        <i className="icon-close-circle" />{pnrNotGeneratedLabel}
                      </span>
                    )
                    : !bookingDetails?.hasModification && (
                    <span
                      className={`booking-info-container-transaction__status 
                    ${renderBookingStatus(bookingDetails?.bookingStatus)[1]}`}
                    >
                      <span className={renderBookingStatus(bookingDetails?.bookingStatus)[2]} />
                      {
                      bookingDetails?.bookingStatus
                    }
                    </span>
                    )}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

BookingInfo.propTypes = {
  isCancelFlight: PropTypes.any,
};

export default BookingInfo;
