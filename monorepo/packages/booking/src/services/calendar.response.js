export default (() => {
  /**
   * @type {{[key: string]: SSRObject }}
   */
  const cachedResponse = new Proxy(
    {},
    {
      set: (target, key, value) => {
        const targetObj = target;
        targetObj[key] = value;

        const [origin, destination] = key.split('-');

        document.dispatchEvent(
          new CustomEvent('setCalendarResponse', {
            detail: {
              value,
              origin,
              destination,
            },
          }),
        );

        return true;
      },
    },
  );

  return {
    /**
     * @param {string} key
     * @returns {SSRObject}
     */
    getResponse: (key) => cachedResponse[key] || new Map(),
    /**
     * @param {string} key
     * @param {SSRObject} value
     */
    setResponse: (key, value) => {
      delete cachedResponse[key];
      cachedResponse[key] = value;
    },
    flushCache: () => {
      Object.keys(cachedResponse).forEach((key) => {
        delete cachedResponse[key];
      });
    },
  };
})();
