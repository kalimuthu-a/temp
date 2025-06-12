import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../../../styles/images/logo.jpg';
import { formatDate, UTIL_CONSTANTS } from '../../../utils';
// import "skyplus-design-system-app/dist/des-system/css/main.css";
const PrintLogo = () => {
  const bookingDetails = useSelector((state) => state.itinerary?.apiData?.bookingDetails) || {};
  const { printItineraryInformation } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  const bookDate = formatDate(bookingDetails?.bookedDate, UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER, true) || '';
  const cancelledOn = bookingDetails?.cancelledDate && `${formatDate(
    bookingDetails?.cancelledDate,
    UTIL_CONSTANTS.DATE_BOOKEDON,
    true,
  )} (UTC)*`;
  return (
    <div className="print-logo">
      <img className="print-logo__image" src={logo} alt="logo" loading="lazy" />
      <div className="print-logo__bookingheading">
        <span className="print-logo__bookingreference">
          {printItineraryInformation?.dateOfBookingLabel || '*Date of Booking'}
        </span>
        <div className="print-logo__partnerbooking">
          <span className="print-logo__date">{bookDate}</span>
        </div>
      </div>
      {cancelledOn && (
      <div className="print-logo__bookingheading">
        <span className="print-logo__bookingreference">
          {printItineraryInformation?.cancelledOnLabel || 'Cancelled on'}
        </span>
        <div className="print-logo__partnerbooking">
          <span className="print-logo__date">{cancelledOn}</span>
        </div>
      </div>
      )}
    </div>
  );
};

PrintLogo.propTypes = {};

export default PrintLogo;
