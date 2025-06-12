import { URLS } from '../constants';
import getSessionToken from '../utils/getSessionToken';
import request from '../utils/request';

// eslint-disable-next-line import/prefer-default-export
export const getRecentQueries = async ({ email = '', number = '' }) => {
  try {
    return await request(`${URLS.GET_RECENT_QUERURIES_DATA}?Email=${email}&MobileNumber=${number}`, {
      headers: {
        user_key: URLS.USER_KEY_RECENT_QUERURIES,
        Authorization: getSessionToken(),
      },
    }).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
};
