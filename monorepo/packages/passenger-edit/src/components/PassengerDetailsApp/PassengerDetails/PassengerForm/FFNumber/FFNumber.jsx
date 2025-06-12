import React, { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AppContext } from '../../../../../context/appContext';
import FFInputBox from './FFInputBox';
import './FFNumber.scss';

const FFNumber = ({ duplicateFFValidation, loyaltySignupName, cardIndex, onEveryInputChange, ffName, disabled }) => {
  const {
    state: { aemMainData },
    dispatch,
  } = useContext(AppContext);

  const {
    watch,
    register,
  } = useFormContext();

  const { frequentFlyerDetails } = aemMainData;
  const { title, placeholder, validationMessage } = frequentFlyerDetails || {};
  const [showInput, setShowInput] = useState(false);
  const optLoyaltySignup = watch(loyaltySignupName) || false;

  useEffect(() => { }, [optLoyaltySignup]);

  const ffValue = watch(ffName) || '';

  useEffect(() => {
    if (ffValue) {
      setShowInput(true);
    }
  }, [ffValue]);

  const handleInputBoxClick = (e) => {
    e.stopPropagation();
  };

  return (
    <button
      type="button"
      className="ff-number border-0 w-100 mb-6"
      aria-label={title}
      onClick={() => setShowInput(!showInput)}
    >
      <div
        className={`text-secondary border-0 w-100 gap-6 
      p-6 flex-md-row text-capitalize`}
      >
        <div className="mh-100 d-flex flex-column flex-md-row align-items-md-center w-100 justify-content-between gap-6">
          <div className="d-flex justify-content-between align-items-center w-100 gap-6">
            <div className="text-start link-small">
              {title}
            </div>
            <span
              className={`ff-number__label-btn ${showInput ? 'icon-minus' : 'icon-add-circle'}`}
              aria-hidden="true"
            />
          </div>
        </div>
        <div
          style={{ display: showInput ? 'block' : 'none' }}
          onClick={handleInputBoxClick}
        >
          <FFInputBox
            duplicateFFValidation={duplicateFFValidation}
            errorData={validationMessage}
            placeholder={placeholder}
            disabled={disabled}
            cardIndex={cardIndex}
            onEveryInputChange={onEveryInputChange}
            name={ffName}
          />
        </div>
      </div>
    </button>
  );
};

export default FFNumber;
