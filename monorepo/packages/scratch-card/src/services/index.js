/* eslint-disable no-console */
/* eslint-disable sonarjs/prefer-immediate-return */
/* eslint-disable consistent-return */
// services - API calls
// use only JS fetch to make API calls.
import { encryptAESForLogin } from 'skyplus-design-system-app/src/functions/loginEncryption';
import { ddRumErrorPayload, getEnvObj, getSessionToken, getSessionUser } from '../utils';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants';
import pushDDRumAction from '../utils/ddrumEvent';

let API_LIST = {};

const envObj = getEnvObj();

const token = getSessionToken();

if (Object.keys(envObj).length > 0) {
  API_LIST = {
    ...envObj,

  };
}
export const scratchCardCouponAPIData = async () => {
  let scratchCardDDPayload = DD_RUM_PAYLOAD;
  const scratchCardDDAction = DD_RUM_EVENTS.GET_SCRATCH_CARD_DATA;
  try {
   
    const url = API_LIST.GET_COUPONS;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        user_key: API_LIST.USER_KEY_SCRATCH_CARD,
      },
    };

    const startTimer = performance.now();

    const response = await fetch(url, config);

    scratchCardDDPayload.apiurl = url;
    scratchCardDDPayload.method = 'GET';
    scratchCardDDPayload.mfname = MF_NAME;
    scratchCardDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    scratchCardDDPayload.statusCode = response?.status;

    const data = await response.json();
    if (data?.errors || !response.ok) {
      scratchCardDDPayload = ddRumErrorPayload(scratchCardDDPayload, data?.errors);
    } else {
      scratchCardDDPayload.response = data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(scratchCardDDAction, scratchCardDDPayload);
    return data;
  } catch (error) {
    scratchCardDDPayload = ddRumErrorPayload(scratchCardDDPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(scratchCardDDAction, scratchCardDDPayload);
    console.log(error);
  }
};

export const scratchCardAEMData = async () => {
  let aemDDPayload = DD_RUM_PAYLOAD;
  const aemDDAction = DD_RUM_EVENTS.AEM_DATA;
  const startTimer = performance.now();

  try {
    const url = API_LIST.SCRATCH_CARD_AEM_DATA;
    const TOKEN = getSessionToken();
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: TOKEN,
        User_key: API_LIST.USER_KEY_SCRATCH_CARD,
      },
    };
    const response = await fetch(url, config);

    aemDDPayload.apiurl = url;
    aemDDPayload.method = 'GET';
    aemDDPayload.mfname = MF_NAME;
    aemDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    aemDDPayload.statusCode = response?.status;

    if (!response.ok) {
      // push actions to Datadog event listner
      pushDDRumAction(aemDDAction, aemDDPayload);
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data?.errors || !response.ok) {
      aemDDPayload = ddRumErrorPayload(aemDDPayload, data?.errors);
    } else {
      aemDDPayload.response = data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(aemDDAction, aemDDPayload);
    return data;
  } catch (error) {
    aemDDPayload = ddRumErrorPayload(aemDDPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(aemDDAction, aemDDPayload);
    console.log(error);
  }
};
export const cardScratched = async (payload) => { // eslint-disable-line consistent-return
  let couponStatusDDPayload = DD_RUM_PAYLOAD;
  const couponStatusDDAction = DD_RUM_EVENTS.COUPON_DATA;
  const startTimer = performance.now();

  try {
    const url = API_LIST.COUPON_STATUS;
    const headers = new Headers();
    headers.append('Authorization', token);
    headers.append('User_Key', API_LIST.USER_KEY_SCRATCH_CARD);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlencoded = new URLSearchParams();
    urlencoded.append('EncryptedPayload', payload);
    const config = {
      body: urlencoded.toString(),
      headers,
      method: 'POST',
    };
    const response = await fetch(url, config);

    couponStatusDDPayload.apiurl = url;
    couponStatusDDPayload.method = 'GET';
    couponStatusDDPayload.mfname = MF_NAME;
    couponStatusDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    couponStatusDDPayload.statusCode = response?.status;

    if (!response.ok) {
      // push actions to Datadog event listner
      pushDDRumAction(couponStatusDDAction, couponStatusDDPayload);
      throw new Error('Failed to update scratched status');
    }

    const data = await response.json();

    if (data?.errors || !response.ok) {
      couponStatusDDPayload = ddRumErrorPayload(couponStatusDDPayload, data?.errors);
    } else {
      couponStatusDDPayload.response = data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(couponStatusDDAction, couponStatusDDPayload);
    return data;
  } catch (error) {
    couponStatusDDPayload = ddRumErrorPayload(couponStatusDDPayload, error);
    // push actions to Datadog event listner
    pushDDRumAction(couponStatusDDAction, couponStatusDDPayload);
    console.log(error);
  }
};
