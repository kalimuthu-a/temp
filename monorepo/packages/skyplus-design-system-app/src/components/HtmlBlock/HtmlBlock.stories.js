/* eslint-disable no-alert */
import React from 'react';
import HtmlBlock from './HtmlBlock';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/HtmlBlock',
  component: HtmlBlock,
};

// eslint-disable-next-line arrow-body-style
export const HtmlBox = () => {
  return (
    <HtmlBlock
      tagName="button"
      className="class-of-container"
      html="Hi My Name is <b>Username</b>"
      onClick={() => alert('click')}
    />
  );
};

export const DivBox = () => {
  return (
    <HtmlBlock className="class-of-container" html="Hello <b>Username</b>" />
  );
};
