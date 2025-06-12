/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useContext, useEffect } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { AppContext } from '../../../../../context/appContext';
import './MinorConsent.scss';
import MinorConsentForm from './MinorConsentForm';
import passengerEditActions from '../../../../../context/actions';

const MinorConsent = ({ paxDetails, onMinorFormSubmitHandler, checkboxData }) => {
  const {
    state: {
      aemMainData: {
        minorConsentDescription,
        minorConsentLabel,
        confirmButtonLabel,
      },
      getPrivacyPolicyData,
    },
    dispatch,
  } = useContext(AppContext);
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true);
  const [minorConsetData, setMinorConsentData] = useState([]);
  // const [isMinorModify, setIsMinorModify] = useState([]);

  const onConsentChnage = (paxData, isSelected, isCardSelected) => {
    const minorConsentCheckboxData = [...minorConsetData];
    const index = minorConsentCheckboxData?.findIndex((el) => el?.passengerKey === paxData?.passengerKey);
    if (index < 0) {
      minorConsentCheckboxData.push({
        passengerKey: paxData?.passengerKey,
        isSelected,
        isCardSelected,
      });
    } else {
      minorConsentCheckboxData[index].isSelected = isSelected;
      minorConsentCheckboxData[index].isCardSelected = isCardSelected;
    }
    setMinorConsentData(minorConsentCheckboxData);
    const isConsentChecked = minorConsentCheckboxData?.some((el) => el?.isSelected === true);
    setIsSubmitBtnDisabled(!isConsentChecked);
  };

  const onConfirmclick = () => {
    dispatch({
      type: passengerEditActions.SET_ADULT_CONSENT_DATA,
      payload: minorConsetData,
    });
    onMinorFormSubmitHandler();
  };

  useEffect(() => {
    const isConsentChecked = checkboxData?.some((el) => el?.isSelected === true);
    setIsSubmitBtnDisabled(!isConsentChecked);
    setMinorConsentData(checkboxData);
  }, []);

  return (
    <div className="minor-container">

      <div>
        <div className="minor-container__heading">
          {minorConsentLabel}
        </div>
        <div className="minor-container__subHeading">
          {parse(minorConsentDescription?.html ? minorConsentDescription?.html : '')}
        </div>
        {paxDetails?.map((paxData) => (
          <MinorConsentForm
            paxData={paxData}
            onConsentChnage={onConsentChnage}
            minorConsentCheckboxData={checkboxData}
            setIsSubmitBtnDisabled={setIsSubmitBtnDisabled}
            getPrivacyPolicyData={getPrivacyPolicyData}
          />
        ))}
      </div>

      <Button
        containerClass="w-100"
        disabled={isSubmitBtnDisabled}
        onClick={onConfirmclick}
      >
        {confirmButtonLabel}
      </Button>
    </div>
  );
};

MinorConsent.propTypes = {
  paxDetails: PropTypes.any,
  onMinorFormSubmitHandler: PropTypes.any,
  checkboxData: PropTypes.any,
};

export default MinorConsent;
