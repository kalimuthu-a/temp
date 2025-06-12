import React, { memo } from 'react';
import PropTypes from 'prop-types';

const PnrInfo = ({
  pnrLabel,
  pnr,
  pnrStatus,
  bookingStatus,
  bookingStatusClass,
  icon,
  imgData,
}) => (
  <div className="pnr-details">
    {!pnr && (
      <span className="with-out-pnr">
        <i className="icon-close-circle" />
        {pnrStatus?.notGenerated || 'Not generated'}
      </span>
    )}

    {pnr && (
      <>
        <div className="pnr">
          {icon && (
            <span className="icon-flight">
              <span className="path1" />
              <span className="path2" />
              <span className="path3" />
              <span className="path4" />
            </span>
          )}
          {imgData && (
            <img
              src={imgData?._publishUrl}
              className="flightLogo"
              alt="Partner PNR logo"
            />
          )}
          {pnrLabel}:<span>{pnr || ''}</span>
        </div>

        <span className={`booking-status ${bookingStatusClass?.[1]}`}>
          <span className={bookingStatusClass?.[2]} />
          {bookingStatus}
        </span>
      </>
    )}
  </div>
);

PnrInfo.propTypes = {
  pnrStatus: PropTypes.shape({
    notGenerated: PropTypes.string,
  }),
  pnr: PropTypes.string,
  pnrLabel: PropTypes.string,
  bookingStatus: PropTypes.string,
  bookingStatusClass: PropTypes.array,
  icon: PropTypes.string,
  imgData: PropTypes.shape({
    _publishUrl: PropTypes.string,
  }),
};

export default memo(PnrInfo);
