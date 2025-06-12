import React from 'react';
import FreeMealButton from './FreeMealButton';

export default {
  title: 'Skyplus/FreeMealButton',
  component: FreeMealButton,
};
export const Default = () => {
  const props = {
    btnText: 'Enjoy complimentary gourmet meals on your journey with XL seats.',
    infoIconClass: 'sky-icons icon-arrow-top-right sm',
    onSelect: () => {

    },
  };
  return (
    <div>
      <FreeMealButton {...props} />
    </div>
  );
};
