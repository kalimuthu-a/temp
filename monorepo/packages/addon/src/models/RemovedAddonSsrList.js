import isEqual from 'lodash/isEqual';
/**
 * Removed Addon SSrList Class
 */
class RemovedAddonSsrList extends Array {
  /**
   *
   * @param {import("../../types/context").RemovedAddonSSR} value
   * @returns {number}
   */
  push(value) {
    const uniq = this.find((item) => isEqual(item, value));

    if (!uniq) {
      super.push(value);
    }

    return this.length;
  }
}

export default RemovedAddonSsrList;
