import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DoubleTabButton from './DoubleTabButton';
import TabsContainer from '../TabsContainer/TabsContainer';

const DoubleTabsContainer = ({
  parentTab,
  childTab,
  getCurrentParentTabIndex,
  onChangeChildTab,
  isMainCard,
}) => {
  const { tabs, defaultActiveTab, showSingleTabBtn } = parentTab;
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultActiveTab);
  const [disabledClass, setDisabledClass] = useState('');
  const changeTab = (i) => {
    setSelectedTabIndex(i);
    if (getCurrentParentTabIndex) {
      getCurrentParentTabIndex(i);
    }
  };

  useEffect(() => {
    let isDisabled = false;
    tabs.forEach((tab) => {
      if (tab.disabled) {
        isDisabled = true;
      }
    });

    if (isDisabled) {
      setDisabledClass('double-tab-container__wrapper--disabled');
    }
  }, [tabs]);

  const showTabs = (showSingleTabBtn && tabs.length === 1) || tabs.length > 1;

  return (
    <div className="double-tab-container">
      {showTabs && (
        <div className={`double-tab-container__wrapper ${disabledClass}`}>
          <ul>
            {tabs.map((tab, index) => (
              <DoubleTabButton
                {...tab}
                key={tab?.title}
                isActive={selectedTabIndex === index}
                onChangeTab={() => changeTab(index)}
              />
            ))}
          </ul>
        </div>
      )}
      <TabsContainer
        {...childTab[selectedTabIndex]}
        onChangeTab={onChangeChildTab}
        isMainCard={isMainCard}
      />
    </div>
  );
};

DoubleTabsContainer.propTypes = {
  parentTab: {
    tabs: PropTypes.array.isRequired,
    defaultActiveTab: PropTypes.number,
    showSingleTabBtn: PropTypes.bool,
  },
  childTab: PropTypes.array,
  onChangeChildTab: PropTypes.func,
  getCurrentParentTabIndex: PropTypes.any,
  isMainCard: PropTypes.bool,
};

DoubleTabsContainer.defaultProps = {
  parentTab: {
    defaultActiveTab: 0,
    showSingleTabBtn: false,
  },
  isMainCard: false,
};

export default DoubleTabsContainer;
