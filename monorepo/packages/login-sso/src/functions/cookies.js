/* eslint-disable no-restricted-globals */
import {
  encryptAESForLogin,
  decryptAESForLoginAPI,
  decryptAESForLogin,
} from 'skyplus-design-system-app/dist/des-system/loginEncryption';

const Cookies = {
  get(name = '', parsed = false, decrypted = false) {
    try {
      const cookies = document.cookie.split(';');
      const cookieValue = this.findCookieValue(cookies, name);

      if (cookieValue) {
        let result = cookieValue;

        if (decrypted) {
          result = this.decryptValue(result);
        }
        return parsed ? JSON.parse(result) : result;
      }
    } catch (error) {
      return parsed ? {} : '';
    }

    return null;
  },

  findCookieValue(cookies, name) {
    const _name = `${name}=`;
    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith(_name)) {
        return trimmedCookie.substring(_name.length);
      }
    }
    return null; // Return null if not found
  },

  decryptValue(value) {
    let decryptedValue = decryptAESForLogin(value);
    if (!decryptedValue) {
      decryptedValue = decryptAESForLoginAPI(value);
    }
    return decryptedValue;
  },
  remove(name) {
    let cookieDomain = '';
    if (location.href.includes('goindigo.in')) {
      cookieDomain = '.goindigo.in';
    }
    const cookie = Cookies.get(name);
    document.cookie = `${name}=;domain=${cookieDomain}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    return cookie;
  },
  set(name, value, domain, expirationInMs, encrypted = false) {
    let expires = '';
    let _domain = '';
    if (expirationInMs) {
      const date = new Date();
      date.setTime(date.getTime() + expirationInMs);
      expires = `; expires=${date.toUTCString()}`;
    }
    if (domain) {
      _domain = `; domain=${domain}`;
    } else {
      let cookieDomain = '';
      if (location.href.includes('goindigo.in')) {
        cookieDomain = '.goindigo.in';
      }
      _domain = `; domain=${cookieDomain}`;
    }
    let cookieValue = JSON.stringify(value);
    if (encrypted) {
      cookieValue = encryptAESForLogin(cookieValue);
    }
    document.cookie = `${name}=${cookieValue}${expires}${_domain};path=/`;
  },
};

export default Cookies;
