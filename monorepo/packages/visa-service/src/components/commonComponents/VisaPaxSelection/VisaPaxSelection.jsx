import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { AppContext } from '../../../context/AppContext';
import { VisaPaxCard } from './VisaPaxAccordionWrapper';
import { visaServiceActions } from '../../../context/reducer';
import { pushAnalytic } from '../../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../../utils/analytic';
import { formatDate, UTIL_CONSTANTS } from '../../../utils';
// Wrapper Component for Visa Pax Selection
const VisaPaxSelection = ({
  trackVisaStatus,
  itineraryDetail,
  isDisplayTraveller = false,
  totalPassenger,
  onClose,
}) => {
  const {
    state: {
      visaPaxSelectByPath,
      selectedVisaPax,
      visaAllQuotations,
    },
    dispatch,
  } = React.useContext(AppContext);
  const [selectedVisaPassengers, setSelectedVisaPassengers] = useState(selectedVisaPax);
  const {
    continueCtaLabel,
    viewStatusCTALabel,
    passportLabel,
  } = visaPaxSelectByPath?.items || {};

  const onSelectCheckBox = (selectedPaxKey = '', selectedInfantKey = '') => {
    const updatedSelection = [...selectedVisaPassengers];
    let paxIndex = -1;
    if (selectedInfantKey !== '') {
      paxIndex = updatedSelection.findIndex(
        (pax) => (pax?.passengerInfantKey === selectedInfantKey),
      );
    } else {
      paxIndex = updatedSelection.findIndex(
        (pax) => (pax?.passengerKey === selectedPaxKey),
      );
    }
    if (paxIndex !== -1) {
      // Passenger is already selected - remove them
      updatedSelection.splice(paxIndex, 1);
    } else {
      // Passenger not in selection - find in main list and add them
      let selectedPaxObj = null;
      if (selectedInfantKey !== '') {
        selectedPaxObj = totalPassenger?.find((p) => ((p?.passengerKey === selectedPaxKey)
        && (p?.passengerInfantKey === selectedInfantKey)));
      } else {
        selectedPaxObj = totalPassenger?.find((p) => (p.passengerKey === selectedPaxKey));
      }

      if (selectedPaxObj) {
        updatedSelection.push(selectedPaxObj);
      }
    }
    setSelectedVisaPassengers(updatedSelection);
  };

  const analyticsSelectedPax = (pax) => {
    /* Selected passenger for opted visa service */
    const journeyDate = itineraryDetail?.journeysDetail?.[0]?.journeydetail?.departure || '';
    const date = journeyDate ? formatDate(
      journeyDate,
      UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY,
    ) : '';
    pushAnalytic({
      event: EVENTS_NAME.VISA_MODIFY_FLOW,
      data: {
        pageName: AA_CONSTANTS.Visa_Search_Result,
        pnrResponse: {
          passengers: pax,
          pnr: itineraryDetail?.bookingDetails?.recordLocator || '',
          sector: visaAllQuotations?.data?.country || '',
          departureDates: date,
        },
        _event: EVENTS_NAME.VISA_SELECT_PAX,
        _eventInfoName: 'Continue',
        _componentName: 'Visa Modify',
        position: '',
      },
    });
  };

  const renderButton = () => {
    const buttonProps = {
      disabled: !selectedVisaPassengers.length,
    };
    return (
      <Button
        color="primary"
        size="small"
        {...buttonProps}
        onClick={() => {
          dispatch({
            type: visaServiceActions.VISA_SELECTED_PAX,
            payload: selectedVisaPassengers,
          });
          dispatch({
            type: visaServiceActions.SHOW_FULL_VISA_BOOKING_WIDGET,
            payload: false,
          });
          onClose();
          analyticsSelectedPax(selectedVisaPassengers);
        }}
      >
        {!trackVisaStatus ? (continueCtaLabel || 'Continue') : (viewStatusCTALabel || 'View Visa Status')}
      </Button>
    );
  };

  return (
    <div className="visa-pax-selection">
      <div className="visa-pax-selection-container">
        {totalPassenger?.map((pax, key) => {
          const isSelected = (selectedVisaPassengers.length > 0) ? selectedVisaPassengers?.filter(
            (selectedPax) => {
              if ((!selectedPax.passengerKey && selectedPax?.passengerInfantKey)) {
                return pax?.passengerInfantKey === selectedPax?.passengerInfantKey;
              }
              return (selectedPax.passengerKey === pax?.passengerKey);
            },
          ) : false;
          return (
            <VisaPaxCard
              key={pax.passengerKey}
              pax={pax}
              isSelected={isSelected.length > 0}
              onSelect={() => onSelectCheckBox(pax?.passengerKey, pax?.passengerInfantKey)}
              trackVisaStatus={trackVisaStatus}
              passportLabel={passportLabel}
              isDisplayTraveller={isDisplayTraveller}
              paxNumber={1 + key}
              index={key}
            />
          );
        })}
      </div>
      <div className="visa-pax-selection-btn">
        <div className="visa-pax-selection-btn-left">
          {`${selectedVisaPassengers?.length} Applicants`}
        </div>
        {renderButton()}
      </div>
    </div>
  );
};

VisaPaxSelection.propTypes = {
  trackVisaStatus: PropTypes.bool,
  passengers: PropTypes.array,
  itineraryDetail: PropTypes.object,
  isDisplayTraveller: PropTypes.bool,
  totalPassenger: PropTypes.any,
  onClose: PropTypes.func,
};

export default VisaPaxSelection;
