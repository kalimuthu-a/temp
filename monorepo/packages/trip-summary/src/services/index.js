// services - API calls
// use only JS fetch to make API calls.

import feeCodeMapping from '../mock/fee';
import { getEnvObj, getSessionToken } from '../utils';

let API_LIST = {
  GET_REVIEW_SUMMARY: '',
  USER_KEY_GET_REVIEW_SUMMARY: '',
  USERKEY_BOOKING: '',
  GET_SSR_LIST_ABBREVIATION: '',
  GET_FEECODE_LIST_ABBREVIATION: '',
  AEM_FARESUMMARY_DATA: '/content/api/s6web/in/en/v1/fs-main.json',
  AEM_TRIPSUMMARY_DATA: '/content/api/s6web/in/en/v1/rs-main.json',
  AEM_TRIPSUMMARY_ADDITIONAL_DATA: '/content/api/s6web/in/en/v1/rs-additional.json',
};
const envObj = getEnvObj();
// make sure the one mandatory key,value should be there
if (Object.keys(envObj).length > 0 && envObj.API_REVIEWSUMMARY_GET) {
  API_LIST = {
    GET_REVIEW_SUMMARY: envObj.API_REVIEWSUMMARY_GET,
    USER_KEY_GET_REVIEW_SUMMARY: envObj.USER_KEY_REVIEWSUMMARY_GET,
    GET_SSR_LIST_ABBREVIATION: envObj.GET_SSR_LIST_ABBREVIATION,
    GET_FEECODE_LIST_ABBREVIATION: envObj.GET_FEECODE_LIST_ABBREVIATION,
    USERKEY_BOOKING: envObj.USERKEY_BOOKING,
    AEM_FARESUMMARY_DATA: envObj.AEM_FARESUMMARY_DATA,
    AEM_TRIPSUMMARY_DATA: envObj.AEM_TRIPSUMMARY_DATA,
    AEM_TRIPSUMMARY_ADDITIONAL_DATA: envObj.AEM_TRIPSUMMARY_ADDITIONAL_DATA,
  };
}

export async function getFareSummaryApiData() {
  // TODO: Call getApi with relevant parameters. For now, mock data is returned
  // return fareSummaryApiData?.data;

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const token = params.get('s_id') || getSessionToken();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USER_KEY_GET_REVIEW_SUMMARY,
    },
  };

  try {
    const response = await fetch(API_LIST.GET_REVIEW_SUMMARY, config);
    const getReviewData = await response.json();
    return getReviewData.data;
  } catch (e) {
    return {};
  }
}

export async function getAEMData() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST.AEM_TRIPSUMMARY_DATA, config);
    const getReviewData = await response.json();
    return getReviewData.data?.reviewSummaryMainByPath?.item;
  } catch (e) {
    return {};
  }
}

export async function getAEMAdditionalData() {
  // const startTime = Date.now();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST.AEM_TRIPSUMMARY_ADDITIONAL_DATA, config);
    // const statusCode = response?.status;
    const getReviewData = await response.json();

    // let duration = Date.now() - startTime;
    // duration = Math.round(duration / 1000);

    // const payloadData = {
    //   response: {
    //     url: API_LIST.AEM_TRIPSUMMARY_ADDITIONAL_DATA,
    //     responseTime: duration,
    //     statusCode,
    //   },
    // };

    // const { data, errors } = getReviewData || {};
    return getReviewData.data?.reviewSummaryAdditionalByPath?.item;
  } catch (e) {
    return {};
  }
}

export async function getFeeCodeMapping() {
  // TODO: Call getApi with relevant parameters. For now, mock data is returned
  return feeCodeMapping?.data;
}

export function getApi() {
  // TODO: Write fetch call here.
}

export async function getSsrCodeMapping() {
  const urlCurrent = new URL(window.location.href);
  const params = new URLSearchParams(urlCurrent.search);
  const token = params.get('s_id') || getSessionToken();
  const url = API_LIST.GET_SSR_LIST_ABBREVIATION;
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_BOOKING,
    },
  };
  let responseData;
  try {
    const response = await fetch(url, config);
    const getReviewData = await response.json();
    if (getReviewData.data && getReviewData.data.length > 0) {
      responseData = getReviewData.data;
    }
  } catch (error) {
    responseData = [];
  }

  return responseData;
}
