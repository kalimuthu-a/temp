import axios from 'axios';
import Cookies from './cookies';
import { addExpirationDataToToken, refreshAccessToken } from './userToken';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(async (config) => config);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response.status === 401 && !original.__retry) {
      original.__retry = true;
      const token = await refreshAccessToken();
      let tokenWithExpiration = null;
      if (token && token.token) {
        tokenWithExpiration = addExpirationDataToToken(token);
      } else {
        throw new Error(
          'Interceptor: Call to refresh the access token failed.',
        );
      }
      if (
        tokenWithExpiration.token
        && tokenWithExpiration.validTillMilliSeconds
      ) {
        Cookies.set('auth_token', tokenWithExpiration);
      } else {
        throw new Error(
          'Interceptor: Call to refresh the access token failed.',
        );
      }
    }
  },
);
