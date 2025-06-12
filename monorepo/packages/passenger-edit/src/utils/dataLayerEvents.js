/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable sonarjs/cognitive-complexity */
import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import uniq from 'lodash/uniq';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import moment from 'moment';
import LocalStorage from './LocalStorage';
import { GTM_CONSTANTS } from '../constants';
import getPreviousPage from './getPreviousPage';
import getDeviceBreakPoint from './getDeviceBreakPoint';
import { getPageNameFromUrl } from '../helpers';
import { daysUntilDate, getTimeFromString } from '../functions/checkFutureOrValidDate';
import COOKIE_KEYS from '../constants/cookieKeys';

/**
 * gtmPushAnalytic - It holds the list of events and its details called from MFE
 * @param {object} param0 - contains state and event name
 */
export const pushDataLayerFunc = ({ ...obj }) => {
  const { event, data = {} } = obj;
  const journeyData = LocalStorage.getAsJson('journeyReview');
  const bookingContext = LocalStorage.getAsJson('bw_cntxt_val');
  const authUser = Cookies.get(COOKIE_KEYS.AUTH_USER, true, true) || '';
  const clarityId = Cookies.get(COOKIE_KEYS.CLARITY_ID, undefined, false) || '';
  const { seatWiseSelectedPaxInformation = {} } = bookingContext;
  const { adultCount, childrenCount, infantCount, seniorCitizenCount, totalCount } = seatWiseSelectedPaxInformation;
  let previousUrls = sessionStorage.getItem('prevUrls');
  previousUrls = previousUrls && JSON.parse(previousUrls);
  const getPathFromUrl = (url) => url?.split(/[?#]/)[0] || 'N/A';
  const dateFormatfromYMDtoDMY = (date) => {
    const dateParts = date.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };
  const formatDateString = (dateString) => {
    return moment(dateString).format('DD-MM-YYYY');
  };
  let OD = '';
  let flightType = '';
  let departureDate = '';
  let gtmProps = {};
  // let daysUntilDeparture = '';
  const tripType = bookingContext?.selectedJourneyType?.journeyTypeCode;
  const origin = bookingContext?.selectedSourceCityInfo?.fullName || '';
  const originId = bookingContext?.selectedSourceCityInfo?.cityCode || '';
  const destination = bookingContext?.selectedDestinationCityInfo?.fullName || '';
  const destinationId = bookingContext?.selectedDestinationCityInfo?.cityCode || '';
  const finalAmount = journeyData?.priceBreakdown?.totalAmount || '';
  const promoCodeList = journeyData?.journeysDetail?.map((item) => item?.promoCode).join('|');
  const promoCode = uniq(promoCodeList).join(' | ');

  const paxDetails = () => {
    const paxDetailsString = [totalCount]; // | ${seniorCitizenCount} SS |  ${adultCount} ADT | ${childrenCount} CHD | ${infantCount} INF`;
    if (seniorCitizenCount) paxDetailsString.push(`${seniorCitizenCount} SS`);
    if (adultCount) paxDetailsString.push(`${adultCount} ADT`);
    if (childrenCount) paxDetailsString.push(`${childrenCount} CHD`);
    if (infantCount) paxDetailsString.push(`${infantCount} INF`);
    return paxDetailsString.join(' | ');
  };

  const flightDetails = journeyData?.journeysDetail?.map((journey) => {
    return {
      days: journey?.segments?.map((segment) => {
        return daysUntilDate(segment?.designator?.departure);
      }).join('~'),
      flightTime: journey?.segments?.map((segment) => {
        return `${getTimeFromString(segment?.designator?.departure)}-${getTimeFromString(segment?.designator?.arrival)}`;
      }).join('~'),
    };
  });

  if (bookingContext?.selectedJourneyType?.value === TripTypes?.ROUND) {
    OD = `${originId}-${destinationId}|${destinationId}-${originId}`;
    flightType = bookingContext?.selectedDestinationCityInfo?.isInternational
      ? GTM_CONSTANTS.INTERNATIONAL : GTM_CONSTANTS.DOMESTIC;
    departureDate = bookingContext?.selectedMultiCityInfo?.map(({ departureDate }) => {
      return formatDateString(departureDate);
    }).join('|');
  } else if (bookingContext?.selectedJourneyType?.value === TripTypes?.MULTI_CITY) {
    OD = bookingContext?.selectedMultiCityInfo?.map((city) => {
      return `${city?.from?.cityCode}-${city?.to?.cityCode}`;
    }).join('|');
    flightType = bookingContext?.selectedMultiCityInfo?.map(({ sourceCity, destinationCity }) => {
      return sourceCity?.isInternational || destinationCity?.isInternational ? GTM_CONSTANTS.INTERNATIONAL : GTM_CONSTANTS.DOMESTIC;
    }).join('|');
    departureDate = bookingContext?.selectedMultiCityInfo?.map(({ departureDate }) => {
      return formatDateString(departureDate);
    }).join('|');
  } else {
    OD = `${originId}-${destinationId}`;
    flightType = bookingContext?.selectedDestinationCityInfo?.isInternational
      ? GTM_CONSTANTS.INTERNATIONAL : GTM_CONSTANTS.DOMESTIC;
    departureDate = dateFormatfromYMDtoDMY(bookingContext?.selectedTravelDatesInfo?.startDate);
  }

  if (!journeyData && (event === 'dynx_rmkt')) return false;
  switch (event) {
    case 'dynx_rmkt':
      gtmProps = {
        event,
        google_tag_param: {
          event: 'view_item',
          flight_destid: destinationId,
          flight_originid: originId,
          flight_pagetype: 'offerdetail',
          origin,
          destination,
          google_business_vertical: 'flights',
          value: finalAmount,
          aw_remarketing_only: true,
          conversion_linker: true,
          trip_type: tripType,
        },
      };
      break;
    case GTM_CONSTANTS.PAGELOAD:
      gtmProps = {
        // event: 'pageload',
        // interaction_type: GTM_CONSTANTS.PAGELOAD,
        currency_code: journeyData?.bookingDetails?.currencyCode, // currency code
        page_name: GTM_CONSTANTS.PAGENAME_PASSENGER_DETAILS, // current page name
        previous_page: previousUrls
          ? getPageNameFromUrl(getPathFromUrl(previousUrls[previousUrls.length - 2]))
          : getPreviousPage(), // previous page name
        platform: getDeviceBreakPoint(), // MWeb or Web
        page_load_time: data.responseTime, // Page Load Time
        OD, // IATA Code of origin and destination searches
        trip_type: tripType, // oneWay, RoundTrip, Multiway
        pax_details: paxDetails(),
        departure_date: departureDate, // Departure Dates
        special_fare: data?.specialFareCode || '', // Special Fares
        flight_sector: flightType, // Flight search type
        coupon_code: promoCode, // promo code
        days_until_departure: flightDetails?.map((item) => item.days).join('|') || '', // how many days until departure
        // flight_number: '6E 2276', // Flight Number
        flight_brand: 'INDIGO 6E', // Flight Brand
        // flight_list: 'Departing', // Departing or Returning
        // flight_option: ' Connecting, Direct, Layover', // user is selecting which option
        flight_time: flightDetails?.map((item) => item.flightTime).join('|') || '', // flight time what user is selecting
      };
      break;
    case GTM_CONSTANTS.NEXT:
      gtmProps = {
        event: GTM_CONSTANTS.GOOGLE_ANALYTIC_EVENT_PASSENGER_DETAILS,
        journey_flow: data.journeyFlow ? 'Modification Flow' : 'Booking Flow', // Booking Flow, Modification Flow, Web Check-In Flow
        page_name: GTM_CONSTANTS.PAGENAME_PASSENGER_DETAILS, // Page Name
        saved_list: String(data.savedpassengers?.length || 0), // if user select pax infot pax info from saved Booking list
        passenger_details: '1', // Always set this one when event push to data layer
      };
      break;
    case GTM_CONSTANTS.SIGN_IN_NOW:
      gtmProps = {
        event: 'link_click',
        click_text: 'Sign In Now',
        page_name: GTM_CONSTANTS.PASSENGER_DETAILS,
        site_section: 'Booking Page',
        line_of_business: GTM_CONSTANTS.FLIGHTS,
        user_role_code: GTM_CONSTANTS.WWWA,
        user_type: GTM_CONSTANTS.MEMBER,
      };
      break;
    case GTM_CONSTANTS.PAX_INFO:
      gtmProps = {
        ...data,
      };
      break;
    default:
      break;
  }

  const peCommonData = {
    journey_flow: data.journeyFlow, // Booking Flow, Modification Flow, Check-In Flow
    user_id: authUser?.customerNumberEncryptedForAnalytics || '', // when a user login into the website
    site_section: 'Booking Page', // Home Pages
    line_of_business: 'Flight', // Line of the business
    clarity_id: clarityId, // Taking this id from cookie name (_clck)
    projectName: 'UX-Revamp',
  };

  gtmProps = {
    ...peCommonData,
    ...gtmProps,
  };

  gtmAnalytic({
    gtmProps,
    useOnlyGtmProps: true,
  });
};
export const pushDataLayer = (obj) => {
  try {
    pushDataLayerFunc(obj);
  } catch (error) {
    console.log('---pushDataLayer--error', error);
  }
};
