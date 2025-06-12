import PropTypes from 'prop-types';
import React from 'react';

import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

const JourneyLap = ({
  containerClass,
  duration = '',
  stops = null,
  onClickLap,
  stopsLabel = 'Stops',
  nonStopLabel = '',
}) => {
  const renderStopInformation = (stopsParam) => {
    if (stopsParam !== null) {
      if (stopsParam > 0) {
        return (
          <div
            className="body-small-regular text-color"
            onClick={onClickLap}
            role="presentation"
          >
            {stopsParam} {stopsLabel}
          </div>
        );
      }
      return (
        <Text
          variation="body-small-regular"
          containerClass="text-color"
        >
          {nonStopLabel}
        </Text>
      );
    }
    return null;
  };

  return (
    <div className={`journey-lap ${containerClass}`}>
      <Icon className="icon-Flight journey-lap-flight-icon" size="md" />
      <div className="journey-lap-line" />
      <div className="d-flex gap-1 flex-column align-items-center">
        <Text
          variation="body-small-regular"
          containerClass="text-color"
        >
          {duration}
        </Text>
        {renderStopInformation(stops)}
      </div>
      <div className="journey-lap-line" />

      <div className="journey-lap-dot" />
    </div>
  );
};

JourneyLap.propTypes = {
  containerClass: PropTypes.any,
  duration: PropTypes.string,
  stopsLabel: PropTypes.string,
  nonStopLabel: PropTypes.string,
  onClickLap: PropTypes.any,
  stops: PropTypes.number,
};

export default JourneyLap;
