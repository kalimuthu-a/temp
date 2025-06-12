import { API_LIST } from '../services';
import getSessionToken from '../utils/storage';

const makeAddonPostAPI = async (payload) => {
  try {
    const token = getSessionToken();
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USER_KEY_ADDON_SAVE,
      },
      body: JSON.stringify(payload),

    };
    // const addonPostResponse = await (await fetch(API_LIST.ADDON_POST, config)).json();
    const response = await fetch(API_LIST.ADDON_POST, config);
    const addonPostResponse = await response.json();
    return addonPostResponse || {};
  } catch (e) {
    console.log('makeAddonPostAPI::', e);
    return { error: true };
  }
};

export default makeAddonPostAPI;
