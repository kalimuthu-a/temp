import React, { useEffect, useState } from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AppContext } from '../../context/AppContext';
import VisaPaymentDetails from '../commonComponents/VisaPaymentDetails/VisaPaymentDetails';
import VisaServiceFooterComponent from '../commonComponents/VisaFooter';
import BookingInfo from '../VisaPaxSelector/BookingInfo/BookingInfo';
import VisaPaxAccordionWrapper, { VisaPaxCard } from '../commonComponents/VisaPaxSelection/VisaPaxAccordionWrapper';
import { CONSTANTS, PAGES, STEPLIST } from '../../constants';
import BookingSummary from '../commonComponents/BookingSummary/BookingSummary';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';
import { convertDate, formatCurrencyFunc } from '../../utils';
import VisaBookingCard from '../commonComponents/VisaBookingCard/VisaBookingCard';
import VisaTravellerDetail from './VisaTravellerDetail';
import MobileBookingSummary from '../commonComponents/BookingSummary/BookingMobileSummary';
import { encryptText, getBookingStatus } from '../../services';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';
import { pushAnalytic } from '../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../utils/analytic';
import VisaTravellerForm from '../VisaTravellerDetails/VisaTravellerForm/VisaTravellerForm';
import { visaServiceActions } from '../../context/reducer';
import useHeightAdjustments from '../../hook/useHeightAdjustments';
import VisaSrpShimmer from '../commonComponents/Shimmer/VisaSrpShimmer';

const VisaReviewSummary = () => {
  const {
    state: {
      visaReviewApplicationByPath = {},
      visaBookingSummaryByPath,
      selectedVisaDetails,
      createdVisaBookingDetails,
      visaBookingStatus,
      visaBookingDetailsByPath,
      getItineraryDetails,
      visaTravelerDetails,
      visaTravelerDetailByPath,
      visaUploadDocumentsByPath,
      visaAllQuotations,
    },
    dispatch,
  } = React.useContext(AppContext);

  const [isMobile] = useIsMobile();
  const [showBookingDetailsMobile, setshowBookingDetailsMobile] = useState(false);
  const [viewDetail, setViewDetail] = useState(true);
  const [viewPaxId, setViewPaxId] = useState('');

  // visaBookingDetails
  const { dateOfTravel, travelerDetails } = createdVisaBookingDetails || {};
  const [viewDetailDrawer, setViewDetailDrawer] = useState(false);
  // side pannel adjustment
  useSidePanelAdjustments(true);

  const {
    reviewApplicationTitle,
    reviewApplicationDescription,
    travelerDetailsLabel,
    visaDetailsLabel,
    statusBarTitle,
    bookingIdLabel,
    nextCtaLabel,
    nextCtaLink,
  } = visaReviewApplicationByPath || {};
  const { stayLabel, validityLabel, travelDatesLabel } = visaBookingDetailsByPath || {};

  const {
    totalLabel,
    forTotalTravellersLabel,
  } = visaTravelerDetailByPath || {};
  const {
    touristVisaLabel,
  } = visaUploadDocumentsByPath;

  const [footerHeight, setFooterHeight] = useState(0);

  const handleContinueCTA = async () => {
    // abode analytic

    const bookingId = createdVisaBookingDetails?.bookingId;
    const prnDetail = getItineraryDetails?.bookingDetails?.recordLocator;
    const bookingIdEncrypted = await encryptText(bookingId);
    const pnrIdEncrypted = await encryptText(prnDetail);

    const visaLocalStorage = {
      bookingId: bookingIdEncrypted,
      pnrId: pnrIdEncrypted,
    };
    localStorage.setItem(CONSTANTS.VISA_SERVICE_K, JSON.stringify(visaLocalStorage));

    const paymentUrl = `${nextCtaLink}?isBookingFlow=1`;
    const obj = {
      event: AA_CONSTANTS.visaClick,
      data: {
        _event: EVENTS_NAME.CTA_CLICK_NO_PRODUCT,
        _eventInfoName: AA_CONSTANTS.Next,
        pageName: 'Visa Review Application',
        _componentName: AA_CONSTANTS.Review_Application,
      },
    };
    pushAnalytic(obj);
    window.open(paymentUrl, '_self');
    dispatch({ type: 'PAGE_SECTION_TYPE', payload: PAGES.VISA_BOOKING_DETAILS });
  };

  const footerProps = {
    handleClick: handleContinueCTA,
    buttonText: nextCtaLabel || 'Next',
    buttonProps: {
      disabled: false,
    },
    totalText: totalLabel,
    paxDetail: forTotalTravellersLabel?.replace('{}', travelerDetails?.length),
    totalAmount: formatCurrencyFunc({
      price: visaBookingStatus?.totalAmount || 0,
      currencycode: 'INR',
    }) || '0',
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

  useEffect(() => {
    if (!visaBookingStatus && createdVisaBookingDetails) {
      const bookingStatus = async () => {
        const { bookingDetails } = getItineraryDetails;
        const bookingVisaStatus = await getBookingStatus(
          createdVisaBookingDetails?.bookingId,
          bookingDetails?.recordLocator,
        );
        if (bookingVisaStatus && bookingVisaStatus?.data) {
          dispatch({ type: visaServiceActions.VISA_BOOKING_STATUS, payload: bookingVisaStatus.data });
        }
      };
      bookingStatus();
    }
  }, [createdVisaBookingDetails, visaBookingStatus]);

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
        pageName: 'Visa Review Application',
        _event: EVENTS_NAME.UPLOAD_VISA_LOAD,
        productInfo: {
          pnr: getItineraryDetails?.bookingDetails?.recordLocator || '',
          sector: visaAllQuotations?.data?.country || '',
        },
      },
    };
    pushAnalytic(obj);
  }, []);

  const bookingSummaryProps = {
    title: visaBookingSummaryByPath?.bookingSummaryTitle,
    travelerCount: `${createdVisaBookingDetails?.travelerCount || 0} ${visaBookingSummaryByPath?.travelerLabel}`,
    paymenttitle: visaBookingSummaryByPath?.paymentSummaryLabel,
    departureText: visaBookingSummaryByPath?.departingLabel,
    departureDate: dateOfTravel && convertDate(new Date(dateOfTravel)),
    visaText: touristVisaLabel?.html?.replace('{Country}', selectedVisaDetails?.countryName),
    visaDays: `${selectedVisaDetails?.stayPeriod} 
    | ${selectedVisaDetails?.entryType} 
    | ${validityLabel} : ${selectedVisaDetails?.validity}<br/> 
      ${stayLabel} : ${selectedVisaDetails?.stayPeriod} `,
    visaAmount: formatCurrencyFunc({
      price: selectedVisaDetails?.basePrice,
      currencycode: 'INR',
    }),
    visaProgressStatus: STEPLIST.REVIEW_PAY,
  };

  const visaBookingDetailsProps = {
    date: createdVisaBookingDetails?.dateOfTravel && new Date(createdVisaBookingDetails.dateOfTravel),
    bookingIdLabel: bookingIdLabel || 'Booking ID:',
    bookingId: createdVisaBookingDetails?.bookingId,
    destination: selectedVisaDetails?.countryName,
    entryType: selectedVisaDetails?.entryType,
    stayDuration: selectedVisaDetails?.stayPeriod,
    validity: selectedVisaDetails?.validity,
    travelDate: new Date(createdVisaBookingDetails?.dateOfTravel),
    isIconRequired: false,
    expectationJourneyCategory: selectedVisaDetails?.expectationJourneyCategory,
    stayLabel,
    validityLabel,
    travelDatesLabel,
  };

  const handleViewDetail = (passengerId, val = false) => {
    setViewDetailDrawer(val);
    setViewPaxId(val ? passengerId : '');
  };

  if (!visaBookingStatus) {
    return <VisaSrpShimmer />;
  }

  return (
    visaBookingStatus && (
      <>
        <VisaHeaderSection headingText={statusBarTitle || 'Review & Payment'} />
        <div className="visa-review">
          {showBookingDetailsMobile ? (
            <div className="visa-booking-summary-overlay" />
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
            className={`${viewDetail ? 'visa-review--left' : 'd-none visa-review--left'
            }`}
          >
            <div className="visa-review--left--section gap-sm-0">
              <HtmlBlock
                className="h3 visa-review--left--section--title"
                html={reviewApplicationTitle?.html}
              />
              <HtmlBlock
                className="visa-review--left--section--desc fw-normal"
                html={reviewApplicationDescription}
              />
            </div>
            <BookingInfo
              isVisaBooking
              pnr={createdVisaBookingDetails?.bookingId || ''}
              stayDuration={selectedVisaDetails?.stayPeriod}
              travellerPax={createdVisaBookingDetails?.travelerCount || 0}
              bookingIdLabel={bookingIdLabel}
              heading={touristVisaLabel?.html?.replace(
                '{Country}',
                visaBookingStatus?.visaBookingBrief?.country,
              )}
              isVisaDetail
            />
            <div className="visa-review--left--section">
              <HtmlBlock
                className="visa-review--left--section--desc"
                html={visaDetailsLabel}
              />
              <VisaBookingCard bookingDetails={visaBookingDetailsProps} />
            </div>
            <div className="visa-review--left--section">
              <HtmlBlock
                className="visa-review--left--section--desc"
                html={travelerDetailsLabel}
              />
              {createdVisaBookingDetails?.travelerDetails?.map((pax, index) => {
                if (pax.passengerTypeCode === CONSTANTS.PASSENGER_TYPE.CHILD) { return null; }
                return (
                  <div
                    className="visa-review--left--section--paxcard"
                    key={pax?.travelerId}
                  >
                    <VisaPaxAccordionWrapper
                      key={pax.travelerId}
                      titleComponent={(
                        <VisaPaxCard
                          key={pax.travelerId}
                          pax={pax}
                          isSelected={false}
                          onSelect={(val) => {
                            handleViewDetail(index, val);
                          }}
                          trackVisaStatus
                          passportLabel=""
                          isPOC={false}
                          isView={false}
                          passengerInfoCreateBooking
                          index={index}
                        />
                      )}
                      contentComponent={(
                        <VisaTravellerForm
                          index={index}
                          formData={visaTravelerDetails}
                          pageType="review-summary"
                        />
                      )}
                      initalActiveIndexes={index}
                      containerClassName="visa-traveller-accordian"
                    />
                  </div>
                );
              })}
            </div>
            <VisaPaymentDetails priceBreakDown={visaBookingStatus} />
          </div>

          <div className="visa-review--right">
            {!isMobile && (
              <BookingSummary bookingSummaryData={bookingSummaryProps} />
            )}
          </div>
        </div>
        <VisaServiceFooterComponent {...footerProps} />
        {viewDetailDrawer && (
          <VisaTravellerDetail
            handleClose={handleViewDetail}
            viewPaxId={viewPaxId}
          />
        )}
      </>
    )
  );
};

export default VisaReviewSummary;
