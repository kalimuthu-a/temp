import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import AddonCard from '../../common/AddonCard/AddonCard';

import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import LostBaggageProtectionSlidePane from './LostBaggageProtectionSlidePane';
import {
  getRemoveAddonSsrContext,
  newAddonData,
} from '../../../functions/utils';
// Old Code:
// import UpSellPopUp from './UpSellPopUp';
import RemovedAddonSsrList from '../../../models/RemovedAddonSsrList';
import { disableBaggageRemoveButton } from '../ExcessBaggage/ExcessBaggageUtils';
import eventService from '../../../services/event.service';
import RecommendedCard from '../../common/RecommendedCard/RecommendedCard';
import { categoryCodes } from '../../../constants/index';
import { createEventForAddonModification } from '../../../functions';

/**
 * @type {React.FC<import("../../../../types/AddOnList").LostBaggageProtectionProps>}
 * @returns {React.FunctionComponentElement}
 */
const LostBaggageProtection = ({
  isRecommended,
  configData,
  ssrCategory,
  addonData,
  passengerDetails,
  addonCardProps,
  setPopupProps,
  setAddonSelect,
  setOpenSlider,
  isOpenSlider,
  sliderPaneConfigData,
  recomendedData,
  isModifyFlow,
}) => {
  const {
    state: {
      getAddonData,
      setGetSelectedAddon,
      sellAddonSsr,
      delayLostBaggageProtection,
      removedAddonSsr,
      excessBaggageData,
      isInternationalFlight,
      tripIndex,
    },
    dispatch,
  } = useContext(AppContext);

  useEffect(() => {
    // only 1 time call for all passsengers and trip -- one time call
    dispatch({
      type: addonActions.SET_EXCESS_BAGGAE_DELAY_PROTECTION_CHECKBOX,
      payload: {
        delayLostBaggageProtection: addonCardProps.addonSelected,
        isDisabledDelayLostProtection: addonCardProps.hideRemoveCTA,
      },
    });
  }, []);

  const showSuccessPopUp = () => {
    const location = [];
    getAddonData?.ssr?.forEach((journeyData) => {
      location.push({
        to: journeyData?.journeydetail?.destination,
        from: journeyData?.journeydetail?.origin,
      });
    });

    setPopupProps({
      show: true,
      data: {
        message: addonData?.title,
        location,
      },
    });
  };

  const removeDelayBaggageAddon = () => {
    let _removedAddonSsr = new RemovedAddonSsrList(...removedAddonSsr);
    const ssrObjsToRemove = [];

    const categoryTitle = addonData?.title;
    let _setGetSelectedAddon = setGetSelectedAddon;
    const _sellAddonSsr = sellAddonSsr?.filter(
      (item) => item?.categoryName !== categoryTitle,
    );

    getAddonData?.ssr?.forEach((ssr, key) => {
      const { journeyKey, journeySSRs } = ssr;

      const category = journeySSRs.find(
        (item) => item.category === ssrCategory,
      );

      if (category) {
        const { passengersSSRKey, ssrCode } = get(category, 'ssrs.0', {
          passengersSSRKey: [],
        });

        passengersSSRKey.forEach(({ passengerKey }) => {
          const _price = category?.takenssr?.[0]?.price || 0;

          ssrObjsToRemove.push({
            passengerKey,
            journeyKey,
            ssrCode,
            action: category?.takenssr?.length > 0 ? 'add' : 'remove',
            actualPrice: -_price,
          });
        });
      }

      // #region <Remove Add when taken ssr is present added to removedAddonSsr context>
      _removedAddonSsr = getRemoveAddonSsrContext(
        _removedAddonSsr,
        [ssrCategory],
        getAddonData,
        key,
        passengerDetails,
      );
      // #region
    });

    // #region
    _setGetSelectedAddon = newAddonData(
      setGetSelectedAddon,
      [categoryTitle],
      Object.keys(getAddonData.ssr),
      [],
    );

    eventService.update([], ssrObjsToRemove);

    createEventForAddonModification([], ssrObjsToRemove);

    dispatch({
      type: addonActions.SET_DELAY_LOST_BAGGAGE_PROTECTION,
      payload: {
        delayLostBaggageProtection: false,
        setGetSelectedAddon: _setGetSelectedAddon,
        sellAddonSsr: _sellAddonSsr,
        removedAddonSsr: _removedAddonSsr,
        excessBaggageData: {
          ...excessBaggageData,
          data: excessBaggageData?.data?.map((row) => row?.map((item) => disableBaggageRemoveButton(item, false))),
        },
      },
    });

    setAddonSelect(false);
  };

  const addDelayBaggageAddon = () => {
    let _removedAddonSsr = new RemovedAddonSsrList(...removedAddonSsr);

    const categoryTitle = addonData?.title;
    let _setGetSelectedAddon = setGetSelectedAddon;
    const _sellAddonSsr = sellAddonSsr.filter(
      (item) => item.categoryName !== categoryTitle,
    );

    getAddonData.ssr.forEach((ssr, key) => {
      const { journeyKey } = ssr;

      const category = ssr.journeySSRs.find(
        (item) => item.category === ssrCategory,
      );

      if (category) {
        const {
          passengersSSRKey = [],
          ssrCode,
          price,
          name,
        } = get(category, 'ssrs.0', {});

        const newSelectedAddonData = [];

        const isAddonPurchased = category.takenssr.length > 0;

        passengersSSRKey.forEach(({ passengerKey, ssrKey }) => {
          _sellAddonSsr.push({
            ssrKey,
            count: 1,
            Note: '',
            categoryName: categoryTitle,
            ssrCategory,
          });

          newSelectedAddonData.push({
            passengerKey,
            addonName: categoryTitle,
            ssrCode,
            price,
            category: ssrCategory,
            journeyKey,
            name,
            multiplier: 1,
            action: 'add',
            actualPrice: isAddonPurchased ? 0 : price,
          });
        });

        _setGetSelectedAddon = newAddonData(
          _setGetSelectedAddon,
          [categoryTitle],
          [key],
          newSelectedAddonData,
        );

        createEventForAddonModification(newSelectedAddonData, []);
      }

      // #region <Remove Add when taken ssr is present added to removedAddonSsr context>
      _removedAddonSsr = getRemoveAddonSsrContext(
        _removedAddonSsr,
        [ssrCategory],
        getAddonData,
        key,
        passengerDetails,
      );
      // #region
    });

    eventService.updateReviewSummary();

    dispatch({
      type: addonActions.SET_DELAY_LOST_BAGGAGE_PROTECTION,
      payload: {
        delayLostBaggageProtection: true,
        setGetSelectedAddon: _setGetSelectedAddon,
        sellAddonSsr: _sellAddonSsr,
        removedAddonSsr: _removedAddonSsr,
        excessBaggageData: {
          ...excessBaggageData,
          data: excessBaggageData?.data?.map((row) => row?.map((item) => disableBaggageRemoveButton(item, false))),
        },
      },
    });

    setAddonSelect(true);
  };

  const setOpenSliderHandler = () => {
    dispatch({
      type: addonActions.SET_UPSELL_POPUP_DATA,
      payload: { actionTakenLB: true, showTAUpsellPopup: false },
    });
    setOpenSlider(true);
  };

  const props = {
    ...addonCardProps,
    setAddonSelected: () => setAddonSelect(true),
    setRemoveSelected: removeDelayBaggageAddon,
    setOpenSlider: setOpenSliderHandler,
    categoryCode: categoryCodes.brb,
    // New Props for Addon Card
    title: addonData?.title,
    image: 'https://dummyimage.com/600x300/000/fff',
    imageHeight: 200,
    chipColor: 'info',
    chipLabel: 'Add',
    imageText: 'Image Text',
    imageSubText: 'Image sub text',
  };

  // Old Code:
  // const priceObj = useMemo(() => {
  //   const category = Reflect.get(categories, categoryCodes.brb);
  //   return category ?? '';
  // }, []);

  const price =
    addonData?.availableSSR[0]?.takenssr?.[0]?.price ||
    addonData?.availableSSR[0]?.ssrs[0]?.price;
  const currencyCode =
    addonData?.availableSSR[0]?.takenssr?.[0]?.currencycode ||
    addonData?.availableSSR[0]?.ssrs[0]?.currencycode;

  const recommendedAddonDescPlural = configData?.addonDescPlural?.html
    ?.replace('{user}', passengerDetails[0]?.name?.first)
    ?.replace('{count}', passengerDetails.length - 1);
  const recommendedAddonDescSingular = configData?.addonDescSingular?.html
    ?.replace('{user}', passengerDetails[0]?.name?.first);

  const recommendedLostBaggageProps = {
    ...addonCardProps,
    setRemoveSelected: removeDelayBaggageAddon,
    setOpenSlider: setOpenSliderHandler,
    selfSelectedAddobe: false,
    setAddonSelected: () => setAddonSelect(true),
    subTitle: passengerDetails?.length > 1 ? recommendedAddonDescPlural : recommendedAddonDescSingular,
    offeredPrice: price,
    slashedPrice: '',
    currencyCode,
    addedLabel: configData?.addedLabel,
    recomendedData,
    removeConfirmationPopup: sliderPaneConfigData?.removeCombo,
    isTakenSSRInModifyFlow: getAddonData?.ssr?.[tripIndex]?.journeySSRs?.some(
      (sr) => sr.category === categoryCodes.brb,
    ) && isModifyFlow,
    eachLabel: configData?.eachLabel,
  };

  /**
   * @param {boolean} checked
   */
  const onSubmit = (checked) => {
    setOpenSlider(false);

    if (checked) {
      showSuccessPopUp();
      addDelayBaggageAddon();
    } else {
      removeDelayBaggageAddon();
    }
  };

  useEffect(() => {
    if (
      delayLostBaggageProtection &&
        excessBaggageData.delayLostProtection &&
        !excessBaggageData.isDisabledDelayLostProtection
    ) {
      addDelayBaggageAddon();
    }
  }, [delayLostBaggageProtection]);

  const lostBaggageProps = {
    isOpen: isOpenSlider,
    onClose: () => setOpenSlider(false),
    addonData,
    configData,
    onSubmit,
    sliderPaneConfigData,
  };

  return (
    <>
      {!isRecommended && <AddonCard {...props} variation="withoutImage" />}
      {isRecommended && <RecommendedCard {...recommendedLostBaggageProps} />}
      <LostBaggageProtectionSlidePane
        {...lostBaggageProps}
        isInternational={isInternationalFlight}
      />
      {/* TD: */}
      {/* <UpSellPopUp
        addonData={addonData}
        setOpenSlider={setOpenSlider}
        isInternational={isInternationalFlight}
      /> */}
    </>
  );
};

LostBaggageProtection.propTypes = {
  addonCardProps: PropTypes.shape({
    addonSelected: PropTypes.any,
    hideRemoveCTA: PropTypes.any,
  }),
  addonData: PropTypes.any,
  configData: PropTypes.any,
  isOpenSlider: PropTypes.any,
  passengerDetails: PropTypes.any,
  setAddonSelect: PropTypes.func,
  setOpenSlider: PropTypes.func,
  setPopupProps: PropTypes.func,
  ssrCategory: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
  isRecommended: PropTypes.bool,
  recomendedData: PropTypes.object,
  isModifyFlow: PropTypes.string,
};

export default LostBaggageProtection;
