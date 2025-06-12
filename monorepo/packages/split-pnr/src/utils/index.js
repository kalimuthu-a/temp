import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import CONSTANTS, {
  BROWSER_STORAGE_KEYS,
  GENDER,
  LOYALTY_PAX_TYPES,
  PASSENGER_TYPE,
  PASSENGER_TYPE_MAPPING,
  PNR_TYPE,
  SALUTATION_ADULT,
  UTIL_CONSTANTS,
  MONTH_NAMES as monthNames,
  DAYS as days,
} from '../constants';

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_split_pnr';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    return defaultObj;
  }
};
export const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    return '';
  }
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
      yy: (
        (isUtcRequired ? dateOut.getUTCFullYear() : dateOut.getFullYear()) % 100
      )
        ?.toString()
        ?.padStart(2, '0'),
    };
    obj.dd = obj.dd >= 10 ? obj.dd : `0${obj.dd}`;
    obj.mm = obj.mm >= 10 ? obj.mm : `0${obj.mm}`;
    obj.timehh = obj.timehh >= 10 ? obj.timehh : `0${obj.timehh}`;
    obj.timemm = obj.timemm >= 10 ? obj.timemm : `0${obj.timemm}`;
    obj.timesec = obj.timesec >= 10 ? obj.timesec : `0${obj.timesec}`;
    return { ...obj };
  } catch (error) {
    return {};
  }
};

export const formatDate = (date, format, isUTCTimeRequired) => {
  try {
    const { dd, mm, yyyy, yy, timehh, timemm, day, timesec } = convertZuluToSplitted(date, isUTCTimeRequired);
    const monthStr = monthNames[Number(mm)]
      ? monthNames[Number(mm)].slice(0, 3)
      : '';
    const monthNumber = String(Number(mm) + 1).padStart(2, '0');
    const dayStr = days[Number(day)] ? days[Number(day)].slice(0, 3) : '';
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
      default:
        return date;
    }
  } catch (error) {
    return '';
  }
};

export const getSalutationLabel = (code) => {
  if (!code) return '';

  const { label } = SALUTATION_ADULT.find((i) => i.value === code) || {};

  return label || code;
};

export const getPassengerType = (passengerTypeCode) => PASSENGER_TYPE_MAPPING[passengerTypeCode] || null;

export const getGender = (gender) => (gender && (gender !== 1 ? GENDER.FEMALE : GENDER.MALE)) || null;

export const getAge = (dob) => {
  if (!dob) return null;

  try {
    const toDate = new Date();
    const fromDate = new Date(dob);

    const year = [toDate.getFullYear(), fromDate.getFullYear()];
    let yearDiff = year[0] - year[1];
    const month = [toDate.getMonth(), fromDate.getMonth()];
    const monthDiff = month[0] - month[1];
    const _days = [toDate.getDate(), fromDate.getDate()];
    const daysDiff = _days[0] - _days[1];

    if (monthDiff < 0 || (monthDiff === 0 && daysDiff < 0)) {
      // eslint-disable-next-line no-plusplus
      yearDiff--;
    }

    return `${yearDiff} years`;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('log:::Error::getAge--', e);
    return 'Error calculating age';
  }
};

// check nominee from passenger list
export const checkPassengerIsNotNominee = (passengerData) => {
  if (!passengerData) return false;

  try {
    const isNomineeOrSelf = passengerData?.travelDocuments?.[0]?.number
      ?.split?.('|')?.[0]
      ?.toUpperCase?.()
      ?.trim?.();
    // eslint-disable-next-line max-len
    return !LOYALTY_PAX_TYPES.includes(isNomineeOrSelf);
  } catch (error) {
    return false;
  }
};

export const getJourneyDetail = (journeysDetail) => journeysDetail?.reduce?.(
  (acc, item, i) => {
    const { departure, origin, destination } = item?.journeydetail || {};
    const formattedFlightDateList = formatDate(departure, UTIL_CONSTANTS.DATE_SPACE_DDMMMMYYYY);
    const sectorList = { origin, destination, key: i };

    acc[0].push(formattedFlightDateList);
    acc[1].push(sectorList);
    return acc;
  },
  [[], []], // Initial accumulator with two empty arrays
);

// Split pnr passengers in component required format
export const getSplitPnrPassengers = (passengers) => {
  if (!passengers) return [];

  return passengers?.reduce?.((acc, val) => {
    const {
      name,
      info,
      passengerKey,
      eTicketNumber,
      passengerTypeCode,
      infant,
    } = val || {};
    const { title, first, last } = name || {};
    const { gender, dateOfBirth } = info || {};

    if (!first || !last) return acc;

    const passengerInfo = [
      getPassengerType(passengerTypeCode),
      getGender(gender),
      getAge(dateOfBirth),
    ]?.filter?.((el) => !!el);

    const formattedPassenger = {
      name,
      passengerKey,
      eTicketNumber,
      ...(name && {
        passengerName: `${getSalutationLabel(title)} ${first} ${last}`,
        passengerChars: `${first?.charAt?.(0)}${last?.charAt?.(0)}`,
      }),
      passengerInfo,
      ...(infant?.name && {
        infant: `${infant.name.first} ${infant.name.last}`,
      }),
      isCheckBox: val?.passengerTypeCode !== PASSENGER_TYPE.CHD,
    };

    if (val?.passengerTypeCode === PASSENGER_TYPE.CHD) {
      acc[1].unshift(formattedPassenger);
    } else {
      acc[0].push(formattedPassenger);
      acc[1].push(formattedPassenger);
    }

    return acc;
  }, [[], []]);
};

export const renderBookingStatus = (bookingStatus) => {
  const { BOOKING_STATUS, BOOKING_STATUS_LABEL } = CONSTANTS;
  let className = '';
  let label = '';
  let iconClassName = '';
  switch (bookingStatus) {
    case BOOKING_STATUS.CONFIRMED:
    case BOOKING_STATUS.NEEDS_PAYMENT:
      label = BOOKING_STATUS_LABEL.CONFIRMED;
      className = 'confirmed bg-green';
      iconClassName = 'icon-check text-forest-green';
      break;
    case BOOKING_STATUS.HOLD:
      label = BOOKING_STATUS_LABEL.HOLD;
      // eslint-disable-next-line sonarjs/no-duplicate-string
      className = 'holdcancelled bg-red';
      break;
    case BOOKING_STATUS.IN_PROGRESS:
      label = BOOKING_STATUS_LABEL.IN_PROGRESS;
      className = 'inprogress bg-orange';
      break;
    case BOOKING_STATUS.HOLD_CANCELLED:
      label = BOOKING_STATUS_LABEL.HOLD_CANCELLED;
      className = 'holdcancelled bg-red';
      break;
    case BOOKING_STATUS.CANCELLED:
    case BOOKING_STATUS.CLOSED:
      label = BOOKING_STATUS_LABEL.CANCELLED;
      className = 'holdcancelled bg-red';
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
    default:
      // eslint-disable-next-line no-undef
      label = bookingStatus;
      className = 'inprogress bg-orange';
      break;
  }
  return [label, className, iconClassName];
};

/**
 * @param pnr:string,
 * @param key:number,
 * @returns string // PNR
 */
export const createPNR = ({ pnr = '', number = '' }, string = '') => {
  return `${string} ${number}: <span class='text-green'>${pnr}</span>`;
};

/**
 * Find Trip type for analyitic
 * @param journeyList:array,
 */
export const findTripType = (journeyList = []) => {
  if (journeyList?.length === 0) {
    return '';
  }
  let tripType = '';
  if (journeyList?.length === 2
    && journeyList[0]?.journeydetail?.destination === journeyList[1]?.journeydetail?.origin) {
    tripType = PNR_TYPE.ROUND_TRIP;
  } else if (journeyList?.length === 1) {
    tripType = PNR_TYPE.ONE_WAY;
  } else {
    tripType = PNR_TYPE.MULTY_CITY;
  }
  return tripType;
};

/**
 * Find pax count for analyitic
 * @param passengers:array,
 * @param paxType:string,
 */
export const individualPaxCount = (passengers, paxType) => {
  const paxTypes = {
    adult: { passengerTypeCode: PASSENGER_TYPE.ADT, discountCode: null },
    children: { passengerTypeCode: PASSENGER_TYPE.CHD, discountCode: null },
    seniorCitizen: { passengerTypeCode: PASSENGER_TYPE.ADT, discountCode: 'SRCT' },
    infant: { passengerTypeCode: PASSENGER_TYPE.INFT, discountCode: null },
  };

  return passengers?.filter((pax) => pax?.passengerTypeCode === paxTypes[paxType]?.passengerTypeCode
    && pax?.discountCode === paxTypes[paxType].discountCode).length;
};

/**
 * Find date until departure for analyitic
 * @param passengers:array,
 * @param paxType:string,
 */
export const daysUntilDepartureFn = (journeyList) => {
  let datDiff = '';
  journeyList?.forEach((journey, index) => {
    const { segments = [] } = journey || {};
    segments?.forEach((segment, segmentIndex) => {
      const { segmentDetails } = segment || {};
      const today = new Date();
      const departureDateStr = segmentDetails?.departure?.split('T')?.[0];
      const departureDate = departureDateStr
        ? new Date(departureDateStr)
        : null; // Create a Date object, or null if invalid

      if (departureDate) {
        const differenceInTime = departureDate.getTime() - today.getTime();
        const differenceInDays = Math.round(
          differenceInTime / (1000 * 3600 * 24),
        );
        datDiff += differenceInDays;
        if (segmentIndex < segments.length - 1) datDiff += '~';
      }
    });
    if (index < journeyList.length - 1) datDiff += '|';
  });
  return datDiff;
};

/**
 * Find booking channel from channelType
 * @param type:number
 */
export const getBookingChannel = (type) => {
  const bookingChannel = {
    0: 'Default',
    1: 'Direct',
    2: 'Web',
    3: 'Gds',
    4: 'Api',
    5: 'DigitalApi',
    6: 'DigitalWeb',
    7: 'Ndc',
  };
  return bookingChannel[type] ?? '';
};

export const analyiticProductInfo = (response) => {
  const { journeysDetail = [], bookingDetails = {}, passengers = [] } = response;
  let departureDate = '';
  let sector = '';
  let bookingChannel = '';
  // trip type
  const tripType = findTripType(journeysDetail);

  journeysDetail?.forEach((journey) => {
    // generate departureDate
    const prefix = departureDate ? '|' : '';
    departureDate += `${prefix}${formatDate(journey?.journeydetail?.departure, 'DD-MM-YYYY')}`;

    // generate sector
    const deptCity = journey?.journeydetail?.origin;
    const destCity = journey?.journeydetail?.destination;
    sector += `${sector ? '|' : ''}${deptCity}-${destCity}`;

    // extract booking Channel
    const { segments = [] } = journey || {};
    const bookingChannelArr = Array.isArray(segments)
      ? segments?.map((segment) => segment?.segmentDetails?.channelType || [])
      : [];
    bookingChannel = getBookingChannel(bookingChannelArr?.[0]);
  });

  // split fare
  const specialFare = bookingDetails?.specialFareCode ? String(bookingDetails?.specialFareCode) : '';

  // adult count
  const adultCount = passengers?.length > 0
    ? individualPaxCount(passengers, 'adult')
    : 0;

  // senior citizen count
  const seniorCitizenCount = passengers?.length > 0
    ? individualPaxCount(passengers, 'seniorCitizen')
    : 0;

  // children count
  const childrenCount = passengers?.length > 0
    ? individualPaxCount(passengers, 'children')
    : 0;

  // infant count
  const infantCount = passengers?.length > 0
    ? individualPaxCount(passengers, 'infant')
    : 0;

  // total
  const totalCount = adultCount + seniorCitizenCount + childrenCount;

  // days until departure
  const daysUntilDeparture = daysUntilDepartureFn(journeysDetail);

  // pnr
  const pnr = bookingDetails?.recordLocator;

  return {
    tripType,
    departureDate,
    specialFare,
    totalCount: totalCount?.toString(),
    adultCount: adultCount?.toString(),
    childrenCount: childrenCount?.toString(),
    infantCount: infantCount?.toString(),
    seniorCitizenCount: seniorCitizenCount?.toString(),
    daysUntilDeparture: daysUntilDeparture?.toString(),
    sector,
    pnr,
    bookingChannel,
  };
};

export const combineArrayToObject = (arr) => {
  const keysToExclude = new Set(['tripType', 'departureDate', 'daysUntilDeparture', 'sector', 'bookingChannel']);

  return arr?.reduce((acc, curr) => {
    Object.keys(curr)?.forEach((key) => {
      const seprator = key === 'pnr' ? '|' : ',';
      if (keysToExclude.has(key)) {
        // For excluded keys, assign the value from the first object encountered
        if (!(key in acc)) {
          acc[key] = curr[key];
        }
      } else {
        // For other keys, merge values, handle numeric values separately
        acc[key] = acc[key] ? `${acc[key]}${seprator}${curr[key]}` : curr[key];
      }
    });
    return acc;
  }, {});
};
