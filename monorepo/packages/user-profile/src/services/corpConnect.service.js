import { API_LIST } from '.';
import getSessionToken from '../utils/getSessionToken';

// eslint-disable-next-line import/prefer-default-export
export const getCorpConnectData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY_CORP_CONNECT,
    },
  };

  try {
    const startTimer = performance.now();
    const apiUrl = API_LIST.CORP_CONNECT;

    const response = await fetch(apiUrl, config);
    const corpConnectResData = {
      url: response.url,
      status: (await response).status,
      responseTime: (performance.now() - startTimer) / 1000,
    };
    const corpConnectData = await response.json();
    if (corpConnectData.errors) {
      // error handeling
    } else {
      return corpConnectData?.data;
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const getCorpConnectAemData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST.AEM_CORP_CONNECT, config);
    const data = await response.json();
    return data?.data?.accountCorpconnectByPath?.item;
  } catch (e) {
    console.log(e);
  }
};
