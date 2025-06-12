import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import format from 'date-fns/format';
import { dateFormats } from '../../../constants';
import {
  checkInClosesTime,
  flightDurationFormatter,
} from '../../../utils/functions';

/**
 * @param {boolean} layover
 */

const FlightItenerary = ({ segment }) => {
  const {
    segmentDetails: {
      arrival,
      departure,
      origin,
      utcarrival,
      utcdeparture,
      originName,
      destinationName,
      destination,
      identifier,
    },
    legs,
  } = segment;

  const checkInCloses = checkInClosesTime(departure);

  const flightName = `${identifier?.carrierCode} . ${identifier.identifier}`;

  const departTerminal = legs?.[0]?.legInfo?.departureTerminal;
  const arrivalTerminal = legs?.[legs.length - 1]?.legInfo?.arrivalTerminal;

  return (
    <div className="itenarary-single">
      <div className="itenarary-single__top d-flex justify-content-between">
        <Text
          containerClass="flight-number"
          variation="body-medium-regular"
          mobileVariation="body-small-regular"
        >
          <div className="d-flex align-items-center gap-2"><i className="icon-Indigo_Logo  icon-size-sm" />
            {flightName}
          </div>

        </Text>
        <Text
          containerClass="flight-checkin"
          variation="body-medium-regular"
          mobileVariation="body-small-regular"
        >
          Checkin closes {format(checkInCloses, dateFormats.HHmm)}
        </Text>
      </div>
      <div className="d-flex align-items-center justify-content-between itenarary-single__wrap">
        <div className="terminal-wrap">
          <Text
            containerClass="time"
            variation="body-large-medium"
            mobileVariation="tags-medium"
          >
            {format(departure, dateFormats.HHmm)}
          </Text>
          <Text
            containerClass="terminal"
            variation="body-small-regular"
            mobileVariation="body-extra-small-regular"
          >
            {origin}- {originName}
            {departTerminal ? `(T${departTerminal})` : ''}
          </Text>
        </div>

        <Text
          containerClass="duration"
          variation="body-small-regular"
          mobileVariation="body-extra-small-regular"
        >
          Travel Time {flightDurationFormatter(utcdeparture, utcarrival)}
        </Text>

        <div className="terminal-wrap">
          <Text
            containerClass="time text-end"
            variation="body-large-medium"
            mobileVariation="tags-medium"
          >
            {format(arrival, dateFormats.HHmm)}
          </Text>
          <Text
            containerClass="terminal"
            variation="body-small-regular"
            mobileVariation="body-extra-small-regular"
          >
            {destination}-{destinationName}
            {arrivalTerminal ? `(T${arrivalTerminal})` : ''}
          </Text>
        </div>
      </div>
    </div>
  );
};

FlightItenerary.propTypes = {
  segment: PropTypes.any,
};

export default FlightItenerary;
