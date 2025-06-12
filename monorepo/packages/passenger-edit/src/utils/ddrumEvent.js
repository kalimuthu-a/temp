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
    getPassengerList: 'passenger-edit/api/User initiated Passenger edit page from SRP',
    aemData: 'passenger-edit/aem/AEM data on page load',
    aemAdditionalData: 'passenger-edit/aem/AEM additional data on page load',
    policyConsent: 'passenger-edit/api/Policy consent acceptance',
    addPassengerDetails: 'passenger-edit/api/Add passenger details',
    signUpLoyalty: 'passenger-edit/api/Sign up for loyalty user',
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
