import React from 'react';
import PropTypes from 'prop-types';
import TabItem from './TabItem';
import FiltersAction from './FiltersAction';

function Tabs(props) {
  const handleActiveTab = (currentTabDetails) => {
    props?.setCurrentTab(currentTabDetails);
  };
  return (
    <div className="tab">
      <div className="tab__left">
        <TabItem
          handleActiveTab={handleActiveTab}
          currentTab={props?.currentTab}
          isPartner={props?.isPartner}
        />
      </div>
      <FiltersAction
        sortingDetails={props?.sortingDetails}
        setSortingDetails={props?.setSortingDetails}
        setFiltersArray={props?.setFiltersArray}
        currentTab={props?.currentTab}
        activeTransTab={props?.activeTransTab}
      />
    </div>
  );
}

Tabs.propTypes = {
  currentTab: PropTypes.object,
  handleActiveTab: PropTypes.func,
};

export default Tabs;
