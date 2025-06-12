import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import Tabs from 'skyplus-design-system-app/dist/des-system/Tabs';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import FilterTabs from './Tabs/Tabs';
import { BROWSER_STORAGE_KEYS } from '../../constants';
import TransactionAccordion from './TransactionAccordion/TransactionAccordion';
import TransactionHistorySummary from './Summary/TransactionHistorySummary';
import { useUserSummaryContext } from '../../store/user-summary-context';
import { getAEMDataForTransactionHistory, getTransactionHistoryApiData } from '../../services';
import { TRANSACTION_TYPE, TRANSACTION_TABS, SORTING_TRANSACTION } from './Constant';
import Shimmer from './Shimmer';
import analyticEvents from '../../utils/analyticEvents';

const TransactionHistoryContainer = () => {
  const { hash } = window.location;
  const [currentTab, setCurrentTab] = useState({});
  const initialValue = { dateRangeTransactionsList: '', dateRangeExpiringList: '', transactionChannelList: '' };
  const [filtersArray, setFiltersArray] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownload, setIsDownload] = useState(false);
  const { transactionHistoryAemData } = useUserSummaryContext();
  const [sortingDetails,setSortingDetails] = useState({});
  const [transactionTypeTabs, setTransactionTypeTabs] = useState([]);
  const [activeTransTab, setActiveTransTab] = useState(0);

  useEffect(() => {
    const authUser = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    updateContextDataWithApi(authUser);
  }, []);

  const payloadAnalytics = (transactionDetails, authUser) => {
    const result = transactionDetails?.reduce((acc, transaction) => {
      const type = transaction?.transactionType?.toLowerCase();
      const points = transaction?.transactionDetail?.totalPoint;
      if (!acc[type]) {
        acc[type] = { totalPoints: 0, count: 0 };
      }
      acc[type].totalPoints += points;
      acc[type].count += 1;

      return acc;
    }, {});
    const availablePoints = authUser?.loyaltyMemberInfo?.pointBalance || 0;
    analyticEvents({
      data: {
        _event: 'transactionPageload',
        pageInfo: { searchResultCount: `${transactionDetails?.length || 0}|${result?.credit?.count || 0}|${result?.redeem?.count || 0}|0|${result?.promise?.count || 0}` },
        loyalty: {
          pointsEarned: String(result?.credit?.totalPoints || 0),
          pointsSpent: String(result?.redeem?.totalPoints || 0),
          pointPromise: String(result?.promise?.totalPoints || 0),
          pointsExpiring: '0',
          pointsAvailable: String(availablePoints || 0),
        },
      },
      error: {},
    });
  };

  const setActiveTab = () => {
    if (transactionHistoryAemData?.transactionTypeList) {
      const activeTab = transactionHistoryAemData?.transactionTypeList?.filter((item) => item?.key == hash?.slice(1));
      setCurrentTab(activeTab?.[0] || transactionHistoryAemData?.transactionTypeList?.[0]);
    }
  };

  useEffect(() => {
    setActiveTab();
  }, [transactionHistoryAemData, activeTransTab]);

  useEffect(() => {
    if (transactionHistoryAemData) {
      const tabOptions = transactionHistoryAemData?.tabNamesList || [];
      setTransactionTypeTabs(tabOptions);
    }
  }, [transactionHistoryAemData]);

  useEffect(() => {
    if (transactionHistoryAemData?.sortOptionList?.length) {
      const defaultSort =
        transactionHistoryAemData?.sortOptionList
          ?.find(option => option.key === SORTING_TRANSACTION.LATEST_FIRST) || {}

      setSortingDetails(defaultSort);
    }
  }, [transactionHistoryAemData?.sortOptionList]);
  
  const {
    updateTransHisApiData,
    updateTransHisAEMData,
  } = useUserSummaryContext();
  const updateContextDataWithApi = (authUser) => {
    Promise.all([getTransactionHistoryApiData(authUser), getAEMDataForTransactionHistory()])
      .then(([transactionData, aemDataRes]) => {
        const transactionFilter = {
          transactionHistory: {
            transactions: [],
            partnerTransaction: [],
          },
        };
        const filterPromisedData = transactionData?.[0]?.transactionHistory?.transactions?.filter((item) => item?.transactionType?.toLowerCase() !== TRANSACTION_TYPE.EXPIRE_SOON.toLowerCase());
        transactionFilter.transactionHistory.transactions = filterPromisedData;
        transactionFilter.transactionHistory.partnerTransaction = transactionData?.[0]?.transactionHistory?.partnerTransaction || [];

        updateTransHisAEMData(aemDataRes);
        payloadAnalytics(filterPromisedData, authUser);
        updateTransHisApiData(transactionFilter);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const renderTabLabel = (item) => {
    return <div key={uniq()}>{item?.value}</div>;
  };

  const onChangeTab = (tab, index) => {
    setActiveTransTab(index);
  };

  const getIsPartnerTab = useCallback(() => {
    if (!transactionTypeTabs?.length) {
      return false;
    }
    const partnerTabIndex = transactionTypeTabs.findIndex((tab) => tab?.key === TRANSACTION_TABS.PARTNERS);
    return activeTransTab === partnerTabIndex;
  }, [transactionTypeTabs, activeTransTab]);

  const getIsAllTransTab = useCallback(() => {
    if (!transactionTypeTabs?.length) {
      return false;
    }
    const allTransTabIndex = transactionTypeTabs.findIndex((tab) => tab?.key === TRANSACTION_TABS.ALL_TRANS);
    return activeTransTab === allTransTabIndex;
  }, [transactionTypeTabs, activeTransTab]);

  const renderTabContent = () => {
    return (
      <>
        <div className="transaction-filters-container">
          <TransactionHistorySummary
            currentTab={currentTab}
            isDownload={isDownload}
            isPartner={getIsPartnerTab()}
            isAllTransActive={getIsAllTransTab()} 
          />
          {transactionTypeTabs?.length > 1
            ? (
              <div className="transhistory-tab-v2">
                <Tabs
                  tabs={transactionTypeTabs}
                  onTabClick={onChangeTab}
                  activeIndex={activeTransTab}
                  renderTabContent={renderTabLabel}
                />
              </div>
            )
            : <></>}
          <FilterTabs
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            activeTransTab={activeTransTab}
            sortingDetails={sortingDetails}
            setSortingDetails={setSortingDetails}
            setFiltersArray={setFiltersArray}
            isPartner={getIsPartnerTab()}
          />

        </div>
        <TransactionAccordion
          currentTab={currentTab}
          filtersArray={filtersArray}
          activeTransTab={activeTransTab}
          sortingDetails={sortingDetails}
          setIsDownload={setIsDownload}
          isPartnerActive={getIsPartnerTab()}
          isAllTransActive={getIsAllTransTab()} 
        />
      </>
    );
  };

  return (
    <div className="main-container loyalty-db__wrapper">
      {!isLoading
        ? (
          <>
            <div className="back-to-dashboard">
              <a href={transactionHistoryAemData?.dashBoardCtaLink || '/loyalty/dashboard.html'}> &lt; {transactionHistoryAemData?.dashBoardCtaLabel || 'Back to dashboard'}</a>
            </div>
            {renderTabContent()}
          </>
        )
        : <Shimmer />}
    </div>
  );
};

export default TransactionHistoryContainer;
