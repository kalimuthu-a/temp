/* eslint-disable no-console */
import pushDDCustomAction from 'skyplus-design-system-app/dist/des-system/dataDogHelper';
/**
 * Pushes a Datadog RUM action based on the event type.
 *
 * @param {string} event - The name of the event triggering the action.
 * @param {Object} [payload={}] - The payload associated with the event (can be empty).
 */
const pushDDRumAction = (event, payload = {}) => {
  // Validate input
  if (typeof event !== 'string') {
    console.error('Invalid "event" parameter.');
    return null;
  }
  if (typeof payload !== 'object' || payload === null) {
    console.error('Invalid "payload" parameter.');
    return null;
  }
  // Event-to-action mapping
  // mfname/apiorAEM/ define
  const eventActionMap = {
    flightSSRAddon: 'addon/api/Flight SSR addons',
    aemData: 'addon/aem/AEM data on page load',
    aemAdditionalData: 'addon/aem/AEM additional data on page load',
    passengerDetails: 'addon/api/Passengers details added after addon',
    sellSsr: 'addon/api/Sell SSR api call',
  };

  const action = eventActionMap[event];
  if (!action) {
    console.warn(`Unhandled event: ${event}`);
    return null;
  }
  // Push action to Datadog
  try {
    pushDDCustomAction(action, { ...payload });
  } catch (error) {
    console.error('Error pushing Datadog RUM action:', error);
  }
  return null;
};
export default pushDDRumAction;
