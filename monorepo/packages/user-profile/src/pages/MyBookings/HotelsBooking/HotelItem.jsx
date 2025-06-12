import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import './HotelItem.scss';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

import { formatDateTime } from '../../../utils/utilFunctions';

function HotelItem({ hotelBookingData = {}, _aem = {}, className = '' }) {
  const chipColor = {
    completed: {
      background: '#F0FFF6',
      color: '#218946',
      icon: 'icon-tick-outlined',
    },
    upcoming: {
      background: '#EAF8FF',
      color: '#348DC4',
      icon: '',
    },
    cancelled: {
      background: '#F4DEDF',
      color: '#C3272E',
      icon: 'icon-close-circle',
    },
    pending: {
      background: '#FFF8E5',
      color: '#A97D0E',
      icon: 'icon-close-circle',
    },
    default: {
      background: '#EAF8FF',
      color: '#348DC4',
      icon: '',
    },
  };

  const statusStyles = chipColor[hotelBookingData?.displayStatus?.toLowerCase()]
    || chipColor?.default;

  const iconVariant = !statusStyles?.icon ? 'status' : '';

  return (
    <div className={`${className}`}>
      <div className="mb-10 hotel-item__card">
        <div className="my-bookings__card rounded-3 overflow-hidden box-shadow-cards">
          <div className="rounded-3">
            <div className="bg-white bg-white my-bookings__card-info">
              <div className="hotel-item__card--image-container">
                <figure className="hotel-item__card--image">
                  <img src={hotelBookingData?.images[0]} alt="Hotel" />
                </figure>
              </div>
              <div className="hotel-item__card--detail-container p-6 p-md-10 vstack gap-8">
                <div className="hotel-item__card--detail-container-status hstack justify-content-between">
                  <p
                    className={`rounded-pill body-small-light gap-2 hstack text-capitalize ${iconVariant}`}
                    style={{
                      color: statusStyles.color,
                      backgroundColor: statusStyles.background,
                    }}
                  >
                    {statusStyles?.icon ? <Icon className={statusStyles?.icon} size="lg" /> : null}
                    {hotelBookingData?.displayStatus?.toLowerCase()}
                  </p>
                  <p className="text-secondary">
                    <span className="body-small-light">
                      {_aem?.bookingIdLabel}{' '}
                    </span>
                    <span className="body-small-regular">
                      {hotelBookingData?.orderId}
                    </span>
                  </p>
                </div>
                <div className="hotel-item__card--detail-container-details hstack justify-content-between">
                  <div className="vstack">
                    <p className="skyplus-text  sh3 text-primary">
                      {hotelBookingData?.hotelName}
                    </p>
                    <p className="body-small-regular text-secondary">
                      {hotelBookingData?.city}
                    </p>
                  </div>
                  <p className="text-tertiary ratings-block">
                    {[...Array(parseInt(hotelBookingData?.starRating, 10))].map(
                      () => (
                        <Icon
                          key={`hotel-booking-list-${hotelBookingData?.orderId}`}
                          className="icon-star_filled"
                          size="lg"
                        />
                      ),
                    )}
                  </p>
                </div>
                <div className="hotel-item__card--detail-container-date hstack gap-3 text-secondary">
                  <Icon className="icon-calender" size="lg" />
                  <p className="body-medium-medium ">
                    {
                      formatDateTime(hotelBookingData?.checkin)
                        ?.formattedDateMonth
                    }
                    {' '}
                    -
                    {' '}
                    {
                      formatDateTime(hotelBookingData?.checkout)
                        ?.formattedDateShort
                    }
                  </p>
                </div>
                <div
                  className="hotel-item__card--detail-container-summary
                rounded-2 p-5 hstack justify-content-center"
                >
                  <div className="hstack gap-6 body-medium-regular text-secondary">
                    <div className="pax-details hstack gap-4">
                      <Icon className="icon-Passenger" size="lg" />
                      {hotelBookingData?.adults}{' '}
                      {_aem?.passengerDetails[0]?.paxLabel || 'Adults'} +{' '}
                      {hotelBookingData?.childs}{' '}
                      {_aem?.passengerDetails[1]?.paxLabel || 'Children'}
                    </div>
                  </div>
                </div>
                <a
                  href={_aem?.viewBookingCtaLink.replace(
                    '{bookingId}',
                    hotelBookingData?.bookingId,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="hotel-item__card--detail-container-view-booking"
                >
                  <Button
                    containerClass="logout-button align-center"
                    color="primary"
                    variant="filled"
                    size="small"
                    block
                  >
                    {_aem?.viewBookingCtaLabel}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HotelItem.propTypes = {
  hotelBookingData: PropTypes.object,
  _aem: PropTypes.object,
  className: PropTypes.string,
};

export default HotelItem;
