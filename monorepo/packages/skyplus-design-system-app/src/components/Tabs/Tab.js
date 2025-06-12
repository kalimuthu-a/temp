import React from 'react';
import PropTypes from 'prop-types';

function Tab(props) {
  const { index, tab, activeIndex, renderTabContent, onTabClick } = props;
  return (
    <div
      role="button"
      tabIndex={tab.isDisabled ? -1 : 0}
      aria-disabled={!!tab.isDisabled}
      key={`tab-${index}`}
      className={`skyplus-tabs-elem ${
        index === activeIndex ? 'skyplus-tabs-isActive' : ''
      } ${tab.iconClass} ${
        tab.isDisabled ? 'skyplus-tabs-elem--disabled' : ''
      }`}
      onClick={() => onTabClick(tab, index)}
      onKeyDown={(e) => { if (e.key === 'Enter') onTabClick(tab, index); }}
    >
      {renderTabContent(tab)}
    </div>
  );
}

Tab.defaultProps = {
  index: 0,
  tab: {},
  activeIndex: 0,
  renderTabContent: () => <span>Tab Content</span>,
  onTabClick: () => {},
};

Tab.propTypes = {
  index: PropTypes.number,
  renderTabContent: PropTypes.func,
  activeIndex: PropTypes.number,
  tab: PropTypes.object,
  onTabClick: PropTypes.func,
};

export default Tab;
