/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import './SpecialAssistance.scss';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { AppContext } from '../../../../../context/appContext';
import SpecialAssistanceOptions from './SpecialAssistanceOptions';
import Journey from './Journey';
import Wheelchair from './Wheelchair';
import Label from './Label';
import Info from './Info';
import SideBarHeader from './SideBarHeader';
import {
  ELECTRONIC_WHEELCHAIR,
  MEDICAL_REASONS,
  OTHERS,
  SENIOR_CITIZEN,
  WHEELCHAIR,
  WHEELCHAIR_USER,
} from '../../../../../constants/constants';
import regexConstant from '../../../../../constants/regex';
import AssistanceLevel from './AssistanceLevel';

const SpecialAssistance = ({
  optionsName,
  journeyName,
  wheelchairReasonName,
  wheelChairAssistanceLevel,
  wheelchairCategoryName,
  wheelchairSubCategoryName,
  assistanceRequiredName,
  consentName,
  contactNumberName,
  disableWheelChair,
}) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [formOptions, setFormOptions] = useState({});
  const [validatePhone, setValidatePhone] = useState('');
  const [isInternational, setIsInternational] = useState(false);
  const [doneState, setDoneState] = useState(false);
  const {
    state: {
      aemMainData: {
        doneLabel,
        specialAssistanceDetails,
        mandatoryFieldLabel,
        invalidPhoneMsg,
      },
    },
  } = useContext(AppContext);

  const specialAssistanceOptions = specialAssistanceDetails?.specialAssistanceOptions;

  const specialAssistanceLabel = specialAssistanceDetails?.label;

  const { watch, getValues, setValue } = useFormContext();

  const wheelchairReasons = watch(wheelchairReasonName);
  const consent = watch(consentName);
  // const option = watch(`${optionsName}`);
  const speechImpaired = watch(`${optionsName}.speechImpaired`);
  const hearingImpaired = watch(`${optionsName}.hearingImpaired`);
  const visuallyImpaired = watch(`${optionsName}.visuallyImpaired`);
  const personWithIntellectual = watch(`${optionsName}.personWithIntellectual`);
  const electronicWheelchair = watch(`${optionsName}.electronicWheelchair`);
  const wheelchair = watch(`${optionsName}.wheelchair`);
  const journey = watch(journeyName);
  const category = watch(wheelchairCategoryName);
  const subCategory = watch(wheelchairSubCategoryName);
  const electronicWheelchairPersonalWheelchairUser = watch(
    `${optionsName}.electronicWheelchairPersonalWheelchairUser`,
  );
  const isWheelchairUser = wheelchair || electronicWheelchairPersonalWheelchairUser;
  const wheelchairAlreadyOpt = watch(`${optionsName}.wheelchairAlreadyOpt`);
  const assistanceLevel = watch(wheelChairAssistanceLevel);

  const validateForm = (phoneNumber) => {
    const errorObj = {};
    const mobileNumber = phoneNumber;
    if (!consent) {
      errorObj.consent = mandatoryFieldLabel;
    } else if (wheelchair) {
      if (!journey || !journey.length) {
        errorObj.journey = mandatoryFieldLabel;
      } else if (!wheelchairReasons) {
        errorObj.wheelchairReasons = mandatoryFieldLabel;
      } else if (!assistanceLevel) {
        errorObj.assistanceLevel = mandatoryFieldLabel;
      } else if (wheelchairReasons === MEDICAL_REASONS) {
        if (!category) {
          errorObj.category = mandatoryFieldLabel;
        } else if (!subCategory) {
          errorObj.subCategory = mandatoryFieldLabel;
        }
      } else if (wheelchairReasons === WHEELCHAIR_USER && !category) {
        errorObj.category = mandatoryFieldLabel;
      } else if (wheelchairReasons === OTHERS) {
        if (!mobileNumber) errorObj.mobileNumber = mandatoryFieldLabel;
        else if (
          !isInternational
          && !mobileNumber?.match(regexConstant.PHONE)
        ) {
          errorObj.mobileNumber = invalidPhoneMsg;
        } else if (
          isInternational
          && !mobileNumber?.match(regexConstant.PHONE_INTERNATIONAL)
        ) {
          errorObj.mobileNumber = invalidPhoneMsg;
        }
      }
    }
    return errorObj;
  };

  useEffect(() => {
    if (wheelchair && !wheelchairAlreadyOpt) {
      if (wheelchairReasons !== OTHERS) {
        setValidatePhone('');
        setValue(assistanceRequiredName, '');
      }
      const errorObj = validateForm(validatePhone);
      const isValid = Object.keys(errorObj).length < 1;
      setDoneState(isValid);
    } else if (
      electronicWheelchairPersonalWheelchairUser
      || speechImpaired
      || hearingImpaired
      || visuallyImpaired
      || personWithIntellectual
      || electronicWheelchair
    ) {
      setDoneState(true);
    } else {
      setDoneState(false);
    }
  }, [
    consent,
    wheelchair,
    journey,
    wheelchairReasons,
    category,
    subCategory,
    validatePhone,
    electronicWheelchairPersonalWheelchairUser,
    speechImpaired,
    hearingImpaired,
    visuallyImpaired,
    personWithIntellectual,
    electronicWheelchair,
    assistanceLevel,
  ]);

  const onPhoneChangeHandler = (input, flag) => {
    setValidatePhone(input);
    setIsInternational(flag);
  };

  const setSpecialAssistanceOption = () => {
    setFormOptions((options) => {
      return { ...options, ...getValues(`${optionsName}`) };
    });
  };

  const specialAssistOptions = specialAssistanceDetails?.specialAssistanceOptions;
  const wheelChairAssistanceLevelOptions = specialAssistanceDetails?.wheelChairAssistanceLevelOptions;
  const wheelChairAssistanceLevelTitle = specialAssistanceDetails?.wheelChairAssistanceLevelTitle;
  const guidelinesTextDescription = specialAssistanceDetails?.guidelinesTextDescription;

  const hideSideBar = () => {
    if (!wheelchair) {
      setValue(wheelChairAssistanceLevel, null);
      setValue(wheelchairReasonName, null);
    }
    if (getValues(`${consentName}`)) {
      const errorObj = validateForm(validatePhone);
      if (Object.keys(errorObj).length > 0) {
        return;
      }
    }
    if (wheelchair?.reason === MEDICAL_REASONS) {
      setValue(wheelchairSubCategoryName, '');
    }
    if (wheelchair?.reason === SENIOR_CITIZEN || wheelchair?.reason === OTHERS) {
      setValue(wheelchairCategoryName, '');
      setValue(wheelchairSubCategoryName, '');
    }
    setSpecialAssistanceOption();
    setDoneState(false);
    setIsSideBarOpen(false);
  };

  useEffect(() => {
    setValue(wheelchairSubCategoryName, '');
  }, [category]);

  useEffect(() => {
    setSpecialAssistanceOption();
  }, []);

  const generateInfoMarkup = () => {
    let targetEl;
    if (electronicWheelchairPersonalWheelchairUser) {
      targetEl = specialAssistanceOptions.find(
        (el) => camelCase(el.title) === ELECTRONIC_WHEELCHAIR,
      );
    }

    if (wheelchair) {
      targetEl = specialAssistanceOptions.find(
        (el) => camelCase(el.title) === WHEELCHAIR,
      );
    }

    return {
      descriptionHTML: targetEl?.description,
      note: targetEl?.note,
    };
  };

  const { descriptionHTML, note } = generateInfoMarkup();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.target.click();
    }
  };

  useEffect(() => {
    if (isSideBarOpen) {
      const closeButton = document?.querySelector(
        '.special-assistance__close-icon.icon-close-simple',
      );
      closeButton?.focus();
      if (closeButton) {
        closeButton?.setAttribute('tabindex', '0');
        closeButton?.addEventListener('keydown', handleKeyDown);
        closeButton?.setAttribute('aria-label', 'Close Slider');
      }
    }
  }, [isSideBarOpen]);

  return (
    <>
      <button
        type="button"
        className="bg-transparent special-assistance border-0 w-100 mb-6"
        aria-label={specialAssistanceLabel}
      >
        <Label
          wheelchairReasonName={wheelchairReasonName}
          wheelChairAssistanceLevel={wheelChairAssistanceLevel}
          disableWheelChair={disableWheelChair}
          formOptions={formOptions}
          optionsName={optionsName}
          onCloseLabel={(val) => setFormOptions((options) => {
            return { ...options, ...val };
          })}
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        />
      </button>

      {isSideBarOpen && (
        <OffCanvas
          containerClassName="is-hidden"
          onClose={() => setIsSideBarOpen(!isSideBarOpen)}
          renderHeader={() => (
            <SideBarHeader
              onClose={() => {
                setValue(optionsName, formOptions || {});
                setIsSideBarOpen(!isSideBarOpen);
                if (!wheelchair) {
                  setValue(wheelChairAssistanceLevel, null);
                  setValue(wheelchairReasonName, null);
                }
              }}
            />
          )}
          renderFooter={() => (
            <div className="py-8 px-4 w-100">
              <Button
                containerClass="w-100"
                onClick={doneState && hideSideBar}
                {...{ block: true }}
                disabled={!doneState}
              >
                {doneLabel}
              </Button>
            </div>
          )}
        >
          <form className="mt-8 d-flex flex-column gap-8">
            <SpecialAssistanceOptions
              optionsName={optionsName}
              formOptions={formOptions}
              options={specialAssistOptions}
              guidelinesTextDescription={guidelinesTextDescription}
            />
            {isWheelchairUser && !wheelchairAlreadyOpt && (
              <>
                <Journey journeyName={journeyName} journey={journey} />
                <AssistanceLevel
                  options={wheelChairAssistanceLevelOptions}
                  title={wheelChairAssistanceLevelTitle}
                  wheelChairAssistanceLevel={wheelChairAssistanceLevel}
                />
                <Wheelchair
                  wheelchairReasonName={wheelchairReasonName}
                  wheelchairCategoryName={wheelchairCategoryName}
                  wheelchairSubCategoryName={wheelchairSubCategoryName}
                  assistanceRequiredName={assistanceRequiredName}
                  contactNumberName={contactNumberName}
                  onChangePhoneNumber={onPhoneChangeHandler}
                  validatePhone={validatePhone}
                  category={category}
                  subCategory={subCategory}
                />
                <Info
                  consentName={consentName}
                  descriptionHTML={descriptionHTML}
                  note={note}
                />
              </>
            )}
          </form>
        </OffCanvas>
      )}
    </>
  );
};

SpecialAssistance.propTypes = {
  optionsName: PropTypes.string,
  journeyName: PropTypes.string,
  wheelchairReasonName: PropTypes.string,
  wheelchairCategoryName: PropTypes.string,
  wheelChairAssistanceLevel: PropTypes.string,
  wheelchairSubCategoryName: PropTypes.string,
  assistanceRequiredName: PropTypes.string,
  consentName: PropTypes.string,
  contactNumberName: PropTypes.string,
  disableWheelChair: PropTypes.bool,
};

export default SpecialAssistance;
