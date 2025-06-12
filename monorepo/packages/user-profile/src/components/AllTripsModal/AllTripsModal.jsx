import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Slider from '../Slider/Slider';
import ModalJourneyList from './ModalJourneyList';
import { TRIP_TYPE } from '../../constants';

const AllTripsModal = ({
  onClose,
  contactUsData,
  upcomingJourneyData,
  pastJourneyData,
  handleSearch,
  defaultOpenTab,
  handleTripModalClose,
  iataList,
  setIsLoading
}) => {
  const [slide, setSlide] = useState(false);
  const [selectedTab, setSelectedTab] = useState(defaultOpenTab);
  useEffect(() => {
    setSlide(true);
  }, []);

  const handleTabSwitch = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Slider
      customClass="trip-summary-details-modal"
      open={slide}
      closeHandler={onClose}
      delay={500}
    >
      <div className="trip-summary-details" id="trip-slider-bg">
        <div className="trip-summary-details__head">
          <button
            type="button"
            className="trip-summary-details__close"
            onClick={onClose}
            aria-label="close-button"
          >
            <span className="icon-close-simple" />
          </button>
        </div>
        <div className="trip-summary-details__labels">
          <div className="my-trips-label">{contactUsData?.myTripsTitle}</div>
          <div className="your-trips-info-label">
            <HtmlBlock html={contactUsData?.yourTripsInfo?.html} />
          </div>
        </div>
        <div className="trip-summary-details__tabs">
          <div className="modal-trips-tabs-container">
            <Button
              classNames={selectedTab === TRIP_TYPE.UPCOMING ? '' : 'btn-white'}
              variant={
                selectedTab === TRIP_TYPE.UPCOMING ? 'filled' : 'outline'
              }
              onClick={() => handleTabSwitch(TRIP_TYPE.UPCOMING)}
            >
              {contactUsData?.upcomingTripsLabel}
            </Button>
            <Button
              classNames={selectedTab === TRIP_TYPE.PAST ? '' : 'btn-white'}
              variant={selectedTab === TRIP_TYPE.PAST ? 'filled' : 'outline'}
              onClick={() => handleTabSwitch(TRIP_TYPE.PAST)}
            >
              {contactUsData?.pastTripsLabel}
            </Button>
          </div>
        </div>
        {selectedTab === TRIP_TYPE.UPCOMING && (
          <ModalJourneyList
            contactUsData={contactUsData}
            journeys={upcomingJourneyData}
            handleSearch={handleSearch}
            handleTripModalClose={handleTripModalClose}
            selectedTab={selectedTab}
            iataList={iataList}
            setIsLoading={setIsLoading}
          />
        )}
        {selectedTab === TRIP_TYPE.PAST && (
          <ModalJourneyList
            contactUsData={contactUsData}
            journeys={pastJourneyData}
            handleSearch={handleSearch}
            handleTripModalClose={handleTripModalClose}
            selectedTab={selectedTab}
            iataList={iataList}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </Slider>
  );
};

AllTripsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  contactUsData: PropTypes.object,
  upcomingJourneyData: PropTypes.object,
  pastJourneyData: PropTypes.object,
  handleSearch: PropTypes.func,
  defaultOpenTab: PropTypes.string,
  handleTripModalClose: PropTypes.func,
};

export default AllTripsModal;
