import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { CONSTANTS } from '../components/constants';

export const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    // console.log(error);
    return '';
  }
};
export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_retrieve_pnr';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    // console.log(error);
    return defaultObj;
  }
};
