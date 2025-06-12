import get from 'lodash/get';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { LINK_BUTTON_CLICK, LOCATION_HASHES } from '../constants/analytic';
import { CONSTANTS } from '../constants/index';
import AnalyticBuilder from '../utils/AnalyticBuilder';
import LocalStorage from '../utils/LocalStorage';
import localStorageKeys from '../constants/localStorageKeys';

const {
  PASSENGER_EDIT,
  ADDON_CHECKIN,
  ADDON_SEAT_SELECTION_CHECKIN,
  ADDON_MODIFY_PAGE_TYPE,
  ADDON_SEAT_SELECTION_MODIFICATION,
  MODIFICATION_FLOW,
} = CONSTANTS;

class AnalyticHelper {
  static PAGE_LOAD_EVENT = 'pageload';
  static LINK_BUTTON_CLICK = 'Link/ButtonClick';

  static COMPONENT_LOAD_EVENT = 'component load';

  static CLICK_EVENT = 'click';

  static ERROR_EVENT = 'error';

  static ADDON_DETAILS_EVENT = 'addonsDetails';

  static counter = 0;

  static SOURCE = {
    api: 'MS-API',
    aem: 'AEM',
    mf: 'MF',
  };

  static TYPE = {
    api: 'business',
    network: 'network',
    validation: 'user',
  };

  static pages = {
    [PASSENGER_EDIT]: 'Add-ons',
    [ADDON_CHECKIN]: 'Add-ons Checkin',
    [ADDON_SEAT_SELECTION_CHECKIN]: 'Add-ons Checkin',
    [ADDON_MODIFY_PAGE_TYPE]: 'Add-ons Modification',
    [ADDON_SEAT_SELECTION_MODIFICATION]: 'Seat Select Modification',
    ADD_ONS: 'Add-ons',
    SEAT_SELECT: 'Seat Select',
    SEAT_SELECT_CHECK_IN: 'Seat Select Check-in',
    PASSENGER_DETAILS: 'Passenger Details',
  };

  static getFlow(page) {
    const pages = {
      [PASSENGER_EDIT]: 'Booking Flow',
      [ADDON_CHECKIN]: 'Check-in Flow',
      [ADDON_SEAT_SELECTION_CHECKIN]: 'Check-in Flow',
      [ADDON_MODIFY_PAGE_TYPE]: MODIFICATION_FLOW,
      [ADDON_SEAT_SELECTION_MODIFICATION]: MODIFICATION_FLOW,
    };

    return get(pages, page, 'Booking Flow');
  }

  static getInteractionType(page) {
    if (
      this.counter === 0 &&
      [
        ADDON_CHECKIN,
        ADDON_SEAT_SELECTION_CHECKIN,
        ADDON_MODIFY_PAGE_TYPE,
        ADDON_SEAT_SELECTION_MODIFICATION,
        PASSENGER_EDIT,
      ].includes(page)
    ) {
      return this.PAGE_LOAD_EVENT;
    }
    return this.COMPONENT_LOAD_EVENT;
  }

  static getPageName(page) {
    let pageName = get(this.pages, page, this.pages[PASSENGER_EDIT]);

    if (page === ADDON_SEAT_SELECTION_MODIFICATION) {
      pageName = this.pages[ADDON_MODIFY_PAGE_TYPE];
    } else if (page === ADDON_SEAT_SELECTION_CHECKIN) {
      pageName = this.pages[ADDON_CHECKIN];
    }

    return pageName;
  }

  /**
   *
   * @param {import("axios").AxiosResponse<*>|import("axios").AxiosError<*>|*} axiosObj
   */
  static addonApiError(axiosObj) {
    const { page } = axiosObj.config;
    const pageName = this.getPageName(page);
    let aemError = getErrorMsgForCode('default');

    const error = {
      id: '',
      text: '',
      type: this.TYPE.api,
      source: this.SOURCE.api,
    };

    if (axiosObj.isAxiosError) {
      const { response, code, message, config } = axiosObj;
      const ERR_NETWORK = code === 'ERR_NETWORK';

      try {
        let statusMessage = response?.statusText;

        if (ERR_NETWORK) {
          statusMessage = message;
        } else if (response.data) {
          statusMessage = JSON.stringify(response.data);
        }

        Object.assign(error, {
          statusMessage,
          apiURL: ERR_NETWORK ? config.url : axiosObj.request.responseURL,
          statusCode: ERR_NETWORK ? 'ERR_NETWORK' : axiosObj.response.status,
          type: ERR_NETWORK ? this.TYPE.network : this.TYPE.api,
        });
      } catch (err) {
        return;
      }
    } else {
      const { errors } = axiosObj.data;
      aemError = getErrorMsgForCode(errors?.code);
      Object.assign(error, {
        statusMessage: errors?.message,
        apiURL: axiosObj.request.responseURL,
        statusCode: axiosObj.status,
      });
    }

    const { code, message } = aemError;
    error.code = code;
    error.displayMessage = message;

    const flow = this.getFlow(page);

    AnalyticBuilder()
      .setEvent(this.ERROR_EVENT)
      .setInteractionType('Error')
      .setPageInfo(pageName, flow)
      .setPage({
        pageInfo: { name: pageName, position: '', component: '' },
        error,
      })
      .send();
  }

  /**
   *
   * @param {string} page
   */
  static addonLoad(page, isMobile, airportCode, isModifyFlow) {
    let pageName = this.getPageName(page);
    let flow = this.getFlow(page);
    const interactionType = this.getInteractionType(page);
    const platform = isMobile ? 'Mweb' : 'Web';
    const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    const isLoyaltyMember = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || false;
    const { payWith = 'cash' } = LocalStorage.getAsJson(
      localStorageKeys.bw_cntxt_val,
      {},
    );

    this.counter += 1;
    if (isModifyFlow && page !== CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
      pageName += ' Modification';
      flow = MODIFICATION_FLOW;
    }

    AnalyticBuilder()
      .setEvent(this.PAGE_LOAD_EVENT)
      .setInteractionType(interactionType)
      .setPage({ pageInfo: { pageName, platform }, LOB: 'Flights' })
      .setPageInfo(pageName, flow, platform)
      .setProduct({
        // TD: kept for future reference
        // productSelected: {
        // addSameAmenities: 'NA',
        // ancillarySelected: 'NA',
        // addons: 'NA',
        // },
        productInfo: {
          // ancillarySelected: 'NA',
          airportCodePair: airportCode,
          payType: payWith,
        },
        productViewed: {
          addons: '1',
        },
      })
      .setLoyalty(isLoyaltyMember ? {
        pointsEarn: (payWith?.toLowerCase() === 'cash') ? '1' : '0',
        pointsBurn: (payWith?.toLowerCase() !== 'cash') ? '1' : '0',
      } : null)
      .send();
  }

  static addRedeemClick(page, isMobile ) {
    let pageName = page;
    let flow = this.getFlow(page);
    const platform = isMobile ? 'Mweb' : 'Web';
    const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    const isLoyaltyMember = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || false;
    const { payWith = 'cash' } = LocalStorage.getAsJson(
      localStorageKeys.bw_cntxt_val,
      {},
    );

    this.counter += 1;
    AnalyticBuilder()
      .setEvent(this.CLICK_EVENT)
      .setInteractionType(this.LINK_BUTTON_CLICK)
      .setPage({ pageInfo: { pageName, platform }, eventInfo: {
             name: 'Add & Redeem',
              position: '', 
              component: "6E Prime, 6E Eats",
           },})
      .setPageInfo(pageName, flow, platform)
      .setProduct({  
        productInfo: {
          payType: payWith,
        },
        productViewed: {
          addons: '1',
        },
      })
      .setLoyalty(isLoyaltyMember ? {
        pointsEarn: (payWith?.toLowerCase() === 'cash') ? '1' : '0',
        pointsBurn: (payWith?.toLowerCase() !== 'cash') ? '1' : '0',
      } : null)
      .send();
  }

  static addConfirmClick(page, isMobile ) {
    let pageName = page;
    let flow = this.getFlow(page);
    const platform = isMobile ? 'Mweb' : 'Web';
    const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    const isLoyaltyMember = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || false;
    const { payWith = 'cash' } = LocalStorage.getAsJson(
      localStorageKeys.bw_cntxt_val,
      {},
    );

    this.counter += 1;
    AnalyticBuilder()
      .setEvent(this.CLICK_EVENT)
      .setInteractionType(this.LINK_BUTTON_CLICK)
      .setPage({ pageInfo: { pageName, platform }, eventInfo: {
             name: 'Confirm',
              position: '', 
              component: "6E Prime",
              addonSelected: 'VCSW',
           },})
      .setPageInfo(pageName, flow, platform)
      .setProduct({  
        productInfo: {
          payType: payWith,
        },
        productViewed: {
          addons: '1',
        },
      })
      .setLoyalty(isLoyaltyMember ? {
        pointsEarn: (payWith?.toLowerCase() === 'cash') ? '1' : '0',
        pointsBurn: (payWith?.toLowerCase() !== 'cash') ? '1' : '0',
      } : null)
      .send();
  }

  static add6eEatClick(page, isMobile ) {
    let pageName = page;
    let flow = this.getFlow(page);
    const platform = isMobile ? 'Mweb' : 'Web';
    const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    const isLoyaltyMember = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || false;
    const { payWith = 'cash' } = LocalStorage.getAsJson(
      localStorageKeys.bw_cntxt_val,
      {},
    );

    this.counter += 1;
    AnalyticBuilder()
      .setEvent(this.CLICK_EVENT)
      .setInteractionType(this.LINK_BUTTON_CLICK)
      .setPage({ pageInfo: { pageName, platform }, eventInfo: {
             name: 'Add',
              position: '', 
              component: "6E Eats",
              addonSelected: 'VCSW'
           },})
      .setPageInfo(pageName, flow, platform)
      .setProduct({  
        productInfo: {
          payType: payWith,
        },
        productViewed: {
          addons: '1',
        },
      })
      .setLoyalty(isLoyaltyMember ? {
        pointsEarn: (payWith?.toLowerCase() === 'cash') ? '1' : '0',
        pointsBurn: (payWith?.toLowerCase() !== 'cash') ? '1' : '0',
      } : null)
      .send();
  }


  /**
   *
   * @param {string} page
   */
  static onClickChange(page) {
    const { hash } = window.location;
    let pageName = get(this.pages, page, this.pages[PASSENGER_EDIT]);

    if (page === PASSENGER_EDIT) {
      if (hash === `#${LOCATION_HASHES.SEAT_SECTION}`) {
        pageName = this.pages.SEAT_SELECT;
      } else {
        pageName = this.pages.PASSENGER_DETAILS;
      }
    }

    if (page === ADDON_SEAT_SELECTION_CHECKIN) {
      pageName = this.pages.SEAT_SELECT_CHECK_IN;
    } else if (page === ADDON_SEAT_SELECTION_MODIFICATION) {
      pageName = this.pages[ADDON_SEAT_SELECTION_MODIFICATION];
    }

    const flow = this.getFlow(page);

    AnalyticBuilder()
      .setEvent(this.CLICK_EVENT)
      .setInteractionType(LINK_BUTTON_CLICK)
      .setPage({
        eventInfo: {
          name: 'Change',
          component: pageName,
        },
      })
      .setPageInfo(pageName, flow)
      .send();
  }

  /**
   *
   * @param {{ancillarySelected: string, productDetails: string}} productInfo
   * @param {string} page
   * @param {string} continueLabel
   */
  static addonDetails({
    productSelected,
    productInfo,
    page,
    continueLabel,
    airportCode,
    isMobile,
    isBackFlow,
    isModifyFlow,
    couponAvailed,
    totalEarnPoints,
    totalBurnPoints,
  }) {
    let pageName = this.getPageName(page);
    let flow = this.getFlow(page);
    const platform = isMobile ? 'Mweb' : 'Web';
    const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    const isLoyaltyMember = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || false;
    const { payWith = 'cash' } = LocalStorage.getAsJson(
      localStorageKeys.bw_cntxt_val,
      {},
    );

    if (isModifyFlow && page !== CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
      pageName += ' Modification';
      flow = MODIFICATION_FLOW;
    }

    const event = isBackFlow ? this.CLICK_EVENT : this.ADDON_DETAILS_EVENT;
    AnalyticBuilder()
      .setEvent(event)
      .setInteractionType(LINK_BUTTON_CLICK)
      .setProduct({
        productInfo: {
          ...productInfo,
          ...(!isBackFlow && { airportCodePair: airportCode }),
          payType: payWith,
        },
        productSelected: {
          ...(!isBackFlow && { addons: '1' }),
          // TD: kept for future reference
          // ...(!isBackFlow && { addSameAmenities: 'NA' }),
          ...productSelected,
        },
        // TD: kept for future reference
        // productViewed: {
        //   addons: 'NA',
        // },
      })
      .setPage({
        eventInfo: {
          name: (page === ADDON_SEAT_SELECTION_CHECKIN) ? 'Next' : continueLabel,
          component: pageName,
        },
        LOB: 'Flights',
      })
      .setPageInfo(pageName, flow, platform)
      .setLoyalty(isLoyaltyMember ? {
        pointsEarn: (payWith?.toLowerCase() === 'cash') ? '1' : '0',
        pointsBurn: (payWith?.toLowerCase() !== 'cash') ? '1' : '0',
        couponAvailed,
        pointsEarned: totalEarnPoints?.toString() || '',
        pointsburned: totalBurnPoints?.toString() || '',
      } : null)
      .send();
  }

  /**
   *
   * @param {string} page
   */
  static sendGetPaxSSR(page, apiData) {
    const pageName = this.getPageName(page);
    const flow = this.getFlow(page);

    this.counter += 1;

    AnalyticBuilder()
      .setEvent('api response')
      .setInteractionType('API response')
      .setPage({ pageInfo: { pageName }, api: apiData })
      .setPageInfo(pageName, flow)
      .send();
  }
}

export default AnalyticHelper;
