import { useState } from 'react';
import PropTypes from 'prop-types';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import LegDetails from '../LegDetails';
import {
  UTIL_CONSTANTS,
  dateDiffToString,
  formatDate,
  getFlightEquipmentAem,
  getFlightListStr,
  getIsInternational,
  getJourneyPriceBreakdown,
  getJourneyType,
} from '../../utils';
import { FLIGHT_TYPE, STRETCH, STRETCH_PLUS } from '../../constants';

import './TripDetailsSegment.scss';
import analyticEvents from '../../utils/analyticEvents';

const TripDetailsSegment = ({
  tripSummaryData,
  journeyIndex,
  aemData = {},
  aemAdditionalData = {},
}) => {
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const journeysDetail = tripSummaryData?.journeysDetail;
  const [journeyPriceBreakdown] = getJourneyPriceBreakdown(
    journeysDetail[journeyIndex]?.journeyKey,
    tripSummaryData?.priceBreakdown?.journeywiseList,
  ) || [];
  const {
    days: travelDays,
    hh: travelTimeHr,
    mm: travelTimeMm,
  } = dateDiffToString(
    journeysDetail[journeyIndex]?.journeydetail?.utcdeparture,
    journeysDetail[journeyIndex]?.journeydetail?.utcarrival,
    true,
  );
  let travelHrUpdated = travelTimeHr;
  if (travelDays > 0) {
    // if we have time difference in days then we have add those to hours count
    travelHrUpdated = Number(travelHrUpdated) + Number(travelDays) * 24;
  }

  const tripType = getJourneyType(
    aemAdditionalData,
    journeysDetail,
    journeyIndex,
  );
  const origin = journeysDetail[journeyIndex]?.journeydetail?.origin;
  const originCityName = journeysDetail[journeyIndex]?.journeydetail?.originCityName;
  const destination = journeysDetail[journeyIndex]?.journeydetail?.destination;
  const destinationCityName = journeysDetail[journeyIndex]?.journeydetail?.destinationCityName;
  const flightDate = formatDate(
    journeysDetail?.[journeyIndex].journeydetail.departure,
    UTIL_CONSTANTS.DATE_SPACE_MMM,
  );
  const mfAdditionalDataCodeshareList = aemData?.codeShare || [];

  const getJourneyOriginTerminal = () => {
    const journey = tripSummaryData?.journeysDetail?.[journeyIndex];
    const terminalCode = journey?.segments?.[0]?.legs?.[0]?.legDetails?.departureTerminal;
    return terminalCode ? ` (T${terminalCode})` : '';
  };

  const getJourneyDestinationTerminal = () => {
    const journey = tripSummaryData?.journeysDetail?.[journeyIndex];
    const lastSegment = journey?.segments?.slice(-1);
    const lastLeg = lastSegment?.[0]?.legs?.slice(-1);
    const terminalCode = lastLeg?.[0]?.legDetails?.arrivalTerminal;
    return terminalCode ? ` (T${terminalCode})` : '';
  };

  const getEarnedPoints = () => {
    return (
      aemAdditionalData?.earnedPointsLabel?.replace(
        '{pointsValue}',
        journeyPriceBreakdown?.totalPoints,
      ) || ''
    );
  };

  const getConnectingPlace = (journeyObj = {}) => {
    if (journeyObj?.stops > 0) {
      const stopList = [];
      journeyObj?.segments?.forEach((sItem, idx) => {
        if (
          journeyObj?.flightType?.toUpperCase() === FLIGHT_TYPE.THROUGH
          && sItem.legs.length > 1
        ) {
          sItem.legs.slice(0, -1).forEach((lItem) => {
            stopList.push(lItem?.legDetails?.destinationCityName);
          });
        } else if (idx !== journeyObj.segments.length - 1) {
          stopList.push(sItem?.segmentDetails?.destinationCityName || '');
        }
      });
      return stopList.length > 0
        ? `${stopList.length} ${aemData?.stopLabel || 'Stop'}`
        : '';
    }
    return aemData?.flightType?.NonStop || 'Nonstop';
  };
  const getCheckInCloseTime = (departureTimestampTemp = '') => {
    let checkInCloses = '';
    if (!departureTimestampTemp) {
      return null;
    }
    const domesticCheckinClosesBefore = parseInt(
      aemAdditionalData?.domesticCheckinCloserTime || 0,
      10,
    );
    const internationalCheckinClosesBefore = parseInt(
      aemAdditionalData?.internationalCheckinCloserTime || 0,
      10,
    );
    const isInternational = getIsInternational(journeysDetail[journeyIndex]);
    const departureDate = new Date(departureTimestampTemp);
    if (isInternational) {
      departureDate.setMinutes(
        departureDate.getMinutes() - internationalCheckinClosesBefore,
      );
    } else {
      departureDate.setMinutes(
        departureDate.getMinutes() - domesticCheckinClosesBefore,
      );
    }
    const hours = departureDate.getHours().toString().padStart(2, '0');
    const minutes = departureDate.getMinutes().toString().padStart(2, '0');
    checkInCloses = `${hours}:${minutes}`;
    return checkInCloses;
  };
  const isLoyaltyDisabled = window?.disableLoyalty;
  const productClass = journeysDetail?.[journeyIndex]?.productClass;
  const aemFare = aemData?.fareType?.find(
    (row) => row.productClass === productClass,
  );

  return (
    <div className="trip-details-segment">
      <div className="segment-title-wrapper flex-h-between">
        <h6>{tripType}</h6>
        {journeyPriceBreakdown?.totalPoints
        && journeyPriceBreakdown?.totalPoints !== '0'
        && isLoyaltyDisabled ? (
          <Chip
            color="info"
            variant="filled"
            withBorder
            containerClass="rewards-chip"
          >
            {getEarnedPoints()}
          </Chip>
          ) : null}
      </div>
      <div className="segment-table">
        <div className="segment-table__head text-secondary">{flightDate}</div>
        <div className="segment-table__body text-secondary">
          <div className="flex-h-between">
            <div className="origin flex-col flex-align-start">
              <span className="code">{origin}</span>
              <span className="terminal">
                {originCityName}
                {getJourneyOriginTerminal()}
              </span>
            </div>
            <div className="duration-stop flex-col align-items-center">
              <span className="text-tertiary">{`${travelHrUpdated}h ${travelTimeMm}m`}</span>
              <div className="trip-divider stop-divider" />
              <span className="stop-info">
                {getConnectingPlace(journeysDetail[journeyIndex])}
              </span>
            </div>
            <div className="destination flex-col flex-align-end">
              <span className="code">{destination}</span>
              <span className="terminal">
                {destinationCityName}
                {getJourneyDestinationTerminal()}
              </span>
            </div>
          </div>
          <div className="leg-info">
            {journeysDetail?.[journeyIndex].segments.map((sItem, index) => {
              const checkinClose = getCheckInCloseTime(
                sItem?.segmentDetails?.departure,
              );
              const equipmentTypeData = getFlightEquipmentAem(
                journeysDetail?.[journeyIndex],
                mfAdditionalDataCodeshareList,
                index,
              );

              const economyFareLabel = aemData?.fareType?.find((row) => row.productClass === sItem?.productClass);

              const getFlightFareLabel = () => {
                if ([STRETCH, STRETCH_PLUS].includes(sItem?.productClass)) {
                  return <NextChip>{aemFare?.fareLabel}</NextChip>;
                }
                return (
                  <Chip
                    color="info"
                    variant="filled"
                    withBorder
                    containerClass="fare-type"
                  >
                    {aemData?.economyLabel}{economyFareLabel?.fareLabel}
                  </Chip>
                );
              };

              const flightDetails = () => {
                return (
                  <div className="flight-checkin flex-h-between mt-3">
                    <span className="text-tertiary">
                      {equipmentTypeData?.carrierCodePopupIcon
                        ?._publishUrl ? (
                          <img
                            src={
                              equipmentTypeData?.carrierCodePopupIcon
                                ?._publishUrl
                            }
                            className="flight-checkin__icon"
                            alt="flight-icon"
                          />
                        ) : (
                          <i className="icon-Flight" />
                        )}
                      {getFlightListStr(
                        journeysDetail?.[journeyIndex],
                        mfAdditionalDataCodeshareList,
                        index,
                      )}
                    </span>
                    {checkinClose && (
                    <span className="text-secondary">
                      {`${aemAdditionalData?.checkInClosesLabel} ${checkinClose}`}
                    </span>
                    )}
                  </div>
                );
              };
              return (
                <>
                  {/* For the first segment we need to show outside expandview, once expand,we can show for all */}
                  {/* {(index === 0 || accordionExpanded) && (
                    <div className="flight-checkin flex-h-between mt-12">
                      <span className="text-tertiary">
                        {equipmentTypeData?.carrierCodePopupIcon
                          ?._publishUrl ? (
                            <img
                              src={
                              equipmentTypeData?.carrierCodePopupIcon
                                ?._publishUrl
                            }
                              className="flight-checkin__icon"
                              alt="flight-icon"
                            />
                          ) : (
                            <i className="icon-Flight" />
                          )}
                        {getFlightListStr(
                          journeysDetail?.[journeyIndex],
                          mfAdditionalDataCodeshareList,
                          index,
                        )}
                      </span>
                      {checkinClose && (
                        <span className="text-secondary">
                          {`${aemAdditionalData?.checkInClosesLabel} ${checkinClose}`}
                        </span>
                      )}
                    </div>
                  )} */}
                  {sItem?.legs?.map((legItem, lIndex) => {
                    let nextLeg = null;

                    if (sItem?.legs[lIndex + 1]) {
                      nextLeg = sItem.legs[lIndex + 1];
                    } else if (
                      journeysDetail?.[journeyIndex]?.segments?.[index + 1]
                    ) {
                      nextLeg = journeysDetail?.[journeyIndex]?.segments?.[index + 1]
                        ?.legs[0];
                    }
                    return (
                      <LegDetails
                        key={uniq()}
                        segment={sItem}
                        currentLeg={legItem}
                        nextLeg={nextLeg}
                        journey={journeysDetail?.[journeyIndex]}
                        accordionExpanded={accordionExpanded}
                        aemAdditionalData={aemAdditionalData}
                        flightDetails={flightDetails}
                        flightFareLabel={getFlightFareLabel}
                      />
                    );
                  })}
                </>
              );
            })}
          </div>
        </div>
        <div className="segment-table__footer flex-col flex-center">
          <div className="trip-divider" />
          <button
            type="button"
            onClick={() => {
              setAccordionExpanded((prev) => !prev);
              analyticEvents({
                data: {
                  _event: 'showmore',
                  journeyIndex,
                },
                event: 'showmore',
              });
            }}
            className="btn-link no-underline"
          >
            <span className="btn-link">
              {accordionExpanded
                ? aemAdditionalData?.showLessLabel || 'Show Less'
                : aemAdditionalData?.showMoreLabel || 'Show More'}
            </span>
            {accordionExpanded ? (
              <span className="icon-accordion-up-simple" />
            ) : (
              <span className="icon-accordion-down-simple" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

TripDetailsSegment.propTypes = {
  tripSummaryData: PropTypes.object.isRequired,
  journeyIndex: PropTypes.number.isRequired,
  aemData: PropTypes.object,
  aemAdditionalData: PropTypes.object,
};

export default TripDetailsSegment;
