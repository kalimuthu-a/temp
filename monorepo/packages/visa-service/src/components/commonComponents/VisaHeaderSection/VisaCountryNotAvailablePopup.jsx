/* eslint-disable react/prop-types */
import React from 'react';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

const VisaCountryNotAvailablePopup = (
  {
    onClose,
    description,
    title,
    buttonText,
    countryName,
  },
) => {
  return (
    <PopupModalWithContent
      onCloseHandler={onClose}
      className="visa-select-country vs-unavailable"
      modalTitle={description?.html?.replace('{country}', ` ${countryName}`)}
    >
      <div className="visa-select-country-popup">
        <div className="visa-select-country-popup-main align-items-center">
          <div className="visa-select-country-popup-main-body">
            <div className="visa-select-country-popup-main-body-sub-heading">
              {title?.replace('{country}', countryName)}
            </div>
          </div>
        </div>
        <Button
          size="large"
          className="continue-btn active"
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </div>
    </PopupModalWithContent>
  );
};

export default VisaCountryNotAvailablePopup;
