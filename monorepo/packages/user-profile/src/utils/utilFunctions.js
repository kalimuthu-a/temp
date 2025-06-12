/* eslint-disable sonarjs/no-duplicate-string */
import moment from 'moment';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { formatDuration, intervalToDuration } from 'date-fns';
import { GENERIC_DATA_CONTAINER_APP, webCheckInMsgStatus, webCheckInStatus } from '../constants/common';
import { BOOKINGS, BROWSER_STORAGE_KEYS, QUESRIES, URLS } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const formatDateTime = (dateTimeString) => {
  // 1) 30 Oct, 24
  const formattedDateShort = moment(dateTimeString).format('DD MMM, YY');

  // 2) 7:00, Fri 28 Oct ’24
  const formattedTimeAndDay = moment(dateTimeString).format('h:mm, ddd DD MMM ’YY');

  // 3) HH:mm
  const formattedTime = moment(dateTimeString).format('HH:mm');

  // 4) DD:MMM
  const formattedDateMonth = moment(dateTimeString).format('DD MMM');

  // 5) 06 Jun 2024, 10:24
  const formattedDateMonthWithFullYear = moment(dateTimeString).format('DD MMM YYYY, h:mm');

  const formatedDdMmYy = moment(dateTimeString).format('DD-MM-YYYY');

  return {
    formattedDateShort,
    formattedTimeAndDay,
    formattedTime,
    formattedDateMonth,
    formattedDateMonthWithFullYear,
    formatedDdMmYy,
  };
};

export const getTimeDifference = (startDateTimeString, endDateTimeString) => {
  // Create moment objects from the input strings
  const startDateTime = moment(startDateTimeString);
  const endDateTime = moment(endDateTimeString);

  // Calculate the difference in minutes and take the absolute value
  const duration = moment.duration(Math.abs(endDateTime.diff(startDateTime)));

  // Extract hours and minutes
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  // Return the difference formatted as "02h 10m"
  return `${hours}h ${minutes}m`;
};

export const objectOfKeys = (obj = {}) => {
  return Object?.keys(obj)?.reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {});
};

export const getButtonLabelObj = (key, arr = []) => {
  return arr.find((item) => item?.buttonCode === key) || {};
};

export const getWebCheckInMsgStatus = (utcTime) => {
  if (!utcTime) return false;

  const currentTime = moment().utc();
  const targetTime = moment.utc(utcTime); // Parse input as UTC time
  const diffInHours = targetTime.diff(currentTime, 'hours');

  if (diffInHours > 0) {
    return webCheckInMsgStatus.NOT_STARTED;
  }
  // if (diffInHours >= 0 && diffInHours <= 48) {
  //   return webCheckInMsgStatus.STARTED;
  // }
  return webCheckInMsgStatus.STARTED;
};

export const getLoyaltyTierLabel = (tierStrApi) => {
  try {
    const obj = JSON.parse(localStorage.getItem(GENERIC_DATA_CONTAINER_APP));
    const foundLabelObj = obj?.loyaltyTierLabel?.find((i) => i?.key?.toLowerCase() === tierStrApi?.toLowerCase());
    return foundLabelObj?.value || tierStrApi;
  } catch (error) {
    return tierStrApi;
  }
};

// function to get the user category
export const getUserCategory = (item, savedPassengerAemData, age) => {
  const label = savedPassengerAemData?.paxList?.find((list) => list.typeCode === item.gender)?.paxLabel;
  if (label) {
    return `${label} | `;
  }
  if (age < 18) return 'Child | ';
  if (age >= 18 || age < 60) return 'Adult | ';
  if (age >= 60) return 'Senior Citizen | ';
  return '';
};

// Calculate the max and min DOB allowed
const today = new Date();
export const minDate = new Date(
  today.getFullYear() - 120,
  today.getMonth(),
  today.getDate(),
).toISOString().split('T')[0];

export const maxDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()).toISOString().split('T')[0];

// Check if the date is in past
export const isHistoryDate = (dateStr) => {
  // Parse the date in YYYY-MM-DD format
  const inputDate = moment(dateStr, 'YYYY-MM-DD');

  // Check if it's a valid date and if it's in the past
  return inputDate.isValid() && inputDate.isBefore(moment(), 'day');
};

// Check if the date is in future
export const isFutureDate = (dateStr) => {
  // Parse the date in YYYY-MM-DD format
  const inputDate = moment(dateStr, 'YYYY-MM-DD');

  // Check if it's a valid date and if it's after today
  return inputDate.isValid() && inputDate.isAfter(moment(), 'day');
};

/* eslint-disable no-shadow */
export const dobMinMaxDate = () => {
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 120);
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 2);
  // Format the dates in YYYY-MM-DD format (required by input[type="date"])
  const minStrDate = minDate.toISOString().split('T')[0];
  const maxStrDate = maxDate.toISOString().split('T')[0];
  return { min: minStrDate, max: maxStrDate, minDate, maxDate };
};

export const dateToConvert = (date) => {
  if (!date) return '';
  const dateSplit = date.split('-');
  if (dateSplit?.length === 3) {
    return `${dateSplit[1]}-${dateSplit[0]}-${dateSplit[2]}`;
  }
  return '';
};

export const dateInputFormat = (value) => {
  if (!value) return '';
  let formattedValue = value?.replace(/\D/g, '');
  if (formattedValue.length > 2 && formattedValue.charAt(2) !== '-') {
    formattedValue = `${formattedValue.slice(0, 2)}-${formattedValue.slice(2)}`;
  }
  if (formattedValue.length > 5 && formattedValue.charAt(5) !== '-') {
    formattedValue = `${formattedValue.slice(0, 5)}-${formattedValue.slice(5)}`;
  }
  return formattedValue;
};

export const getSessionUser = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true);
    return tokenObj || '';
  } catch (error) {
    return error;
  }
};

// scroll to top with timeout
export const scrollToTop = (time = 0) => (
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  }, time)
);

export const flightDurationFormatter = (
  start,
  end,
  formatDistanceLocale = {
    xMinutes: '{{count}}m',
    xHours: '{{count}}h',
    xDays: '{{count}}d',
  },
) => {
  const shortEnLocale = {
    formatDistance: (token, count) => formatDistanceLocale[token].replace(
      '{{count}}',
      String(count),
    ),
    };
  return formatDuration(intervalToDuration({ start, end }), {
    locale: shortEnLocale,
    format: ['days', 'hours', 'minutes'],
  });
};

// Helper function to capitalize field names add spacing each caps word
// dateOfBirth => Date Of Birth | lastname => Lastname
export const capitalize = (s) => {
  if (!s) {
    return '';
  }

  const formattedString = s.replace(/([a-z])([A-Z])/g, '$1 $2');

  return formattedString
    .split(' ')
    .map((word) => {
      if (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return '';
    })
    .join(' ');
};

const HOLD_CANCELLED_BG_RED = 'holdcancelled bg-red';
export const renderBookingStatus = (bookingStatus) => {
  let className = '';
  let label = '';
  let iconClassName = '';
  const { BOOKING_STATUS, BOOKING_STATUS_LABEL } = BOOKINGS;

  switch (bookingStatus) {
    case BOOKING_STATUS.CONFIRMED:
    case BOOKING_STATUS.NEEDS_PAYMENT:
      label = BOOKING_STATUS_LABEL.CONFIRMED;
      className = 'confirmed bg-green';
      iconClassName = 'icon-check text-forest-green';
      break;
    case BOOKING_STATUS.ON_HOLD1:
    case BOOKING_STATUS.HOLD:
      label = BOOKING_STATUS_LABEL.HOLD;
      // eslint-disable-next-line sonarjs/no-duplicate-string
      className = HOLD_CANCELLED_BG_RED;
      break;
    case BOOKING_STATUS.IN_PROGRESS:
      label = BOOKING_STATUS_LABEL.IN_PROGRESS;
      className = 'inprogress bg-orange';
      break;
    case BOOKING_STATUS.HOLD_CANCELLED:
      label = BOOKING_STATUS_LABEL.HOLD_CANCELLED;
      className = HOLD_CANCELLED_BG_RED;
      break;
    case BOOKING_STATUS.CANCELLED:
    case BOOKING_STATUS.CLOSED:
      label = BOOKING_STATUS_LABEL.CANCELLED;
      className = HOLD_CANCELLED_BG_RED;
      iconClassName = 'icon-close-circle';
      // system-warning
      break;
    case BOOKING_STATUS.PENDING:
    case BOOKING_STATUS.ONHOLD:
      label = BOOKING_STATUS_LABEL.HOLD;
      className = 'holdcancelled bg-orange';
      break;
    case BOOKING_STATUS.COMPLETED:
      label = BOOKING_STATUS_LABEL.COMPLETED;
      className = 'confirmed bg-green ';
      iconClassName = 'icon-check text-forest-green';
      break;
    case BOOKING_STATUS.PARTIAL_COMPLETE:
      label = BOOKING_STATUS_LABEL.PARTIAL_COMPLETE;
      className = 'bg-red';
      iconClassName = 'icon-info text-warning';
      break;
    default:
      // eslint-disable-next-line no-undef
      label = bookingStatus;
      className = 'inprogress bg-orange';
      break;
  }
  return [label, className, iconClassName];
};

export const renderBookingStatusForQueries = (bookingStatus) => {
  let className = '';
  let label = '';
  let iconClassName = '';
  const { QUESRIES_STATUS, QUESRIES_STATUS_LABEL } = QUESRIES;

  switch (bookingStatus) {
    case QUESRIES_STATUS.UNTOUCHED:
    case QUESRIES_STATUS.OPEN:
      label = QUESRIES_STATUS_LABEL.OPEN;
      className = 'holdcancelled bg-blue';
      iconClassName = 'icon-arrow-top-right-solid text-secondary-bright';
      break;
    case QUESRIES_STATUS.RESOLVED:
    case QUESRIES_STATUS.CLOSED:
      label = QUESRIES_STATUS_LABEL.RESOLVED;
      className = 'holdcancelled bg-green';
      iconClassName = 'icon-tick-filled text-forest-green';
      break;
    default:
      // eslint-disable-next-line no-undef
      label = QUESRIES_STATUS_LABEL.WORK_IN_PROGRESS;
      className = 'inprogress bg-orange';
      iconClassName = 'icon-info-filled text-warning';
      break;
  }
  return [label, className, iconClassName];
};

export const handleCheckHealthStatusForChatbot = async () => {
  const cxApiDomain = URLS?.GET_CHATBOT_STATUS;

  try {
    const response = await fetch(cxApiDomain);
    return response.ok;
  } catch (error) {
    console.error('Error checking chatbot status:', error);
    return false;
  }
};

export const getLabel = (webCheckinInfo) => {
  if (webCheckinInfo?.isAllPaxCheckedIn) {
    return 'View Boarding Pass';
  } else if (webCheckinInfo?.isSmartCheckin) {
    return 'Schedule Smart Check in';
  } else if (
    !webCheckinInfo?.isAllPaxCheckedIn
    && !webCheckinInfo?.isAutoCheckedin 
    && !webCheckinInfo?.isSmartCheckin 
    && webCheckinInfo?.isWebCheckinStatus === webCheckInStatus.OPEN
  ) {
    return 'Web check-in';
  } else {
    return '';
  }
};
