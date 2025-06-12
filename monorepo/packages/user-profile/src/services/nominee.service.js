import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';

import { dateFormats, URLS, BROWSER_STORAGE_KEYS } from '../constants';
import request from '../utils/request';
import Nominee from '../pages/Nominee/Models/Nominee';

/**
 *
 * @param {Array<{firstName: string, lastName: string, dob: string}>} data
 * @returns {Promise<{status: boolean, aemError?: {message: string} }>}
 */

function getFFn() {
  const authUser = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
  return authUser?.loyaltyMemberInfo?.FFN;
}

export const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj?.token || '';
  } catch (error) {
    return '';
  }
};

export const addNominee = async (data) => {
  const url = URLS.GET_NOMINEE;
  const token = getSessionToken();

  try {
    return await request(url, {
      body: JSON.stringify({ nominee: data, ffn: getFFn() }),
      headers: {
        user_key: URLS.GET_NOMINEE_USER_KEY,
        AuthKey: URLS.GET_NOMINEE_AUTH_KEY,
        Authorization: token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  } catch (error) {
    return { status: false, ...error };
  }
};

/**
 *
 * @param {String[]} data
 * @returns {Promise<{status: boolean, aemError?: {message: string} }>}
 */
export const removeNominee = async (data) => {
  const url = new URL(URLS.GET_NOMINEE, window.location.origin);
  const token = getSessionToken();
  url.searchParams.set('FFN', getFFn());
  url.searchParams.set('NomineeID', data.join(','));

  try {
    return await request(url.href, {
      headers: {
        user_key: URLS.GET_NOMINEE_USER_KEY,
        AuthKey: URLS.GET_NOMINEE_AUTH_KEY,
        Authorization: token,
      },
      method: 'DELETE',
    });
  } catch (error) {
    return { status: false, ...error };
  }
};

/**
 * @returns {Promise<{status: boolean, data: Nominee[]}>}
 */
export const getNominee = async () => {
  const url = new URL(URLS.GET_NOMINEE, window.location.origin);
  const token = getSessionToken();

  url.searchParams.set('FFN', getFFn());
  try {
    return await request(url.href, {
      headers: {
        user_key: URLS.GET_NOMINEE_USER_KEY,
        AuthKey: URLS.GET_NOMINEE_AUTH_KEY,
        Authorization: token,
      },
    }).then((response) => {
      return {
        ...response,
        nominees: response.data?.map((nominee) => {
          return new Nominee({
            ...nominee,
            DOB: format(
              parse(nominee.dob, 'yyyy-mm-dd', new Date()),
              dateFormats.dob,
            ),
            isNew: false,
            FirstName: nominee.firstName,
            LastName: nominee.lastName,
            Gender: nominee.gender,
            isValid: true,
          });
        }),
      };
    });
  } catch (error) {
    return { status: false, ...error };
  }
};
