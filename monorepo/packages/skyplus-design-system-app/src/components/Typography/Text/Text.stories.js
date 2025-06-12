import React from 'react';
import Text from './Text';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/Text',
  component: Text,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    variant: 'filled',
  },
  args: {
    variant: 'filled',
  },
};

export const TextWithVariations = () => {
  return (
    <div>
      <Text variation="sh1" mobileVariation="price-reg-stroked">
        sh1
      </Text>
      <Text variation="sh2">sh2</Text>
      <Text variation="sh3">sh3</Text>
      <Text variation="sh4">sh4</Text>
      <Text variation="sh3">sh3</Text>
      <Text variation="sh4">sh4</Text>
      <Text variation="sh5">sh5</Text>
      <Text variation="sh6">sh6</Text>
      <Text variation="sh7">sh7</Text>
      <Text variation="sh-8">sub-heading-8</Text>
      <Text variation="btn">button-web</Text>
      <Text variation="link" mobileVariation="price-reg-stroked">
        link-web
      </Text>
      <Text variation="link-sm">link-small-web</Text>
      <Text variation="link-small-mobile">link-small-mobile</Text>
      <Text variation="body-l-md">body-large-medium</Text>
      <Text variation="body-1-reg">body-large-regular</Text>
      <Text variation="body-l-lt">body-large-light</Text>
      <Text variation="body-md-md">body-medium-medium</Text>
      <Text variation="body-md-reg">body-medium-regular</Text>
      <Text variation="body-md-lt">body-medium-light</Text>
      <Text variation="placeholder-labels">placeholder-label</Text>
      <Text variation="body-sm-md">body-small-medium</Text>
      <Text variation="body-sm-reg">body-small-regular</Text>
      <Text variation="body-sm-lt">body-small-light</Text>
      <Text variation="body-xs-reg">body-extra-small-regular</Text>
      <Text variation="tag-sm">tag-small</Text>
      <Text variation="tag-md">tag-medium</Text>
      <Text variation="price-reg-stroked">price-regular-stroked</Text>
      <Text variation="price-reg-stroked">price-medium-stroked</Text>
    </div>
  );
};
