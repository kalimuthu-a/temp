/* eslint-disable no-alert */
import React from 'react';
import Icon from './Icon';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/Icon',
  component: Icon,
};

// eslint-disable-next-line arrow-body-style
export const BasicIcon = () => {
  return (
    <div>
      <Icon onClick={() => alert('click')} className="icon-seat" size="lg" />
      <br />
      <br />
      <Icon
        onClick={() => alert('click')}
        className="icon-terminal-information"
        size="lg"
      />
      <br />
      <br />
      <Icon onClick={() => alert('click')} className="closeicon" />
    </div>
  );
};
