/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-mutable-exports */
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants/constants';
import getEnvObj from '../utils';
import pushDDRumAction from '../utils/ddrumEvent';
import getSessionToken from '../utils/storage';

let API_LIST;

const envObj = getEnvObj();
if (Object.keys(envObj).length > 0
    && envObj.API_PASSENGER_GET) {
  // make sure the one mandatory key,value should be there
  API_LIST = {
    PASSENGER_GET: envObj.API_PASSENGER_GET,
    PASSENGER_POST: envObj.API_PASSENGER_POST,
    USER_KEY_FETCH: envObj.USER_KEY_FETCH,
    USER_KEY_SAVE: envObj.USER_KEY_SAVE,
    ADDON_POST: envObj.API_ADDON_POST,
    USER_KEY_ADDON_SAVE: envObj.USER_KEY_ADDON_SAVE,
    PE_MAIN_DATA: envObj.PE_MAIN_DATA,
    PE_ADDITIONAL_DATA: envObj.PE_ADDITIONAL_DATA,
    POLICY_CONSENT: envObj.POLICY_CONSENT,
    USER_KEY_PRIVACY_POLICY: envObj.USER_KEY_PRIVACY_POLICY,
    LOYALTY_SIGNUP: envObj.API_CREATE_USER_LOYALTY,
    USER_KEY_LOYALTY: envObj.USER_KEY_LOYALTY,
    POLICY_CONSENT_GET: envObj.POLICY_CONSENT_GET,
    CALC_IBC_FARE: envObj.CALC_IBC_FARE,
    USER_KEY_IBC_CALC: envObj.USER_KEY_IBC_CALC, 
    VOUCHER_DETAILS_GET: envObj.VOUCHER_DETAILS_GET, 
    VOUCHER_AUTH_KEY: envObj.VOUCHER_AUTH_KEY,
    VOUCHER_USER_KEY: envObj.VOUCHER_USER_KEY,
  };
}

const makePrivacyPostApi = async (payload) => {
  // DataDog for POLICY CONSENT
  const action = DD_RUM_EVENTS.POLICY_CONSENT;
  const policyConsentpayload = DD_RUM_PAYLOAD;
  try {
    const token = getSessionToken();
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USER_KEY_PRIVACY_POLICY,
      },
      body: JSON.stringify(payload),

    };
    const startTimer = performance.now();

    policyConsentpayload.method = 'POST';
    policyConsentpayload.requestbody = payload;
    policyConsentpayload.mfname = MF_NAME;

    const response = await fetch(API_LIST.POLICY_CONSENT, config);

    policyConsentpayload.responseTime = (performance.now() - startTimer) / 1000;

    const PrivacyPolicyResponse = await response.json();

    policyConsentpayload.apiurl = API_LIST.POLICY_CONSENT;
    policyConsentpayload.statusCode = response.status;

    if (PrivacyPolicyResponse?.data) {
      policyConsentpayload.response = PrivacyPolicyResponse?.data;
    } else if (PrivacyPolicyResponse?.errors || !response.ok) {
      const error = getErrorMsgForCode(PrivacyPolicyResponse?.errors?.code);
      policyConsentpayload.error = PrivacyPolicyResponse.errors;
      policyConsentpayload.errorCode = PrivacyPolicyResponse.errors?.code;
      policyConsentpayload.errorMessage = PrivacyPolicyResponse.errors?.message;
      policyConsentpayload.errorMessageForUser = error?.message;
    }
    // push actions to Datadog event listner | policy consent
    pushDDRumAction(action, policyConsentpayload);
    return PrivacyPolicyResponse || {};
  } catch (e) {
    const error = getErrorMsgForCode(e?.code);

    policyConsentpayload.errorMessageForUser = error?.message;
    policyConsentpayload.errorCode = e?.code;
    policyConsentpayload.errorMessage = e?.message;

    // push actions to Datadog event listner  | policy consent
    pushDDRumAction(action, policyConsentpayload);

    // eslint-disable-next-line no-console
    console.log(e, 'error');
    return {};
  }
};

const getIbcCalcFare = async (ibcParam) => {
  try {
    return await fetch(`${API_LIST.CALC_IBC_FARE}?ibc=${ibcParam}`, {
      headers: {
        user_key: API_LIST.USER_KEY_IBC_CALC, 
        Authorization: getSessionToken(),
      },
    }).then((response) => {
      return response.json();
    }).then((res) => {
      return res;
    });
  } catch (error) {
    return error;
  }
};

const getIbcVoucherDetails = async (ffn, bookingDate) => {
  try {
    return await fetch(`${(API_LIST.VOUCHER_DETAILS_GET)}?FFN=${ffn}&bookingDate=${bookingDate}`, {
      headers: {
        AuthKey: API_LIST.VOUCHER_AUTH_KEY,
        Authorization: getSessionToken(),
        user_key: API_LIST.VOUCHER_USER_KEY,
      },
    }).then((response) => {
      return response.json();
    }).then((res) => {
      return res;
    });
  } catch (error) {
    return error;
  }
};

export const ENVCONFIG = {
  ADDON: '/bookings/passenger-edit.html',
};

export { API_LIST, makePrivacyPostApi, getIbcCalcFare, getIbcVoucherDetails };
