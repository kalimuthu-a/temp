import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import { AppContext } from '../../context/AppContext';
import FAQ from '../VisaPlanDetails/FAQ/FAQ';
import DocumentRequired from '../VisaPlanDetails/DocumentRequired';
import ImportantInfo from '../VisaPlanDetails/ImportantInfo';
import { getCountryDetailsGroupedByName, getVisaPlanSummary } from '../../services';
import { visaServiceActions } from '../../context/reducer';
import VisaPlanNote from '../VisaPlanDetails/VisaPlanNote/VisaPlanNote';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';

const VisaStaticPage = ({ countryName }) => {
  const {
    state: {
      visaPlanDetailsByPath,
      selectedVisaDetails = {},
      visaReviewApplicationByPath = {},
      visaAllQuotations = {},
      visaPlanDetailsByPathSrp = {},
    },
    dispatch,
  } = React.useContext(AppContext);

  useSidePanelAdjustments(true);

  const planDetailsRef = useRef(null);
  const disclaimerRef = useRef(null);
  const scheduleRef = useRef(null);
  const documentsRef = useRef(null);
  const infoRef = useRef(null);
  const faqRef = useRef(null);
  const activeIndex = [0];
  const [getVisaCountryDetail, setVisaCountryDetail] = useState(null);
  const [getAllVisaQuotes] = useState(selectedVisaDetails || null);
  const [visaShedule, setVisaShedule] = useState(null);
  const [activeSection, setActiveSection] = useState('planDetails'); // Track active section
  const [filteredData, setFilteredData] = useState([]);

  const {
    leftNavSectionTitlesList, sectionHeadingsList,
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
          setVisaShedule(response?.data?.expectationJourney);
        }
        return null;
      };
      getVisaPlanApiCalling();
    }
  }, [visaShedule]);

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

  useEffect(() => {
    if (countryName) {
      let failedApiCall = false;
      const getVisaData = async () => {
        const response = await getCountryDetailsGroupedByName(countryName);
        if (response?.error) {
          failedApiCall = true;
          return;
        }

        dispatch({
          type: visaServiceActions.GET_VISA_QUOTATIONS,
          payload: response,
        });
      };
      if (!failedApiCall && !visaAllQuotations) {
        getVisaData();
      }
    }
  }, [visaAllQuotations]);

  useEffect(() => {
    if (countryName) {
      const fdata = leftNavSectionTitlesList?.filter((item) => item.key !== 'planDisclaimer'
        && item.key !== 'visaSchedule'
        && item.key !== 'timingHolidays');
      setFilteredData(fdata);
    } else {
      setFilteredData(leftNavSectionTitlesList);
    }
  }, [leftNavSectionTitlesList]);

  const { data } = visaAllQuotations || {};

  return (
    <>
      <VisaHeaderSection headingText={visaDetailsLabel || 'Visa Details'} />
      <div className="visa-plan-main-container">
        {/* Left Navigation */}
        <div className="visa-plan-main-container__left-nav">
          <ul>
            {filteredData?.map((item) => (
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
                html={visaApplicationTitle?.html?.replace('{country}', getAllVisaQuotes?.countryName || countryName)}
              />
            </div>
          </div>

          <div className="visa-plan-wrapper__visa-image">
            <img src={visaAllQuotations?.data?.staticImageUrl || ''} alt="staticImageUrl" loading="lazy" />
          </div>

          {data?.announcement && (
            <VisaPlanNote
              noteTypeClass="embassy-note"
              title=""
              iconClass={visaPlanDetailsByPathSrp?.pleaseNoteLabel[0]?.icon}
              message={visaPlanDetailsByPathSrp?.pleaseNoteLabel[0]?.value}
            />
          )}

          <div
            ref={documentsRef}
            id="documentsRequired"
            className="visa-plan-wrapper__visa-plan-card"
          >
            <Accordion
              activeIndex={activeIndex}
              accordionData={[{
                title:
  <div className="doc-heading">
    <HtmlBlock
      html={sectionHeadingsList?.[2]?.description?.html}
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
            className="visa-plan-wrapper__visa-plan-card"
          >
            <Accordion
              activeIndex={activeIndex}
              accordionData={[{
                title:
  <div className="doc-heading">
    <HtmlBlock
      html={sectionHeadingsList?.[3]?.description?.html}
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
            className="visa-plan-wrapper__visa-plan-card"
          >

            <Accordion
              accordionData={[{
                title:
  <div className="doc-heading">
    <HtmlBlock
      html={sectionHeadingsList?.[4]?.description?.html}
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
    </>

  );
};

export default VisaStaticPage;

VisaStaticPage.propTypes = {
  countryName: PropTypes.string,
};
