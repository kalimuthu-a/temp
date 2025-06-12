import React, { useMemo } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import { TRANSACTION_TYPE, DATE_FILTER_KEYS, FILTERS_TYPE, TRANSACTION_TABS } from '../Constant';
import { useUserSummaryContext } from '../../../store/user-summary-context';
import { TRANSACTION_CHANNEL } from '../../../constants';

const TransactionFiltering = ({ onClose, aemData, filtersArray, resetFilter, applyFilter, handleClick, currentTab, activeTransTab }) => {
  const currenTab = currentTab?.key?.toLowerCase();
  const { transactionHistoryData, transactionHistoryAemData } = useUserSummaryContext();
  const hideDateRange = currenTab === TRANSACTION_TYPE.EXPIRE_SOON || currenTab === TRANSACTION_TYPE.PROMISE;
  const showDateExpire = currentTab.key == TRANSACTION_TYPE.ALL_TRANS || currenTab === TRANSACTION_TYPE.EXPIRE_SOON || currenTab === TRANSACTION_TYPE.PROMISE;
  const filterElements = useMemo(() => {
    const elements = [];
    const filterTypes = [FILTERS_TYPE.CHANNEL, FILTERS_TYPE.RANGE, FILTERS_TYPE.EXPIRE];
  
    const tabKey = transactionHistoryAemData?.tabNamesList?.[activeTransTab]?.key?.toLowerCase();
    const isAll = tabKey === TRANSACTION_TABS.ALL_TRANS.toLowerCase();
    const isPartners = tabKey === TRANSACTION_TABS.PARTNERS;
    const isLoyalty = tabKey === TRANSACTION_TABS.LOYALTY;
  
    const allFilters = aemData?.filterValues || [];
  
    const partnersFilter = allFilters.find(f => f.heading === TRANSACTION_CHANNEL && f.key === TRANSACTION_TABS.PARTNERS);
    const loyaltyFilter = allFilters.find(f => f.heading === TRANSACTION_CHANNEL && f.key === TRANSACTION_TABS.LOYALTY);
  
    const rawPartnerNames = transactionHistoryData?.transactionHistory?.partnerTransaction?.map(p =>
      p?.partnerOrgName?.trim()
    ).filter(Boolean) || [];
  
    const normalizedPartnerMap = new Map();
    rawPartnerNames.forEach(name => {
      const key = name.toLowerCase();
      if (!normalizedPartnerMap.has(key)) {
        normalizedPartnerMap.set(key, name);
      }
    });
  
    const uniquePartnerNames = Array.from(normalizedPartnerMap.values());
  
    const buildPartnerList = (aemList = []) => {
      const map = new Map(aemList.map(i => [i.key?.toLowerCase(), i]));
      return uniquePartnerNames.map(name => {
        const match = map.get(name.toLowerCase());
        return match || { key: name, value: name };
      });
    };
  
    const getPartnerList = () => {
      const partnerList = buildPartnerList(partnersFilter?.filtersList || []);
      const loyaltyList = loyaltyFilter?.filtersList || [];
  
      if (isPartners) return partnerList;
      if (isLoyalty) return loyaltyList;
      if (isAll) {
        const seen = new Set(loyaltyList.map(i => i.key?.toLowerCase()));
        return [...loyaltyList, ...partnerList.filter(p => !seen.has(p.key?.toLowerCase()))];
      }
      return partnerList;
    };
  
    const processedHeadings = new Set();
  
    allFilters.forEach((filter, idx) => {
      if (filter.key === DATE_FILTER_KEYS.DATE_RANGE && hideDateRange) return;
      if (filter.key === DATE_FILTER_KEYS.EXPIRY && !showDateExpire) return;
      if (processedHeadings.has(filter.heading)) return;
  
      processedHeadings.add(filter.heading);
  
      let list = filter?.filtersList || [];
  
      if (filter.heading === TRANSACTION_CHANNEL) {
        list = getPartnerList();
        if (!list.length) return;
      } else if (!list.length) {
        return;
      }
  
      elements.push(
        <React.Fragment key={filter.heading}>
          <div className="border-circle"><div className="dot-border" /></div>
          <div className="transaction-filtering-slider-common-block">
            <HtmlBlock className="transaction-filtering-slider-common-block-label" html={filter.heading} />
            <div className="transaction-filtering-slider-common-block-values">
              {list.map(i => (
                <Chip
                  key={i.key}
                  variant="filled"
                  color="info"
                  withBorder
                  size="sm"
                  containerClass={`chip-default ${filtersArray[filterTypes[idx]] === i.key ? 'chip-selected' : ''}`}
                  onClick={() => handleClick(filterTypes[idx], i.key)}
                >
                  {i.value}
                </Chip>
              ))}
            </div>
          </div>
        </React.Fragment>
      );
    });
  
    return elements;
  }, [activeTransTab, aemData, transactionHistoryData, filtersArray, handleClick]);
  
  return (
    <OffCanvas
      containerClassName="skp-retrieve-pnr transaction-filtering"
      onClose={onClose}
      renderFooter={() => {
        return (
          <div className="transaction-filtering-footer">
            <Button
              containerClass="transaction-filtering-footer-secondary"
              onClick={resetFilter}
              tabIndex="0"
              variant="outline"
            >
              {aemData?.resetCtaLabel}
            </Button>
            <Button
              containerClass="transaction-filtering-footer-primary"
              onClick={applyFilter}
              tabIndex="0"
              variation="outline"
            >
              {aemData?.applyCtaLabel}
            </Button>
          </div>

        );
      }}
    >
      <div className="transaction-filtering-slider">
        <Heading heading="h4 transaction-filtering-slider-title">
          {aemData?.filtersLabel}
        </Heading>
        {filterElements}
      </div>
    </OffCanvas>
  );
};
TransactionFiltering.propTypes = {
  onClose: PropTypes.func,
};
export default TransactionFiltering;
