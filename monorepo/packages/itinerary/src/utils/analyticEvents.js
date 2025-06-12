/* eslint-disable camelcase */
import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { CONSTANTS } from '../constants';
import { findTripType } from '../components/Passengers/dataConfig';
import { ANALTYTICS } from '../constants/scratchcardanalytic';
import { countGender, dateDiffToString, formatDate, individualPaxCount } from '.';
// eslint-disable-next-line max-len
import { LINK_BUTTON_CLICK, MARKET_DOMESTIC, MARKET_INTERNATIONAL, OVERLAY_OPEN, EVENT_DELAY, TYPE, SOURCE, AA_CONSTANTS, getBookingChannel, SPLIT_PNR_EVENT } from '../constants/analytic';

const { EVENTS, INTERACTION, DATA_CAPTURE_EVENTS, SITE_SECTION, COMPONENT, JOURNEY_FlOW } = ANALTYTICS;
/**
 * Delay in asyn fucntion
 * @param {*} ms - time
 * @returns
 */
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/**
 * pushAnalyticWrapper - It holds the list of events and its details called from MFE
 * @param {object} param0  -  contains data and event name
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const pushAnalyticWrapper = async ({ ...obj }) => { // NOSONAR
  const { event = '', data = {}, error = '', product = null, isChangeFlight = '' } = obj;

  const {
    _event,
    _eventInfoName = '',
    _componentName = '',
    isBookingFlow,
    pnrResponse: {
      journeysDetail = [],
      bookingDetails,
      passengers,
      priceBreakdown,
      ssrCategories,
    } = {},
    ssrListAbbreviation,
    isReviewItinerary,
    errorMesg = {},
    res = {},
    warning,
    warningMessage,
    _customerid,
    _cardposition,
    _scratches,
    _couponAvaild,
  } = data;
  const {
    PNR_TYPE,
    SSR_CODE,
  } = CONSTANTS;
  const {
    REDEEM_CLICK,
    SCRATCH_CARD_POPUPLOAD,
    CLOSE_ICON_CLICK,
    SCRATCHING_CLICK,
    AVAIL_NOW_CLICK,
    COPY_CLICK,
  } = DATA_CAPTURE_EVENTS;
  let airportCodePair = '';
  let sector = '';
  let tripDuration = '';
  let departureDate = '';
  let seatSelected = false; let seatSelectedCount = 0; let seatType = '';
  let femaleSeatCount = 0;
  /**
     * Common Data //AGP19G
     * */
  const tripType = journeysDetail && findTripType(journeysDetail);
  const currencyCode = bookingDetails?.currencyCode;
  const channelType = getBookingChannel(bookingDetails?.channelType);

  // Getting Passengers Details
  const adultCount = passengers?.length > 0 ? individualPaxCount(passengers, 'adult') : 0;
  const seniorCitizenCount = passengers?.length > 0 ? individualPaxCount(passengers, 'seniorCitizen') : 0;
  const childrenCount = passengers?.length > 0 ? individualPaxCount(passengers, 'children') : 0;
  const infantCount = passengers?.length > 0 ? individualPaxCount(passengers, 'infant') : 0;
  const totalCount = adultCount + seniorCitizenCount + childrenCount;
  const tax = (priceBreakdown?.taxAmountList) ? (priceBreakdown?.taxAmountList?.reduce((acc, obj) => acc + obj.value, 0)) : 0; // eslint-disable-line no-shadow, max-len
  const genderCount = passengers?.length > 0 ? countGender(passengers) : 0;
  const marketType = journeysDetail[0]?.segments.filter((seg) => seg.international).length > 0;
  // eslint-disable-next-line max-len
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
      ? daysUntilDepartureArr?.join(' | ') : String(daysUntilDepartureArr?.[0]);
    return daysUntilDepartureArr;
  };
  const isNewBooking = isBookingFlow;
  let doubleSeatCount = 0; let tripleSeatCount = 0;

  /**
     * getValuefromCode - find name of ssrCode from Abbreviation List
     * @param {String} i
     * @param {Object} arr
     * @param {String} j
     * @returns - name of ssr
     */
  const getValuefromCode = (i, arr, j) => { // eslint-disable-line consistent-return
    // eslint-disable-next-line no-shadow
    const obj = arr?.filter((item) => item?.ssrCode === i)[0];
    if (obj) return obj[j];
  };

  /**
     * getParentSSR - fond the parent ssrCode if any
     * @param {String} ssrCode
     * @param {Object} ssrCategories
     * @returns - parent ssrCode
     */
  const getParentSSR = (ssrCode, ssrCategories) => { // eslint-disable-line no-shadow
    const parentSSR = ssrCategories.filter((i) => i.ssrList.includes(ssrCode));
    return parentSSR[0]?.category || '';
  };

  /**
     * getGenderInfo - fond the gender info as "M","F","O","M|M","M|F","F|F","M|O"
     * @param {Object} passengers
     * @returns - parent ssrCode
     */

  const getGenderInfo = (passengers) => { // eslint-disable-line no-shadow
    let genderInfoString = '';
    passengers?.map((pax) => {
      if (((pax?.info?.gender) === 1) && (genderInfoString !== '')) {
        genderInfoString += '|' + 'M';// eslint-disable-line no-useless-concat
        return genderInfoString;
      }
      if (((pax?.info?.gender) === 1) && (genderInfoString === '')) {
        genderInfoString = 'M';
        return genderInfoString;
      }
      if (((pax?.info?.gender) === 2) && (genderInfoString !== '')) {
        femaleSeatCount += 1;
        genderInfoString += '|' + 'F';// eslint-disable-line no-useless-concat
        return genderInfoString;
      }
      if (((pax?.info?.gender) === 2) && (genderInfoString === '')) {
        femaleSeatCount += 1;
        genderInfoString = 'F';
        return genderInfoString;
      }
      if (((pax?.info?.gender) !== 1) && ((pax?.info?.gender) !== 2) && (genderInfoString !== '')) {
        genderInfoString += '|' + 'O';// eslint-disable-line no-useless-concat
        return genderInfoString;
      }
      genderInfoString = 'O';
      if (pax?.ExtraSeatTag === CONSTANTS.PASSENGER_EXTRA_SEAT.DOUBLE_SEAT_DISCOUNT_CODE) {
        doubleSeatCount += 1;
      } else if (pax?.ExtraSeatTag === CONSTANTS.PASSENGER_EXTRA_SEAT.TRIPLE_SEAT_DISCOUNT_CODE) {
        tripleSeatCount += 1;
      }
      return genderInfoString;
    });
    return genderInfoString || '';
  };

  // TODO: Need to move this to API level //NOSONAR
  const parentSSRMaping = {
    PRIM: '6E Prime',
    MLST: 'Seat+Meal',
    BAR: 'Bar',
    Meal: 'Meal',
    BAGGAGE: 'Baggage Allowance',
    PROT: 'Insurance',
    BRB: 'Insurance',
    IFNR: 'Insurance',
    LBG: 'Insurance',
  };
  const loyaltyTierMapping = {
    gold: 'BLU1',
    silver: 'BLU2',
    base: 'BLU3',
  };

  /**
     * Product Details
     * */
  let ancillarySSR = ''; let seatSSR = ''; let TripInfo = ''; let flightNumber = '';
  let ancillaryRevenue = 0; let ancillaryCount = 0;
  const journeyDesignator = []; let trip = ''; const fnArr = [];
  let GST = priceBreakdown?.taxAmountList?.reduce(
    (acc, curVal) => (curVal.feeCode.includes('GST')
      ? acc + curVal.value
      : acc),
    0,
  );

  const journeys = (passengers?.length > 0) ? (passengers?.[0]?.seatsAndSsrs?.journeys) : [];
  const ssrAmountlist = priceBreakdown?.ssrAmountlist;
  const totalCharged = priceBreakdown?.totalCharged;
  const airfareCharges = priceBreakdown?.airfareCharges;
  const isMultiCity = (tripType === PNR_TYPE.MULTY_CITY);
  const loginTypeObj = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.ROLE_DETAILS, true) || {};
  const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || {};

  // Loyalty
  const userTier = authUser?.loyaltyMemberInfo?.tier || authUser?.loyaltyMemberInfo?.TierType || '';
  const analyticsUserTierStr = loyaltyTierMapping[userTier?.toLowerCase()] || userTier;

  if (journeys) {
    for (const journey of journeys) {
      let connectingFlightNumber = '';
      const deptCity = journey?.designator?.origin;
      const destCity = journey?.designator?.destination;
      let prefix = departureDate ? '|' : '';
      departureDate += `${prefix}${formatDate(journey.designator.departure, 'DD-MM-YYYY')}`;

      sector += `${sector ? '|' : ''}${deptCity}-${destCity}`;
      prefix = airportCodePair ? '|' : '';
      const fromToCityArr = [deptCity, destCity].sort();
      airportCodePair += `${prefix}${fromToCityArr.join('-')}`;

      journeyDesignator.push({
        deptCity,
        destCity,
      });
      trip += `${trip ? ':' : ''}${deptCity}-${destCity}`;
      for (const seg of journey?.segments || []) {
        const FN = `${seg?.segmentDetails?.identifier?.carrierCode}${seg?.segmentDetails?.identifier?.identifier}`;
        fnArr.push(FN);
      }
      for (const seg of journey?.segments || []) {
        // Ancillary
        const userSSR = seg?.ssrs?.filter((i) => ![SSR_CODE.FIRST_TIME_FLYER].includes(i?.ssrCode));
        const FN = `${seg?.segmentDetails?.identifier?.carrierCode}${seg?.segmentDetails?.identifier?.identifier}`;
        const tripTime = dateDiffToString(seg?.segmentDetails?.utcdeparture, seg?.segmentDetails?.utcarrival);

        let travelHrUpdated = tripTime?.hh;
        if (tripTime?.days > 0) { // if we have time difference in days then we have add those to hours count
          travelHrUpdated = Number(travelHrUpdated) + (Number(tripTime?.days) * 24);
        }
        const connectTripDuration = connectingFlightNumber ? '~' : ' | ';
        // tripDuration += `${tripDuration ? '|' : ''}${travelHrUpdated}:${tripTime?.mm}:${tripTime?.ss}`;
        tripDuration += `${tripDuration
          ? connectTripDuration : ''}${travelHrUpdated}:${tripTime?.mm}:${tripTime?.ss}`;
        connectingFlightNumber += seg && `${connectingFlightNumber ? ':' : ''}${FN}`;
        for (const ssr of userSSR) {
          const product = getValuefromCode(ssr?.ssrCode, ssrListAbbreviation, 'name');// eslint-disable-line no-shadow
          // TODO: Need to fix parentSSR
          const parentSSR = getParentSSR(ssr?.ssrCode, ssrCategories) || '';
          let parentSSRTemp = parentSSRMaping[parentSSR || ssr?.ssrCode] || '';
          const quantity = ssr?.count;
          const price = getValuefromCode(ssr?.ssrCode, ssrAmountlist, 'value') || 0;
          ancillaryRevenue += price;
          ancillaryCount += 1;
          parentSSRTemp = parentSSRTemp ? `${parentSSRTemp}|` : '';
          ancillarySSR += `;${parentSSRTemp}${product};`;
          ancillarySSR += `${quantity};`;
          ancillarySSR += `${price};`;

          // for multicity, event and evar is not needed
          if (isMultiCity) {
            ancillarySSR += ',';
            continue; // eslint-disable-line no-continue
          }

          // events
          ancillarySSR += `event66=${quantity}|event101=${price};`;

          // Evars
          // eslint-disable-next-line max-len
          ancillarySSR += `eVar19=${journeyDesignator[0].deptCity || ''}|eVar20=${journeyDesignator[0].destCity || ''}|eVar22=${fnArr[0]}|eVar23=${fnArr[1] || ''},`;
        }

        // Seat SSR
        const paxSeat = seg.seats;
        const seatPrice = priceBreakdown?.seatAmount || 0;
        seatSelected = seg?.seats?.length > 0;
        for (const seat of paxSeat) {
          let product = `;Seat|${seatPrice ? 'Paid' : 'Free'}`;// eslint-disable-line no-shadow
          ancillaryRevenue += seatPrice;
          ancillaryCount += 1;
          product += `|${seat?.type}`;
          product += '|'; // TODO: Normal/XL
          product += '|'; // TODO: Reclining Yes/No
          const quantity = 1; // TODO
          seatSSR += `${product};`;
          seatSSR += `${quantity};`;
          seatSSR += `${seatPrice};`;

          seatType = seat?.type;
          // for multicity, event and evar is not needed
          if (isMultiCity) {
            seatSSR += ',';
            continue;// eslint-disable-line no-continue
          }
          // events
          seatSSR += `event66=${quantity}|event101=${seatPrice};`;

          // Evars
          // eslint-disable-next-line max-len
          seatSSR += `eVar19=${journeyDesignator[0].deptCity || ''}|eVar20=${journeyDesignator[0].destCity || ''}|eVar22=${fnArr[0]}|eVar23=${fnArr[1] || ''},`;
          seatSelectedCount += 1;
        }
      }
      flightNumber += flightNumber ? `:${connectingFlightNumber}` : connectingFlightNumber;
    }
  }

  // GST
  GST = `;GST;;${GST},`;

  // Trip Info
  TripInfo += `;${tripType}|${trip}|${flightNumber};1;${airfareCharges};event182=${airfareCharges};`;
  if (!isMultiCity) {
    // events
    TripInfo += ';';
    // Evars
    // eslint-disable-next-line max-len
    TripInfo += `eVar19=${journeyDesignator[0]?.deptCity || ''}|eVar20=${journeyDesignator[0]?.destCity || ''}|eVar22=${fnArr[0]}|eVar23=${fnArr[1] || ''},`;
  } else {
    TripInfo += ',';
  }

  const finalProductDetails = `${ancillarySSR}${seatSSR}${GST}${TripInfo}`;
  const commonEventProps = {
    event,
    interactionType: LINK_BUTTON_CLICK,
    page: {
      eventInfo: {
        name: _eventInfoName || '',
        position: '',
        component: _componentName || '',
      },
      error: {
        id: error?.code || '',
        text: error?.message || '',
      },
      LOB: 'Flights',
      pageInfo: {
        platform: window.screen.width < 768 ? 'Mweb' : 'Web',
      },
    },
    product:
      _eventInfoName === SPLIT_PNR_EVENT
        ? {
          productInfo: {
            tripType: tripType || '',
            sector,
            departureDates: departureDate,
            specialFare: String(bookingDetails?.specialFareCode) || '',
            totalPax: totalCount ? `${totalCount}` : '',
            adultPax: adultCount ? `${adultCount}` : '',
            childPax: childrenCount ? `${childrenCount}` : '',
            infantPax: infantCount ? `${infantCount}` : '',
            seniorPax: seniorCitizenCount ? `${seniorCitizenCount}` : '',
            tripDuration: tripDuration || '',
            daysUntilDeparture: daysUntilDepartureFn() || '0',
            pnr: String(bookingDetails?.recordLocator),
          },
        }
        : {},

    bookingChannel: _eventInfoName === SPLIT_PNR_EVENT ? channelType : '',
    ...product,
  };

  let eventProps = {};
  switch (_event) {
    case 'itineraryPageLoad':
      eventProps = {
        event: event || '',
        interactionType: 'pageload',
        page: {
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
          paymentInfo: {
            paymentStatus: bookingDetails?.paymentStatus === 'Approved' ? 'Complete' : 'false',
            paymentMethod: bookingDetails?.paymentMethodName || '',
            paymentMethodDetails: bookingDetails?.paymentMethodDetails || '', // check with API team
          },
        },
        product: {
          productInfo: {
            tripType: tripType || '',
            airportCodePair: airportCodePair || '',
            sector,
            departureDates: departureDate,
            currencyCode: currencyCode || '',
            specialFare: String(bookingDetails?.specialFareCode) || '',
            totalPax: totalCount ? `${totalCount}` : '', // isNewBooking ? totalCount + "" : ""
            adultPax: adultCount ? `${adultCount}` : '', // isNewBooking ? adultCount + "" : ""
            childPax: childrenCount ? `${childrenCount}` : '', // isNewBooking ? childrenCount + "" : ""
            infantPax: infantCount ? `${infantCount}` : '', // isNewBooking ? infantCount + "" : ""
            seniorPax: seniorCitizenCount ? `${seniorCitizenCount}` : '', // isNewBooking ? seniorCitizenCount + "" : ""
            tripDuration: tripDuration || '', // isNewBooking ? tripDuration : ""
            daysUntilDeparture: daysUntilDepartureFn() || '0',
            isNewBooking: isNewBooking ? String(1) : String(0),
            bookingStatus: String(bookingDetails?.bookingStatus) || '',
            hasModifications: !isBookingFlow ? 'true' : 'false',
            pnr: String(bookingDetails?.recordLocator),
            promotionalCode: String(bookingDetails?.promoCode) || '',
            voucherCode: '',
            marketType: marketType ? MARKET_INTERNATIONAL : MARKET_DOMESTIC,
            tax: tax ? `${tax}` : '', // isNewBooking ? tax + "" : ""
            additionalServicesRevenue: (priceBreakdown?.convenienceFee) ? String(priceBreakdown?.convenienceFee) : '',
            discountAmount: '', // need to check with API team
            malePassengers: (genderCount?.male) ? String(genderCount?.male) : '',
            femalePassengers: genderCount?.female ? String(genderCount?.female) : '',
            purchase: isNewBooking ? String(1) : String(0),
            productDetails: finalProductDetails?.slice(0, -1) || '',
            ancillaryRevenue: `${ancillaryRevenue}` || '',
            ancillaryCount: `${ancillaryCount}` || '',
            FemaleSeat: (femaleSeatCount > 0) ? String(femaleSeatCount) : String(0), // need to check with API team
            seatSelected: seatSelected ? String(seatSelectedCount) : String(0),
            XLseatSelected: (seatType === CONSTANTS.PASSENGER_EXTRA_SEAT.XLSEAT) ? String(1) : String(0),
            doubleSeatSelected: String(doubleSeatCount) || String(0),
            tripleSeatSelected: String(tripleSeatCount) || 0,
            bookingPurpose: String(bookingDetails?.purposeOfTravel) || '',
            bookingMode: bookingDetails?.modeOfTravel || '',
            Amount: String(totalCharged) || '',
            isPaidOrder: (totalCharged && totalCharged > 0) ? String(1) : String(0),
            isNonPaidOrder: (!totalCharged || totalCharged === 0) ? String(1) : String(0),
            ...(!isBookingFlow) && {
              isBookingCancled: bookingDetails?.bookingStatus === CONSTANTS.BOOKING_STATUS.CANCELLED
                ? String(1) : String(0),
            },
            ...(isChangeFlight && { isChangeFlight: String(isChangeFlight) }),
            payType: bookingDetails?.isRedeemTransaction ? 'Cash+Points' : 'Cash',
            percentagePointsBurned: '',
          },
          paymentInfo: {
            paymentMethod: bookingDetails?.paymentMethodName || '',
            paymentMethodDetails: bookingDetails?.paymentMethodDetails || '',
            paymentAmount: String(totalCharged) || '', // isNewBooking ? totalCharged : ""
          },
        },
        loyalty: {
          pointsEarned: bookingDetails?.isRedeemTransaction ? '0' : String(priceBreakdown?.totalPoints) || '0',
          pointsburned: bookingDetails?.isRedeemTransaction
            ? (String(priceBreakdown?.airfareChargesInPoints) || '0') : '0',
          earn: bookingDetails?.isRedeemTransaction ? '0' : '1',
          burn: bookingDetails?.isRedeemTransaction ? '1' : '0',
        },
        LOB: 'Flights',
        user: {
          type: String(loginTypeObj?.roleCode) || 'WWWA',
          customer: {
            gender: getGenderInfo(passengers) || '',
          },
          tier: !authUser.customerNumber ? 'Not Logged In'
            : analyticsUserTierStr,
          FFNumber: authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || '',
        },
      };
      break;

    case 'retrieveAnotherItinerary':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: '',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
        },
      };
      break;

    case 'emailItineraryOverlay':
      eventProps = {
        event,
        interactionType: 'Pop Up',
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: '',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'emailItineraryPopupAction':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: 'Email Itinerary',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'emailItinerarySubmit':
      // eslint-disable-next-line no-multi-assign
      eventProps = eventProps = { ...commonEventProps };
      break;

    case 'modifyActionPopup': {
      eventProps = { ...commonEventProps };
      break;
    }
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    case 'cancelBookingPopupOpen':
      eventProps = {
        event,
        interactionType: 'Pop Up',
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: '',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;

    case 'cancelBookingPopupAction':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: 'Cancel Booking',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;

    case 'contactDetailPopupOpen':
      eventProps = {
        event,
        interactionType: OVERLAY_OPEN,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: '',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;

    case 'contactDetailSubmit':
      eventProps = {
        event,
        interactionType: OVERLAY_OPEN,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: 'Update Health & Contact Details',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;

    case 'cancelFlightPopupOpen':
      eventProps = {
        event,
        interactionType: 'Pop Up',
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: _componentName || '',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'cancelFlightPopupAction':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: _componentName || 'Cancel Flight',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'changeFlightPopupOpen':
      eventProps = {
        event,
        interactionType: 'Pop Up',
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: _componentName || '',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
        ...(product),
      };
      break;
    case 'changeFlightPopupAction':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: _componentName || 'Change Flight',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
        ...(product),
      };
      break;
    case 'itineraryButtonAction':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: _componentName || '',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'modifyOtpPopupOpen':
      eventProps = {
        event,
        interactionType: 'Pop Up',
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: _componentName || 'OTP Confirmation',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'modifyOtpPopupAction':
      eventProps = {
        event,
        interactionType: LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position: '',
            component: _componentName || 'OTP Confirmation',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'captureApiRes':
      eventProps = {
        event,
        interactionType: 'API response',
        page: {
          api: {
            code: res?.statusCode || '',
            response: res?.data || '',
            responsetime: res?.responseTime || '',
            apiURL: res?.url || '',
          },
          error: {
            code: errorMesg?.code || '',
            type: TYPE[errorMesg?.type] || '',
            source: SOURCE[errorMesg?.source] || '',
            apiURL: errorMesg?.url || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.message || '',
          },
          LOB: 'Flights',
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'UXerror':
      eventProps = {
        event: 'UXerror',
        interactionType: 'Error',
        page: {
          error: {
            code: `${error?.code}` || AA_CONSTANTS.NO_CODE,
            type: error?.type || '',
            source: error?.source || '',
            apiURL: error?.apiUrl || '',
            statusCode: `${error?.code}` || AA_CONSTANTS.NO_STATUS_CODE,
            statusMessage: error?.statusMessage || AA_CONSTANTS.NO_STATUS_MESSAGE,
            displayMessage: error?.displayMessage || AA_CONSTANTS.NO_DISPLAY_MESSAGE,
            action: error?.action || '',
            component: error?.component || '',
          },
          pageInfo: {
            projectName: 'UX-Revamp',
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      };
      break;
    case 'cmp:loaded':
      break;
    case 'warning':
      eventProps = {
        event: 'warning',
        interactionType: warning ? 'Warning' : 'Info',
        page: {
          pageInfo: {
            pageName: !isBookingFlow ? 'Flight Retrieve Itinerary' : 'Flight Booking Itinerary',
            siteSection: isBookingFlow ? 'Booking Flow' : 'Modification Flow',
            projectName: 'Skyplus',
            warningCount: warning ? '1' : '0',
            infoCount: warning ? '0' : '1',
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
            language: 'en',
          },
          eventInfo: {
            name: warningMessage,
            position: 'on',
            component: _componentName,
          },
          LOB: 'Flights',
        },
      };
      break;

    case REDEEM_CLICK:
      eventProps = {
        event: EVENTS.SECONDARY_CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: '',
          },
          LOB: 'Flights',
          PageInfo: {
            name: _eventInfoName,
            SiteSection: SITE_SECTION,
            journeyFlow: JOURNEY_FlOW,

          },
        },
      };
      break;
    case SCRATCH_CARD_POPUPLOAD:
      eventProps = {
        event: EVENTS.CLICK,
        interactionType: INTERACTION.POPUP_SHOWN,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: _cardposition,
            component: COMPONENT,
          },
          LOB: 'Flights',
          PageInfo: {
            SiteSection: SITE_SECTION,
            journeyFlow: JOURNEY_FlOW,

          },
        },
      };
      break;
    case CLOSE_ICON_CLICK:
      eventProps = {
        event: EVENTS.SECONDARY_CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'X',
            component: 'Active',
          },
          LOB: 'Flights',
          PageInfo: {
            customerID: String(_customerid),
            SiteSection: SITE_SECTION,
            journeyFlow: JOURNEY_FlOW,
          },
        },
      };
      break;
    case SCRATCHING_CLICK:
      eventProps = {
        event: EVENTS.CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'Click here',
            component: COMPONENT,
          },
          LOB: 'Flights',
          PageInfo: {
            customerID: String(_customerid),
            scratches: _scratches,
            SiteSection: SITE_SECTION,
            journeyFlow: JOURNEY_FlOW,
          },
        },
      };
      break;
    case AVAIL_NOW_CLICK:
      eventProps = {
        event: EVENTS.CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'Avail Now',
            component: COMPONENT,
          },
          LOB: 'Flights',
          PageInfo: {
            customerID: String(_customerid),
            cupponavilled: _couponAvaild,
            SiteSection: SITE_SECTION,
            journeyFlow: JOURNEY_FlOW,

          },
        },
      };
      break;
    case COPY_CLICK:
      eventProps = {
        event: EVENTS.SECONDARY_CLICK,
        interactionType: INTERACTION.LINK_BUTTON_CLICK,

        page: {
          eventInfo: {
            name: _eventInfoName,
            position: 'Copy',
            component: COMPONENT,
          },
          LOB: 'Flights',
          PageInfo: {
            customerID: String(_customerid),
            SiteSection: SITE_SECTION,
            journeyFlow: JOURNEY_FlOW,

          },
        },
      };
      break;
    default:
  }

  if (_event === 'cmp:loaded') {
    return;
  }

  if (['modifyOtpPopupOpen', 'cancelBookingPopupOpen', 'contactDetailPopupOpen',
    'changeFlightPopupOpen', 'cancelFlightPopupOpen',
    'emailItineraryOverlay'].includes(_event)) await delay(EVENT_DELAY);
  const flowTypes = isBookingFlow ? 'Booking Flow' : 'Modification Flow';
  const pageName = !isBookingFlow ? 'Flight Retrieve Itinerary' : 'Flight Booking Itinerary';
  try {
    adobeAnalytic({
      state: {},
      commonInfo: {
        page: {
          pageInfo: {
            pageName: isReviewItinerary ? 'Flight Modification Itinerary' : pageName,
            siteSection: flowTypes,
            journeyFlow: flowTypes,
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
      },
      eventProps,
    });
  } catch (errors) {
    // console.log('---error in itinerary mf adobe analytics util', errors);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const pushAnalytic = async (obj) => {
  try {
    await pushAnalyticWrapper(obj);
  } catch (error) {
    console.error('itinerary::error:pushAnalytic', error);// eslint-disable-line no-console
  }
};
