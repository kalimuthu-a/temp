import { URLS } from '../constants';
import getSessionToken from '../utils/getSessionToken';
import request from '../utils/request';

export const IternaryRedirect = async () => {
  const token = getSessionToken();
  const urlAdd = URLS.GET_ITINERARY_CONTACT_US;
  const userKeyItrCheck = URLS.USER_KEY_ITINERARY_CONTACT_US;

  try {
    return await request(urlAdd, {
      headers: {
        user_key: userKeyItrCheck,
        Authorization: token,
      },
    }).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
};
