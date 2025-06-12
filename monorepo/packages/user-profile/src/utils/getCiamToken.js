import { BROWSER_STORAGE_KEYS } from '../constants';

const getCiamToken = () => {
  try {
    const refreshTokenFromLocalStorage = localStorage.getItem(BROWSER_STORAGE_KEYS.CIAM_REFRESH_TOKEN);
    if (refreshTokenFromLocalStorage) {
      const refreshToken = JSON.parse(refreshTokenFromLocalStorage);
      return refreshToken.refreshCiamToken;
    }
    return '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing CIAM refresh token:', error.message);
    return ''; // Return empty string in case of an error
  }
};

export default getCiamToken;
