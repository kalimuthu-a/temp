import React, { useEffect, useState } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import VisaUploadDoc from './VisaUploadDocuments';
import { AppContext } from '../../context/AppContext';
import VisaServiceFooterComponent from '../commonComponents/VisaFooter';
import BookingSummary from '../commonComponents/BookingSummary/BookingSummary';
import VisaPaxAccordionWrapper, {
  VisaPaxCard,
} from '../commonComponents/VisaPaxSelection/VisaPaxAccordionWrapper';
import { formatCurrencyFunc, formatDate, UTIL_CONSTANTS } from '../../utils';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';
import { STEPLIST } from '../../constants';
import MobileBookingSummary from '../commonComponents/BookingSummary/BookingMobileSummary';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';
import { pushAnalytic } from '../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../utils/analytic';
import { getAllListOfDocument } from '../../services';
import UploadDocumentsShimmer from '../commonComponents/Shimmer/UploadDocumentsShimmer';
import useHeightAdjustments from '../../hook/useHeightAdjustments';

const VisaUploadDocuments = () => {
  const {
    state: {
      visaUploadDocumentsByPath,
      visaBookingSummaryByPath,
      createdVisaBookingDetails,
      getItineraryDetails,
      visaTravelerDetailByPath,
      selectedVisaDetails,
      visaBookingDetailsByPath,
      uploadedDocumentList,
      visaAllQuotations,
    },
    dispatch,
  } = React.useContext(AppContext);

  const { stayLabel, validityLabel } = visaBookingDetailsByPath || {};

  const {
    totalLabel,
    forTotalTravellersLabel,
    viewDetailsCta,
  } = visaTravelerDetailByPath || {};

  const [isMobile] = useIsMobile();
  const [showBookingDetailsMobile, setshowBookingDetailsMobile] = useState(false);

  const {
    passportLabel,
    nextCtaLabel,
    statusBarTitle,
    touristVisaLabel,
  } = visaUploadDocumentsByPath || {};

  // side pannel adjustMent
  useSidePanelAdjustments(true);
  const bookingDetails = createdVisaBookingDetails;
  const [viewDetail, setViewDetail] = useState(true);
  const { bookingAmount, dateOfTravel, travelerDetails } = bookingDetails || {};
  const [documentList, setDpcumentList] = useState([]);
  const [uploadCount, setUploadCount] = useState({});
  const [footerHeight, setFooterHeight] = useState(0);

  // State to track uploaded documents for each passenger
  const [uploadedDocumentsByPassenger, setUploadedDocumentsByPassenger] = useState(uploadedDocumentList || {});

  useEffect(() => {
    if (createdVisaBookingDetails) {
      const fetchBookingStatus = async () => {
        const listOfDoc = await getAllListOfDocument(
          createdVisaBookingDetails,
          getItineraryDetails?.bookingDetails?.recordLocator,
        );
        if (listOfDoc) setDpcumentList(listOfDoc);
      };
      fetchBookingStatus();
    }
  }, [createdVisaBookingDetails]);

  const totalCountOfUploadedFiles = Object.values(uploadedDocumentsByPassenger)
    ?.reduce((total, currentArray) => total + currentArray.length, 0);

  const updateUploadedDocuments = (travelerId, document) => {
    setUploadedDocumentsByPassenger((prevState) => {
      const updatedState = { ...prevState };
      const passengerDocuments = updatedState[travelerId] || [];
      const existingDocumentIndex = passengerDocuments.findIndex(
        (doc) => doc[document.document.fieldName],
      );
      if (existingDocumentIndex !== -1) {
        // Replace the existing document with the new one
        passengerDocuments[existingDocumentIndex] = { [document.document.fieldName]: document.file };
      } else {
        passengerDocuments.push({ [document.document.fieldName]: document.file });
      }
      updatedState[travelerId] = passengerDocuments;
      return updatedState;
    });
  };

  /* Remove Uploaded document */
  const removeUploadedDocuments = (travelerId, fieldName) => {
    setUploadedDocumentsByPassenger((prevState) => {
      const updatedState = { ...prevState };
      const selectedTraveller = updatedState[travelerId];
      const updatedArray = selectedTraveller.filter((item) => {
        return Object.keys(item)[0]?.toLocaleLowerCase() !== fieldName?.toLocaleLowerCase();
      });
      updatedState[travelerId] = updatedArray;
      return updatedState;
    });
  };

  useEffect(() => {
    dispatch({ type: 'UPLOAD_DOCUMENT_LIST', payload: uploadedDocumentsByPassenger });
  }, [uploadedDocumentsByPassenger]);

  const handleContinueCTA = () => {
    try {
      // abode analytic
      const obj = {
        event: AA_CONSTANTS.visaClick,

        data: {
          pageName: AA_CONSTANTS.Visa_Upload_Documents,
          _event: EVENTS_NAME.CTA_CLICK,
          _eventInfoName: AA_CONSTANTS.Next,
          _componentName: AA_CONSTANTS.Upload_Document,
          pnrResponse: { bookingDetails: getItineraryDetails?.bookingDetails || {} },
        },
      };
      pushAnalytic(obj);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while processing visa details:', error);
    }

    dispatch({ type: 'PAGE_SECTION_TYPE', payload: 'visa-review' });
  };
  const numberOfDocuments = documentList && Object.values(documentList).reduce((sum, arr) => sum + arr.length, 0);
  const footerProps = {
    handleClick: handleContinueCTA,
    buttonText: nextCtaLabel || 'Next',
    buttonProps: {
      disabled: (numberOfDocuments || 0) !== totalCountOfUploadedFiles,
    },
    totalText: totalLabel,
    paxDetail: forTotalTravellersLabel?.replace('{}', travelerDetails?.length),
    totalAmount: formatCurrencyFunc({
      price: bookingAmount,
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
    travelerCount: `${travelerDetails?.length} ${visaBookingSummaryByPath?.travelerLabel}`,
    paymenttitle: visaBookingSummaryByPath?.paymentSummaryLabel,
    departureText: visaBookingSummaryByPath?.departingLabel,
    departureDate: formatDate(dateOfTravel, UTIL_CONSTANTS.DATE_SPACE_DDMMYYYY),
    visaText: touristVisaLabel?.html?.replace('{Country}', selectedVisaDetails?.countryName),
    visaDays: `${selectedVisaDetails?.stayPeriod} 
    | ${selectedVisaDetails?.entryType} 
    | ${validityLabel} : ${selectedVisaDetails?.validity}<br/> 
      ${stayLabel} : ${selectedVisaDetails?.stayPeriod} `,
    visaAmount: formatCurrencyFunc({
      price: bookingAmount,
      currencycode: 'INR',
    }),
    visaProgressStatus: STEPLIST.UPLOAD_DOCUMENT,
  };

  const uploadDocument = (count, id) => {
    const isAvailable = Object.prototype.hasOwnProperty.call(uploadCount, id);
    if (isAvailable) {
      uploadCount[id] = count;
    }
    setUploadCount(uploadCount);
  };

  useEffect(() => {
    // tsd on page load
    const obj = {
      event: AA_CONSTANTS.visaPageLoad,
      data: {
        _event: EVENTS_NAME.UPLOAD_VISA_LOAD,
        pageName: AA_CONSTANTS.Visa_Upload_Documents,
        productInfo: {
          pnr: getItineraryDetails?.bookingDetails?.recordLocator || '',
          sector: visaAllQuotations?.data?.country || '',
        },
        pageInfo: {
          uploadViewed: 1,
        },
      },
    };
    pushAnalytic(obj);

    // Hiding booking widget from traveller details
    const bookingheaderEle = document.querySelector('.booking-widget-header');
    if (!isMobile && bookingheaderEle) {
      bookingheaderEle.style.display = 'none';
    }

    // check document count from previous screen
    if (uploadedDocumentList) {
      const uploadDoc = {};

      Object.keys(uploadedDocumentList).forEach((pax) => {
        const findLength = uploadedDocumentList[pax].length;
        uploadDoc[pax] = findLength;
      });
      setUploadCount(uploadDoc);
    }
  }, []);

  const visaPaxCardRenederer = (passenger, index) => {
    return (
      <VisaPaxCard
        key={passenger?.passortNumber}
        pax={passenger}
        isSelected={false}
        onSelect={() => { }}
        trackVisaStatus
        passportLabel={passportLabel || 'passport -'}
        isPOC={false}
        passengerInfoCreateBooking
        index={index}
      />
    );
  };

  useEffect(() => {
    const passengerList = bookingDetails?.travelerDetails;
    const docUpload = {};
    if (passengerList && !uploadedDocumentList) {
      passengerList.forEach((list) => {
        docUpload[list.travelerId] = 0;
      });
      setUploadCount(docUpload);
    }
  }, [bookingDetails]);

  const visaUploadDocRenderer = (passenger) => {
    const findDocument = Object.prototype.hasOwnProperty.call(documentList, passenger?.travelerId)
      ? documentList[passenger?.travelerId] : [];
    return (
      <VisaUploadDoc
        requiredDocuementsList={findDocument}
        passenger={passenger}
        visaBookingId={bookingDetails?.bookingId || ''}
        updateUploadedDocuments={updateUploadedDocuments}
        uploadedDocumentsByPassenger={uploadedDocumentsByPassenger}
        uploadCount={uploadCount}
        setUploadCount={uploadDocument}
        removeUploadedDocuments={removeUploadedDocuments}
      />
    );
  };

  const PassengerList = bookingDetails?.travelerDetails;
  const UploadDocumentListRenderer = () => {
    return PassengerList?.map((paxDetail, index) => {
      return (
        <VisaPaxAccordionWrapper
          titleComponent={visaPaxCardRenederer(paxDetail, index)}
          contentComponent={visaUploadDocRenderer(paxDetail)}
          containerClassName="visa-upload-container-accordion"
        />
      );
    });
  };
  const hasDocuments = Object.values(documentList || {}).length > 0;

  return hasDocuments ? (
    <div className="visa-upload">
      <VisaHeaderSection headingText={statusBarTitle || 'Upload document'} />
      <div className="visa-upload-section">
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
        <div className=" visa-upload-section-left">
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
          <Heading
            heading="h4"
            mobileHeading="h5"
            className="visa-pax-selection-note-block-heading "
          >
            <div className="visa-upload-section-heading">
              <HtmlBlock
                html={
                  visaUploadDocumentsByPath?.uploadDocumentsTitle?.html
                  || 'Upload Documents'
                }
              />
            </div>
          </Heading>
          <HtmlBlock
            className="visa-upload-section-des"
            html={visaUploadDocumentsByPath?.uploadDocumentsDescription?.html}
          />
          <div className="visa-upload-container">
            <UploadDocumentListRenderer />
          </div>
        </div>

        <div className="visa-upload-section-right">
          {!isMobile && (
            <BookingSummary bookingSummaryData={bookingSummaryProps} />
          )}
        </div>
      </div>
      <VisaServiceFooterComponent {...footerProps} />
    </div>
  ) : (
    <UploadDocumentsShimmer />
  );
};

export default VisaUploadDocuments;
