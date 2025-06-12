/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';

import { capitalizeFirstLetter } from '../../../utils';
import { getGender } from '../../../functions/GetGender';
import { getAge } from '../../../functions/GetAge';
import { CONSTANTS } from '../../../constants';
import { AppContext } from '../../../context/AppContext';

const VisaPaxAccordionWrapper = ({
  titleComponent,
  contentComponent,
  containerClassName = '',
  initalActiveIndexes = 0,
}) => {
  const accordionData = [{
    title: titleComponent,
    renderAccordionContent: contentComponent,
  }];

  return (
    <div className={containerClassName}>
      <Accordion
        activeIndex={0}
        accordionData={accordionData}
        setActiveIndex={() => { }}
        initalActiveIndexes={[initalActiveIndexes]}
        isMultiOpen
        containerClassName={containerClassName}
      />
    </div>
  );
};

export default VisaPaxAccordionWrapper;

// Reusable Flight Card Component
// eslint-disable-next-line sonarjs/cognitive-complexity
export const VisaPaxCard = ({
  pax,
  isSelected,
  onSelect,
  trackVisaStatus,
  passportLabel,
  isPOC = false,
  isView = false,
  passengerInfoCreateBooking = false,
  isDisplayTraveller = false,
  paxNumber = 0,
  index,
}) => {
  const {
    state: {
      visaSrpByPath = {},
      bookingConfirmation = {},
    } = {},
  } = React.useContext(AppContext);
  const travellerLabel = visaSrpByPath.travellerLabel || '';
  const paxName = !passengerInfoCreateBooking ? `${pax?.name?.first} ${pax?.name?.last}`
    : pax?.name;
  const paxFirstLastName = passengerInfoCreateBooking ? (pax?.name?.split(' ')) : null;
  const nameAvtar = !passengerInfoCreateBooking
    ? `${capitalizeFirstLetter(pax?.name?.first)}${capitalizeFirstLetter(pax?.name?.last)}`
    : `${capitalizeFirstLetter(paxFirstLastName?.[0])}${capitalizeFirstLetter(
      paxFirstLastName[paxFirstLastName.length - 1],
    )}`;
  const getGenderName = (!passengerInfoCreateBooking && getGender(pax?.info?.gender)) || null;
  const getPaxAge = (!passengerInfoCreateBooking && getAge(pax?.info?.dateOfBirth)) || null;
  const passportNumber = passengerInfoCreateBooking ? (pax?.passortNumber) : '';
  const viewLabel = 'View';
  // Helper function to render passenger info based on trackVisaStatus
  const renderPassengerInfo = () => {
    if (!trackVisaStatus) {
      return (
        <>
          {pax?.passengerTypeCode && (
            <div className="flight-card-passenger-info-container-paxInfo">
              <span>{pax?.passengerTypeCode}</span><span>|</span>
            </div>
          )}
          {getGenderName && (
            <div className="flight-card-passenger-info-container-gender">
              <span>{getGenderName}</span>{getPaxAge && <span>|</span>}
            </div>
          )}
          {getPaxAge && (
            <div className="flight-card-passenger-info-container-age">
              <span>{getPaxAge}</span>
            </div>
          )}
        </>
      );
    }
    return (
      <>
        {passportLabel && (
          <div className="flight-card-passenger-info-container-paxInfo">
            <span>{passportLabel || 'passport'}</span> {passportNumber}
          </div>
        )}
        {!passportLabel && (
          <div className="flight-card-passenger-info-container-passportNumber">
            {/* <span>{getGenderName}</span> */}
            <span>{bookingConfirmation?.applicantLabel} {(index || 0) + 1}</span>
          </div>
        )}
      </>
    );
  };

  // Helper function to render Checkbox or Chip based on trackVisaStatus
  const renderCheckboxOrChip = () => {
    if (isView) {
      return (
        <div
          aria-hidden="true"
          onClick={() => { onSelect(true); }}
          className="flight-card-passenger-edit"
        >{viewLabel}
        </div>
      );
    }

    if (!trackVisaStatus) {
      return (
        <Checkbox
          checked={isSelected}
          value={pax?.passengerKey}
          id={`${pax?.passengerKey}-paxKey`}
          onChangeHandler={() => onSelect(pax?.passengerKey)}
        />
      );
    }

    if (isPOC) {
      return (
        <Chip variant="filled" color="secondary-light" size="sm">
          {pax?.applicationStatusList?.[0]?.value || 'Assigning of POC'}
        </Chip>
      );
    }

    return '';
  };

  return (
    <div
      aria-hidden="true"
      className={`flight-card ${isSelected ? 'selected' : ''}`}
    >
      <div
        className="w-100"
        onClick={() => (!trackVisaStatus ? onSelect(pax?.passengerKey) : null)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !trackVisaStatus) {
            onSelect(pax?.passengerKey);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flight-card-passenger">
          <div className="flight-card-passenger-avtar">
            {nameAvtar}
          </div>
          <div className="flight-card-passenger-info">
            {isDisplayTraveller && (
              <div
                className="flight-card-passenger-info-container"
                data-abc={CONSTANTS.PASSENGER_TYPE[pax?.passengerTypeCode]}
              >
                {`${travellerLabel} ${paxNumber}`}
              </div>
            )}
            <div className="flight-card-passenger-info-name">{paxName}</div>
            {!isDisplayTraveller && (
            <div
              className="flight-card-passenger-info-container"
              data-abc={CONSTANTS.PASSENGER_TYPE[pax?.passengerTypeCode]}
            >
              {renderPassengerInfo()}
            </div>
            )}
          </div>
        </div>
      </div>

      {renderCheckboxOrChip()}
    </div>
  );
};

VisaPaxAccordionWrapper.propTypes = {
  titleComponent: PropTypes.object,
  contentComponent: PropTypes.object,
  containerClassName: PropTypes.string,
  initalActiveIndexes: PropTypes.any,
};
