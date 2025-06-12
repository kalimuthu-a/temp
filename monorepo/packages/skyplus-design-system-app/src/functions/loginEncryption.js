/* eslint-disable no-param-reassign */
import * as CryptoJS from 'crypto-js';

/**
 * encryptAESForLogin - Encrypt a derived hd private key with a given pin
 * and return it in Base64 form
 * @param {*} text - text to be encrypted
 * @param {*} key - secret key
 * @returns - Encrypted text
 */
const cryptoKey = window?.msdv2?.encryptionKey;

export const encryptAESForLogin = (text, key = cryptoKey) => {
  key = CryptoJS.enc.Utf8.parse(key);
  // const iv = CryptoJS.enc.Utf8.parse(key);
  const cipher = CryptoJS.AES.encrypt(text, key, {
    // iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return cipher.toString();
};

export const decryptAESForLoginAPI = (text, key = cryptoKey) => {
  try {
    key = CryptoJS.enc.Utf8.parse(key);
    // const iv = CryptoJS.enc.Utf8.parse(key);
    const cipher = CryptoJS.AES.decrypt(text, key, {
      // iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return cipher.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('-error:::::decryptAESForLogin', error);
    return '';
  }
};

export const decryptAESForLogin = (text, key = cryptoKey) => {
  try {
    key = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse(key);
    const cipher = CryptoJS.AES.decrypt(text, key, {
      iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.Pkcs7,
    });
    return cipher.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    try {
      key = CryptoJS.enc.Utf8.parse(key);
      // const iv = CryptoJS.enc.Utf8.parse(key);
      const cipher = CryptoJS.AES.decrypt(text, key, {
        // iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return cipher.toString(CryptoJS.enc.Utf8);
    } catch (error2) {
      // eslint-disable-next-line no-console
      console.error('-error2:::::decryptAESForLogin', error2);
    }
    // eslint-disable-next-line no-console
    console.error('-error:::::decryptAESForLogin', error);
    return '';
  }
};
