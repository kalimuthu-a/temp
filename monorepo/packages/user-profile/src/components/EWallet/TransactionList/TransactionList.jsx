import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import InfoStrip from '../InfoStrip/InfoStrip';
import { getTransactionHistory } from '../../../services/ewallet.service';
import ShimmerList from '../Shimmer/Shimmer';
import NoTransactionFound from '../NoTransactionFound/NoTransactionFound';
import { transactionTypes } from '../../../constants/common';

const TransactionList = ({
  sixEWalletAemData,
  transactionData,
  setTransactionData,
  setIsLoading,
  isLoading,
  contentSize,
  transBalanceLoading,
}) => {
  const [selectedChip, setSelectedChip] = useState('All');
  const observer = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true); // To track if more data is available
  const [transactionLoader, setTransactionLoader] = useState(false);

  const selectedChipProp = {
    color: 'secondary-light',
    border: 'secondary-main',
    txtcol: 'text-secondary',
    containerClass: 'transaction-filter__list',
  };

  const chipProps = {
    ...selectedChipProp,
    color: 'white',
  };

  const fetchTransactions = async (pageSize, type) => {
    if (pageSize !== 1) {
      setTransactionLoader(true);
    }
    try {
      const historyResult = await getTransactionHistory(pageSize, contentSize, type);

      const newItems = historyResult?.data?.items || [];

      setTransactionData((prevData) => ({
        page: historyResult?.data?.page,
        count: historyResult?.data?.count,
        items: [...(prevData?.items || []), ...newItems],
      }));
      if (newItems.length < contentSize) {
        setHasMoreData(false);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
      setTransactionLoader(false);
    }
  };

  const handleChipClick = (item) => {
    setSelectedChip(item.key);
    setTransactionData({ items: [], page: 1, count: 0 });
    setPage(1);
    setHasMoreData(true);
    setIsLoading(true);
    setTransactionLoader(true);
    fetchTransactions(1, item.key);
  };

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || !hasMoreData) return; // Stop observing if already loading or no more data

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!hasMoreData) return;
          fetchTransactions(page + 1, selectedChip);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMoreData, page, selectedChip],
  );

  return (
    <>
      {(!(selectedChip.toLowerCase() === transactionTypes.ALL
      && transactionData?.items?.length === 0) || (transactionLoader)) && (
      <>
        <Heading heading="h1" containerClass="transaction-filter__heading">
          <HtmlBlock html={sixEWalletAemData?.item?.yourTransactionText.html} />
        </Heading>
        <div className="transaction-filter">
          {sixEWalletAemData?.item?.filterLabel?.map((item) => (
            <Chip
              key={item.key}
              {...(selectedChip === item.key ? selectedChipProp : chipProps)}
              onClick={() => handleChipClick(item)}
            >
              {item.value}
            </Chip>
          ))}
        </div>
      </>
      )}
      {isLoading ? (
        <div className="mt-12"><ShimmerList transBalanceLoading={transBalanceLoading} /></div>
      ) : (
        <div className={transactionData?.items?.length > 5 ? 'transaction-filter__listing' : ''}>
          {transactionData?.items?.length
            ? (
              <>
                {transactionData?.items?.map((item, id) => (
                  <InfoStrip
                    key={item.id || id}
                    sixEWalletAemData={sixEWalletAemData}
                    transactionData={item}
                    ref={
                  id === (transactionData?.items.length || 1) - 1
                    ? lastElementRef
                    : null
                }
                  />
                ))}
                {transactionLoader && <ShimmerList />}
              </>
            )
            : (
              <NoTransactionFound
                noTransactionFound={false}
                sixEWalletAemData={sixEWalletAemData}
              />
            )}
        </div>
      )}
    </>
  );
};

TransactionList.propTypes = {
  sixEWalletAemData: PropTypes.object,
  transactionData: PropTypes.object,
  setTransactionData: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  contentSize: PropTypes.number,
  transBalanceLoading: PropTypes.bool,
};

export default TransactionList;
