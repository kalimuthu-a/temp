import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  dateDiffToString,
  formatDate,
  UTIL_CONSTANTS,
  getTravelTime,
} from '../../utils';
import { FLIGHT_TYPE } from '../../constants';
import './LegDetails.scss';

const LegDetails = ({
  journey,
  currentLeg,
  nextLeg,
  accordionExpanded,
  aemAdditionalData,
  flightDetails,
  flightFareLabel,
}) => {
  const legDetailsRef = useRef(null);
  const isThroughFlight = journey?.flightType?.toUpperCase() === FLIGHT_TYPE.THROUGH;
  const { legDetails: currentLegDetails } = currentLeg || {};
  const { legDetails: nextLegDetails } = nextLeg || {};

  const getTime = (date) => {
    return (
      <>
        <span>
          {formatDate(date, UTIL_CONSTANTS.DATE_SLIDER_FLIGHT_DETAIL_TIME)}
        </span>
        <span>
          {formatDate(date, UTIL_CONSTANTS.DATE_SLIDER_FLIGHT_DETAIL_DATE)}
        </span>
      </>
    );
  };

  const renderPackageInfo = () => {
    if (nextLegDetails) {
      return null;
    }
    return (
      <div className="package-details bg-secondary-medium rounded my-8 text-primary">
        <p>{aemAdditionalData?.baggageInfoLabel || 'Baggage Per Adult and Child'}</p>
        <div className="flex-h-between">
          <span className="cabin">
            <span className="pe-2">
              <i className="icon-cabin-bag icon-size-sm" />
              {journey?.journeydetail?.baggageData?.handBaggageWeight || 7} KG
            </span>
            <span className="text-tertiary">
              {aemAdditionalData?.handBagInfo?.replace('{cabinBaggage} ', '') || 'Cabin'}
            </span>
          </span>
          <span className="check-in">
            <span className="pe-2">
              <i className="icon-checkin-bag icon-size-sm" />
              {journey?.journeydetail?.baggageData?.checkinBaggageWeight || 15} KG
            </span>
            <span className="text-tertiary">
              {aemAdditionalData?.checkInBagInfo?.replace('{checkInBaggage} ', '') || 'Check-in'}
            </span>
          </span>
        </div>
      </div>
    );
  };

  const renderChangeAircraft = () => {
    if (!nextLegDetails) {
      return null;
    }

    if (nextLegDetails.departure && nextLegDetails.arrival) {
      const isAppendZeroInTime = true;
      const { hh, mm } = dateDiffToString(
        currentLegDetails.utcarrival,
        nextLegDetails.utcdeparture,
        isAppendZeroInTime,
      );
      const timeStr = hh > 0 ? `${hh}h ${mm}m` : `${mm} Mins`;
      const layOverStr = `${aemAdditionalData?.layoverLabel || 'Layover'} ${currentLegDetails?.destinationCityName}`;
      const changeStr = isThroughFlight ? '' : (aemAdditionalData?.changeOfAircraftLabel || 'Change of aircraft');
      return (
        <div className="change-aircraft bg-secondary-medium py-6 px-8 my-8 rounded-1">
          <span className="change-aircraft__text">
            <strong>{timeStr}</strong> {layOverStr}{' '}
            {changeStr && (
              <>
                <sup />
                <strong className="change-aircraft__text__changeText">{changeStr}</strong>
              </>
            )}
          </span>
        </div>
      );
    }
    return null;
  };
  const renderFlightConnect = () => {
    return (
      <div className="">
        <ul className="">
          <li>
            <div className="text-primary d-flex gap-4 f-14">
              {getTime(currentLegDetails.departure)}
            </div>
            <div className="text-secondary">
              {`${currentLegDetails.origin}-${currentLegDetails.originName} ${
                currentLegDetails.departureTerminal
                  ? `(T${currentLegDetails.departureTerminal})`
                  : ''
              }`}
            </div>
            <div className="text-tertiary p-4 my-8 layover-info text-sm-center">
              {aemAdditionalData?.travelTimeLabel || 'Travel Time'}:{' '}
              {getTravelTime(
                currentLegDetails.utcdeparture,
                currentLegDetails.utcarrival,
                aemAdditionalData,
              )}
            </div>
          </li>

          <li>
            <div className="text-primary d-flex gap-4 f-14">
              {getTime(currentLegDetails.arrival)}
            </div>
            <div className="text-secondary">
              {`${currentLegDetails.destination}-${
                currentLegDetails.destinationName
              } ${
                currentLegDetails.arrivalTerminal
                  ? `(T${currentLegDetails.arrivalTerminal})`
                  : ''
              }`}
            </div>
          </li>
        </ul>
      </div>
    );
  };

  useEffect(() => {
    if (accordionExpanded) {
      legDetailsRef.current.style.height = legDetailsRef.current?.scrollHeight
        ? `${legDetailsRef.current?.scrollHeight}px`
        : '0';
    } else {
      legDetailsRef.current.style.height = '0px';
    }
  }, [accordionExpanded]);

  return (
    <div className="f-12 lh-2 leg-details" ref={legDetailsRef}>
      <div className="divider" />
      {flightFareLabel && flightFareLabel()}
      {flightDetails && flightDetails()}
      {renderFlightConnect()}
      {renderChangeAircraft()}
      {renderPackageInfo()}
    </div>
  );
};

LegDetails.propTypes = {
  journey: PropTypes.object.isRequired,
  currentLeg: PropTypes.object.isRequired,
  nextLeg: PropTypes.object,
  accordionExpanded: PropTypes.bool,
  aemAdditionalData: PropTypes.object.isRequired,
  flightDetails: PropTypes.func.isRequired,
  flightFareLabel: PropTypes.func.isRequired,
};

LegDetails.defaultProps = {
  nextLeg: {},
  accordionExpanded: false,
};

export default LegDetails;
