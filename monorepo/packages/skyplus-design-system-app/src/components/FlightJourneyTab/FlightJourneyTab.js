import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import FlightJourneyTabItem from './FlightJourneyTabItem';

const FlightJourneyTab = ({
  onChangeCallback,
  containerClass = '',
  sectors,
  selectedIndex = 0,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const onClickTab = (index) => {
    if (onChangeCallback) {
      onChangeCallback(index);
    }
    setTabIndex(index);
  };

  useEffect(() => {
    setTabIndex(selectedIndex);
  }, [selectedIndex]);

  return (
    <div className="flight-journey-tab-wrapper">
      <div
        className={`flight-journey-tab-container ${containerClass}`.trim()}
        role="tablist"
        aria-labelledby="Journey Tab"
        tabIndex={-1}
      >
        {sectors.map((sector, index) => (
          <FlightJourneyTabItem
            {...sector}
            key={sector.key}
            index={index}
            active={tabIndex === index}
            onClick={onClickTab}
          />
        ))}
      </div>
    </div>
  );
};

FlightJourneyTab.propTypes = {
  onChangeCallback: PropTypes.func,
  containerClass: PropTypes.string,
  sectors: PropTypes.any,
  selectedIndex: PropTypes.number,
};

export default FlightJourneyTab;
