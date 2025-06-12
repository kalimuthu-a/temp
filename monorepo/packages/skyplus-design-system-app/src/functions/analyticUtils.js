/* eslint-disable sonarjs/cognitive-complexity */
import merge from 'lodash/merge';
import { pageConstant, pageTypeConst, personaConstant } from '../constants/analytics';
import { decryptAESForLogin } from './loginEncryption';
import { COOKIE_KEYS } from '../constants';

/**
 * getCookieValue - get cookie value from the name
 * @param {string} name - cookie name
 * @returns
 */
const getCookieValue = (name) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || '';

/**
 * adobeAnalytic - call adobe analytic events
 * @param {object} obj - object contains common properties, state and event Properties
 */
const adobeAnalyticWrapper = ({ ...obj }) => {
  const { state, commonInfo, eventProps } = obj;
  let authUser = getCookieValue(COOKIE_KEYS.USER);
  try {
    authUser = decryptAESForLogin(authUser);
    authUser = authUser && JSON.parse(authUser);
  } catch (e) {
    try {
      authUser = getCookieValue(COOKIE_KEYS.USER);
      authUser = authUser && JSON.parse(authUser);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('--error', error);
      authUser = {};
    }
  }
  const loyaltyTierMapping = {
    gold: 'BLU1',
    silver: 'BLU2',
    base: 'BLU3',
  };

  const userTypeCookie = getCookieValue(COOKIE_KEYS.ROLE_DETAILS);
  const authToken = getCookieValue(COOKIE_KEYS.AUTH) && JSON.parse(getCookieValue(COOKIE_KEYS.AUTH))?.token;
  const personasType = userTypeCookie ? JSON.parse(userTypeCookie) : '';
  const dogSessionId = getCookieValue(COOKIE_KEYS?.DATA_DOG_SESSION_ID) || '';
  const dogDataId = new URLSearchParams(dogSessionId || '').get('id');
  // const projectName = window?.skyinstance ? PROJECT_TYPE_SKYPLUS : PROJECT_TYPE_BAU;
  const { persona, pageType } = window;
  const { PERSONA_CORP_ADMIN,
    PERSONA_CORP_USER,
    PERSONA_MEMBER,
    PERSONA_AGENT,
  } = personaConstant;
  const { CORP_CONNECT_ADMIN,
    CORP_CONNECT_USER,
    AGENT_USER,
    HOMEPAGE,
    ANONYMOUS,
  } = pageConstant;
  let pageName = '';
  if (pageType === pageTypeConst.PAGETYPE_HOMEPAGE) {
    switch (persona) {
      case PERSONA_CORP_ADMIN:
        pageName = CORP_CONNECT_ADMIN;
        break;
      case CORP_CONNECT_USER:
        pageName = PERSONA_CORP_USER;
        break;
      case AGENT_USER:
        pageName = PERSONA_AGENT;
        break;
      case PERSONA_MEMBER:
        pageName = HOMEPAGE;
        break;

      default:
    }
  }
  // Loyalty
  const userTier = authUser?.loyaltyMemberInfo?.tier || authUser?.loyaltyMemberInfo?.TierType || '';
  const analyticsUserTierStr = loyaltyTierMapping[userTier?.toLowerCase()] || userTier;

  const commonData = {
    page: {
      pageInfo: {
        pageName: pageName || state?.pageType || HOMEPAGE,
        siteSection: commonInfo?.page?.pageInfo?.siteSection || pageName || HOMEPAGE,
        language: window.locale || '',
        platform: window.innerWidth <= 768 ? 'Mweb' : 'Web',
        projectName: 'UX-Revamp',
      },
      error: {
        id: '',
        text: '',
      },
      eventInfo: {
        outboundLinkName: '',
        outboundLinkURL: '',
      },
      LOB: 'Flights',
    },
    user: {
      customerID: authUser?.customerNumberEncryptedForAnalytics
        ? authUser?.customerNumberEncryptedForAnalytics
        : '',
      type: personasType?.roleCode || ANONYMOUS,
      token: authToken,
      tier: (authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn)
        ? analyticsUserTierStr : 'Not Logged In',
      FFNumber: authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || '',
      dataDogSessionID: dogDataId ?? '',
    },
  };

  const dataLayerObj = merge(merge(commonData, eventProps), commonInfo);
  // eslint-disable-next-line no-console
  console.log({ dataLayerObj, eventProps, authUser });

  // sending interaction data to adobe analytic
  window?.adobeDataLayer.push({
    ...dataLayerObj,
  });
};

const adobeAnalytic = (obj) => {
  try {
    adobeAnalyticWrapper(obj);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('-Error in analutics wrapper design%d', error);
  }
};

export { adobeAnalytic };
export default adobeAnalyticWrapper;
