import { URLS } from '../constants';
import getSessionToken from '../utils/getSessionToken';
import request from '../utils/request';

export const retrievePnr = async (recordLocator, lastName, flagCheck) => {
  const token = getSessionToken();
  const urlAdd = `${URLS.GET_ITINERARY_CONTACT_US}?recordLocator=${recordLocator}&lastName=${lastName}&processFlag=${flagCheck}`;
  const userKeyPnrLocator = URLS.USER_KEY_ITINERARY_CONTACT_US;

  try {
    return await request(urlAdd, {
      headers: {
        user_key: userKeyPnrLocator,
        Authorization: token,
      },
    }).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
};
