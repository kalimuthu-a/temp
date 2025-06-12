import { API_LIST } from '.';
import { USER_TYPES } from '../constants';
import getSessionToken from '../utils/getSessionToken';

const deleteAccountApi = async (body = '') => {
  try {
    const requestData = {
      otp: body,
    };
    const response = await fetch(API_LIST.DELETE_ACCOUNT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getSessionToken(),
        user_key: API_LIST.USER_KEY_DELETE_ACCOUNT,
      },
      body: JSON.stringify(requestData),
    });

    const contentType = response.headers.get('Content-Type');
    const isJson = contentType && contentType.includes('application/json');
    return isJson ? await response.json() : await response.text();
  } catch (error) {
    console.log('API call failed: ', error);
  }
};

const getSettingsAemData = async (userType) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let apiUrl = API_LIST.AEM_SETTINGS_MEMBER;

  if (userType === USER_TYPES?.AGENT) {
    apiUrl = API_LIST.AEM_SETTINGS_AGENT;
  } else if (userType === USER_TYPES?.SME_ADMIN) {
    apiUrl = API_LIST.AEM_SETTINGS_SME_ADMIN;
  } else if (userType === USER_TYPES?.MEMBER) {
    apiUrl = API_LIST.AEM_SETTINGS_MEMBER;
  }
  try {
    const response = await fetch(apiUrl, config);
    const data = await response.json();
    return data?.data?.accountSettingsByPath?.item;
  } catch (e) {
    console.log(e);
  }
};

export { deleteAccountApi, getSettingsAemData };
