import React from 'react';
import PassengerItemShimmer from './PassengerItemShimmer';
import TravelImageShimmer from './TravelImageShimmer';

const PaxSelectShimmer = () => {
  return (
    <div className="shimmer-container-pax-select">
      <div className="left-shimmer">
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

          <div className="flight-item-shimmer mb-8">
            <div className="card br">
              <div className="wrapper">
                <div className="d-flex justify-content-between gap-20 align-items-center">
                  <div className="comment br animate w10 he1" />
                  <div className="comment br animate w30 he2" />
                  <div className="comment br animate w15 he1" />
                </div>
              </div>
            </div>
          </div>

          <div className="passenger-list">
            <PassengerItemShimmer />
            <PassengerItemShimmer />
          </div>
        </div>
      </div>

      <div className="right-shimmer">
        <div className="passenger-list">
          <TravelImageShimmer />
        </div>

        <div className="flight-item-shimmer my-8">
          <div className="card br">
            <div className="wrapper">
              <div className="d-flex justify-content-between">
                <div className="comment br animate w30 he2" />
              </div>

              <div className="d-flex justify-content-between gap-20 align-items-center">
                <div className="comment br animate w30 he5" />
                <div className="comment br animate w30 he5" />
                <div className="comment br animate w30 he5" />
              </div>
            </div>
          </div>
        </div>

        <div className="flight-item-shimmer my-8">
          <div className="card br">
            <div className="wrapper">
              <div className="d-flex justify-content-between gap-20 align-items-center">
                <div className="comment br animate w30 he2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaxSelectShimmer;
