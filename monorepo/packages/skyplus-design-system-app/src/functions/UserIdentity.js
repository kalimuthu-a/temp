/* eslint-disable func-names */
/* eslint-disable wrap-iife */

import { COOKIE_KEYS } from '../constants';
import { personaConstant } from '../constants/analytics';
import Cookies from './cookies';

const {
  ANONYMOUS,
  PERSONA_CORP_ADMIN,
  PERSONA_CORP_USER,
  PERSONA_MEMBER,
  PERSONA_AGENT,
} = personaConstant;

const userIdentity = (function () {
  let role;
  let userDetails = {};

  const initialize = () => {
    role = Cookies.get(COOKIE_KEYS.ROLE_DETAILS, true) || {
      roleName: 'Anonymous',
      roleCode: 'WWWA',
    };

    userDetails = Cookies.get(COOKIE_KEYS.USER, true, true) || {};
  };

  initialize();

  return {
    role,
    isSMEAdmin: role.roleName === PERSONA_CORP_ADMIN,
    isSMEUser: role.roleName === PERSONA_CORP_USER,
    isAgent: role.roleName === PERSONA_AGENT,
    isMember: role.roleName === PERSONA_MEMBER,
    isAnonymous: role.roleName === ANONYMOUS,
    isAnonymousUser: () => role.roleName === ANONYMOUS,
    userDetails,
    subscribeToLogin: (callback) => {
      document.addEventListener('loginSuccessEvent', () => {
        initialize();
        callback();
      });
    },
    subscribeToLogout: (callback) => {
      initialize();
      document.addEventListener('logoutSuccessEvent', () => {
        initialize();
        callback();
      });
    },
    unSubscribeToLogin: (callback) => {
      document.removeEventListener('loginSuccessEvent', callback);
    },
    unSubscribeToLogout: (callback) => {
      document.removeEventListener('logoutSuccessEvent', callback);
    },
    dispatchLoginEvent: () => {
      document.dispatchEvent(
        new CustomEvent('toggleLoginPopupEvent', {
          bubbles: true,
          detail: { loginType: 'loginPopup' },
        }),
      );
    },
    dispatchSSOLoginEvent: () => {
      document.dispatchEvent(
        new CustomEvent('toggleLoginPopupEvent', {
          bubbles: true,
          detail: { loginType: 'loginSSOPopup' },
        }),
      );
    },
    ffn: userDetails?.ffn,
  };
})();

export default userIdentity;
