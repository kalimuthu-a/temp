import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AppContext } from '../../../context/AppContext';
import { UTIL_CONSTANTS, formatDate, formatDateWithSuffixAndMonth } from '../../../utils';
import BackButton from '../BackButton/BackCta';
import HeaderOffcanvas from './HeaderOffcanvas';
import { visaServiceActions } from '../../../context/reducer';
import { pushAnalytic } from '../../../utils/analyticEvents';
import { EVENTS_NAME, AA_CONSTANTS } from '../../../utils/analytic';
import { PAGES } from '../../../constants';

// eslint-disable-next-line sonarjs/cognitive-complexity
const VisaHeaderSection = ({ headingText }) => {
  const {
    state: {
      selectedVisaPax,
      visaPageSectionType,
      getItineraryDetails,
      showFullVisaBookingWidget,
      visaCountriesDetails,
      visaPaxSelectByPath,
    },
    dispatch,
  } = React.useContext(AppContext);
  const bookingheaderEle = document.querySelector('.booking-widget-header');
  const [currentSection, setCurrentSection] = useState(visaPageSectionType);
  const { journeysDetail, bookingDetails } = getItineraryDetails || {};
  const visaJourneyDetails = journeysDetail?.filter(
    (journey) => journey?.journeydetail?.destinationCityName?.toLowerCase(),
  )?.[0];

  const journeyDate = visaJourneyDetails?.journeydetail?.departure;
  const date = journeyDate ? formatDate(
    journeyDate,
    UTIL_CONSTANTS.DATE_SPACE_DDMMM,
  ) : '';
  const countryName = visaCountriesDetails?.activeCountryName;

  const [isMobile] = useIsMobile();

  if (bookingheaderEle && (isMobile
    || (visaPageSectionType === PAGES.VISA_SRP || visaPageSectionType === PAGES.VISA_PLAN_DETAILS))) {
    bookingheaderEle.style.display = 'flex';
  }

  if (bookingheaderEle?.classList?.contains('d-none')
    && (countryName || visaPageSectionType === PAGES.VISA_BOOKING_DETAILS)) {
    bookingheaderEle.classList.remove('d-none');
    if (isMobile) {
      bookingheaderEle.style.width = '100%';
    }
  }

  useEffect(() => {
    if (!currentSection) {
      if (window.pageType === PAGES.VISA_PAX_SELECT && currentSection === undefined) {
        setCurrentSection(PAGES.VISA_SRP);
        return;
      }
      setCurrentSection(visaPageSectionType);
    }
  }, [currentSection]);

  const onClickEdit = () => {
    dispatch({
      type: visaServiceActions.SHOW_FULL_VISA_BOOKING_WIDGET,
      payload: true,
    });
  };

  const onClose = (selectedCountry, withOutAnalytic = false) => {
    if (selectedCountry !== null
      && visaCountriesDetails?.activeCountryName?.toLowerCase()
      !== selectedCountry?.activeCountryName?.toLowerCase()) {
      const countriesInfo = {
        flightBookingCountries: visaCountriesDetails?.flightBookingCountries,
        flightBookingCountriesCode: visaCountriesDetails?.flightBookingCountriesCode,
        activeCountryIndex: 0,
        activeCountryName: selectedCountry?.activeCountryName,
        destinationsCode: visaCountriesDetails?.destinationsCode,
        activeCountryCode: selectedCountry?.activeCountryCode,
        countryDetials: visaCountriesDetails?.countryDetials,
      };
      dispatch({ type: 'GET_VISA_COUNTRIES_DETAILS', payload: countriesInfo });
    }
    dispatch({
      type: visaServiceActions.SHOW_FULL_VISA_BOOKING_WIDGET,
      payload: false,
    });

    const departureDate = visaJourneyDetails?.journeydetail?.departure || '';
    const departureDateformat = departureDate ? formatDate(
      departureDate,
      UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY,
    ) : '';

    // visa modify flow TSD
    // withOutAnalytic handle TSD on Cross button click and pax selecter
    if (!withOutAnalytic) {
      const obj = {
        event: EVENTS_NAME.VISA_MODIFY_FLOW,
        data: {
          _event: EVENTS_NAME.VISA_MODIFY_FLOW,
          visaDetails: {
            totalPax: selectedVisaPax?.length || '1',
            sector: countryName,
            departureDates: departureDateformat,
          },
          pageName: AA_CONSTANTS.Visa_Search_Result,
          pnrResponse: { passengers: selectedVisaPax, bookingDetails },
          eventInfo: {
            name: 'Continue',
            position: '',
            component: AA_CONSTANTS.Visa_Modify,
          },
        },
      };
      pushAnalytic(obj);
    }
  };

  if (!bookingheaderEle) return null;
  return createPortal(
    <div className="visa-header-section">
      {isMobile && visaPageSectionType !== PAGES.VISA_CONFIRMATION ? (
        <BackButton currentSection={currentSection} />
      ) : null}
      {!isMobile ? (// eslint-disable-line no-nested-ternary
        <>
          <div className="visa-header-section-city-info">
            <span className="visa-header-section-city-info-to">
              {countryName || ''}
            </span>
          </div>
          <div className="visa-header-section-date-info">
            {date ? formatDateWithSuffixAndMonth(date) : null}
          </div>
          <div className="visa-header-section-traveller-info">
            {`${selectedVisaPax?.length || 0} ${visaPaxSelectByPath?.travellersLabel}`}
          </div>
          <div className="visa-header-section-booking-edit">
            <Icon className="icon-edit" onClick={() => onClickEdit()} />
          </div>
          {showFullVisaBookingWidget && (
            <HeaderOffcanvas onClose={onClose} date={date} />
          )}
        </>
      )
        : ((headingText === 'srp' || currentSection === PAGES.VISA_SRP)
          || (currentSection === PAGES.VISA_PLAN_DETAILS)
          ? (
            <>
              <div className="visa-header-section-city-info visa-header-section-heading-mweb">
                <span className="visa-header-section-city-info-to">
                  {`${countryName} e-visa`}
                </span>
                <div className="visa-header-section-booking-edit">
                  <Icon className="icon-edit" onClick={() => onClickEdit()} />
                </div>
                {/* for right logo container */}
                <div className="visa-mobile-logo" />
              </div>
              {showFullVisaBookingWidget && (
                <HeaderOffcanvas onClose={onClose} date={date} />
              )}
            </>
          )
          : <div className="visa-header-section-heading-mweb">{headingText}</div>)}
    </div>,
    bookingheaderEle,
  );
};

VisaHeaderSection.propTypes = {
  headingText: PropTypes.any,
};

export default VisaHeaderSection;
