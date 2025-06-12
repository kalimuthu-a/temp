import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { BROWSER_STORAGE_KEYS } from '../constants';

const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    //  console.log(error);
    return '';
  }
};

export default getSessionToken;
