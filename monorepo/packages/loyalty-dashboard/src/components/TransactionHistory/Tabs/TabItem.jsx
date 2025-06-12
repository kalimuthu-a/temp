import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useUserSummaryContext } from '../../../store/user-summary-context';

const TabItem = ({ handleActiveTab, currentTab, isPartner }) => {
  const { transactionHistoryAemData } = useUserSummaryContext();
  const { transactionTypeList = [] } = transactionHistoryAemData;

  const filteredTabs = isPartner
    ? transactionTypeList?.filter((item) => item.key === 'credit' || item.key === 'redeem')
    : transactionTypeList;

  const handleKeyDown = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActiveTab(item);
    }
  };

  return filteredTabs?.map((item) => (
    <span
      key={item.key || uniq()}
      className={`tab__left--items ${currentTab?.key === item.key ? 'active' : ''}`}
      onClick={() => handleActiveTab(item)}
      onKeyDown={(e) => handleKeyDown(e, item)}
      role="button"
      tabIndex={0}
      aria-pressed={currentTab?.key === item.key}
    >
      {item.value}
    </span>
  ));
};

TabItem.propTypes = {
  currentTab: PropTypes.object,
  handleActiveTab: PropTypes.func.isRequired,
  isPartner: PropTypes.bool,
};

export default TabItem;
