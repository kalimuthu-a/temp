/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-nested-ternary */
/* eslint-disable i18next/no-literal-string */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Popover from 'skyplus-design-system-app/dist/des-system/Popover';
import { emptyFn } from 'skyplus-design-system-app/dist/des-system/utils';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { key as keyboardsKey, PAGES } from '../../../constants';
import { AppContext } from '../../../context/AppContext';

const CountrySelectionPopover = ({
  setIsModalOpen,
  setVisaServiceNotAvailCountry,
  countriesList,
  setSelectedCountry,
  selectedCountry,
}) => {
  const {
    state: {
      visaSrpByPath,
      visaCountriesDetails,
      visaPageSectionType,
      createdVisaBookingDetails,
    },
  } = React.useContext(AppContext);
  const [selectedDestination, setSelectedDestination] = useState({
    label: visaCountriesDetails?.activeCountryName,
    value: visaCountriesDetails?.activeCountryCode,
  });
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

  const [isMobile] = useIsMobile();
  const visaJourneyDetails = visaCountriesDetails?.flightBookingCountries;

  const onKeyUpHandler = (e) => {
    e.preventDefault();
    if (e.key === keyboardsKey.enter) {
      e.target.click();
    }
  };

  const checkVisaAvaiableCountry = (value) => {
    return Object.entries(countriesList)?.filter(
      (cData) => cData?.[1]?.isoCodeA2 === value,
    )?.[0]?.[0] || false;
  };

  const onChangeHandler = (value) => {
    const selectedCity = visaCountriesDetails?.flightBookingCountriesCode?.filter(
      (countryCode) => countryCode === value,
    );
    const isCountryAvailableForVisa = checkVisaAvaiableCountry(value);
    if (isCountryAvailableForVisa) {
      setSelectedDestination({
        label: isCountryAvailableForVisa,
        value,
      });
      setSelectedCountry({
        activeCountryName: isCountryAvailableForVisa,
        activeCountryCode: value,
      });
    } else {
      setIsModalOpen(true);
      setVisaServiceNotAvailCountry(selectedCity?.[0]);
    }
  };

  const onCloseHandler = () => {
    setIsCountryModalOpen(false);
  };

  const countryNames = visaCountriesDetails?.flightBookingCountriesCode?.map((countyCode) => {
    const cName = Object.entries(countriesList)?.filter(
      (cData) => cData?.[1]?.isoCodeA2 === countyCode,
    )?.[0]?.[0];
    return ({
      label: cName,
      value: countyCode,
    });
  });

  return (
    <Popover
      containerClass={`visa-widget-form-country-popover cursor-pointer  
        ${((visaPageSectionType === PAGES.VISA_PLAN_DETAILS) || createdVisaBookingDetails)
        && 'disable-country-selection'}`}
      setToggleModal={() => (!isMobile ? emptyFn : setIsCountryModalOpen(true))}
      renderElement={() => (
        <>
          <div
            className="visa-widget-form-country-popover-main"
            key=""
            tabIndex="0"
            aria-label="Country filter"
            role="button"
            onKeyUp={onKeyUpHandler}
          >
            <div className="country-for-label">{visaSrpByPath?.visaForLabel || 'For'}</div>
            <div className="country-value">{selectedCountry?.activeCountryName
              || visaCountriesDetails?.activeCountryName}
            </div>
          </div>
          {visaJourneyDetails?.length !== 1 ? <Icon className="icon-accordion-down-simple md" /> : null}
        </>
      )}
      renderPopover={() => (
        visaJourneyDetails?.length !== 1
          ? (
            !isMobile ? (
              <div className="bw-popover__content">
                <div className="pop-over-header-mobile d-none">
                  <div className="icon-circle">
                    <Icon className="icon-close-simpl  md" />
                  </div>
                </div>
                <div className="visa-country-selection-popover">
                  <div className="country-for-label">{visaSrpByPath?.visaForLabel || 'For ?'}</div>
                  {countryNames?.length > 0 ? (
                    <RadioBoxGroup
                      items={countryNames}
                      onChange={onChangeHandler}
                      selectedValue={selectedDestination?.value}
                      containerClassName="visa-country-selection-radio-selection"
                      name="destination"
                    />
                  ) : null}
                </div>
              </div>
            )
              : (
                isCountryModalOpen ? (
                  <PopupModalWithContent
                    onCloseHandler={onCloseHandler}
                    className="visa-widget-form-popover-modal"
                    modalTitle={visaSrpByPath?.applicantPickerLabel?.html || ''}
                  >
                    <div className="modal-des">
                      {visaSrpByPath?.destinationSelectorMessage}
                    </div>
                    {countryNames?.length > 0 ? (
                      <>
                        <RadioBoxGroup
                          items={countryNames}
                          onChange={onChangeHandler}
                          selectedValue={selectedDestination?.value}
                          containerClassName="visa-widget-form-popover-modal-radio-selection"
                          name="destination"
                        />
                        {isMobile ? (
                          <div className="visa-widget-form-popover-modal-bottom">
                            <Button
                              color="primary"
                              size="medium"
                              onClick={() => onCloseHandler()}
                            >
                              {visaSrpByPath?.continueLabel || 'Continue'}
                            </Button>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </PopupModalWithContent>
                ) : null
              )
          ) : null
      )}
    />
  );
};

export default CountrySelectionPopover;
