import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
// eslint-disable-next-line import/no-cycle
import request from '../utils/request';
import { API_LIST, DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME } from '../constants';
// eslint-disable-next-line import/no-cycle
import { ddRumErrorPayload, getSessionToken } from '../utils';
import pushDDRumAction from '../utils/ddrumEvent';

export async function getUserSummaryApiData(authUser) {
  const Ffno = authUser?.loyaltyMemberInfo?.FFN;
  const token = getSessionToken();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      Authkey: API_LIST.AUTH_KEY_GET_USER_SUMMARY,
      user_key: API_LIST.USER_KEY_GET_USER_SUMMARY,
    },
  };
  let userSummaryDDPayload = DD_RUM_PAYLOAD;
  const userSummaryDDAction = DD_RUM_EVENTS.USER_SUMMARY_DATA;
  const startTimer = performance.now();
  try {
    const response = await fetch(
      `${API_LIST.GET_USER_SUMMARY}?FFN=${Ffno}`,
      config,
    );
    const getReviewData = await response.json();

    userSummaryDDPayload.apiurl = `${API_LIST.GET_USER_SUMMARY}?FFN=${Ffno}`;
    userSummaryDDPayload.method = 'GET';
    userSummaryDDPayload.mfname = MF_NAME;
    userSummaryDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    userSummaryDDPayload.statusCode = response?.status;

    if ((getReviewData?.error && !(getReviewData?.error?.success)) || !response.ok) {
      userSummaryDDPayload = ddRumErrorPayload(userSummaryDDPayload, getReviewData?.error);

      // push actions to Datadog event listner
      pushDDRumAction(userSummaryDDAction, userSummaryDDPayload);
    } else {
      userSummaryDDPayload.response = getReviewData.data;
      // push actions to Datadog event listner
      pushDDRumAction(userSummaryDDAction, userSummaryDDPayload);
    }

    if (getReviewData?.error && !(getReviewData?.error?.success)) {
      const errorObj = getErrorMsgForCode(getReviewData?.error?.code);
      return ({ success: false, message: errorObj.message || 'something went wrong' });
    }
    return { ...getReviewData.data, success: true };
  } catch (e) {
    userSummaryDDPayload = ddRumErrorPayload(userSummaryDDPayload, e);

    // push actions to Datadog event listner
    pushDDRumAction(userSummaryDDAction, userSummaryDDPayload);

    return {};
  }
}

export async function getAEMData(currentTier) {
  const tier = currentTier?.toLowerCase();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let aemDDPayload = DD_RUM_PAYLOAD;
  const aemDDAction = DD_RUM_EVENTS.AEM_DATA;
  const startTimer = performance.now();

  try {
    const response = await fetch(
      `${API_LIST.DATA_LOYALTY_DASHBOARD}/${tier}.json`,
      config,
    );
    const getReviewData = await response.json();

    aemDDPayload.apiurl = `${API_LIST.DATA_LOYALTY_DASHBOARD}/${tier}.json`;
    aemDDPayload.method = 'GET';
    aemDDPayload.mfname = MF_NAME;
    aemDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    aemDDPayload.statusCode = response?.status;

    if (getReviewData?.error || !response.ok) {
      aemDDPayload = ddRumErrorPayload(aemDDPayload, getReviewData?.error);
    } else {
      aemDDPayload.response = getReviewData.data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(aemDDAction, aemDDPayload);

    return getReviewData.data?.loyaltyDashboardByPath?.item;
  } catch (e) {
    aemDDPayload = ddRumErrorPayload(aemDDPayload, e);
    // push actions to Datadog event listner
    pushDDRumAction(aemDDAction, aemDDPayload);
    return {};
  }
}

export async function getAEMDataForTransactionHistory() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let aemTransactionHistoryDDPayload = DD_RUM_PAYLOAD;
  const aemTransactionHistoryDDAction = DD_RUM_EVENTS.AEM_TRANSACTION_HISTORY;
  const startTimer = performance.now();
  try {
    const response = await fetch(
      `${API_LIST.DATA_TRANSACTION_HISTORY}.json`,
      config,
    );
    const getReviewData = await response.json();

    aemTransactionHistoryDDPayload.apiurl = `${API_LIST.DATA_TRANSACTION_HISTORY}.json`;
    aemTransactionHistoryDDPayload.method = 'GET';
    aemTransactionHistoryDDPayload.mfname = MF_NAME;
    aemTransactionHistoryDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    aemTransactionHistoryDDPayload.statusCode = response?.status;

    if (getReviewData?.error || !response.ok) {
      aemTransactionHistoryDDPayload = ddRumErrorPayload(aemTransactionHistoryDDPayload, getReviewData?.error);
    } else {
      aemTransactionHistoryDDPayload.response = getReviewData.data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(aemTransactionHistoryDDAction, aemTransactionHistoryDDPayload);

    return getReviewData.data?.loyaltyTransactionHistoryByPath?.item;
  } catch (e) {
    aemTransactionHistoryDDPayload = ddRumErrorPayload(aemTransactionHistoryDDPayload, e);
    // push actions to Datadog event listner
    pushDDRumAction(aemTransactionHistoryDDAction, aemTransactionHistoryDDPayload);
    return {};
  }
}

export async function getTransactionHistoryApiData(authUser) {
  const Ffno = authUser?.loyaltyMemberInfo?.FFN;
  const token = getSessionToken();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authkey: API_LIST.AUTH_KEY_GET_USER_SUMMARY,
      Authorization: token,
      user_key: API_LIST.USER_KEY_GET_TRANSACTION_SUMMARY,
    },
  };
  let transactionHistoryDDPayload = DD_RUM_PAYLOAD;
  const transactionHistoryDDAction = DD_RUM_EVENTS.API_TRANSACTION_HISTORY;
  const startTimer = performance.now();
  try {
    const response = await fetch(
      `${API_LIST.GET_TRANSACTION_SUMMARY}?FFN=${Ffno}`,
      config,
    );

    const getTransactionData = await response.json();

    transactionHistoryDDPayload.apiurl = `${API_LIST.GET_TRANSACTION_SUMMARY}?FFN=${Ffno}`;
    transactionHistoryDDPayload.method = 'GET';
    transactionHistoryDDPayload.mfname = MF_NAME;
    transactionHistoryDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    transactionHistoryDDPayload.statusCode = response?.status;

    if (getTransactionData?.error || !response.ok) {
      transactionHistoryDDPayload = ddRumErrorPayload(transactionHistoryDDPayload, getTransactionData?.error);
    } else {
      transactionHistoryDDPayload.response = getTransactionData?.data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(transactionHistoryDDAction, transactionHistoryDDPayload);

    return getTransactionData?.data;
  } catch (e) {
    return {};
  }
}

export async function getRetroClaimData() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let retroClaimDDPayload = DD_RUM_PAYLOAD;
  const retroClaimDDAction = DD_RUM_EVENTS.RETRO_CLAIM;
  const startTimer = performance.now();

  try {
    const response = await fetch(API_LIST.RETRO_CLAIM_API, config);
    const getReviewData = await response.json();

    retroClaimDDPayload.apiurl = API_LIST.RETRO_CLAIM_API;
    retroClaimDDPayload.method = 'GET';
    retroClaimDDPayload.mfname = MF_NAME;
    retroClaimDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    retroClaimDDPayload.statusCode = response?.status;

    if (getReviewData?.error || !response.ok) {
      retroClaimDDPayload = ddRumErrorPayload(retroClaimDDPayload, getReviewData?.error);
    } else {
      retroClaimDDPayload.response = getReviewData.data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(retroClaimDDAction, retroClaimDDPayload);

    return getReviewData.data?.loyaltyRetroClaimByPath?.item;
  } catch (e) {
    retroClaimDDPayload = ddRumErrorPayload(retroClaimDDPayload, e);
    // push actions to Datadog event listner
    pushDDRumAction(retroClaimDDAction, retroClaimDDPayload);
    return {};
  }
}

export const makePnrSearchReq = async (
  pnr,
  lastname,
) => {
  const url = `${
    API_LIST.GET_ITINERARY
  }?recordLocator=${pnr}&lastname=${lastname}`;
  const token = getSessionToken();

  const headers = {
    Authorization: token,
    user_key: API_LIST.USERKEY_ITINERARY_GET,
  };

  try {
    const response = await request(url, { headers }, DD_RUM_EVENTS.PNR_SEARCH);
    if (response?.data?.bookingDetails?.bookingStatus?.toLowerCase() === 'cancelled') {
      return { isError: true, isCancelled: true };
    }
    if (response?.data?.bookingDetails?.isRedeemTransaction) {
      return { isError: true, isRedeemed: true };
    }
    const todayDate = new Date();
    const departureDate = new Date(response?.data?.journeysDetail[0]?.journeydetail?.utcdeparture);
    const last90daysDate = new Date(new Date().setDate(new Date().getDate() - 90));
    if (departureDate < todayDate && departureDate > last90daysDate) {
      return { ...response.data, isValid: true };
    // eslint-disable-next-line sonarjs/no-same-line-conditional
    } if (departureDate > todayDate) {
      return { ...response.data, isValid: false, isFuture: true };
    }
    return { ...response.data, isValid: false };
  } catch ({ ...e }) {
    return { isError: true, ...e };
  }
};

export const retroClaimPost = async (pnr, ffn, firstName, lastName) => {
  const URL = API_LIST.RETRO_CLAIM;
  const token = getSessionToken();
  const payload = {
    pnr,
    ffn,
    firstName,
    lastName,
    isBookingRequired: true,
  };
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.RETRO_CLAIM_USER_KEY,
    },
  };
  let retroClaimRequestDDPayload = DD_RUM_PAYLOAD;
  const retroClaimRequestDDAction = DD_RUM_EVENTS.RETRO_CLAIM_REQUEST;
  const startTimer = performance.now();
  try {
    const response = await fetch(URL, config);
    const data = await response.json();
    retroClaimRequestDDPayload.apiurl = URL;
    retroClaimRequestDDPayload.method = 'POST';
    retroClaimRequestDDPayload.mfname = MF_NAME;
    retroClaimRequestDDPayload.requestbody = payload;
    retroClaimRequestDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    retroClaimRequestDDPayload.statusCode = response?.status;

    if (!data?.responseSuccess?.success && data?.responseSuccess?.error) {
      retroClaimRequestDDPayload = ddRumErrorPayload(retroClaimRequestDDPayload, data.responseSuccess.error);
    } else {
      retroClaimRequestDDPayload.response = data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(retroClaimRequestDDAction, retroClaimRequestDDPayload);

    if (data?.responseSuccess?.success) {
      return { ...data, ...{ isSuccess: true } };
    }
    return data;
  } catch (err) {
    return { isError: true };
  }
};

export async function getVoucherAEMData() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let voucherDDPayload = DD_RUM_PAYLOAD;
  const voucherDDAction = DD_RUM_EVENTS.AEM_VOUCHER;
  const startTimer = performance.now();

  try {
    const response = await fetch(API_LIST.VOUCHER_AEM_DATA, config);
    const getReviewData = await response.json();

    voucherDDPayload.apiurl = API_LIST.RETRO_CLAIM_API;
    voucherDDPayload.method = 'GET';
    voucherDDPayload.mfname = MF_NAME;
    voucherDDPayload.responseTime = (performance.now() - startTimer) / 1000;
    voucherDDPayload.statusCode = response?.status;

    if (getReviewData?.error || !response.ok) {
      voucherDDPayload = ddRumErrorPayload(voucherDDPayload, getReviewData?.error);
    } else {
      voucherDDPayload.response = getReviewData?.data;
    }
    // push actions to Datadog event listner
    pushDDRumAction(voucherDDAction, voucherDDPayload);

    return getReviewData?.data?.loyaltyTierUtilizationByPath.item;
  } catch (e) {
    voucherDDPayload = ddRumErrorPayload(voucherDDPayload, e);
    // push actions to Datadog event listner
    pushDDRumAction(voucherDDAction, voucherDDPayload);
    return {};
  }
}
