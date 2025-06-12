import React from 'react';
import OtpInput from './OtpInput';

export default {
  title: 'Skyplus/OtpInput',
  component: OtpInput,
  parameters: {
    layout: 'centered',
  },
};

export const Primary = () => {
  const props = { error: 'fff', className: '', initialTimerObj: { minutes: 3, seconds: 0 } };
  return <OtpInput {...props} />;
};
