import getCiamToken from '../utils/getCiamToken';
import { getPolicyName } from '../functions/services';
import { API_LIST } from '.';
import getSessionToken from '../utils/getSessionToken';

// eslint-disable-next-line import/prefer-default-export
/**
 *
 * @param {*} searchFilter - 0 means current bookings, 1 means past bookings, 3 means for help page required 3 result
 * @returns
 */

export const getMyTransactionAemData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST.SIX_EWALLET_AEMDATA, config);
    const data = await response.json();
    return data?.data?.sixeMoneyTransactionsByPath;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
};
export const getBalance = async () => {
  const policyName = getPolicyName();

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ciamToken: getCiamToken(),
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY,
    },
  };

  try {
    const apiUrl = `${API_LIST.GET_BALANCE}/${policyName}`;

    const response = await fetch(apiUrl, config);

    const balance = await response.json();
    if (balance.errors) {
      throw new Error(`HTTP error! Status: ${balance.errors}`);
    }
    return balance;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    throw new Error(`HTTP error! Status: ${error}`);
  }
};
export const getTransactionHistory = async (Page, Count, Type) => {
  const policyName = getPolicyName();

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ciamToken: getCiamToken(),
      Authorization: getSessionToken(),
      user_key: API_LIST.USER_KEY,
    },
  };
  try {
    const apiUrl = `${API_LIST.GET_HISTORY}/${policyName}?Page=${Page}&Count=${Count}&Type=${Type}`;
    const response = await fetch(apiUrl, config);
    const history = await response.json();
    if (history.errors) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return history;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    throw new Error(`HTTP error! Status: ${error}`);
  }
};
// We are creating wallet from salesforce system (CRM) and not from web/app (digital channels), so not needed now.
// export const createWallet = async () => {
//   const policyName = getPolicyName();
//   const config = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       ciamToken: getCiamToken(),
//       Authorization: getSessionToken(),
//       user_key: API_LIST.USER_KEY,
//     },
//   };
//   try {
//     const apiUrl = `${API_LIST.CREATE_WALLET}/${policyName}`;
//     const response = await fetch(apiUrl, config);
//     const walletStatus = await response.json();
//     return !!walletStatus?.data.isSuccess;
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//     throw new Error(`HTTP error! Status: ${error}`);
//   }
// };
