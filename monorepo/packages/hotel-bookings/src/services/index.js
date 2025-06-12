import { decryptAESForLoginAPI } from 'skyplus-design-system-app/src/functions/loginEncryption';
import { BROWSER_STORAGE_KEYS } from '../constants';
import request from '../utils/request';
import getSessionToken from '../utils';

export const API_LIST = {
  ...window._env_refund,
};

// API CALLS
const getAEMData = () => {
  return request(API_LIST.AEM_REFUND_SUMMARY_DATA, {}).then(
    (res) => res?.data?.refundSummaryByPath?.item,
  );
};
export const getRefundStatus = async (updateData) => {
  const token = getSessionToken();
  const payload = decryptAESForLoginAPI(localStorage.getItem(BROWSER_STORAGE_KEYS.REFUND_FORM_DATA));

  const config = {
    body: payload,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_REFUND_STATUS,
    },
  };

  const response = await (await fetch(API_LIST.POST_REFUND_STATUS, config)).json();
  if (response?.data?.indigoRefundStatus) {
    updateData(response);
  }
};

export default getAEMData;
