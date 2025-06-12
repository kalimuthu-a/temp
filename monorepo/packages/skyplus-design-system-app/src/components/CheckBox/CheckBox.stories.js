import React from 'react';
import Text from '../Typography/Text/Text';

import CheckBox from './CheckBox';

export default {
  title: 'Skyplus/Form',
  component: CheckBox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    variant: 'filled',
  },
  args: {
    variant: 'filled',
  },
};

export const CheckBoxes = (args) => {
  const props = { ...args, color: 'primary' };
  return (
    <CheckBox {...props}>
      <Text variation="sub-heading-4">
        Hello <span>User</span>
      </Text>
    </CheckBox>
  );
};
