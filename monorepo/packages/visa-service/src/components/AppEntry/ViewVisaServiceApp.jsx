import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { CONSTANTS, PAGES } from '../../constants';
import VisaPaxSelector from '../VisaPaxSelector';
import VisaSrp from '../VisaSrp';
import VisaPlanDetails from '../VisaPlanDetails';
import VisaTravellerDetails from '../VisaTravellerDetails';
import VisaReviewSummary from '../VisaReviewSummary';
import VisaUploadDocuments from '../VisaUploadDocuments';
import VisaBookingDetails from '../VisaBookingDetails';
import { AppContext } from '../../context/AppContext';
import useVisaInitalData from '../../hook/useVisaInitalData';
import BackButton from '../commonComponents/BackButton/BackCta';
import { visaServiceActions } from '../../context/reducer';
import VisaConfirmation from '../VisaConfirmation';
import VisaSEO from '../visaSEO';
import VisaPaymentPage from '../VisaPaymentPage';
import BackConfirmationPopup from '../VisaUploadDocuments/BackConfirmationPopup/BackConfirmationPopup';

const DEFAULT_PAGE = 'Visa Default component/page';
const ComponentsRenderer = ({ currentSection, bookingId, pnrId, countryName }) => {
  if (window.pageType === PAGES.VISA_PAYMENT) {
    const getLocalStorage = localStorage.getItem(CONSTANTS.VISA_SERVICE_K);
    if (getLocalStorage) {
      const visaService = JSON.parse(getLocalStorage);
      return <VisaPaymentPage bookingId={visaService?.bookingId || bookingId} pnr={visaService?.pnrId || pnrId} />;
    }
  }
  switch (currentSection) {
    case PAGES.VISA_PAX_SELECT:
      return <VisaPaxSelector />;
    case PAGES.VISA_SRP:
      return <VisaSrp />;
    case PAGES.VISA_PLAN_DETAILS:
      return <VisaPlanDetails />;
    case PAGES.VISA_TRAVELLER_DETAILS:
      return <VisaTravellerDetails />;
    case PAGES.VISA_REVIEW:
      return <VisaReviewSummary />;
    case PAGES.VISA_UPLOAD_DOCUMENTS:
      return <VisaUploadDocuments />;
    case PAGES.VISA_BOOKING_DETAILS:
      return bookingId && <VisaBookingDetails bookingId={bookingId} pnr={pnrId} />;
    case PAGES.VISA_CONFIRMATION:
      return <VisaConfirmation bookingId={bookingId} pnr={pnrId} />;
    case PAGES.VISA_PAYMENT:
      return <VisaPaymentPage bookingId={bookingId} pnr={pnrId} />;
    case PAGES.VISA_STATIC_SEO:
      return countryName && <VisaSEO countryName={countryName} />;
    default:
      return <div>{DEFAULT_PAGE}</div>;
  }
};

ComponentsRenderer.propTypes = {
  currentSection: PropTypes.string,
  bookingId: PropTypes.string,
  pnrId: PropTypes.string,
  countryName: PropTypes.string,
};

const ViewVisaServiceApp = () => {
  const [isMobile] = useIsMobile();
  const [bookingId, setBookingId] = useState('');
  const [pnrId, setPnrId] = useState('');
  const [countryName, setcountryName] = useState('');
  /* Handle Initial API Calls */
  useVisaInitalData();

  /* Render components based on page types */
  const { state: { visaPageSectionType = 'visa-srp',
    openUploadBackConfirmPopup = false }, dispatch } = useContext(AppContext);
  const [currentSection, setCurrentSection] = useState(visaPageSectionType);

  const getBookingIDPnr = (bookingID, pnr) => {
    setPnrId(pnr);
    setBookingId(bookingID);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashValue = url.hash?.split('?')[0].replace('#', ''); // Extracts 'visa-booking-details'
    const queryParams = new URLSearchParams(url.hash.split('?')[1]); // Extracts query parameters
    const isBookingConfirmation = url.searchParams.get('isBookingflow') === '1';
    const countryNameParam = queryParams.get('countryName') || url.searchParams.get('countryName');

    const getLocalStorage = localStorage.getItem(CONSTANTS.VISA_SERVICE_K);

    let bookingID = '';
    let pnr = '';

    if (getLocalStorage) {
      const visaService = JSON.parse(getLocalStorage);
      bookingID = visaService?.bookingId;
      pnr = visaService?.pnrId;
    }

    if (hashValue === PAGES.VISA_BOOKING_DETAILS) {
      getBookingIDPnr(bookingID, pnr);
      dispatch({ type: visaServiceActions.PAGE_SECTION_TYPE, payload: PAGES.VISA_BOOKING_DETAILS });
    } else if (window.pageType === PAGES.VISA_PAYMENT) {
      getBookingIDPnr(bookingID, pnr);
      dispatch({ type: visaServiceActions.PAGE_SECTION_TYPE, payload: PAGES.VISA_PAYMENT });
    } else if (isBookingConfirmation && bookingID) {
      getBookingIDPnr(bookingID, pnr);
      dispatch({ type: visaServiceActions.PAGE_SECTION_TYPE, payload: PAGES.VISA_CONFIRMATION });
    } else if (countryNameParam) {
      setcountryName(countryNameParam);
      dispatch({ type: visaServiceActions.PAGE_SECTION_TYPE, payload: PAGES.VISA_STATIC_SEO });
    }
  }, []);

  useEffect(() => {
    setCurrentSection(visaPageSectionType);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [visaPageSectionType]);

  return (
    <div className="view-visaserive">
      {!isMobile ? PAGES.VISA_CONFIRMATION !== currentSection && (
      <BackButton
        currentSection={currentSection}
      />
      ) : null}
      <ComponentsRenderer
        currentSection={currentSection}
        bookingId={bookingId}
        pnrId={pnrId}
        countryName={countryName}
      />
      {openUploadBackConfirmPopup && (
      <BackConfirmationPopup />
      )}
    </div>
  );
};

export default ViewVisaServiceApp;
