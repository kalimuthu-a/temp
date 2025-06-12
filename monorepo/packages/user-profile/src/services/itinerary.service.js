/* eslint-disable consistent-return */
import { URLS } from '../constants';
import getSessionToken from '../utils/getSessionToken';
import request from '../utils/request';

export const getPNRStatus = async () => {
  const token = getSessionToken();
  try {
    return await request(URLS.GET_ITINERARY_CONTACT_US, {
      headers: {
        user_key: URLS.USER_KEY_ITINERARY_CONTACT_US,
        Authorization: token,
      },
    }).then((response) => {
      return response;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Itinerary API call failed: ', error);
  }
};

export const getPNRStatusAemData = async (cityIATA) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await fetch(
      URLS.AEM_GET_PNR_DATA.replace(/\${cityIATA}/g, cityIATA),
      config,
    );
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('IATA details API call failed: ', error);
  }
};

export const getIataData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await fetch(
      URLS.AEM_GET_IATA_DATA,
      config,
    );
    return await response.json();
  } catch (err) {
    console.log('error from AEM data=-=', e);
  }
};
