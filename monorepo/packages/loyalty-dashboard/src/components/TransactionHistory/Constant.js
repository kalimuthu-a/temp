const TRANSACTION_TYPE = {
  CREDIT: 'credit',
  REDEEM: 'redeem',
  EXPIRE_SOON: 'expiringsoon',
  EXPIRED: 'expired',
  ALL_TRANS: 'AllTransaction',
  PROMISE: 'promise',
};
const TRANSACTION_TABS = {
  PARTNERS: 'partners',
  LOYALTY: 'loyalty',
  ALL_TRANS: 'allTransactions'
};
const DATE_RANGE_TRANSACTION = {
  CURRENT: 'currentMonth',
  LAST3: 'lastThreeMonths',
  LAST6: 'lastSixMonths',
  LAST1Year: 'lastOneYear',
};

const SORTING_TRANSACTION = {
  LATEST_FIRST: 'latestFirst',
  OLDEST_FIRST: 'oldestFirst',
};
const TRANSACTION_CHANNEL = {
  COBRAND: 'Co-Brand',
  INDIGO: 'IndiGo',
  SWIGGY:'Swiggy'
};
const DATE_FILTER_KEYS = {
  DATE_RANGE: 'dateRangeTransactions',
  EXPIRY: 'dateRangeExpiring',
};
const FILTERS_TYPE = {
  CHANNEL: 'transactionChannelList',
  RANGE: 'dateRangeTransactionsList',
  EXPIRE: 'dateRangeExpiringList',
};

const now = new Date();
// Function to get the start of the month
const getStartOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Function to get the end of the month
const getEndOfMonth = (date) => {
  // debugger
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Function to get the start of n months ago
const getStartOfMonthsAgo = (date, monthsAgo, exp) => {
  if (exp === '-') {
    return new Date(date.getFullYear(), date.getMonth() - monthsAgo, 1);
  }

  return new Date(date.getFullYear(), date.getMonth() + monthsAgo, 0);
};

const TRANS_DATE_RANGE = {
  currentMonth: { startDate: getStartOfMonth(now), endDate: getEndOfMonth(now) },
  lastThreeMonths: { startDate: getStartOfMonthsAgo(now, 2, '-'), endDate: getEndOfMonth(now) },
  lastSixMonths: { startDate: getStartOfMonthsAgo(now, 5, '-'), endDate: getEndOfMonth(now) },
  lastOneYear: { startDate: getStartOfMonthsAgo(now, 12, '-'), endDate: getEndOfMonth(now) },
};

const EXPIRE_DATE_RANGE = {
  currentMonth: { startDate: getStartOfMonth(now), endDate: getEndOfMonth(now) },
  nextThreeMonths: { startDate: getStartOfMonth(now), endDate: getStartOfMonthsAgo(now, 3, '+') },
  nextSixMonths: { startDate: getStartOfMonth(now), endDate: getStartOfMonthsAgo(now, 6, '+') },
  nextOneYear: { startDate: getStartOfMonth(now), endDate: getStartOfMonthsAgo(now, 12, '+') },
};
export const getNumberFormat = (number) => {
  return number ? new Intl.NumberFormat().format(number) : 0;
};

export { TRANSACTION_TYPE, TRANSACTION_TABS, DATE_RANGE_TRANSACTION, TRANS_DATE_RANGE, EXPIRE_DATE_RANGE, SORTING_TRANSACTION, TRANSACTION_CHANNEL, DATE_FILTER_KEYS, FILTERS_TYPE };
