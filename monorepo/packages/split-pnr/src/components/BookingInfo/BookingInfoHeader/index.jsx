import React from 'react';
import PropTypes from 'prop-types';

const classNameText = 'booking_info--header';

const BookingInfoHeader = ({ sectors }) => {
  if (!sectors?.length) return null;

  return (
    <div className={classNameText}>
      {sectors?.map?.(({ origin, destination, key }) => (
        <div key={key} className={`${classNameText}--sector`}>
          <span className="source">{origin}</span>
          <span className="dots" />
          <span className="dest">{destination}</span>
        </div>
      ))}
    </div>
  );
};

BookingInfoHeader.propTypes = {
  sectors: PropTypes.array,
};

export default BookingInfoHeader;
