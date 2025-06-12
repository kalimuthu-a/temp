import React from 'react';
import './TooltipContent.scss';
import PropTypes from 'prop-types';
import { renderBookingStatus } from '../../../utils/utilFunctions';
const TooltipContent = ({ aemData, data, isTripCard=false }) => {
  if (isTripCard) {
    return (
      <div className="tooltip-content">
        <div className="self-section">
          <span class="icon-Indigo_Logo"></span>
          <span className="pnr-section">
            {aemData?.pnrLabel} {data?.selfTooltipData?.recordLocator}
          </span>
          <span
            className={`booking-status-section ${data?.selfTooltipData?.className}`}
          >
            {' '}
            {data?.selfTooltipData?.label}
          </span>
        </div>
        <div className="partner-section">
          <img
            className="partner-logo"
            src={data?.partnerTooltipData?.imageLink}
          />
          <span className="pnr-section">
            {aemData?.partnerPnrLabel}{' '}
            {data?.partnerTooltipData?.recordLocator}
          </span>
          <span
            className={`booking-status-section ${data?.partnerTooltipData?.className}`}
          >
            {' '}
            {data?.partnerTooltipData?.label}
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="tooltip-content">
      <div className="self-section">
        <i className="icon-Indigo_Logo" />
        <span className="pnr-section">{aemData?.pnrLabel} {data?.bookingDetails?.recordLocator}</span>
        <span className={`booking-status-section ${renderBookingStatus(data?.bookingDetails?.bookingStatus)[1]}`}>
          {data?.bookingDetails?.bookingStatus}
        </span>
      </div>

      {data?.bookingDetails?.recordLocators?.length > 0 && (
        data?.bookingDetails?.recordLocators?.map((recordItem) => {
          const segmentCodeshareObj = aemData?.codeShare?.find(
            (cItem) => cItem?.carrierCode === recordItem?.owningSystemCode,
          );
          return (
            <div className="partner-section">
              {segmentCodeshareObj?.carrierCodeIcon
                      && (
                      <img
                        src={segmentCodeshareObj?.carrierCodeIcon?._publishUrl}
                        className="flightLogo"
                        alt="Partner PNR logo"
                      />
                      )}
              <span className="pnr-section">{aemData?.partnerPnrLabel} {recordItem?.recordCode}</span>
              <span className={`booking-status-section ${renderBookingStatus(recordItem?.bookingStatus)[1]}`}>
                {recordItem?.bookingStatus}
              </span>
            </div>
          );
        }))}
    </div>
    );
  }
};
TooltipContent.propTypes = {
  aemData: PropTypes.object,
  data: PropTypes.object,
};

export default TooltipContent;
