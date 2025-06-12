/* eslint-disable */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { TRIP_TYPE } from '../../constants';

import TripCard from '../TripCard/TripCard';
import AllTripsModal from '../AllTripsModal/AllTripsModal';
import Loader from '../common/Loader/Loader';

import { getBookingList } from '../../services/bookingList.service';

const TripPlan = ({ contactUsData, handleSearch, iataList }) => {
  const [pastJourneyData, setPastJourneyData] = useState([]);
  const [upcomingJourneyData, setUpcomingJourneyData] = useState([]);
  const [activeTab, setActiveTab] = useState(TRIP_TYPE.UPCOMING);
  const [bookingParam, setBookingParam] = useState('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTripModalClose = () => {
    setIsModalOpen(false);
  };
  // TAB HANDLER FUNCTION
  const tabHandler = (tabName) => {
    setActiveTab(tabName);
    setBookingParam(tabName === TRIP_TYPE.UPCOMING ? '0' : '1');
  };
  useEffect(() => {
    async function tripsApiCaller() {
      if (!upcomingJourneyData?.length) {
        setIsLoading(true);
        const response = await getBookingList('0');
        setUpcomingJourneyData(response?.data?.currentJourney);
        setIsLoading(false);
      }
      if (!pastJourneyData?.length) {
        setIsLoading(true);
        const response = await getBookingList('1');
        setPastJourneyData(response?.data?.completedJourney);
        setIsLoading(false);
      }
    }
    tripsApiCaller();
  }, [bookingParam]);
  const journeyDetailHandler = (index) => {
    const arr =
      activeTab === TRIP_TYPE.UPCOMING ? upcomingJourneyData : pastJourneyData;
    const baseCompletedJourney = arr[index];
    const baseJourneyArray = arr[index]?.journey;
    const baseRecordLocators = arr[index]?.locators?.recordLocators;
    const isPartnerFlight = baseRecordLocators?.[0]?.recordCode ? true : false;
    const partnerImageObject=contactUsData?.codeShare?.find(
      (cItem) => cItem?.carrierCode === baseRecordLocators?.[0]?.owningSystemCode,  
    );
    const partnerData = {
      isPartnerFlight: isPartnerFlight,
      partnerPnr: baseRecordLocators?.[0]?.recordCode,
      partnerStatus: baseRecordLocators?.[0]?.bookingStatus,
      partnerImgUrl:partnerImageObject?.carrierCodeIcon?._publishUrl
    };
    const obj = {
      lastName: baseCompletedJourney?.lastName,
      recordLocator: baseCompletedJourney?.recordLocator,
      journeyKey: baseJourneyArray?.journeyKey,
      journeyArray: baseJourneyArray,
      paxNum: baseCompletedJourney?.numberOfPassengers,
      bookingStatus: baseCompletedJourney?.bookingStatus,
      paymentStatus: baseCompletedJourney?.paymentStatus,
      partnerData: partnerData,
    };
    return arr.length ? obj : {};
  };
  const renderCards = (currentActiveTab) => {
    const arr =
      currentActiveTab === TRIP_TYPE.UPCOMING
        ? upcomingJourneyData
        : pastJourneyData;
    if (arr.length > 0) {
      const iterationArray = arr?.length === 1 ? [0] : [0, 1];
      return iterationArray.map((i) => {
        return (
          <TripCard
            paxNum={journeyDetailHandler(i).paxNum}
            journeyArray={journeyDetailHandler(i).journeyArray}
            bookingStatus={journeyDetailHandler(i).bookingStatus}
            paymentStatus={journeyDetailHandler(i).paymentStatus}
            lastName={journeyDetailHandler(i).lastName}
            recordLocator={journeyDetailHandler(i).recordLocator}
            partnerData={journeyDetailHandler(i).partnerData}
            activeTab={activeTab}
            contactUsData={contactUsData}
            handleSearch={handleSearch}
            handleTripModalClose={handleTripModalClose}
            setIsLoading={(val) => setIsLoading(val)}
            iataList={iataList}
          />
        );
      });
    }
    return null;
  };
  return (
    <div className="trips-container">
      <div className="trips-tabs-container">
        <Button
          classNames={activeTab === TRIP_TYPE.UPCOMING ? '' : 'btn-white'}
          variant={activeTab === TRIP_TYPE.UPCOMING ? 'filled' : 'outline'}
          onClick={() => tabHandler(TRIP_TYPE.UPCOMING)}
        >
          {contactUsData?.upcomingTripsLabel}
        </Button>
        <Button
          classNames={activeTab === TRIP_TYPE.PAST ? '' : 'btn-white'}
          variant={activeTab === TRIP_TYPE.PAST ? 'filled' : 'outline'}
          onClick={() => tabHandler(TRIP_TYPE.PAST)}
        >
          {contactUsData?.pastTripsLabel}
        </Button>
      </div>
      <div className="trips-cards-container">
        {!isLoading ? (
          activeTab === TRIP_TYPE.UPCOMING ? (
            upcomingJourneyData?.length ? (
              <>{renderCards(TRIP_TYPE.UPCOMING)}</>
            ) : (
              <div className="no-trips-container">
                <i className={contactUsData?.noTripsIcon} />
                <HtmlBlock html={contactUsData?.noTripsFoundLabel?.html} />
              </div>
            )
          ) : pastJourneyData?.length ? (
            <>{renderCards(TRIP_TYPE.PAST)}</>
          ) : (
            <div className="no-trips-container">
              <i className={contactUsData?.noTripsIcon} />
              <HtmlBlock html={contactUsData?.noTripsFoundLabel?.html} />
            </div>
          )
        ) : (
          <div className="trip-plan-loader">
            <Loader />
          </div>
        )}
      </div>

      <div className="viewall-btn-container">
        {(activeTab === TRIP_TYPE.UPCOMING && upcomingJourneyData?.length) ||
        (activeTab === TRIP_TYPE.PAST && pastJourneyData?.length) ? (
          <Button
            variant="outline"
            classNames="viewall-btn"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {contactUsData?.viewAllCta}
          </Button>
        ) : (
          <></>
        )}
      </div>
      {isModalOpen && (
        <AllTripsModal
          onClose={() => setIsModalOpen(false)}
          upcomingJourneyData={upcomingJourneyData}
          pastJourneyData={pastJourneyData}
          contactUsData={contactUsData}
          handleSearch={handleSearch}
          defaultOpenTab={activeTab}
          handleTripModalClose={handleTripModalClose}
          setIsLoading={(val) => setIsLoading(val)}
          iataList={iataList}
        />
      )}
    </div>
  );
};
TripPlan.propTypes = {
  contactUsData: PropTypes.object.isRequired,
  iataList: PropTypes.object,
};
export default TripPlan;
