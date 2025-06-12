import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import { AESEncryptCtr } from 'skyplus-design-system-app/dist/des-system/aes-ctr';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { CONSTANTS, ENCRYPT_VALUE, localStorageKeys, WHATSAPP_COMPONENT, fareTypeList } from '../constants';

const interactions = {
  PAGE_LOAD: 'pageload',
  Link_Button_Click: 'Link/ButtonClick',
  POP_UP: 'Pop Up shown',
  API_RESPONSE: 'API response',
  ERROR: 'Error',
};

const PASSENGER_DETAILS = 'Passenger Details';
const BOOKING_FLOW = 'Booking Flow';

/**
 * @param {object} param0 - contains data and event name
 */

const journeyDetailsAlphabetically = (ssrs) => {
  return ssrs?.map((ssr) => {
    let { origin, destination } = ssr.journeydetail;
    // Ensure the pair is sorted alphabetically
    if (origin > destination) {
      [origin, destination] = [destination, origin];
    }
    return `${origin}-${destination}`;
  }).join('|');
};

const journeyDetailsOriginDestination = (ssrs) => {
  return ssrs?.map((ssr) => {
    const { origin, destination } = ssr.journeydetail;
    return `${origin}-${destination}`;
  }).join('|');
};

const pushAnalyticWrapper = ({ ...obj }) => {
  const { event = '', data = {} } = obj;
  const { _event, response, whatsappState, stateData } = data;

  let eventProps = {};
  let bookingWidget;
  let journeyData;

  const genderArr = response?.genderValues?.map((gen) => (gen === 1 ? 'M' : 'F'));
  const altGenderStr = genderArr?.join('|');

  try {
    bookingWidget = JSON.parse(localStorage.getItem(localStorageKeys.bw_cntxt_val)) || {};
    journeyData = JSON.parse(localStorage.getItem(localStorageKeys.journeyReview)) || {};
  } catch (error) {
    bookingWidget = {};
    journeyData = {};
    // console.error(error);
  }
  const { seatWiseSelectedPaxInformation = {} } = bookingWidget;
  const {
    adultCount = '',
    childrenCount = '',
    infantCount = '',
    seniorCitizenCount = '',
    totalCount = '',
  } = seatWiseSelectedPaxInformation;
  const selectedFareTypes = stateData?.ssr?.map((fare) => fareTypeList[fare?.productClass]);
  const { userFields = [] } = response || {};
  const wheelchairReason1 = [];
  const wheelchairReason2 = [];
  const wheelchairReason3 = [];
  const speechImpaired = [];
  const hearingImpaired = [];
  const visuallyImpaired = [];
  const gender = [];
  const ffNumber = [];
  let saveFutureBooking = 0;
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
  const chosedFromSavedList = String((stateData?.savedPassengers || [])?.length);

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

  const aemError = getErrorMsgForCode();

  switch (_event) {
    case 'pageload': {
      eventProps = {
        event,
        interactionType: interactions.POP_UP,
        page: {
          pageInfo: data.pageInfo,
          eventInfo: {
            name: 'Fare Details',
          },
        },
      };
      break;
    }

    case 'api':
      eventProps = {
        event,
        interactionType: interactions.API_RESPONSE,
        page: {
          pageInfo: {
            projectName: 'Skyplus',
          },
          api: {
            code: 200,
            response: response.responseData,
            responsetime: response.responseTime,
            apiURL: response.url,
          },
        },
      };
      break;

    case 'skipPayment':
      eventProps = {
        event,
        interactionType: interactions.Link_Button_Click,
        page: {
          eventInfo: {
            name: 'Skip to Payment',
            position: whatsappConsent(whatsappState),
            component: PASSENGER_DETAILS,
          },
          pageInfo: {
            pageName: PASSENGER_DETAILS,
            journeyFlow: BOOKING_FLOW,
            siteSection: BOOKING_FLOW,
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
            language: 'en',
          },
          LOB: 'Flights',
        },
        product: {
          productInfo: {
            totalPax: totalCount,
            adultPax: adultCount,
            childPax: childrenCount,
            infantPax: infantCount,
            seniorPax: seniorCitizenCount,
            categoryFare: selectedFareTypes.join('|'),
            airportCodePair: journeyDetailsAlphabetically(stateData?.ssr || journeyData?.journeysDetail),
            sector: journeyDetailsOriginDestination(stateData?.ssr || journeyData?.journeysDetail),
          },
        },
        user: {
          customer: {
            title: AESEncryptCtr(response?.name?.title, '', ENCRYPT_VALUE) || '',
            firstName: AESEncryptCtr(response?.name?.first, '', ENCRYPT_VALUE) || '',
            lastName: AESEncryptCtr(response?.name?.last, '', ENCRYPT_VALUE) || '',
            email: AESEncryptCtr(response?.email, '', ENCRYPT_VALUE) || '',
            phone: AESEncryptCtr(response?.primaryContact, '', ENCRYPT_VALUE) || '',
            gender: !genderStr?.includes('M') && !genderStr?.includes('F') ? altGenderStr : genderStr,
            wheelchairReason1: wheelchairReason1Str,
            wheelchairReason2: wheelchairReason2Str,
            wheelchairReason3: wheelchairReason3Str,
            speechImpaired: speechImpairedStr,
            hearingImpaired: hearingImpairedStr,
            visuallyImpaired: visuallyImpairedStr,
            saveFutureBooking: String(saveFutureBooking),
            chosedFromSavedList,

          },
        },
      };
      break;

    case 'skipSeat':

      eventProps = {
        event,
        interactionType: interactions.Link_Button_Click,
        page: {
          eventInfo: {
            name: 'Skip to Seat',
            position: whatsappConsent(whatsappState),
            component: PASSENGER_DETAILS,
          },
          pageInfo: {
            pageName: PASSENGER_DETAILS,
            journeyFlow: BOOKING_FLOW,
            siteSection: BOOKING_FLOW,
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
            language: 'en',
          },
          LOB: 'Flights',
        },
        product: {
          productInfo: {
            totalPax: totalCount,
            adultPax: adultCount,
            childPax: childrenCount,
            infantPax: infantCount,
            seniorPax: seniorCitizenCount,
            categoryFare: selectedFareTypes.join('|'),
            airportCodePair: journeyDetailsAlphabetically(stateData?.ssr || journeyData?.journeysDetail),
            sector: journeyDetailsOriginDestination(stateData?.ssr || journeyData?.journeysDetail),
          },
        },
        user: {
          customer: {
            title: AESEncryptCtr(response?.name?.title, '', ENCRYPT_VALUE) || '',
            firstName: AESEncryptCtr(response?.name?.first, '', ENCRYPT_VALUE) || '',
            lastName: AESEncryptCtr(response?.name?.last, '', ENCRYPT_VALUE) || '',
            email: AESEncryptCtr(response?.email, '', ENCRYPT_VALUE) || '',
            phone: AESEncryptCtr(response?.primaryContact, '', ENCRYPT_VALUE) || '',
            gender: !genderStr?.includes('M') && !genderStr?.includes('F') ? altGenderStr : genderStr,
            wheelchairReason1: wheelchairReason1Str,
            wheelchairReason2: wheelchairReason2Str,
            wheelchairReason3: wheelchairReason3Str,
            speechImpaired: speechImpairedStr,
            hearingImpaired: hearingImpairedStr,
            visuallyImpaired: visuallyImpairedStr,
            saveFutureBooking: String(saveFutureBooking),
            chosedFromSavedList,

          },
        },
      };
      break;

    case 'error':
      eventProps = {
        event: 'error',
        interactionType: interactions.ERROR,
        page: {
          pageInfo: {
            projectName: 'Skyplus',
          },
          error: {
            code: response.statusCode,
            type: 'API',
            source: 'API',
            apiURL: response.url,
            statusCode: aemError.code,
            statusMessage: aemError.message,
            displayMessage: aemError.message,
          },
        },
      };
      break;

    default:
  }
  if (window?.pageType === CONSTANTS.PASSENGER_PAGETYPE) {
    eventProps.page.pageInfo = {
      ...eventProps.page.pageInfo,
      ...{
        pageName: PASSENGER_DETAILS,
        siteSection: BOOKING_FLOW,
        journeyFlow: BOOKING_FLOW,
      },
    };
  } else {
    eventProps.page.pageInfo = {
      ...eventProps.page.pageInfo,
      ...{
        pageName: 'Passenger Details Modification',
        siteSection: 'Modification Flow',
        journeyFlow: 'Modification Flow',
      },
    };
  }
  adobeAnalytic({
    state: {},
    commonInfo: {},
    eventProps,
  });
};

const analyticEvents = (obj) => {
  try {
    pushAnalyticWrapper(obj);
  } catch (error) {
    // console.log({ error });
    // Error Handling
  }
};

export default analyticEvents;
