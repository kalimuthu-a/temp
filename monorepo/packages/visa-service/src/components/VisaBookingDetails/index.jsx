import React, { useContext, useEffect, useState } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import PropTypes from 'prop-types';
import VisaProcessStepper from './VisaProcessStepper/VisaProcessStepper';
import VisaApplicationHeading from './VisaApplicationHeading/VisaApplicationHeading';
import VisaPaxAccordionWrapper, { VisaPaxCard } from '../commonComponents/VisaPaxSelection/VisaPaxAccordionWrapper';
import VisaPaymentDetails from '../commonComponents/VisaPaymentDetails/VisaPaymentDetails';
import { AppContext } from '../../context/AppContext';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';
import VisaBookingCard from '../commonComponents/VisaBookingCard/VisaBookingCard';
import { formatDate, getVisaStatus, UTIL_CONSTANTS } from '../../utils';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';
import { checkEVisa, dowloadEvisa, getBookingStatus } from '../../services';
import VisaSrpShimmer from '../commonComponents/Shimmer/VisaSrpShimmer';
import { calculateAgeCategories, daysUntil, pushAnalytic } from '../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../utils/analytic';
import InvoiceDownload from '../VisaConfirmation/DownloadInvoice';
import BookingInfo from '../VisaPaxSelector/BookingInfo/BookingInfo';
import Loader from '../commonComponents/Loader/Loader';

const VisaBookingDetails = ({ bookingId, pnr }) => {
  const { state: { visaBookingDetailsByPath,
    visaBookingStatus,
    getItinerarySelectedDetails,
    visaUploadDocumentsByPath,
  }, dispatch } = useContext(AppContext);

  const { bookingDetailsTitle, saveShareOptions,
    travellerDetailsLabel = '',
    saveShareTabTitle, applicationStatusList, heyLabel, stayLabel, validityLabel,
    travelDatesLabel,
    bookingIdLabel,
    visa2flyLabel,
    poweredByText,
    getVisaLabel,
    visaDetailsLabel,
    downloadVisaLabel,
    visaStatusLabel,
    applicationApprovedLabel,
    bookingStatusLabel,
  } = visaBookingDetailsByPath || {};

  const [isMobile] = useIsMobile();
  const [loading, setLoader] = useState(false);

  // side pannel adjustment
  useSidePanelAdjustments(false);

  const [toast, setToast] = useState({
    show: false,
    description: '',
    status: '',
  });
  const bookingheaderEle = document.querySelector('.booking-widget-header');
  const rightAEMsection = document.getElementById('quick-actions');
  const rightAEMConfirmSection = document.getElementById('booking-confirmation');

  // removing aem content from our UI booking details page
  if (rightAEMsection) {
    rightAEMsection.style.display = 'none';
  }

  // removing aem content from our UI booking details page
  if (rightAEMConfirmSection) {
    rightAEMConfirmSection.style.display = 'none';
  }

  if (!isMobile && bookingheaderEle) {
    bookingheaderEle.style.display = 'none';
  }

  const adobeAnalytic = (statusData) => {
    const { stayPeriod, entryType, visaType, country, validity } = statusData?.visaBookingBrief || {};
    const { dateOfTravel, bookingStatus } = statusData?.bookingDetails || {};

    // get original pax list from Itneary
    let optedPax = '';
    try {
      const visaPaxLength = statusData?.travelerBasicDetails?.length || 0;
      optedPax = `${visaPaxLength}`;
    } catch {
      //  Ignoring error intentionally: localStorage data may not be present
    }

    // visaDates
    let expectedData = '';
    if (Array.isArray(statusData?.expectationJourneySteps) && statusData?.expectationJourneySteps?.length > 0) {
      const lastStepIndex = (statusData?.expectationJourneySteps?.length ?? 0) - 1;
      expectedData = statusData?.expectationJourneySteps?.[lastStepIndex]?.expectedDate;
      expectedData = expectedData ? formatDate(
        new Date(expectedData),
        UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY,
      ) : '';
    }
    const ageResult = calculateAgeCategories(statusData.travelerBasicDetails);
    const productInfo = {
      ...ageResult,
      visaName: `${stayPeriod} ${entryType}`,
      visaEntryType: `${entryType}`,
      visaType,
      visaValidity: validity,
      visaStay: stayPeriod,
      pnr: statusData?.bookingDetails?.partnerBookingId,
      sector: country,
      departureDates: dateOfTravel ? formatDate(
        new Date(dateOfTravel),
        UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY,
      ) : '',
      daysUntilVisa: String(daysUntil(expectedData)),
      visaDates: expectedData,
      optedPax,
      bookingID: statusData?.bookingDetails?.bookingId,
      applicationstatus: bookingStatus,
    };

    pushAnalytic({
      event: 'visaStatus',
      data: {
        _eventInfoName: 'Visa Successful',
        _event: EVENTS_NAME.VISA_SUCCESS,
        pageName: 'Visa Status',
        productInfo,
      },
    });
  };

  useEffect(() => {
    const bookingStatus = async () => {
      const bookingVisaStatus = await getBookingStatus(bookingId, pnr, true);
      if (bookingVisaStatus && bookingVisaStatus?.isSuccess) {
        dispatch({ type: 'VISA_BOOKING_STATUS', payload: bookingVisaStatus?.data });
        adobeAnalytic(bookingVisaStatus?.data || {});
      }
    };
    if (bookingId) {
      bookingStatus();
    }
  }, []);

  const setEmailToaster = (value) => {
    setToast(value);
  };

  const parsedVisaObj = getItinerarySelectedDetails || {};

  const visaBookingDetailsProps = {
    date: visaBookingStatus?.bookingDetails?.dateOfTravel && new Date(visaBookingStatus.bookingDetails.dateOfTravel),
    bookingIdLabel,
    bookingId: visaBookingStatus?.bookingDetails?.bookingId,
    destination: visaBookingStatus?.visaBookingBrief?.country || parsedVisaObj?.countryName,
    entryType: visaBookingStatus?.visaBookingBrief?.entryType,
    stayDuration: visaBookingStatus?.visaBookingBrief?.stayPeriod,
    validity: visaBookingStatus?.visaBookingBrief?.validity || 0,
    travelDate: visaBookingStatus?.bookingDetails?.dateOfTravel
      && new Date(visaBookingStatus.bookingDetails.dateOfTravel),
    isIconRequired: false,
    expectationJourneyCategory: visaBookingStatus?.expectationJourneyCategory,
    stayLabel,
    validityLabel,
    travelDatesLabel,
    showFullDescription: false,
  };

  const pushToAnalytic = () => {
    pushAnalytic({
      event: 'visaClick',
      data: {
        _eventInfoName: 'EVisa Download',
        _event: EVENTS_NAME.VISA_SUCCESS,
        _componentName: 'Visa Service',
        pageName: 'Visa Successful',
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        productInfo: {
          bookingID: visaBookingStatus?.bookingDetails?.bookingId,
          pnr: visaBookingStatus?.bookingDetails?.partnerBookingId,
          sector: visaBookingStatus?.visaBookingBrief?.country,
        },
      },
    });
  };

  const eVisaDownload = async () => {
    if (!loading) {
      setLoader(true);
      const create = await checkEVisa(bookingId, pnr);
      if (create && create?.isSuccess) {
        const invoice = await dowloadEvisa(bookingId, pnr);
        setLoader(false);
        pushToAnalytic();
        if (invoice?.message) {
          const toastInvoice = {
            description: invoice.message,
            status: invoice?.isSuccess ? 'Success' : 'Error',
            show: true,
          };
          setToast(toastInvoice);
        }
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    visaBookingStatus ? (
      <>
        <VisaHeaderSection headingText={bookingStatusLabel || 'Booking Status'} />
        <div className="booking-details-container">
          <div className="booking-details-booking-header">
            <Heading
              heading="h2"
              mobileHeading="h2"
              containerClass="visa-pax-selection-heading"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: bookingDetailsTitle?.html,
                }}
              />
            </Heading>
            <div className="passenger-name">
              {heyLabel}{' '}{visaBookingStatus?.visaBookingBrief?.contactPerson}
            </div>
            {applicationStatusList && applicationStatusList.length > 0
              && (
                <div className="passenger-process-status">
                  {applicationStatusList[0]?.value}
                </div>
              )}
          </div>

          <div className="booking-details-booking-info">
            <BookingInfo
              isVisaBooking
              pnr={visaBookingStatus?.bookingDetails?.bookingId || ''}
              stayDuration={visaBookingStatus?.visaBookingBrief?.stayPeriod}
              travellerPax={visaBookingStatus?.bookingDetails?.totalTravelers || 0}
              bookingIdLabel={bookingIdLabel || ''}
              heading={
                visaUploadDocumentsByPath?.touristVisaLabel?.html?.replace(
                  '{Country}',
                  visaBookingStatus?.visaBookingBrief?.country,
                )
              }
              isVisaDetail
            />
          </div>

          <div className="booking-details-visa-card">
            <div className="evisa-details">
              <div className={isMobile ? 'passenger-name mb-8 mt-sm-0' : 'passenger-name my-8'}>
                {visaDetailsLabel}
              </div>
            </div>
            <VisaBookingCard
              bookingDetails={visaBookingDetailsProps}
            />
            <Button
              color="primary"
              size="large"
              classNames="share-btn"
            >{saveShareTabTitle}
            </Button>
          </div>
          <div className="booking-details-download-section">

            <InvoiceDownload
              bookingId={bookingId}
              pnr={pnr}
              sector={visaBookingStatus?.visaBookingBrief?.country}
              quickAction={saveShareOptions?.[0]}
              decryptBookingId={visaBookingStatus?.bookingDetails?.bookingId || ''}
              decryptPnr={visaBookingStatus?.bookingDetails?.partnerBookingId || ''}
            />
          </div>
          <div className="booking-details-visa-status">
            <div className="d-flex justify-content-between">

              <div className="h4 heading-paydetails mb-0">{visaStatusLabel || 'Visa Status'}</div>
              {visaBookingStatus?.evisaPresent && (
                <div aria-hidden="true" className="e-visa-download" onClick={() => eVisaDownload()}>
                  {downloadVisaLabel}
                </div>
              )}
            </div>
            <div className="my-8">
              <VisaApplicationHeading
                applicationDate={bookingIdLabel}
                applicationTitle={visaBookingStatus?.bookingDetails?.bookingId}
                buttonLabel={getVisaStatus(visaBookingStatus?.expectationJourneySteps)}
                journeySteps={visaBookingStatus?.expectationJourneySteps || []}
                applicationApprovedLabel={applicationApprovedLabel}
              />
              <VisaProcessStepper
                visaJourney={visaBookingStatus?.expectationJourneySteps}
                visa2flyLabel={visa2flyLabel}
                poweredByText={poweredByText}
                getVisaLabel={getVisaLabel}
                evisaPresent={visaBookingStatus?.evisaPresent}
              />
            </div>
          </div>
          <div className="booking-details-traveller-details">
            <Heading
              heading="h4"
              mobileHeading="h4"
              containerClass="visa-pax-selection-heading"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: travellerDetailsLabel,
                }}
              />
            </Heading>
            {visaBookingStatus && visaBookingStatus?.travelerBasicDetails?.map((list, index) => {
              const passenger = list;
              passenger.name = `${passenger?.firstName} ${passenger?.lastName}`;
              return (
                <VisaPaxAccordionWrapper
                  key={passenger?.travelerId}
                  titleComponent={(
                    <VisaPaxCard
                      key={passenger.travelerId}
                      pax={passenger}
                      isSelected={false}
                      onSelect={() => { }}
                      trackVisaStatus
                      isPOC={false}
                      passengerInfoCreateBooking
                      index={index}
                    />
                  )}
                  containerClassName="booking-details-container-accordian no-drop-icon"
                />
              );
            })}

            <VisaPaymentDetails priceBreakDown={visaBookingStatus} />
          </div>

          {toast?.show && (
            <Toast
              variation={`notifi-variation--${toast?.status}`}
              description={toast?.description}
              autoDismissTimeer={3000}
              onClose={() => setEmailToaster({ show: false, description: '', status: '' })}
            />
          )}
        </div>
      </>
    ) : <VisaSrpShimmer />
  );
};

VisaBookingDetails.propTypes = {
  bookingId: PropTypes.string,
  pnr: PropTypes.string,
};

export default VisaBookingDetails;
