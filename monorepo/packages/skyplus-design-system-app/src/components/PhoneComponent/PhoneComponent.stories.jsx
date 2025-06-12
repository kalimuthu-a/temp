import React from 'react';
import PhoneComponent from './PhoneComponent';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/PhoneComponent',
  component: PhoneComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export const Primary = () => {
  const props = { placeholder: 'Primary Contact Number', className: '' };
  return <PhoneComponent {...props} />;
};
