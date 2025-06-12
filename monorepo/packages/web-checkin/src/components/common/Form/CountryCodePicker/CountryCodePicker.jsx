import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import DropDown from '../DropDown/DropDown';
import CountryCodeItem from './CountryCodeItem';

import '../CountryPicker/index.css';

import codes from './codes';

const CountryCodePicker = ({ name, onChange, value, disabled }) => {
  const [defaultValue, setDefaultValue] = useState({
    phoneCode: 91,
    countryCode: 'IN',
  });
  useEffect(() => {
    const item = codes.find((r) => r.phoneCode === value);

    if (item) {
      setDefaultValue(item);
    }
  }, [value]);

  const onSelectItem = (e) => {
    onChange({ target: { name, value: e.phoneCode } });
  };

  return (
    <DropDown
      renderElement={() => (
        <div className={`country-codes-picker ${disabled && 'disabled'}`}>
          <span
            className={`fflag fflag-${defaultValue.countryCode} ff-md ff-wave`}
          />
          +{defaultValue.phoneCode}
        </div>
      )}
      renderItem={(item) => (
        !disabled ? <CountryCodeItem {...item} onSelect={() => {}} key={item.countryCode} /> : ''
      )}
      renderPopover={() => {
        return <div />;
      }}
      withSearch={false}
      containerClass="country-picker-field"
      items={codes}
      onSelectItem={onSelectItem}
    />
  );
};

CountryCodePicker.propTypes = {
  customErrorMsg: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default CountryCodePicker;
