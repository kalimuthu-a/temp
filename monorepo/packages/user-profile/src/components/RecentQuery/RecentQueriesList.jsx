import React, { useEffect, useRef, useState } from 'react';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import PropTypes from 'prop-types';
import { formatDateTime, renderBookingStatusForQueries } from '../../utils/utilFunctions';
import RoundedTabs from '../common/RoundedTabs/RoundedTabs';
import { BROWSER_STORAGE_KEYS, QUESRIES, URLS } from '../../constants';
import aemService from '../../services';
import { getRecentQueries } from '../../services/recentQueries.service';
import { LOGIN_SUCCESS } from '../../constants/common';

const defaultTab = 'Initiated';
const RecentQueriesList = ({ loadingImage }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);
  const [activeTab, setActiveTabs] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [aemData, setAemData] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(Cookies.get('auth_user', true, true));

  const pnrNumberRef = useRef(null);
  const urlParams = new URLSearchParams(window.location.search);
  const getPNRNumber = urlParams.get('pnr') || '';

  const renderAccordionContent = (query) => {
    const { recordHistory, subject } = query;
    return (
      <div className="info-contact-us-recent-queries-body">
        <div className="info-contact-us-recent-queries-steps">
          {recordHistory?.map((record, index) => {
            return (
              <div key={index} className="info-contact-us-recent-queries-content">
                <div className={`info-contact-us-recent-queries-icon ${record?.createdDate ? renderBookingStatusForQueries(record?.newValue)[1] : 'icon-disabled'}`} >
                  <span className={`icon-size-lg ${renderBookingStatusForQueries(record?.newValue)[2]}`}></span>
                </div>
                <div>
                  {record?.createdDate && (<span>{formatDateTime(record?.createdDate).formattedDateMonthWithFullYear}</span>)}
                  <h4>{renderBookingStatusForQueries(record?.newValue)[0]}</h4>
                  {!record?.createdDate && (<span>-----</span>)}
                </div>
              </div>
            );
          })}
        </div>
        {subject && (
          <div className="info-contact-us-recent-queries-info">{subject}</div>
        )}
      </div>
    );
  };

  const renderAccordionHeader = (query) => {
    const { caseNumber, dateTimeOpened, pnrNumber, status, subCategory } = query;
    return (
      <div className="d-flex info-contact-us-recent-queries-header-main">
        <div className="info-contact-us-recent-queries-header-left">
          <p>{aemData?.ticketIdLabel} {caseNumber}</p>
          <span>{pnrNumber && `${aemData?.pnrLabel} ${pnrNumber}`} {(subCategory && pnrNumber) && '|'} {subCategory}</span>
        </div>
        <div className="info-contact-us-recent-queries-header-right">
          <div>
            <span className={`info-contact-us-recent-queries-label ${renderBookingStatusForQueries(status)[1]}`}>
              {renderBookingStatusForQueries(status)[0]}
            </span>
          </div>
          <span className="recent-queries-date">{formatDateTime(dateTimeOpened).formattedDateMonthWithFullYear}</span>
        </div>
      </div>
    );
  };

  const setTab = async (e) => {
    setActiveTabs(e.target.name);
  };

  const tabsList = [
    {
      title: aemData?.initiatedLabel,
      onClickHandler: setTab,
    },
    {
      title: aemData?.completedLabel,
      onClickHandler: setTab,
    },
  ];

  const filterQueriesData = (accordionData) => {
    if (activeTab === aemData?.initiatedLabel) {
      setFilteredData(
        accordionData?.filter(
          (item) => item.status === QUESRIES.QUESRIES_STATUS.OPEN || item.status === QUESRIES.QUESRIES_STATUS_LABEL.WORK_IN_PROGRESS,
        ),
      );
    } else {
      setFilteredData(
        accordionData?.filter((item) => item.status === QUESRIES.QUESRIES_STATUS.RESOLVED),
      );
    }
  };

  const onLoginSuccess = () => {
    const loggedInUserData = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || false;
    setLoggedInUser(loggedInUserData);
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getRecentQueries({ email: loggedInUser?.email, number: loggedInUser?.mobileNumber }),
      aemService(URLS.AEM_GET_RECENT_QUERIES_DATA, 'data.contactUsRecentQueriesByPath.item'),
    ]).then((response) => {
      const [apiResponse, recentQueriesAEM] = response;
      setRecentQueries(apiResponse.records);
      setAemData(recentQueriesAEM);
      setIsLoading(false);
    });

    document.addEventListener(LOGIN_SUCCESS, onLoginSuccess);
    onLoginSuccess();
  }, []);

  useEffect(() => {
    const accordionData = recentQueries?.map((query) => ({ ...query,
      renderAccordionHeader: renderAccordionHeader(query),
      renderAccordionContent: renderAccordionContent(query),
      containerClassName: `pnr-${query.pnrNumber}` }));
    filterQueriesData(accordionData);
    if (!pnrNumberRef.current && getPNRNumber && recentQueries?.length) {
      const findElement = accordionData?.find((item) => item.pnrNumber === getPNRNumber);
      if (findElement) {
        setActiveTabs(
          findElement?.status === QUESRIES.QUESRIES_STATUS.CLOSED ? aemData?.completedLabel : aemData?.initiatedLabel,
        );
      }
    }
  }, [recentQueries, activeTab]);

  useEffect(() => {
    if (!pnrNumberRef.current) {
      const element = document.querySelector(`.pnr-${getPNRNumber}`);
      if (element) {
        pnrNumberRef.current = filteredData?.filter((item) => item?.pnrNumber === getPNRNumber)?.length;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - 100;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  }, [filteredData]);

  if (!loggedInUser) {
    return null;
  }

  return (
    isLoading ? (
      <div className="skyplus-loader skyplus-loader-overlay">
        <div className="h-100 d-flex align-items-center">
          <div className="payment-page-intermediate-orchestrator-dynamic__flight-animation">
            <img src={loadingImage} alt="loader" />
          </div>
        </div>
      </div>
    ) : (
      <div className={window.pageType}>
        <div className="recent-queries-tabs mb-10">
          <RoundedTabs activeTab={activeTab} list={tabsList} variation="tabs" />
        </div>
        {filteredData?.length
          ? (
            <Accordion
              accordionData={filteredData}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              isMultiOpen={false}
              initalActiveIndexes={[filteredData.findIndex((item) => item?.pnrNumber === getPNRNumber)]}
            />
          ) : (
            <div className="text-center recent-queries-empty">
              <i className={`icon-size-lg ${aemData?.noTripsIcon}`} />
              <HtmlBlock
                html={aemData?.noTripsFoundLabel?.html}
              />
            </div>
          )}
      </div>
    )
  );
};

RecentQueriesList.propTypes = {
  loadingImage: PropTypes.string,
};

export default RecentQueriesList;
