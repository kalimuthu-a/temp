/* eslint-disable */
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import Constants from '../../../constants';
import { getUserToken } from '../../../functions/userToken';
import gtmPushAnalytic from '../../../functions/gtmAnalyticsEvents';
import pushAnalytic from '../../../functions/analyticEvents';
import {
  BASE_API_URL,
  CREATE_SESSION_API_ENDPOINT,
} from '../../../constants/index-env';
import { AESEncryptCtr } from 'skyplus-design-system-app/dist/des-system/aes-ctr';

export const onSubmitFormHandler = (
  userType,
  username,
  password,
  apiDataConfig,
  additionalInfo = {},
) => {
  return getUserToken(Constants, userType, username, password, apiDataConfig)
    .then((response) => response.json())
    .then((response) => {
      if (response?.data?.token?.token) {
        let user = null;
        if (userType !== '' && response.data.person) {
          const customerNumber = response.data.person.customerNumber || '';
          let customerNumberEncryptedForAnalytics = '';
          try {
            customerNumberEncryptedForAnalytics = AESEncryptCtr(customerNumber, '', 256);
          } catch (error) {}
          user = {
            customerNumber: customerNumber,
            name: {
              first: response.data.person.name.first,
              last: response.data.person.name.last,
              title: response.data.person.name.title,
            },
            details: {
              dateOfBirth: response.data.person.details.dateOfBirth,
              passengerType: response.data.person.details.passengerType,
              preferredCurrencyCode:
                response.data.person.details.preferredCurrencyCode,
            },
            mobileNumber: additionalInfo?.mobileNumber || '',
            mobileCountryCode: additionalInfo?.mobileCountryCode || '',
            email: additionalInfo?.email || '',
            customerNumberEncryptedForAnalytics,
            loyaltyMemberInfo: response.data.person?.loyaltyMemberInfo || {},
          };
          return Promise.resolve({
            user,
            token: response.data,
            message: 'Login Success',
          });
        }
        return Promise.resolve({
          user,
          token: response.data,
          message: 'Login failed',
        });
      }
      if (response?.data?.otpRequired) {
        return Promise.resolve({
          isOtpRequired: response.data.otpRequired,
          otpAgentReferenceToValidate:
            response.data.otpAgentReferenceToValidate,
          response,
          message: 'OTP Required',
        });
      }
      if (response?.data?.passwordChangeRequired) {
        return Promise.resolve({
          passwordChangeRequired: response.data.passwordChangeRequired,
          response,
          message: 'Password change required',
        });
      }
      const errMsg = getErrorMsgForCode(response?.errors?.code);
      const errorDetail = {
        type: 'error',
        code: errMsg?.code,
        title: 'Error', // change title with error type like error,info
        message: errMsg?.message || 'Entered wrong username or password',
      };
      gtmPushAnalytic({
        state: {
          error_message: errorDetail?.message,
          error_type: errorDetail?.type,
          apiURL: `${BASE_API_URL}${CREATE_SESSION_API_ENDPOINT}`,
        },
        event: 'error',
      });
      pushAnalytic({
        state: '',
        event: 'error',
        errorMesg: {
          code: response?.errors?.code || '',
          type: 'api',
          source: 'api',
          apiURL: `${BASE_API_URL}${CREATE_SESSION_API_ENDPOINT}`,
          statusCode: response?.status,
          statusMessage: response?.errors?.message || '',
          displayMessage: errorDetail?.message || 'Something went wrong',
        },
      });
      pushAnalytic({
        event: 'UXerror',
        errorMesg: {
          code: response?.status,
          type: 'BE error',
          source: 'MS API',
          apiUrl: `${BASE_API_URL}${CREATE_SESSION_API_ENDPOINT}`,
          statusCode: response?.errors?.code,
          statusMessage: response?.errors?.message,
          displayMessage: errorDetail?.message ,
          action: 'Link/ButtonClick',
          component: 'Set Password',
        },
      });
      /* comment pushAnalytic({
        errorMesg: {
          message: errMsg,
          code: response?.errors?.code,
          url: `${BASE_API_URL}${CREATE_SESSION_API_ENDPOINT}`,
          type: "api",
          source: "api",
          statusCode: response?.status,
          statusMessage: response?.errors?.message
        },
        event: "error",
      }); */
      console.log({ LoginError: response, errMsg });
      return Promise.reject(new Error(response?.errors?.code));
    })
    .catch((error) => {
      console.log("--submit login:::", error)
      return Promise.reject(error)
    }
    );
};
