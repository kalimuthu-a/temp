import React, { useContext, useState, useEffect, useRef } from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import VisaTravellerForm from './VisaTravellerForm/VisaTravellerForm';
import VisaPaxAccordionWrapper, {
  VisaPaxCard,
} from '../commonComponents/VisaPaxSelection/VisaPaxAccordionWrapper';
import VisaServiceFooterComponent from '../commonComponents/VisaFooter';
import { AppContext } from '../../context/AppContext';
import BookingSummary from '../commonComponents/BookingSummary/BookingSummary';
import { STEPLIST, TOAST_VARIATION } from '../../constants';
import { formatCurrencyFunc, formatDate, UTIL_CONSTANTS } from '../../utils';
import MobileBookingSummary from '../commonComponents/BookingSummary/BookingMobileSummary';
import { createBookingReq, encryptText } from '../../services';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';
import { pushAnalytic } from '../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../utils/analytic';
import { isFormValid } from '../../functions/ValidateField';
import VisaToast from '../commonComponents/Toast/Toast';
import { GetFareDetails } from '../../functions/GetFareDetails';
import DateRangePicker from '../commonComponents/Calender/DateRangePicker';
import useHeightAdjustments from '../../hook/useHeightAdjustments';
import VisaSrpShimmer from '../commonComponents/Shimmer/VisaSrpShimmer';

const VisaTravellerDetails = () => {
  const {
    state: {
      visaBookingSummaryByPath,
      visaTravelerDetailByPath,
      selectedVisaDetails,
      selectedVisaPax,
      visaTravelerDetails,
      getItineraryDetails,
      visaBookingDetailsByPath,
      createdVisaBookingDetails,
      visaUploadDocumentsByPath,
      visaCountriesDetails,
      visaAllQuotations,
    },

    dispatch,
  } = useContext(AppContext);
  const { stayLabel, validityLabel } = visaBookingDetailsByPath || {};

  const {
    nextCtaLabel,
    statusBarTitle,
    totalLabel,
    forTotalTravellersLabel,
    viewDetailsCta,
    returnFlightLabel,

  } = visaTravelerDetailByPath || {};
  const {
    touristVisaLabel,
  } = visaUploadDocumentsByPath;

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isButtonLoader, setIsButtonLoader] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [formData, setFormData] = useState([]);

  const [isMobile] = useIsMobile();

  const [showBookingDetailsMobile, setshowBookingDetailsMobile] = useState(false);

  const [viewDetail, setViewDetail] = useState(true);
  const [alert, setAlert] = useState('');
  const [varition, setVarition] = useState('');
  const [visajourneykey, setVisaJounrneyKey] = useState('');
  const [showReturnDateCalendar, setShowReturnDateCalendar] = useState(false);
  const [visaReturnDate, setVisaReturnDate] = useState('');
  const returnDateCalendarRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const fareDetails = GetFareDetails(selectedVisaDetails, selectedVisaPax);

  const calculateTotalAmount = (selectedVisaDetail) => {
    // eslint-disable-next-line no-shadow
    const { priceDistribution } = selectedVisaDetail;
    const { basePrice, fee, serviceTax } = priceDistribution[0];
    if (priceDistribution) {
      return basePrice + fee + serviceTax;
    }
    return 0;
  };
  const { journeysDetail } = getItineraryDetails || {};
  const visaJourneyDetails = journeysDetail?.filter(
    (journey) => journey?.journeydetail?.destinationCityName?.toLowerCase(),
  )?.[0];
  const journeyDate = visaJourneyDetails?.journeydetail?.departure;
  const visaValidity = Number(selectedVisaDetails?.stayPeriodDaysCount) - 1;
  const returnDate = new Date(journeyDate);
  returnDate.setDate(returnDate.getDate() + visaValidity);

  const handleContinueCTA = async () => {
    // adobe analytic
    const travellerDetailsObj = {
      event: AA_CONSTANTS.visaClick,
      data: {
        pageName: AA_CONSTANTS.Visa_Passenger_Details,
        _event: EVENTS_NAME.CTA_CLICK_NO_PRODUCT,
        _eventInfoName: AA_CONSTANTS.Next,
        _componentName: AA_CONSTANTS.Visa_Passenger_Details,
      },
    };
    pushAnalytic(travellerDetailsObj);

    if (createdVisaBookingDetails) {
      dispatch({ type: 'PAGE_SECTION_TYPE', payload: 'visa-upload-documents' });
      return;
    }

    const { bookingDetails } = getItineraryDetails;
    const payload = formData && await Promise.all(formData?.map(async (data) => ({
      passportExpiry: await encryptText(formatDate(data?.passportExpiry, UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD)),
      dateOfBirth: await encryptText(formatDate(data?.dateOfBirth, UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD)),
      title: data?.title && await encryptText(data.title.charAt(0).toUpperCase() + data.title.slice(1).toLowerCase()),
      firstName: await encryptText(data?.firstName),
      lastName: await encryptText(data?.lastName),
      passportNumber: await encryptText(data?.passportNumber),
      cell: await encryptText(data?.cell),
      emailId: await encryptText(data?.emailId),
      primary: data?.primary,
      occupation: await encryptText(data?.occupation),
      passengerKey: await encryptText(data?.passengerKey),
    })));
    const primaryLastName = formData?.filter((data) => data?.primary === true)?.[0]?.lastName;
    const apiPayload = {
      quoteId: await encryptText(selectedVisaDetails?.quoteId),
      totalAmount: (fareDetails?.totalAmount)?.toFixed(2) || calculateTotalAmount(selectedVisaDetails)?.toFixed(2),
      bookingAmount: (fareDetails?.totalAmount)?.toFixed(2) || calculateTotalAmount(selectedVisaDetails)?.toFixed(2),
      totalMarkup: 0,
      dateOfTravel: await encryptText(formatDate(journeyDate, UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD)),
      traveler: payload,
      partnerBookingId: await encryptText(bookingDetails?.recordLocator),
      userConsent: true,
      countryName: await encryptText(selectedVisaDetails?.countryName),
      journeyKey: await encryptText(visajourneykey || ''),
      dateOfReturn: await encryptText(visaReturnDate === ''
        ? formatDate(
          returnDate,
          UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD,
        )
        : formatDate(
          visaReturnDate,
          UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD,
        )),
      primaryLastname: await encryptText(primaryLastName),
    };
    setIsButtonLoader(true);
    const data = await createBookingReq(apiPayload);
    if (data?.data === null) {
      setIsButtonLoader(false);
      setAlert(data?.message);
      setVarition(TOAST_VARIATION.ERROR);
      return;
    }
    if (data) {
      setAlert(data?.message);
      setVarition(TOAST_VARIATION.SUCCESS);
      setTimeout(() => {
        setIsButtonLoader(false);
        dispatch({ type: 'BOOKING_DETAILS', payload: data });
        dispatch({ type: 'PAGE_SECTION_TYPE', payload: 'visa-upload-documents' });
      }, 2000);
    }
    dispatch({ type: 'VISA_TRAVELER_DETAILS', payload: { ...formData, errors: {} } });
  };

  const footerProps = {
    handleClick: handleContinueCTA,
    buttonText: nextCtaLabel || 'Next',
    buttonProps: {
      disabled: isButtonDisabled,
      loading: isButtonLoader,
    },
    totalText: totalLabel,
    paxDetail: forTotalTravellersLabel?.replace('{}', selectedVisaPax?.length),
    totalAmount: formatCurrencyFunc({
      price: fareDetails?.totalAmount,
      currencycode: 'INR',
    }),
    viewDetail: viewDetailsCta,
    setFooterHeight,
  };

  // call when footerHeight set
  useHeightAdjustments(footerHeight);

  const handleView = (view) => {
    setViewDetail(view);
    setshowBookingDetailsMobile(false);
  };

  const handleBookingDetails = (details) => {
    // setViewDetail(false);
    setshowBookingDetailsMobile(details);
  };

  const bookingSummaryProps = {
    title: visaBookingSummaryByPath?.bookingSummaryTitle,
    travelerCount: `${selectedVisaPax?.length} ${visaBookingSummaryByPath?.travelerLabel}`,
    paymenttitle: visaBookingSummaryByPath?.paymentSummaryLabel,
    departureText: visaBookingSummaryByPath?.departingLabel,
    departureDate: formatDate(journeyDate, UTIL_CONSTANTS.DATE_SPACE_DDMMYYYY),
    visaText: touristVisaLabel?.html?.replace('{Country}', selectedVisaDetails?.countryName),
    visaDays: `${selectedVisaDetails?.stayPeriod} 
    | ${selectedVisaDetails?.entryType} 
    | ${validityLabel} : ${selectedVisaDetails?.validity} <br/> 
      ${stayLabel} : ${selectedVisaDetails?.stayPeriod} `,

    visaAmount: formatCurrencyFunc({
      price: selectedVisaDetails?.basePrice,
      currencycode: 'INR',
    }),
    visaProgressStatus: STEPLIST.TRAVELER_DETAILS,
  };

  const onCheckboxChangeHandler = (e) => {
    const checkedData = e.target.checked;
    setIsAgree(checkedData);
    const validForm = isFormValid(formData);
    // (checkedData && validForm) === true ? setIsButtonDisabled(false) : setIsButtonDisabled(true);
    setIsButtonDisabled(!(checkedData && validForm));
  };

  const initializeFormData = (paxArray) => {
    return paxArray.map((pax, index) => ({
      title: pax?.title || pax.name?.title || '',
      firstName: pax?.firstName || pax.name?.first || '',
      middleName: pax?.middleName || pax.name?.middle || '',
      lastName: pax?.lastName || pax.name?.last || '',
      CountryCode: pax?.CountryCode || 'IN',
      cell: pax?.cell || '',
      emailId: pax?.emailId || '',
      dateOfBirth: pax?.dateOfBirth
        || (pax?.info?.dateOfBirth != null
          ? formatDate(pax?.info?.dateOfBirth, UTIL_CONSTANTS.DATE_SLASH_MMDDYYYY) : '') || '',
      occupation: pax?.occupation || '',
      passportExpiry: pax?.passportExpiry || '',
      passportNumber: pax?.passportNumber || '',
      gender: pax?.gender || null,
      index,
      primary: pax?.primary || false,
      passengerKey: pax?.passengerKey || '',
      errors: {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        emailId: '',
        cell: '',
        passportNumber: '',
        occupation: '',
        passportExpiry: '',
      },
    }));
  };

  const handleCalendarClick = () => {
    if (showReturnDateCalendar) return;
    setShowReturnDateCalendar(true);
  };

  const handleDateChange = (startDate) => {
    const formattedDate = `${startDate.toLocaleDateString()}`;
    setVisaReturnDate(formattedDate);
    setShowReturnDateCalendar(false);
  };

  useEffect(() => {
    // Hiding booking widget from traveller details
    const bookingheaderEle = document.querySelector('.booking-widget-header');
    if (!isMobile && bookingheaderEle) {
      bookingheaderEle.style.display = 'none';
    }
    // tsd on page load
    const obj = {
      event: AA_CONSTANTS.visaPageLoad,
      data: {
        pageName: AA_CONSTANTS.Visa_Passenger_Details,
        _event: EVENTS_NAME.UPLOAD_VISA_LOAD,
        productInfo: {
          pnr: getItineraryDetails?.bookingDetails?.recordLocator || '',
          sector: visaAllQuotations?.data?.country || '',
        },
      },
    };
    pushAnalytic(obj);

    // on unmount or user goes back, making it visible
    return (() => {
      if (bookingheaderEle) {
        bookingheaderEle.style.display = 'block';
      }
    });
  }, []);

  useEffect(() => {
    if (visaTravelerDetails) {
      const visaTravelerData = Object.values(visaTravelerDetails).slice(0, -1);
      delete visaTravelerData.errors;

      const updatedFormData = initializeFormData(visaTravelerData);
      setFormData(updatedFormData);
      setIsButtonDisabled(false);
      setIsAgree(true);
      return;
    }

    if (selectedVisaPax?.length) {
      const updatedFormData = initializeFormData(selectedVisaPax);
      setFormData(updatedFormData);
    }
  }, [selectedVisaPax, visaTravelerDetails]);

  useEffect(() => {
    if (!visajourneykey) {
      const journeyKey = visaCountriesDetails?.countryDetials?.filter(
        (country) => country?.countryName === selectedVisaDetails?.countryName,
      )?.[0];
      setVisaJounrneyKey(journeyKey?.journeyKey);
    }
  }, [visajourneykey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        returnDateCalendarRef.current
        && !returnDateCalendarRef.current.contains(event.target)
      ) {
        setShowReturnDateCalendar(false);
      }
    };
    if (showReturnDateCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return () => {};
  }, [showReturnDateCalendar]);

  const returnDateLabel = {
    formattedReturnDate: visaReturnDate === ''
      ? formatDate(returnDate, UTIL_CONSTANTS.DATE_BOOKINGDETAILS_SUCCESS)
      : formatDate(visaReturnDate, UTIL_CONSTANTS.DATE_BOOKINGDETAILS_SUCCESS),
  };

  if (!getItineraryDetails && !formData) {
    return <VisaSrpShimmer />;
  }

  return (
    <>
      <VisaHeaderSection headingText={statusBarTitle || 'Traveler Details'} />
      <div className="visa-traveller">
        {showBookingDetailsMobile ? (
          <div className="visa-calendar-overlay" />
        ) : null}
        {isMobile && (
          <MobileBookingSummary
            viewDetail={viewDetail}
            showBookingDetailsMobile={showBookingDetailsMobile}
            bookingSummaryData={bookingSummaryProps}
            setViewDetail={(data) => handleView(data)}
            setshowBookingDetailsMobile={() => handleBookingDetails(!showBookingDetailsMobile)}
          />
        )}
        {isMobile && (
          <div className="booking-summary-m-comp-wrapper">
            {showBookingDetailsMobile ? (
              <BookingSummary
                bookingSummaryData={bookingSummaryProps}
                setshowBookingDetailsMobile={() => handleBookingDetails(!showBookingDetailsMobile)}
              />
            ) : null}
          </div>
        )}
        <div
          className={`${
            viewDetail
              ? 'visa-form-journey-bar-wrapper'
              : 'd-none visa-form-journey-bar-wrapper'
          }`}
        >
          <div className="p-2 pb-6 p-md-0 journey-bar-container w-100 mt-14 mb-8 my-md-8 ">
            <div
              className="journey-bar__leg d-flex justify-content-around align-items-center py-4
              px-8 bg-primary-main rounded-pill visa-srp-head-btn"
            >
              <div className="d-flex text-white body-medium-medium">
                <span className="d-flex align-items-center justify-content-center visa-title">
                  <HtmlBlock
                    html={touristVisaLabel?.html
                      ?.replace('{Country}', selectedVisaDetails?.countryName)
                      .toUpperCase()}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="visa-traveler-head-wrapper">
            {showReturnDateCalendar ? (
              <div
                className="visa-calendar-overlay"
                role="button"
                tabIndex="0"
                onClick={() => {
                  setShowReturnDateCalendar(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    setShowReturnDateCalendar(false);
                  }
                }}
                aria-label="Close calendar overlay"
              />
            ) : null}

            <span className="traveler-details-text">
              <HtmlBlock
                html={
                  visaTravelerDetailByPath?.travelerDetailsLabel?.html || ''
                }
              />
            </span>
            <div className="visa-return-date-calendar-wrapper">
              <span
                className="traveler-details-return-date"
                onClick={() => handleCalendarClick()}
                aria-hidden="true"
              >
                {returnFlightLabel?.replace(
                  '{returndate}',
                  returnDateLabel?.formattedReturnDate,
                ) || ' Return Date : '}
              </span>
              {showReturnDateCalendar && (
                <div className="visa-return-date-calendar-container">
                  <div
                    className="visa-calendar-close-icon"
                    onClick={() => setShowReturnDateCalendar(false)}
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        setShowReturnDateCalendar(false);
                      }
                    }}
                    aria-label="Close calendar"
                  >
                    <span className="icon-close-simple" />
                  </div>
                  <div ref={returnDateCalendarRef}>
                    {showReturnDateCalendar && (
                      <DateRangePicker
                        startDate={
                          visaReturnDate === ''
                            ? new Date(returnDate)
                            : new Date(visaReturnDate)
                        }
                        endDate={
                          visaReturnDate === ''
                            ? new Date(returnDate)
                            : new Date(visaReturnDate)
                        }
                        onDateChange={handleDateChange}
                        minDate={new Date(journeyDate)}
                        maxDate={new Date(returnDate)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="visa-traveller-form-wrapper">
            {formData.length > 0
              && selectedVisaPax?.map((_, index) => (
                <VisaPaxAccordionWrapper
                  key={`${selectedVisaPax[index].passengerKey}`}
                  titleComponent={(
                    <VisaPaxCard
                      key={selectedVisaPax[index].passengerKey}
                      pax={selectedVisaPax[index]}
                      isSelected={false}
                      onSelect={() => {}}
                      trackVisaStatus
                      passportLabel=""
                      isPOC={false}
                      index={index}
                    />
                  )}
                  contentComponent={(
                    <VisaTravellerForm
                      isButtonDisabled={isButtonDisabled}
                      setIsButtonDisabled={setIsButtonDisabled}
                      index={index}
                      formData={formData}
                      setFormData={setFormData}
                      isAgree={isAgree}
                    />
                  )}
                  initalActiveIndexes={index}
                  containerClassName="visa-traveller-accordian" // visa-traveller
                />
              ))}
          </div>
          <div className="visa-policy-details">
            <Checkbox
              checked={isAgree}
              onChangeHandler={onCheckboxChangeHandler}
              key={uniq()}
              className="checkbox-wrapper"
              id="main-check"
            />
            <HtmlBlock
              className="policy-details"
              html={
                visaTravelerDetailByPath?.privacyPolicyInformation?.html || ''
              }
            />
          </div>
        </div>
        <div className="booking-summary-comp-wrapper">
          {!isMobile && (
            <BookingSummary bookingSummaryData={bookingSummaryProps} />
          )}
        </div>

        {alert && (
          <VisaToast
            alert={alert}
            setAlert={setAlert}
            variation={varition}
            timer={10000}
          />
        )}
        <VisaServiceFooterComponent {...footerProps} />
      </div>
    </>
  );
};
export default VisaTravellerDetails;
