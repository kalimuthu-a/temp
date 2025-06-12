import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import TripCard from '../TripCard/TripCard';

const ModalJourneyList = ({
  journeys,
  contactUsData,
  handleSearch,
  handleTripModalClose,
  selectedTab,
  iataList,
  partnerData,
  setIsLoading
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const fallbackCount = 10;
  const pageSize = contactUsData?.resultsPerLoad || fallbackCount;
  const visibleJourneys = journeys?.slice(0, (currentPage + 1) * pageSize);
  const loadMore = () => {
    setIsLoadMoreLoading(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoadMoreLoading(false);
    }, 0);
  };
  return (
    <>
      <div className="trip-summary-details__body">
        <div className="modal-trips-container">
          <div className="modal-cards-container">
            {visibleJourneys?.length ? (
              visibleJourneys?.map((journey, tripIndex) => (
                <TripCard
                  key={journey?.recordLocator}
                  paxNum={journey?.numberOfPassengers}
                  journeyArray={journey?.journey}
                  bookingStatus={journey?.bookingStatus}
                  paymentStatus={journey?.paymentStatus}
                  recordLocator={journey?.recordLocator}
                  lastName={journey?.lastName}
                  activeTab={selectedTab}
                  contactUsData={contactUsData}
                  handleSearch={handleSearch}
                  handleTripModalClose={handleTripModalClose}
                  additionalClass="modal-card"
                  setIsLoading={setIsLoading}
                  iataList={iataList}
                  partnerData={{
                    isPartnerFlight: journey?.locators?.recordLocators?.[0]
                      ?.recordCode
                      ? true
                      : false,
                    partnerPnr:
                      journey?.locators?.recordLocators?.[0]?.recordCode,
                    partnerStatus:
                      journey?.locators?.recordLocators?.[0]?.bookingStatus,
                    partnerImgUrl: contactUsData?.codeShare?.find(
                      (cItem) =>
                        cItem?.carrierCode ===
                        journey?.locators?.recordLocators?.[0]
                          ?.owningSystemCode,
                    )?.carrierCodeIcon?._publishUrl,
                  }}
                  tripIndex={tripIndex % pageSize}
                />
              ))
            ) : (
              <div className="no-trips-container">
                <i className={contactUsData?.noTripsIcon} />
                <HtmlBlock html={contactUsData?.noTripsFoundLabel?.html} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="trip-summary-details__button">
        {visibleJourneys?.length < journeys?.length && (
          <Button variant="filled" onClick={loadMore} loading={isLoadMoreLoading}>
            {contactUsData?.loadMoreLabel}
          </Button>
        )}
      </div>
    </>
  );
};
ModalJourneyList.propTypes = {
  contactUsData: PropTypes.object,
  journeys: PropTypes.object,
  handleSearch: PropTypes.func,
  handleTripModalClose: PropTypes.func,
  selectedTab: PropTypes.string,
};
export default ModalJourneyList;
