import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { BROWSER_STORAGE_KEYS } from '../constants';

const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj?.token || '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return '';
  }
};

export default getSessionToken;
