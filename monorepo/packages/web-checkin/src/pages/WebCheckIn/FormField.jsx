import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import Input from '../../components/common/Form/Input';
import DateSelector from '../../components/common/Form/DateSelector/DateSelector';
import GenderInput from '../../components/common/Form/GenderInput/GenderInput';
import CountryPicker from '../../components/common/Form/CountryPicker/CountryPicker';
import CountryCodePicker from '../../components/common/Form/CountryCodePicker/CountryCodePicker';

const FormField = ({ fieldConfig = {}, fieldName, data, errors, onChange }) => {
  const { fieldType, regex, conditions, ...inputProps } = fieldConfig;

  switch (fieldType) {
    case 'text':
      return (
        <Input
          placeholder={fieldConfig.placeholder}
          name={fieldName}
          value={data[fieldName]}
          onChange={onChange}
          customErrorMsg={errors[fieldName]}
          {...inputProps}
        />
      );
    case 'gender':
      return (
        <GenderInput
          placeholder={fieldConfig.placeholder}
          name={fieldName}
          value={data[fieldName]}
          onChange={onChange}
          customErrorMsg={errors[fieldName]}
        />
      );
    case 'date':
      return (
        <DateSelector
          placeholder={fieldConfig.placeholder}
          name={fieldName}
          value={data[fieldName]}
          onChange={(value) => {
            onChange({ target: { name: fieldName, value } });
          }}
          customErrorMsg={errors[fieldName]}
        />
      );
    case 'country':
      return (
        <CountryPicker
          placeholder={fieldConfig.placeholder}
          name={fieldName}
          value={data[fieldName]}
          onChange={onChange}
          customErrorMsg={errors[fieldName]}
        />
      );

    case 'countrycode':
      return (
        <CountryCodePicker
          placeholder={fieldConfig.placeholder}
          name={fieldName}
          value={data[fieldName]}
          onChange={onChange}
          customErrorMsg={errors[fieldName]}
          disabled={fieldConfig.disabled}
        />
      );
    case 'checkbox':
      return <CheckBox>{fieldConfig.label}</CheckBox>;
    case 'radiobox':
      return (
        <RadioBoxGroup
          items={fieldConfig.items}
          onChange={(value) => onChange(fieldName, value)}
          selectedValue={data[fieldName]}
          containerClassName="d-flex flex-column"
        />
      );
    default:
      return null;
  }
};

FormField.propTypes = {
  fieldConfig: PropTypes.any,
  fieldName: PropTypes.any,
  data: PropTypes.any,
  errors: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default FormField;
