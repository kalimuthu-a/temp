/* eslint-disable no-return-await */
const RSAEncryption = {
  /**
   * Convert a PEM-formatted key to a Uint8Array
   * @param {string} pem - PEM formatted RSA key
   * @returns {Uint8Array}
   */
  pemToArrayBuffer: (pem) => {
    const base64 = pem.replace(/(-----(BEGIN|END) (PUBLIC|PRIVATE) KEY-----|\n)/g, '');
    const binaryString = atob(base64);
    return new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)));
  },
  /**
   * Import an RSA Public Key (PEM format)
   * @param {string} pemKey - Public key in PEM format
   * @returns {Promise<CryptoKey>}
   */
  importPublicKey: async (pemKey) => {
    const keyBuffer = RSAEncryption.pemToArrayBuffer(pemKey);
    return await window.crypto.subtle.importKey(
      'spki',
      keyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-1' },
      true,
      ['encrypt'],
    );
  },
  /**
   * Import an RSA Private Key (PEM format)
   * @param {string} pemKey - Private key in PEM format
   * @returns {Promise<CryptoKey>}
   */
  importPrivateKey: async (pemKey) => {
    const keyBuffer = RSAEncryption.pemToArrayBuffer(pemKey);
    return await window.crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-1' },
      true,
      ['decrypt'],
    );
  },
  /**
   * Encrypt a message using RSA-OAEP (SHA-1)
   * @param {string} message - Plaintext message
   * @param {CryptoKey} publicKey - Imported RSA public key
   * @returns {Promise<string>} - Base64 encoded ciphertext
   */
  encrypt: async (message, base64Key) => {
    const publicCryptoKey = base64Key || window?.msdv2?.rsapK;
    const publicKey = await RSAEncryption.importPublicKey(publicCryptoKey);
    if (!publicKey) throw new Error('Public key is required for encryption.');
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      encodedMessage,
    );
    return btoa(String.fromCharCode(...new Uint8Array(encryptedData))); // Convert to Base64
  },
  /**
   * Decrypt a message using RSA-OAEP (SHA-1)
   * @param {string} encryptedMessage - Base64 encoded ciphertext
   * @param {CryptoKey} privateKey - Imported RSA private key
   * @returns {Promise<string>} - Decrypted plaintext message
   */
  decrypt: async (encryptedMessage, privateKey) => {
    if (!privateKey) throw new Error('Private key is required for decryption.');
    const binaryData = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0));
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      binaryData,
    );
    return new TextDecoder().decode(decryptedData);
  },
};
export default RSAEncryption;
