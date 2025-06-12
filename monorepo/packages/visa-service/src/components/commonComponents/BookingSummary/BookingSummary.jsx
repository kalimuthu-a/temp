import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Progress from 'skyplus-design-system-app/dist/des-system/Progress';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { AppContext } from '../../../context/AppContext';
import { STEPLIST } from '../../../constants';
// import { GetFareDetails } from '../../../functions/GetFareDetails';

const BookingSummary = ({
  bookingSummaryData,
  setshowBookingDetailsMobile,
}) => {
  const {
    state: {
      visaPlanDetailsByPath,
      // selectedVisaDetails,
      // selectedVisaPax,
    },
  } = useContext(AppContext);

  // const fareDetails = GetFareDetails(selectedVisaDetails, selectedVisaPax);

  const [isMobile] = useIsMobile();
  return (
    <div className="booking-summary-wrapper">
      {isMobile && (
        <div
          className="visa-booking-summary-close-icon"
          onClick={() => setshowBookingDetailsMobile(false)}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              setshowBookingDetailsMobile(false);
            }
          }}
          aria-label="Close booking-summary"
        >
          <span className="icon-close-simple" />
        </div>
      )}
      {!isMobile && (
        <div className="booking-traveler-details">
          <Progress
            customClass="login-sso-progress"
            allSteps={Object.values(STEPLIST)}
            currentStep={bookingSummaryData.visaProgressStatus}
            titlePos="top"
            title={bookingSummaryData.visaProgressStatus}
          />
        </div>
      )}
      <div className="booking-summary-details">
        <span className="booking-summary-text">
          {bookingSummaryData?.title}
        </span>
        <div className="traveler-count">
          <span className="traveler-count-text">
            {bookingSummaryData?.travelerCount}
          </span>
        </div>
        <div className="departing-details-wrapper">
          <div className="departing-details">
            <span className="departing-text">
              {bookingSummaryData?.departureText}
            </span>
            <span className="departing-date">
              {bookingSummaryData?.departureDate}
            </span>
          </div>
          <div className="tourist-visa">
            <span
              className="tourist-visa-text"
              dangerouslySetInnerHTML={{ __html: bookingSummaryData?.visaText }}
            />
            <span
              className="tourist-visa-days"
              dangerouslySetInnerHTML={{ __html: bookingSummaryData?.visaDays }}
            />
          </div>

          {/* {!isMobile && (
            <div className="visa-amount">
              <span className="visa-amount-text">
                {formatCurrencyFunc({
                  price: fareDetails?.totalAmount,
                  currencycode: 'INR',
                })}
              </span>
            </div>
          )} */}
        </div>
        {isMobile && (
          <div className="visa-btn-ok-booking-summary">
            <Button
              color="primary"
              size="large"
              onClick={() => setshowBookingDetailsMobile(false)}
            >
              {visaPlanDetailsByPath?.visaSchedulePopUp?.ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
BookingSummary.propTypes = {
  bookingSummaryData: PropTypes.object,
  setshowBookingDetailsMobile: PropTypes.any,
};

export default BookingSummary;
