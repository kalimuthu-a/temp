import React, { useState, useEffect } from 'react';
import TransactionFiltering from '../TransactionFiltering/TransactionFiltering';
import { useUserSummaryContext } from '../../../store/user-summary-context';

function FilterAction({ sortingDetails, setSortingDetails, setFiltersArray, filtersArray, currentTab, activeTransTab }) {
  const { transactionHistoryAemData } = useUserSummaryContext();
  const { sortOptionList } = transactionHistoryAemData;
  const [isSortingActive, setIsSortingActive] = React.useState(false);
  const [isEnableTranFilter, setIsEnableTranFilter] = useState(false);
  const initialValue = { dateRangeTransactionsList: '', dateRangeExpiringList: '', transactionChannelList: '' };
  const [filtersDetail, setFiltersDetail] = useState(initialValue);

  const transactonFilterCloseHandler = () => {
    setIsEnableTranFilter(false);
  };
  const showSortingMenue = () => {
    setIsSortingActive((prevState) => !prevState);
  };

  const sortingMenu = (e) => {
    if (!e.target.classList.contains('menuopner')) {
      setIsSortingActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', sortingMenu);
    return () => {
      document.addEventListener('click', sortingMenu);
    };
  }, []);

  useEffect(() => {
    setFiltersArray(initialValue);
    setFiltersDetail(initialValue);
  }, [currentTab, activeTransTab]);

  const applySorting = (sortingDetails) => {
    setSortingDetails(sortingDetails);
  };

  const resetFilter = () => {
    setFiltersArray(initialValue);
    setFiltersDetail(initialValue);
  };
  const applyFilter = () => {
    setFiltersArray(filtersDetail);
    setIsEnableTranFilter(false);
  };
  const handleClick = (filterKey, filterValue) => {
    setFiltersDetail({ ...filtersDetail, [filterKey]: filterValue });
  };

  return (
    <div className="filter-section">
      <div
        className="sorting filter-section--item menuopner"
        onClick={showSortingMenue}
        aria-hidden
      >
        <i className="sky-icons icon-switch_destination text-primary-main menuopner md" />
      </div>
      <div className={`sorting-option ${!isSortingActive ? 'hide' : ''}`}>
        <div className="sorting-option--label">
          <p>
            Sort
          </p>
        </div>
        <ul>
          {sortOptionList?.map((item) => {
            return (
              <li className={`${sortingDetails.key == item.key ? 'active' : ''}`} onClick={() => applySorting(item)} aria-hidden>{item?.value}</li>
            );
          })}

        </ul>

      </div>
      <div
        className="filter filter-section--item"
        aria-hidden
        onClick={() => { setIsEnableTranFilter(true); }}
      >
        <i className="sky-icons icon-filter-icon text-primary-main md" />
      </div>
      {isEnableTranFilter
        && (
        <TransactionFiltering
          onClose={transactonFilterCloseHandler}
          aemData={transactionHistoryAemData}
          setFilters={setFiltersArray}
          filtersArray={filtersDetail}
          resetFilter={resetFilter}
          applyFilter={applyFilter}
          handleClick={handleClick}
          currentTab={currentTab}
          activeTransTab={activeTransTab}
        />
        )}
    </div>

  );
}

export default FilterAction;
