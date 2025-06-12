import React, { useState, useEffect, useRef } from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import FAQ from './FAQ/FAQ';
import PlanDisclaimer from './PlanDisclaimer';
import DocumentRequired from './DocumentRequired';
import ImportantInfo from './ImportantInfo';
import VisaScheduleHolidays from './VisaScheduleHolidays';
import { AppContext } from '../../context/AppContext';
import VisaServiceFooterComponent from '../commonComponents/VisaFooter';
import VisaSrpPlan from './VisaSrpPlan';
import VisaPlanNote from './VisaPlanNote/VisaPlanNote';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';
import { pushAnalytic } from '../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../utils/analytic';
import { getVisaPlanSummary } from '../../services';
import VisaSrpShimmer from '../commonComponents/Shimmer/VisaSrpShimmer';
import useHeightAdjustments from '../../hook/useHeightAdjustments';

const VisaPlanDetails = () => {
  const {
    state: {
      visaPlanDetailsByPath,
      selectedVisaDetails,
      visaReviewApplicationByPath = {},
      selectedVisaPax,
      visaAllQuotations,
      visaPlanDetailsByPathSrp,
      getItineraryDetails,
      showFullVisaBookingWidget,
    },
    dispatch,
  } = React.useContext(AppContext);

  const planDetailsRef = useRef(null);
  const disclaimerRef = useRef(null);
  const scheduleRef = useRef(null);
  const documentsRef = useRef(null);
  const infoRef = useRef(null);
  const faqRef = useRef(null);
  const [getVisaCountryDetail, setVisaCountryDetail] = useState(null);
  const [getAllVisaQuotes] = useState(selectedVisaDetails || null);
  const [visaShedule, setVisaShedule] = useState(null);
  const [visaQutoe, setVisaQuote] = useState(null);
  const [activeSection, setActiveSection] = useState('planDetails'); // Track active section
  const [activeIndex] = useState([0]);
  const [isFooterShow, setIsFooterShow] = useState(true);
  const [footerHeight, setFooterHeight] = useState(0);

  const {
    leftNavSectionTitlesList, sectionHeadingsList, timingsHolidaysLabel,
    visaApplicationTitle,
  } = visaPlanDetailsByPath || {};
  const { visaDetailsLabel } = visaReviewApplicationByPath || {};

  useEffect(() => {
    if (!getVisaCountryDetail && visaAllQuotations) {
      setVisaCountryDetail(visaAllQuotations);
    }
  }, [getVisaCountryDetail, visaAllQuotations]);
  useEffect(() => {
    if (visaShedule === null) {
      const getVisaPlanApiCalling = async () => {
        const response = await getVisaPlanSummary(selectedVisaDetails?.quoteId);
        if (response?.data) {
          setVisaQuote(response?.data);
          setVisaShedule(response?.data?.expectationJourney);
        }
        return null;
      };
      getVisaPlanApiCalling();
    }
  }, [visaShedule]);

  const sectionHeadingMap = sectionHeadingsList?.reduce((acc, section) => {
    acc[section.key] = section;
    return acc;
  }, {});

  // Scroll to the corresponding section
  const handleNavClick = (sectionId) => {
    let ref = null;
    switch (sectionId) {
      case 'planDetails':
        ref = planDetailsRef;
        break;
      case 'planDisclaimer':
        ref = disclaimerRef;
        break;
      case 'visaSchedule':
      case 'timingHolidays':
        ref = scheduleRef;
        break;
      case 'documentsRequired':
        ref = documentsRef;
        break;
      case 'importantInformation':
        ref = infoRef;
        break;
      case 'faq':
        ref = faqRef;
        break;
      default:
        break;
    }
    if (ref && ref.current) {
      const topPosition = ref.current.offsetTop - 60;
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  const handleContinueCTA = () => {
    const obj = {
      event: AA_CONSTANTS.visaReview,
      data: {
        _event: EVENTS_NAME.VISA_INITIATED,
        _eventInfoName: 'Continue',
        _componentName: AA_CONSTANTS.Visa_Plan,
        pnrResponse: {
          bookingDetails: getItineraryDetails?.bookingDetails || '',
          passengers: selectedVisaPax,
          sector: visaAllQuotations?.data?.country || '',
        },
        pageName: AA_CONSTANTS.Visa_Details,
      },
    };
    pushAnalytic(obj);
    dispatch({ type: 'PAGE_SECTION_TYPE', payload: 'visa-traveller-details' });
  };

  const footerProps = {
    handleClick: handleContinueCTA,
    buttonText: 'Continue',
    buttonProps: {
      disabled: false,
    },
    setFooterHeight,
  };
  // call when footerHeight set
  useHeightAdjustments(footerHeight);

  const { data } = visaAllQuotations;

  if (!visaQutoe && !visaAllQuotations && !visaAllQuotations?.data?.staticImageUrl) {
    return <VisaSrpShimmer />;
  }

  useEffect(() => {
    // hide footer button when booking wedgit was active
    setIsFooterShow(!showFullVisaBookingWidget);
  }, [showFullVisaBookingWidget]);

  return (
    <>
      <VisaHeaderSection headingText={visaDetailsLabel || 'Visa Details'} />
      <div className="visa-plan-main-container">
        {/* Left Navigation */}
        <div className="visa-plan-main-container__left-nav">
          <ul>
            {leftNavSectionTitlesList?.map((item) => (
              <li
                aria-hidden="true"
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={activeSection === item.key ? 'active' : ''}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Sections */}
        <div className="visa-plan-wrapper">
          <div className="visa-plan-wrapper__visa-application" ref={planDetailsRef}>
            <div className="doc-heading">
              <HtmlBlock
                html={visaApplicationTitle?.html?.replace('{country}', getAllVisaQuotes?.countryName)}
              />
            </div>
          </div>

          <div className="visa-plan-wrapper__visa-image">
            <img
              src={visaAllQuotations?.data?.staticImageUrl || ''}
              alt="staticImageUrl"
            />
          </div>

          {data?.announcement && (
            <VisaPlanNote
              noteTypeClass="embassy-note"
              title=""
              iconClass={visaPlanDetailsByPathSrp?.pleaseNoteLabel[0]?.icon}
              message={visaPlanDetailsByPathSrp?.pleaseNoteLabel[0]?.value}
            />
          )}

          <VisaSrpPlan
            adultPrice={selectedVisaDetails?.totalPriceAdult}
            childPrice={selectedVisaDetails?.totalPriceChild}
            currency={getAllVisaQuotes?.currency}
            validity={getAllVisaQuotes?.validity}
            stayPeriod={getAllVisaQuotes?.stayPeriod}
            purpose={getAllVisaQuotes?.purpose}
            entryType={getAllVisaQuotes?.entryType}
            processing={getAllVisaQuotes?.processingTime}
            processingType={getAllVisaQuotes?.processingType}
            journeyTime={visaQutoe?.displayQuotes?.journeyTime}
          />

          <div
            ref={disclaimerRef}
            id="disclaimer"
            className="visa-plan-wrapper__visa-plan-card"
          >
            <div className="doc-heading">
              <HtmlBlock
                html={sectionHeadingMap?.planDisclaimer?.description?.html}
              />
            </div>
            {selectedVisaDetails?.disclaimers?.length > 0
              ? (
                <PlanDisclaimer
                  disclaimer={selectedVisaDetails?.disclaimers || []}
                />
              ) : null}
          </div>

          <div
            ref={scheduleRef}
            id="visaSchedule"
            className="visa-plan-wrapper__visa-plan-card"
          >
            <VisaScheduleHolidays
              heading={sectionHeadingsList}
              timingsHolidaysLabel={timingsHolidaysLabel}
              visaSheduleData={visaShedule}
              timeHolidaysData={visaPlanDetailsByPath?.timingsHolidaysList}
              setIsFooterShow={setIsFooterShow}
            />
          </div>

          <div
            ref={documentsRef}
            id="documentsRequired"
            className="visa-plan-wrapper__visa-plan-card py-0"
          >
            <Accordion
              activeIndex={activeIndex}
              accordionData={[{
                title:
  <div className="doc-heading">
    <HtmlBlock
      html={sectionHeadingMap?.documentsRequired?.description?.html}
    />
  </div>,
                renderAccordionContent: <DocumentRequired
                  data={visaAllQuotations?.data?.documentRequired || {}}
                  aemContent={visaPlanDetailsByPathSrp}
                  announcement={visaAllQuotations?.data?.announcement}
                />,
              }]}
              setActiveIndex={() => { }}
              initalActiveIndexes={activeIndex}
              isMultiOpen
            />
          </div>

          <div
            ref={infoRef}
            id="importantInformation"
            className="visa-plan-wrapper__visa-plan-card  py-0"
          >
            <Accordion
              activeIndex={activeIndex}
              accordionData={[{
                title:
  <div className="doc-heading">
    <HtmlBlock
      html={sectionHeadingMap?.importantInformation?.description?.html}
    />
  </div>,
                renderAccordionContent: <ImportantInfo data={visaAllQuotations?.data?.importantInfo || []} />,
              }]}
              setActiveIndex={() => { }}
              initalActiveIndexes
              isMultiOpen
            />
          </div>

          <div
            ref={faqRef}
            id="faq"
            className="visa-plan-wrapper__visa-plan-card py-0"
          >

            <Accordion
              accordionData={[{
                title:
  <div className="doc-heading">
    <HtmlBlock
      html={sectionHeadingMap?.faq?.description?.html}
    />
  </div>,
                renderAccordionContent: <FAQ data={visaAllQuotations?.data?.faqs || {}} />,
              }]}
              setActiveIndex={() => { }}
              initalActiveIndexes
              isMultiOpen
            />
          </div>
        </div>

      </div>
      {isFooterShow && <VisaServiceFooterComponent {...footerProps} />}
    </>

  );
};

export default VisaPlanDetails;
