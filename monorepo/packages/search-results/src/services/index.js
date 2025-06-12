import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import format from 'date-fns/format';

import { isPast } from 'date-fns';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { URLS, dateFormats, MF_NAME, DD_RUM_PAYLOAD } from '../constants';
import request from '../utils/request';
import pushDDRumAction from '../utils/ddrumEvent';

/**
 *
 * @param {Number} startTime
 * @returns {Number}
 */
const calculateDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return Math.round(duration / 1000);
};

export const searchFlight = async (payload) => {
  return request(
    URLS.SEARCH_FLIGHT,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        User_key: URLS.USER_KEY_FLIGHT,
      },
      credentials: 'include',
    },
    {
      action: 'Page Load',
      displayMessage: 'No Message Displayed',
    },
  );
};

export const sellFlight = async (data) => {
  try {
    return await request(
      URLS.FLIGHT_SELL,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          User_key: URLS.USER_KEY_FLIGHT,
        },
        credentials: 'include',
      },
      {
        action: 'Link/ButtonClick',
        component: 'Next',
      },
    );
  } catch (error) {
    // handling
  }

  return { status: false };
};

export const changeFlight = async (data) => {
  try {
    return await request(
      URLS.CHANGE_FLIGHT,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          User_key: URLS.USER_KEY_CHANGE_FLIGHT,
        },
      },
      {
        action: 'Link/ButtonClick',
        component: 'Next',
      },
    );
  } catch (error) {
    // handling
  }

  return { status: false };
};

export const aemMainData = () => {
  /* Datadog Implementation */
  const startTime = Date.now();
  const searchFlightPayload = { ...DD_RUM_PAYLOAD };
  searchFlightPayload.method = 'GET';
  searchFlightPayload.mfname = MF_NAME;
  searchFlightPayload.requestbody = {};
  return fetch(URLS.SRP_MAIN, {})
    .then((res) => res.json())
    .then((res) => {
      const responsetime = calculateDuration(startTime);
      searchFlightPayload.apiurl = URLS.SRP_MAIN;
      searchFlightPayload.response = res;
      searchFlightPayload.responseTime = responsetime;
      searchFlightPayload.statusCode = res?.status;
      const { errors } = res || { errors: false };
      if (errors) {
        searchFlightPayload.error = errors;
        searchFlightPayload.errorCode = res?.errors?.code || '';
        const { message } = getErrorMsgForCode(res?.errors?.code);
        searchFlightPayload.errorMessage = res?.errors?.message || '';
        searchFlightPayload.errorMessageForUser = message || res?.errors?.message || '';
        pushDDRumAction(URLS.SRP_MAIN, searchFlightPayload);
      }
      pushDDRumAction(URLS.SRP_MAIN, searchFlightPayload);
      return res.data.srpMainByPath.item;
    });
};

export const aemAdditionalData = () => {
  const searchFlightPayload = { ...DD_RUM_PAYLOAD };
  searchFlightPayload.method = 'GET';
  searchFlightPayload.mfname = MF_NAME;
  searchFlightPayload.requestbody = {};
  const startTime = Date.now();
  return fetch(URLS.SRP_ADDITIONAL, {})
    .then((res) => res.json())
    .then((res) => {
      const responsetime = calculateDuration(startTime);
      searchFlightPayload.apiurl = URLS.SRP_ADDITIONAL;
      searchFlightPayload.response = res;
      searchFlightPayload.responseTime = responsetime;
      searchFlightPayload.statusCode = res?.status;
      const { errors } = res || { errors: false };
      if (errors) {
        searchFlightPayload.error = errors;
        searchFlightPayload.errorCode = res?.errors?.code || '';
        const { message } = getErrorMsgForCode(res?.errors?.code);
        searchFlightPayload.errorMessage = res?.errors?.message || '';
        searchFlightPayload.errorMessageForUser = message || res?.errors?.message || '';
        pushDDRumAction(URLS.SRP_ADDITIONAL, searchFlightPayload);
      }
      pushDDRumAction(URLS.SRP_ADDITIONAL, searchFlightPayload);
      return res.data.srpAdditionalByPath.item;
    });
};

export const fetchFareCalendar = async (data) => {
  const { currencyCode, origin, destination } = data;
  let { startDate } = data;

  if (isPast(startDate)) {
    startDate = new Date();
  }

  startDate = format(startDate, dateFormats.yyyyMMdd);

  const mappedresponse = new Map();

  if (startDate === data.endDate) {
    return mappedresponse;
  }

  try {
    const response = await request(
      URLS.FARE_CALENDAR,
      {
        body: JSON.stringify({ ...data, startDate }),
        headers: {
          User_key: URLS.FARE_CALENDAR_USER_KEY,
        },
        method: 'POST',
      },
      {
        action: 'Pop up shown',
        displayMessage: 'No Message Displayed',
      },
    );

    response?.data?.lowFares.forEach((fare) => {
      const dateF = format(new Date(fare.date), dateFormats.yyyyMMdd);
      const calendarKey = `${origin}-${destination}-${dateF}`;

      mappedresponse.set(calendarKey, {
        ...fare,
        date: dateF,
        price: formatCurrency(String(fare.price), currencyCode, {
          maximumFractionDigits: 0,
        }),
        priceValue: fare.price,
        mileConversationRate: response?.data?.mileConversationRate,
      });
    });
  } catch (error) {
    // Error
  }
  return mappedresponse;
};