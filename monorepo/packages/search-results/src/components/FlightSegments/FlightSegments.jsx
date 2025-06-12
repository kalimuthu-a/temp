import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import FlightJourneyTabs from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';

import useAppContext from '../../hooks/useAppContext';
import { srpActions } from '../../context/reducer';
import { screenLiveAnnouncer } from '../../utils/a11y';

const FlightSegments = ({ minDate }) => {
  const {
    state: { selectedTripIndex, segments },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    const headerElement = document.querySelector('.headerv2');
    const tabContainer = document.querySelector('.flight-journey-tab-wrapper');

    if (headerElement && tabContainer) {
      const headerHeight = headerElement.offsetHeight;
      tabContainer.style.top = `${headerHeight}px`;
    }
  }, []);

  const onChangeSector = (index) => {
    dispatch({ type: srpActions.CHANGE_SELECTED_TRIP_INDEX, payload: index });
    const segment = segments[index];
    screenLiveAnnouncer(
      `Select Flight From ${segment.originCityName} to ${segment.destinationCityName}`,
    );
  };

  const sectors = useMemo(() => {
    return segments.map((segment, index) => ({
      origin: segment.origin,
      destination: segment.destination,
      key: index,
    }));
  }, [segments]);

  if (sectors.length === 0) {
    return null;
  }

  return (
    <FlightJourneyTabs
      containerClass="srp"
      sectors={sectors}
      onChangeCallback={onChangeSector}
      selectedIndex={selectedTripIndex}
      minData={minDate}
    />
  );
};

FlightSegments.propTypes = {
  minDate: PropTypes.any,
};

export default FlightSegments;
