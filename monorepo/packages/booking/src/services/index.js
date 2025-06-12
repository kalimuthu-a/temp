/* eslint-disable consistent-return */
/* eslint-disable max-len */
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import pushAdobeAnalytics from '../utils/analyticsEvent';

import { ANALTYTICS, DD_RUM_EVENTS, DD_RUM_PAYLOAD, URLS, dateFormats } from '../constants';
import request from '../utils/request';
import { getRoleDetails } from '../utils';

import CalendarResppnseService from './calendar.response';
import { convertToDate } from '../utils/functions';
import pushDDRumAction from '../utils/ddrumEvent';

export const validatePromoCode = async (data, analyticsData) => {
  try {
    return await request(
URLS.VALIDATE_PROMOCODE,
{
      body: JSON.stringify(data),
      headers: {
        User_key: URLS.VALIDATE_PROMOCODE_KEY,
      },
      method: 'POST',
    },
null,
    DD_RUM_EVENTS.VALIDATE_PROMO,
  ).then((res) => {
      if (!res.Status) {
        pushAdobeAnalytics({
          event: ANALTYTICS.DATA_CAPTURE_EVENTS.UX_ERROR,
          data: {
            errorObj: {
              code: '500',
              type: 'BE Error',
              source: 'MS API',
              apiURL: URLS.VALIDATE_PROMOCODE,
              statusCode: res.StatusCode?.toString(),
              statusMessage: res.Message,
              ...analyticsData,
            },
          },
        });
      }
      return res;
    });
  } catch (error) {
    return { status: false };
  }
};

export const getWidgetData = () => {
  const roleDetails = getRoleDetails();
  const url = formattedMessage(
    '{url}?roleName={roleName}&roleCode={roleCode}',
    {
      url: URLS.BOOKING_WIDGET,
      roleName: roleDetails.roleName || 'Anonymous',
      roleCode: roleDetails.roleCode || 'WWWA',
    },
  );

  return request(
    url,
    {
      headers: {
        user_key: URLS.USER_KEY_BOOKING_WIDGET,
      },
    },
    {
      action: 'Page Load',
      displayMessage: 'No Message Displayed',
    },
    DD_RUM_EVENTS.GET_WIDGET,
  ).then((res) => res.data);
};

export const aemMainData = () => {
  let url = URLS.BW_MAIN;

  if (window.pageType === Pages.SRP || window.pageType === Pages.XPLORE) {
    url = URLS.BW_MAIN_SRP;
  }
  const aemDataDogPayload = DD_RUM_PAYLOAD;
  const startTimer = performance.now();

  return fetch(url, {})
    .then((res) => {
      aemDataDogPayload.apiurl = url;
      aemDataDogPayload.method = 'GET';
      aemDataDogPayload.statusCode = res?.status;
      return res.json();
})
    .then((res) => {
      aemDataDogPayload.responseTime = (performance.now() - startTimer) / 1000;
      if (res?.errors) {
        const errorCatch = getErrorMsgForCode(res?.errors?.code);
        aemDataDogPayload.error = res?.errors;
        aemDataDogPayload.errorMessageForUser = errorCatch?.message || res?.message;
        aemDataDogPayload.errorMessage = res?.error?.message;
        aemDataDogPayload.errorCode = res?.errors?.code;
      } else {
        aemDataDogPayload.response = res.data;
      }
          // push actions to Datadog event listner
    pushDDRumAction(DD_RUM_EVENTS.AEM_DATA, aemDataDogPayload);
      return res.data.bookingWidgetMainByPath.item;
    });
};

export const aemAdditionalData = () => {
  const aemAdditionalDataDogPayload = DD_RUM_PAYLOAD;
  const startTimer = performance.now();

  return fetch(URLS.BW_ADDITIONAL, {})
    .then((res) => {
      aemAdditionalDataDogPayload.apiurl = URLS.BW_ADDITIONAL;
      aemAdditionalDataDogPayload.method = 'GET';
      aemAdditionalDataDogPayload.statusCode = res?.status;
     return res.json();
})
    .then((res) => {
      aemAdditionalDataDogPayload.responseTime = (performance.now() - startTimer) / 1000;
      if (res?.errors) {
        const errorCatch = getErrorMsgForCode(res?.errors?.code);
        aemAdditionalDataDogPayload.error = res?.errors;
        aemAdditionalDataDogPayload.errorMessageForUser = errorCatch?.message || res?.message;
        aemAdditionalDataDogPayload.errorMessage = res?.error?.message;
        aemAdditionalDataDogPayload.errorCode = res?.errors?.code;
      } else {
        aemAdditionalDataDogPayload.response = res.data;
      }
    // push actions to Datadog event listner
    pushDDRumAction(DD_RUM_EVENTS.AEM_ADDITIONAL_DATA, aemAdditionalDataDogPayload);
    return res.data.bookingWidgetAdditionalByPath.item;
});
};

export const aemOffersData = () => {
  const aemOffersDatadogPayload = DD_RUM_PAYLOAD;
  const startTimer = performance.now();
  return fetch(URLS.BW_OFFERS, {})
    .then((res) => {
      aemOffersDatadogPayload.apiurl = URLS.BW_OFFERS;
      aemOffersDatadogPayload.method = 'GET';
      aemOffersDatadogPayload.statusCode = res?.status;
     return res.json();
    })
    .then((res) => {
      aemOffersDatadogPayload.responseTime = (performance.now() - startTimer) / 1000;
      if (res?.errors) {
        const errorCatch = getErrorMsgForCode(res?.errors?.code);
        aemOffersDatadogPayload.error = res?.errors;
        aemOffersDatadogPayload.errorMessageForUser = errorCatch?.message || res?.message;
        aemOffersDatadogPayload.errorMessage = res?.error?.message;
        aemOffersDatadogPayload.errorCode = res?.errors?.code;
      } else {
        aemOffersDatadogPayload.response = res.data;
      }
    // push actions to Datadog event listner
    pushDDRumAction(DD_RUM_EVENTS.AEM_OFFERS_DATA, aemOffersDatadogPayload);
    return res.data.offersListByPath.item.availableOffersList;
    });
};

export const fetchFareCalendar = async (data) => {
  const { currencyCode, origin, destination, startDate } = data;

  // Some Navitaire Optimization
  const futureDays = parseInt(URLS.fareCalLimit, 10);
  const modifiedEndDate = addDays(convertToDate(startDate), futureDays);
  const modifiedFotmattedEndDate = format(
    modifiedEndDate,
    dateFormats.yyyyMMdd,
  );

  const mappedresponse = new Map();
  if (futureDays === 0) {
    return mappedresponse;
  }

  try {
    const response = await request(
      URLS.FARE_CALENDAR,
      {
        body: JSON.stringify({ ...data, endDate: modifiedFotmattedEndDate }),
        headers: {
          User_key: URLS.FARE_CALENDAR_USER_KEY,
        },
        method: 'POST',
      },
      {
        action: 'Pop up shown',
        displayMessage: 'No Message Displayed',
      },
      DD_RUM_EVENTS.CALENDER_FARE,
    );

    response?.data?.lowFares.forEach((fare) => {
      const dateF = format(new Date(fare.date), dateFormats.yyyyMMdd);

      mappedresponse.set(dateF, {
        ...fare,
        date: dateF,
        price: formatCurrency(
          String(fare.price),
          currencyCode,
          {
            notation: 'compact',
            roundingMode: 'trunc',
            maximumFractionDigits: 1,
          },
          'en-US',
        ),
        priceAmount: fare.price,
      });
    });
  } catch (error) {
    // Error
  }

  const key = `${origin}-${destination}`;
  const prevResponse = CalendarResppnseService.getResponse(key);
  const newResponse = new Map([...prevResponse, ...mappedresponse]);

  CalendarResppnseService.setResponse(key, newResponse);

  return mappedresponse;
};

export const popularSearches = async () => {
  try {
    const authToken = JSON.parse(Cookies.get('auth_token') ?? '{}');
    const url = URLS.POPULAR_SEARCHES;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        user_key: URLS.POPULAR_SEARCHES_KEY,
        Authorization: authToken.token,
      },
    };
    return await (await fetch(url, config)).json();
} catch (error) {
    // eslint-disable-next-line no-console
    console.log(error, 'something went wrong salman');
  }
};
