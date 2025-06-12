/* eslint-disable no-console */
import { COOKIE_KEYS } from '../constants/cookieKeys';
import Cookies from './cookies';
import { getEnvObj } from './utils';

export const getPolicyName = () => {
  return Cookies.get(COOKIE_KEYS.CIAM_POLICY, true, true);
};
export const loginAemLabels = async () => {
  const envObj = getEnvObj() || {};

  try {
    const response = await fetch(envObj.LOGIN_AEM_DATA);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching login AEM labels:', error);
    return null;
  }
};
