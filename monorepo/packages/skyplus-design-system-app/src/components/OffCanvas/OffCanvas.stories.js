import React, { useState } from 'react';
import OffCanvas from './OffCanvas';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/OffCanvas',
  component: OffCanvas,
};

export const ControlledOffCanvas = (args) => {
  const [show, setShow] = useState(false);

  const props = {
    ...args,
    onClose: () => {
      setShow(false);
    },
  };

  return (
    <div>
      <button
        onClick={() => {
          setShow(true);
        }}
        type="button"
      >
        Show Offcanvas
      </button>
      {show && (
        <OffCanvas {...props}>
          <button type="button">Close It</button>
        </OffCanvas>
      )}
    </div>
  );
};

export const OffMobileWithVariation = (args) => {
  const [show, setShow] = useState(false);

  const props = {
    ...args,
    onClose: () => {
      setShow(false);
    },
  };

  return (
    <div>
      <button
        onClick={() => {
          setShow(true);
        }}
        type="button"
      >
        Show Offcanvas
      </button>
      {show && (
        <OffCanvas {...props} containerClassName="mobile-variation1">
          Primary Primary Primary Primary Primary
          <br />
          Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br /> Primary Primary Primary Primary Primary
          <br />
        </OffCanvas>
      )}
    </div>
  );
};
