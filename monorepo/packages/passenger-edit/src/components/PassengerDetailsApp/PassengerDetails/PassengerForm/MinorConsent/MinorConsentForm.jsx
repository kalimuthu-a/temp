/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import CheckBoxV2 from 'skyplus-design-system-app/src/components/CheckBoxV2/CheckBoxV2';
import { AppContext } from '../../../../../context/appContext';
import './MinorConsent.scss';
import { PASSENGER_TYPE, UMNR_ID_CODE, SRCT_ID } from '../../../../../constants/constants';
import checkIfMinorIsSelected from '../../../../../functions/checkIfMinorIsSelected';

const MinorConsentForm = ({ paxData, onConsentChnage, minorConsentCheckboxData }) => {
  const {
    state: {
      aemMainData: {
        specialFareCode,
      },
    },
  } = useContext(AppContext);

  const [isMainCardSelected, setMainCardSelected] = useState(false);

  const passengerIcon = (paxName) => {
    const name = paxName?.split(' ');
    return `${name?.[0]?.[0] ? name?.[0]?.[0] : ''}${name?.[2]?.[0] ? name?.[2]?.[0] : ''}`;
  };

  const getPassengerSubtitle = () => {
    const paxCardDetails = [paxData?.paxTypeName, paxData?.gender];
    return paxCardDetails.filter((el) => el).join(' | ');
  };

  const getPassengerName = (passenger) => {
    const {
      first = '',
      middle = '',
      last = '',
    } = passenger;
    return [first, middle, last].filter(Boolean).join(' ');
  };

  const onContainerChangeHandler = (isChecked) => {
    setMainCardSelected(isChecked);
    onConsentChnage(paxData, isChecked, isChecked);
  };
  let isFirstAdultOrSeniorPassenger = false;
  const { paxTypeCode, discountCode } = paxData;
  if (!isFirstAdultOrSeniorPassenger && ![PASSENGER_TYPE.CHILD, PASSENGER_TYPE.INFANT].includes(paxTypeCode)) {
    isFirstAdultOrSeniorPassenger = true;
  }

  const isSRCT = discountCode === SRCT_ID;
  const isChild = (paxTypeCode === PASSENGER_TYPE.CHILD || paxTypeCode === PASSENGER_TYPE.INFANT)
    && specialFareCode !== UMNR_ID_CODE;

  useEffect(() => {
    if (checkIfMinorIsSelected(minorConsentCheckboxData, paxData?.passengerKey)) {
      setMainCardSelected(true);
    }
  }, []);
  return (
    (!isSRCT && !isChild)
    && (
      <div className="mc-passenger-selection">
        <div className={`mc-passenger-selection__item ${isMainCardSelected ? 'checked' : ''}`}>
          <div className="mc-passenger-selection__item__profile">
            <div className="d-flex mc-passenger-selection__passenge-container">
              <div className="mc-passenger-selection__item__profile__icon">
                {passengerIcon(paxData?.paxName)}
              </div>
              <div className="mc-passenger-selection__item__profile__details
                        d-flex flex-column justify-content-center"
              >
                <h5>{getPassengerName(paxData?.name)}</h5>
                <div>{getPassengerSubtitle()}</div>
              </div>
            </div>

            <CheckBoxV2
              id="minor-checkbox"
              name="passenger-minor-checkbox"
              checked={isMainCardSelected}
              onChangeHandler={onContainerChangeHandler}
            />
          </div>
        </div>
      </div>

    )
  );
};

MinorConsentForm.propTypes = {
  paxData: PropTypes.any,
  onConsentChnage: PropTypes.any,
  minorConsentCheckboxData: PropTypes.any,
};

export default MinorConsentForm;
