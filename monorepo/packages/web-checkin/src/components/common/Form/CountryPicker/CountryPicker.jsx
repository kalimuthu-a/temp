import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Input from '../Input';

import './index.css';

import DropDown from '../DropDown/DropDown';
import CoutryMenuItem from './CoutryMenuItem';
import useAppContext from '../../../../hooks/useAppContext';

const CountryPicker = ({
  placeholder,
  name,
  customErrorMsg,
  onChange,
  value,
}) => {
  const [defaultValue, setDefaultValue] = useState('');

  const {
    state: { countries },
  } = useAppContext();

  const [data, setData] = useState(countries);

  useEffect(() => {
    const item = countries?.find((r) => r.countryCode === value);

    if (item) {
      setDefaultValue(item?.name);
    }
  }, [value]);

  const onSelectItem = (e) => {
    onChange({ target: { name, value: e.countryCode } });
  };

  const onSearch = (v) => {
    const items = countries.filter((r) => {
      return r?.name?.toLowerCase().includes(v.toLowerCase());
    });
    setData(items);
  };

  return (
    <DropDown
      renderElement={() => (
        <Input
          placeholder={placeholder}
          name={name}
          customErrorMsg={customErrorMsg}
          icon="icon-accordion-down-simple"
          value={defaultValue}
          readOnly
        />
      )}
      renderItem={(item) => (
        <CoutryMenuItem {...item} onSelect={() => {}} key={item.countryCode} />
      )}
      renderPopover={() => {
        return <div />;
      }}
      withSearch
      containerClass="country-picker-field"
      items={data}
      onSelectItem={onSelectItem}
      onSearch={onSearch}
    />
  );
};

CountryPicker.propTypes = {
  customErrorMsg: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default CountryPicker;
