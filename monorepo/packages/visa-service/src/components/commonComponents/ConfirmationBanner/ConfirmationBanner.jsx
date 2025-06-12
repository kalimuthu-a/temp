import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AppContext } from '../../../context/AppContext';
import { getStatusClass, getStatusClassColor } from '../../../utils';

const ConfirmationBanner = ({ bookingData, transactionCode }) => {
  const { state } = useContext(AppContext);
  const {
    visaPaxSelectByPath,
    bookingConfirmation,
    visaSrpByPath,
  } = state;

  const [isMobile] = useIsMobile();
  const { bookingId, visaBookingBrief, bookingDetails } = bookingData || {};

  const bookingStatusItem = bookingConfirmation?.applicationStatus.filter(
    (app) => (app.key).toLocaleLowerCase() === getStatusClass(String(transactionCode))?.toLocaleLowerCase(),
  );

  return (
    <div className="visa-review--left--section gap-sm-0">
      <div className={`application-container pt-sm-10 px-10 pb16 gap-16 
        ${getStatusClass(String(transactionCode))}`}
      >
        <div className={`${getStatusClassColor(String(transactionCode))} rightCircle`} aria-label="indigo">
          <span> <i className="sky-icons icon-arrow-top-right sm" /> </span>
        </div>
        <div className="visa-booking-card-image">
          <h2 className="heading fw-normal  ">{bookingStatusItem?.[0]?.title}</h2>
          <p className="sub-heading fw-medium  lh-sm  ">{`${visaPaxSelectByPath?.touristVisaLabel}
            ${visaBookingBrief?.country}`}
          </p>
          <p className="booking-details fw-normal lh-sm text-center">{bookingConfirmation?.bookingNoLabel}
            <span className="px-2">{bookingId}</span>
          </p>
        </div>
      </div>
      {isMobile && (
        <div className="visa-review--left--section__power-by">
          {visaSrpByPath?.poweredByVisaToFlyLabel}
        </div>
      )}
      <div className="visa-review--left--section__visa-booking-status-desc">
        <HtmlBlock
          html={bookingStatusItem?.[0]?.description?.html.replace(
            '{email}',
            `<span>${bookingDetails?.primaryTravelerEmailId}</span>`,
          )}
        />
      </div>
    </div>
  );
};

ConfirmationBanner.propTypes = {
  bookingData: PropTypes.object,
  transactionCode: PropTypes.any,
};

export default ConfirmationBanner;
