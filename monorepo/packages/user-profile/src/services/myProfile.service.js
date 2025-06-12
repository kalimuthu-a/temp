import getSessionToken from '../utils/getSessionToken';
import { API_LIST } from '.';

const getMyProfileApi = async () => {
  try {
    const response = await fetch(API_LIST.GET_MY_PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getSessionToken(),
        user_key: API_LIST.USER_KEY_GET_MY_PROFILE,
      },
    });
    return await response.json();
  } catch (error) {
    console.log('API call failed: ', error);
  }
};

const updateMyProfileApi = async (profileData) => {
  try {
    const response = await fetch(API_LIST.UPDATE_MY_PROFILE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getSessionToken(),
        user_key: API_LIST.USER_KEY_UPDATE_MY_PROFILE,
      },
      body: JSON.stringify(profileData), // Attach the request body
    });

    return await response.json();
  } catch (error) {
    console.log('API call failed: ', error);
  }
};

const getCountryList = async () => {
  try {
    const response = await fetch(API_LIST.COUNTRY_LIST, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: getSessionToken(),
        user_key: API_LIST.USER_KEY_COUNTRY_LIST,
      },
    });
    return await response.json();
  } catch (error) {
    console.log('Retrive Country List API call failed: ', error);
  }
};
const getStateList = async () => {
  try {
    const response = await fetch(API_LIST.STATE_LIST, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    return await response.json();
  } catch (error) {
    console.log('Retrive state List API call failed: ', error);
  }
};

const getMyProfileAemData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST.AEM_MY_PROFILE_MEMBER, config);
    const data = await response.json();
    return data?.data?.accountDetailsByPath?.item;
  } catch (e) {
    console.log(e);
  }
};

export { getMyProfileApi, updateMyProfileApi, getCountryList, getStateList, getMyProfileAemData };
