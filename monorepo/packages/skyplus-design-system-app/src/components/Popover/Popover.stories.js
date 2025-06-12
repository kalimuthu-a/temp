/* eslint-disable no-alert */
import React from 'react';
import Popover from './Popover';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/Popover',
  component: Popover,
};

// eslint-disable-next-line arrow-body-style
export const PopoverElement = () => {
  return (
    <Popover
      renderElement={() => <button type="button">Click to Reveal</button>}
      renderPopover={() => <div>hello</div>}
    />
  );
};
