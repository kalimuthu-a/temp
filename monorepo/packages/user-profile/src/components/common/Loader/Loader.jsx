import React from 'react';
import './Loader.scss';

const Loader = () => {
  return (
    <div className="page-loader">
      <div className="page-loader__overlay">
        <div className="page-loader__overlay__popup">
          <div className="page-loader__overlay__popup__content">
            <div className="page-loader__overlay__popup__content__main">
              <div className="page-loader__overlay__popup__content__main__body">
                <div className="page-loader__overlay__popup__content__main__body__flight-animation">
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
