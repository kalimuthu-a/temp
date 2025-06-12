import React from 'react';
import CountryDropDown from './CountryDropDown';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/CountryDropDown',
  component: CountryDropDown,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export const Primary = (args) => {
  const props = { ...args, color: 'primary' };
  return (
    <div>
      <CountryDropDown {...props}>Primary</CountryDropDown>
    </div>
  );
};
