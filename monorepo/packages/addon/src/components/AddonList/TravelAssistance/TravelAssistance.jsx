import React, { useContext } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import AddonCard from '../../common/AddonCard/AddonCard';
import RecommendedCard from '../../common/RecommendedCard/RecommendedCard';
import TravelAssistanceSlidePane from './TravelAssistanceSlidePane';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import {
  getRemoveAddonSsrContext,
  newAddonData,
} from '../../../functions/utils';
// import UpSellPopUp from './UpsellPopup';
// TD: Popover is not found
// import PopOver from '../../../common/Popover/PopOver';
import RemovedAddonSsrList from '../../../models/RemovedAddonSsrList';
import eventService from '../../../services/event.service';
import { createEventForAddonModification } from '../../../functions';
import { categoryCodes } from '../../../constants';

/**
 * @type {React.FC<import("../../../../types/AddOnList").TravelAssistanceProps>}
 * @returns {React.FunctionComponentElement}
 */
const TravelAssistance = ({
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
      removedAddonSsr,
      tripIndex,
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

      //  Old Code: #region <Remove Add when taken ssr is present added to removedAddonSsr context>
      _removedAddonSsr = getRemoveAddonSsrContext(
        _removedAddonSsr,
        [ssrCategory],
        getAddonData,
        key,
        passengerDetails,
      );
      // Old Code: #region
    });

    eventService.update([], ssrObjsToRemove);

    createEventForAddonModification([], ssrObjsToRemove);

    _setGetSelectedAddon = newAddonData(
      setGetSelectedAddon,
      [categoryTitle],
      Object.keys(getAddonData.ssr),
      [],
    );

    dispatch({
      type: addonActions.SET_TRAVEL_ASSISTANCE_ADDON,
      payload: {
        setGetSelectedAddon: _setGetSelectedAddon,
        sellAddonSsr: _sellAddonSsr,
        travelAssistanceAdded: false,
        removedAddonSsr: _removedAddonSsr,
        // Old Code:
        // getPassengerDetails: persistPassengerDetails.map((row, index) => {
        //   return {
        //     ...row,
        //     info: cancellationAdded ? passengerDetails[index].info : row.info,
        //   };
        // }),
      },
    });
  };

  const setOpenSliderHandler = () => {
    if (upSellPopup.actionTakenTA === false) {
      dispatch({
        type: addonActions.SET_UPSELL_POPUP_DATA,
        payload: { actionTakenTA: true, showTAUpsellPopup: false },
      });
    }
    setOpenSlider(true);
  };

  const props = {
    ...addonCardProps,
    setRemoveSelected: onRemoveAddon,
    setOpenSlider: setOpenSliderHandler,
    isTakenSSRInModifyFlow: getAddonData?.ssr?.[tripIndex]?.journeySSRs?.some(
      (sr) => sr.category === categoryCodes.prot,
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

    /* Old Code:
    const _passengerDetails = passengerDetails?.map((passen, key) => {
      const row = cloneDeep({ ...passen });
      const personData = data.data[key];
      row.info.dateOfBirth = toISOString(personData.dob);
      row.info.nationality = data.country.iso;
      const travelDocuments = get(row, 'travelDocuments', []);
      row.travelDocuments = [];

      if (personData.passportNumber) {
        const _d = toISOString(personData.passportExpiry);
        let travelDocumentP = {
          passengerTravelDocumentKey: '',
          documentTypeCode: documentTypeCode.passport,
          nationality: null,
          action: null,
        };
        const travelDocumentPIndex = travelDocuments.findIndex(
          (row) => row.documentTypeCode === documentTypeCode.passport,
        );
        if (travelDocumentPIndex >= 0) {
          travelDocumentP = travelDocuments[travelDocumentPIndex];
        }

        row.travelDocuments.push({
          ...travelDocumentP,
          ...{
            number: personData.passportNumber,
            expirationDate: _d,
            issuedDate: _d,
            nationality: data.country.iso,
          },
        });
      }

      const _d = toISOString(personData.visaExpiry);
      if (personData.visaNumber && _d) {
        const travelDocumentV = {
          passengerTravelDocumentKey: '',
          documentTypeCode: documentTypeCode.visa,
          nationality: null,
          action: null,
        };
        const travelDocumentVIndex = travelDocuments.findIndex(
          (row) => row.documentTypeCode === documentTypeCode.visa,
        );

        row.travelDocuments.push({
          ...get(travelDocuments, travelDocumentVIndex, travelDocumentV),
          ...{
            number: personData.visaNumber,
            expirationDate: _d,
            issuedDate: _d,
            nationality: data.country.iso,
          },
        });
      }

      return row;
    }); */

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
          price,
          ssrCode,
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
            action: 'add',
            multiplier: 1,
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
      // Old Code:
      //  #region <Remove Add when taken ssr is present added to removedAddonSsr context>
      _removedAddonSsr = getRemoveAddonSsrContext(
        _removedAddonSsr,
        [ssrCategory],
        getAddonData,
        key,
        passengerDetails,
      );

      // Old Code:
      // #region
    });

    eventService.updateReviewSummary();

    dispatch({
      type: addonActions.SET_TRAVEL_ASSISTANCE_ADDON,
      payload: {
        setGetSelectedAddon: _setGetSelectedAddon,
        sellAddonSsr: _sellAddonSsr,
        travelAssistanceAdded: true,
        // Old Code:
        // getPassengerDetails: _passengerDetails,
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
      (sr) => sr.category === categoryCodes.prot,
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
      {isOpenSlider && <TravelAssistanceSlidePane {...slideProps} />}
      {/* Old Code: <UpSellPopUp addonData={addonData} setOpenSlider={setOpenSlider} /> */}
    </>
  );
};

TravelAssistance.propTypes = {
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

export default TravelAssistance;
