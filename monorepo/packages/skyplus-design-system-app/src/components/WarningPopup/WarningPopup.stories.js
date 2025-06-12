import React from 'react';
import WarningPopup from './WarningPopup';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/WarningPopup',
  component: WarningPopup,
};

export const Info = () => {
  return <WarningPopup />;
};
