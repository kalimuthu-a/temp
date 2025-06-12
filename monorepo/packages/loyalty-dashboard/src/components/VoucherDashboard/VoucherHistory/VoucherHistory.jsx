import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './VoucherHistory.scss';
import NoResults from '../NoResults/NoResults';
import Filter from '../Filter/Filter';
import VoucherHistoryCard from '../VoucherHistoryCard/VoucherHistoryCard';
import { TIER_BENEFIT_UTLISATION_TAB,
  VOUCHER_HISTORY_TAB,
  LATEST_FIRST,
  QUERYPARAM_KEY,
  ANALYTICS_EVENTS,
  VOUCHER_CONSTANTS,
  EATKEYWORD,
  PRIMEKEYWORD,
  BLUECHIPKEYWORD,
  SIXEEATFILTER,
  SIXEPRIMEFILTER,
  BLUECHIPFILTER,
  PARTNER_HISTORY_ANALYTICS,
  IBC,
} from '../../../constants';
import { getQueryStringByParameterName } from '../../../utils';
import analyticEvents from '../../../utils/analyticEvents';

const VoucherHistory = ({ voucherAEMData, filteredCouponData, activeTab }) => {
  const {
    voucherHistoryTitle,
    voucherHistoryNoResults,
    sortFilterLabels,
    coBrandCardIconList,
    voucherSourceLabel,
    pnrLabel,
    voucherSourceList,
    voucherHistoryTabs,
    sortLabel,
    creditedLabel,
    redeemedLabel,
    expiringSoonLabel,
    bluChipVoucherLabel,
  } = voucherAEMData;
  const [showFilter, setShowFilter] = useState(false);
  const [isSortingActive, setIsSortingActive] = useState(false);
  const initialValue = { date: '', voucherType: '', partner: '', transactionType: '' };
  const [filtersDetail, setFiltersDetail] = useState(initialValue);
  const [sortCoupons, setSortCoupons] = useState();
  const [sortKey, setSortKey] = useState(LATEST_FIRST);
  const voucherFilter = getQueryStringByParameterName(QUERYPARAM_KEY.VOUCHERFILTER_KEY);
  const [active, setActiveTab] = useState(voucherFilter || VOUCHER_HISTORY_TAB.ALL_RESULT);

  const getAnalyticsCall = (detail) => {
    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.PARTNER_FILTERS,
        interactionType: ANALYTICS_EVENTS.PARTNER_FILTERS,
        pageInfo: {
          pageName: VOUCHER_CONSTANTS.PAGE_NAME,
          siteSection: VOUCHER_CONSTANTS.SITE_SECTION,
          journeyFlow: VOUCHER_CONSTANTS.JOURNEY_FLOW,
        },
        eventInfo: {
          name: PARTNER_HISTORY_ANALYTICS,
        },
        search: {
          filters: {
            transaction: detail?.transactionType,
            voucher: detail?.voucherType,
            partner: detail?.partner,
            date: detail?.date,
          },
        },
      },
      event: ANALYTICS_EVENTS.PARTNER_FILTERS,
    };
    analyticEvents(analyticsObj);
  };

  const getVoucherName = (offerType) => {
    if (offerType?.toLowerCase() === IBC) {
      return bluChipVoucherLabel;
    }
    return offerType;
  };

  const sortFn = (toSort, sortBy = LATEST_FIRST) => {
    let arr = [];
    if (sortBy === LATEST_FIRST) {
      arr = toSort?.slice().sort((a, b) => {
        return new Date(b?.redeemdate || b?.createdDate) - new Date(a?.redeemdate || a?.createdDate);
      });
      setSortCoupons(arr);
    } else {
      arr = toSort?.slice().sort((a, b) => {
        return new Date(a?.redeemdate || a?.createdDate) - new Date(b?.redeemdate || b?.createdDate);
      });
      setSortCoupons(arr);
    }
  };

  const getFilteredTabs = (filteredCoupons, tab) => {
    let filteredCouponsTab;
    const today = new Date();
    const oneMonthLater = new Date(today).setMonth(today.getMonth() + 1);

    const Earned = filteredCoupons.filter((coupon) => !coupon?.redeemId && today < new Date(coupon?.expiryDate))
      .map((coupon) => ({ ...coupon,
        offer: coupon?.offerType,
        filterType: creditedLabel,
        offerType: getVoucherName(coupon?.offerType) }));

    const Redeemed = filteredCoupons.filter((coupon) => coupon?.redeemId)
      .map((coupon) => ({ ...coupon,
        offer: coupon?.offerType,
        filterType: redeemedLabel,
        offerType: getVoucherName(coupon?.offerType) }));

    const Expiring = filteredCoupons.filter(
      (coupon) => !coupon?.redeemId
        && new Date(coupon?.expiryDate) >= today
        && new Date(coupon?.expiryDate) <= new Date(oneMonthLater),
    ).map((coupon) => ({ ...coupon,
      offer: coupon?.offerType,
      filterType: expiringSoonLabel,
      offerType: getVoucherName(coupon?.offerType) }));

    switch (tab) {
      case VOUCHER_HISTORY_TAB.EARNED:
        filteredCouponsTab = [...Earned];
        break;
      case VOUCHER_HISTORY_TAB.REDEEMED:
        filteredCouponsTab = [...Redeemed];
        break;
      case VOUCHER_HISTORY_TAB.EXPIRING:
        filteredCouponsTab = [...Expiring];
        break;
      default:
        filteredCouponsTab = [...Earned, ...Redeemed, ...Expiring];
    }

    return filteredCouponsTab;
  };

  const getFilteredCoupons = (tab) => {
    const filteredCoupons = activeTab === TIER_BENEFIT_UTLISATION_TAB.PARTNERS
      ? filteredCouponData?.voucher : filteredCouponData?.history;

    const getAllFilteredCoupons = getFilteredTabs(filteredCoupons, tab);

    sortFn(getAllFilteredCoupons);
  };

  useEffect(() => {
    if (filteredCouponData) {
      getFilteredCoupons(active);
    }
  }, [filteredCouponData]);

  const FILTER_DATES = {
    currentMonth: 'currentMonth',
    lastThreeMonth: -3,
    lastSixMonths: -6,
    lastOneYear: -12,
  };

  useEffect(() => {
    if (!filteredCouponData) return;
    const { history = [], voucher = [] } = filteredCouponData;
    let historyArr = history;
    if (activeTab === TIER_BENEFIT_UTLISATION_TAB.PARTNERS) {
      historyArr = voucher;
    }
    sortFn([...historyArr]);
  }, []);

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  const showSortingMenu = () => {
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

  const resetFilter = () => {
    setFiltersDetail(initialValue);
    getFilteredCoupons(active);
    setActiveTab(active);
    handleFilter();
  };

  function containsExactWord(sentence, keywords) {
    if (typeof sentence !== 'string') return false;

    const cleanedKeywords = keywords.map((word) => word.trim().toLowerCase());
    const wordsInSentence = sentence.match(/\b\w+\b/g)?.map((word) => word.toLowerCase()) || [];

    return wordsInSentence.some((word) => cleanedKeywords.includes(word));
  }

  const applyFilter = () => {
    const dataSource = activeTab === TIER_BENEFIT_UTLISATION_TAB.PARTNERS
      ? filteredCouponData?.voucher
      : filteredCouponData?.history;

    if (filtersDetail.partner === ''
      && filtersDetail.date === ''
      && filtersDetail.voucherType === ''
      && filtersDetail.transactionType === ''
    ) {
      sortFn(sortCoupons);
      return;
    }

    let result = [...dataSource || []];

    if (filtersDetail.partner) {
      const filterPartner = result?.filter((el) => el?.category.toLowerCase() === filtersDetail?.partner.toLowerCase());
      const getFilteredTransactionType = getFilteredTabs(filterPartner, filtersDetail?.transactionType);
      result = getFilteredTransactionType;
    }

    if (filtersDetail.date) {
      let firstDay;
      if (filtersDetail.date === FILTER_DATES.currentMonth) {
        firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      } else {
        firstDay = new Date();
        firstDay.setMonth(firstDay.getMonth() + FILTER_DATES[filtersDetail.date]);
      }

      const filterDate = result?.filter((el) => new Date(el?.createdDate) >= firstDay);
      const getFilteredTransactionType = getFilteredTabs(filterDate, filtersDetail?.transactionType);
      result = getFilteredTransactionType;
    }

    if (filtersDetail.voucherType) {
      const cleanedVoucherType = filtersDetail?.voucherType.replace(/\s+/g, '').toUpperCase();
      switch (filtersDetail?.voucherType) {
        case SIXEEATFILTER:
          result = result?.filter((x) => containsExactWord(x.offerType, EATKEYWORD) === true);
          break;
        case SIXEPRIMEFILTER:
          result = result?.filter((x) => containsExactWord(x.offerType, PRIMEKEYWORD) === true);
          break;
        case BLUECHIPFILTER:
          result = result?.filter((x) => containsExactWord(x.offerType, BLUECHIPKEYWORD) === true);
          break;
        default:
          result = result?.filter((el) => el?.offerType === cleanedVoucherType);
      }
      const getFilteredTransactionType = getFilteredTabs(result, filtersDetail?.transactionType);
      result = getFilteredTransactionType;
    }

    if (filtersDetail?.transactionType) {
      const getFilteredTransactionType = getFilteredTabs(result, filtersDetail?.transactionType);
      result = getFilteredTransactionType;
    }

    setActiveTab(filtersDetail?.transactionType);
    getAnalyticsCall(filtersDetail);
    setSortCoupons(result);
    handleFilter();
  };

  const handleFilterCoupon = (e) => {
    setActiveTab(e.target.name);
    getFilteredCoupons(e.target.name);
  };

  const handleClick = (filterKey, filterValue) => {
    let key;
    switch (filterKey) {
      case 'Voucher Type':
        key = 'voucherType';
        break;
      case 'Partner':
        key = 'partner';
        break;
      case 'Date Range':
        key = 'date';
        break;
      case 'Transaction Type':
        key = 'transactionType';
        break;
      default:
        break;
    }
    setFiltersDetail({ ...filtersDetail, [key]: filterValue });
  };

  const applySorting = (item) => {
    sortFn(sortCoupons, item.key);
    setSortKey(item.key);
  };

  return (
    <div className="voucher-history-container">
      <span className="voucher-history-container--title">
        {voucherHistoryTitle}
      </span>
      <div className="chip-container">
        <div className="chips">
          {voucherHistoryTabs?.map((chips) => (
            <button
              type="button"
              key={chips.key}
              onClick={(e) => handleFilterCoupon(e)}
              name={chips.key}
              className={`chip ${chips.key === active ? 'active' : ''}`}
            >
              {chips.value}
            </button>
          ))}
        </div>
        <div className="actions">
          <div className="filter-section">
            <div
              className="sorting filter-section--item menuopner"
              onClick={showSortingMenu}
              aria-hidden
            >
              <i className="sky-icons icon-switch_destination text-primary-main menuopner md" />
            </div>
            <div className={`sorting-option ${!isSortingActive ? 'hide' : ''}`}>
              <div className="sorting-option--label">
                <p>{sortLabel}</p>
              </div>
              <ul>
                {sortFilterLabels?.map((item) => {
                  return (
                    <li
                      className={`${
                        sortKey === item.key ? 'active' : ''
                      }`}
                      onClick={() => applySorting(item)}
                      aria-hidden
                      key={item.key}
                    >
                      {item?.value}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className="filter filter-section--item"
              aria-hidden
              onClick={handleFilter}
            >
              <i className="sky-icons icon-filter-icon text-primary-main md" />
            </div>
          </div>
        </div>
      </div>
      <div className="content-container">
        {sortCoupons?.length ? (
          <VoucherHistoryCard
            filteredCouponData={sortCoupons}
            coBrandCardIconList={coBrandCardIconList}
            voucherSourceLabel={voucherSourceLabel}
            pnrLabel={pnrLabel}
            voucherSourceList={voucherSourceList}
          />
        ) : (
          <NoResults voucherHistoryNoResults={voucherHistoryNoResults} />
        )}
      </div>
      {showFilter && (
        <Filter
          onClose={handleFilter}
          aemData={voucherAEMData}
          filtersArray={filtersDetail}
          resetFilter={resetFilter}
          applyFilter={applyFilter}
          handleClick={handleClick}
        />
      )}
    </div>
  );
};

VoucherHistory.propTypes = {
  voucherAEMData: PropTypes.object,
  filteredCouponData: PropTypes.object,
  activeTab: PropTypes.string,
};

export default VoucherHistory;
