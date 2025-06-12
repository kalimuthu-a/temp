import { API_LIST } from '.';
import getSessionToken from '../utils/getSessionToken';

// eslint-disable-next-line import/prefer-default-export
export const getIndigoCash = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY_INDIGO_CASH,
    },
  };

  try {
    const startTimer = performance.now();
    const apiUrl = API_LIST.INDIGO_CASH;

    const response = await fetch(apiUrl, config);
    const indigoCashResData = {
      url: response.url,
      status: (await response).status,
      responseTime: (performance.now() - startTimer) / 1000,
    };
    const indigoCashData = await response.json();
    if (indigoCashData.errors) {
      // error handeling
    } else {
      return indigoCashData.data;
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const getIndigoCashAemData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST.AEM_INDIGO_CASH, config);
    const data = await response.json();
    return data?.data?.accountIndigocashByPath?.item;
  } catch (e) {
    console.log(e);
  }
};
