/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import './Loader.scss';

const Loader = () => {
  return (
    <div className="itinerary-loader">
      <div className="itinerary-loader__overlay">
        <div className="itinerary-loader__overlay__popup">
          <div className="itinerary-loader__overlay__popup__content">
            <div className="itinerary-loader__overlay__popup__content__main">
              <div className="itinerary-loader__overlay__popup__content__main__body">
                <div className="itinerary-loader__overlay__popup__content__main__body__flight-animation">
                  <img src="/content/dam/s6web/in/en/assets/payments-page-icon.gif" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
