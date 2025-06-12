/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';

const Loader = () => {
  const [imageSrc, setImageSrc] = useState('/content/dam/s6web/in/en/assets/payments-page-icon.gif');

  const handleError = () => {
    setImageSrc('https://s6web-uat.goindigo.in/content/dam/s6web/in/en/assets/payments-page-icon.gif');
  };

  return (
    <div className="split_pnr--loader">
      <div className="split_pnr--loader-overlay">
        <div className="split_pnr--loader-overlay-popup">
          <div className="split_pnr--loader-overlay-popup-content">
            <div className="split_pnr--loader-overlay-popup-content-main">
              <div className="split_pnr--loader-overlay-popup-content-main-body">
                <div className="split_pnr--loader-overlay-popup-content-main-body-flight-animation">
                  <img src={imageSrc} onError={handleError} alt="loader" />
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
