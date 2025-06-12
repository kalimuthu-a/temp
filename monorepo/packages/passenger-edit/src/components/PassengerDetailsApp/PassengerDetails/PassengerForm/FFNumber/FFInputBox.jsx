import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import { validateMod7 } from '../../../../../functions/validateMod7';

const FFInputBox = ({ duplicateFFValidation,
  pax = {},
  errorData = '',
  placeholder,
  cardIndex,
  name,
  disabled,
  onEveryInputChange }) => {
  const {
    formState: { errors },
    setValue,
    register,
    watch,
    setError,
    getValues,
    clearErrors,
  } = useFormContext();

  const [initialValue, setInitialValue] = useState('');

  useEffect(() => {
    const userFields = getValues('userFields');
    const defaultFFN = userFields?.[cardIndex]?.program?.number || '';
    const match = defaultFFN.match(/\d+/);
    const value = match ? match[0] : '';
    setInitialValue(value);
    setValue(name, value);
  }, [cardIndex, getValues, name, setValue]);

  const watchedFFValue = watch(name, initialValue);
  const watchedSelfTravel = watch(`userFields.${cardIndex}.loyaltyInfo.selfTravel`) || null;

  const setFieldValue = (val = '') => {
    onEveryInputChange(name, val);
  };

  const onChangeHandler = (e) => {
    let input = e.target.value;
    input = input.replace(/\D/g, '').slice(0, 9);
    setFieldValue(input);
  };

  const validateFFN = () => {
    const isValid = validateMod7(watchedFFValue || '');
    if (!isValid && watchedFFValue?.length) {
      setError(`userFields.${cardIndex}.loyaltyInfo.FFN`, { message: errorData, flag: true });
    } else if (errors?.userFields?.[cardIndex]?.loyaltyInfo?.FFN) {
      clearErrors(`userFields.${cardIndex}.loyaltyInfo.FFN`);
    }

    if (isValid && duplicateFFValidation) {
      duplicateFFValidation();
    }
  };

  const handleBlur = () => {
    validateFFN();
    setFieldValue(watchedFFValue);
  };

  useEffect(() => {
    if (duplicateFFValidation) {
      duplicateFFValidation();
    }
  }, [watchedSelfTravel]);

  const fieldError = errors?.userFields?.[cardIndex]?.loyaltyInfo?.FFN?.message;
  const validations = validateMod7(watchedFFValue || '') && duplicateFFValidation ? { duplicateFFValidation } : {};
  return (
    <InputField
      type={pax.type}
      name={name}
      required={false}
      register={register}
      disabled={disabled}
      value={watchedFFValue}
      placeholder={placeholder}
      customErrorMsg={fieldError || ''}
      errors={errorData}
      cardIndex={cardIndex}
      setValue={setValue}
      inputWrapperClass={pax.inputWrapperClass || 'mt-6'}
      onInputHandler={onChangeHandler}
      onBlur={handleBlur}
      extraValidation={validations}
    />
  );
};

FFInputBox.propTypes = {
  pax: PropTypes.shape({}),
  errorData: PropTypes.string,
  duplicateFFValidation: PropTypes.func,
  placeholder: PropTypes.string,
  cardIndex: PropTypes.any,
  name: PropTypes.any,
  disabled: PropTypes.bool,
  onEveryInputChange: PropTypes.func,
};

export default FFInputBox;
