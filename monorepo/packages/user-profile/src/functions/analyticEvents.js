import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { transactionAnalyticConstant } from '../constants/common';
import { COOKIE_KEYS } from '../constants/cookieKeys';
/**
 * pushAnalytic - It holds the list of events and its details called from MFE
 * @param {*} param0 - contains state and event name
 */
const pushAnalytic = ({ ...obj }) => {
  const { state, event } = obj || {};
  const authUser = Cookies.get(COOKIE_KEYS?.USER, true, true) || {};
  const userTier = authUser?.loyaltyMemberInfo?.tier || authUser?.loyaltyMemberInfo?.TierType || '';
  const loginTypeObj = Cookies.get(COOKIE_KEYS?.ROLE_DETAILS, true) || {};
  const dogDataId = window.DD_RUM?.getInternalContext()?.session_id;
  let eventProps = {};
  const pageName = '';

  const {
    TRANSACTION_HISTORY_LOAD,
    PAGELOAD,
    FLIGHT,
    TRANSACTION_HISTORY,
    MONEY_TRANSACTION_HISTORY,
    LANGUAGE,
    MWEB,
    WEB,
  } = transactionAnalyticConstant;

  switch (event) {
    case 'Get started':
      eventProps = {
        interactionType: 'Pop Up shown',
        page: {
          eventInfo: {
            name: 'Get Started',
            component: 'profile',
          },
          user: {
            profileInitiated: 1,
          },
          pageInfo: {
            journeyFlow: 'profile flow',
            siteSection: 'profile flow',
          },
        },
      };
      break;

    case 'Transaction History Page Load':
      eventProps = {
        event: TRANSACTION_HISTORY_LOAD,
        interaction_type: PAGELOAD,
        product: {
          productInfo: {
            availableBalance: state?.availableBalance,
            expringBalance: state?.expringBalance,
          },
        },
      };
      break;
    default:
      break;
  }
  try {
    adobeAnalytic({
      state: { ...state, pageType: pageName },
      commonInfo: {
        page: {
          LOB: FLIGHT,
          pageInfo: {
            siteSection: TRANSACTION_HISTORY,
            journeyFlow: TRANSACTION_HISTORY,
            language: LANGUAGE,
            pageName: MONEY_TRANSACTION_HISTORY,
            platform: window.screen.width < 768 ? MWEB : WEB,
          },
        },
        user: {
          FFNumber:
          authUser?.loyaltyMemberInfo?.FFN
          || authUser?.loyaltyMemberInfo?.ffn
          || '',
          tier: userTier,
          type: String(loginTypeObj?.roleCode) || 'WWWA',
          dataDogSessionID: dogDataId,
        },
      },
      eventProps,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('---error in profile mf analytics util', error);
  }
};

export default pushAnalytic;
