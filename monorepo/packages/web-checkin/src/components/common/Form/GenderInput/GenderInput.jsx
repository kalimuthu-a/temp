import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import DropDown from '../DropDown/DropDown';
import GenderItem from './GenderItem';
import Input from '../Input';

const items = [
  { label: 'Male', value: '1' },
  { label: 'Female', value: '2' },
];

const GenderInput = ({
  placeholder,
  name,
  customErrorMsg,
  onChange,
  value,
}) => {
  const [defaultValue, setDefaultValue] = useState('');

  useEffect(() => {
    const item = items.find((r) => r.value === value);

    if (item) {
      setDefaultValue(item.label);
    }
  }, [value]);

  const onSelectItem = (e) => {
    onChange({ target: { name, value: e.value } });
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
      renderItem={(item) => <GenderItem {...item} key={item.value} />}
      renderPopover={() => {
        return <div />;
      }}
      containerClass="gender-picker-field"
      items={items}
      onSelectItem={onSelectItem}
    />
  );
};

GenderInput.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  customErrorMsg: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default GenderInput;
