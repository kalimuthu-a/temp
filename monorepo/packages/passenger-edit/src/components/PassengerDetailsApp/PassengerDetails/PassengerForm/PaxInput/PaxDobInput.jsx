import React, { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
// import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/src/components/InputField/InputField';
import regexConstant from '../../../../../constants/regex';
import { dateFormats } from '../../../../../constants/constants';
import { dobFormat, ISOtoUserFriendly } from '../../../../../helpers';
import passengersAgeUtil from '../../../../../functions/passengersAgeUtil';
import nextButtonStateUtil from '../../../../../utils/nextButtonStateUtil';
import { AppContext } from '../../../../../context/appContext';

const moment = require('moment');

const PaxDobInput = (props) => {
  const { pax, onEveryInputChange, errorMsgs, cardIndex, specialFareCode } = props;

  const {
    register,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext();

  const {
    state: { ssr, isAuthenticated, modificationFlow, savedPassengers },
  } = useContext(AppContext);

  const [formattedDate, setFormattedDate] = useState('');
  const [customErrorMsg, setCustomErrorMsg] = useState('');
  const [eventKey, seyEventKey] = useState('');

  const dob = getValues(pax.name);
  const userFriendlyDate = ISOtoUserFriendly(dob);
  const fieldValueRhf = userFriendlyDate || dob;
  const setFieldValue = (val = '') => {
    onEveryInputChange(pax.name, val);
  };

  const DOBChangeHandler = (value) => {
    let input = value.slice(0, regexConstant.DOB_LENGTH_WITH_HYPHENS);
    if (input.length === regexConstant.DOB_LENGTH_WITH_HYPHENS) {
      setFieldValue(input);
    } else {
      input = input.replaceAll('-', '');
      if (input.match(regexConstant.ONLYDIGIT)) {
        input = dobFormat(input, eventKey);
        setFieldValue(input);
      }
    }
  };

  const onChangeHandler = (event) => {
    const input = event.target.value;
    if (input.length <= regexConstant.DOB_LENGTH_WITH_HYPHENS) {
      const keyPressed = event.nativeEvent.data || regexConstant.DOB_BACKSPACE_OR_AUTOFILL;
      DOBChangeHandler(input);
      seyEventKey(keyPressed);
    }
  };

  useEffect(() => {
    // if (pax?.value) {
    const input = pax.value;
    if (input.length === regexConstant.DOB_LENGTH_WITH_HYPHENS || input.length === 0)setFieldValue(input);
    // }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !modificationFlow && savedPassengers?.length) {
      const input = pax.value;

      if (input.length === regexConstant.DOB_LENGTH_WITH_HYPHENS || input.length === 0)setFieldValue(input);
    }
  }, [pax?.value]);

  const optLoyaltySignup = watch(`userFields.${cardIndex}.loyaltyInfo.optLoyaltySignup`);

  useEffect(() => {
    if (pax?.isPrefilled) {
      trigger(pax?.name);
    }
  }, [pax?.isPrefilled]);

  // if value is present trigger the validation check
  useEffect(() => {
    if (fieldValueRhf) {
      trigger(pax?.name);
    }
  }, [fieldValueRhf]);

  useEffect(() => {
    let date = fieldValueRhf;
    const elemId = document.getElementById(pax.name);
    const getCustomErrorMsg = passengersAgeUtil.customAgeErrorMsg(
      fieldValueRhf,
      pax.paxTypeCode,
      errorMsgs,
      specialFareCode,
      ssr,
      optLoyaltySignup,
    );
    if (fieldValueRhf?.length === regexConstant.DOB_LENGTH_WITH_HYPHENS
      && fieldValueRhf.indexOf('-') === regexConstant.DOB_HYPHEN_INDEX_4) {
      date = moment(fieldValueRhf).format(dateFormats.USER_FRIENDLY_FORMAT);
    }
    if (elemId) {
      elemId.setCustomValidity(customErrorMsg);
      elemId.value = date;
    }
    seyEventKey('');
    setFormattedDate(date);
    if (fieldValueRhf?.length || optLoyaltySignup) {
      setCustomErrorMsg(getCustomErrorMsg);
    } else {
      setCustomErrorMsg('');
    }
    trigger(pax?.name);
    onEveryInputChange(pax.name, date);
  }, [eventKey, fieldValueRhf, optLoyaltySignup]);

  useEffect(() => {
    if (customErrorMsg) {
      nextButtonStateUtil(true);
    }
  }, [formattedDate]);

  const isDOBTouched = touchedFields?.userFields?.[cardIndex]?.info?.[pax?.fieldName];

  const determineCustomErrorMsg = () => {
    return ((isDOBTouched && pax.required)
    && (fieldValueRhf?.length === regexConstant.DOB_LENGTH_WITH_HYPHENS
    || optLoyaltySignup))
      ? customErrorMsg : '';
  };

  return (
    <InputField
      id={pax.name}
      type={pax.type}
      name={pax.name}
      register={register}
      fieldName={pax.fieldName}
      disabled={pax.disabled}
      value={formattedDate}
      placeholder={pax.placeholder}
      errors={isDOBTouched && errors?.userFields?.[cardIndex]?.info}
      setValue={setValue}
      infoMsg={pax.infoMsg}
      required={!!formattedDate || pax.required}
      iconType={pax.iconType}
      showCrossIcon={pax.showCrossIcon}
      inputWrapperClass={pax.inputWrapperClass}
      onInputHandler={(e) => onChangeHandler(e)}
      customErrorMsg={determineCustomErrorMsg()}
    />
  );
};

PaxDobInput.propTypes = {
  pax: PropTypes.shape({
    type: 'text',
    name: '',
    value: '',
    isDOB: PropTypes.bool,
    infoMsg: '',
    iconType: '',
    fieldName: '',
    placeholder: '',
    disabled: PropTypes.bool,
    isPrefilled: PropTypes.bool,
    showCrossIcon: false,
    inputWrapperClass: '',
    paxTypeCode: PropTypes.string,
    required: PropTypes.string,
  }),
  cardIndex: PropTypes.number,
  errors: PropTypes.shape({}),
  onEveryInputChange: PropTypes.func,
  errorMsgs: PropTypes.object,
  specialFareCode: PropTypes.string,
};

export default PaxDobInput;
