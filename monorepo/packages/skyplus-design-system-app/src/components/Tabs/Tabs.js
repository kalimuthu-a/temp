import React from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

function Tabs(props) {
  const { tabs, containerClass } = props;
  return (
    <div className={`skyplus-tabs ${containerClass}`}>
      {tabs.length > 0
        && tabs.map((tab, index) => <Tab index={index} tab={tab} {...props} />)}
    </div>
  );
}

Tabs.defaultProps = {
  containerClass: '',
  tabs: [],
  activeIndex: 0,
  renderTabContent: () => <span>Tab Content</span>,
  onTabClick: () => {},
};

Tabs.propTypes = {
  renderTabContent: PropTypes.func,
  activeIndex: PropTypes.number,
  tabs: PropTypes.array,
  onTabClick: PropTypes.func,
  containerClass: PropTypes.string,
};

export default Tabs;
