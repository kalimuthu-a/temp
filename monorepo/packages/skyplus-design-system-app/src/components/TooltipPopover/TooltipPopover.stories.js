import React from 'react';
import TooltipPopover from './TooltipPopover';

export default {
  title: 'Skyplus/TooltipPopover',
  component: TooltipPopover,
};
export const Default = () => {
  const props = {
    description: 'You will miss out on your complimentary meal combo if you proceed',
    infoIconClass: 'icon-info',
  };
  return (
    <div>
      <TooltipPopover {...props} />
    </div>
  );
};
