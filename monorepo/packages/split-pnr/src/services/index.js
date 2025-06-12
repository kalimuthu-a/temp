// services - API calls
// use only JS fetch to make API calls.
import { getEnvObj, getSessionToken } from '../utils';

const API_LIST = getEnvObj();

export const passengersToSplit = (payLoad) => {
  const passengersToSplitConfig = {
    method: payLoad ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSessionToken(),
      user_key: payLoad ? API_LIST.USER_KEY_SPLIT_PNR_2 : API_LIST.USER_KEY_SPLIT_PNR,
    },
    ...(payLoad && {
      body: JSON.stringify(payLoad),
    }),
  };
  const URL = payLoad ? API_LIST?.SPLIT_PNR : API_LIST?.PASSENGERS_TO_SPLIT;

  return fetch(URL, { ...passengersToSplitConfig })
    .then((res) => res?.json());
};

export const aemMainData = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(API_LIST?.SPLIT_PNR_MAIN_DATA, { ...config })
    .then((res) => res?.json())
    .then((res) => res?.data?.splitPnrByPath?.item);
};

// API Call to get Split pnr detail
export const getSplitPnrDetail = async (payload) => {
  const url = API_LIST?.SPLIT_PNR_DETAIL;
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY_SPLIT_PNR,
    },
  };

  return fetch(url, config)
    .then((res) => res?.json())
    .then((res) => res)
    .catch((err) => err);
};

export const viewPnrDetailApi = async (pnr, lastname) => {
  let url = API_LIST?.VIEW_ITI_DETAIL;
  // Construct URL if pnr and lastname are provided
  if (pnr && lastname) {
    url += `?recordLocator=${pnr}&lastName=${lastname}`;
  }

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY_SPLIT_PNR,
    },
  };
  const response = await fetch(url, config);
  return response?.json();
};
