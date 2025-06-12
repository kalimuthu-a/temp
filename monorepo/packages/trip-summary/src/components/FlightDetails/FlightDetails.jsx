import { useState } from 'react';
import PropTypes from 'prop-types';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import { useTripSummaryContext } from '../../store/trip-summary-context';
import Popover from '../Popover/Popover';

import './FlightDetails.scss';
import {
  getJourneyType,
  UTIL_CONSTANTS,
  formatDate,
  convertZuluToSplitted,
  dateDiffToString,
  getFlightListStr,
  getTravelTime,
} from '../../utils';
import { FLIGHT_TYPE, STRETCH, STRETCH_PLUS } from '../../constants';

const FlightDetails = ({ journeysDetail, journeyIndex, aemData, fareObj }) => {
  const journeyType = getJourneyType(aemData, journeysDetail, journeyIndex);
  const [openPopover, setOpenPopover] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const {
    aemAdditionalData,
  } = useTripSummaryContext();

  const mfAdditionalDataCodeshareList = aemData?.codeShare || [];

  const { timehh: departureHour, timemm: departureMinute } = convertZuluToSplitted(
    journeysDetail?.[journeyIndex]?.journeydetail?.departure,
  );

  const { timehh: arrivalHour, timemm: arrivalMinute } = convertZuluToSplitted(
    journeysDetail?.[journeyIndex]?.journeydetail?.arrival,
  );

  const getBaggage = (apiDataKey, aemDataKey, strToReplace) => {
    const baggage = journeysDetail?.[journeyIndex]?.journeydetail?.baggageData?.[apiDataKey];
    return baggage > 0 ? `${aemData?.[aemDataKey]?.replace(strToReplace, baggage)} |` : '';
  };

  /**
   * The below code can very well be written in single line with template literal
   * With single line, the code was too long, and throws eslint error
   * To enhance the readability and to get rid of the linting error, code is split
  */
  let baggageInfo = `${getBaggage('checkinBaggageWeight', 'checkInBaggageLabel', '{checkInBaggage}')}`;
  baggageInfo += ` ${getBaggage('handBaggageWeight', 'handBaggageLabel', '{cabinBaggage}')}`;
  baggageInfo = baggageInfo.slice(0, -1);

  const {
    days: travelDays,
    hh: travelTimeHr,
    mm: travelTimeMm,
  } = dateDiffToString(
    journeysDetail?.[journeyIndex]?.journeydetail?.utcdeparture,
    journeysDetail?.[journeyIndex]?.journeydetail?.utcarrival,
    true,
  );

  const travelDate = formatDate(
    journeysDetail?.[journeyIndex]?.journeydetail?.departure,
    UTIL_CONSTANTS.DATE_SPACE_DAYDDMMMYYYY,
  );
  const journeyStartTime = `${departureHour}:${departureMinute}`;
  const journeyEndTime = `${arrivalHour}:${arrivalMinute}`;

  let travelHrUpdated = travelTimeHr;
  if (travelDays > 0) {
    // if we have time difference in days then we have to add those to hours count
    travelHrUpdated = Number(travelHrUpdated) + Number(travelDays) * 24;
  }

  const getOrigin = (journey) => {
    return journey?.journeydetail?.originCityName || '';
  };

  const getDestination = (journey) => {
    return journey?.journeydetail?.destinationCityName || '';
  };

  const getConnectingPlace = (journeyObj = {}) => {
    if (journeyObj?.stops > 0) {
      const stopList = [];
      journeyObj?.segments?.forEach((sItem, idx) => {
        if (journeyObj?.flightType?.toUpperCase() === FLIGHT_TYPE.THROUGH && sItem.legs.length > 1) {
          sItem.legs.slice(0, -1).forEach((lItem) => {
            stopList.push(lItem?.legDetails?.destinationCityName);
          });
        } else if (idx !== journeyObj.segments.length - 1) {
          stopList.push(sItem?.segmentDetails?.destinationCityName || '');
        }
      });

      return stopList.length > 0 && `${aemData?.flightType?.Connecting || 'Connect'}(${stopList.join(', ')})`;
    }
    return aemData?.flightType?.NonStop || 'NonStop';
  };

  const stopStr = getConnectingPlace(journeysDetail[journeyIndex]);
  const fareObjDetail = fareObj[journeyIndex];

  const productClass = journeysDetail?.[journeyIndex]?.productClass;
  const aemFare = aemData?.fareType?.find(
    (row) => row.productClass === productClass,
  );

  const getOperatedByText = (segmentsData) => {
    if (!segmentsData || segmentsData.length === 0) return '';
    const operatedBy = segmentsData.find(
      (segments) => segments?.operatedByText,
    )?.operatedByText;
    return operatedBy || '';
  };

  // Returns true if more than one segment and exactly one has productClass 'BR' or 'BC', else false
  const { segments } = journeysDetail[journeyIndex];
  const hasStretch = Array.isArray(segments) && segments.some(
    (seg) => seg?.productClass === STRETCH || seg?.productClass === STRETCH_PLUS,
  );
  const hasEconomy = Array.isArray(segments) && segments.some(
    (seg) => seg?.productClass !== STRETCH && seg?.productClass !== STRETCH_PLUS,
  );
  const isOneSegStretch = Array.isArray(segments)
    && segments.length > 1
    && hasStretch
    && hasEconomy;

  // Extract all segments where productClass is 'BR' or 'BC'
  // Only compute stretchSegments if isOneSegStretch is true
  // Extract all segments where productClass is 'BR' or 'BC'
  // Only compute stretchSegments if isOneSegStretch is true
  const segmentDetails = isOneSegStretch && Array.isArray(segments)
    ? segments
      .filter((seg) => (seg?.productClass === STRETCH || seg?.productClass === STRETCH_PLUS))
      .map((seg) => ({ ...seg.segmentDetails, productClass: seg?.productClass || '' }))
    : [];

  const renderAccordionContent = () => {
    return (
      <>{segments.map((segment) => {
        const terminals = { arrivalTerminal: '', departureTerminal: '' };
        const { segmentDetails: segDetails, legs } = segment || {};
        const { origin, destination, utcarrival, utcdeparture } = segDetails || {};
        let segmentLabel = '';
        if (segment?.productClass === STRETCH || segment?.productClass === STRETCH_PLUS) {
          segmentLabel = aemData?.fareType?.find(
            (product) => product?.productClass === segment?.productClass,
          )?.fareLabel || '';
        } else {
          segmentLabel = aemData?.economyLabel?.replace('|', '') || 'Economy';
        }

        if (legs?.length > 1) {
          // If there are multiple legs
          legs.forEach((leg, index) => {
            if (index === 0 && leg?.legDetails?.departureTerminal) {
              terminals.departureTerminal = leg.legDetails.departureTerminal;
            }

            if (index === legs.length - 1 && leg?.legDetails?.arrivalTerminal) {
              terminals.arrivalTerminal = leg.legDetails.arrivalTerminal;
            }
          });
        } else {
          legs.forEach((leg) => {
            if (leg?.legDetails?.arrivalTerminal) {
              terminals.arrivalTerminal = leg.legDetails.arrivalTerminal;
            }
            if (leg?.legDetails?.departureTerminal) {
              terminals.departureTerminal = leg.legDetails.departureTerminal;
            }
          });
        }

        return (
          <div key={`${origin}-${destination}-${utcdeparture}`} className="mt-4">
            <div className="accordion-body-content__style accordion-body-content__time"> {getTravelTime(
              utcdeparture,
              utcarrival,
              aemAdditionalData,
              true,
            )}
            </div>
            <div className="accordion-body-content">
              <div className="accordion-body-content__origin accordion-body-content__style">
                {origin}, {aemData?.terminalLabel}{terminals.arrivalTerminal}
              </div>
              <div className="accordion-body-content__segment-container">
                <Icon className="icon-Flight accordion-body-content-flight-icon" size="sm" />
                <div className="accordion-body-content__hr" />
                <div className="accordion-body-content__style">{segmentLabel}</div>
                <div className="accordion-body-content__hr" />
                <div className="accordion-body-content__dot" />
              </div>
              <div className="accordion-body-content__destination accordion-body-content__style">
                {destination}, {aemData?.terminalLabel}{terminals.departureTerminal}
              </div>
            </div>
          </div>
        );
      })}
      </>
    );
  };

  const accordionData = [
    {
      title: `${getOrigin(journeysDetail?.[journeyIndex])} - 
          ${getDestination(journeysDetail?.[journeyIndex])}`,
      renderAccordionContent: renderAccordionContent(),
    },
  ];

  const accordionProps = {
    isOpen: false,
    accordionData,
    activeIndex,
    setActiveIndex,
  };

  return (
    <div className="flight-details">
      <div className="flight-details__header flex-h-between bg-secondary-light px-8 py-4">
        <div className="d-flex gap-2">
          <span>{journeyType}</span>
          {(isOneSegStretch) && (
            <Popover
              onOpen={() => {}}
              openPopover={openPopover}
              renderElement={() => {
                return (
                  <Icon className="icon-info" size="sm" onClick={() => setOpenPopover(true)} />
                );
              }}
              renderPopover={() => {
                return (
                  <div className="stretch-wrapper">
                    <div className="d-flex align-items-center gap-4 mb-4">
                      <Icon className="icon-info-filled" size="sm" />
                      <div className="stretch-wrapper__label">{aemFare?.fareLabel}</div>
                    </div>
                    {Array.isArray(segmentDetails) && segmentDetails.map((seg) => (
                      <div key={`${seg.origin}-${seg.destination}`} className="stretch-wrapper__flight-detail mb-2">
                        <span className="text-green">{seg?.origin}</span>
                        <span className="text-secondary">-</span>
                        <span className="text-green">{seg?.destination}</span>
                        <span className="text-secondary">*</span>
                      </div>
                    ))}
                    <div
                      className="stretch-wrapper__flight-desc mb-2"
                      dangerouslySetInnerHTML={{
                        __html: aemData?.stretchDescription?.html,
                      }}
                    />
                  </div>
                );
              }}
              containerClass=""
            />
          )}
        </div>
        <span>
          {getFlightListStr(journeysDetail?.[journeyIndex], mfAdditionalDataCodeshareList)}
        </span>
      </div>
      <div className="flight-details__body px-8 py-4 lh-2">
        <div className="py-3">
          {[STRETCH, STRETCH_PLUS].includes(productClass) ? (
            <NextChip>{aemFare?.fareLabel}</NextChip>
          ) : (
            <Chip
              color="info"
              variant="filled"
              withBorder
              containerClass="fare-type"
            >
              {aemData?.economyLabel}{fareObjDetail?.fareLabel}
            </Chip>
          )}
        </div>
        <Accordion {...accordionProps} />
        <p className="text-tertiary">{getOperatedByText(journeysDetail[journeyIndex]?.segments)}</p>
        <p>
          {travelDate} | {journeyStartTime} - {journeyEndTime} |{' '}
          {`${travelHrUpdated}h ${travelTimeMm}m`} | {stopStr}
        </p>
        {baggageInfo && <p className="text-tertiary">{baggageInfo}</p>}
      </div>
    </div>
  );
};

FlightDetails.propTypes = {
  journeysDetail: PropTypes.array.isRequired,
  journeyIndex: PropTypes.number,
  aemData: PropTypes.object,
  fareObj: PropTypes.array.isRequired,
};

export default FlightDetails;
