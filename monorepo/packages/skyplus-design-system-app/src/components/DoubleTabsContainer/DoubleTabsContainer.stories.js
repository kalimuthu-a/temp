import React from 'react';
import DoubleTabsContainer from './DoubleTabsContainer';

export default {
  component: DoubleTabsContainer,
  title: 'Skyplus/DoubleTabsContainer',
};

export const SectorPassengerTab = () => {
  const props = {
    parentTab: {
      tabs: [
        { title: '<span>DEL</span><span>IXC</span>', disabled: false },
        { title: '<span>IXC</span><span>DXB</span>', disabled: true },
      ],
      defaultActiveTab: 0,
      showSingleTabBtn: false,
    },
    childTab: [
      {
        tabs: [
          { title: 'Abheesh George', checked: true },
          { title: 'Man Mohan', checked: false },
          { title: 'Ishika Verma', checked: false },
          { title: 'Ramesh', checked: false },
          { title: 'Suresh Chauhan', checked: false },
        ],
        content: [
          <h4 key="1">Tab1 content</h4>,
          <h4 key="2">Tab2 content</h4>,
          <h4 key="3">Tab3 content</h4>,
          <h4 key="4">Tab4 content</h4>,
          <h4 key="5">Tab5 content</h4>,
        ],
        defaultActiveTab: 0,
        showSingleTabBtn: false,
      },
      {
        tabs: [
          { title: 'Abheesh George1', checked: false },
          { title: 'Man Mohan1', checked: false },
          { title: 'Ishika Verma1', checked: false },
          { title: 'Ramesh1', checked: false },
          { title: 'Suresh Chauhan1', checked: false },
        ],
        content: [
          <h4 key="1">Tab11 content</h4>,
          <h4 key="2">Tab21 content</h4>,
          <h4 key="3">Tab31 content</h4>,
          <h4 key="4">Tab41 content</h4>,
          <h4 key="5">Tab51 content</h4>,
        ],
        defaultActiveTab: 0,
        showSingleTabBtn: false,
      },
    ],
    getCurrentParentTabIndex: () => {},
  };
  return <DoubleTabsContainer {...props} />;
};
