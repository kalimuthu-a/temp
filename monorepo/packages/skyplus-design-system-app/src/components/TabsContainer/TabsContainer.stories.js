import React from 'react';
import TabsContainer from './TabsContainer';

export default {
  component: TabsContainer,
  title: 'Skyplus/TabsContainer',
};

/* export const TiffinTab = () => {
  const props = {
    tabs: [
      {
        title: 'Abheesh George',
        description: 'Hara Bhara Kabab',
        checked: true,
      },
      { title: 'Man Mohan', description: 'Select Meal', checked: false },
      { title: 'Ishika Verma', description: 'Select Meal', checked: false },
      { title: 'Ramesh', description: 'Select Meal', checked: false },
      { title: 'Suresh Chauhan', description: 'Select Meal', checked: false },
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
    component: <h1>Filter</h1>,
  };
  return <TabsContainer {...props} />;
}; */

export const PassengerTab = () => {
  const props = {
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
  };
  return <TabsContainer {...props} />;
};
