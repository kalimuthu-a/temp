import React, { useMemo } from 'react';
import groupBy from 'lodash/groupBy';
import DropDown from './DropDown';

import './TravellingReason.scss';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/DropDown',
  component: DropDown,
};

// eslint-disable-next-line arrow-body-style
export const DropDownElement = () => {
  const travellingForOptions = useMemo(() => {
    return groupBy(
      [
        { id: 'lesiure', label: 'Lesiure1', value: 'Lesiure', group: 'A' },
        { id: 'lesiure', label: 'Lesiure2', value: 'Lesiure', group: 'A' },
        { id: 'work', label: 'Work', value: 'Work', group: 'A' },
        { id: 'medical', label: 'Medical', value: 'Medical', group: 'B' },
      ],
      'group',
    );
  }, []);

  const payWithOptions = useMemo(() => {
    return groupBy(
      [
        { id: 'cash', label: 'Cash', value: 'Cash', group: 'A' },
        { id: 'points', label: 'Points', value: 'Points', group: 'A' },
      ],
      'group',
    );
  }, []);

  return (
    <>
      <DropDown
        renderElement={() => <input />}
        containerClass="travelling-reason-dropdown"
        items={travellingForOptions}
        renderItem={({ id, label }) => (
          <div className="travelling-reason-dropdown__item" key={id}>
            {label}
          </div>
        )}
      />
      <DropDown
        renderElement={() => <input />}
        containerClass="pay-mode-dropdown"
        items={payWithOptions}
        renderItem={({ id, label }) => (
          <div className="paywith-mode-dropdown__item" key={id}>
            {label}
          </div>
        )}
      />
    </>
  );
};
