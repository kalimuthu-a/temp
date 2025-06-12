/* eslint-disable i18next/no-literal-string */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { AppContext } from '../../../context/AppContext';
import PaxSelectionPopover from './PaxSelectionPopover';
import CountrySelectionPopover from './CountrySelectionPopover';
import VisaCountryNotAvailablePopup from './VisaCountryNotAvailablePopup';
import { visaServiceActions } from '../../../context/reducer';
import { getCountryList } from '../../../services';
import { formatDateWithSuffixAndMonth } from '../../../utils';

const HeaderOffcanvas = ({ onClose, date }) => {
  const {
    state: {
      visaSrpByPath,
      selectedVisaPax,
      visaCountriesDetails,
    },
    dispatch,
  } = React.useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visaServiceNotAvailCountry, setVisaServiceNotAvailCountry] = useState('');
  const [isMobile] = useIsMobileBooking();
  const [countryList, setCountryList] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const displayUserName = selectedVisaPax?.[0]?.name?.first || '';
  const countryName = visaCountriesDetails?.activeCountryName;

  useEffect(() => {
    if (!countryList) {
      let failedApiCall = false;
      const apiCalling = async () => {
        const response = await getCountryList();
        const { data, error } = response;
        if (error) {
          failedApiCall = true;
          return;
        }
        dispatch({
          type: visaServiceActions.GET_COUNTRY_LIST,
          payload: data?.countryIsoCode || [],
        });
        setCountryList(data?.countryIsoCode);
      };
      if (!failedApiCall) {
        apiCalling();
      }
    }
  }, [countryList]);

  return createPortal(
    <div
      className="visa-booking-widget bookingmf-container srp"
    >
      <div className="skyplus-offcanvas top is-hidden">
        <div className="skyplus-offcanvas__contents">
          <div className="skyplus-offcanvas__contents--body booking-widget-srp">
            <div className="action-wrapper d-flex d-none">
              <div className="flex-grow-1 d-flex justify-content-center tab-pill">
                <div className="book-flight-button" />
              </div>
              <Icon className="icon-close-simple" onClick={() => onClose(selectedCountry, true)} />
            </div>
            <div className="booking-widget-overlay">
              {isMobile && (
                <div
                  className="booking-widget--mclose"
                  onClick={() => onClose(selectedCountry, true)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      onClose(selectedCountry, true);
                    }
                  }}
                  aria-label="Close booking-summary"
                >
                  <span className="icon-close-simple " />
                </div>
              )}
              {isMobile && (
                <>
                  <HtmlBlock
                    className="visa-booking-user"
                    html={(
                      visaSrpByPath?.welcomeMessageForEVisaProcess?.html
                        ?.replace('{user}', displayUserName || '')
                    )}
                  />
                  <div className="visa-booking-widget-tabs">
                    <div
                      className="visa-booking-widget-tabs--item active"
                      role="presentation"
                    >
                      <i className="icon-Indigo_Logo md" />
                      <div className="skyplus-text tab-link body-small-medium">
                        {visaSrpByPath?.bookEVisaLabel?.value}
                      </div>
                    </div>
                    <div
                      className="visa-booking-widget-tabs--item d-none"
                      role="presentation"
                    >
                      <i className="sky-icons icon-hotel md" />
                      <div className="skyplus-text tab-link body-small-medium" />
                    </div>
                  </div>
                </>
              )}

              <div className="visa-widget-header-wrapper">
                <div className="visa-widget-header-section">
                  <div className="visa-widget-header-content">
                    <div className="visa-header-section-city-info">
                      <span className="visa-header-section-city-info-to">
                        {countryName || ''}
                      </span>
                    </div>
                    <div className="visa-header-section-date-info">
                      {date ? formatDateWithSuffixAndMonth(date) : null}
                    </div>
                    <div className="visa-header-section-traveller-info">
                      {`${selectedVisaPax?.length || 0} Traveller(s)`}
                    </div>
                  </div>

                </div>

                <div className="visa-widget-header-cross-main">
                  <i
                    role="button"
                    tabIndex="0"
                    aria-label="Close"
                    onClick={() => onClose(selectedCountry, true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onClose(selectedCountry, true);
                      }
                    }}
                    className="sky-icons icon-close-simple cursor-pointer md"
                  />
                </div>

              </div>
              <div className="form-wrapped">
                <div className="visa-widget-form">
                  <div className="visa-widget-form-top">
                    {countryList ? (
                      <CountrySelectionPopover
                        setIsModalOpen={setIsModalOpen}
                        setVisaServiceNotAvailCountry={setVisaServiceNotAvailCountry}
                        countriesList={countryList}
                        setSelectedCountry={setSelectedCountry}
                        selectedCountry={selectedCountry}
                      />
                    ) : null}

                    <div className="visa-widget-form-top-right">
                      <div className="visa-widget-form-top-right-date">
                        <span className="date-label">
                          {visaSrpByPath?.arrivingOnLabel || 'Arriving On'}
                        </span>
                        <span className="date-value">
                          {date}
                        </span>
                      </div>
                      <PaxSelectionPopover
                        onClose={() => onClose(selectedCountry, true)}
                      />
                    </div>
                  </div>
                  <div className="visa-widget-form-bottom">
                    <Button
                      onClick={() => onClose(selectedCountry)}
                      size="sm"
                    >
                      {visaSrpByPath?.continueLabel}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="booking-widget-overlay-bg">&nbsp;</div>
            {isModalOpen ? (
              <VisaCountryNotAvailablePopup
                onClose={() => setIsModalOpen(false)}
                description={visaSrpByPath?.visaServiceNotAvailablePopup?.description}
                title={visaSrpByPath?.visaServiceNotAvailablePopup?.title}
                buttonText={visaSrpByPath?.visaServiceNotAvailablePopup?.ctaLabel}
                countryName={visaServiceNotAvailCountry}
              />
            ) : null}
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
