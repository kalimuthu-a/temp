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
    getJournies: 'web-checkin/api/Get journies data',
    getPassengerHealth: 'web-checkin/api/Get passengers health data',
    getItineraryData: 'web-checkin/api/Get itinerary data',
    getAemData: 'web-checkin/aem/Get AEM data',
    getSsrData: 'web-checkin/aem/Get AEM data',
    getDangerousGoods: 'web-checkin/api/Get goods data (dangerous)',
    checkingBoardpass: 'web-checkin/api/Get checkin boarding pass',
    aemCheckinMaster: 'web-checkin/aem/Get checkin master aem data',
    aemCheckinPassenger: 'web-checkin/aem/Get AEM data for checkin passengers',
    getPNR: 'web-checkin/api/Get api data for PRN',
    getBoardingPass: 'web-checkin/api/Get boarding pass',
    getCountriesData: 'web-checkin/api/Get countries data',
    policyConsent: 'web-checkin/api/Get policy consent from user',
    postPassengerHealth: 'web-checkin/api/Post passengers health data',
    postManualCheckin: 'web-checkin/api/Post manual checkin data',
    undoManualCheckin: 'web-checkin/api/Undo manual checkin',
    postTravelDocuments: 'web-checkin/api/Post travel documents of passengers',
    sendEmailBoardingPass: 'web-checkin/api/Send boarding pass to email',
    getBookingList: 'web-checkin/api/Get booking list',
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
