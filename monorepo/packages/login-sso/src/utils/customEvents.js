export default {
  addListener(el, customEvent, cb) {
    return el?.addEventListener(customEvent, cb);
  },
  removeListener(el, customEvent, cb) {
    return el?.removeEventListener(customEvent, cb);
  },
  dispatch(el, customEvent, data) {
    el?.dispatchEvent(customEvent(data));
  },
  create(customEventType, data) {
    return new CustomEvent(customEventType, data);
  },
};
