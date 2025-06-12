/* eslint-disable camelcase */
import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { COOKIE_KEYS } from '../constants/cookieKeys';
import { formatDate } from '.';
import { EVENTS_NAME, AA_CONSTANTS } from './analytic';

const individualPaxCount = (passengers, paxType) => {
  const paxTypes = {
    adult: { passengerTypeCode: 'ADT', discountCode: null },
    children: { passengerTypeCode: 'CHD', discountCode: null },
    seniorCitizen: { passengerTypeCode: 'ADT', discountCode: 'SRCT' },
    infant: { passengerTypeCode: 'INFT', discountCode: null },
  };

  return passengers?.filter(
    (pax) => pax?.passengerTypeCode === paxTypes[paxType].passengerTypeCode
      && pax?.discountCode === paxTypes[paxType].discountCode,
  ).length;
};

export function calculateAgeCategories(data) {
  let childCount = 0;
  let adultCount = 0;
  let seniorCitizenCount = 0;
  const infantCount = 0;

  // Get the current date
  const currentDate = new Date();

  // Iterate over the data and categorize each person based on age
  data.forEach((person) => {
    const birthDate = new Date(person.dateOfBirth);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    // Categorize based on the age
    if (age >= 0 && age <= 18) {
      childCount += 1;
    } else if (age > 18 && age <= 60) {
      adultCount += 1;
    } else if (age > 60 && age <= 120) {
      seniorCitizenCount += 1;
    }
  });

  return {
    totalPax: String(childCount + adultCount + seniorCitizenCount),
    childPax: String(childCount),
    adultPax: String(adultCount),
    seniorPax: String(seniorCitizenCount),
    infantPax: String(infantCount),
  };
}

export function daysUntil(dateStr) {
  const [day, month, year] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day); // month is 0-indexed
  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffInMs = targetDate - currentDate;

  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * pushAnalyticWrapper - It holds the list of events and its details called from MFE
 * @param {object} param0  -  contains data and event name
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const pushAnalyticWrapper = async ({ ...obj }) => {
  // NOSONAR
  const { event = '', data = {} } = obj;
  const {
    _event,
    _eventInfoName = '',
    _componentName = '',
    pnrResponse: { bookingDetails, passengers } = {},
    pageName,
    interactionType,
    position = '',
    visaDetails = {},
    bookingId,
  } = data;

  // Getting Passengers Details
  const adultCount = passengers?.length > 0 ? individualPaxCount(passengers, 'adult') : 0;
  const seniorCitizenCount = passengers?.length > 0
    ? individualPaxCount(passengers, 'seniorCitizen')
    : 0;
  const childrenCount = passengers?.length > 0 ? individualPaxCount(passengers, 'children') : 0;
  const infantCount = passengers?.length > 0 ? individualPaxCount(passengers, 'infant') : 0;
  const totalCount = adultCount + seniorCitizenCount + childrenCount;

  const journeys = passengers?.length > 0 ? passengers?.[0]?.seatsAndSsrs?.journeys : [];

  const authUser = Cookies.get(COOKIE_KEYS.USER, true, true) || {};

  const bookingPnr = String(bookingDetails?.recordLocator);
  const currencyCode = bookingDetails?.currencyCode;

  let sector = '';
  let visaSector = '';
  let departureDate = '';
  const flowTypes = 'Visa Flow';
  const LOB = 'Visa';
  const userTier = authUser?.loyaltyMemberInfo?.tier
    || authUser?.loyaltyMemberInfo?.TierType
    || '';
  const userFFN = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn;

  const rawDataDogString = new URLSearchParams(Cookies.get(COOKIE_KEYS?.DATA_DOG_SESSION_ID) || '');
  const dogSessionId = rawDataDogString?.get('id');

  if (journeys) {
    for (const journey of journeys) {
      const deptCity = journey?.designator?.origin;
      const destCity = journey?.designator?.destination;
      const prefix = departureDate ? '|' : '';
      departureDate += `${prefix}${formatDate(
        journey.designator.departure,
        'DD-MM-YYYY',
      )}`;

      sector += `${sector ? '|' : ''}${deptCity}-${destCity}`;
      visaSector += `${destCity || ''}`;
    }
  }

  let eventProps = {};
  switch (_event) {
    case EVENTS_NAME.VISA_CLICK_REVIEW: {
      eventProps = {
        event: event || '', // visaPageLoad
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName,
            position,
            component: _componentName,
          },
        },
        product: {
          productInfo: {
            pnr: bookingPnr,
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount + infantCount),
            seniorPax: String(seniorCitizenCount),
            sector,
          },
        },
      };
      break;
    }
    case EVENTS_NAME.VISA_STATUS: {
      eventProps = {
        event: event || '',
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName,
            position,
            component: _componentName,
          },
        },
        product: {
          productInfo: {
            pnr: bookingPnr,
            sector,
          },
        },
      };
      break;
    }
    case EVENTS_NAME.VISA_BOOKING_DETAILS: {
      eventProps = {
        event: event || '',
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        product: {
          productInfo: {
            pnr: bookingPnr,
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount),
            infantPax: String(infantCount),
            seniorPax: String(seniorCitizenCount),
            sector,
            visaName: visaDetails?.visaName,
            visaEntryType: visaDetails?.visaEntryType,
            visaType: visaDetails?.visaType,
            visaValidity: visaDetails?.visaValidity,
            visaStay: visaDetails?.visaStay,
            departureDate,
            daysUntilVisa: visaDetails?.daysUntilVisa,
            visaDates: visaDetails?.visaDates,
            bookingId,
          },
        },
      };
      break;
    }
    case EVENTS_NAME.CTA_CLICK: {
      eventProps = {
        event: event || '',
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName,
            position,
            component: _componentName,
          },
        },
        product: {
          productInfo: {
            pnr: bookingPnr,
          },
        },
      };
      break;
    }
    case EVENTS_NAME.CTA_CLICK_NO_PRODUCT: {
      eventProps = {
        event: event || '',
        interactionType: interactionType || AA_CONSTANTS.LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName,
            position,
            component: _componentName,
          },
        },
      };
      break;
    }
    case EVENTS_NAME.VISA_PASSENGERS_PAGE_LOAD: {
      eventProps = {
        event: event || '',
        interactionType: 'Pageload',
        page: {
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
        },
        product: {
          productInfo: {
            pnr: bookingPnr,
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount),
            infantPax: String(infantCount),
            seniorPax: String(seniorCitizenCount),
            sector: visaSector,
            departureDates: departureDate,
          },
        },
      };
      break;
    }

    case EVENTS_NAME.VISA_INITIATED:
      // visa plan next button click
      eventProps = {
        event,
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position,
            component: _componentName,
          },
        },
        product: {
          productInfo: {
            pnr: bookingPnr,
            departureDates: departureDate,
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount + infantCount),
            seniorPax: String(seniorCitizenCount),
            sector: data?.pnrResponse?.sector || '',
          },
        },
      };
      break;
    case EVENTS_NAME.VISA_VIEWED:
      // for SRP page page load event
      eventProps = {
        event,
        interactionType: 'Pageload',
        page: {
          eventInfo: {
            name: _eventInfoName || '',
          },
          pageInfo: {
            searchResultCount: String(visaDetails?.searchResultCount),
          },
        },
        product: {
          productInfo: {
            totalPax: String(visaDetails?.totalPax),
            sector: String(visaDetails?.sector),
          },
        },
      };
      break;
    case EVENTS_NAME.VISA_SELECTED:
      // event handle srp select section
      eventProps = {
        event,
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position,
            component: _componentName,
          },
        },
        product: {
          productInfo: {
            currencyCode: String(visaDetails?.currencyCode) || currencyCode,
            tripFares: String(visaDetails?.tripFares),
            visaName: String(visaDetails?.visaName),
            visaEntryType: String(visaDetails?.visaEntryType),
            visaType: String(visaDetails?.visaType),
            visaValidity: String(visaDetails?.visaValidity),
            visaStay: String(visaDetails?.visaStay),
            visaDelivery: String(visaDetails?.visaDelivery),
            sector: String(visaDetails?.sector),
            departureDates: visaDetails?.departureDate,
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount),
            seniorPax: String(seniorCitizenCount),
          },
        },
      };
      break;
    case EVENTS_NAME.NO_RESULT_FOUND:
      eventProps = {
        event,
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position,
            component: _componentName,
          },
          pageInfo: {
            Reason: visaDetails?.reason || '',
          },
        },
        product: {
          productInfo: {
            currencyCode: visaDetails?.currencyCode || currencyCode,
            sector: String(visaDetails?.sector),
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount),
            seniorPax: String(seniorCitizenCount),
          },
        },
      };
      break;
    case EVENTS_NAME.VISA_MODIFY_FLOW: {
      // visa modify flow
      eventProps = {
        event,
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        product: {
          productInfo: {
            currencyCode: String(currencyCode),
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount + infantCount),
            seniorPax: String(seniorCitizenCount),
            sector: data?.visaDetails?.sector,
            departureDate,
          },
        },
        page: {
          eventInfo: { ...data.eventInfo },
        },
      };
      break;
    }
    case EVENTS_NAME.VISA_PLAN_PAGE_LOAD: {
      // visa plan page load
      eventProps = {
        event: event || '',
        interactionType: 'Pageload',
        product: {
          productInfo: {
            ...visaDetails,
          },
        },
      };
      break;
    }
    case EVENTS_NAME.PAGE_LOAD: {
      eventProps = {
        event: event || '',
        interactionType: 'Pageload',
        product: {
          productInfo: {
            pnr: bookingPnr,
            sector,
          },
        },
      };
      break;
    }
    case EVENTS_NAME.UPLOAD_VISA_LOAD: {
      // page call load with out any data  for upload document , review page , traveller page
      eventProps = {
        event: event || '',
        interactionType: 'Pageload',
      };

      if (data.productInfo) {
        eventProps = {
          ...eventProps,
          product: {
            productInfo: { ...data.productInfo },
          },
        };
      }
      if (data.pageInfo) {
        eventProps = {
          ...eventProps,
          page: {
            pageInfo: {
              ...data.pageInfo,
              journeyFlow: flowTypes,
              pageName,
              siteSection: flowTypes,
            },
          },
        };
      }
      break;
    }

    case EVENTS_NAME.VISA_SUCCESS: {
      eventProps = {
        interactionType: interactionType || 'pageload',
        event: event || '',
        page: {
          eventInfo: {
            name: _eventInfoName || '',
            position,
            component: _componentName,
          },
          pageInfo: {
            ...data.pageInfo,
            pageName,
          },
        },
        product: {
          productInfo: { ...data?.productInfo },
        },
        user: {
          ...(data?.user && { customer: { ...data?.user } }),
        },
      };
      break;
    }
    case EVENTS_NAME.VISA_SELECT_PAX: {
      eventProps = {
        event: event || '',
        interactionType: 'Link/ButtonClick',
        page: {
          pageInfo: {
            platform: window.screen.width < 768 ? 'Mweb' : 'Web',
          },
          eventInfo: {
            name: _eventInfoName,
            position,
            component: _componentName,
          },
        },
        product: {
          productInfo: {
            pnr: data?.pnrResponse?.pnr || '',
            totalPax: String(totalCount),
            adultPax: String(adultCount),
            childPax: String(childrenCount + infantCount),
            seniorPax: String(seniorCitizenCount),
            sector: data?.pnrResponse?.sector || '',
            departureDates: data?.pnrResponse?.departureDates || '',
          },
        },
      };
      break;
    }

    case EVENTS_NAME.VISA_SUCCESS_DOWNLOAD: {
      eventProps = {
        interactionType: 'Link/ButtonClick',
        productInfo: {
          ...data.productInfo,
        },
        page: {
          eventInfo: {
            name: _eventInfoName,
            position,
            component: _componentName,
          },
        },
      };
      break;
    }
    default:
  }

  const commonEvents = {
    page: {
      LOB,
      pageInfo: {
        pageName,
        siteSection: flowTypes,
        journeyFlow: flowTypes,
      },
    },
    user: {
      ...eventProps.user,
      dataDogSessionID: dogSessionId,
      FFNumber: userFFN,
      tier: userTier,
    },
  };

  try {
    adobeAnalytic({
      state: {},
      commonInfo: commonEvents,
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
    console.error('visaSerive::error:pushAnalytic', error); // eslint-disable-line no-console
  }
};
