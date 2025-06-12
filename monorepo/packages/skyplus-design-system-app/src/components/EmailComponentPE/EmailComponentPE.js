import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField';
import regexConstant from '../../common/Constants/regex';
import { EMAIL_ADDRESS_ELEMENT_NAME } from '../../common/Constants/constants';

const EmailComponentPE = (props) => {
  const {
    name,
    value,
    errors,
    register,
    required,
    isDisabled,
    setContactValues,
    onEmailChange,
    className = '',
    invalidEmailMsg = '',
    emailPlaceholder = '',
  } = props;
  // const [email, setEmail] = useState('');
  const [customErrorMsg, setCustomErrorMSG] = useState('');

  const onChangeHandler = (input) => {
    if (input && !input.match(regexConstant.EMAIL)) {
      setCustomErrorMSG(invalidEmailMsg);
      if (typeof onEmailChange === 'function') onEmailChange(input, true);
    } else {
      setCustomErrorMSG('');
      if (typeof onEmailChange === 'function') onEmailChange(input, false);
    }
    setContactValues(input);
  };

  // useEffect(() => {
  //   if (value && isDisabled) {
  //     setEmail(value);
  //   }
  // }, [value]);
  return (
    <div className="design-system-phone-component w-100 ms-md-8">
      <InputField
        name={name}
        value={value}
        errors={errors}
        disabled={isDisabled}
        required={required}
        register={register}
        className={className}
        placeholder={emailPlaceholder}
        customErrorMsg={customErrorMsg}
        type={EMAIL_ADDRESS_ELEMENT_NAME}
        setValue={setContactValues}
        onInputHandler={(e) => onChangeHandler(e?.target?.value)}
      />
    </div>
  );
};

EmailComponentPE.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.any,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  emailPlaceholder: PropTypes.string,
  errors: PropTypes.shape({}),
  required: PropTypes.bool,
  value: PropTypes.string,
  onEmailChange: PropTypes.func,
  setContactValues: PropTypes.func,
  invalidEmailMsg: PropTypes.string,
};

export default EmailComponentPE;
