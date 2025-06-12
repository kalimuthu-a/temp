/* eslint-disable no-alert */
import React from 'react';
import StepperInput from './StepperInput';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/StepperInput',
  component: StepperInput,
  parameters: {
    variant: 'filled',
  },
};

export const Input = () => {
  return (
    <StepperInput
      minValue={0}
      maxValue={5}
      onChange={(v) => {
        alert(v);
      }}
      value={0}
    />
  );
};
