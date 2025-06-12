/**
 * Pushes a custom action to Datadog RUM if available.
 *
 * @param {string} action - The name of the action to log.
 * @param {Object} [payload={}] - The payload associated with the action (can be empty).
 * @param {string} [payload.key] - Example of a key in the payload (adjust this as needed).
 *
 * @throws Will throw an error if the action is missing or if there's an issue pushing the custom action.
 */
const pushDDCustomAction = (action, payload = {}) => {
  // for testing purpose only. remove before moving to production
  console.log('vv', { action, payload }); // eslint-disable-line 
  try {
    // Validate that action and payload are provided
    if (!action || typeof action !== 'string') {
      console.error('Invalid or missing "action" parameter.'); // eslint-disable-line 
      return;
    }

    if (!payload || typeof payload !== 'object') {
      console.error('Invalid or missing "payload" parameter.'); // eslint-disable-line 
      return;
    }

    if (typeof window !== 'undefined' && window.DD_RUM && typeof window.DD_RUM.onReady === 'function') {
      window.DD_RUM.onReady(() => {
        if (typeof window.DD_RUM.addAction === 'function') {
          window.DD_RUM.addAction(action, { ...payload });
        } else {
          console.warn('DD_RUM addAction method is not available.'); // eslint-disable-line 
        }
      });
    } else {
      console.warn('DD_RUM or onReady is not available.'); // eslint-disable-line 
    }
  } catch (error) {
    console.error('Error while pushing DD custom action:', error); // eslint-disable-line 
  }
};

export default pushDDCustomAction;
