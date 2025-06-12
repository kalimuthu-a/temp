import {
  getMemberLoginOld,
  getAgentLoginOld,
} from '../../../functions/userToken';

export const onSubmitFormOldLoginHandler = async (
  userType,
  username,
  password,
  countryCodeValues,
  stateRef,
  oldLoginDetails,
) => {
  if (username && password) {
    /* comment Old(BAU) member,agent,corp-connect admin, corp-connect user, cafp login support */
    if (userType === 'Member' || userType === 'member') {
      try {
        const memberOldAPI = await getMemberLoginOld(
          userType,
          countryCodeValues,
          username,
          password,
          true,
          stateRef?.rememberMe,
          oldLoginDetails,
        );
        return Promise.resolve(memberOldAPI);
      } catch (error) {
        console.log(error, 'Error for old Member login api');
        return Promise.reject({
          user: null,
          token: {},
          oldLoginError: true,
          message: 'Login failed',
        });
      }
    } else {
      try {
        const memberOldAPI = await getAgentLoginOld(
          userType,
          username,
          password,
          true,
          oldLoginDetails,
        );
        return Promise.resolve(memberOldAPI);
      } catch (error) {
        return Promise.reject({
          user: null,
          token: {},
          oldLoginError: true,
          message: 'Login failed',
        });
      }
    }
  }
};
