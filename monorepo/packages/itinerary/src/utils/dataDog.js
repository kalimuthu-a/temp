/**
 * Sets user properties in DataDog's Real User Monitoring (RUM) system based on provided user data.
 *
 * @param {Array<Object>} userData - An array of user data objects, each containing `key` and `value` properties.
 * @param {string} userData[].key - The key of the user property to set.
 * @param {string} userData[].value - The value of the user property to set.
 *
 * @example
 * // Example usage
 * const userData = [
 *   { key: 'userId', value: '12345' },
 *   { key: 'userName', value: 'JohnDoe' }
 * ];
 * dataDogOverride(userData);
 *
 * @throws Will log an error to the console if setting user properties in DataDog fails.
 */

const dataDogOverride = (userData) => {
  if (!window.DD_RUM) return;

  window.DD_RUM.onReady(() => {
    try {
      userData.forEach((user) => {
        const { key, value } = user || {};
        if (key && value) {
          window.DD_RUM.setGlobalContextProperty(key, value);
        }
      });
    } catch (error) {
      console.error('Error setting user properties in DataDog:', error);
    }
  });
};

export default dataDogOverride;
