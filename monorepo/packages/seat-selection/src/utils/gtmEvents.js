import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { getPageLoadTime } from 'skyplus-design-system-app/dist/des-system/analyticsHelper';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';

import LocalStorage from './LocalStorage';
import SeatSelectModel from '../components/models/SeatSelectModel';

import { JOURNEY_TYPE } from '../constants/analytics';
import { CONSTANTS, dateFormats } from '../constants';
import { getFlightNumber, getFlightSectors, getRecommendedSeats, getSeatTypes, getSelectedSeats } from '.';

const { MULTI_CITY, ROUND_TRIP, ONE_WAY } = JOURNEY_TYPE;

/**
 * findTripType - Get the trip type from journey array
 * @param {Object} journeyList
 * @returns - tripType one_way|round_trip|multi_city
 */
export const findTripType = (value) => {
  let tripType = '';
  if (value.toLowerCase() === 'multicity') {
    tripType = MULTI_CITY;
  } else if (value.toLowerCase() === 'roundtrip') {
    tripType = ROUND_TRIP;
  } else tripType = ONE_WAY;

  return tripType;
};

/**
 * getCookieValue - get cookie value from the name
 * @param {string} name - cookie name
 * @returns
 */
const getCookieValue = (name) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || '';

/**
 * gtmPushAnalytic - It holds the list of events and its details called from MFE
 * @param {object} param0 - contains state and event name
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const gtmPushAnalyticWrapper = (obj) => {
  let gtmProps = {};
  const { data } = obj;
  const { event } = obj;
  const clarityId = getCookieValue('_clck');
  const {
    journeysDetail = [],
    isModifyFlow,
    response,
    originTime,
    productDetails = {},
    isRecommendedSeat = {},
    category,
    journeySeatData = [],
  } = data;

  const isWebCheckInFlow = window.pageType === 'add-on-seat-selection-checkin';

  if (isWebCheckInFlow && event === 'pageload') {
    return;
  }

  const journeyData = LocalStorage.getAsJson('journeyReview', null);
  const bw = LocalStorage.getAsJson('bw_cntxt_val', null);
  const _event = isModifyFlow ? 'seat_modification' : 'seat_selection';

  if (!bw && !journeyData) return false;
  if (!journeyData && event === 'dynx_rmkt') return false;
  const departureDates = [];
  const daysUntilDeparture = [];
  let flightList = [];
  const sectors = [];
  const flightTime = [];
  const flightLabelArray = [];

  let flightOption = '';

  for (const journey of journeysDetail) {
    flightOption += `${flightOption ? '|' : ''}${journey?.flightType}`;
  }
  let tripType = '';
  let seatSelectAnalyticsContext = {};
  let journies = {};
  let flightSector = '';
  let paxDetails = {};
  if (bw) {
    seatSelectAnalyticsContext = new SeatSelectModel(bw);
    journies = seatSelectAnalyticsContext.getJournies();
    flightSector = getFlightSectors({ journies });
    tripType = findTripType(seatSelectAnalyticsContext.selectedJourneyType.value);
    paxDetails = seatSelectAnalyticsContext.getPaxDetailsforGTM();
  } else {
    tripType = findTripType(journeyData?.bookingDetails?.pnrType);
    journeyData?.journeysDetail?.forEach((journey, index) => {
      journey?.segments?.forEach((segment) => {
        flightSector = segment?.international ? 'International' : 'Domestic';
        if (index < journeyData?.journeysDetail?.length - 1 && journeyData?.journeysDetail?.length > 1) flightSector += '|';
      });
    });
    let seniorCitizenCount = 0;
    let adultCount = 0;
    let childrenCount = 0;
    let infantCount = 0;
    let totalCount = 0;
    journeyData?.passengers?.forEach((pax) => {
      if (pax?.passengerTypeCode === paxCodes?.adult?.code && pax?.discountCode === paxCodes?.seniorCitizen?.discountCode) {
        seniorCitizenCount += 1;
      } else if (pax?.passengerTypeCode === paxCodes?.adult?.code) {
        adultCount += 1;
      } else if (pax?.passengerTypeCode === paxCodes?.children?.code) {
        childrenCount += 1;
      }
      totalCount += 1;
      if (pax?.infant) {
        infantCount += 1;
        totalCount += 1;
      }
    });
    const values = [totalCount];

    if (seniorCitizenCount > 0) {
      values.push(`${seniorCitizenCount} SS`);
    }
    if (adultCount > 0) {
      values.push(`${adultCount} ADT`);
    }
    if (childrenCount > 0) {
      values.push(`${childrenCount} CHD`);
    }
    if (infantCount > 0) {
      values.push(`${infantCount} INF`);
    }

    paxDetails = values.join('|');
  }
  journeysDetail.forEach((journey) => {
    const { flightType, segments, flightlabel } = journey;

    flightLabelArray.push(flightlabel);
    if (tripType === 'RoundTrip') {
      flightList = ['Departing', 'Returning'];
    } else {
      flightList.push(flightlabel);
    }

    if (flightType === 'NonStop') {
      segments?.forEach((segment) => {
        const { destination, origin, departure, arrival } = segment?.segmentDetails || {};
        daysUntilDeparture.push(differenceInCalendarDays(departure, new Date()));
        const time = `${format(departure, 'HH:mm')}-${format(arrival, 'HH:mm')}`;
        flightTime.push(time);
        departureDates.push(format(departure, dateFormats.ddMMYYYY));
        sectors.push(`${origin}-${destination}`);
      });
    }

    if (flightType === 'Connect') {
      const tempSectors = [];
      const tempDepartureDates = [];
      const tempFlightTime = [];
      const tempDaysUntilDeparture = [];
      segments?.forEach((segment) => {
        const { destination, origin, departure, arrival } = segment?.segmentDetails || {};
        tempSectors.push(`${origin}-${destination}`);
        const time = `${format(departure, 'HH:mm')}-${format(arrival, 'HH:mm')}`;
        tempFlightTime.push(time);
        tempDepartureDates.push(format(departure, dateFormats.ddMMYYYY));
        tempDaysUntilDeparture.push(differenceInCalendarDays(departure, new Date()));
      });
      daysUntilDeparture.push(tempDaysUntilDeparture.join('~'));
      flightTime.push(tempFlightTime.join('~'));
      departureDates.push(tempDepartureDates.join('~'));
      sectors.push(tempSectors.join('~'));
    }
  });

  let pageName = isModifyFlow
    ? 'Seat Selection Modification'
    : 'Seat Selection';

  let previousPage = isModifyFlow
    ? 'Addons Details Modification'
    : 'Addons Details';

  let siteSection = isModifyFlow ? 'Modification Page' : 'Booking Page';

  let journeyFlow = isModifyFlow ? 'Modification Flow' : 'Booking Flow';

  if (isWebCheckInFlow) {
    pageName = 'Seat Selection CheckIn ';
    previousPage = 'Addons Details CheckIn';
    journeyFlow = 'WebCheckIn Flow';
    siteSection = 'WebCheckIn Page';
  }

  const aemError = getErrorMsgForCode();

  switch (event) {
    case 'pageload':
      gtmProps = {
        journey_flow: journeyFlow,
        currency_code: seatSelectAnalyticsContext?.selectedCurrency?.value || journeyData?.bookingDetails?.currencyCode,
        page_name: pageName,
        previous_page: previousPage,
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
        page_load_time: getPageLoadTime(originTime),
        pax_details: paxDetails,
        OD: sectors.join('|'),
        departure_date: departureDates.join('|'),
        special_fare: seatSelectAnalyticsContext?.selectedSpecialFare?.specialFareLabel || journeyData?.bookingDetails?.specialFareCode || '',
        flight_sector: flightSector,
        coupon_code: seatSelectAnalyticsContext?.selectedPromoInfo || journeyData?.bookingDetails?.promoCode,
        flight_brand: 'INDIGO 6E',
        flight_number: getFlightNumber({ journeysDetail, productDetails }),
        flight_list: flightList.join('|'),
        flight_option: flightOption,
        days_until_departure: daysUntilDeparture.join('|'),
        flight_time: flightTime.join('|'),
        site_section: siteSection,
        line_of_business: 'Flight',
        trip_type: tripType,
        clarity_id: clarityId,
        event: _event,
      };
      break;
    case 'clickNext':
      gtmProps = {
        event: _event,
        journey_flow: journeyFlow,
        trip_type: tripType,
        page_name: pageName,
        previous_page: previousPage,
        site_section: siteSection,
        line_of_business: 'Flight',
        recommended_seat: getRecommendedSeats({ isRecommendedSeat, journeysDetail }),
        seat_type: getSeatTypes({ journeySeatData, category }),
        seat_number: getSelectedSeats({ productDetails, journeySeatData }),
        clarity_id: clarityId,
      };
      break;

    case 'seat_selection_checkIn':
      gtmProps = {
        event,
        journey_flow: 'WebCheckIn Flow',
        trip_type: tripType,
        page_name: pageName,
        previous_page: previousPage,
        site_section: 'WebCheckIn Page',
        line_of_business: 'Flight',
        recommended_seat: getRecommendedSeats({ isRecommendedSeat, journeysDetail }),
        seat_type: getSeatTypes({ journeySeatData, category }),
        seat_number: getSelectedSeats({ productDetails, journeySeatData }),
        clarity_id: clarityId,
        FF_Number: '',
        seat_selected: !!getSelectedSeats({ productDetails, journeySeatData }),
        seat_selection: '1',
        OD: sectors.join('|'),
        pax_details: paxDetails,
        departure_date: departureDates.join('|'),
        special_fare: seatSelectAnalyticsContext.selectedSpecialFare?.specialFareLabel || '',
        flight_sector: flightSector,
        flight_type: flightLabelArray.join('|'),
        coupon_code: seatSelectAnalyticsContext.selectedPromoInfo,
        days_until_departure: daysUntilDeparture.join('|'),
        member_id: '',
        Dd_session_id: '',
        booking_purpose: '',
        projectName: 'UX-Revamp',
      };
      break;

    case 'error':
      gtmProps = {
        event,
        error_message: response.responseData.Message, // error text
        error_code: response.statusCode,
        error_type: 'API',
        error_source: 'API',
        error_statusCode: aemError.code,
        error_statusMessage: aemError.message,
        error_displayMessage: aemError.message,
        api_url: response.url,
        page_name: pageName,
        previous_page: previousPage,
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
        error_shown: '1',
        site_section: siteSection,
        line_of_business: 'Flight',
        clarity_id: clarityId,
      };
      break;

    case 'api':
      gtmProps = {
        event: 'api response',
        api_code: 200,
        api_response: response.responseData,
        api_responsetime: response.responseTime,
        api_url: response.url,
        page_name: pageName,
        previous_page: previousPage,
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
        error_shown: '1',
        site_section: siteSection,
        line_of_business: 'Flight',
        clarity_id: clarityId,
      };
      break;

    default:
      break;
  }

  gtmAnalytic({
    gtmProps,
  });
  return null;
};

export const gtmPushAnalytic = (args) => {
  try {
    gtmPushAnalyticWrapper(args);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error in gtmPushAnalytic seat selection MF', error);
  }
};
