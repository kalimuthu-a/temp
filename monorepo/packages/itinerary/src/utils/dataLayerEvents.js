import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { decryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';
// eslint-disable-next-line import/no-extraneous-dependencies
import omit from 'lodash/omit';
// eslint-disable-next-line import/no-extraneous-dependencies
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { findTripType, getFlightType } from '../components/Passengers/dataConfig';
import { FLOW_TYPE, NOT_AVAILABLE, CLARITY_ID } from '../constants/analytic';
import { formatDate, individualPaxCount, dateDiffToString,
  convertZuluToSplitted, getQueryStringByParameterName } from '.';
import { CONSTANTS } from '../constants';
import { specialFaresList } from './specailFareLabel';
import { getSegmentBasedPassengerInfo } from '../components/Flight/dataConfig';
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

export const getPathFromUrl = (url) => {
  return url?.split(/[?#]/)[0] || NOT_AVAILABLE;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const pushDataLayerFunc = ({ ...obj }) => { // NOSONAR
  const { data, event, props } = obj;
  const {
    _event,
    pnrResponse,
  } = data;
  const {
    MODIFICATION_FLOW,
    BOOKING_FLOW,
  } = FLOW_TYPE;
  const {
    BROWSER_STORAGE_KEYS: {
      BOOKING_WIDGET_INFO,
      CONTACT_DETAILS_FROM_SRP,
      // eslint-disable-next-line no-unused-vars
      ...BROWSER_STORAGE_KEYS // NOSONAR
    },
    // SSR_CODE
  } = CONSTANTS;
  let authUser = getCookieValue(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER);
  try {
    authUser = decryptAESForLogin(authUser);
    authUser = authUser && JSON.parse(authUser);
  } catch (e) {
    authUser = getCookieValue(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER);
  }
  let personasType = getCookieValue(CONSTANTS.BROWSER_STORAGE_KEYS.ROLE_DETAILS);
  personasType = personasType && JSON.parse(personasType);
  // let previousUrls = sessionStorage.getItem('prevUrls');
  // previousUrls = previousUrls && JSON.parse(previousUrls);
  let sector = ''; let flightType = ''; let airportCodePair = '';
  let tripDuration = ''; let departureDate = '';
  let daysUntilDeparture = ''; let categoryFare = '';
  let selectedSSR = ''; let departureTime = ''; let seatSelected = false; let
    seatNumber = ''; let arrivalTime = ''; let connectedDepartureTime = '';
  let connectedArrivalTime = ''; let connectedFlightDeparture = '';
  let journeyDesignator; let trip = ''; let fnArr; let flightNumber = '';
  const departureTimeArr = []; const departureDateArr = [];
  let tripItas = '';
  const { priceBreakdown, bookingDetails, journeysDetail, passengers, fsConfig, gAContacts } = pnrResponse;
  const totalPrice = priceBreakdown?.totalAmount || '';
  const tax = (priceBreakdown?.taxAmountList)
    ? (priceBreakdown?.taxAmountList?.reduce((acc, obj) => acc + obj.value, 0)) : 0;// eslint-disable-line no-shadow
  const currencyCode = bookingDetails?.currencyCode || '';
  const promoCode = bookingDetails?.promoCode || '';
  const discount = priceBreakdown?.totalDiscount || '';
  const airfareCharges = priceBreakdown?.airfareCharges || '';
  const tripType = findTripType(journeysDetail) || '';
  const flowType = bookingDetails?.hasModification ? MODIFICATION_FLOW : BOOKING_FLOW;
  const paymentStatus = bookingDetails?.paymentStatus;
  const adultCount = (passengers?.length > 0) ? individualPaxCount(passengers, 'adult') : 0;
  const seniorCitizenCount = (passengers?.length > 0) ? individualPaxCount(passengers, 'seniorCitizen') : 0;
  const childrenCount = (passengers?.length > 0) ? individualPaxCount(passengers, 'children') : 0;
  const infantCount = (passengers?.length > 0) ? individualPaxCount(passengers, 'infant') : 0;
  const totalCount = adultCount + seniorCitizenCount + childrenCount;
  const { ExtraSeatTag } = passengers?.[0] || '';
  const { homePhone, emailAddress } = gAContacts?.[0] || {};
  // eslint-disable-next-line no-nested-ternary
  const specialSeat = ((ExtraSeatTag === CONSTANTS.PASSENGER_EXTRA_SEAT.DOUBLE_SEAT_DISCOUNT_CODE)
    ? CONSTANTS.PASSENGER_EXTRA_SEAT.EXTRASEATTAG_DOUBLE
    : ((ExtraSeatTag === CONSTANTS.PASSENGER_EXTRA_SEAT.TRIPLE_SEAT_DISCOUNT_CODE)
      ? CONSTANTS.PASSENGER_EXTRA_SEAT.EXTRASEATTAG_TRIPLE : ''));
  const journeys = (passengers?.length > 0) ? (passengers?.[0]?.seatsAndSsrs?.journeys) : [];
  const clarityId = getCookieValue(CLARITY_ID.ID);
  let seatType = '';
  let allSrrPrice = 0;
  const DD_MM_YYYY = 'DD-MM-YYYY';
  priceBreakdown?.ssrAmountlist.map((ssrData) => {
    allSrrPrice += Number(ssrData?.value);
    return allSrrPrice;
  });
  const isSectorInternational = (journeysDetail?.map(
    (journey) => {
      return journey?.segments?.map((seg) => seg?.international === true).includes(true);
    },
  ))?.includes(true) || false;
  const getSeatsList = (pItem) => {
    return pItem?.matchedJourney?.matchedSegment?.seats?.map((sItem) => sItem.unitDesignator).toString();
  };

  const daysUntilDepartureFn = () => {
    let daysUntilDepartureArr = [];
    journeysDetail?.map((journeysData) => {
      const journeyDepartureTime = new Date(journeysData?.segments[0]?.segmentDetails?.departure).getTime();
      const departureDates = journeysData?.segments[0]?.segmentDetails?.departure;
      const currentTime = new Date().getTime();
      if (journeyDepartureTime > currentTime) {
        daysUntilDepartureArr.push(differenceInCalendarDays(departureDates, new Date()));
      } else {
        daysUntilDepartureArr.push(0);
      }
      return null;
    });
    daysUntilDepartureArr = daysUntilDepartureArr?.length > 1
      ? daysUntilDepartureArr?.join(' | ') : daysUntilDepartureArr?.[0];
    return daysUntilDepartureArr;
  };

  const getSeatNumberInJourney = () => {
    let allSeats = '';
    const journeySeatArr = [];
    if (journeysDetail?.length > 0) {
      // eslint-disable-next-line no-unused-vars
      const newSeatJounrey = journeysDetail?.map((journeysData) => {
        const { segments } = journeysData || {};
        let journeySeats = '';
        // eslint-disable-next-line no-unused-vars,
        const segmentsSeatNumber = segments?.map((segs, segIndex) => {
          if (segments?.length > 0) {
            const paxInfo = getSegmentBasedPassengerInfo(passengers, segs?.segmentKey);
            let setmentSeat = '';
            if (paxInfo?.length > 0) {
              // eslint-disable-next-line no-unused-vars
              const passengersInfo = paxInfo?.map((pax, paxIndex) => {
                const seatList = getSeatsList(pax);
                if (paxIndex === (Number(paxInfo?.length) - 1)) {
                  setmentSeat = (Number(segments?.length) > 1)
                  && (segIndex !== (Number(segments?.length) - 1)) ? `${seatList}~` : `${seatList}`;
                } else {
                  setmentSeat += `${seatList},`;
                }
                journeySeats += setmentSeat;
                return journeySeats;
              })?.[Number(paxInfo?.length) - 1];
            }
            allSeats = journeySeats;
            return allSeats;
          }
        })?.[Number(segments?.length) - 1];

        journeySeatArr.push(allSeats);
      })?.[Number(journeysDetail?.length) - 1];
    }
    return journeySeatArr?.length > 1 ? journeySeatArr?.join(' | ') : journeySeatArr[0];
  };

  const getFlightTimeInJourney = () => {
    let allFlightTime = '';
    const journeyTimeArr = [];
    if (journeysDetail?.length > 0) {
      // eslint-disable-next-line no-unused-vars
      const newJounrArr = journeysDetail?.map((journeysData, jIndex) => {
        const { segments } = journeysData || {};
        if (segments?.length > 1) {
          // eslint-disable-next-line no-unused-vars
          const allSegmentTime = segments?.map((segs, segIndex) => {
            let connectedDepartureTimes = '';
            let connectedArrivalTimes = '';
            let allConnectedDep = '';
            if (segIndex === 0) {
              const {
                timehh: boardingHourSeg,
                timemm: boadringMinuteSeg,
              } = convertZuluToSplitted(segments[0]?.segmentDetails?.departure);
              connectedDepartureTimes = `${boardingHourSeg}:${boadringMinuteSeg}`;
              const {
                timehh: arrboardingHourlast,
                timemm: arrboadringMinutelast,
              } = convertZuluToSplitted(segments[0]?.segmentDetails?.arrival);
              const segArrivalTimeArr = `${arrboardingHourlast}:${arrboadringMinutelast}`;
              connectedArrivalTimes = `${arrboardingHourlast}:${arrboadringMinutelast}`;
              allConnectedDep += `-${segArrivalTimeArr}`;
              allConnectedDep = segments?.length > 1
                ? ` ${connectedDepartureTimes}-${connectedArrivalTimes}` : connectedDepartureTimes;
            }
            if ((segIndex > 0)) {
              const {
                timehh: boardingHourCont,
                timemm: boadringMinuteCont,
              } = convertZuluToSplitted(segments[segIndex]?.segmentDetails?.departure);
              const segArrivalTime = `${boardingHourCont}:${boadringMinuteCont}`;
              const {
                timehh: arrboardingHourlast,
                timemm: arrboadringMinutelast,
              } = convertZuluToSplitted(segments[segIndex]?.segmentDetails?.arrival);
              const segArrivalTimeArr = `${arrboardingHourlast}:${arrboadringMinutelast}`;
              allConnectedDep += `~${segArrivalTime}-${segArrivalTimeArr}`;
            }
            allFlightTime += allConnectedDep;
            return allFlightTime;
          })?.[Number(segments?.length) - 1];
          allFlightTime += ((journeysDetail?.length > 1)
          && (jIndex !== Number(journeysDetail?.length) - 1)) ? ' |' : '';
        } else {
          const {
            timehh: boardingHour,
            timemm: boadringMinute,
          } = convertZuluToSplitted(segments[0]?.segmentDetails?.departure);
          const {
            timehh: arrboardingHour,
            timemm: arrboadringMinute,
          } = convertZuluToSplitted(segments[0]?.segmentDetails?.arrival);
          const segDepartureTime = `${boardingHour}:${boadringMinute}`;
          const segArrivalTime = `${arrboardingHour}:${arrboadringMinute}`;
          const segFlightDeparture = `${segDepartureTime}-${segArrivalTime}`;
          allFlightTime += ((journeysDetail?.length > 1)
          && (jIndex !== Number(journeysDetail?.length) - 1)) ? `${segFlightDeparture} | ` : segFlightDeparture;
          journeyTimeArr.push(allFlightTime);
          return allFlightTime;
        }
        return journeyTimeArr.push(allFlightTime);
      })?.[Number(journeysDetail?.length) - 1];
    }
    return journeyTimeArr[Number(journeyTimeArr?.length) - 1];
  };

  if (journeysDetail) {
    for (const journey of journeysDetail) {
      flightType += `${flightType ? ' | ' : ''}${journey?.flightType}`;
      const deptCity = journey?.journeydetail?.origin;
      const destCity = journey?.journeydetail?.destination;
      sector += `${sector ? '|' : ''}${deptCity}-${destCity}`;
    }
    if (journeys && (journeys?.length > 0)) {
      let jIndex = 0;
      for (const journey of journeys) {
        let connectingFlightNumber = '';
        const deptCity = journey?.designator?.origin;
        const destCity = journey?.designator?.destination;
        let connectDepTime = '';
        let prefix = departureDate ? ' | ' : '';
        let segDepartureTime = '';
        let segDepartureDates = '';
        let segind = 0;
        for (const seg of journey?.segments || []) {
          segind += 1;
          const FN = `${seg?.segmentDetails?.identifier?.carrierCode}${seg?.segmentDetails?.identifier?.identifier}`;
          fnArr && fnArr.push(FN);// eslint-disable-line no-unused-expressions
          if (journey?.segments?.length > 1) {
            connectDepTime = (journey?.segments?.length > 1) && segind !== 1 ? '~' : '';
            const {
              timehh: boardingHour,
              timemm: boadringMinute,
            } = convertZuluToSplitted(seg?.designator?.departure);
            if (Number(journey?.segments?.length) - 1) {
              segDepartureTime += `${connectDepTime}${boardingHour}:${boadringMinute}`;
              segDepartureDates += `${connectDepTime}${formatDate(
                journey.designator.departure,
                DD_MM_YYYY,
              )}`;
              tripItas += `${connectDepTime}${seg?.designator?.origin}-${seg?.designator?.destination}`;
            } else {
              segDepartureTime += `${prefix}${boardingHour}:${boadringMinute}`;
              segDepartureDates += `${formatDate(
                journey.designator.departure,
                DD_MM_YYYY,
              )}`;
              tripItas += `${seg?.designator?.origin}-${seg?.designator?.destination}`;
            }
          } else {
            const {
              timehh: boardingHour,
              timemm: boadringMinute,
            } = convertZuluToSplitted(journey?.designator?.departure);
            const singlePreFix = (departureTime && journeysDetail?.length > 1) ? ' | ' : '';
            segDepartureTime += `${singlePreFix}${boardingHour}:${boadringMinute}`;
            segDepartureDates += `${formatDate(journey.designator.departure, DD_MM_YYYY)}`;
            tripItas += `${seg?.designator?.origin}:${seg?.designator?.destination}`;
          }
        }
        departureTimeArr.push(segDepartureTime);
        departureTime = departureTimeArr?.length > 1 ? departureTimeArr?.join(' | ') : departureTimeArr?.[0];
        departureDateArr.push(segDepartureDates);
        departureDate = departureDateArr?.length > 1 ? departureDateArr?.join(' | ') : departureDateArr?.[0];
        const {
          timehh: arrboardingHour,
          timemm: arrboadringMinute,
        } = convertZuluToSplitted(journey?.designator?.arrival);
        // eslint-disable-next-line no-unused-vars
        arrivalTime += `${prefix}${arrboardingHour}:${arrboadringMinute}`;
        prefix = airportCodePair ? '|' : '';
        const fromToCityArr = [deptCity, destCity].sort();
        airportCodePair += `${prefix}${fromToCityArr.join('-')}`;
        // eslint-disable-next-line no-unused-expressions
        journeyDesignator && journeyDesignator.push({
          deptCity,
          destCity,
        });
        trip += `${trip ? ':' : ''}${deptCity}-${destCity}`;
        for (const seg of journey?.segments || []) {
          const FN = `${seg?.segmentDetails?.identifier?.carrierCode}${seg?.segmentDetails?.identifier?.identifier}`;
          const tripTime = dateDiffToString(seg?.segmentDetails?.utcdeparture, seg?.segmentDetails?.utcarrival);
          categoryFare = fsConfig?.FareConfig?.find((x) => x.productClass === seg.productClass)?.fareType || '';
          // eslint-disable-next-line no-unsafe-optional-chaining
          selectedSSR += seg?.ssrs?.map((x) => x.ssrCode).join(', ');
          let travelHrUpdated = tripTime?.hh;
          if (tripTime?.days > 0) { // if we have time difference in days then we have add those to hours count
            travelHrUpdated = Number(travelHrUpdated) + (Number(tripTime?.days) * 24);
          }
          const connectTripDuration = connectingFlightNumber ? '~' : ' | ';
          tripDuration += `${tripDuration
            ? connectTripDuration : ''}${travelHrUpdated}:${tripTime?.mm}:${tripTime?.ss}`;
          connectingFlightNumber += seg && `${connectingFlightNumber ? '~' : ''}${FN}`;
          seatSelected = seg?.seats?.length > 0;
          seatType = (seg?.seats?.length > 0) ? seg?.seats[0]?.category : '';

          if (journey?.segments?.length > 1) {
            const prefixs = connectedFlightDeparture ? '~' : '';
            const {
              timehh: boardingHours,
              timemm: boadringMinutes,
            } = convertZuluToSplitted(seg?.designator?.departure);
            const {
              timehh: arrboardingHoursc,
              timemm: arrboadringMinutecs,
            } = convertZuluToSplitted(seg?.designator?.arrival);

            connectedDepartureTime = `${boardingHours}:${boadringMinutes}`;
            connectedArrivalTime = `${arrboardingHoursc}:${arrboadringMinutecs}`;
            connectedFlightDeparture += `${prefixs}${connectedDepartureTime}-${connectedArrivalTime}`;
          }
        }
        flightNumber += flightNumber ? ` | ${connectingFlightNumber}` : connectingFlightNumber;
        jIndex += 1;
        tripItas += (jIndex !== journeys.length) ? ' | ' : '';
      }
    }
  }
  if (_event === 'gtm.click' || _event === 'gtm.js' || _event === 'gtm.dom' || _event === 'gtm.load'
    || _event === 'order_success') {
    return false;
  }
  const getPreviousPage = () => {
    const { pageType } = window;
    const isBookingFlowPage = getQueryStringByParameterName('isBookingFlow') === '1';
    switch (pageType) {
      case Pages.FLIGHT_SELECT_MODIFICATION:
        return 'Flight Modify Itinerary';
      case Pages.SRP_MODIFICATION:
        return 'Search Flight Modify Itinerary';
      case Pages.PASSENGER_EDIT_MODIFICATION:
        return 'Passenger Edit Modify Itinerary';
      case Pages.SEAT_SELECT_MODIFICATION:
        return 'Seat Select Modify Itinerary';
      case Pages.ADDON_MODIFICATION:
        return 'Addon Modify Itinerary';
      case pageType === '' && isBookingFlowPage:
        return 'Payment';
      default:
        return isBookingFlowPage ? 'Booking Confirmation' : 'Itinerary';
    }
  };
  const getFlightTypeFn = (tripTy) => {
    const journeyCount = journeysDetail?.length || 0;
    let flightLabel = '';
    const tripTypes = tripTy;
    switch (tripTypes) {
      case 'RoundTrip':
        flightLabel = `${getFlightType(tripTypes, 0)} | ${getFlightType(tripTypes, 1)}`;
        break;
      case 'OneWay':
        flightLabel = `${getFlightType(tripTypes, 0)}`;
        break;
      case 'Multicity':
        if (journeyCount > 2) {
          let dummyMulti = '';
          let abc = '';
          dummyMulti = (journeyCount > 0 ? journeysDetail?.map((jourData, index) => {
            if (index === (Number(journeysDetail?.length) - 1)) {
              abc += `${getFlightType(tripTypes, 0)}`;
              dummyMulti = abc;
            } else {
              abc += `${getFlightType(tripTypes, 0)} | `;
              dummyMulti = abc;
            }
            return dummyMulti;
          })[journeyCount - 1] : '');
          flightLabel = dummyMulti;
        }
        break;
      default:
        flightLabel = '';
        return flightLabel;
    }
    return flightLabel;
  };

  let gtmProps = {};
  const paxAdult = adultCount > 0 ? `| ${adultCount} ADT ` : '';
  const paxSS = seniorCitizenCount > 0 ? `| ${seniorCitizenCount} SS ` : '';
  const paxCHD = childrenCount > 0 ? `| ${childrenCount} CHD ` : '';
  const paxInfant = infantCount > 0 ? `| ${infantCount} INF ` : '';
  const paxTotal = totalCount > 0 ? `${totalCount} ` : '';
  const flightTypeLabel = getFlightTypeFn(tripType);
  const bookingPurpose = JSON.parse(localStorage.getItem('bookingPurpose')) || '';
  const specialFareLabel = specialFaresList?.data?.filter(
    (specailFare) => specailFare?.specialFareCode === bookingDetails?.specialFareCode,
  )?.[0]?.specialFareLabel || '';
  seatNumber = getSeatNumberInJourney() || '';
  const flightTimesAllJourney = getFlightTimeInJourney() || '';
  daysUntilDeparture = daysUntilDepartureFn() || 0;
  const commonGtmProps = {
    pnr: bookingDetails?.recordLocator, // PNR
    user_type: personasType && authUser?.customerNumber ? personasType?.roleName : 'Anonymous',
    user_role_code: personasType?.roleCode || 'WWWA', // role code
    journey_flow: `${flowType} Flow`, // Booking Flow, Modification Flow, Web Check-In Flow
    currency_code: currencyCode, // currency code
    page_name: `Flight ${flowType} Itinerary`, // current page name
    // eslint-disable-next-line max-len, no-nested-ternary, no-unsafe-optional-chaining
    previous_page: getPreviousPage(),
    // eslint-disable-next-line max-len
    page_load_time: (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) / 1000 || 0, // Page Load Time
    platform: window.screen.width < 768 ? 'Mweb' : 'Web', // Mweb or Web
    OD: sector, // IATA Code of origin and destination searches
    trip_type: tripType, // oneWay, RoundTrip, Multiway
    pax_details: paxTotal + paxAdult + paxSS + paxCHD + paxInfant,
    departure_date: departureDate, // Departure Dates
    special_fare: specialFareLabel,
    flight_sector: isSectorInternational ? 'International' : 'Domestic', // Flight search type
    flight_option: flightType, // user is selecting which option
    flight_type: flightTypeLabel,
    coupon_code: promoCode, // promo code
    days_until_departure: daysUntilDeparture, // how many days until departure
    user_id: authUser?.customerNumber || '',
    site_section: `${flowType} Page`,
    line_of_business: 'Flight', // Line of the business "Flight" || "Hotel"
    clarity_id: clarityId || '', // Taking this id from cookie name (_clck)
    // eslint-disable-next-line max-len
    wheelchair_opted: !!((selectedSSR?.includes('WCHC') || selectedSSR?.includes('WCHR'))), // Wheelchair opted then True otherwise False
    special_seat: specialSeat, // Double, Triple and None
    recommended_seat: '0', // If user add recommended seat into cart "0" || "1",
    seat_type: seatType || '', // which seat type is selected by user "All Seat" || "Premium"
    seat_number: seatNumber, // seat number selected by user
    booking_mode: bookingDetails?.modeOfTravel || '',
    booking_purpose: bookingDetails?.purposeOfTravel || bookingPurpose,
    transaction_id: bookingDetails?.transactionId || '',
    booking_status: bookingDetails?.bookingStatus || '',
    has_modifications: bookingDetails?.hasModification || false,
    payment_status: paymentStatus, // complete, on hold
    voucher_code: '',
    price: totalPrice,
    tax,
    additional_services_revenue: allSrrPrice || 0,
    discount_amount: discount,
    flight_number: flightNumber, // flight number
    flight_duration: tripDuration, // flight duration
    departure_time: departureTime, // Departure Time
    category_fare: categoryFare, // Saver of Flexi
    flight_fare: airfareCharges, // price of booking (In round trip the price should be total price of both flights)
    seat_selected: seatSelected,
    addons_selected: selectedSSR && selectedSSR.length > 0 ? selectedSSR?.split(',')?.length : 0,
    addons_category: selectedSSR || '', // Category of Addons like 6E Eats, Delayed and Lost Baggage Protection
    addons_labeled: '',
    projectName: 'UX-Revamp',
  };

  switch (_event) {
    case 'purchase':
      gtmProps = omit({
        event,
        line_of_business: 'Flight', // Line of the business
        payment_status: paymentStatus, // complete, on hold
        payment_method: bookingDetails?.paymentMethod, // <UPI/credit_card/indigo_cash>
        journey_flow: `${flowType} Flow`, // Booking Flow, Modification Flow, Web Check-In Flow
        page_name: `Flight ${flowType} Itinerary`, // current page name
        currency_code: currencyCode, // currency code
        // eslint-disable-next-line max-len
        pax_details: paxTotal + paxAdult + paxSS + paxCHD + paxInfant, // paxDetails: Total | Senior Citizen | Adult |Child | Infant
        trip_type: tripType, // oneWay, RoundTrip, Multiway
        departure_date: departureDate, // Departure Dates
        special_fare: specialFareLabel,
        user_type: personasType && authUser?.customerNumber ? personasType?.roleName : 'Anonymous',
        coupon_code: promoCode, // promo code
        site_section: `${flowType} Page`,
        clarity_id: clarityId || '', // Taking this id from cookie name (_clck)
        additional_services_revenue: allSrrPrice || 0,
        user_data: {
          phone_number: homePhone,
          email: emailAddress,
        },
        ecommerce: {
          transaction_id: bookingDetails?.transactionId || '',
          value: totalPrice, // Include everything (Price, Convenience Fee and Applicable Tax)
          tax,
          currency: currencyCode,
          items: [
            {
              pnr: bookingDetails?.recordLocator || '',
              item_id: flightNumber || '',
              item_brand: 'IndiGo 6E',
              item_name: sector,
              days_until_departure: daysUntilDeparture,
              discount,
              item_category: isSectorInternational ? 'International' : 'Domestic',
              index: '1',
              item_category2: flightTypeLabel, // Oneway, RoundTrip, MultiCity
              item_category3: '', // Need to get MS-API,
              item_catagory4: tripItas || '',
              flight_option: flightType,
              // eslint-disable-next-line no-nested-ternary
              flight_time: flightTimesAllJourney,
              flight_duration: tripDuration, // flight duration
              coupon: promoCode,
              affiliation: 'Web',
              price: airfareCharges, // This is Flight Fare Only
              quantity: `${totalCount}|${adultCount}|${childrenCount}|${infantCount}|${seniorCitizenCount}`,
              item_variant: flowType, // Modification Flow or Booking Flow
            },
          ],
        },
      });
      break;
    case 'page-load' || 'change_finish' || 'cancel_finish' || 'booking_cancelled' || 'split_pnr':
      gtmProps = omit({
        ...commonGtmProps,
      });
      break;
    case 'link_click':
      gtmProps = omit({
        event,
        click_text: props?.clickText,
        click_nav: props?.clickNav, // dropdown hierarchy
        page_name: flowType, // Page Name
        site_section: `${flowType} Page`, // Booking Flow Pages
        line_of_business: 'Flight', // Line of the business "Flight" || "Hotel"
        user_role_code: personasType?.roleCode || 'WWWA', // user role code
        user_type: personasType && authUser?.customerNumber ? personasType?.roleName : 'Anonymous',
        ...(props?.clickText === 'Proceed') && { trip_type: tripType },
        ...(props?.clickText === 'Proceed') && {
          pax_details: `${totalCount} | ${seniorCitizenCount} SS | 
          ${adultCount} ADT| ${childrenCount} CHD | ${infantCount} INF ` },
        ...(props?.clickText === 'Proceed') && { departure_date: departureDate },
        ...(props?.clickText === 'Proceed') && { pnr: bookingDetails?.recordLocator },
      });
      break;
    case 'modification_complete':
      gtmProps = omit({
        event,
        ...commonGtmProps,
        modification_list: {
          wheelchair_opted: false,
          special_seat: specialSeat,
          recommended_seat: 0,
          seat_type: seatType,
          seat_number: seatNumber,
          addons_labeled: '',
          addons_selected: selectedSSR && selectedSSR.length > 0 ? selectedSSR?.split(',')?.length : 0,
          addons_category: selectedSSR || '',
          addon_details: '1',
        },
      });
      break;
    default:
      break;
  }

  gtmAnalytic({
    state: {},
    gtmProps,
  });
  return null;
};

export const pushDataLayer = (obj) => {
  try {
    pushDataLayerFunc(obj);
  } catch (error) {
    console.log('---pushDataLayer--error', error);// eslint-disable-line no-console
  }
};
