import React from 'react';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';
import { CONSTANTS } from '../../../constants';

const ConfirmationBanner = ({
  title,
  source,
  destination,
  journeyType,
  redirectUrl,
  // earnPoints,
  // totalPoints,
  dateDeparture,
  time,
  pnr,
  imgUrl,
  imgAlt,
  bookingStatus,
  journeyStatus,
  acknowledgePaymentStausFlag,
  holdDescription = null,
}) => {
  const { BOOKING_STATUS, BOOKING_STATUS_LABEL, PAYMENT_POLLING_STATUS_KEY } = CONSTANTS;

  // const isEarnFlow = useSelector((state) => state.itinerary?.isEarnFlow);
  // const isBurnFlow = useSelector((state) => state.itinerary?.isBurnFlow);

  const statusFlag = acknowledgePaymentStausFlag || bookingStatus;
  const renderBookingStatus = () => {
    let className = '';
    let label = '';
    const inProgressClass = 'inprogress bg-orange';
    switch (statusFlag) {
      case BOOKING_STATUS.CONFIRMED:
      case BOOKING_STATUS.NEEDS_PAYMENT:
        label = BOOKING_STATUS_LABEL.CONFIRMED;
        className = 'confirmed bg-green';
        break;
      case BOOKING_STATUS.HOLD:
        label = BOOKING_STATUS_LABEL.HOLD;
        className = inProgressClass;
        break;
      case BOOKING_STATUS.IN_PROGRESS:
        label = BOOKING_STATUS_LABEL.IN_PROGRESS;
        className = inProgressClass;
        break;
      case BOOKING_STATUS.HOLD_CANCELLED:
        label = BOOKING_STATUS_LABEL.HOLD_CANCELLED;
        className = 'holdcancelled bg-red';
        break;
      case BOOKING_STATUS.CANCELLED:
      case BOOKING_STATUS.CLOSED:
        label = BOOKING_STATUS_LABEL.CANCELLED;
        className = 'holdcancelled bg-yellow';
        break;
      case BOOKING_STATUS.PENDING:
        label = BOOKING_STATUS_LABEL.HOLD;
        className = 'holdcancelled bg-orange';
        break;
      case BOOKING_STATUS.COMPLETED:
        label = BOOKING_STATUS_LABEL.COMPLETED;
        className = 'confirmed bg-green';
        break;
      case PAYMENT_POLLING_STATUS_KEY.PAYMENTV2_NOT_CONFIRMED:
        label = '';
        className = 'holdcancelled bg-red';
        break;
      default:
        label = journeyStatus;
        className = 'inprogress bg-orange';
        break;
    }
    return [label, className];
  };

  const [label, className] = renderBookingStatus();// eslint-disable-line no-unused-vars
  return (
    <div className="confirmation-banner" role="banner"> {/* NOSONAR */}
      {(bookingStatus === BOOKING_STATUS.CONFIRMED || bookingStatus === BOOKING_STATUS.NEEDS_PAYMENT) ? (
        <div className="confirmation-banner__bg-img">
          <img src={imgUrl} alt={imgAlt} loading="lazy" />
        </div>
      ) : (
        <div className={`confirmation-banner__bg-color ${className}`} />
      )}
      <div className={`confirmation-banner__container ${className}`}>
        <div className="confirmation-banner__container--textArea">
          <div className="confirmation-banner__container--textArea__title">
            {redirectUrl !== '' && (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label
              <a href={redirectUrl} className="bg-accent-dark" aria-label="indigo">
                <span className="confirmation-banner__container--textArea__title__icon-wrapper">
                  <i className="sky-icons icon-arrow-top-right sm" />
                </span>
              </a>
            )}
            <span className="confirmation-banner__container--textArea__title--title skyplus-heading h0">
              {' '}
              {title}
            </span>
          </div>
          { holdDescription && <p
            className="booking-confirmation__description text-secondary"
            dangerouslySetInnerHTML={{ __html: holdDescription }}
          /> }
          <div className="confirmation-banner__container--textArea__info">
            {source && (
            <span className="confirmation-banner__container--textArea__info__source">
              <span className="icon-arrival">
                <i className="path2" />
                <i className="path3" />
              </span>
              <span className="city-ita">{source}</span>
            </span>
            )}
            {journeyType && (
            <span className="confirmation-banner__container--textArea__info__type bg-primary-main">
              {journeyType}
            </span>
            )}
            {destination && (
            <span className="confirmation-banner__container--textArea__info__destination">
              <span className="icon-departure">
                <i className="path2" />
                <i className="path3" />
              </span>
              <span className="city-ita">{destination}</span>
            </span>
            )}
          </div>
          <div className="confirmation-banner__container--textArea__dateTimePnr">
            {dateDeparture && (
            <span className="confirmation-banner__container--textArea__dateTimePnr__date">
              {dateDeparture}
            </span>
            )}
            {time && (
            <span className="confirmation-banner__container--textArea__dateTimePnr__time">
              {time}
            </span>
            )}
            {pnr && (
            <span className="confirmation-banner__container--textArea__dateTimePnr__prn">
              {pnr}
            </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationBanner.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
  destination: PropTypes.string,
  journeyType: PropTypes.string,
  redirectUrl: PropTypes.string,
  // earnPoints: PropTypes.string,
  dateDeparture: PropTypes.string,
  time: PropTypes.string,
  pnr: PropTypes.string,
  imgUrl: PropTypes.string,
  imgAlt: PropTypes.string,
  bookingStatus: PropTypes.string,
  totalPoints: PropTypes.number,
  journeyStatus: PropTypes.any,
  acknowledgePaymentStausFlag: PropTypes.string,
  holdDescription: PropTypes.string,
};

export default ConfirmationBanner;
