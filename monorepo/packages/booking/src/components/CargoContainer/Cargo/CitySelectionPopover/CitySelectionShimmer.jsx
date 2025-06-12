import React from 'react';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';

const CitySelectionShimmer = () => {
  const renderAirportRow = () => {
    const key = uniq();

    return (
      <div className="mb-12" key={key}>
        <div className="shimmer-row row-1-8-8-3">
          <div className="shimmer-cell" />
          <div className="shimmer-cell" />
          <div />
          <div className="shimmer-cell" />
        </div>
        <div className="shimmer-row row-1-12-8">
          <div />
          <div className="shimmer-cell" />
          <div />
        </div>
      </div>
    );
  };

  return (
    <div className="city-selection-shimmer">
      <div className="mb-12">
        <div className="shimmer-row row-1-1">
          <div className="shimmer-cell" />
        </div>
        <div className="shimmer-row row-1-1-1-1">
          <div className="shimmer-cell" />
        </div>
      </div>
      {Array.from({ length: 5 }).map(renderAirportRow)}
    </div>
  );
};

export default CitySelectionShimmer;
