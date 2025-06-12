import { decryptAESForLoginAPI } from 'skyplus-design-system-app/src/functions/loginEncryption';
import CONSTANTS, { BROWSER_STORAGE_KEYS, FIELD_TYPE } from '../constants';
import request from '../utils/request';
import getSessionToken from '../utils';

export const API_LIST = {
  ...window._env_refund,
  
};

// API CALLS
const getAEMData = () => {
  return request(pageType === CONSTANTS.INITIATE_REFUND ? API_LIST.AEM_INITIATE_REFUND : API_LIST.AEM_REFUND_SUMMARY_DATA, {}).then(
    (res) => pageType === CONSTANTS.INITIATE_REFUND ? res?.data?.refundInitiateByPath?.item : res?.data?.refundSummaryByPath?.item,
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

export const getInitiateRefundOtp = async () => {
  try {
    return await (await fetch(API_LIST.GET_OTP_REFUND_MHB_API, { credentials: 'include' })).json();
  } catch (error) {
    return ({ isError: true });
  }
};

export const validateRefundPnr = async (otp) => {
  const payload = {
    OTPText: otp,
  };
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => formData.set(key, value));
  const url = API_LIST.VALIDATE_OTP_REFUND_MHB_API;
  const config = {
    body: formData,
    method: 'POST',
    credentials: 'include',
  };
  try {
    const response = await (await fetch(url, config)).json();
    if (response?.validateOTPRefundMHB && response?.validateOTPRefundMHB?.status && response?.validateOTPRefundMHB?.status !== "Not Validated.") {
      return { ...response?.validateOTPRefundMHB, ...{ isSuccess: true } };
    }
    return response;
  } catch (err) {
    return { isError: true };
  }
};

export const handleSubmitBankDetails = async (formData, accountHolderName) => {
  const url = API_LIST.REFUND_MHB_API;
  const payload = {
    AccountHolderName: accountHolderName,
    AccountType: formData.accountType === FIELD_TYPE.SAVINGS ? 1 : 2,
    IFSCCode: formData.IFSCCode,
    NameOfBank: formData.nameOfBank,
    AccountNumber: formData.accountNumber,
    fileName: formData.fileName,
    CustomerConsent: formData.customerConsent,
    ChequeImage: formData.chequeImage,
    ConfirmedAccountNumber: formData.confirmedAccountNumber,
  };
  const updatedFormData = new FormData();
  Object.entries(payload).forEach(([key, value]) => updatedFormData.set(key, value));
  const config = {
    method: 'POST',
    body: updatedFormData,
    credentials: 'include',
  };
  try {
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      return { ...response.data, ...{ isSuccess: true } };
    }
    return response;
  } catch (error) {
    return { ...error.indiGoError, ...{ isError: true } };
  }
};

export default getAEMData;
