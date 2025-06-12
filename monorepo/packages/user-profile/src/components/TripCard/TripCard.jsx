import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import SwiperComponentV2 from 'skyplus-design-system-app/dist/des-system/SwiperComponentV2';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import JourneyLap from '../JourneyLap/JourneyLap';
import {
  flightDurationFormatter,
  formatDateTime,
} from '../../utils/utilFunctions';
import { TRIP_TYPE, BOOKINGS, URLS } from '../../constants';
import { retrievePnr } from '../../services/retrievePnr.service';
import retrieveBooking from '../../services/retrieveBooking.service';
import TooltipContent from '../common/TooltipContent/TooltipContent';
import TooltipPopover from 'skyplus-design-system-app/dist/des-system/TooltipPopover';

const TripCard = React.memo(
  ({
    paxNum,
    bookingStatus,
    journeyArray,
    lastName,
    recordLocator,
    activeTab,
    contactUsData,
    additionalClass,
    handleSearch,
    handleTripModalClose,
    setIsLoading,
    iataList,
    partnerData,
    tripIndex
  }) => {
    const [bannerImage, setBannerImage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const onClickItineraryCheck = async () => {
      try {
        setIsLoading(true);
        const response = await retrievePnr(recordLocator, lastName, true);
        if (response) {
          window.location.href = contactUsData?.viewItineraryLink;
        }
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('API Error:', error);
        setIsLoading(false);
      }
    };
    const onClickBoardingPass = async () => {
      try {
        setIsLoading(true);
        await retrieveBooking({
          recordLocator,
          lastName,
          processFlag: 'checkin',
        });
        const payload = {
          journeyKey: journeyArray[currentIndex]?.journeyKey,
          segmentKeys: [],
          passengerKeys: Object.keys(
            journeyArray?.[currentIndex]?.segment[0]?.passengerSegment || {},
          ),
        };
        localStorage.setItem('b_d_p', JSON.stringify(payload));
        window.location.href = contactUsData?.viewAllBoardingPassLink;
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line
        console.log('Error in boarding pass redirect', error);
        setIsLoading(false);
      }
    };

    const journeyTypeHandler = () => {
      if (journeyArray?.length === 1) {
        return contactUsData?.journeyTypeLabel?.oneWay;
      }
      if (journeyArray?.length > 2) {
        return contactUsData?.journeyTypeLabel?.multiCity;
      }
      if (journeyArray?.length === 2) {
        if (
          journeyArray[0]?.journeyDetail?.destination ===
            journeyArray[1]?.journeyDetail?.origin &&
          journeyArray[0]?.journeyDetail?.origin ===
            journeyArray[1]?.journeyDetail?.destination
        ) {
          return contactUsData?.journeyTypeLabel?.roundTrip;
        }
        return contactUsData?.journeyTypeLabel?.multiCity;
      }
      return '';
    };

    const renderBookingStatus = (currentBookingStatus) => {
      const {
        CONFIRMED,
        HOLD,
        HOLD_CANCELLED,
        CLOSED,
        ARCHIVED,
        PENDING_ARCHIVE,
        ARCHIVED_PRIVATE,
        PROCESSED_FOR_ARCHIVE,
        PARTIAL_COMPLETE,
      } = BOOKINGS.BOOKING_STATUS_LABEL;
      let className = '';
      let label = '';
      let iconClassName = '';
      const classNameObject = {
        bgRed: 'holdcancelled bg-red',
        bgOrange: 'bg-red',
        bgGreen: 'confirmed bg-green',
      };
      const iconClassNameObject = {
        iconCheck: 'icon-check text-forest-green',
        iconClose: 'icon-close-circle',
        iconWarn: 'icon-info text-warning',
      };
      switch (currentBookingStatus) {
        case 1:
          label = HOLD;
          className = classNameObject.bgRed;
          break;
        case 2:
          label = CONFIRMED;
          className = classNameObject.bgGreen;
          iconClassName = iconClassNameObject.iconCheck;
          break;
        case 3:
          label = CLOSED;
          className = classNameObject.bgRed;
          iconClassName = iconClassNameObject.iconClose;
          break;
        case 4:
          label = HOLD_CANCELLED;
          className = classNameObject.bgOrange;
          iconClassName = iconClassNameObject.iconClose;
          break;
        case 5:
          label = PENDING_ARCHIVE;
          className = classNameObject.bgOrange;
          iconClassName = iconClassNameObject.iconClose;
          break;
        case 6:
          label = ARCHIVED;
          className = classNameObject.bgOrange;
          iconClassName = iconClassNameObject.iconCheck;
          break;
        case 7:
          label = ARCHIVED_PRIVATE;
          className = classNameObject.bgOrange;
          iconClassName = iconClassNameObject.iconCheck;
          break;
        case 777:
          label = PROCESSED_FOR_ARCHIVE;
          className = classNameObject.bgOrange;
          iconClassName = iconClassNameObject.iconCheck;
          break;
        case 100:
          label = PARTIAL_COMPLETE;
          className = classNameObject.bgOrange;
          iconClassName = iconClassNameObject.iconWarn;
          break;
        default:
          label = '';
          className = '';
          iconClassName = '';
      }
      return [label, className, iconClassName];
    };
    const triggerFunction = (e) => {
      setCurrentIndex(e.activeIndex);
    };
    const swiperConfig = {
      direction: 'horizontal',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        enabled: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: (index, className) => {
          return `<span class="${className}"></span>`;
        },
      },
      cssMode: true,
      autoHeight: true,
      on: {
        slideChange: (e) => {
          triggerFunction(e);
        },
      },
    };
    const getPNRSummaryAemData = async (cityIATA) => {
      setBannerImage(iataList?.[cityIATA]);
    };
    const [partialBookingStatus, setPartialBookingStatus] = useState('');
    const handlePartialStatus = () => {
  
      if (
        bookingStatus===2  &&
        partnerData.partnerStatus === renderBookingStatus(2)[0]
      ) {
        setPartialBookingStatus(renderBookingStatus(2)[0]);
      } else {
        setPartialBookingStatus(renderBookingStatus(100)[0]);
      }
    };
    useEffect(() => {
      getPNRSummaryAemData(
        journeyArray[journeyArray.length - 1]?.journeyDetail?.destination,
      );
      handlePartialStatus();
    }, [journeyArray?.[0]?.journeyKey]);
    return (
      <div className={`trip-card ${additionalClass || ''}`}>
        <img
          src={
            bannerImage ?bannerImage: contactUsData?.confirmationDefaultImage?._publishUrl
          }
          alt="support"
        />
        <div className="booking-status-container">
          {partnerData?.isPartnerFlight ? (
            <div className="partial-status-wrapper">
              
                <TooltipPopover
                  description={
                    <TooltipContent
                      aemData={contactUsData}
                      isTripCard={true}
                      data={{
                        selfTooltipData: {
                          recordLocator: recordLocator,
                          className: renderBookingStatus(bookingStatus)[1],
                          label: renderBookingStatus(bookingStatus)[0],
                        },
                        partnerTooltipData: {
                          recordLocator: partnerData?.partnerPnr,
                          className: partnerData?.partnerStatus===renderBookingStatus(2)[0]?renderBookingStatus(2)[1]:renderBookingStatus(100)[1],
                          label: partnerData?.partnerStatus,
                          imageLink: partnerData?.partnerImgUrl
                        },
                      }}
                    />
                  }
                  infoIconClass=""
                  showHideArrow={false}
                />
              
              <span
                className={
                  partnerData?.partnerStatus===renderBookingStatus(2)[0]?renderBookingStatus(2)[1]:renderBookingStatus(100)[1] + ' partial-status-container'
                }
              >
                <i className={partnerData?.partnerStatus===renderBookingStatus(2)[0]?renderBookingStatus(2)[2]:renderBookingStatus(100)[2]} />{' '}
                {partialBookingStatus}
              </span>
              
            </div>
          ) : (
            <span className={renderBookingStatus(bookingStatus)[1]}>
              <i className={renderBookingStatus(bookingStatus)[2]} />{' '}
              {renderBookingStatus(bookingStatus)[0]}
            </span>
          )}
        </div>
        <SwiperComponentV2
          swiperConfig={swiperConfig}
          containerClass="skyplus-slider"
          index={tripIndex}
        >
          {journeyArray?.length &&
            journeyArray.map((journey) => {
              const {
                journeyDetail: {
                  origin,
                  destination,
                  utcDeparture,
                  utcArrival,
                  originCityName,
                  destinationCityName,
                },
                flightType,
                stops,
              } = journey;
              return (
                <SwiperComponentV2.Slide key={uniq()}>
                  <div className="date-pax">
                    <div className="journey-date">
                      <i className="icon-calender" />{' '}
                      {formatDateTime(utcDeparture).formattedDateShort}{' '}
                      <span className="journey-type">
                        {journeyTypeHandler()}
                      </span>
                    </div>
                    <div className="pax-detail">
                      <i className="icon-Passenger" /> {paxNum}{' '}
                      {contactUsData?.paxLabel}{' '}
                    </div>
                  </div>
                  <div className="flight-info">
                    <div className="origin-container">
                      <div className="origin">{origin}</div>
                      <div className="origin-name">
                        {originCityName}
                        {journey?.segment[0]?.legs[0]?.legInfo
                          ?.departureTerminal
                          ? ` , ${contactUsData?.terminalLabel}`
                          : ''}
                        {
                          journey?.segment[0]?.legs[0]?.legInfo
                            ?.departureTerminal
                        }
                      </div>
                    </div>
                    <div className="journeylap-container">
                      <JourneyLap
                        containerClass="flex-grow-1"
                        duration={flightDurationFormatter(
                          utcDeparture,
                          utcArrival,
                        )}
                        stops={stops}
                        nonStopLabel={flightType}
                      />
                    </div>
                    <div className="destination-container">
                      <div className="destination">{destination}</div>
                      <div className="destination-name">
                        {destinationCityName}
                        {journey?.segment[0]?.legs[0]?.legInfo?.arrivalTerminal
                          ? ` , ${contactUsData?.terminalLabel}`
                          : ''}
                        {journey?.segment[0]?.legs[0]?.legInfo?.arrivalTerminal}
                      </div>
                    </div>
                  </div>
                </SwiperComponentV2.Slide>
              );
            })}
        </SwiperComponentV2>
        <div className="trips-card-btn-container">
          {activeTab === TRIP_TYPE.UPCOMING && (
            <Button
              classNames="trips-card-btn"
              onClick={
                journeyArray[currentIndex]?.webCheckinInfo?.isAllPaxCheckedIn
                  ? onClickBoardingPass
                  : onClickItineraryCheck
              }
            >
              {journeyArray[currentIndex]?.webCheckinInfo?.isAllPaxCheckedIn
                ? contactUsData?.boardingPassCta
                : contactUsData?.viewItineraryCta}
            </Button>
          )}
          <Button
            classNames="trips-card-btn need-help-chat-btn"
            variant="outline"
            onClick={() => {
              handleSearch(
                contactUsData?.needHelpChatText,
                false,
                lastName,
                recordLocator,
              );
              handleTripModalClose();
            }}
          >
            {contactUsData?.needHelpCta}
          </Button>
        </div>
      </div>
    );
  },
);

TripCard.propTypes = {
  paxNum: PropTypes.number,
  bookingStatus: PropTypes.string,
  journeyArray: PropTypes.object,
  lastName: PropTypes.string,
  recordLocator: PropTypes.string,
  activeTab: PropTypes.string,
  contactUsData: PropTypes.object,
  additionalClass: PropTypes.string,
  handleSearch: PropTypes.func,
  handleTripModalClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  iataList: PropTypes.object,
};

export default TripCard;
