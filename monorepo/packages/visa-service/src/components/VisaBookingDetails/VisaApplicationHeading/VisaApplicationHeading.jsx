import React from 'react';
import PropTypes from 'prop-types';

const VisaApplicationHeading = ({
  applicationDate,
  applicationTitle,
  buttonLabel,
  journeySteps,
  applicationApprovedLabel,
}) => {
  const isBookingApproved = journeySteps && journeySteps[journeySteps.length - 1];
  const isApproved = isBookingApproved?.startDate && isBookingApproved?.endDate;

  return (
    <div className="visa-heading-wrapper my-0 mx-sm-auto d-flex justify-content-between">
      <div>
        <div className="applied-date">{applicationDate}</div>
        <div className="application-title">{applicationTitle}</div>
      </div>
      <div className={`application-assignment 
        ${isApproved && 'approved'}`}
      >{isApproved ? applicationApprovedLabel : buttonLabel}
      </div>
    </div>
  );
};

VisaApplicationHeading.propTypes = {
  applicationDate: PropTypes.string,
  applicationTitle: PropTypes.string,
  buttonLabel: PropTypes.string,
  journeySteps: PropTypes.array,
  applicationApprovedLabel: PropTypes.string,
};

export default VisaApplicationHeading;
