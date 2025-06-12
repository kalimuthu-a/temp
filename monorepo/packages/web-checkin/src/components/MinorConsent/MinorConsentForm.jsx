import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';

import { AppContext } from '../../context/AppContext';

const MinorConsentForm = ({ paxData, onConsentChnage, setTempSelection }) => {
  const {
    state: { minorConsentSelection },
  } = useContext(AppContext);

  const { passengerKey } = paxData;

  const [isMainCardSelected, setMainCardSelected] = useState(
    minorConsentSelection.has(passengerKey),
  );

  const passengerIcon = (paxName) => {
    const name = paxName?.split(' ');
    return `${name?.[0]?.[0] ? name?.[0]?.[0] : ''}${
      name?.[1]?.[0] ? name?.[1]?.[0] : ''
    }`;
  };

  const getPassengerSubtitle = () => {
    return paxData?.subTitle?.split(' | ')?.reverse()?.join(' | ');
  };

  const getPassengerName = (passenger) => {
    const { first = '', middle = '', last = '' } = passenger || {};
    return [first, middle, last].filter(Boolean).join(' ');
  };

  const onContainerChangeHandler = (isChecked) => {
    setMainCardSelected(isChecked);
    if (!isChecked) {
      onConsentChnage(paxData.passengerKey, isChecked);
      setTempSelection((prev) => {
        return new Set([...prev].filter((el) => el !== paxData.passengerKey));
      });
    } else {
      setTempSelection((prev) => {
        return new Set([...prev, paxData.passengerKey]);
      });
    }
    onConsentChnage(paxData.passengerKey, isChecked);
  };
  let isFirstAdultOrSeniorPassenger = false;
  const { paxTypeCode } = paxData;
  if (
    !isFirstAdultOrSeniorPassenger &&
    ![paxCodes.children.code, paxCodes.infant.code].includes(paxTypeCode)
  ) {
    isFirstAdultOrSeniorPassenger = true;
  }

  const paxName = getPassengerName(paxData?.name);

  return (
    <div className="mc-passenger-selection">
      <div
        className={`mc-passenger-selection__item ${
          isMainCardSelected ? 'checked' : ''
        }`}
      >
        <div className="mc-passenger-selection__item__profile">
          <div className="d-flex mc-passenger-selection__passenge-container">
            <div className="mc-passenger-selection__item__profile__icon">
              {passengerIcon(paxName)}
            </div>
            <div className="mc-passenger-selection__item__profile__details d-flex flex-column justify-content-center">
              <h5>{paxName}</h5>
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
  );
};

MinorConsentForm.propTypes = {
  paxData: PropTypes.any,
  onConsentChnage: PropTypes.any,
  setTempSelection: PropTypes.func,
};

export default MinorConsentForm;
