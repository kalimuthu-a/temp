import React from 'react';

import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import PropTypes from 'prop-types';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import { createPortal } from 'react-dom';

import FlightIcon from '../../components/Icons/FlightIcon';
import useAppContext from '../../hooks/useAppContext';
import Form from '../../components/Form/Form';

const HeaderOffcanvas = ({ onClose }) => {
  const {
    state: { main, isLoyaltyEnabled },
  } = useAppContext();

  const [isMobile] = useIsMobileBooking();

  return createPortal(
    <div
      className={`booking-header-widget bookingmf-container srp ${
        isLoyaltyEnabled ? 'loyalty-enabled' : ''
      }`}
    >
      <div className="skyplus-offcanvas top is-hidden">
        <div className="skyplus-offcanvas__contents">
          <div className="skyplus-offcanvas__contents--body booking-widget-srp">
            <div className="action-wrapper d-flex">
              <div className="flex-grow-1 d-flex justify-content-center tab-pill">
                <div className="book-flight-button">
                  {main?.bookFlightLabel}
                  <FlightIcon />
                </div>
              </div>
              <Icon className="icon-close-simple" onClick={onClose} />
            </div>
            <div className="booking-widget-overlay">
              {isMobile && (
                <div className="bookingmf-container__tabs">
                  <div
                    className="bookingmf-container__tabs--item active"
                    role="presentation"
                  >
                    <i className="sky-icons icon-Indigo_Logo md" />
                    <div className="skyplus-text tab-link body-small-medium">
                      {main?.bookFlightLabel}
                    </div>
                  </div>
                  <div
                    className="bookingmf-container__tabs--item"
                    role="presentation"
                  >
                    <i className="sky-icons icon-hotel md" />
                    <div className="skyplus-text tab-link body-small-medium">
                      {main?.bookStayLabel}
                    </div>
                  </div>
                </div>
              )}
              <div className="form-wrapped">
                <Form />
              </div>
            </div>
            <div className="booking-widget-overlay-bg">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

HeaderOffcanvas.defaultProps = {};

HeaderOffcanvas.propTypes = {
  onClose: PropTypes.func,
};

export default HeaderOffcanvas;
