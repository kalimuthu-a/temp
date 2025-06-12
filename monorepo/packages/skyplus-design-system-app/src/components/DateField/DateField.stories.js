import React from 'react';
import DateField, { SUCCESS } from './DateField';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/DateField',
  component: DateField,
  parameters: {
    layout: 'centered',
  },
};

export const Primary = (args) => {
  const props = { required: false, customError: '', onChangeHandler: (e) => { console.log(e); } };
  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <DateField {...props}>Primary</DateField>
      </div>
    </div>
  );
};
