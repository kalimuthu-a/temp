import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import PropTypes from 'prop-types';
import { formatDate, UTIL_CONSTANTS } from '../../../utils';

const VisaBookingCard = ({ bookingDetails }) => {
  const {
    date,
    bookingId,
    destination,
    entryType,
    stayDuration,
    validity,
    isIconRequired,
    bookingIdLabel,
    expectationJourneyCategory,
    stayLabel,
    validityLabel,
    showFullDescription,
  } = bookingDetails || {};

  const visaDetailsdate = date ? formatDate(
    date,
    UTIL_CONSTANTS.DATE_SPACE_DDDMMM,
  ) : '';

  const titleHeading = { html: '<p> <span class="text-green">{} </span>Tourist Visa </p>' };
  return (
    <div className="visa-booking-card">
      <div className="visa-booking-card-header">
        <span className="visa-booking-card-header-date">{visaDetailsdate}</span>
        <span className="visa-booking-card-header-bookingid">
          {`${bookingIdLabel} : `}
          <span className="booking-id-highlight">{bookingId}</span>
        </span>
      </div>
      <div className="visa-booking-card-body">
        {isIconRequired && <Icon className="icon-close-simple icon-flight" />}
        {showFullDescription ? (
          <div
            className="visa-booking-card-body-heading"
          >{destination}
          </div>
        ) : (
          <div
            className="visa-booking-card-body-heading"

          >
            <div
              className="visa-booking-card-body-heading-main"
              dangerouslySetInnerHTML={{
                __html: titleHeading?.html?.replace('{}', destination),
              }}
            />
            { expectationJourneyCategory
              ? <div className="visa-info">{expectationJourneyCategory}</div> : null}
          </div>
        )}
        <ul className="visa-booking-card-body-list">
          <li>{stayDuration} {entryType}</li>
          <li>{`${stayLabel} ${stayDuration}`}</li>
          <li>{`${validityLabel} ${validity}`} </li>
          {/* <li>{`${travelDatesLabel} : ${travelDate && convertDate(travelDate)}`}</li> */}
        </ul>
      </div>
    </div>
  );
};

VisaBookingCard.propTypes = {
  bookingDetails: PropTypes.object,
};

export default VisaBookingCard;
