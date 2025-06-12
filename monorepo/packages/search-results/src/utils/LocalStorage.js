class LocalStorage {
  /**
   * @param {string} key
   * @param {any} defaultValue
   * @returns {string | null}
   * @memberof LocalStorage
   * @static
   */

  static get(key, defaultValue = null) {
    return localStorage.getItem(key) ?? defaultValue;
  }

  /**
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   * @memberof LocalStorage
   * @static
   */
  static getAsJson(key, defaultValue = []) {
    try {
      return JSON.parse(this.get(key)) ?? defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   * @param {boolean} asJson
   * @returns {void}
   * @memberof LocalStorage
   * @static
   */
  static set(key, value, asJson = true) {
    localStorage.setItem(key, asJson ? JSON.stringify(value) : value);
  }

  static remove(key) {
    localStorage.removeItem(key);
  }
}

export default LocalStorage;
