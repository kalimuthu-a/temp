import React from 'react';
import PropTypes from 'prop-types';

const DepartingFlight = ({ flightDate, flightPNR, flightPnrLabel,
  partnerPnrbookingLabel, partnerPnrDetail, isCodeShareFlight,
  codeShare, notGeneratedLabel }) => {
  const isPartnerPrnAvailble = !!(isCodeShareFlight && partnerPnrDetail);
  const segmentCodeshareObj = codeShare?.find(
    (cItem) => cItem?.carrierCode === partnerPnrDetail?.owningSystemCode,
  );

  return (
    <div className={`flight-details__time ${!window?.disableProjectNext && 'flight-details__time--isNext'}`}>
      <div className="departure-time departure"> {flightDate} </div>
      <div className="pnr-container pnr">
        {
        !isPartnerPrnAvailble ? (
          <>
            <div className="pnr-label">{flightPnrLabel}</div>
            <div className="pnr-number">{flightPNR}</div>
          </>
          ) : partnerPnrDetail
          && (
                <div
                  className="booking-info-container-partner-bookingstatus bookingstatus"
                  key={partnerPnrDetail?.recordCode}
                >
                  <div className="booking-info-container-partner-bookingstatus-bookingreference">
                    {segmentCodeshareObj?.carrierCodeIcon
                      && (
                      <img
                        src={segmentCodeshareObj?.carrierCodeIcon?._publishUrl}
                        className="flightLogo"
                        alt="Partner PNR logo"
                      />
                      )}
                    {partnerPnrbookingLabel || 'Partner PNR:'}
                  </div>
                  <div className="booking-info-container-partner-bookingstatus-pnrstatus">
                    <div className="booking-info-container-partner-bookingstatus-pnrstatus-pnr
                     pnr-container-patner-pnr"
                    >
                      {!partnerPnrDetail?.recordCode ? (
                        <span className="booking-info-container-transaction__withoutprn withoutprn">
                          <i className="icon-close-circle" />{notGeneratedLabel}
                        </span>
                      )
                        : (
                          <span className="booking-info-container-partner-bookingstatus-pnrstatus-pnr-label">
                            {partnerPnrDetail?.recordCode}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
            )
        }

      </div>
    </div>
  );
};

DepartingFlight.propTypes = {
  flightDate: PropTypes.string,
  flightPNR: PropTypes.string,
  flightPnrLabel: PropTypes.string,
  partnerPnrDetail: PropTypes.object,
  isCodeShareFlight: PropTypes.bool,
  partnerPnrbookingLabel: PropTypes.string,
  codeShare: PropTypes.object,
  notGeneratedLabel: PropTypes.string,
};
export default DepartingFlight;
