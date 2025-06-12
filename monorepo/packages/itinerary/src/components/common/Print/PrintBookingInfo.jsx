import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CONSTANTS } from '../../../constants';

const PrintBookingInfo = () => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const bookingDetails = (itineraryApiData && itineraryApiData.bookingDetails) || {};
  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const { retrieveItinerarySection } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  // eslint-disable-next-line no-unused-vars, no-unsafe-optional-chaining
  const { pnrLabel, paxLabel, codeShare, pnrStatus,
    partnerPnrBookingLabel } = mfData?.itineraryMainByPath.item || {}; // NOSONAR
  const { BOOKING_STATUS, BOOKING_STATUS_LABEL } = CONSTANTS;
  const { pnrBookingReferenceLabel, paymentStatusLabel } = retrieveItinerarySection;
  useEffect(() => {
    const sectorList = [];
    journeyDetail?.forEach((ssrObj, ssrIndex) => {
      const sectorObj = {
        origin: ssrObj?.journeydetail?.origin,
        destination: ssrObj?.journeydetail?.destination,
        key: ssrIndex,
      };
      sectorList?.push(sectorObj);
    });
  }, [journeyDetail]);

  const renderBookingStatus = (bookingStatus) => {
    let className = '';
    let label = '';
    switch (bookingStatus) {
      case BOOKING_STATUS.CONFIRMED:
      case BOOKING_STATUS.NEEDS_PAYMENT:
        label = BOOKING_STATUS_LABEL.CONFIRMED;
        className = 'confirmed bg-green';
        break;
      case BOOKING_STATUS.HOLD:
        label = BOOKING_STATUS_LABEL.HOLD;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        className = 'inprogress bg-orange';
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
        label = BOOKING_STATUS_LABEL.HOLD;
        className = 'holdcancelled bg-orange';
        break;
      case BOOKING_STATUS.COMPLETED:
        label = BOOKING_STATUS_LABEL.COMPLETED;
        className = 'confirmed bg-green';
        break;
      default:
        // eslint-disable-next-line no-undef
        // label = journeyStatus;
        className = 'inprogress bg-orange';
        break;
    }
    return [label, className];
  };

  return (
    <div className="booking-info print">
      <div className="booking-info__container">
        <div className="booking-info__container__transaction">
          <div className="booking-info__container__transaction__block">
            <strong className="booking-info__container__transaction__pnr">
              {pnrBookingReferenceLabel || 'PNR / Booking Ref'}
            </strong>
            <span className="booking-info__container__transaction__pnr__number">{bookingDetails?.recordLocator}</span>
            <span
              className={`booking-info__container__transaction__status 
              ${renderBookingStatus(bookingDetails?.bookingStatus)[1]}`}
            >
              {
                bookingDetails?.bookingStatus
              }
            </span>
          </div>
          <div className="booking-info__container__transaction__block">
            <strong className="booking-info__container__transaction__pnr">
              {paymentStatusLabel || 'Payment Status'}
            </strong>
            <span className="booking-info__container__transaction__status payment-status">
              {bookingDetails?.paymentStatus}
            </span>
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
                  {partnerPnrBookingLabel || 'Partner PNR Reference'}
                </div>
                <div className="booking-info-container-partner-bookingstatus-pnrstatus">
                  <div className="booking-info-container-partner-bookingstatus-pnrstatus-pnr">
                    {recordItem?.recordCode
                      ? (
                        <span className="booking-info-container-partner-bookingstatus-pnrstatus-pnr-label">
                          {recordItem?.recordCode}
                        </span>
                      ) : (
                        <span className="booking-info-container-transaction__withoutprn mx-0">
                          <i className="icon-close-circle" />{pnrStatus?.notGenerated || 'Not generated'}
                        </span>
                      )}
                  </div>
                  <div className={`booking-info__container__transaction__status
                  ${renderBookingStatus(recordItem?.bookingStatus)[1]} pnr-status`}
                  >
                    <span className={renderBookingStatus(recordItem?.bookingStatus)[2]} />
                    {recordItem?.bookingStatus && <span className="pnr-status">{recordItem?.bookingStatus}</span>}
                  </div>
                </div>
              </div>
            );
          }))}
      </div>
    </div>
  );
};

export default PrintBookingInfo;
