import React from 'react';
import Heading from './Heading';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/Heading',
  component: Heading,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    variant: 'filled',
  },
  args: {
    variant: 'filled',
  },
};

export const Primary = () => {
  return (
    <div>
      <Heading>Heading 1</Heading>
      <Heading heading="h1" mobileHeading="h6">
        Heading 1
      </Heading>
      <Heading heading="h2">Heading 2</Heading>
      <Heading heading="h2" mobileHeading="h1">
        Select your departure flight from <span>Delhi</span> to{' '}
        <span>Bangalore</span>
      </Heading>
      <Heading heading="h3">Heading 3</Heading>
      <Heading heading="h4">Heading 4</Heading>
      <Heading heading="h5">Heading 5</Heading>
      <Heading heading="h6">Heading 6</Heading>
      <Heading heading="h7">Heading 7</Heading>
      <Heading heading="h0">Heading 0</Heading>
    </div>
  );
};

export const Info = (args) => {
  const props = { ...args, color: 'info', variant: 'no-fill' };
  return <Heading {...props}>Info</Heading>;
};
