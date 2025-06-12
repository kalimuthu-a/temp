import React, { useState } from 'react';

import Text from '../Typography/Text/Text';
import RadioBox from './RadioBox';

export default {
  title: 'Skyplus/RadioBox',
  component: RadioBox,
};

export const Default = () => {
  const [value, setValue] = useState('');

  return (
    <RadioBox
      onChange={(val) => {
        setValue(val);
      }}
      value="hello"
      id="reason-1"
      checked={value === 'hello'}
    >
      <Text variation="body-md-reg" mobileVariation="price-reg-stroked">
        Click Me
      </Text>
    </RadioBox>
  );
};
