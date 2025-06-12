import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { getPageLoadTime } from 'skyplus-design-system-app/dist/des-system/utils';
import capitalize from 'lodash/capitalize';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import LocalStorage from '../utils/LocalStorage';
import { FLIGHT_TYPE, GTM_ANALTYTICS, JOURNEY_TYPE, TripTypes } from '../constants/analytic';
import { getPaxDetailsforGTM } from './utils';
import { CONSTANTS, paxCodes } from '../constants';
// Old Code:
// import { decryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';

const { MULTI_CITY, ROUND_TRIP, ONE_WAY } = JOURNEY_TYPE;

/**
 * findTripType - Get the trip type from journey array
 * @param {Object} journeyList
 * @returns - tripType one_way|round_trip|multi_city
 */
export const findTripType = (journeyList) => {
  let tripType = '';
  if (
    journeyList?.length === 2 &&
    journeyList[0]?.journeydetail?.destination ===
      journeyList[1]?.journeydetail?.origin
  ) {
    tripType = ROUND_TRIP;
  } else if (journeyList?.length === 1) {
    tripType = ONE_WAY;
  } else {
    tripType = MULTI_CITY;
  }
  return tripType;
};

const getFlightOption = (journeyData) => {
  let flightOption = '';
  journeyData.journeysDetail.forEach((jDetail, index) => {
    const { flightType } = jDetail || {};
    if (flightType.toUpperCase() === FLIGHT_TYPE.CONNECT) {
      flightOption += 'Connect';
    } else if (flightType.toUpperCase() === FLIGHT_TYPE.NONSTOP) {
      flightOption += 'NonStop';
    } else if (flightOption.toUpperCase() === FLIGHT_TYPE.THROUGH) {
      flightOption += 'Layover';
    }

    if (index < journeyData.journeysDetail.length - 1) flightOption += '|';
  });
  return flightOption;
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
export const pushDataLayerWrapper = ({ ...obj }) => {
  const { data, isModifyFlow } = obj;
  const { event } = obj;
  const {
    analyticsData,
    currency_code,
    isMobile,
    originDest,
    departureDates,
    daysUntilDeparture,
    flightTime,
    flightNumber,
  } = data || {};
  const journeyData = LocalStorage.getAsJson('journeyReview', null);
  const bwCntxtVal = LocalStorage.getAsJson('bw_cntxt_val', null);
  const clarityId = Cookies.get('_clck');

  const isCheckinFlow = window.pageType === CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN;

  const {
    seatWiseSelectedPaxInformation,
    selectedDestinationCityInfo,
    selectedSourceCityInfo,
    selectedPromoInfo,
    selectedSpecialFare,
    selectedJourneyType,
    selectedMultiCityInfo,
  } = bwCntxtVal || {};

  if (!bwCntxtVal && !journeyData) return;
  let paxDetails = '';
  if (seatWiseSelectedPaxInformation) {
    paxDetails = getPaxDetailsforGTM(seatWiseSelectedPaxInformation);
  } else {
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
  let authUser = getCookieValue('auth_user');
  // TD: update when clarity_id is used
  // const clarity_id = getCookieValue('_clck');
  try {
    authUser = decryptAESForLogin(authUser);
    authUser = authUser && JSON.parse(authUser);
  } catch (e) {
    authUser = getCookieValue('auth_user');
  }
  let personasType = getCookieValue('role_details');
  personasType = personasType && JSON.parse(personasType);

  if (!journeyData && event === 'dynx_rmkt') return false;

  const tripType = findTripType(journeyData?.journeysDetail);
  const origin =
    journeyData?.journeysDetail[0]?.journeydetail?.originCityName || '';
  const originId = journeyData?.journeysDetail[0]?.journeydetail?.origin || '';
  let destination =
    journeyData?.journeysDetail[0]?.journeydetail?.destinationCityName || '';
  let destinationId =
    journeyData?.journeysDetail[0]?.journeydetail?.destination || '';
  const finalAmount = journeyData?.priceBreakdown?.totalAmount || '';

  if (tripType === MULTI_CITY) {
    destination = journeyData
      ? [...journeyData?.journeysDetail]?.pop()?.journeydetail
        ?.destinationCityName
      : '';
    destinationId = journeyData
      ? [...journeyData?.journeysDetail]?.pop()?.journeydetail?.destination
      : '';
  }

  const { journeysDetail } = journeyData || {};
  let addonsCategory = [];
  let addOnsCount = '';

  const journeyDetailedData = {};
  if (event === 'addons_details' && analyticsData) {
    if (journeysDetail?.length) {
      const analyticsDataArray = Object.values(analyticsData);

      journeysDetail.forEach((jDetail, index) => {
        const { journeyKey } = jDetail || {};
        analyticsDataArray.forEach((analyticsDataObject) => {
          const { ssr } = analyticsDataObject || {};
          if (ssr.journeyKey === journeyKey) {
            if (!journeyDetailedData[index]) {
              // journeyDetailedData[journeyKey] = [ssr.addonName]
              journeyDetailedData[index] = [ssr.addonName];
            } else {
              journeyDetailedData[index].push(ssr.addonName);
              // journeyDetailedData[journeyKey].push(ssr.addonName);
            }
          }
        });
      });
    }
    if (journeyDetailedData) {
      addonsCategory = Object.values(journeyDetailedData).reduce((obj, journeyData) => {
        addOnsCount += `${journeyData.length}|`;
        return `${obj}${obj.length ? '|' : ''}${journeyData.join(',')}`;
      }, '');
      addOnsCount = addOnsCount.slice(0, -1);
    }
  }

  /* TD: old code
  const addOnsCount = addonsCategory?.length || 0;
  let addonsSelected = '';
  if (event === 'addons_details' && analyticsData) {
    for (const iterator of Object.values(analyticsData)) {
      const { ssr } = iterator;
      addonsCategory.push(ssr?.addonName);
    }
    addonsSelected = [...addonsCategory].join(',') || '';
  } */

  let flightSector = '';
  if (bwCntxtVal) {
    if ((selectedJourneyType && selectedJourneyType.journeyTypeCode === JOURNEY_TYPE.MULTI_CITY)) {
      selectedMultiCityInfo.forEach((cityInfo, index) => {
        const { destinationCity, from } = cityInfo || {};
        const isInternational = from.isInternational || destinationCity.isInternational;
        flightSector += isInternational ? TripTypes.international : TripTypes.domestic;

        if (index < selectedMultiCityInfo.length - 1) flightSector += '|';
      });
    } else {
      const isInternational = selectedSourceCityInfo.isInternational ||
      selectedDestinationCityInfo.isInternational;
      flightSector = isInternational ? TripTypes.international : TripTypes.domestic;
    }
  } else {
    journeyData?.journeysDetail?.forEach((journey, index) => {
      journey?.segments?.forEach((segment) => {
        flightSector = segment?.international ? TripTypes.international : TripTypes.domestic;
        if (index < journeyData?.journeysDetail?.length - 1 && journeyData?.journeysDetail?.length > 1) flightSector += '|';
      });
    });
  }
  const flightOption = getFlightOption(journeyData);

  let gtmProps = {};

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
    case 'addons_details':
      gtmProps = {
        event,
        journey_flow: isCheckinFlow ?
          'WebCheckIn Flow' : isModifyFlow ?
            'Modification Flow' : 'Booking Flow',
        user_type: personasType?.roleName || 'Anonymous',
        // personasType && authUser?.customerNumber
        //   ? capitalize(personasType?.roleName)
        //   : 'Anonymous', // user type member, anonymous, agent
        page_name: 'Addons Details', // Page Name
        addons_selected: addOnsCount, // if user select any addons and count should be increased when there is 2 addons or 0 if user does not select any addons
        addons_category: addonsCategory, // Category of Addons like 6E Eats, Delayed and Lost Baggage Protection
        addon_details: '1', // Always set this one when event push to data layer
        trip_type: tripType,
        // addons_labeled: '', // TD: - Recommended, Label, Popular, this will be from target team.
        site_section: isCheckinFlow ? 'WebCheckIn Page' : 'Booking Page',
        line_of_business: 'Flight',
        add_amenities: '0', // TD: - this checkbox functionality not implemented yet.
      };
      break;

    case 'page-load':
      gtmProps = {
        journey_flow: isCheckinFlow ?
          'WebCheckIn Flow' : isModifyFlow ?
            'Modification Flow' : 'Booking Flow',
        currency_code,
        page_name: 'Addons Details',
        previous_page: 'Passenger Details',
        platform: isMobile ? 'Mweb' : 'Web',
        OD: originDest,
        trip_type: tripType,
        pax_details: paxDetails,
        departure_date: departureDates,
        flight_sector: flightSector,
        coupon_code:
          selectedPromoInfo?.card || selectedPromoInfo?.code || selectedPromoInfo || journeyData?.bookingDetails?.promoCode,
        special_fare: selectedSpecialFare?.specialFareLabel || journeyData?.bookingDetails?.specialFareCode || '',
        days_until_departure: daysUntilDeparture || 0,
        flight_number: flightNumber,
        flight_list: tripType === ROUND_TRIP ? 'Departing|Returning' : 'Departing', // departing or returning
        flight_brand: 'INDIGO 6E',
        flight_option: flightOption, // TD: 'connecting', 'direct', 'layover'
        flight_time: flightTime,
        line_of_business: 'Flight',
        site_section: isCheckinFlow ? 'WebCheckIn Page' : 'Booking Page',
        page_load_time: getPageLoadTime(),
        clarity_id: clarityId,

        // TD: - not required as of now
        // user_role_code: 'WWWA',
        // user_type:
        //   personasType && authUser?.customerNumber
        //     ? personasType?.roleName
        //     : 'anonymous',
        // page_load_time:
        //   (window.performance.timing.domContentLoadedEventEnd -
        //     window.performance.timing.navigationStart) /
        //     1000 || 0, // Page Load Time
        // user_id: '',
      };
      break;

    case 'addons_details_checkIn':
      gtmProps = {
        event: 'addons_details_checkIn',
        journey_flow: 'WebCheckIn Flow',
        page_name: 'Addons CheckIn',
        FF_Number: '',
        addons_selected: addOnsCount,
        addons_category: addonsCategory,
        addon_details: '1',
        OD: originDest,
        trip_type: tripType,
        pax_details: paxDetails,
        departure_date: departureDates,
        special_fare: selectedSpecialFare?.specialFareLabel || journeyData?.bookingDetails?.specialFareCode || '',
        flight_sector: flightSector,
        flight_type: 'Departing',
        coupon_code: selectedPromoInfo?.card || selectedPromoInfo?.code || selectedPromoInfo || journeyData?.bookingDetails?.promoCode,
        days_until_departure: daysUntilDeparture || 0,
        member_id: '',
        site_section: 'WebCheckIn Page',
        line_of_business: 'Flight',
        Dd_session_id: '',
        booking_purpose: '',
        projectName: 'UX-Revamp',
      };
      break;

    case GTM_ANALTYTICS.EVENTS.API_RESPONSE:
      gtmProps = {
        ...data,
        event,
        platform: isMobile ? 'Mweb' : 'Web',
        line_of_business: 'Flight',
        clarity_id: clarityId,
      };
      break;

    case GTM_ANALTYTICS.EVENTS.ERROR:
      gtmProps = {
        ...data,
        event,
        platform: isMobile ? 'Mweb' : 'Web',
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
};

export const pushDataLayer = ({ ...obj }) => {
  try {
    pushDataLayerWrapper(obj);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

// TD: bw_cntxt_val
