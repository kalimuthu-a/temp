import React from 'react';
import PassengerItemShimmer from './PassengerItemShimmer';

const VisaReview = () => {
  const arrayOfCards = [1, 2];

  return (
    <div className="w-100">
      <div className="flight-item-shimmer mb-8">
        <div className="card br">
          <div className="wrapper">
            <div className="d-flex justify-content-between">
              <div className="comment br animate w30 he2" />
            </div>
            <div className="d-flex justify-content-between gap-20 align-items-center mt-16">
              <div className="comment br animate w100 he3" />
            </div>
          </div>
        </div>
      </div>

      {arrayOfCards.map((i) => (
        <div className="flight-item-shimmer mb-8" key={i}>
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
      ))}

      <div className="flight-item-shimmer mb-8 tab-shimmer">
        <div className="card br">
          <div className="wrapper">
            <div className="d-flex justify-content-between">
              <div className="comment br animate w100 he2 tab" />
            </div>

          </div>
        </div>
      </div>
      <div className="passenger-list">
        <PassengerItemShimmer />
        <PassengerItemShimmer />
      </div>
    </div>

  );
};

export default VisaReview;
