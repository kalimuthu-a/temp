/* eslint-disable sonarjs/cognitive-complexity */
import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { AESEncryptCtr } from 'skyplus-design-system-app/dist/des-system/aes-ctr';
import { GTM_CONSTANTS, TYPE, SOURCE, localStorageKeys } from '../constants';
import LocalStorage from './LocalStorage';
import { ENCRYPT_VALUE, WHATSAPP_COMPONENT, WHATSAPP_OPT_STATUS } from '../constants/constants';
import { getCategoryFare, journeyDetailsAlphabetically, journeyDetailsOriginDestination } from '../helpers';

const {
  NEXT,
  PAGELOAD,
  FLIGHTS,
  LINK_CLICK,
  BOOKING_FLOW,
  ERROR_SWITCH_CASE,
  ERROR_EVENT_TYPE,
  MODIFICATION_FLOW,
  CAPTURE_API_RESPONSE,
  ENTER_PASSENGER_DETAILS,
  PASSENGEREDIT_PAGE_TYPE,
  API_RESPONSE_INTERACTION_TYPE,
  PAGENAME_PASSENGER_DETAILS,
  PAGENAME_PASSENGER_DETAILS_MODIFICATION,
  SIGN_IN_NOW,
  PASSENGER_DETAILS,
  EN,
  WWWA,
} = GTM_CONSTANTS;

/**
 * pushAnalytic - It holds the list of events and its details called from MFE
 * @param {object} param0 - contains data and event name
 */
const pushAnalyticWrapper = ({ ...obj }) => {
  const { event = '', data = {}, error = '' } = obj;
  const {
    _event,
    errorMesg,
    warning,
    warningMessage,
    res = {},
    formData = {},
    name = NEXT,
    state,
    component,
    whatsappState,
    ssr,
    totalFare,
  } = data;
  const bookingWidget = LocalStorage.getAsJson(localStorageKeys.bw_cntxt_val) || {};
  const { seatWiseSelectedPaxInformation = {} } = bookingWidget;
  const { adultCount, childrenCount, infantCount, seniorCitizenCount, totalCount } = seatWiseSelectedPaxInformation;

  // Getting Passengers DEtails
  const isBookingFlow = window?.pageType === PASSENGEREDIT_PAGE_TYPE;

  let eventProps = {};

  const { userFields = [] } = formData || {};

  const wheelchairReason1 = [];
  const wheelchairReason2 = [];
  const wheelchairReason3 = [];
  const speechImpaired = [];
  const hearingImpaired = [];
  const visuallyImpaired = [];
  const gender = [];
  const ffNumber = [];
  let saveFutureBooking = 0;
  const journeyData = LocalStorage.getAsJson(localStorageKeys.journeyReview, []);

  userFields.forEach((userField) => {
    const specialAssistance = userField?.specialAssistance || {};
    wheelchairReason1.push(specialAssistance.wheelchair?.reason || '');
    wheelchairReason2.push(specialAssistance.wheelchair?.category || '');
    wheelchairReason3.push(specialAssistance.wheelchair?.subCategory || '');
    speechImpaired.push(specialAssistance.options?.speechImpaired
      ? Number(specialAssistance.options.speechImpaired) : 0);
    hearingImpaired.push(specialAssistance.options?.hearingImpaired
      ? Number(specialAssistance.options.hearingImpaired) : 0);
    visuallyImpaired.push(specialAssistance.options?.visuallyImpaired
      ? Number(specialAssistance.options.visuallyImpaired) : 0);
    gender.push(userField?.gender?.slice(0, 1) || '');
    if (userField.save) saveFutureBooking += 1;
    if (userField?.loyaltyInfo?.FFN) ffNumber.push(userField?.loyaltyInfo?.FFN);
  });

  const wheelchairReason1Str = wheelchairReason1.join('|');
  const wheelchairReason2Str = wheelchairReason2.join('|');
  const wheelchairReason3Str = wheelchairReason3.join('|');
  const speechImpairedStr = speechImpaired.join('|');
  const hearingImpairedStr = hearingImpaired.join('|');
  const visuallyImpairedStr = visuallyImpaired.join('|');
  const genderStr = gender.join('|');
  const fFNumberStr = ffNumber.join('|');
  const chosedFromSavedList = String((state?.savedPassengers.filter((saved) => saved?.isSelected) || [])?.length);

  const whatsappConsent = ({ userInteracted, whatsappCheck }) => {
    if (userInteracted && whatsappCheck) {
      return WHATSAPP_COMPONENT.SELECTED;
    }
    if (userInteracted && !whatsappCheck) {
      return WHATSAPP_COMPONENT.UNSELECTED;
    }
    if (!userInteracted && whatsappCheck) {
      return WHATSAPP_COMPONENT.DEFAULT;
    }
    return WHATSAPP_COMPONENT.UNSELECTED;
  };

  const firstHiveEncryptKey = window?.msdv2?.fhKey;

  switch (_event) {
    case PAGELOAD:
      eventProps = {
        event: event || '',
        interactionType: PAGELOAD,
        page: {
          LOB: FLIGHTS,
          error: {
            ...errorMesg,
            type: TYPE[errorMesg?.type] || '',
            source: SOURCE[errorMesg?.source] || '',
            apiURL: errorMesg?.url || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.message || '',
          },
        },
      };
      break;

    case ENTER_PASSENGER_DETAILS:
      eventProps = {
        event: event || '',
        interactionType: LINK_CLICK,
        page: {
          eventInfo: {
            name: isBookingFlow ? name : NEXT,
            position: whatsappConsent(whatsappState),
            component: 'Passenger Details',
          },
          error: {
            id: error?.code || '',
            text: error?.message || '',
          },
        },
        user: {
          customer: {
            title: AESEncryptCtr(formData?.name?.title, '', ENCRYPT_VALUE) || '',
            firstName: AESEncryptCtr(formData?.name?.first, '', ENCRYPT_VALUE) || '',
            lastName: AESEncryptCtr(formData?.name?.last, '', ENCRYPT_VALUE) || '',
            email: AESEncryptCtr(formData?.email, '', ENCRYPT_VALUE) || '',
            phone: AESEncryptCtr(formData?.primaryContact, '', ENCRYPT_VALUE) || '',
            gender: genderStr,
            wheelchairReason1: wheelchairReason1Str,
            wheelchairReason2: wheelchairReason2Str,
            wheelchairReason3: wheelchairReason3Str,
            speechImpaired: speechImpairedStr,
            hearingImpaired: hearingImpairedStr,
            visuallyImpaired: visuallyImpairedStr,
            saveFutureBooking: String(saveFutureBooking),
            chosedFromSavedList,
          },
          fh_customer: firstHiveEncryptKey && {
            title: AESEncryptCtr(formData?.name?.title, firstHiveEncryptKey, ENCRYPT_VALUE) || '',
            firstName: AESEncryptCtr(formData?.name?.firstName, firstHiveEncryptKey, ENCRYPT_VALUE) || '',
            lastName: AESEncryptCtr(formData?.name?.lastName, firstHiveEncryptKey, ENCRYPT_VALUE) || '',
            email: AESEncryptCtr(formData?.email, firstHiveEncryptKey, ENCRYPT_VALUE) || '',
            phone: AESEncryptCtr(formData?.phone, firstHiveEncryptKey, ENCRYPT_VALUE) || '',
          },
          FFNumber: fFNumberStr,
          optedForLoyality: userFields?.[0]?.loyaltyInfo?.optLoyaltySignup ? '1' : '0',
        },
      };
      break;

    case ERROR_SWITCH_CASE:
      eventProps = {
        event,
        interactionType: ERROR_EVENT_TYPE,
        page: {
          error: {
            ...errorMesg,
            code: errorMesg?.code || '',
            type: TYPE[errorMesg?.type] || '',
            source: SOURCE[errorMesg?.source] || '',
            apiURL: errorMesg?.url || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.message || '',
          },
        },
      };
      break;

    case CAPTURE_API_RESPONSE:
      eventProps = {
        event,
        interactionType: API_RESPONSE_INTERACTION_TYPE,
        page: {
          api: {
            code: res?.status || '',
            response: res?.data || '',
            responsetime: res?.responseTime || '',
            apiUrl: res?.url || '',
          },
          error: {
            ...errorMesg,
            type: TYPE[errorMesg?.type] || '',
            source: SOURCE[errorMesg?.source] || '',
            apiURL: errorMesg?.url || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.message || '',
          },
        },
      };
      break;

    case SIGN_IN_NOW:
      eventProps = {
        event,
        interactionType: LINK_CLICK,
        page: {
          pageInfo: {
            pageName: PASSENGER_DETAILS,
            journeyFlow: BOOKING_FLOW,
            siteSection: BOOKING_FLOW,
            language: EN,
          },
          eventInfo: {
            position: SIGN_IN_NOW,
            component: PASSENGER_DETAILS,
          },
          LOB: FLIGHTS,
        },
        user: {
          type: WWWA,
        },
      };
      break;
    case 'error':
      eventProps = {
        event: 'error',
        interactionType: error,
        page: {
          pageInfo: {
            pageName: PASSENGER_DETAILS,
            siteSection: BOOKING_FLOW,
            projectName: 'Skyplus',
          },
          error: {
            code: errorMesg?.code || '',
            type: 'API',
            source: 'API',
            apiURL: errorMesg?.url || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.message || '',
          },
        },
      };
      break;

    case 'uxError':
      eventProps = {
        event,
        interactionType: 'Error',
        page: {
          pageInfo: {
            pageName: PASSENGER_DETAILS,
            siteSection: BOOKING_FLOW,
          },
          error: {
            code: String(errorMesg?.code) || '',
            type: errorMesg.type || '',
            source: errorMesg?.source || '',
            apiURL: errorMesg?.url || '',
            statusCode: errorMesg?.statusCode || '',
            statusMessage: errorMesg?.statusMessage || '',
            displayMessage: errorMesg?.displayMessage || '',
            action: errorMesg?.action || '',
            component: errorMesg?.component || '',
          },
        },
      };
      break;

    case 'warning':
      eventProps = {
        event: 'warning',
        interactionType: warning ? 'Warning' : 'Info',
        page: {
          pageInfo: {
            pageName: PASSENGER_DETAILS,
            siteSection: BOOKING_FLOW,
            projectName: 'Skyplus',
            warningCount: warning ? '1' : '0',
            infoCount: warning ? '0' : '1',
          },
          eventInfo: {
            name: warningMessage,
            position: 'on',
            component,
          },
        },
      };
      break;

    default:
  }

  if (isBookingFlow) {
    eventProps.page.pageInfo = {
      ...eventProps.page.pageInfo,
      ...{
        pageName: PAGENAME_PASSENGER_DETAILS,
        siteSection: BOOKING_FLOW,
        journeyFlow: BOOKING_FLOW,
      },
    };
  } else {
    eventProps.page.pageInfo = {
      ...eventProps.page.pageInfo,
      ...{
        pageName: PAGENAME_PASSENGER_DETAILS_MODIFICATION,
        siteSection: MODIFICATION_FLOW,
        journeyFlow: MODIFICATION_FLOW,
      },
    };
  }

  if (_event === ENTER_PASSENGER_DETAILS) {
    // changing object structure for the google analytics implementation
    const modifiedCustomerData = {
      FFNumber: eventProps.user.FFNumber,
      optedForLoyality: eventProps.user.optedForLoyality,
      optedForWhatsApp: WHATSAPP_OPT_STATUS[eventProps.page.eventInfo.position],
      ...eventProps.user.customer,
    };
    const newEventProps = JSON.parse(JSON.stringify(eventProps));
    delete newEventProps.user;
    delete newEventProps.page;
    delete newEventProps.interactionType;
    const GAData = {
      ...newEventProps,
      ...modifiedCustomerData,
    };

    GAData.event = 'fh_customer';
    window.dataLayer?.push(GAData);
  }

  eventProps.product = {
    productInfo: {
      totalPax: totalCount,
      adultPax: adultCount,
      childPax: childrenCount,
      seniorPax: seniorCitizenCount,
      infantPax: infantCount,
      airportCodePair: journeyDetailsAlphabetically(ssr || journeyData?.journeysDetail),
      sector: journeyDetailsOriginDestination(ssr || journeyData?.journeysDetail),
      categoryFare: getCategoryFare(ssr),
      tripFares: totalFare,
    },
  };

  adobeAnalytic({
    state: { pageType: PAGENAME_PASSENGER_DETAILS },
    commonInfo: {},
    eventProps,
  });
};

const pushAnalytic = (obj) => {
  try {
    pushAnalyticWrapper(obj);
  } catch (error) {
    console.error('passengeredit::error:pushAnalytic', error);
  }
};

export default pushAnalytic;
