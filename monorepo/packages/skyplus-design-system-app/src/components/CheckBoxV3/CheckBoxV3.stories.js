import React, { useState } from 'react';
import CheckBoxV3 from './CheckBoxV3';

export default {
  title: 'Skyplus/Form',
  component: CheckBoxV3,
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
    checked: false,
    onChangeHandler: () => {},
    description:
      // eslint-disable-next-line max-len
      "<p>By clicking Next you agree to the terms of IndiGo's By clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo'sBy clicking Next you agree to the terms of IndiGo's <a href=\"#\">Privacy Policy.</a></p>",
    descClass: 'body-small-regular',
  },
};

export const CheckBoxesV3 = (args) => {
  const [ischecked, setIschecked] = useState(false);

  const props = { ...args, color: 'primary', checked: ischecked, onChangeHandler: () => { setIschecked((prev) => !prev); } };
  return <CheckBoxV3 {...props} />;
};
