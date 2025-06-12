/**
 * An date utility for
 *
 * @example
 * import date from "@app/utils/date"
 *
 * date("2012-10-12");
 *
 *
 * @param {string|Date} dateString
 *
 * @returns {{
 * 	dd: string,
 * 	mm: string,
 * 	yyyy: string,
 * 	hh: string,
 * 	ii: string,
 * 	ss: string,
 * 	formatDate: (format: string) => string
 * 	diff: (newDate: string|Date) => {
 * 		days: string, hh: string, mm: string, ss: string, ms: string,
 * 	}
 * }}
 */
export default (dateString) => {
  /**
	 *
	 * @param {number} number
	 * @returns {string}
	 */
  function appendZero(number) {
    return number.toString().padStart(2, '0');
  }
  let date;
  if (typeof dateString === 'string') {
		 date = new Date(dateString.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
  } else {
		 date = dateString ? new Date(dateString) : new Date();
  }

  return {
    dd: appendZero(date.getDate()),
    mm: appendZero(date.getMonth()),
    yyyy: appendZero(date.getFullYear()),
    hh: appendZero(date.getHours()),
    ii: appendZero(date.getMinutes()),
    ss: appendZero(date.getSeconds()),

    /**
		 *
		 * @param {string} format
		 * @returns {string}
		 */
    formatDate: (format) => {
      let str = format;

      format.split(/[ :\-]/).forEach((f) => {
        if (f === 'DD') {
          str = str.replace('DD', appendZero(date.getDate()));
        } else if (f === 'MMM') {
          str = str.replace(
            'MMM',
            date.toLocaleString('default', { month: 'short' }),
          );
        } else if (f === 'YYYY') {
          str = str.replace('YYYY', date.getFullYear().toString());
        } else if (f === 'HH') {
          str = str.replace('HH', appendZero(date.getHours()));
        } else if (f === 'MM') {
          str = str.replace('MM', appendZero(date.getMonth() + 1));
        } else if (f === 'II') {
          str = str.replace('II', appendZero(date.getMinutes()));
        }
      });

      return str;
    },
    /**
		 *
		 * @param {string|Date} newDate
		 * @returns {{days: string, hh: string, mm: string, ss: string, ms: string}}
		 */
    diff: (newDate) => {
      /**
			 * @type {*}
			 */
      let diff = Math.abs(Date.parse(dateString) - Date.parse(newDate));

      const ms = diff % 1000;
      diff = (diff - ms) / 1000;
      const ss = diff % 60;
      diff = (diff - ss) / 60;
      const mm = diff % 60;
      diff = (diff - mm) / 60;
      const hh = diff % 24;
      const day = (diff - hh) / 24;

      return {
        days: appendZero(day),
        hh: appendZero(hh),
        mm: appendZero(mm),
        ss: appendZero(ss),
        ms: appendZero(ms),
      };
    },
  };
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
    };
    obj.dd = obj.dd >= 10 ? obj.dd : `0${obj.dd}`;
    obj.mm = obj.mm >= 10 ? obj.mm : `0${obj.mm}`;
    obj.timehh = obj.timehh >= 10 ? obj.timehh : `0${obj.timehh}`;
    obj.timemm = obj.timemm >= 10 ? obj.timemm : `0${obj.timemm}`;
    obj.timesec = obj.timesec >= 10 ? obj.timesec : `0${obj.timesec}`;
    return { ...obj };
  } catch (error) {
    console.log(error);
    return {};
  }
};

const UTIL_CONSTANTS = {
  DATE_SPACE_DDMMMYYYY: 'DD MMM YYYY',
};
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
const formatDate = (date, format, isUTCTimeRequired) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { dd, mm, yyyy } =			convertZuluToSplitted(date, isUTCTimeRequired);
    const monthStr = monthNames[Number(mm)]
      ? monthNames[Number(mm)].slice(0, 3)
      : '';
    if (format === UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY) {
      return `${dd} ${monthStr} ${yyyy}`;
    }
    return date;
  } catch (error) {
    console.log('-date:::', error);
    return '';
  }
};

function dateDiffToString(a, b, isTimeTwoDigit) {
  // make checks to make sure a and b are not null
  // and that they are date | integers types
  try {
    let diff = Math.abs(new Date(a) - new Date(b));

    let ms = diff % 1000;
    diff = (diff - ms) / 1000;
    let ss = diff % 60;
    diff = (diff - ss) / 60;
    let mm = diff % 60;
    diff = (diff - mm) / 60;
    let hh = diff % 24;
    let dayDiff = (diff - hh) / 24;

    if (isTimeTwoDigit) {
      dayDiff = dayDiff >= 10 ? dayDiff : `0${dayDiff}`;
      hh = hh >= 10 ? hh : `0${hh}`;
      mm = mm >= 10 ? mm : `0${mm}`;
      ss = ss >= 10 ? ss : `0${ss}`;
      ms = ms >= 10 ? ms : `0${ms}`;
    }

    return { dayDiff, hh, mm, ss, ms };
  } catch (e) {
    console.log(e);
    return {};
  }
}
export { formatDate, convertZuluToSplitted, UTIL_CONSTANTS, dateDiffToString };
