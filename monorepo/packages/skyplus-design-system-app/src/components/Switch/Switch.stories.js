import React, { useState } from 'react';
import Switch from './Switch';

export default {
  title: 'Skyplus/Switch',
  component: Switch,
};

export const SwitchElem = () => {
  const [checked, setChecked] = useState(false);

  const onChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div>
      <Switch checked={checked} onChange={onChange} />
      <br />
      <br />
      <Switch checked={!checked} onChange={onChange} />
    </div>
  );
};
