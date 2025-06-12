/* eslint-disable no-restricted-globals */
import {
  encryptAESForLogin,
  decryptAESForLoginAPI,
  decryptAESForLogin,
} from 'skyplus-design-system-app/dist/des-system/loginEncryption';

const Cookies = {
  get(name = '', parsed = false, decrypted = false) {
    try {
      const cookieValue = this.findCookieValue(name);
      if (!cookieValue) return null;

      let result = cookieValue;
      if (decrypted) result = this.decryptValue(result);
      if (parsed) result = this.parseValue(result);

      return result;
    } catch (error) {
      this.handleError('Error handling cookie retrieval', error);
      return parsed ? {} : '';
    }
  },

  findCookieValue(name) {
    const cookies = document.cookie.split(';');
    const _name = `${name}=`;
    return cookies
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(_name))
      ?.substring(_name.length) || null;
  },

  decryptValue(value) {
    return decryptAESForLogin(value) || decryptAESForLoginAPI(value);
  },

  parseValue(value) {
    try {
      return JSON.parse(value);
    } catch (parseError) {
      this.handleError('Error parsing cookie value', parseError);
      return {};
    }
  },

  handleError(message, error) {
    // eslint-disable-next-line no-console
    console.error(message, error.message);
  },

  remove(name) {
    const cookieDomain = this.getCookieDomain();
    const cookie = this.get(name);
    document.cookie = `${name}=;domain=${cookieDomain}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    return cookie;
  },

  set(name, value, domain, expirationInMs, encrypted = false) {
    const expires = expirationInMs ? `; expires=${this.getExpiryDate(expirationInMs)}` : '';
    const _domain = `; domain=${domain || this.getCookieDomain()}`;
    const cookieValue = encrypted ? encryptAESForLogin(JSON.stringify(value)) : JSON.stringify(value);
    document.cookie = `${name}=${cookieValue}${expires}${_domain};path=/`;
  },

  getExpiryDate(expirationInMs) {
    const date = new Date();
    date.setTime(date.getTime() + expirationInMs);
    return date.toUTCString();
  },

  getCookieDomain() {
    return location.href.includes('goindigo.in') ? '.goindigo.in' : '';
  },
};

export default Cookies;
