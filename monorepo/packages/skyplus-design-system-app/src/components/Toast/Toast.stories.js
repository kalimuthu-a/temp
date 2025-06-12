import React, { useState } from 'react';
import Toast from './Toast';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
};

export const Primary = () => {
  const [show, setShow] = useState(true);
  const props = {
    onClose: (e) => {
      setShow(false);
    },
    // renderToastContent: () => <ToastExampleComp />,
    containerClass: 'toast-example',
    variation: 'notifi-variation--Success',
    autoDismissTimeer: 100000,
    description:
      'Password reset was successful.... Password reset was successful.. Password reset was successful.',
  };
  return (
    <div>
      {show && <Toast {...props} variation="notifi-variation--Success" />}
    </div>
  );
};

export const Warning = (args) => {
  const props = {
    onClose: (e) => {
      alert('Handle on close');
    },
    // renderToastContent: () => <ToastExampleComp />,
    containerClass: 'toast-example',
    variation: 'notifi-variation--Success',
    description: 'Enter Message here',
  };
  return (
    <div>
      <Toast {...props} variation="notifi-variation--Warning" />
    </div>
  );
};

export const Information = (args) => {
  const props = {
    onClose: (e) => {
      alert('Handle on close');
    },
    // renderToastContent: () => <ToastExampleComp />,
    containerClass: 'toast-example',
    variation: 'notifi-variation--Success',
    description: 'Enter Message here',
  };
  return (
    <div>
      <Toast {...props} variation="notifi-variation--Information" />
    </div>
  );
};

export const Error = (args) => {
  const props = {
    onClose: (e) => {
      alert('Handle on close');
    },
    // renderToastContent: () => <ToastExampleComp />,
    containerClass: 'toast-example',
    variation: 'notifi-variation--Error',
    description: 'Enter Message here',
  };
  return (
    <div>
      <Toast {...props} variation="notifi-variation--Error" />
    </div>
  );
};
