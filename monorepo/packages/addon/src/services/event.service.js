import lodash, { find } from 'lodash';
import { CONSTANTS, categoryCodes, ssrCodes } from '../constants/index';
import AnalyticHelper from '../helpers/analyticHelper';
import SSRObject from '../models/SSRObject';
import { pushDataLayer } from '../functions/dataLayerEvents';

/**
 *
 * This is context of ssr objects which are added by user or a part of taken ssr
 *
 * You need to call update function with added/removed ssr also with another triggerEvent param which is `true`
 * by default. it will dispatch review summary  event
 *
 * @example
 *
 *
 * import eventService from "../services/event.service";
 *
 * //while adding
 * let ssrObj = {
 * addonName: "6E Tiffin",
 * passengerKey: "MSFDDC-",
 * multiplier: 1,
 * ssrCode: "CCWT",
 * price: 200,
 * journeyKey: "NkV_NTExMn4gfn5ERUx_MDYvMDIvMjAyMyAwOTowMH5CT01_MDYvMDIvMjAyMyAxMTowNX5_",
 * name: "Unibic Chocolate Chips Cookies",
 * category: "Meal"
 * }
 *
 * //while removing
 * let ssrObj = {
 * 	passengerKey: "MSFDDC-",
 * 	ssrCode: "CCWT",
 * 	journeyKey: "NkV_NTExMn4gfn5ERUx_MDYvMDIvMjAyMyAwOTowMH5CT01_MDYvMDIvMjAyMyAxMTowNX5_"
 * }
 *
 * eventService.update([ssrObj], [], false); // to add without triggering review summary event --- mounting phase
 * eventService.update([ssrObj], []); // to add and triggering review summary event --- adding phase
 * eventService.update([], [ssrObj]); // to remove and triggering review summary event --- removing phase
 *
 * // reset
 * eventService.reset();
 *
 * // add
 * eventService.add(ssrObj);
 *
 * //remove
 * eventService.remove(ssrObj);
 *
 * // trigger analytics event
 * eventService.updateAnalytics();
 */
export default (function () {
  /**
   * @type {{[key: string]: SSRObject }}
   */
  let ssrObjects = new Proxy(
    {},
    {
      set: (target, key, value) => {
        if (!value.journeyKey || !value.passengerKey || !value.ssrCode) {
          throw new Error(
            'SSRObject must be invalid check journeyKey, passengerKey, ssrCode',
          );
        }
        target[key] = value;
        return true;
      },
    },
  );

  /**
   * @param {{journeyKey: string, passengerKey: string, ssrCode: string, segmentKey?: string}} param0
   * @returns {string}
   */
  function _generateKey({ journeyKey, ssrCode, passengerKey, segmentKey }) {
    const separator = '@@@@@';
    return [journeyKey, ssrCode, passengerKey, segmentKey]
      .filter(Boolean)
      .join(separator);
  }

  /**
   * @param {SSRObject[]} ssrToAdd list of ssr to be added
   * @param {{
   *   journeyKey: string,
   *   passengerKey: string,
   *   ssrCode: string,
   *   segmentKey?: string
   * }[]} ssrToRemove list of ssr to be removed
   * @param {boolean} triggerEvent Wheather to trigger review summary event
   */
  function update(ssrToAdd, ssrToRemove = [], triggerEvent = true) {
    if (Array.isArray(ssrToRemove)) {
      ssrToRemove.forEach((ssr) => {
        remove(ssr);
      });
    }
    if (Array.isArray(ssrToAdd)) {
      ssrToAdd.forEach((ssr) => {
        add(ssr);
      });
    }

    if (triggerEvent) {
      updateReviewSummary();
    }
  }
  function get() {
    return ssrObjects;
  }
  function reset() {
    ssrObjects = {};
  }

  function updateReviewSummary() {
    const summaryData = lodash
      .chain(ssrObjects)
      .values()
      .reduce((summaryData, obj) => {
        const { journeyKey, ssrCode } = obj;
        if (!Reflect.has(summaryData, journeyKey)) {
          summaryData[journeyKey] = { data: [] };
        }
        if (ssrCode !== ssrCodes.cptr) {
          summaryData[journeyKey].data.push(obj);
        }
        return summaryData;
      }, {})
      .value();

    const keys = Object.keys(summaryData);
    const firstKey = keys[0];

    const { brb, prot, ifnr } = categoryCodes;

    for (const key in summaryData) {
      let isPrime = false;
      if (key !== firstKey) {
        summaryData[key].data = summaryData[key].data.filter(
          (obj) => ![brb, prot, ifnr].includes(obj.category),
        );
      }
      summaryData[key]?.data?.forEach((addon) => {
        if (addon.category === categoryCodes.prim) {
          isPrime = true;
        }
      });

      if (isPrime) {
        summaryData[key].data = summaryData[key].data.filter(
          (obj) => obj.category !== categoryCodes.ffwd,
        );
      }
    }

    document.dispatchEvent(
      new CustomEvent(CONSTANTS.EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER, {
        detail: summaryData,
      }),
    );
  }

  /**
   *
   * @param {string} page
   * @param {number} passengerCount
   * @param {string} continueLabel
   * @param {boolean} isModifyFlow
   */
  function updateAnalytics(
    page,
    passengerCount,
    continueLabel,
    isModifyFlow,
    airportCode,
    isMobile,
    isBackFlow,
    couponAvailed,
    totalEarnPoints,
    totalBurnPoints,
  ) {
    /**
     * @type {{[key: string] : {count: number, ssr: SSRObject}}}
     */
    const analyticsData = lodash
      .chain(ssrObjects)
      .values()
      .reduce((summaryData, obj) => {
        const { analyticName } = obj;

        if (!Reflect.has(summaryData, analyticName)) {
          summaryData[analyticName] = { count: 0, ssr: obj };
        }
        summaryData[analyticName].count += obj.multiplier;
        return summaryData;
      }, {})
      .value();

    const productDetails = [];
    const ancillarySelected = new Set();

    for (const iterator of Object.values(analyticsData)) {
      const { count, ssr } = iterator;
      const analytxStr = ssr.analytxStr(count, passengerCount);
      productDetails.push(analytxStr);
      ancillarySelected.add(ssr.ssrCode);
    }

    const productInfo = {
      // change based on new TSD - kept it for reference:
      // ancillarySelected: [...ancillarySelected].join('|'),
      // productDetails: productDetails.join(','),
      productDetails: productDetails.join(','),
    };

    const productSelected = {
      ancillarySelected: [...ancillarySelected].join('|'),
    };

    let event = 'addons_details';

    if (page === CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
      event = 'addons_details_checkIn';
    }

    pushDataLayer({
      data: {
        analyticsData,
        page,
        _event: event,
        isModifyFlow,
      },
      event,
    });

    if (!window.adobeDataLayer) window.adobeDataLayer = [];
    AnalyticHelper.addonDetails({
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
    });
  }

  /**
   *
   * @param {SSRObject} ssr
   */
  function add(ssr) {
    const key = _generateKey(ssr);
    ssrObjects[key] = new SSRObject(ssr);
  }

  /**
   *
   * @param {{journeyKey: string, passengerKey: string, ssrCode: string, segmentKey ?: string}} ssr
   */
  function remove(ssr) {
    const key = _generateKey(ssr);
    Reflect.deleteProperty(ssrObjects, key);
  }

  /**
   *
   * @param {*} obj
   * @returns {SSRObject | undefined}
   */
  function findOneSSr(obj) {
    return find(Object.values(ssrObjects), obj);
  }

  return {
    updateReviewSummary,
    updateAnalytics,
    update,
    get,
    reset,
    add,
    remove,
    findOneSSr,
  };
}());
