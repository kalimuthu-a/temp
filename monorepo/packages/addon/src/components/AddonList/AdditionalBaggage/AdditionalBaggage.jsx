import React, { useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import AddonCard from '../../common/AddonCard/AddonCard';
import AdditionalBaggageSlidePane from './AdditionalBaggageSlidePane';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';

import {
  getRemoveAddonSsrContext,
  // formatCurrencyFunc,
  newAddonData,
} from '../../../functions/utils';
// Old Code:
// import AddedButton from './AddedButton';
// import { localStorageKeys } from '../../../constants/index';
import RemovedAddonSsrList from '../../../models/RemovedAddonSsrList';
import {
  disableBaggageRemoveButton,
  // isPassengerHaveAdditionalBaggageData,
  setInitialData,
  defaultAddtionalBaggageRow,
} from './AdditionalBaggageUtils';
import { CONSTANTS, categoryCodes } from '../../../constants/index';
import eventService from '../../../services/event.service';
import LocalStorage from '../../../utils/LocalStorage';
import localStorageKeys from '../../../constants/localStorageKeys';
import { createEventForAddonModification } from '../../../functions';

/**
 *
 * @type {React.FC<*>}
 * @returns {React.FunctionComponentElement}
 */
const AdditionalBaggage = ({
  segmentData,
  addonData,
  configData,
  ssrCategory,
  passengerDetails,
  addonCardProps,
  setPopupProps,
  setOpenSlider,
  isOpenSlider,
  sliderPaneConfigData,
}) => {
  const {
    state: {
      tripIndex,
      paxIndex,
      sellAddonSsr,
      additionalBaggageData,
      getAddonData,
      removedAddonSsr,
      delayLostBaggageProtection,
      categories,
      page,
      ...state
    },
    dispatch,
  } = useContext(AppContext);

  // Old Code:
  // const [price, setPrice] = useState(configData.addLabel);
  // const [popoverContent, setPopoverContent] = useState({
  //   show: false,
  //   content: '',
  // });

  const passengerIndex = paxIndex[tripIndex]?.paxIndex;

  const additionalBaggageRowItem = get(
    additionalBaggageData,
    ['data', tripIndex, passengerIndex],
    defaultAddtionalBaggageRow,
  );

  // const abhfCategory = configData?.categoriesList.find(
  const categoriesList = [
    ...configData.mainAddonsList,
    ...configData.extaAddonsList,
  ];
  const abhfCategory = categoriesList?.find(
    (category) => category.categoryBundleCode === categoryCodes.abhf,
  );

  useEffect(() => {
    setOpenSlider(additionalBaggageData.openslider);

    let baggageDecalationData = {
      baggageDeclarationRequest: [],
    };

    // if page is checkin flow or add on seat selection
    const { ADDON_CHECKIN, ADDON_SEAT_SELECTION_CHECKIN } = CONSTANTS;
    if ([ADDON_SEAT_SELECTION_CHECKIN, ADDON_CHECKIN].includes(page)) {
      baggageDecalationData = LocalStorage.getAsJson(
        localStorageKeys.baggage_declaration,
        {
          baggageDeclarationRequest: [],
        },
      );
    }

    const initialData = setInitialData(
      getAddonData,
      ssrCategory,
      baggageDecalationData,
      additionalBaggageData.data,
      addonData,
      abhfCategory,
    );

    dispatch({
      type: addonActions.SET_ADDITIONAL_BAGGAGE_FORM_DATA,
      payload: {
        data: initialData,
      },
    });
  }, []);

  const getLocations = () => {
    const locationList = [];

    const locationItem = {
      from: segmentData?.journeydetail?.origin,
      to: segmentData?.journeydetail?.destination,
    };
    locationList.push(locationItem);

    const popupProps = {
      location: locationList,
    };
    setPopupProps(popupProps);
  };

  /**
   * Update All Add on Data
   */
  const updateSelectedAddon = () => {
    setOpenSlider(false);
    let _removedAddonSsr = new RemovedAddonSsrList(...removedAddonSsr);
    const categoryTitle = addonData?.title;

    const additionalBaggageRow = get(additionalBaggageData.data, [tripIndex]);

    _removedAddonSsr = getRemoveAddonSsrContext(
      _removedAddonSsr,
      [ssrCategory, categoryCodes.abhf],
      getAddonData,
      tripIndex,
      passengerDetails,
    );

    const addonNames = [categoryTitle];
    // Old Code:
    // if (abhfCategory) {
    //   addonNames.push(abhfCategory.title);
    // }

    let countNewAddOnToAdd = 0;

    /** @type {import("../../../../types/SSRObj")[]} */
    const newSelectedAddonData = [];

    additionalBaggageRow?.forEach((item) => {
      const {
        passengerKey,
        domesticE,
        internationalE,
        additionalBag,
        baggageE,
      } = item;

      const ssrData = {
        ...domesticE,
        ...internationalE,
      };

      if (item.domestic || item.international) {
        countNewAddOnToAdd += 1;
        newSelectedAddonData.push({
          passengerKey,
          addonName: categoryTitle,
          category: ssrCategory,
          price: ssrData.price,
          ssrCode: ssrData.ssrCode,
          journeyKey: segmentData.journeyKey,
          name: ssrData.name,
          action: 'add',
        });
      }

      if (additionalBag > 0) {
        countNewAddOnToAdd += 1;
        newSelectedAddonData.push({
          passengerKey,
          addonName: abhfCategory?.title,
          multiplier: additionalBag,
          category: baggageE.ssrCode,
          price: baggageE.price,
          ssrCode: baggageE.ssrCode,
          journeyKey: segmentData.journeyKey,
          name: baggageE.analytxName,
          action: 'add',
        });
      }
    });

    const _setGetSelectedAddon = newAddonData(
      state.setGetSelectedAddon,
      addonNames,
      [tripIndex],
      newSelectedAddonData,
    );

    eventService.updateReviewSummary();

    try {
      const takenSSR = addonData?.availableSSR?.[0]?.takenssr || [];
      const newPaxdata = newSelectedAddonData.map((r) => r.passengerKey);

      const filteredSSR = newSelectedAddonData
        .filter((r) => Boolean(r.ssrCode))
        .map((r) => {
          let price = r.price * r.multiplier;

          const purchased = takenSSR.find((ts) => {
            return ts.passengerKey === r.passengerKey;
          });

          if (purchased) {
            price -= purchased.price * purchased.takenCount;
          }
          return {
            ...r,
            actualPrice: price,
          };
        });

      const removedBaggageInfo = [];

      takenSSR.forEach((ts) => {
        if (!newPaxdata.includes(ts.passengerKey)) {
          removedBaggageInfo.push({
            ...ts,
            action: 'add',
            actualPrice: -ts.price * ts.takenCount,
            journeyKey: segmentData.journeyKey,
          });
        }
      });

      createEventForAddonModification(filteredSSR);
      createEventForAddonModification(removedBaggageInfo);
    } catch (error) {
      // Error Handler
    }

    /**
     * Action to prepare data and also update [setGetSelectedAddon] list from addonReducer
     */
    dispatch({
      type: addonActions.PREPARE_ADDITIONAL_BAGGAGE_DATA,
      payload: {
        newAddOnData: _setGetSelectedAddon,
        categoryName: addonData?.title,
        removedAddonSsr: _removedAddonSsr,
        ssrCategory,
        tripIndex,
      },
    });

    if (countNewAddOnToAdd > 0 || additionalBaggageData?.delayLostProtection) {
      getLocations();
    }
  };

  const onRemoveAddOn = () => {
    let _removedAddonSsr = new RemovedAddonSsrList(...removedAddonSsr);
    const _paxIndex = paxIndex[tripIndex]?.paxIndex;
    const passenger = passengerDetails[_paxIndex];
    let ssrObjsToRemove = [];
    const addonNames = [];

    // Old Code:
    // setPrice(configData.addedLabel);

    let _setGetSelectedAddon = state.setGetSelectedAddon;
    if (additionalBaggageRowItem.allowBaggageChange) {
      const ssrData = {
        ...additionalBaggageRowItem.domesticE,
        ...additionalBaggageRowItem.internationalE,
      };
      ssrObjsToRemove.push({
        passengerKey: passenger.passengerKey,
        journeyKey: segmentData.journeyKey,
        ssrCode: ssrData.ssrCode,
        action: 'remove',
      });
      addonNames.push(addonData.title);
    }
    if (abhfCategory && additionalBaggageRowItem.allowABHFChange) {
      ssrObjsToRemove.push({
        passengerKey: passenger.passengerKey,
        ssrCode: additionalBaggageRowItem.abhfCategoryssrCode,
        journeyKey: segmentData.journeyKey,
        action: 'remove',
      });
      addonNames.push(abhfCategory.title);
    }

    _setGetSelectedAddon = newAddonData(
      _setGetSelectedAddon,
      addonNames,
      [tripIndex],
      [],
      [passenger.passengerKey],
    );

    // #region <Remove Add when taken ssr is present added to removedAddonSsr context>
    _removedAddonSsr = getRemoveAddonSsrContext(
      _removedAddonSsr,
      [ssrCategory, categoryCodes.abhf],
      getAddonData,
      tripIndex,
      [passenger],
    );
    // #endregion

    const _sellAddonSsr = sellAddonSsr.filter((item) => {
      return !(
        item.categoryName === addonData.title &&
        item.tripIndex === tripIndex &&
        item.passengerKey === passenger.passengerKey
      );
    });

    const newData = [...additionalBaggageData.data];

    if (has(newData, [tripIndex, _paxIndex])) {
      const rowData = newData[tripIndex][_paxIndex];
      const prevData = {
        ...rowData,
        domestic: rowData.allowBaggageChange ? null : rowData.domestic,
        additionalBag: rowData.allowABHFChange ? 0 : rowData.additionalBag,
        international: rowData.allowBaggageChange
          ? null
          : rowData.international,
      };

      newData[tripIndex][_paxIndex] = {
        ...disableBaggageRemoveButton(prevData),
        checked: false,
      };
    }

    eventService.update([], ssrObjsToRemove);

    try {
      const alreadyPurchased = addonData?.availableSSR?.[0]?.takenssr?.find(
        (ts) => {
          return ts.passengerKey === passenger.passengerKey;
        },
      );

      if (alreadyPurchased) {
        ssrObjsToRemove = ssrObjsToRemove
          .filter((r) => Boolean(r.ssrCode))
          .map((r) => ({
            ...r,
            action: 'add',
            actualPrice: -alreadyPurchased.price * alreadyPurchased.takenCount,
          }));
      }

      createEventForAddonModification(ssrObjsToRemove);
    } catch (error) {
      // Error Handler
    }

    /**
     * Action to prepare data and also update [setGetSelectedAddon] list from addonReducer
     */
    dispatch({
      type: addonActions.RESET_ADDITIONAL_BAGGAGE_FORM_ADDON_BUTTON,
      payload: {
        tripIndex,
        tabIndex: _paxIndex,
        newAddOnData: _setGetSelectedAddon,
        categoryName: addonData?.title,
        removedAddonSsr: _removedAddonSsr,
        sellAddonSsr: _sellAddonSsr,
        ssrCategory,
        newData,
      },
    });
  };

  const brbCategory = useMemo(() => {
    const category = getAddonData.ssr[tripIndex].journeySSRs.find(
      (row) => row.category === categoryCodes.brb,
    );

    if (
      category &&
      (category.ssrs.length > 0 || category.takenssr?.length > 0)
    ) {
      return {
        ...category,
        ...category?.ssrs?.[0],
        ...category?.takenssr?.[0],
      };
    }

    return null;
  }, [tripIndex, additionalBaggageRowItem]);

  // Old Code:
  // const addonSelected =
  //   isPassengerHaveAdditionalBaggageData(additionalBaggageRowItem) ||
  //   (brbCategory && delayLostBaggageProtection);

  const props = {
    ...addonCardProps,
    setRemoveSelected: onRemoveAddOn,
    // addonSelected,
    disableCTA: additionalBaggageRowItem?.allowModify === false,
    hideRemoveCTA: additionalBaggageRowItem?.addoncantBeRemoved === true,
    // New Props for addon Added
    title: addonData?.title,
    discription: addonData?.description?.html,
    image: 'https://dummyimage.com/600x300/000/fff',
    imageHeight: 200,
    chipColor: 'info',
    chipLabel: 'Add',
    imageText: 'Image Text',
    imageSubText: 'Image sub text',
  };

  const additionalBaggageProps = {
    isOpen: isOpenSlider,
    overlayCustomClass: '',
    modalCustomClass: '',
    onClose: () => {
      setOpenSlider(false);
      dispatch({ type: addonActions.RESET_ADDITIONAL_BAGGAGE_DATA });
    },
    passengerDetails,
    addonData,
    configData,
    ssrCategory,
    onSubmit: updateSelectedAddon,
    brbCategory,
    segmentData,
    sliderPaneConfigData,
  };

  /* Old Code:
  useEffect(() => {
    const passengerIndex = paxIndex[tripIndex]?.paxIndex;
    const additionalBaggageRowItem = get(
      additionalBaggageData,
      ['data', tripIndex, passengerIndex],
      defaultAddtionalBaggageRow,
    );

    let price = 0;
    let {
      additionalBag,
      baggageE,
      international,
      internationalE,
      domestic,
      domesticE,
      currencycode,
    } = additionalBaggageRowItem;

    if (
      additionalBag === 0 &&
      domestic === null &&
      international === null &&
      (delayLostBaggageProtection !== true || brbCategory === null)
    ) {
      setPrice(configData.addLabel);
      return;
    }

    const _popover = [];
    let show = false;

    if (domestic) {
      price += domesticE.price;
      _popover.push(domesticE.name);
    }

    if (international) {
      price += internationalE.price;
      _popover.push(internationalE.name);
    }

    if (additionalBag > 0) {
      price += additionalBag * baggageE.price;
      _popover.push(baggageE.name);
    }
    show = _popover.length > 1;

    if (delayLostBaggageProtection) {
      if (brbCategory) {
        price += brbCategory?.price ?? 0;
        if (_popover.length === 0) {
          _popover.push('');
        }
        currencycode = brbCategory.currencycode;
      }
    }

    const _popoverContent = _popover.join(' & ');

    setPrice(formatCurrencyFunc({ price, currencycode }));
    setPopoverContent({ show, content: _popoverContent });
  }, [tripIndex, paxIndex, additionalBaggageData, delayLostBaggageProtection]); */

  const selectedItemTrip = additionalBaggageData.data[tripIndex];
  let selectedItem = '';
  if (
    selectedItemTrip &&
    selectedItemTrip[paxIndex[tripIndex]?.paxIndex]?.checked
  ) {
    selectedItem = `${
      selectedItemTrip[paxIndex[tripIndex].paxIndex].additionalBag
    } Piece`;
  }

  return (
    <>
      {ssrCategory === categoryCodes.abhf && (
        <AddonCard
          {...props}
          selectedItem={selectedItem}
          variation="withoutImage"
        />
      )}
      {/* Old Code:- {ssrCategory === categoryCodes.baggage && (
      <div className="skyplus-excess-baggage-main-page">
        <AdditionalBaggageSlidePane {...additionalBaggageProps} isMainCard />
      </div>
      ) } */}
      {isOpenSlider && (
        <AdditionalBaggageSlidePane {...additionalBaggageProps} />
      )}
    </>
  );
};

AdditionalBaggage.propTypes = {
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  segmentData: PropTypes.any,
  passengerDetails: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
  addonCardProps: PropTypes.object,
  setPopupProps: PropTypes.func,
  setOpenSlider: PropTypes.func,
  isOpenSlider: PropTypes.bool,
};

export default AdditionalBaggage;
