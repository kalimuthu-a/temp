import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import React from 'react';

import { flightDurationFormatter } from '../../utils';
import useAppContext from '../../hooks/useAppContext';
import LegItem from './LegItem';

const Segment = ({ nextSegment, ...segment }) => {
  const {
    state: { additional },
  } = useAppContext();

  const {
    designator: { destinationCityName, arrival },
    legs,
  } = segment;

  return (
    <>
      {legs.map((leg, key, items) => (
        <LegItem
          leg={leg}
          segment={segment}
          nextLeg={items[key + 1]}
          key={uniq()}
        />
      ))}

      {nextSegment && (
        <div className="rounded-1 p-8 my-10 flight-info">
          <div className="d-flex">
            <div className="body-small-regular pe-5">
              {flightDurationFormatter(
                arrival,
                nextSegment.designator.departure,
              )}{' '}
              {additional.layoverTimeInfo} {destinationCityName}
            </div>
            <div className="change-aircraft">
              {additional.changeOfAircraftLabel}
            </div>
          </div>
          {additional.layoverNote ? (
            <div className="body-small-medium">
              {additional.layoverNote}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

Segment.propTypes = {
  nextSegment: PropTypes.any,
  designator: PropTypes.any,
  identifier: PropTypes.any,
  legs: PropTypes.array,
};

export default Segment;
