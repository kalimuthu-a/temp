import React, { useContext } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import AddonCard from '../../common/AddonCard/AddonCard';
import RecommendedCard from '../../common/RecommendedCard/RecommendedCard';
import CancellationSlidePane from './CancellationSlidePane';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import {
  getRemoveAddonSsrContext,
  newAddonData,
} from '../../../functions/utils';
// Old Code:
// import UpSellPopUp from './UpsellPopup';
// import PopOver from '../../../common/Popover/PopOver';
import RemovedAddonSsrList from '../../../models/RemovedAddonSsrList';
import eventService from '../../../services/event.service';
import { createEventForAddonModification } from '../../../functions';
import { categoryCodes } from '../../../constants';

/**
 * @type {React.FC<import("../../../../types/AddOnList").CancellationProps>}
 * @returns {React.FunctionComponentElement}
 */
const Cancellation = ({
  addonData,
  configData,
  ssrCategory,
  passengerDetails,
  segmentData,
  addonCardProps,
  setPopupProps,
  setAddonSelect,
  setOpenSlider,
  isOpenSlider,
  sliderPaneConfigData,
  isRecommended,
  recomendedData,
  isModifyFlow,
}) => {
  const {
    state: {
      setGetSelectedAddon,
      sellAddonSsr,
      getAddonData,
      upSellPopup,
      persistPassengerDetails,
      removedAddonSsr,
      tripIndex,
      // Old Code:
      // travelAssistanceAdded,
    },
    dispatch,
  } = useContext(AppContext);

  const onRemoveAddon = () => {
    setAddonSelect(false);
    let _removedAddonSsr = new RemovedAddonSsrList(...removedAddonSsr);
    const ssrObjsToRemove = [];

    const categoryTitle = addonData?.title;
    let _setGetSelectedAddon = setGetSelectedAddon;
    const _sellAddonSsr = sellAddonSsr.filter(
      (item) => item.categoryName !== categoryTitle,
    );

    getAddonData?.ssr?.forEach((ssr, key) => {
      const { journeyKey, journeySSRs } = ssr;
      const category = journeySSRs.find(
        (item) => item.category === ssrCategory,
      );

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

    eventService.update([], ssrObjsToRemove);

    createEventForAddonModification(ssrObjsToRemove);

    _setGetSelectedAddon = newAddonData(
      setGetSelectedAddon,
      [categoryTitle],
      Object.keys(getAddonData.ssr),
      [],
    );

    dispatch({
      type: addonActions.SET_CANCELLATION_ADDON,
      payload: {
        setGetSelectedAddon: _setGetSelectedAddon,
        sellAddonSsr: _sellAddonSsr,
        cancellationAdded: false,
        removedAddonSsr: _removedAddonSsr,
        // Old Code:
        // ...(!travelAssistanceAdded && {
        //   getPassengerDetails: persistPassengerDetails,
        // }),
        getPassengerDetails: persistPassengerDetails,
      },
    });
  };

  const setOpenSliderHandler = () => {
    if (upSellPopup.actionTakenCA === false) {
      dispatch({
        type: addonActions.SET_UPSELL_POPUP_DATA,
        payload: { actionTakenCA: true, showCAUpsellPopup: false },
      });
    }
    setOpenSlider(true);
  };

  const props = {
    ...addonCardProps,
    setRemoveSelected: onRemoveAddon,
    setOpenSlider: setOpenSliderHandler,
    isTakenSSRInModifyFlow: getAddonData?.ssr?.[tripIndex]?.journeySSRs?.some(
      (sr) => sr.category === categoryCodes.ifnr,
    ) && isModifyFlow,
  };

  const getLocations = () => {
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

  const onSubmitAddon = () => {
    setOpenSlider(false);
    setAddonSelect(true);
    let _removedAddonSsr = new RemovedAddonSsrList(...(removedAddonSsr ?? []));

    const _passengerDetails = passengerDetails?.map((passen) => {
      // const personData = data.data[key];
      // row.info.dateOfBirth = toISOString(personData.dob);
      // row.info.nationality = data.country.iso;
      return cloneDeep({ ...passen });
    });

    const categoryTitle = addonData?.title;
    let _setGetSelectedAddon = setGetSelectedAddon;

    const ssrCategories = [categoryTitle];
    const ssrCodes = [ssrCategory];

    const _sellAddonSsr = sellAddonSsr.filter(
      (item) => !ssrCategories.includes(item.categoryName),
    );

    getAddonData.ssr.forEach((ssr, key) => {
      const { journeyKey } = ssr;
      const category = ssr.journeySSRs.find(
        (item) => item.category === ssrCategory,
      );

      if (category) {
        const {
          passengersSSRKey = [],
          ssrCode = '',
          price = '',
          name = '',
        } = get(category, 'ssrs.0', {});

        const isAddonPurchased = category.takenssr.length > 0;

        const newSelectedAddonData = [];

        passengersSSRKey.forEach(({ passengerKey, ssrKey }) => {
          _sellAddonSsr.push({
            ssrKey,
            count: 1,
            Note: '',
            categoryName: categoryTitle,
            ssrCategory,
          });
          newSelectedAddonData.push({
            addonName: categoryTitle,
            passengerKey,
            ssrCode,
            price,
            category: ssrCategory,
            journeyKey,
            name,
            action: 'add',
            multiplier: 1,
            actualPrice: isAddonPurchased ? 0 : price,
          });
        });

        _setGetSelectedAddon = newAddonData(
          _setGetSelectedAddon,
          ssrCategories,
          [key],
          newSelectedAddonData,
        );

        createEventForAddonModification(newSelectedAddonData);
      }

      // #region <Remove Add when taken ssr is present added to removedAddonSsr context>
      _removedAddonSsr = getRemoveAddonSsrContext(
        _removedAddonSsr,
        ssrCodes,
        getAddonData,
        key,
        passengerDetails,
      );
      // #region
    });

    eventService.updateReviewSummary();

    dispatch({
      type: addonActions.SET_CANCELLATION_ADDON,
      payload: {
        setGetSelectedAddon: _setGetSelectedAddon,
        sellAddonSsr: _sellAddonSsr,
        cancellationAdded: true,
        getPassengerDetails: _passengerDetails,
        removedAddonSsr: _removedAddonSsr,
      },
    });

    getLocations();
  };

  const slideProps = {
    onClose: () => setOpenSlider(false),
    onSubmit: onSubmitAddon,
    passengerDetails,
    addonData,
    configData,
    ssrCategory,
    segmentData,
    sliderPaneConfigData,
  };

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

  const recommendedCardProps = {
    ...props,
    subTitle: passengerDetails?.length > 1 ? recommendedAddonDescPlural : recommendedAddonDescSingular,
    slashedPrice: '',
    offeredPrice: price || 0,
    currencyCode,
    setRemoveSelected: onRemoveAddon,
    setOpenSlider: setOpenSliderHandler,
    addedLabel: configData?.addedLabel,
    recomendedData,
    removeConfirmationPopup: sliderPaneConfigData?.removeCombo,
    isTakenSSRInModifyFlow: getAddonData?.ssr?.[tripIndex]?.journeySSRs?.some(
      (sr) => sr.category === categoryCodes.ifnr,
    ) && isModifyFlow,
    eachLabel: configData?.eachLabel,
  };

  return (
    <>
      {isRecommended && <RecommendedCard {...recommendedCardProps} />}
      {!isRecommended && <AddonCard {...props} />}
      {/* Old Code: <AddonCard
        {...props}
        renderTitlePopover={() => {
        return (
  <PopOver
    tooltipContent={(
      <div
        dangerouslySetInnerHTML={{
                  __html: addonData?.categoryInformationRte,
        }}
      />
      )}
    withClose
    TargetElem={<span className="m-1 icon-info_24 indigoIcon" />}
    withClickHandler
  />
        );
        }}
      /> */}
      {isOpenSlider && <CancellationSlidePane {...slideProps} />}
      {/* <UpSellPopUp addonData={addonData} setOpenSlider={setOpenSlider} /> */}
    </>
  );
};

Cancellation.propTypes = {
  addonData: PropTypes.any,
  configData: PropTypes.any,
  ssrCategory: PropTypes.any,
  passengerDetails: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
  isRecommended: PropTypes.bool,
  segmentData: PropTypes.object,
  addonCardProps: PropTypes.object,
  setPopupProps: PropTypes.func,
  setAddonSelect: PropTypes.func,
  setOpenSlider: PropTypes.func,
  isOpenSlider: PropTypes.bool,
  recomendedData: PropTypes.object,
  isModifyFlow: PropTypes.string,
};

export default Cancellation;
