import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AppContext } from '../../../context/AppContext';
import { PAGES } from '../../../constants';
import { visaServiceActions } from '../../../context/reducer';

const BackButton = ({ currentSection }) => {
  const { state: {
    visaPaxSelectByPath,
    visaSrpByPath,
    visaPlanDetailsByPath,
    visaTravelerDetailByPath,
    visaUploadDocumentsByPath,
    visaReviewApplicationByPath,
    bookingConfirmation,
  },
  dispatch,
  } = useContext(AppContext);

  const goWindowBack = () => {
    return 'javascript: history.go(-1)'; // eslint-disable-line no-script-url
  };

  const componentsRenderer = () => {
    switch (currentSection) {
      case PAGES.VISA_PAX_SELECT:
        return {
          backCtaLabel: visaPaxSelectByPath?.backToItineraryLabel,
          backCtaLink: visaPaxSelectByPath?.backToItineraryLink,
        };
      case PAGES.VISA_SRP:
        return {
          backCtaLabel: visaPaxSelectByPath?.backToItineraryLabel,
          backCtaLink: goWindowBack(),
        };
      case PAGES.VISA_PLAN_DETAILS:
        return {
          backCtaLabel: visaPlanDetailsByPath?.backToSearchLabel,
          backCtaLink: 'visa-srp',
        };
      case PAGES.VISA_TRAVELLER_DETAILS:
        return {
          backCtaLabel: visaTravelerDetailByPath?.backToSearchResultLabel,
          backCtaLink: 'visa-plan-details',
        };
      case PAGES.VISA_REVIEW:
        return {
          backCtaLabel: visaReviewApplicationByPath?.backToPassengerDetailsLabel,
          backCtaLink: 'visa-upload-documents',
        };
      case PAGES.VISA_UPLOAD_DOCUMENTS:
        return {
          backCtaLabel: visaUploadDocumentsByPath?.backToTravelerDetailsLabel,
          backCtaLink: 'visa-traveller-details',
        };
      case PAGES.VISA_STATIC_SEO:
      case PAGES.VISA_BOOKING_DETAILS:
        return {
          backCtaLabel: 'Back',
          backCtaLink: goWindowBack(),
        };
      case PAGES.VISA_CONFIRMATION:
        return {
          backCtaLabel: bookingConfirmation?.visaHomeLabel,
          backCtaLink: bookingConfirmation?.visaHomeLink,
        };
      default:
        return {
          backCtaLabel: 'Back to home ',
          backCtaLink: goWindowBack(),
        };
    }
  };
  const previuosPageData = componentsRenderer();
  const [isMobile] = useIsMobile();

  const backButtonClick = () => {
    if (currentSection === PAGES.VISA_UPLOAD_DOCUMENTS) {
      dispatch({ type: visaServiceActions.OPEN_CONFIRMATION_POPUP, payload: true });
    } else {
      dispatch({
        type: visaServiceActions.PAGE_SECTION_TYPE,
        payload: previuosPageData?.backCtaLink,
      });
    }
  };

  return (
    <div className="back-btn">
      {(currentSection === PAGES.VISA_SRP
        || currentSection === PAGES.VISA_BOOKING_DETAILS
        || currentSection === PAGES.VISA_STATIC_SEO)
        ? (
          <div className="d-flex w-100 justify-content-between">
            <a href={previuosPageData?.backCtaLink}>
              <Icon className="icon-accordion-left-simple" />
              {!isMobile ? previuosPageData?.backCtaLabel : null}
            </a>

            {currentSection === PAGES.VISA_SRP && !isMobile && (
              <p className="text-tertiary">
                {visaSrpByPath?.poweredByVisaToFlyLabel || ''}
              </p>
            )}
          </div>
        )
        : (
          <button
            type="button"
            className="back-btn-btn"
            onClick={() => backButtonClick()}
          >
            <Icon className="icon-accordion-left-simple" />
            {!isMobile ? previuosPageData?.backCtaLabel : null}
          </button>
        )}
    </div>
  );
};

BackButton.propTypes = {
  currentSection: PropTypes.string,
};

export default BackButton;
