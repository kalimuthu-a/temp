import React from 'react';

const TravelImageShimmer = () => {
  return (
    <div className="passenger-item-shimmer mb-8">
      <div className="card br">
        <div className="wrapper">
          <div className="d-flex justify-content-between">
            <div className="comment br animate w50 he4" />
          </div>
          <div className="d-flex justify-content-between gap-20 align-items-center">
            <div className="comment br animate w100 heimage" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TravelImageShimmer;
