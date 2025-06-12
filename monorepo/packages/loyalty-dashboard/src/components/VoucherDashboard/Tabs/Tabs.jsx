import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Tabs.scss';

const Tabs = ({ voucherTabs, activeTab, onTabChange }) => {
  return (
    <div className="tabs-container">
      {voucherTabs.map((tab) => (
        <span
          className={`tab ${activeTab === tab.key ? 'active' : ''}`}
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.value}
        </span>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default Tabs;
