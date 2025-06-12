import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import { TRANSACTION_TYPE, TRANS_DATE_RANGE, EXPIRE_DATE_RANGE, SORTING_TRANSACTION, getNumberFormat, TRANSACTION_CHANNEL } from '../Constant';
import { useUserSummaryContext } from '../../../store/user-summary-context';
import { formatDate } from '../../../utils/date';
import { UTIL_CONSTANTS } from '../../../utils';
import NotFound from '../NotFound/NotFound';

const TransactionAccordion = ({
  currentTab,
  filtersArray,
  activeTransTab,
  sortingDetails,
  setIsDownload,
  isPartnerActive,
  isAllTransActive,
}) => {
  const { transactionHistoryData, transactionHistoryAemData, updateFilteredHistoryData, filteredHistoryData } = useUserSummaryContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [notData, setNotData] = useState(false);
  const [tabbasedOriginalData, setTabbasedOriginalData] = useState([]);
  const initalActiveIndexes = [];

  useEffect(() => {
    let filterArrayByTab = [];
    if (isPartnerActive) {
      filterArrayByTab = currentTab?.key === TRANSACTION_TYPE.ALL_TRANS
        ? transactionHistoryData?.transactionHistory?.partnerTransaction
        : transactionHistoryData?.transactionHistory?.partnerTransaction?.filter((item) =>
          item?.transactionType?.toLowerCase() === currentTab?.key?.toLowerCase()
        );
    } else if (isAllTransActive) {
      const allTransactions = [
        ...(transactionHistoryData?.transactionHistory?.partnerTransaction || []),
        ...(transactionHistoryData?.transactionHistory?.transactions || [])
      ];
      filterArrayByTab = currentTab?.key === TRANSACTION_TYPE.ALL_TRANS 
        ? allTransactions 
        : allTransactions.filter((item) => item?.transactionType?.toLowerCase() === currentTab?.key?.toLowerCase());
     }
    else {
      filterArrayByTab = currentTab?.key === TRANSACTION_TYPE.ALL_TRANS ? transactionHistoryData?.transactionHistory?.transactions : transactionHistoryData?.transactionHistory?.transactions?.filter((item) => item?.transactionType.toLowerCase() === currentTab?.key?.toLowerCase());
    }
    if (filterArrayByTab?.length > 0) {
      setTabbasedOriginalData(filterArrayByTab);
      setNotData(false);
      setIsDownload(false);
    } else {
      setTabbasedOriginalData([]);
      setNotData(true);
      setIsDownload(true);
    }
  }, [currentTab, activeTransTab]);

  const filterByDateRange = (transactions, startDate, endDate, type) => {
    if (type) {
      return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        const transType = transaction?.transactionType?.toLowerCase();
        let tabCondition;
        if (currentTab?.key?.toLowerCase() === TRANSACTION_TYPE.ALL_TRANS?.toLowerCase()) {
          tabCondition = transType === TRANSACTION_TYPE.EXPIRE_SOON || transType === TRANSACTION_TYPE.PROMISE;
        } else if (currentTab?.key?.toLowerCase() === TRANSACTION_TYPE.EXPIRE_SOON.toLowerCase()) {
          tabCondition = transType === TRANSACTION_TYPE.EXPIRE_SOON;
        } else if (currentTab?.key?.toLowerCase() === TRANSACTION_TYPE.PROMISE.toLowerCase()) {
          tabCondition = transType === TRANSACTION_TYPE.PROMISE;
        }
        return (transactionDate >= startDate && transactionDate <= endDate) && tabCondition;
      });
    }
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };
  const filterBybothDaterange = (filtersArray, transactions) => {
    const dateRangeObj = TRANS_DATE_RANGE[filtersArray?.dateRangeTransactionsList];
    const dateRangeEObj = EXPIRE_DATE_RANGE[filtersArray?.dateRangeExpiringList];
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return (transactionDate >= dateRangeObj?.startDate && transactionDate <= dateRangeObj?.endDate) || (transaction?.transactionType.toLowerCase() === TRANSACTION_TYPE.EXPIRE_SOON && transactionDate >= dateRangeEObj?.startDate && transactionDate <= dateRangeEObj?.endDate) || (transaction?.transactionType.toLowerCase() === TRANSACTION_TYPE.PROMISE && transactionDate >= dateRangeEObj?.startDate && transactionDate <= dateRangeEObj?.endDate);
    });
  };

  const filterTransactionData = () => {
    let filteredObj = tabbasedOriginalData;
    const {
      transactionChannelList = "",
      dateRangeTransactionsList = "",
      dateRangeExpiringList = ""
    } = filtersArray || {};
    if (transactionChannelList !== '') {
      if (transactionChannelList === TRANSACTION_CHANNEL.COBRAND) {
        filteredObj = [];
      }
      else if (transactionChannelList === TRANSACTION_CHANNEL.INDIGO) {
        const indigoTransactions = [
          ...(transactionHistoryData?.transactionHistory?.transactions || [])
        ];
        filteredObj = currentTab?.key === TRANSACTION_TYPE.ALL_TRANS
          ? indigoTransactions
          : indigoTransactions.filter((item) => item?.transactionType?.toLowerCase() === currentTab?.key?.toLowerCase());
      }
      else {
        filteredObj = filteredObj.filter(item =>
          item?.partnerOrgName?.toLowerCase() === transactionChannelList?.toLowerCase()
        );
      }
    }
    if (dateRangeTransactionsList !== '' || dateRangeExpiringList !== '') {
      if (dateRangeTransactionsList !== '' && dateRangeExpiringList !== '') {
        filteredObj = filterBybothDaterange(filtersArray, filteredObj);
      }
      if (dateRangeTransactionsList !== '' && dateRangeExpiringList == '') {
        const dateRangeObj = TRANS_DATE_RANGE[dateRangeTransactionsList];
        filteredObj = dateRangeObj && filterByDateRange(filteredObj, dateRangeObj?.startDate, dateRangeObj?.endDate, false);
      }
      if (dateRangeExpiringList !== '' && dateRangeTransactionsList == '') {
        const dateRangeObj = EXPIRE_DATE_RANGE[dateRangeExpiringList];
        filteredObj = dateRangeObj && filterByDateRange(filteredObj, dateRangeObj?.startDate, dateRangeObj?.endDate, true);
      }
    }
    getSortTransaction(filteredObj);
  };

  useEffect(() => {
      filterTransactionData();
  }, [filtersArray]);

  const getSortTransaction = (filterObj) => {
    const transactionArray = filterObj ? [...filterObj] : [...filteredHistoryData];
    if (transactionArray?.length > 0) {
      setNotData(false);
      setIsDownload(false);
      let sortedArray;
      if (sortingDetails?.key == SORTING_TRANSACTION.LATEST_FIRST) {
        sortedArray = transactionArray.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
      }
      if (sortingDetails?.key == SORTING_TRANSACTION.OLDEST_FIRST) {
        sortedArray = transactionArray.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));
      }
      updateFilteredHistoryData(sortedArray);
    }
    else {
      updateFilteredHistoryData([]);
    }
  };

  useEffect(() => {
    getSortTransaction();
  }, [sortingDetails]);

  useEffect(() => {
    if (filteredHistoryData?.length < 1) {
      setNotData(true);
      setIsDownload(true);
    } else {
      setNotData(false);
      setIsDownload(false);
    }
  }, [filteredHistoryData]);

  const chipRenderer = (tranType) => {
    switch (tranType) {
      case TRANSACTION_TYPE.CREDIT:
        return { chilClass: 'chip-success', aemLabel: transactionHistoryAemData?.pointsCreditedLabel };
      case TRANSACTION_TYPE.EXPIRE_SOON:
        return { chilClass: 'chip-expiry-soon', aemLabel: transactionHistoryAemData?.pointsCreditedLabel };
      case TRANSACTION_TYPE.REDEEM:
        return { chilClass: 'chip-error', aemLabel: transactionHistoryAemData?.pointsRedeemedLabel };
      case TRANSACTION_TYPE.EXPIRED:
        return { chilClass: 'chip-disabled', aemLabel: transactionHistoryAemData?.pointsExpiredLabel };
      case TRANSACTION_TYPE.PROMISE:
        return { chilClass: 'chip-promise', aemLabel: transactionHistoryAemData?.pointsPromisedLabel || 'Points promised' };
      default:
        return {};
    }
  };

  const titleAccordRenderer = (etrdata) => {
    const refundCheck = etrdata?.reversalId === null
      || etrdata?.reversalId === ''
      || etrdata?.reversalId === undefined;
    const transactionType = etrdata?.transactionType?.toLowerCase();
    const addAndMinusSymbol = transactionType === TRANSACTION_TYPE.REDEEM ? '-' : '+';
    const aemLabel = chipRenderer(transactionType);
    return (
      <div className="transaction-accordion-tab">
        <div className="transaction-accordion-tab-left">
          <span className="transaction-accordion-tab-left-title">
            {refundCheck ? transactionHistoryAemData?.typeLabel?.[transactionType] : transactionHistoryAemData?.typeLabel?.refund || 'IndiGo BluChips Refund'}
          </span>
          <span className="transaction-accordion-tab-left-date">
            {etrdata?.transactionDate ? formatDate(etrdata?.transactionDate, UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY) : ''}
          </span>
        </div>
        <div className="transaction-accordion-tab-right">

          {etrdata?.transactionDetail?.totalPoint ? (
            <Chip
              variant="filled"
              color="system-error"
              withBorder
              size="sm"
              containerClass={`${refundCheck ? aemLabel?.chilClass : 'chip-success'}`}
            >
              {`${refundCheck ? addAndMinusSymbol : '+'} ${getNumberFormat(etrdata?.transactionDetail?.totalPoint)} ${transactionHistoryAemData?.ptsLabel ?? ''}`}
            </Chip>
          ) : null}
        </div>
      </div>
    );
  };
  const contentAccordRenderer = (etrdata) => {
    return (
      <div className="transaction-accordion-tabcontent">
        {!isPartnerActive
          ? (
           <>
            
            {etrdata?.partnerOrgName ? (
              <div className="transaction-accordion-tabcontent-partnerInfo">
                      <div>
                        <span className="partner-label">{transactionHistoryAemData?.partnerLabel}:</span>{' '}
                        <span className="partner-value">{etrdata?.partnerOrgName}</span>
                      </div>
                      <div>
                        <span className="partner-label">{transactionHistoryAemData?.transactionTypeLabel}:</span>{' '}
                        <span className="partner-value">{etrdata?.partnerSubOrgName}</span>
                      </div>
                    </div>
    ) : (
      <>
      <div className="transaction-accordion-tabcontent-channel-info">
                <div className="transaction-accordion-tabcontent-channel-info-left">
                  <span className="pnr-label">{transactionHistoryAemData?.pnrLabel}:</span>{' '}
                  <span className="pnr-value">{etrdata?.transactionDetail?.pnr}</span>
                </div>

                <div className="transaction-accordion-tabcontent-channel-info-right">
                  <span className="transaction-channel-label">
                    {transactionHistoryAemData?.transactionChannelIndigo}
                  </span>
                  <span className="transaction-channel-value">
                    {transactionHistoryAemData?.transactionChannelIndigo}
                  </span>
                </div>
              </div>
              <div className="transaction-accordion-tabcontent-booking-info">
                <div className="transaction-accordion-tabcontent-booking-info-origin">
                  <span className="transaction-accordion-tabcontent-booking-info-origin-code">
                    {etrdata?.transactionDetail?.departure}
                  </span>
                  {/* <span className="transaction-accordion-tabcontent-booking-info-origin-name">
            {etrdata?.transactionDetail?.arrival}
            </span> */}
                </div>
                <div className="transaction-accordion-tabcontent-booking-info-flight-icon">
                  <span className="icon icon-Flight" />
                  <span className="dotted-line" />
                  <span className="circle" />
                </div>
                <div className="transaction-accordion-tabcontent-booking-info-destination">
                  <span className="transaction-accordion-tabcontent-booking-info-destination-code">
                    {etrdata?.transactionDetail?.arrival}
                  </span>
                  {/* <span className="transaction-accordion-tabcontent-booking-info-destination-name">
              Bangalore
            </span> */}
                </div>
              </div>
              </>
    )}

</>             
          )
          : (
            <div className="transaction-accordion-tabcontent-partnerInfo">
              <div>
                <span className="partner-label">{transactionHistoryAemData?.partnerLabel}:</span>{' '}
                <span className="partner-value">{etrdata?.partnerOrgName}</span>
              </div>
              <div>
                <span className="partner-label">{transactionHistoryAemData?.transactionTypeLabel}:</span>{' '}
                <span className="partner-value">{etrdata?.partnerSubOrgName}</span>
              </div>
            </div>
          )}
          {!etrdata?.partnerOrgName && (
            <div className="transaction-accordion-tabcontent-point-summary">
              {!isPartnerActive && (
              <div className="transaction-accordion-tabcontent-point-summary-title">
                {transactionHistoryAemData?.pointsSummaryLabel}
              </div>
              )}
              {etrdata?.transactionType?.toLowerCase() === TRANSACTION_TYPE.REDEEM ? (
                <div className="transaction-accordion-tabcontent-point-summary-container">
                  <div className="transaction-accordion-tabcontent-point-summary-block">
                    <span className="transaction-accordion-tabcontent-point-summary-name">
                      {etrdata?.reversalId ? transactionHistoryAemData?.pointsRefundedLabel : transactionHistoryAemData?.pointsRedeemedLabel}
                    </span>
                    <span className="transaction-accordion-tabcontent-point-summary-value">
                      {etrdata?.reversalId ? '+' : '-'}{etrdata?.transactionDetail?.totalPoint } {transactionHistoryAemData?.ptsLabel ?? ''}
                    </span>
                  </div>
                </div>

              )
                : (
                  <>
                    {Object.keys(etrdata?.transactionDetail?.pointsBreakup || {}).length ? (
                      <div className="transaction-accordion-tabcontent-point-summary-container">
                        <div className="transaction-accordion-tabcontent-point-summary-block">
                          <span className="transaction-accordion-tabcontent-point-summary-name">
                            {transactionHistoryAemData?.basePointsLabel}
                          </span>
                          <span className="transaction-accordion-tabcontent-point-summary-value">
                            +{etrdata?.transactionDetail?.pointsBreakup?.basePoints}
                          </span>
                        </div>
                        <div className="transaction-accordion-tabcontent-point-summary-block">
                          <span className="transaction-accordion-tabcontent-point-summary-name">
                            {transactionHistoryAemData?.onlineBonusPointsLabel}
                          </span>
                          <span className="transaction-accordion-tabcontent-point-summary-value">
                            + {etrdata?.transactionDetail?.pointsBreakup?.bonusPoints}
                          </span>
                        </div>
                        <div className="transaction-accordion-tabcontent-point-summary-block">
                          <span className="transaction-accordion-tabcontent-point-summary-name">
                            {transactionHistoryAemData?.tierPointsLabel}
                          </span>
                          <span className="transaction-accordion-tabcontent-point-summary-value">
                            +{etrdata?.transactionDetail?.pointsBreakup?.tierPoints}
                          </span>
                        </div>
                        <div className="transaction-accordion-tabcontent-point-summary-block">
                          <span className="transaction-accordion-tabcontent-point-summary-name">
                            {transactionHistoryAemData?.pointsOnAncillariesLabel}
                          </span>
                          <span className="transaction-accordion-tabcontent-point-summary-value">
                            +{etrdata?.transactionDetail?.pointsBreakup?.ancillaryPoints}
                          </span>
                        </div>
                      </div>
                    )
                      : <></>}
                    <div className="transaction-accordion-tabcontent-point-summary-total">
                      <span className="transaction-accordion-tabcontent-point-summary-total-label">
                        {transactionHistoryAemData?.totalPonitsLabel}
                      </span>
                      <span className="transaction-accordion-tabcontent-point-summary-total-value">
                        {`+ ${getNumberFormat(etrdata?.transactionDetail?.totalPoint)} ${transactionHistoryAemData?.ptsLabel ?? ''}`}
                      </span>
                    </div>
                  </>
                )}
            </div>
          )}
      </div>
    );
  };

  const accordionPropsRenderer = [];
  filteredHistoryData?.map((thData) => {
    if (thData?.transactionType?.toLowerCase() !== TRANSACTION_TYPE.EXPIRED.toLowerCase()) {
      accordionPropsRenderer?.push({
        title: titleAccordRenderer(thData),
        renderAccordionContent: contentAccordRenderer(thData),
      });
    } else {
      accordionPropsRenderer?.push({
        title: titleAccordRenderer(thData),
        isDisabled: true,
      });
    }
  });

  return (
    <>
      {notData
        ? <NotFound />
        : (
          <div className="transaction-accordion">
            <Accordion
              activeIndex={activeIndex}
              accordionData={accordionPropsRenderer}
              setActiveIndex={setActiveIndex}
              initalActiveIndexes={initalActiveIndexes}
              isMultiOpen
            />
          </div>
        )}
    </>
  );
};

export default TransactionAccordion;
