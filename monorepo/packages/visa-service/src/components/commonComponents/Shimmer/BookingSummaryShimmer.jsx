import React from 'react';

const BookingSummaryShimmer = () => {
  return (
    <div className="flight-item-shimmer mb-8">
      <div className="card br">
        <div className="wrapper">
          <div className="d-flex justify-content-between gap-20 align-items-center">
            <div className="comment br animate w10 he1" />
            <div className="comment br animate w15 he1" />
          </div>
          <div className="d-flex justify-content-between gap-20 align-items-center">
            <div className="comment br animate w15 he2" />
            <div className="comment br animate w20 he2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryShimmer;
