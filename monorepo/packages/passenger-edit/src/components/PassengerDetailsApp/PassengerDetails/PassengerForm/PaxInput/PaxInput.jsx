import React, { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
// import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/src/components/InputField/InputField';
import regexConstant from '../../../../../constants/regex';
import {
  FIRST_AND_MIDDLE_FIELD_NAME,
  LAST_FIELD_NAME,
  PAX_NAME_CHAR_LIMIT,
  SRCT_ID_FIELD_NAME,
  ARMED_FORCE_ID_FIELD_NAME,
  STUDENT_ID_FIELD_NAME,
  DUPLICATE_SRCTID_ERROR_MSG,
} from '../../../../../constants/constants';
import LocalStorage from '../../../../../utils/LocalStorage';
import { localStorageKeys } from '../../../../../constants';
import { AppContext } from '../../../../../context/appContext';

const PaxInput = (props) => {
  const {
    pax,
    cardIndex,
    onEveryInputChange,
    duplicateNameValidation,
    nameGuidelineValidation,
    duplicateSrctIdErrorMsg,
  } = props;

  const {
    state: {
      paxData,
      aemMainData },
  } = useContext(AppContext);

  const { codeShare } = aemMainData;
  const codeShareDetails = codeShare?.find((obj) => paxData?.bookingDetails?.carrierCode === obj?.carrierCode);

  const { register, trigger, getValues, formState: { errors } } = useFormContext();
  // const [fieldValue, setFieldValue] = useState('');
  const [customErrorMsg, setCustomErrorMsg] = useState('');

  const fieldValueRhf = getValues(pax.name);
  const setFieldValue = (val = '') => {
    onEveryInputChange(pax.name, val);
  };

  const srctIdInputhandler = (input) => {
    const srctIds = LocalStorage.getAsJson(localStorageKeys.srct_ids);
    const isUnique = srctIds?.filter((srct) => srct?.srctid === input);
    if (isUnique && isUnique[0]) {
      if (!customErrorMsg) {
        setCustomErrorMsg(duplicateSrctIdErrorMsg || DUPLICATE_SRCTID_ERROR_MSG);
      }
    } else {
      setCustomErrorMsg('');
      const updatedSrctIds = srctIds?.filter((srct) => srct?.srctIndex !== pax?.srctIndex);
      const srctObj = {
        srctIndex: pax.srctIndex,
        srctid: input,

      };
      LocalStorage.set(localStorageKeys.srct_ids, [...updatedSrctIds, srctObj]);
    }
    setFieldValue(input);
  };

  const onChangeHandler = (name, event) => {
    let input = event.target.value;
    if (name === FIRST_AND_MIDDLE_FIELD_NAME || name === LAST_FIELD_NAME) {
      input = input?.replace(regexConstant.NAME_ONLY_ALPHABET_SPACE, '');
    }
    if (name === FIRST_AND_MIDDLE_FIELD_NAME) {
      if (!input || input.match(regexConstant.FORM_NAME_FIELD)) setFieldValue(input?.slice(0, PAX_NAME_CHAR_LIMIT));
      if (codeShareDetails && input
        && (input.length < codeShareDetails?.minCharLengthName || !input.trim())) {
        nameGuidelineValidation(input);
      }
    } else if (name === LAST_FIELD_NAME) {
      if (!input || input.match(regexConstant.FORM_NAME_FIELD)) setFieldValue(input?.slice(0, PAX_NAME_CHAR_LIMIT));
      if (codeShareDetails && input
        && (input.length < codeShareDetails?.minCharLengthName || !input.trim())) {
        nameGuidelineValidation(input);
      }
    } else if (name === SRCT_ID_FIELD_NAME) {
      if (!input || input.match(regexConstant.ALPHA_NUMERIC)) srctIdInputhandler(input);
    } else if (name === ARMED_FORCE_ID_FIELD_NAME || name === STUDENT_ID_FIELD_NAME) {
      if (!input || input.match(regexConstant.ALPHA_NUMERIC)) setFieldValue(input);
    } else {
      setFieldValue(input);
    }
  };

  useEffect(() => {
    const elemId = document.getElementById(pax.name);
    if (elemId) {
      elemId.setCustomValidity(customErrorMsg);
      elemId.value = fieldValueRhf;
    }
  }, [customErrorMsg]);

  let errorData = errors?.userFields?.[cardIndex];
  if (pax.fieldName === FIRST_AND_MIDDLE_FIELD_NAME || pax.fieldName === LAST_FIELD_NAME) {
    errorData = errors?.userFields?.[cardIndex]?.name;
  }

  // if value is present trigger the validation check
  useEffect(() => {
    if (fieldValueRhf) {
      trigger(pax?.name);
    }
  }, [fieldValueRhf]);

  const validations = duplicateNameValidation ? { duplicateNameValidation } : {};
  if (codeShareDetails) {
    validations.nameGuidelineValidation = nameGuidelineValidation;
  }

  return (
    <InputField
      type={pax.type}
      name={pax.name}
      register={register}
      fieldName={pax.fieldName}
      disabled={pax.disabled}
      value={fieldValueRhf}
      placeholder={pax.placeholder}
      customErrorMsg={customErrorMsg}
      errors={errorData}
      cardIndex={cardIndex}
      setValue={onEveryInputChange}
      infoMsg={pax.infoMsg}
      required={pax.required}
      iconType={pax.iconType}
      showCrossIcon={pax.showCrossIcon}
      inputWrapperClass={pax.inputWrapperClass}
      onInputHandler={(e) => onChangeHandler(pax.fieldName, e)}
      extraValidation={validations}
    />
  );
};

PaxInput.propTypes = {
  pax: PropTypes.shape({
    type: 'text',
    name: '',
    value: '',
    isDOB: PropTypes.bool,
    infoMsg: '',
    iconType: '',
    fieldName: '',
    placeholder: '',
    srctIndex: PropTypes.number,
    disabled: PropTypes.bool,
    isPrefilled: PropTypes.bool,
    showCrossIcon: false,
    inputWrapperClass: '',
    required: PropTypes.string,
  }),
  cardIndex: PropTypes.number,
  errors: PropTypes.shape({}),
  onEveryInputChange: PropTypes.func,
  duplicateNameValidation: PropTypes.func,
  nameGuidelineValidation: PropTypes.func,
  duplicateSrctIdErrorMsg: PropTypes.string,
};

export default PaxInput;
