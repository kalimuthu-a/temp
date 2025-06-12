import pushDDCustomAction from 'skyplus-design-system-app/dist/des-system/dataDogHelper';
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
      case window._env_itinerary.GET_ITINERARY:
        actionType = 'itinerary/ms-api/getItinerary Get Itinerary Data';
        break;
      case window._env_itinerary.UPDATE_CONTACT:
        actionType = 'itinerary/ms-api/updateContact Update contact details';
        break;
      case window._env_itinerary.WHATSAPP_OPT:
        actionType = 'itinerary/ms-api/whatsappOpt WHATSAPP OPT';
        break;
      case window._env_itinerary.CANCEL_BOOKING:
        actionType = 'itinerary/ms-api/cancelBooking Cancel Booking';
        break;
      case window._env_itinerary.GET_SSR_LIST_ABBREVIATION:
        actionType = 'itinerary/ms-api/srrListAbbrevation get ssr list abbrevation';
        break;
      case window._env_itinerary.GET_FEECODE_LIST_ABBREVIATION:
        actionType = 'itinerary/ms-api/getFeeCodeListAbbrevation get free code list abbreavation';
        break;
      case window._env_itinerary.MODIFY_RESET_BOOKING:
        actionType = 'itinerary/ms-api/modifyResetBooking Reset the modifiy booking';
        break;
      case window._env_itinerary.EMAIL_BOARDINGPASS:
        actionType = 'itinerary/ms-api/emailBoardingPass get Boarding on Email';
        break;
      case window._env_itinerary.OTP_INITIATE:
        actionType = 'itinerary/ms-api/otpInitiate get OTP';
        break;
      case window._env_itinerary.FINISH_BOOKING:
        actionType = 'itinerary/ms-api/finshBooking Get Finish booking data';
        break;
      case window._env_itinerary.UNDO_CHECKIN:
        actionType = 'itinerary/ms-api/undoCheckin get undo checking data';
        break;
      case window._env_itinerary.CANCEL_FLIGHT:
        actionType = 'itinerary/ms-api/cancelFlight get Cancel flight data';
        break;
      case window._env_itinerary.NO_SHOW_REFUND:
        actionType = 'itinerary/ms-api/NoShowRefund get No Show Refund data';
        break;
      case window._env_itinerary.API_HOTEL_SEARCH:
        actionType = 'itinerary/ms-api/hotelSearch get hotels data';
        break;
      case window._env_itinerary.POLICY_CONSENT:
        actionType = 'itinerary/ms-api/policyConsent Get Policy Consent Data';
        break;
      case window._env_itinerary.CONFIRM_PAYMENT_API:
        actionType = 'search-results/aem-api/confirmPayment Get Confirm payment api data';
        break;
      case window._env_itinerary.FFNUMBER_VELIDATE:
        actionType = 'search-results/aem-api/ffNumberValidate get FF Number Validate data';
        break;
      case window._env_itinerary.FFNUMBER_UPDATE:
        actionType = 'search-results/aem-api/ffNumberUpdate get FF Number Validate data';
        break;
      case window._env_itinerary.FARE_MASKING:
        actionType = 'search-results/aem-api/fareMasking get Fare masking Data';
        break;
      case window._env_itinerary.GET_ITINERARY_AEM_CONTENT:
        actionType = 'search-results/aem-api/getItineraryMainAEMContent get itinerary Main AEM content';
        break;
      case window._env_itinerary.GET_ITINERARY_ADDITIONAL_AEM_CONTENT:
        actionType = 'search-results/aem-api/getItineraryAdditionalAEMContent get itinerary Additional AEM content';
        break;
      case window._env_itinerary.GET_ITINERARY_CONFIRMATION_DATA_AEM_CONTENT:
        actionType = 'search-results/aem-api/confirmationAEMContent get itinerary Confirmation AEM content';
        break;
      case window._env_itinerary.GET_ITINERARY_CONFIRMATION_ADDITIONAL_AEM_CONTENT:
        actionType = 'search-results/aem-api/confirmAdditionalAEMContent get itinerary Confirm Additional AEM content';
        break;
      case window._env_itinerary.EXPLORE_CITY:
        actionType = 'search-results/aem-api/exploreCity get explore cities data';
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
