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
    onBWSubmit: 'booking/api/User initiated Flight Booking Home Screen',
    validatePromo: 'booking/api/Validating promo code',
    widgetData: 'booking/api/Get widget data',
    calenderFare: 'booking/api/Get calender fare',
    aemData: 'booking/aem/Get AEM data',
    aemAdditionalData: 'booking/aem/Get Additonal AEM data',
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
