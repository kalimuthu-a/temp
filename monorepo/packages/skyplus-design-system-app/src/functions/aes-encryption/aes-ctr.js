/* eslint-disable */
/**
 * Encrypt a text using AES encryption in Counter mode of operation
 *  - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
 *
 * Unicode multi-byte character safe
 *
 * @param plaintext source text to be encrypted
 * @param password  the password to use to generate a key
 * @param nBits     number of bits to be used in the key (128, 192, or 256)
 * @return          encrypted text
 */

import { Cipher, KeyExpansion } from './aes.js';

export const AESEncryptCtr = (plaintext = '', password = '', nBits = '') => {
  if (!password) {
    password = window.msdv2?.analyticsEncryptionKey;
  }
  const blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits === 128 || nBits === 192 || nBits === 256)) return ''; // standard allows 128/192/256 bit keys
  plaintext = plaintext.encodeUTF8();
  password = password.encodeUTF8();
  // var t = new Date();  // timer

  // use AES itself to encrypt password to get cipher key (using plain password as source for key
  // expansion) - gives us well encrypted key
  const nBytes = nBits / 8; // no bytes in key
  const pwBytes = new Array(nBytes);
  for (var i = 0; i < nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  let key = Cipher(pwBytes, KeyExpansion(pwBytes)); // gives us 16-byte key
  key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

  // initialise counter block (NIST SP800-38A Â§B.2): millisecond time-stamp for nonce in 1st 8 bytes,
  // block counter in 2nd 8 bytes
  const counterBlock = new Array(blockSize);
  const nonce = (new Date()).getTime(); // timestamp: milliseconds since 1-Jan-1970
  const nonceSec = Math.floor(nonce / 1000);
  const nonceMs = nonce % 1000;
  // encode nonce with seconds in 1st 4 bytes, and (repeated) ms part filling 2nd 4 bytes
  for (var i = 0; i < 4; i++) counterBlock[i] = (nonceSec >>> i * 8) & 0xff;
  for (var i = 0; i < 4; i++) counterBlock[i + 4] = nonceMs & 0xff;
  // and convert it to a string to go on the front of the ciphertext
  let ctrTxt = '';
  for (var i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

  // generate key schedule - an expansion of the key into distinct Key Rounds for each round
  const keySchedule = KeyExpansion(key);

  const blockCount = Math.ceil(plaintext.length / blockSize);
  const ciphertxt = new Array(blockCount); // ciphertext as array of strings

  for (let b = 0; b < blockCount; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
    for (var c = 0; c < 4; c++) counterBlock[15 - c] = (b >>> c * 8) & 0xff;
    for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (b / 0x100000000 >>> c * 8);

    const cipherCntr = Cipher(counterBlock, keySchedule); // -- encrypt counter block --

    // block size is reduced on final block
    const blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
    const cipherChar = new Array(blockLength);

    for (var i = 0; i < blockLength; i++) { // -- xor plaintext with ciphered counter char-by-char --
      cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
      cipherChar[i] = String.fromCharCode(cipherChar[i]);
    }
    ciphertxt[b] = cipherChar.join('');
  }

  // Array.join is more efficient than repeated string concatenation
  let ciphertext = ctrTxt + ciphertxt.join('');
  ciphertext = ciphertext.encodeBase64(); // encode in base64

  // alert((new Date()) - t);
  return ciphertext;
};

/**
 * Decrypt a text encrypted by AES in counter mode of operation
 *
 * @param ciphertext source text to be encrypted
 * @param password   the password to use to generate a key
 * @param nBits      number of bits to be used in the key (128, 192, or 256)
 * @return           decrypted text
 */
export const AESDecryptCtr = (ciphertext, password, nBits) => {
  if (!password) {
    password = window.msdv2?.analyticsEncryptionKey;
  }
  const blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits == 128 || nBits == 192 || nBits == 256)) return ''; // standard allows 128/192/256 bit keys
  ciphertext = ciphertext.decodeBase64();
  password = password.encodeUTF8();
  // var t = new Date();  // timer

  // use AES to encrypt password (mirroring encrypt routine)
  const nBytes = nBits / 8; // no bytes in key
  const pwBytes = new Array(nBytes);
  for (var i = 0; i < nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  let key = Cipher(pwBytes, KeyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

  // recover nonce from 1st 8 bytes of ciphertext
  const counterBlock = new Array(8);
  const ctrTxt = ciphertext.slice(0, 8);
  for (var i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

  // generate key schedule
  const keySchedule = KeyExpansion(key);

  // separate ciphertext into blocks (skipping past initial 8 bytes)
  const nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
  const ct = new Array(nBlocks);
  for (var b = 0; b < nBlocks; b++) ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
  ciphertext = ct; // ciphertext is now array of block-length strings

  // plaintext will get generated block-by-block into array of block-length strings
  const plaintxt = new Array(ciphertext.length);

  for (var b = 0; b < nBlocks; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    for (var c = 0; c < 4; c++) counterBlock[15 - c] = ((b) >>> c * 8) & 0xff;
    for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (((b + 1) / 0x100000000 - 1) >>> c * 8) & 0xff;

    const cipherCntr = Cipher(counterBlock, keySchedule); // encrypt counter block

    const plaintxtByte = new Array(ciphertext[b].length);
    for (var i = 0; i < ciphertext[b].length; i++) {
      // -- xor plaintxt with ciphered counter byte-by-byte --
      plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
      plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
    }
    plaintxt[b] = plaintxtByte.join('');
  }

  // join array of blocks into single plaintext string
  let plaintext = plaintxt.join('');
  plaintext = plaintext.decodeUTF8(); // decode from UTF8 back to Unicode multi-byte chars

  // alert((new Date()) - t);
  return plaintext;
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param utf8encode optional parameter, if set to true Unicode string is encoded to UTF8 before
 *                   conversion to base64; otherwise string is assumed to be 8-bit characters
 * @return           base64-encoded string
 */
const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

String.prototype.encodeBase64 = function (utf8encode) { // http://tools.ietf.org/html/rfc4648
  utf8encode = (typeof utf8encode === 'undefined') ? false : utf8encode;
  let o1; let o2; let o3; let bits; let h1; let h2; let h3; let h4; const e = []; let pad = ''; let c; let plain; let
    coded;

  plain = utf8encode ? this.encodeUTF8() : this;

  c = plain.length % 3; // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

  for (c = 0; c < plain.length; c += 3) { // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c + 1);
    o3 = plain.charCodeAt(c + 2);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into b64 string
    e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join(''); // join() is far faster than repeated string concatenation

  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length - pad.length) + pad;

  return coded;
};

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param utf8decode optional parameter, if set to true UTF8 string is decoded back to Unicode
 *                   after conversion from base64
 * @return           decoded string
 */
String.prototype.decodeBase64 = function (utf8decode) {
  utf8decode = (typeof utf8decode === 'undefined') ? false : utf8decode;
  let o1; let o2; let o3; let h1; let h2; let h3; let h4; let bits; const d = []; let plain; let
    coded;

  coded = utf8decode ? this.decodeUTF8() : this;

  for (let c = 0; c < coded.length; c += 4) { // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c + 1));
    h3 = b64.indexOf(coded.charAt(c + 2));
    h4 = b64.indexOf(coded.charAt(c + 3));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >>> 16 & 0xff;
    o2 = bits >>> 8 & 0xff;
    o3 = bits & 0xff;

    d[c / 4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c / 4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c / 4] = String.fromCharCode(o1);
  }
  plain = d.join(''); // join() is far faster than repeated string concatenation

  return utf8decode ? plain.decodeUTF8() : plain;
};

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only) (instance method extending String object).
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @return encoded string
 */
String.prototype.encodeUTF8 = function () {
  // use regular expressions & String.replace callback function for better efficiency
  // than procedural approaches
  let str = this.replace(
    /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
    (c) => {
      const cc = c.charCodeAt(0);
      return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
    },
  );
  str = str.replace(
    /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
    (c) => {
      const cc = c.charCodeAt(0);
      return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
    },
  );
  return str;
};

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 * (instance method extending String object).
 *
 * @return decoded string
 */
String.prototype.decodeUTF8 = function () {
  let str = this.replace(
    /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
    (c) => { // (note parentheses for precence)
      const cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
      return String.fromCharCode(cc);
    },
  );
  str = str.replace(
    /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
    (c) => { // (note parentheses for precence)
      const cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
      return String.fromCharCode(cc);
    },
  );
  return str;
};
