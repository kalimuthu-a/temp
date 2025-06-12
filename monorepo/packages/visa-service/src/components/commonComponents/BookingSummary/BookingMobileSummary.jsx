import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'skyplus-design-system-app/dist/des-system/Progress';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { STEPLIST } from '../../../constants';

const MobileBookingSummary = ({
  viewDetail,
  bookingSummaryData,
  // setViewDetail,
  setshowBookingDetailsMobile,
  showBookingDetailsMobile,
}) => {
  return (
    <div className="booking-summary-m-wrapper">
      <div className="booking-traveler-details">
        <Progress
          customClass="login-sso-progress"
          allSteps={Object.values(STEPLIST)}
          currentStep={bookingSummaryData.visaProgressStatus}
          titlePos="top"
          title={bookingSummaryData.visaProgressStatus}
        />
      </div>
      <div className="booking-summary-details">
        <div className="booking-summary-detials--wrapper">
          <div
            aria-hidden="true"
            className={`${
              showBookingDetailsMobile
                ? 'booking-summary-details-text-left active'
                : 'booking-summary-details-text-left'
            }`}
            // onClick={() => setshowBookingDetailsMobile()}
          >
            {bookingSummaryData?.title}
          </div>
          <div
            aria-hidden="true"
            className={`${
              viewDetail
                ? 'booking-summary-details-text-right rotate-270'
                : 'booking-summary-details-text-right'
            }`}
            // onClick={() => setViewDetail((pre) => !pre)}
            onClick={() => setshowBookingDetailsMobile()}
          >
            {bookingSummaryData?.viewDetail || 'View Detail'}
            <Icon className="icon-accordion-left-simple" />
          </div>
        </div>
        <div className="booking-summary-button--wrapper">
          <div
            className="booking-summary-button--text"
            dangerouslySetInnerHTML={{ __html: bookingSummaryData?.visaText }}
          />
        </div>
      </div>
    </div>
  );
};

MobileBookingSummary.propTypes = {
  viewDetail: PropTypes.bool,
  bookingSummaryData: PropTypes.object,
  // setViewDetail: PropTypes.func,
  setshowBookingDetailsMobile: PropTypes.func,
  showBookingDetailsMobile: PropTypes.any,
};
export default MobileBookingSummary;
