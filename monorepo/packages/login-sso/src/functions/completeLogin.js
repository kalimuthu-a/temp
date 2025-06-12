import { AESEncryptCtr } from 'skyplus-design-system-app/dist/des-system/aes-ctr';
import { decryptAESForLoginAPI } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import { validateTokenAPI } from './services';
import { getEnvObj, loyaltyMemberInfoWithFFN } from './utils';
import { makeBauLoginInitiate } from './oldLogin';
import { LOCALSTORAGE, LOGIN_SUCCESS, MEMBER } from '../constants/common';
import Cookies from './cookies';
import COOKIE_KEYS from '../constants/cookieKeys';
import { CONSTANT } from '../constants';

const getRefreshToken = (refreshtokenParam) => {
  let refreshtoken = refreshtokenParam;
  if (!refreshtoken) {
    const refreshCiamFromLocalStorage = localStorage.getItem(LOCALSTORAGE.CIAM_TOKEN);
    if (refreshCiamFromLocalStorage) {
      refreshtoken = JSON.parse(refreshCiamFromLocalStorage);
      return refreshtoken.ciamToken;
    }
  }
  return refreshtoken;
};

const getCiamRefreshToken = () => {
  const refreshTokenFromLocalStorage = localStorage.getItem(LOCALSTORAGE.CIAM_REFRESH_TOKEN);
  let refreshToken = '';
  if (refreshTokenFromLocalStorage) {
    refreshToken = JSON.parse(refreshTokenFromLocalStorage);
    return refreshToken.refreshCiamToken;
  }
  return refreshToken;
};

const getPolicyName = (ciamPolicyNameParam) => {
  let ciamPolicyName = ciamPolicyNameParam;
  if (!ciamPolicyName) {
    try {
      ciamPolicyName = Cookies.get(COOKIE_KEYS.CIAM_POLICY, true, true);
    } catch {
      ciamPolicyName = Cookies.get(COOKIE_KEYS.CIAM_POLICY);
    }
  }
  return ciamPolicyName;
};

const getUsername = (usernameParam) => {
  let username = usernameParam;
  let userDetails;
  if (!username) {
    try {
      userDetails = Cookies.get(COOKIE_KEYS.USER, true, true);
    } catch {
      userDetails = Cookies.get(COOKIE_KEYS.USER);
    }
  }
  const phoneNumber = userDetails?.mobileNumber
  && `+${userDetails?.mobileCountryCode?.replaceAll('+', '')}${userDetails?.mobileNumber
  }`;
  const email = userDetails?.email || '';
  username = phoneNumber || email;
  return username;
};

const encryptCustomerNumber = (customerNumber) => {
  try {
    return AESEncryptCtr(customerNumber, '', 256);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return '';
  }
};

const getUserDetails = (person, sharedData) => {
  const defaultEmail = person?.emailAddresses?.find((email) => email?.default)?.email
    || person?.emailAddresses[0]?.email;
  const defaultPhoneNumber = person?.phoneNumbers?.find((phone) => phone?.default)?.number
    || person?.phoneNumbers[0]?.number;
  const defaultCountryCode = person?.phoneNumbers?.find((phone) => phone?.default)?.CountryCode
    || person?.phoneNumbers[0]?.CountryCode;

  return {
    customerNumber: person.customerNumber,
    name: {
      first: person?.name?.first,
      last: person?.name?.last,
      title:
        person?.name?.title || (person?.details?.gender === 1 ? 'MR' : 'MS'),
      gender: person?.details?.gender,
    },
    details: {
      dateOfBirth: person?.details?.dateOfBirth,
      passengerType: person?.details?.passengerType,
      preferredCurrencyCode: person?.details?.preferredCurrencyCode,
    },
    customerNumberEncryptedForAnalytics: encryptCustomerNumber(
      person?.customerNumber,
    ),
    loyaltyMemberInfo:
      loyaltyMemberInfoWithFFN(person?.loyaltyMemberInfo) || {},
    mobileNumber:
      defaultPhoneNumber?.replace(defaultCountryCode || '+91', '')
      || sharedData?.phone
      || '',
    mobileCountryCode:
      defaultCountryCode?.replaceAll('+', '')
      || sharedData?.countryCode
      || '91',
    email: defaultEmail || sharedData?.email || '',
  };
};

const handleNewLoginSuccess = (user, token) => {
  document.dispatchEvent(
    new CustomEvent(LOGIN_SUCCESS, {
      bubbles: true,
      detail: {
        token,
        user,
      },
    }),
  );
};

const completeLogin = async ({
  refreshtokenParam,
  ciamPolicyNameParam,
  usernameParam,
  sharedDataParam,
  callback = () => {},
}) => {
  const envObj = getEnvObj() || {};

  const refreshtoken = getRefreshToken(refreshtokenParam);
  const ciamPolicyName = getPolicyName(ciamPolicyNameParam);
  const username = getUsername(usernameParam);
  const sharedData = { ...sharedDataParam };
  const ciamRefreshToken = getCiamRefreshToken();

  const payload = {
    ciamToken: ciamRefreshToken || refreshtoken,
    strToken: '',
    policyName: ciamPolicyName,
    subscriptionKey: envObj?.SUBSCRIPTION,
    usertype: 'member',
    isRefreshSession: false,
    tokenType: ciamRefreshToken ? 'Refresh' : '',
    nskTokenRequest: {
      applicationName: 'dotREZ',
      credentials: {
        alternateIdentifier: null,
        channelType: 'Web',
        domain: 'WW2',
        location: 'WWW',
        username,
      },
    },
  };

  const { response } = await validateTokenAPI(payload);

  if (response?.data) {
    const person = response.data?.person || {};
    const user = getUserDetails(person, sharedData);
    const strToken = response?.data?.strToken;
    const refreshCiamToken = response?.data?.ciamTokenRef;

    if (refreshCiamToken) {
      let cookieExpiredTime = envObj?.sso_token_validity_minutes
            || envObj?.SSO_TOKEN_VALIDITY_MINUTES
            || 60 * 24 * 60;
      cookieExpiredTime = cookieExpiredTime * 60 * 1000;
      const ciamRefreshData = {
        refreshCiamToken,
        expiryTime: ((new Date()).getTime() + cookieExpiredTime),
      };
      localStorage.setItem(LOCALSTORAGE.CIAM_REFRESH_TOKEN, JSON.stringify(ciamRefreshData));

      let authUser;
      try {
        authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
      } catch (e) {
        authUser = Cookies.get(COOKIE_KEYS.USER);
      }
      const event = new CustomEvent(CONSTANT.UPDATE_AUTH_USER_COOKIE, {
        bubbles: true,
        detail: { user: authUser, cookieExpiredTime },
      });
      document.dispatchEvent(event);
    }
    if (strToken) {
      const splittedValues = strToken.split('.');
      const userIdFromSTR = decryptAESForLoginAPI(splittedValues[0]);
      const password = decryptAESForLoginAPI(splittedValues[1]);

      makeBauLoginInitiate({
        persona: MEMBER,
        userId: userIdFromSTR,
        password,
        countryCode: user?.mobileCountryCode,
      });
    }
    Cookies.set(COOKIE_KEYS.WALLET_USER, response?.data?.IsIndigoWalletMember);
    handleNewLoginSuccess(user, response?.data);

    if (callback)callback(user, response?.data); // callback for the new login success
    return {
      response,
      person,
      defaultEmail: user.email,
      defaultPhoneNumber: user.mobileNumber,
      defaultCountryCode: user.mobileCountryCode,
    };
  }

  return {
    response,
    person: null,
    defaultEmail: null,
    defaultPhoneNumber: null,
    defaultCountryCode: null,
  };
};

export default completeLogin;
