import React, { isValidElement, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TabButton from './TabButton';
import TabContent from './TabContent';

const TabsContainer = ({
  tabs,
  content,
  defaultActiveTab,
  showSingleTabBtn,
  component,
  onChangeTab,
  isMainCard,
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultActiveTab);
  const changeTab = (i) => {
    setSelectedTabIndex(i);
    onChangeTab?.(i);
  };

  useEffect(() => {
    setSelectedTabIndex(defaultActiveTab);
  }, [defaultActiveTab]);

  const showTabs = (showSingleTabBtn && tabs.length === 1) || tabs.length > 1;

  return (
    <div className="tab-container">
      {showTabs && !isMainCard && (
        <ul>
          {tabs.map((tab, index) => (
            <TabButton
              key={tab?.title}
              isActive={selectedTabIndex === index}
              onChangeTab={() => changeTab(index)}
              {...tab}
            />
          ))}
        </ul>
      )}

      {isValidElement(component) && component}

      <TabContent>{content[selectedTabIndex]}</TabContent>
    </div>
  );
};

TabsContainer.propTypes = {
  tabs: PropTypes.array.isRequired,
  content: PropTypes.array.isRequired,
  defaultActiveTab: PropTypes.number,
  showSingleTabBtn: PropTypes.bool,
  component: PropTypes.elementType,
  onChangeTab: PropTypes.func,
  isMainCard: PropTypes.bool,
};

TabsContainer.defaultProps = {
  defaultActiveTab: 0,
  showSingleTabBtn: false,
  isMainCard: false,
};

export default TabsContainer;
