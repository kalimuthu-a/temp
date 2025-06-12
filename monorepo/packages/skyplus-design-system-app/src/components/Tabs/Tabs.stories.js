import React, { useState } from 'react';
import Tabs from './Tabs';

export default {
  title: 'Skyplus/Tabs',
  component: Tabs,
};

export const PrimaryTab = (args) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = [
    { label: 'Book a flight', iconClass: '' },
    { label: 'Book a stay', iconClas: '' },
  ];

  const renderTabContent = (item) => {
    return <div>{item?.label}</div>;
  };
  const onTabClick = (tab, index) => {
    console.log(tab, 'tab-clicked');
    setActiveIndex(index);
  };
  const props = { tabs, activeIndex, renderTabContent, onTabClick };
  return <Tabs {...props}>Primary</Tabs>;
};

export const DisabledTab = (args) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = [
    { label: 'Book a flight', iconClass: '' },
    { label: 'Book a stay', iconClas: '' },
    { label: 'Book a stay 2', iconClas: '', isDisabled: true },
  ];

  const renderTabContent = (item) => {
    return <div>{item?.label}</div>;
  };
  const onTabClick = (tab, index) => {
    console.log(tab, 'tab-clicked');
    setActiveIndex(index);
  };
  const props = { tabs, activeIndex, renderTabContent, onTabClick };
  return <Tabs {...props}>Primary</Tabs>;
};
