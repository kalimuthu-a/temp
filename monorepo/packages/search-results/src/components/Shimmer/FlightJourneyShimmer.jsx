import React from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

const FlightJourneyShimmer = () => {
  const [isMobile] = useIsMobile();

  return (
    <div className="d-flex justify-content-between gap-4 flight-date-slider">
      {[...Array(isMobile ? 4 : 7).keys()].map((i) => (
        <div className="flight-item-shimmer flight-journey-shimmer" key={i}>
          <div className="text br animate w80" />
          <div className="text br animate w60" />
        </div>
      ))}
    </div>
  );
};

export default FlightJourneyShimmer;
