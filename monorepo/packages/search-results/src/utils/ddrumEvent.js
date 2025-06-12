import pushDDCustomAction from 'skyplus-design-system-app/dist/des-system/dataDogHelper';
import { URLS } from '../constants';
/**
 * Pushes a Datadog RUM action based on the event type.
 *
 * @param {string} event - The name of the event triggering the action.
 * @param {Object} [payload={}] - The payload associated with the event (can be empty).
 * @throws Will log an error if the event or action is invalid.
 */
const pushDDRumAction = (event, payload = {}) => {
    try {
      // Validate event
      if (!event || typeof event !== 'string') {
        console.error('Invalid or missing "event" parameter.'); // eslint-disable-line
        return;
      }

      // Validate payload
      if (!payload || typeof payload !== 'object') {
        console.error('Invalid or missing "payload" parameter.'); // eslint-disable-line
        return;
      }

      let actionType = '';
      switch (event) {
        case URLS.SEARCH_FLIGHT:
          actionType = 'search-results/ms-api/flight/search get Flight Search Data';
          break;
        case URLS.FARE_CALENDAR:
          actionType = 'search-results/ms-api/v1/getfarecalendar get Fare Calendar data';
          break;
        case URLS.FLIGHT_SELL:
          actionType = 'search-results/ms-api/sellFlight set Sel Flight Data';
          break;
        case URLS.CHANGE_FLIGHT:
          actionType = 'search-results/ms-api/changeFlight  Change Flight Data';
          break;
        case URLS.VALIDATE_PROMOCODE:
          actionType = 'search-results/ms-api/validare promo code';
          break;
        case URLS.SRP_MAIN:
          actionType = 'search-results/aem-api/srp-main get AEM srp main data';
          break;
        case URLS.SRP_ADDITIONAL:
          actionType = 'search-results/aem-api/srp-additional get AEM srp additional data';
          break;
        default:
          actionType = 'No Action found';
        break;
      }

      if (!actionType) {
        console.warn(`Unhandled event: ${event}`);// eslint-disable-line
      }

      // Validate the action before pushing
      try {
        pushDDCustomAction(actionType, { ...payload });
      } catch (error) {
        console.error('Error pushing Datadog RUM action:', error);// eslint-disable-line
      }
    } catch (error) {
      console.error('Error while pushing Datadog RUM action:', error); // eslint-disable-line
    }
  };

  export default pushDDRumAction;
