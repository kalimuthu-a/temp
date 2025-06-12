import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { CONSTANTS } from '../constants';
import { COOKIE_KEYS } from '../constants/cookieKeys';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const UTIL_CONSTANTS = {
  DATE_SPACE_DDMMMYYYY: 'DD MMM YYYY',
  DATE_SLASH_DDMMYYYY: 'DD/MM/YYYY',
  DATE_HYPHEN_DDMMYYYY: 'DD-MM-YYYY',
  DATE_SLASH_DDMMMYYYY: 'DD/MMM/YYYY',
  DATE_SPACE_DDDMMMYYYYHHMM: 'DDD MMM YYYY HH:MM',
  DATE_SPACE_DDDMMMYYYY: 'DDD MMM YYYY',
  DATE_SPACE_DDDMMM: 'DDD MMM',
  DATE_BOOKEDON: 'DATE_BOOKEDON',
  DATE_BOOKINGDETAILS: 'DATE_BOOKINGDETAILS',
  DATE_BOOKINGDETAILS_PARTNER: 'DATE_BOOKINGDETAILS_PARTNER',
  DATE_SPACE_PRINTHEADER: 'DATE_SPACE_PRINTHEADER',
  DATE_CANCELFLIGHT_POPUP: 'DATE_CANCELFLIGHT_POPUP',
  DATE_CANGEFLIGHT_SRP_PAYLOADIN: 'DATE_CANGEFLIGHT_SRP_PAYLOADIN',
  DATE_HYPHEN_YYYYMMDD: 'YYYY-MM-DD',
  DATE_SPACE_DDMMMMYYYY: 'DD,MM YYYY',
  DATE_SPACE_DDMMYYYY: 'DD, MM YYYY',
  DATE_SPACE_DDMMM: 'DD MM',
  DATE_SLASH_MMDDYYYY: 'MM/DD/YYYY',
  DATE_SPACE_PRINTHEADER_PIPE: 'DATE_SPACE_PRINTHEADER_PIPE',
};

const convertZuluToSplitted = (date, isUtcRequired) => {
  const dateOut = new Date(date);
  try {
    const obj = {
      dd: isUtcRequired ? dateOut.getUTCDate() : dateOut.getDate(),
      mm: isUtcRequired ? dateOut.getUTCMonth() : dateOut.getMonth(),
      yyyy: isUtcRequired ? dateOut.getUTCFullYear() : dateOut.getFullYear(),
      timehh: isUtcRequired ? dateOut.getUTCHours() : dateOut.getHours(),
      timemm: isUtcRequired ? dateOut.getUTCMinutes() : dateOut.getMinutes(),
      timesec: isUtcRequired ? dateOut.getUTCSeconds() : dateOut.getSeconds(),
      day: isUtcRequired ? dateOut.getUTCDay() : dateOut.getDay(),
      yy: ((isUtcRequired ? dateOut.getUTCFullYear() : dateOut.getFullYear()) % 100)?.toString()?.padStart(2, '0'),
    };
    obj.dd = obj.dd >= 10 ? obj.dd : `0${obj.dd}`;
    obj.mm = obj.mm >= 10 ? obj.mm : `0${obj.mm}`;
    obj.timehh = obj.timehh >= 10 ? obj.timehh : `0${obj.timehh}`;
    obj.timemm = obj.timemm >= 10 ? obj.timemm : `0${obj.timemm}`;
    obj.timesec = obj.timesec >= 10 ? obj.timesec : `0${obj.timesec}`;
    obj.timeInStamp = obj.timehh;
    return { ...obj };
  } catch (error) {
    return {};
  }
};

const formatDate = (date, format, isUTCTimeRequired) => {
  try {
    const { dd, mm, yyyy, yy, timehh, timemm, day, timesec, timeInStamp } = convertZuluToSplitted(
      date,
      isUTCTimeRequired,
    );
    const monthStr = monthNames[Number(mm)]
      ? monthNames[Number(mm)].slice(0, 3)
      : '';
    const monthNumber = String(Number(mm) + 1).padStart(2, '0');
    const dayStr = days[Number(day)] ? days[Number(day)].slice(0, 3) : '';
    const dayFormat = timeInStamp > 12 ? 'PM' : 'AM';
    switch (format) {
      case UTIL_CONSTANTS.DATE_SLASH_DDMMYYYY:
        return `${dd}/${monthNumber}/${yyyy}`;
      case UTIL_CONSTANTS.DATE_SLASH_DDMMMYYYY:
        return `${dd}/${monthStr}/${yyyy}`;
      case UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY:
        return `${dd}-${monthNumber}-${yyyy}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY:
        return `${dd} ${monthStr} ${yyyy}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDDMMMYYYYHHMM:
        return `${dayStr}, ${dd} ${monthStr} ${yyyy} ${timehh}:${timemm}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDDMMMYYYY:
        return `${dayStr}, ${dd} ${monthStr} ${yyyy}`;
      case UTIL_CONSTANTS.DATE_BOOKEDON:
        return `${dd} ${monthStr} ${yyyy} ${timehh}:${timemm}`;
      case UTIL_CONSTANTS.DATE_BOOKINGDETAILS:
        return `${dd} ${monthStr} ${yyyy} at ${timehh}:${timemm} hours`;
      case UTIL_CONSTANTS.DATE_BOOKINGDETAILS_PARTNER:
        return `${dd} ${monthStr} ${yyyy}`;
      case UTIL_CONSTANTS.DATE_BOOKINGDETAILS_SUCCESS:
        return `${dd} ${monthStr} `;
      case UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER:
        return `${dd} ${monthStr} ${yyyy} ${timehh}:${timemm}`;
      case UTIL_CONSTANTS.DATE_CANCELFLIGHT_POPUP:
        return `${yyyy}-${monthNumber}-${dd} ${timehh}:${timemm}:${timesec}`;
      case UTIL_CONSTANTS.DATE_CANGEFLIGHT_SRP_PAYLOADIN:
        return `${yyyy}-${monthNumber}-${dd}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDDMMM:
        return `${dayStr}, ${dd} ${monthStr}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDMMMMYYYY:
        return `${dd} ${monthStr}, ${yy}`;
      case UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD:
        return `${yyyy}-${monthNumber}-${dd}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDMMYYYY:
        return `${dd} ${monthStr}, ${yyyy}`;
      case UTIL_CONSTANTS.DATE_SPACE_DDMMM:
        return `${dd} ${monthStr}`;
      case UTIL_CONSTANTS.DATE_SLASH_MMDDYYYY:
        return `${monthNumber}/${dd}/${yyyy}`;
      case UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER_PIPE:
        return `${dd} ${monthStr}, ${yyyy} | ${timeInStamp}:${timemm} ${dayFormat}`;
      default:
        return date;
    }
  } catch (error) {
    return '';
  }
};

const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    return error;
  }
};

const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_visa_service';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    return defaultObj;
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase();
};

/**
* @param {{price: number, currencycode?: string}} priceObj
* @returns {string}
*/
const formatCurrencyFunc = (priceObj = {}) => {
  return formatCurrency(priceObj.price, priceObj.currencycode ?? 'INR', {
    minimumFractionDigits: 0,
  });
};

const fileFormatName = (filename) => {
  const fileFormat = filename?.split('.')?.pop();
  switch (fileFormat) {
    case 'pdf':
      return 'icon-Export-PDF';
    case 'jpg' || 'jpeg':
      return 'icon-jpg';
    case 'png':
      return 'icon-png';
    default:
      return 'icon-note';
  }
};

const fileFormats = (filename) => {
  switch (filename) {
    case 'image/png':
      return ' .png';
    case 'image/jpeg':
      return ' .jpeg';
    case 'image/jpg':
      return ' .jpg';
    case 'application/pdf':
      return ' .pdf';
    default:
      return '';
  }
};

const IconNames = (fieldName) => {
  switch (fieldName) {
    case 'photograph':
      return 'icon-photograph';
    case 'passportFrontImage':
      return 'icon-passport-fornt-page';
    case 'passportBioImage':
      return 'icon-passport-bio-page';
    case 'panCard':
      return 'icon-visa-pan-card';
    case 'bankStatement':
      return 'icon-bank-statement-visa';
    case 'arrivalFlightTicket':
      return 'icon-arrival-flight-ticket';
    case 'departureFlightTicket':
      return 'icon-departure-flight-ticket';
    case 'noc':
      return 'icon-noc';
    case 'invitation':
      return 'icon-invitation-visa';
    case 'itinerary':
      return 'icon-itinerary';
    case 'itr':
      return 'icon-itr';
    case 'salarySlip':
      return 'icon-salary-slip';
    case 'Cover Letter':
      return 'icon-cover-letter';
    case 'Other Documents':
      return 'icon-other-documents';
    case 'Travel Insurance':
      return 'icon-travel-insurance';
    case 'Covid Certificate':
      return 'icon-covid-certificate';
    case 'Accommodation':
      return 'icon-accommodation';
    case 'residentialProof':
      return 'icon-residential-proof';
    case 'retirementProof':
      return 'icon-retirement-proof';
    case 'businessCard':
      return 'icon-business-card';
    case 'aadhaarCardNumber':
      return 'icon-adhar-card-visa';
    case 'GST Copy':
      return 'icon-gst-copy';
    case 'studentId':
      return 'icon-student-card-visa';
    case 'birthCertificate':
      return 'icon-birth-certificate-visa';
    default:
      return 'icon-note';
  }
};

const convertDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(' ', ' ').replace(',', ',');
};

const getRoleDetails = () => {
  return (
    Cookies.get(COOKIE_KEYS.ROLE_DETAILS, true) || {
      roleName: 'Anonymous',
      roleCode: 'WWWA',
    }
  );
};

const getStatusClass = (bookingState) => {
  switch (bookingState) {
    case '2':
      return 'complete';

    case '1':
      return 'pending';

    case '3':
      return 'failed';

    default:
      return '';
  }
};

const getStatusClassColor = (key) => {
  switch (key) {
    case '2':
      return 'bg-accent-dark';

    case '1':
      return 'bg-system-warnings';

    case '3':
      return 'bs-fail';

    default:
      return '';
  }
};

export const PAX_CODES = {
  ADULT: 'ADT',
  CHILD: 'CHD',
  INFANT: 'INFT',
};

export const getVisaStatus = (journey) => {
  const status = journey && journey.find((step) => !step?.endDate && step?.startDate);
  if (status) {
    return status?.stepName;
  }
  return '';
};

export {
  monthNames,
  days,
  UTIL_CONSTANTS,
  formatDate,
  convertZuluToSplitted,
  getEnvObj,
  getSessionToken,
  capitalizeFirstLetter,
  formatCurrencyFunc,
  fileFormatName,
  fileFormats,
  IconNames,
  convertDate,
  getRoleDetails,
  getStatusClass,
  getStatusClassColor,
};

export function formatDateWithSuffixAndMonth(dateString) {
  const date = new Date(dateString);
  const day = date?.getDate();
  const month = date?.toLocaleString('default', { month: 'short' });

  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) {
    suffix = 'st';
  } else if (day % 10 === 2 && day !== 12) {
    suffix = 'nd';
  } else if (day % 10 === 3 && day !== 13) {
    suffix = 'rd';
  }

  return `${day}${suffix} ${month}`;
}
