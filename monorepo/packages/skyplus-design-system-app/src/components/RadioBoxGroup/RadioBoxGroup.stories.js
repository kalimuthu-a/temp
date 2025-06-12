import React, { useState } from 'react';

import RadioBoxGroup from './RadioBoxGroup';

export default {
  title: 'Skyplus/RadioBoxGroup',
  component: RadioBoxGroup,
};

export const Horizontal = () => {
  const [value, setValue] = useState('hello');

  const items = [
    {
      label: 'Item 1',
      value: 'item-1',
    },
    {
      label: 'Item 2',
      value: 'item-2',
    },
    {
      label: 'Item 3',
      value: 'item-3',
    },
  ];

  const onChangeHandler = (v) => {
    setValue(v);
  };

  return (
    <RadioBoxGroup
      items={items}
      onChange={onChangeHandler}
      selectedValue={value}
      containerClassName="d-flex gap-3"
    />
  );
};

export const Vertical = () => {
  const [value, setValue] = useState('item-3');

  const items = [
    {
      label: 'Item 3',
      value: 'item-3',
    },
    {
      label: 'Item 2',
      value: 'item-2',
    },
    {
      label: 'Item Ekstra',
      value: 'item-1',
    },
  ];

  const onChangeHandler = (v) => {
    setValue(v);
  };

  return (
    <RadioBoxGroup
      items={items}
      onChange={onChangeHandler}
      selectedValue={value}
      containerClassName="d-flex gap-3 flex-column"
    />
  );
};
