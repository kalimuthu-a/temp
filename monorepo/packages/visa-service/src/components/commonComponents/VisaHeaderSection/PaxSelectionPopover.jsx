/* eslint-disable no-nested-ternary */
/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Popover from 'skyplus-design-system-app/dist/des-system/Popover';
import { emptyFn } from 'skyplus-design-system-app/dist/des-system/utils';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import PropTypes from 'prop-types';
import { key as keyboardsKey } from '../../../constants';
import VisaPaxSelection from '../VisaPaxSelection/VisaPaxSelection';
import { AppContext } from '../../../context/AppContext';
import { PAX_CODES } from '../../../utils';

const PaxSelectionPopover = ({ onClose }) => {
  const {
    state: {
      getItineraryDetails,
      visaSrpByPath,
      createdVisaBookingDetails,
      visaPaxSelectByPath,
      selectedVisaPax,
    },
  } = React.useContext(AppContext);
  const [isMobile] = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const onKeyUpHandler = (e) => {
    e.preventDefault();
    if (e.key === keyboardsKey.enter) {
      e.target.click();
    }
  };

  const onCloseHandler = () => {
    setIsModalOpen(false);
  };

  const totalJourneyPassenger = (itineraryPax) => {
    const paxs = [...itineraryPax];
    const findPaxLabel = visaPaxSelectByPath?.paxList?.find((pax) => pax.typeCode === PAX_CODES.INFANT);
    getItineraryDetails?.passengers?.forEach((passenger, pIndex) => {
      if (passenger?.infant) {
        const paxKey = `${passenger?.passengerKey}${findPaxLabel?.paxLabel?.toLowerCase()}`;
        const isInfantAlreadyAdded = paxs?.some((p) => p?.passengerKey === paxKey);
        if (!isInfantAlreadyAdded) {
          const infantPax = {
            ...passenger,
            name: passenger?.infant?.name,
            info: {
              dateOfBirth: passenger?.infant?.dateOfBirth,
              gender: passenger?.infant?.gender,
              nationality: passenger?.infant?.nationality,
            },
            passengerKey: '',
            passengerTypeCode: PAX_CODES.INFANT,
            passengerInfantKey: `${paxKey}-${pIndex}`,
          };
          paxs.push(infantPax);
        }
      }
    });
    return [...paxs];
  };
  const totalVisaJourneyPassenger = totalJourneyPassenger(getItineraryDetails?.passengers) || [];

  return (
    <Popover
      containerClass="visa-widget-form-pax-box cursor-pointer"
      setToggleModal={() => (!isMobile ? emptyFn : setIsModalOpen(true))}
      renderElement={() => (
        <div
          className={`visa-widget-form-popover ${createdVisaBookingDetails && 'bg-btn-disabled-background-light'}`}
          key=""
          tabIndex="0"
          aria-label="Sort Filter"
          role="button"
          onKeyUp={(e) => !createdVisaBookingDetails && onKeyUpHandler(e)}
        >
          <div className="visa-widget-form-popover-left">
            <span className="pax-box-label">
              {visaSrpByPath?.applicantsLabel || 'Applicants'}
            </span>
            <span className="pax-box-value">
              {selectedVisaPax?.length} {' '}{visaPaxSelectByPath?.travellersLabel}
            </span>
          </div>
          <div className="visa-widget-form-popover-right">
            <Icon className="icon-accordion-down-simple  md" onClick={() => { }} />
          </div>
        </div>
      )}
      renderPopover={() => (
        createdVisaBookingDetails ? null
          : !isMobile
            ? (
              <div className="bw-popover__content">
                <div className="pop-over-header-mobile d-none">
                  <div className="icon-circle">
                    <Icon className="icon-close-simpl  md" />
                  </div>
                </div>
                <div className="pax-fare-selection-popover">
                  <VisaPaxSelection
                    itineraryDetail={getItineraryDetails}
                    passengers={getItineraryDetails?.passengers}
                    isDisplayTraveller
                    totalPassenger={totalVisaJourneyPassenger}
                    onClose={onClose}
                  />
                </div>
              </div>
            ) : (
              isModalOpen ? (
                <PopupModalWithContent
                  onCloseHandler={onCloseHandler}
                  className="visa-widget-form-popover-modal"
                  modalTitle={visaSrpByPath?.applicantPickerLabel?.html || ''}
                >
                  <div className="modal-des">
                    {visaPaxSelectByPath?.selectTravelersForVisaLabel}
                  </div>
                  <VisaPaxSelection
                    itineraryDetail={getItineraryDetails}
                    passengers={getItineraryDetails?.passengers}
                    isDisplayTraveller
                    totalPassenger={totalVisaJourneyPassenger}
                    onClose={onClose}
                  />
                </PopupModalWithContent>
              ) : null
            )
      )}
    />
  );
};

PaxSelectionPopover.propTypes = {
  onClose: PropTypes.func,
};

export default PaxSelectionPopover;
