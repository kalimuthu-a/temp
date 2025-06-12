import React from 'react';
import CheckBoxV2 from './CheckBoxV2';

export default {
  title: 'Skyplus/Form',
  component: CheckBoxV2,
  parameters: {
    /* Optional parameter to center the component in the Canvas.
    More info: https://storybook.js.org/docs/configure/story-layout
    */
    layout: 'centered',
    variant: 'filled',
  },
  args: {
    variant: 'filled',
    name: 'checkbox',
    id: 'abc',
    value: 'abc',
    checked: true,
    onChangeHandler: () => {},
    description:
      // eslint-disable-next-line max-len
      "<p>By clicking Next you agree to the terms of IndiGo's By clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo's <a href=\"#\">Privacy Policy.</a></p>",
    descClass: 'body-small-regular',
  },
};

export const CheckBoxesV2 = (args) => {
  const props = { ...args, color: 'primary' };
  return <CheckBoxV2 {...props} />;
};

export const CheckBoxesV2Disabled = (args) => {
  const props = {
    ...args,
    id: 'dis',
    value: 'dis',
    checked: false,
    description: '',
    color: 'primary',
    disabled: true,
  };
  return <CheckBoxV2 {...props} />;
};
