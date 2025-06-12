import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Text from 'skyplus-design-system-app/dist/des-system/Text';

import {
  formattedMessage,
  uniq,
} from 'skyplus-design-system-app/dist/des-system/utils';
import format from 'date-fns/format';

import FlightItenerary from './FlightItenerary/FlightItenerary';
import { dateFormats } from '../../../constants';
import useAppContext from '../../../hooks/useAppContext';
import { cityWithTerminal } from '../../../utils/flight';

const FlightDetails = ({ flightData, selectedJounery, isInternational }) => {
  const {
    designator: { departure },
    originTerminal,
    destinationTerminal,
  } = selectedJounery;

  const {
    state: { additional, main, isLoyalty },
  } = useAppContext();

  return (
    <div className="flight-details">
      <Heading
        heading="h4 "
        mobileHeading="h5"
        containerClass="text-text-primary"
      >
        {additional.flightDetailsLabel}
      </Heading>
      <div className="d-flex justify-content-between align-items-center flight-details__heading mt-8">
        <Text
          variation="body-large-medium text-text-primary"
          mobileHeading="body-large-medium"
          containerClass="flight-type-label"
        >
          {additional.departureFlightLabel}
        </Text>
        {!isLoyalty && selectedJounery?.fare?.rewardPoint > 0 && (
          <Text
            containerClass="pts"
            variation="tags-medium"
            mobileVariation="tags-small"
          >
            {formattedMessage(additional.earnPointInfo, {
              points: selectedJounery?.fare?.rewardPoint,
            })}
          </Text>
        )}
      </div>
      <div className="flight-details__card">
        <p className="flight-details__date">
          {format(new Date(departure), dateFormats.EEEddLLL)}
        </p>

        <div className="flight-details__info d-flex justify-content-between">
          <div className="flight-details__info__departure">
            <Text
              containerClass="location"
              variation="h7"
              mobileVariation="sh3"
            >
              {flightData.designator.origin}
            </Text>
            <Text containerClass="terminal" variation="body-small-medium">
              {cityWithTerminal(
                flightData.designator.originCityName,
                originTerminal,
              )}
            </Text>
          </div>
          <div className="flight-details__info__duration text-center align-self-center">
            <Text
              containerClass="time"
              variation="body-small-medium"
              mobileVariation=" body-extra-small-regular"
            >
              {flightData.designator.duration}
            </Text>
            <div className="line-bg" />

            <Text
              containerClass="stops"
              variation="body-small-medium"
              mobileVariation=" tags-small"
            >
              {flightData.stops > 0
                ? `${flightData.stops} ${main.stopsLabel}`
                : main.nonStopLabel}
            </Text>
          </div>
          <div className="flight-details__info__arrival">
            <Text
              containerClass="location text-right"
              variation="h7"
              mobileVariation="sh3"
            >
              {flightData.designator.destination}
            </Text>
            <Text containerClass="terminal" variation="body-small-medium">
              {cityWithTerminal(
                flightData.designator.destinationCityName,
                destinationTerminal,
              )}
            </Text>
          </div>
        </div>
        {flightData.segments.map((data, key, allSegment) => {
          return (
            <FlightItenerary
              data={data}
              key={uniq()}
              nextSegment={allSegment[key + 1]}
              aircraft={flightData.aircrafts[key]}
              isInternational={isInternational}
            />
          );
        })}
      </div>
    </div>
  );
};

FlightDetails.propTypes = {
  flightData: PropTypes.object,
  selectedJounery: PropTypes.any,
  isInternational: PropTypes.bool,
};

export default FlightDetails;
