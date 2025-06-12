import get from 'lodash/get';
import { categoryCodes } from '../../../constants/index';

export const defaultTabUserData = {
  checked: false,
  domestic: null,
  additionalBag: 0,
  international: null,
};

export const isPassengerHaveExcessBaggageData = (row) => {
  return (
    row.additionalBag > 0 || row.domestic !== null || row.international !== null
  );
};

/**
 *
 * @param {*} getAddonData
 * @param {*} ssrCategory
 * @param {{baggageDeclarationRequest: Array<*>}} baggageDecalationData
 * @param {Array<*>} initialData
 * @param {*} addonData
 * @param {*} abhfAEMCategory
 * @returns {Array<*>}
 */
export const setInitialData = (
  getAddonData,
  ssrCategory,
  baggageDecalationData,
  initialData,
  addonData,
  abhfAEMCategory,
) => {
  const { Passengers = [], ssr = [] } = getAddonData;

  ssr?.forEach((ssr, i) => {
    // Old Code:
    // const { journeyKey } = ssr;
    const baggageCategory = ssr.journeySSRs.find(
      ({ category }) => category === ssrCategory,
    );
    /* Old Code: remove additional baggae:-
    const abhfCategory = ssr.journeySSRs.find(
      ({ category }) => category === categoryCodes.abhf,
    ); */

    const brbCategory = ssr.journeySSRs.find(
      ({ category }) => category === categoryCodes.brb,
    );

    /* Old Code:
    const { baggageDeclarationRequest } = baggageDecalationData || {
      baggageDeclarationRequest: [],
    };

    const baggageDeclarationJou = baggageDeclarationRequest.find(
      (item) => item.journeyKey === journeyKey,
    ) ?? []; */

    initialData[i] = Passengers.map((passenger, pIndex) => {
      const { passengerKey } = passenger;
      const passengerAbhf = null;
      const userData = {};
      let passengerBaggage = null;
      let passengerBRB = null;

      /* Old Code:
      const baggageDeclaration = baggageDeclarationJou?.passengers?.find(
        (item) => item.passengerKey === passengerKey && item.extraBaggageCount > 0,
      ); */

      /* Old Code: remove additional baggage:-
      if (abhfCategory) {
        passengerAbhf = abhfCategory.takenssr?.find(
          (abhf) => abhf.passengerKey === passengerKey,
        );

        Object.assign(
          userData,
          _abhfCategoryData(
            abhfCategory,
            passengerKey,
            baggageDeclaration,
            abhfAEMCategory,
          ),
        );
      } */

      // Baggage Category Data
      if (baggageCategory) {
        const baggageCategorySSr = baggageCategory?.ssrs || [];
        passengerBaggage = baggageCategory.takenssr?.find(
          (baggage) => baggage.passengerKey === passengerKey,
        );

        Object.assign(
          userData,
          _baggageCategoryData(passengerBaggage, baggageCategorySSr, addonData),
        );
      }

      // BRB category Data
      if (brbCategory) {
        passengerBRB = brbCategory.takenssr?.find(
          (brb) => brb.passengerKey === passengerKey,
        );
      }

      const addoncantBeRemoved =				_haveDataWithCanbeRemoved(passengerBaggage)
				&& _haveDataWithCanbeRemoved(passengerBRB)
				&& _haveDataWithCanbeRemoved(passengerAbhf);

      const allowBaggageChange = passengerBaggage?.canBeRemoved ?? true;
      const allowBRBChange = passengerBRB?.canBeRemoved ?? true;

      return {
        ...defaultTabUserData,
        passengerKey,
        addoncantBeRemoved,
        allowBaggageChange,
        allowBRBChange,
        allowModify:
					userData.allowABHFChange || allowBaggageChange || allowBRBChange,
        ...userData,
        ...get(initialData, [i, pIndex], {}),
      };
    });
  });

  return initialData;
};

const _haveDataWithCanbeRemoved = (obj) => {
  if (obj) {
    return obj?.canBeRemoved === false;
  }

  return true;
};

export const disableBaggageRemoveButton = (
  item,
  delayLostBaggageProtection = false,
) => {
  let addoncantBeRemoved = true;

  const allowModify = item.allowBaggageChange || item.allowBRBChange || item.allowABHFChange;
  if (delayLostBaggageProtection && item.allowBRBChange) {
    addoncantBeRemoved = false;
  }

  if (item.allowBaggageChange && (item.domestic || item.international)) {
    addoncantBeRemoved = false;
  }

  if (item.allowABHFChange && item.additionalBag > 0) {
    addoncantBeRemoved = false;
  }

  if (item.allowModify === false) {
    addoncantBeRemoved = true;
  }

  return { ...item, addoncantBeRemoved, allowModify };
};

/**
 * Abhf category Data
 *
 * @param {*} abhfCategory
 * @param {*} passengerKey
 * @param {null | { extraBaggageCount: number}} baggageDeclaration
 * @param {*} abhfAEMCategory
 * @returns
 */
/* Old Code:
const _abhfCategoryData = (
  abhfCategory,
  passengerKey,
  baggageDeclaration,
  abhfAEMCategory,
) => {
  const userData = {
    additionalBag: 0,
    allowABHFChange: true,
  };
  let passengerAbhf = null;
  const passengerABHFSSRItem = abhfCategory?.ssrs?.[0] || null;
  passengerAbhf = abhfCategory.takenssr?.find(
    (abhf) => abhf.passengerKey === passengerKey,
  );

  if (passengerAbhf) {
    userData.checked = true;
    userData.additionalBag += passengerAbhf.takenCount;
    userData.baggageE = {
      currencycode: passengerAbhf.currencycode,
      name: `${passengerAbhf.takenCount} ${abhfAEMCategory.title}`,
      price: passengerAbhf.price,
      ssrKey: passengerAbhf?.originalSsrKey,
      ssrCode: passengerAbhf.ssrCode,
    };
    userData.allowABHFChange = passengerAbhf?.canBeRemoved ?? true;
  }

  if (passengerABHFSSRItem) {
    userData.abhfCategoryssrCode = passengerABHFSSRItem.ssrCode;
    userData.currencycode = passengerABHFSSRItem.currencycode;

    if (baggageDeclaration) {
      userData.checked = true;
      userData.additionalBag += baggageDeclaration.extraBaggageCount || 0;
      userData.baggageE = {
        currencycode: passengerABHFSSRItem.currencycode,
        name: `${userData.additionalBag} ${abhfAEMCategory.title}`,
        price: passengerABHFSSRItem.price,
        ssrKey: passengerABHFSSRItem?.ssrKey,
        ssrCode: passengerABHFSSRItem.ssrCode,
      };
      userData.allowABHFChange = false;
      userData.baggageDeclation = true;
    }
  }

  return userData;
}; */

// baggage Category data
const _baggageCategoryData = (
  passengerBaggage,
  baggageCategorySSr,
  addonData,
) => {
  const userData = {};

  if (passengerBaggage) {
    const { currencycode, price, originalSsrKey, ssrCode } = passengerBaggage;
    userData.checked = true;

    const { ssrList = [], sliderTitle } = get(
      addonData,
      'availableSlidePaneData.0',
      {},
    );
    const name = `${getBaggageSSRCodeName(ssrList, ssrCode)} ${sliderTitle}`;

    // First Item of ssr list in case of edit flow
    /** @type {any} */
    const passengerBaggageSSRItem = baggageCategorySSr.find(
      (ssr) => ssr.ssrCode === ssrCode,
    );

    if (passengerBaggageSSRItem?.group === 'International') {
      userData.international = originalSsrKey;
      userData.internationalE = {
        currencycode,
        name,
        price,
        ssrCode,
      };
    } else if (passengerBaggageSSRItem?.group === 'Domestic') {
      userData.domestic = originalSsrKey;
      userData.domesticE = {
        currencycode,
        name,
        price,
        ssrCode,
      };

      userData.checked = true;
      userData.currencycode = passengerBaggageSSRItem.currencycode;
    }
  }

  return userData;
};

/**
 *
 * @param {{ssrCode: string, name: string}[]} ssrList
 * @param {string} ssrCode
 * @returns {string}
 */
export const getBaggageSSRCodeName = (ssrList, ssrCode) => {
  const ssrItem = ssrList?.find((item) => item.ssrCode === ssrCode);
  return ssrItem?.name ?? '';
};

export const defaultExcessBaggageRow = {
  domestic: null,
  additionalBag: 0,
  international: null,
  addoncantBeRemoved: false,
  allowABHFChange: true,
  allowBRBChange: true,
  allowBaggageChange: true,
};

export const isExcessBaggageDataChange = (row = defaultExcessBaggageRow) => {
  return (
    row.domestic !== null || row.additionalBag > 0 || row.international !== null
  );
};

/**
 *
 * @param {*} excessBaggageData
 * @param {string} categoryName
 * @param {string} ssrCategory
 * @param {number} index
 * @returns {{ssrKey: string, Count: number, Note: string}[]}
 */
export const prepareExcessBaggageData = (
  excessBaggageData,
  categoryName,
  ssrCategory,
  index,
) => {
  const baseObj = {
    ssrKey: '',
    count: 1,
    Note: '',
    categoryName,
    ssrCategory,
    tripIndex: index,
  };
  const data = [];

  excessBaggageData?.forEach((row, tripIndex) => {
    row?.forEach((cell) => {
      const {
        domestic,
        international,
        // additionalBag,
        allowBaggageChange,
        // allowABHFChange,
        // baggageE,
        // abhfCategoryssrCode,
      } = cell;
      if (tripIndex === index) {
        /* Old Code:
        if (additionalBag > 0 && allowABHFChange) {
          data.push({
            ...baseObj,
            count: additionalBag,
            ssrKey: baggageE.ssrKey,
            ssrCategory: abhfCategoryssrCode,
            passengerKey: cell.passengerKey,
          });
        } */

        if (international && allowBaggageChange) {
          data.push({
            ...baseObj,
            ssrKey: international,
            passengerKey: cell.passengerKey,
          });
        }
        //  Old Code:
        if (domestic && allowBaggageChange) {
          data.push({
            ...baseObj,
            ssrKey: domestic,
            passengerKey: cell.passengerKey,
          });
        }
      }
    });
  });

  return data;
};
