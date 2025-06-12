/* eslint-disable no-console */
/* eslint-disable consistent-return */
import merge from 'lodash/merge';
import { decryptAESForLogin } from './loginEncryption';
import { COOKIE_KEYS } from '../constants';

import Cookie from './cookies';

/**
 * getCookieValue - get cookie value from the name
 * @param {string} name - cookie name
 * @returns
 */
export const getCookieValue = (name) => {
  return document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || '';
};
/**
 * GTM Analytic - call adobe GTM events
 * @param {object} obj - object cantaines common properties, state and event Properties
 */
export const gtmAnalytic = ({ ...obj }) => {
  // thorws error if Datalayer object not found on window
  if (!window.dataLayer) {
    console.error('GTM Analytic Error: DataLayer object not found');
    return false;
  }

  let commonData = {};
  const { state, commonInfo, gtmProps, useOnlyGtmProps = false } = obj;
  let authUser = getCookieValue(COOKIE_KEYS.USER);
  try {
    authUser = decryptAESForLogin(authUser);
    authUser = authUser && JSON.parse(authUser);
  } catch (e) {
    authUser = getCookieValue(COOKIE_KEYS.USER);
  }
  const personasType = Cookie.get(COOKIE_KEYS.ROLE_DETAILS, true);

  const projectName = 'UX-Revamp';

  commonData = {
    user_type: personasType?.roleName || 'Anonymous',
    user_role_code: personasType?.roleCode || 'WWWA',
    user_id: authUser?.customerNumber || '',
    projectName,
    language: window?.locale || '',
  };

  if (!useOnlyGtmProps) {
    // commonData.page = {
    //   screenName: state?.pageType || 'homepage',
    //   previous_screen_name: '',
    //   Homepage_pageview: '1',
    //   siteSection: commonInfo?.page?.pageInfo?.siteSection || 'homepage',
    //   language: window?.locale || '',
    //   projectName,
    // };
  }

  const dataLayerObjGTM = merge(merge(commonData, gtmProps), commonInfo);
  console.log({ dataLayerObjGTM, gtmProps });

  if (gtmProps?.interaction_type === 'pageload') {
    // sending interaction data to gtm analytic
    window.dataLayer = window.dataLayer || [];
    window?.dataLayer.push({
      ...dataLayerObjGTM,
    });
  } else {
    // TD: dont delete this line
    // dataLayerObjGTM = merge(merge(gtmProps));
    window.dataLayer = window.dataLayer || [];
    window?.dataLayer.push({
      ...dataLayerObjGTM,
    });
  }
};
