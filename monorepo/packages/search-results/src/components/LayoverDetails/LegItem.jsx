import PropTypes from 'prop-types';
import format from 'date-fns/format';
import get from 'lodash/get';
import React, { useMemo } from 'react';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import { dateFormats, templateString } from '../../constants';
import {
  flightDurationFormatter,
  getDynamicFlightIdentifier,
} from '../../utils';
import JourneyLap from '../common/JourneyLap/JourneyLap';
import useAppContext from '../../hooks/useAppContext';

const LegItem = ({ leg, segment, nextLeg }) => {
  const {
    state: { additional },
  } = useAppContext();

  const {
    identifier: { carrierCode, equipmentType, identifier },
  } = segment;

  const {
    departureT,
    arrivalT,
    carrierInfo,
    origin,
    destination,
    departure,
    arrival,
    originCityName,
    destinationCityName,
    arrivalTimeUtc,
    departureTimeUtc,
  } = useMemo(() => {
    const icon = getDynamicFlightIdentifier(segment, additional);

    return {
      departureT: get(leg, ['legInfo', 'departureTerminal'], ''),
      arrivalT: get(leg, ['legInfo', 'arrivalTerminal'], ''),
      carrierInfo: formattedMessage(
        '<img src="{icon}" alt="Aircraft" class="codeshare-icon"/> {carrierCode} {identifier}. {equipmentType}',
        {
          icon: icon.image,
          carrierCode,
          identifier,
          equipmentType: icon?.equipmentTypeLabel || equipmentType,
        },
      ),
      origin: get(leg, ['designator', 'origin'], ''),
      destination: get(leg, ['designator', 'destination'], ''),
      departure: get(leg, ['designator', 'departure'], ''),
      arrival: get(leg, ['designator', 'arrival'], ''),
      originCityName: get(leg, ['designator', 'originCityName'], ''),
      destinationCityName: get(leg, ['designator', 'destinationCityName'], ''),
      departureTimeUtc: get(leg, ['legInfo', 'departureTimeUtc'], ''),
      arrivalTimeUtc: get(leg, ['legInfo', 'arrivalTimeUtc'], ''),
    };
  }, []);

  return (
    <>
      <div className="mt-10">
        <div className="d-flex align-items-center justify-content-between">
          <span className="f-w-500">
            {origin}-{destination}
          </span>
          <HtmlBlock
            className="d-flex align-items-center text-tertiary"
            html={carrierInfo}
          />
        </div>
        <div className="line-bg my-4" />
        <div className="d-flex justify-content-between align-items-center gap-24">
          <div>
            <p className="sh3 timer">
              {format(new Date(departure), dateFormats.HHMM)}
            </p>
            <p className="body-small-medium mt-4 text-uppercase">
              {formattedMessage(templateString.airportWithTerminal, {
                airport: originCityName,
                terminal: departureT ? ` (T${departureT})` : '',
              })}
            </p>
          </div>
          <JourneyLap
            containerClass="flex-grow-1"
            duration={flightDurationFormatter(departureTimeUtc, arrivalTimeUtc)}
          />
          <div className="text-end">
            <p className="sh3 timer">
              {format(new Date(arrival), dateFormats.HHMM)}
            </p>
            <p className="body-small-medium mt-4 text-uppercase">
              {formattedMessage(templateString.airportWithTerminal, {
                airport: destinationCityName,
                terminal: arrivalT ? ` (T${arrivalT})` : '',
              })}
            </p>
          </div>
        </div>
      </div>
      {nextLeg && (
        <div className="rounded-1 p-8 my-10 flight-info">
          <div className="d-flex">
            <div className="body-small-regular pe-5">
              {flightDurationFormatter(arrival, nextLeg?.designator?.departure)}{' '}
              {additional.layoverTimeInfo} {destinationCityName}
            </div>
            <div className="change-aircraft">{additional.layoverTitle}</div>
          </div>
          <div className="body-small-medium">
            {additional.layoverNotDeboarding}
          </div>
        </div>
      )}
    </>
  );
};

LegItem.propTypes = {
  leg: PropTypes.any,
  nextLeg: PropTypes.any,
  segment: PropTypes.any,
};

export default LegItem;
