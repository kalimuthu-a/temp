/* eslint-disable i18next/no-literal-string */
import React from 'react';

const MoreInformation = () => {
  return (
    <div className="accordion">
      <h2 className="accordion__heading">
        <p>
          More <span className="green">information</span>
        </p>
      </h2>
      <div className="accordion__container">
        <div className="accordion__header" role="button" tabIndex={0}>
          <div className="accordion__header__logo">
            <i className="indigoIcon icon-note" />
          </div>
          <div className="accordion__header__title">Note </div>
          <div className="accordion__header__arrowicon icon-accordion-down-simple" />
        </div>
        <div className="accordion__header" role="button" tabIndex={0}>
          <div className="accordion__header__logo">
            <i className="iconmoon-baggage icon-baggage-allowance" />
          </div>
          <div className="accordion__header__title">
            Baggage Allowance: Saver fare Sector{' '}
            <p className="accordion__header__subtitle">DEL-JAI</p>
          </div>
          <div className="accordion__header__arrowicon icon-accordion-down-simple" />
        </div>
        <div className="accordion__header" role="button" tabIndex={0}>
          <div className="accordion__header__logo">
            <i className="indigoIcon icon-terms-and-conditions" />
          </div>
          <div className="accordion__header__title">
            Terms &amp; Conditions{' '}
          </div>
          <div className="accordion__header__arrowicon icon-accordion-down-simple" />
        </div>
        <div className="accordion__header" role="button" tabIndex={0}>
          <div className="accordion__header__logo">
            <i className="indigoIcon icon-terminal-information" />
          </div>
          <div className="accordion__header__title">Terminal Information </div>
          <div className="accordion__header__arrowicon icon-accordion-down-simple" />
        </div>
        <div className="accordion__header" role="button" tabIndex={0}>
          <div className="accordion__header__logo">
            <i className="indigoIcon icon-flight-delay" />
          </div>
          <div className="accordion__header__title">
            Flight Delay or Cancellation{' '}
          </div>
          <div className="accordion__header__arrowicon icon-accordion-down-simple" />
        </div>
      </div>
    </div>
  );
};

export default MoreInformation;
