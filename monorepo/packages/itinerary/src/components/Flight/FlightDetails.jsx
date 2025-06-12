import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { convertZuluToSplitted, dateDiffToString } from '../../utils';
import { CONSTANTS } from '../../constants';

const FlightDetails = ({
  segmentList = [],
  segmentIndex,
  currentLeg,
  nextLeg,
  jItem = {},
}) => {
  const mfDataObj = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { codeShare, changeOfAirCraftLabel, layoverLabel,
    checkinCloses } = mfDataObj?.itineraryMainByPath?.item || {};
  const codeShareFlightAEMData = codeShare || [];
  const {
    international, segmentDetails, operatedByText,
  } = segmentList[segmentIndex] || {};
  const { legDetails: currentLegDetails } = currentLeg || {};
  const { legDetails: nextLegDetails } = nextLeg || {};
  const isThroughFlight = jItem?.flightType?.toUpperCase() === CONSTANTS.FLIGHT_TYPE.THROUGH;
  const segmentIdentifier = segmentDetails?.identifier || {};
  const flightStr = `${segmentIdentifier.carrierCode} ${segmentIdentifier.identifier}`;
  const renderChangeAircraft = () => {
    if (nextLegDetails) {
      if (nextLegDetails.utcdeparture && nextLegDetails.utcarrival) {
        const isAppendZeroInTime = true;
        const { hh, mm, days } = dateDiffToString(
          currentLegDetails.utcarrival,
          nextLegDetails.utcdeparture,
          isAppendZeroInTime,
        );
        let travelHrUpdated = hh;
        if (days > 0) {
          // if we have time difference in days then we have add those to hours count
          travelHrUpdated = Number(travelHrUpdated) + Number(days) * 24;
        }
        const timeStr = travelHrUpdated > 0
          ? `${travelHrUpdated}h ${mm}m`
          : `${mm}Mins`;
        const layOverStr = `${layoverLabel || 'Layover'} at ${currentLegDetails?.destinationCityName}`;
        const changeStr = isThroughFlight
          ? 'Deboarding aircraft may not be allowed'
          : changeOfAirCraftLabel || 'Change of aircraft';
        return (
          <div className="flight-detail__change-aircraft">
            <div className="flight-details__time-label">
              { `${timeStr} ${layOverStr}`}
            </div>
            <div className="flight-details__change-label"> {changeStr} </div>
          </div>
        );
      }
      return null;
    }
    return null;
  };
  const getTime = (date) => {
    const { timehh, timemm } = convertZuluToSplitted(date);
    return `${timehh}:${timemm}`;
  };
  const getTravelTime = (from, to) => {
    const startDate = new Date(from);
    // Do your operations
    const endDate = new Date(to);
    const { hh, mm, days } = dateDiffToString(startDate, endDate, true);
    let travelHrUpdated = hh;
    if (days > 0) {
      // if we have time difference in days then we have add those to hours count
      travelHrUpdated = Number(travelHrUpdated) + Number(days) * 24;
    }
    return `Travel Time ${travelHrUpdated} Hour ${mm} min`;
  };
  const codeShareOperatorIcon = () => {
    const currentcodeShareOperator = currentLegDetails?.operatingCarrier || '';
    const currentEquipmentData = codeShareFlightAEMData?.find(
      (i) => i?.carrierCode === currentcodeShareOperator,
    );
    return currentEquipmentData?.carrierCodePopupIcon?._publishUrl || '';
  };

  const iconFlight = () => {
    const operatingCarrierIcon = codeShareOperatorIcon();
    if (operatingCarrierIcon) {
      return (
        <img
          src={operatingCarrierIcon}
          className="flight-code-img"
          alt=""
          loading="lazy"
        />
      );
    }
    return (
      <span className="icon-flight">
        <span className="path1" />
        <span className="path2" />
        <span className="path3" />
        <span className="path4" />
      </span>
    );
  };

  const renderFlightConnect = () => {
    return (
      <>
        <div className="flight-details__code-container">
          <div className="flight-code">
            {iconFlight()}
            {flightStr}{' . '}
            {/* eslint-disable no-use-before-define */}
            {renderEquipmentType()}
            {operatedByText ? (
              <HtmlBlock
                html={`<span> |</span>  ${operatedByText}`}
                className="operatedByText"
              />
            ) : ''}
          </div>
          <div className="flight-checking">
            {checkinCloses || 'Check-in closes'} {checkInClosesStr}
          </div>
        </div>

        <div className="flight-details__container-departure-arrival">
          <div className="flight-details__flight-track">
            <span className="depart-point" />
            <p className="flight-details__flight-line" />
            <span className="dest-point" />
          </div>
          <div className="flight-detail__detail-wrapper">
            <div className="flight-detail__departure">
              <div className="departure-time">
                {getTime(currentLegDetails?.departure)}
              </div>
              <div className="departure-location">
                {`${currentLegDetails?.origin}-${currentLegDetails?.originName}`}
                {currentLegDetails?.departureTerminal
                  ? `(T${currentLegDetails?.departureTerminal})`
                  : ''}
              </div>
            </div>

            <div className="flight-details__time-duration-container">
              <div className="time-duration">
                {getTravelTime(
                  currentLegDetails?.utcdeparture,
                  currentLegDetails?.utcarrival,
                )}
              </div>
            </div>

            <div className="flight-detail__arrival">
              <div className="arrival-time">
                {getTime(currentLegDetails?.arrival)}
              </div>
              <div className="arrival-location">
                {`${currentLegDetails?.destination}-${currentLegDetails?.destinationName}`}
                {currentLegDetails?.arrivalTerminal
                  ? `(T${currentLegDetails?.arrivalTerminal})`
                  : ''}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  const renderEquipmentType = () => {
    const equipmentType = currentLegDetails?.equipmentType || '';
    const currentEquipmentData = codeShareFlightAEMData?.find(
      (i) => i?.equipmentType === equipmentType,
    );
    return currentEquipmentData?.equipmentTypeLabel || equipmentType;
  };

  const departDate = new Date(currentLegDetails.departure);
  const minusMin = international ? 75 : 60;
  departDate.setMinutes(departDate.getMinutes() - minusMin);

  const { timehh: departureHour, timemm: departureMinute } = convertZuluToSplitted(departDate);

  const checkInClosesStr = `${departureHour}:${departureMinute}`;

  return (
    <>
      {renderFlightConnect()}
      {renderChangeAircraft()}
    </>
  );
};

FlightDetails.propTypes = {
  segmentIndex: PropTypes.number,
  segmentList: PropTypes.array,
  currentLeg: PropTypes.object,
  nextLeg: PropTypes.object,
  jItem: PropTypes.object,
};
export default FlightDetails;
