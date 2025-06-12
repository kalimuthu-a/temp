import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import format from 'date-fns/format';

import { dateFormats } from '../../../../constants';
import { cityWithTerminal } from '../../../../utils/flight';
import { flightDurationFormatter } from '../../../../utils';

const LegInfo = ({ designator, legInfo, additional, nextLeg }) => {
  const {
    arrival,
    departure,
    destinationCityName,
    originName = '',
    destinationName = '',
  } = designator;
  const { departureTimeUtc, arrivalTimeUtc } = legInfo;

  const originWithTerminal = `${designator.origin} - ${cityWithTerminal(
    originName,
    legInfo.departureTerminal,
  )}`;

  const departureWithTerminal = `${designator.destination} - ${cityWithTerminal(
    destinationName,
    legInfo.arrivalTerminal,
  )}`;

  return (
    <>
      <div className="itenarary-single__wrap">
        <ul>
          <li>
            <div className="terminal-wrap">
              <Text
                containerClass="time text-text-primary"
                variation="body-medium-medium"
                mobileVariation="tags-medium"
              >
                {format(departure, dateFormats.HHMMbb)}
              </Text>
              <Text
                containerClass="terminal text-text-secondary"
                variation="body-small-regular"
                mobileVariation="body-extra-small-regular"
              >
                {originWithTerminal}
              </Text>
            </div>
          </li>
          <li className="duration">
            <Text containerClass="terminal-wrap d-flex">
              <Text
                variation="body-small-regular text-tertiary"
                mobileVariation="body-extra-small-regular text-tertiary"
              >
                {additional?.travelTimeLabel}
              </Text>
              &nbsp;
              <Text
                variation="body-small-regular text-tertiary"
                mobileVariation="tags-small text-tertiary"
              >
                {flightDurationFormatter(departureTimeUtc, arrivalTimeUtc, {
                  xMinutes: '{{count}}min',
                  xHours: '{{count}}Hour',
                  xDays: '{{count}}Day',
                })}{' '}
              </Text>
            </Text>
          </li>
          <li>
            <div className="terminal-wrap">
              <Text
                containerClass="time text-text-primary"
                variation="body-medium-medium"
                mobileVariation="tags-medium"
              >
                {format(arrival, dateFormats.HHMMbb)}
              </Text>
              <Text
                containerClass="terminal"
                variation="body-small-regular"
                mobileVariation="body-extra-small-regular"
              >
                {departureWithTerminal}
              </Text>
            </div>
          </li>
        </ul>
      </div>
      {nextLeg && (
        <div className="itenarary-single__layover mx-8 mt-2 mb-8">
          <Text
            variation="body-small-regular"
            mobileVariation="body-extra-small-regular"
            containerClass="duration"
          >
            {flightDurationFormatter(
              arrivalTimeUtc,
              nextLeg.legInfo.departureTimeUtc,
            )}{' '}
            {additional.layoverTimeInfo} {destinationCityName}
          </Text>
          <Text
            containerClass="note"
            variation="body-small-medium"
            mobileVariation="tags-small"
          >
            {additional.layoverNotDeboarding}
          </Text>
        </div>
      )}
    </>
  );
};

LegInfo.propTypes = {
  additional: PropTypes.any,
  designator: PropTypes.any,
  legInfo: PropTypes.any,
  nextLeg: PropTypes.any,
};

export default LegInfo;
