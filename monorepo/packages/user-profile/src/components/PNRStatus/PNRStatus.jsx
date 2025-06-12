import React, { useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import PropTypes from 'prop-types';
import TooltipPopover from 'skyplus-design-system-app/dist/des-system/TooltipPopover';
import {
  flightDurationFormatter,
  formatDateTime,
  renderBookingStatus,
} from '../../utils/utilFunctions';
import JourneyLap from '../JourneyLap/JourneyLap';
import {
  getPNRStatus,
} from '../../services/itinerary.service';
import { flightTypes } from '../../utils/analyticsConstants';
import { BOOKINGS, CONSTANTS } from '../../constants';
import { terminalDetail } from '../../constants/common';
import TooltipContent from '../common/TooltipContent/TooltipContent';

function PNRStatus({ aemData, loaderImage, setPnrStatus, iataList }) {
  const [PNRData, setPNRData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bannerImage, setBannerImage] = useState('');
  const [isStatusPartial, setIsStatusPartial] = useState(false);

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
  };

  const handlePartial = (partialPNRData) => {
    if (partialPNRData?.bookingDetails?.recordLocators?.length) {
      const nextFlightData = partialPNRData?.bookingDetails?.recordLocators?.[0];
      if (
        nextFlightData?.bookingStatus !== BOOKINGS.BOOKING_STATUS.CONFIRMED
        && partialPNRData?.bookingDetails?.bookingStatus === BOOKINGS.BOOKING_STATUS.CONFIRMED
      ) {
        setIsStatusPartial(true);
      }
    }
  };

  const setInitPNRStatusData = async () => {
    setIsLoading(true);
    try {
      const getPNRStatusData = await getPNRStatus();
      handlePartial(getPNRStatusData?.data);
      setPNRData(getPNRStatusData?.data);
      setPnrStatus({
        pnr: getPNRStatusData?.data?.bookingDetails?.recordLocator,
        lastName: getPNRStatusData?.data?.passengers?.[0]?.name?.last,
      });
      if (window.pageType === CONSTANTS.INFO_CONTACT_US_SUMMARY) {
        const breadcrumbText = document.querySelector(
          '.cmp-breadcrumb__item--active span',
        );
        if (breadcrumbText) {
          breadcrumbText.textContent =
            getPNRStatusData?.data?.bookingDetails?.recordLocator;
        }
      }
      const getPnrDestinationImage = iataList?.[getPNRStatusData?.data?.journeysDetail?.[0]?.journeydetail?.destination];
      setBannerImage(getPnrDestinationImage);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error fetching PNR status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTerminal = (segments, type, value, terminalType) => {
    const segment = segments?.find((item) => item?.designator?.[type] === value)
      ?.legs?.[0].legDetails?.[terminalType];
    return segment ? `, ${aemData?.terminalLabel}${segment}` : null;
  };

  useEffect(() => {
    setInitPNRStatusData();
  }, [iataList && Object.keys(iataList)?.length]);

  const pnrCancelled = PNRData?.bookingDetails?.bookingStatus === 'Cancelled';

  return (
    <>
      {PNRData?.bookingDetails && (
        <div
          className={
            pnrCancelled
              ? 'banner-section pnr-info-main pnr-cancelled'
              : 'banner-section pnr-info-main'
          }
        >
          <img
            src={
              pnrCancelled
                ? aemData?.cancelledDefaultImage?._publishUrl
                : bannerImage || aemData?.confirmationDefaultImage?._publishUrl
            }
            alt={aemData?.customerSupportTitle}
          />
          <div className="banner-section__text-content d-flex">
            <div className="banner-section__text">
              <div className="booking-details">
                <div className="booking-status">
                  {isStatusPartial ? (
                    <div className="partial-status-container">
                      <span
                        className={renderBookingStatus('PartialComplete')[1]}
                      >
                        <i
                          className={renderBookingStatus('PartialComplete')[2]}
                        />{' '}
                        {renderBookingStatus('PartialComplete')[0]}
                      </span>
                      <TooltipContent
                        aemData={aemData}
                        data={PNRData}
                      />
                    </div>
                  ) : (
                    <span
                      className={
                        renderBookingStatus(
                          PNRData?.bookingDetails?.bookingStatus,
                        )[1]
                      }
                    >
                      <i
                        className={
                          renderBookingStatus(
                            PNRData?.bookingDetails?.bookingStatus,
                          )[2]
                        }
                      />{' '}
                      {
                        renderBookingStatus(
                          PNRData?.bookingDetails?.bookingStatus,
                        )[0]
                      }
                    </span>
                  )}
                  {PNRData?.bookingDetails?.journeyType && (
                    <span className="journey-type">
                      {PNRData?.bookingDetails?.journeyType}
                    </span>
                  )}
                </div>
                {pnrCancelled && (
                  <div className="d-flex gap-2 align-items-center passenger-count">
                    <i className="icon-Passenger" />{' '}
                    {PNRData?.passengers.length} {aemData?.paxLabel}
                  </div>
                )}
              </div>
              <div className="pnr-details-main d-flex">
                <SwiperComponent
                  swiperConfig={swiperConfig}
                  containerClass="skyplus-slider"
                >
                  {PNRData &&
                    PNRData?.journeysDetail?.map((detail) => {
                      const {
                        journeydetail: {
                          origin,
                          destination,
                          utcdeparture,
                          utcarrival,
                          originCityName,
                          destinationCityName,
                          departure,
                        },
                        flightType,
                        stops,
                        segments,
                      } = detail;
                      return (
                        <SwiperComponent.Slide key={uniq()}>
                          <div className="pnr-details">
                            <div className="booking-date d-flex">
                              <span className="d-flex gap-2 align-items-center">
                                <i className="icon-calender" />{' '}
                                {formatDateTime(departure).formattedDateShort}
                              </span>
                              {PNRData?.passengers?.length && (
                                <span className="d-flex gap-2 align-items-center">
                                  <i className="icon-Passenger" />{' '}
                                  {PNRData?.passengers.length}{' '}
                                  {aemData?.paxLabel}
                                </span>
                              )}
                            </div>
                            <div className="pnr-info d-flex">
                              <div className="flight-place">
                                <div className="flight-time">{origin}</div>
                                <div className="flight-city-name">
                                  {originCityName}
                                  {getTerminal(
                                    segments,
                                    terminalDetail.ORIGIN,
                                    origin,
                                    terminalDetail.DEPARTURE_TERMINAL,
                                  )}
                                </div>
                              </div>
                              <JourneyLap
                                duration={flightDurationFormatter(
                                  utcdeparture,
                                  utcarrival,
                                )}
                                containerClass="flex-grow-1"
                                nonStopLabel={flightType}
                                stops={stops}
                              />
                              <div className="flight-place text-right">
                                <div className="flight-time">{destination}</div>
                                <div className="flight-city-name">
                                  {destinationCityName}
                                  {getTerminal(
                                    segments,
                                    terminalDetail.DESTINATION,
                                    destination,
                                    terminalDetail.ARRIVAL_TERMINAL,
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwiperComponent.Slide>
                      );
                    })}
                </SwiperComponent>
                <Button
                  color="primary"
                  variant="filled"
                  size="small"
                  containerClass={`view-itinerary-btn ${
                    PNRData?.bookingDetails?.journeyType === flightTypes.ONEWAY
                      ? 'mt-8'
                      : ''
                  }`}
                >
                  <a
                    className="text-white text-decoration-none"
                    href={aemData?.viewItineraryLink}
                  >
                    {aemData?.viewItineraryCta}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="skyplus-loader skyplus-loader-overlay">
          <div className="h-100 d-flex align-items-center">
            <div className="payment-page-intermediate-orchestrator-dynamic__flight-animation">
              <img src={loaderImage} alt="loader" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

PNRStatus.propTypes = {
  aemData: PropTypes.object,
  loaderImage: PropTypes.string,
  setPnrStatus: PropTypes.object,
};

export default PNRStatus;
