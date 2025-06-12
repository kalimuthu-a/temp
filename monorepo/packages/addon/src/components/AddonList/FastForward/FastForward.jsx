import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import AddonCard from '../../common/AddonCard/AddonCard';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { categoryCodes, productClassCodes, ssrType } from '../../../constants/index';
import { getSsrObj, updateSelectedAddonData } from '../../../functions/utils';
import eventService from '../../../services/event.service';
import FastForwardSlidePane from './FastForwardSlidePane';
import RecommendedCard from '../../common/RecommendedCard/RecommendedCard';
import { categoryTitleCodes } from '../../../constants/aemAuthoring';
import { createEventForAddonModification } from '../../../functions';

const FastForward = ({
  segmentData,
  addonData,
  configData,
  ssrCategory,
  passengerDetails,
  passengerKey,
  tripId,
  sliderPaneConfigData,
  isRecommended,
  recomendedData,
  loyaltyData,
  isModifyFlow,
}) => {
  const {
    state: {
      tripIndex,
      setSellFastForward,
      sellAddonSsr,
      paxIndex,
      setGetSelectedAddon,
      primBundleFare,
      removedAddonSsr,
      getAddonData,
    },
    dispatch,
  } = React.useContext(AppContext);

  const [isAddonSelect, setAddonSelect] = useState(false);
  const [isAddonSubmit, setAddonSubmit] = useState(false);
  const [paxList, setPaxList] = useState(cloneDeep(passengerDetails));
  const [isOpenSlider, setOpenSlider] = useState(false);
  // Old Code:
  // const [popupProps, setPopupProps] = useState();
  // const [isShowSuccessPopup, setShowSuccessPopup] = useState(false);
  // const journeydetail = addonData?.journeydetail;
  const FastForwardApiObj =
    addonData?.availableSSR[0]?.takenssr?.[0] ||
    addonData?.availableSSR[0]?.ssrs[0];
  const FastForwardApiObjs = addonData?.availableSSR[0]?.ssrs || [];
  const FastForwardPrice = FastForwardApiObj?.price;
  const currencyCode = FastForwardApiObj?.currencycode;
  const currencyIcon = currencyCode || '₹';
  const takenSsr = addonData?.availableSSR[0]?.takenssr || [];
  const isSsrs = addonData?.availableSSR[0]?.ssrs || [];
  const [isDisableCTA, setDisableCTA] = useState(isSsrs?.length < 1);
  const [isHideRemoveCTA, setHideRemoveCTA] = useState(
    takenSsr?.length > 0 && !takenSsr?.[0]?.canBeRemoved,
  );
  const [isSuper6Efare, setSuper6Efare] = useState(
    segmentData?.productClass &&
      segmentData?.productClass === productClassCodes.super6e &&
      takenSsr?.length > 0,
  );

  const checkTakenSsr = () => {
    if (takenSsr?.length > 0) {
      let isDeleted = false;
      removedAddonSsr?.forEach((removedItem) => {
        takenSsr?.forEach((takenSsrItem) => {
          if (takenSsrItem.originalSsrKey === removedItem.ssrKey) {
            isDeleted = true;
          }
        });
      });
      if (primBundleFare[tripIndex] && !primBundleFare[tripIndex].isSelected) {
        isDeleted = true;
      }
      return !isDeleted;
    }
    return false;
  };

  const [isTakenSsrData, setTakenSsrData] = useState(checkTakenSsr());

  /* Old Code:
  const getLocations = () => {
    const locationList = [];

    const locationItem = {
      from: journeydetail?.origin,
      to: journeydetail?.destination,
    };

    locationList.push(locationItem);

    const popupProp = {
      title: configData?.serviceSuccessfullyAddedPopupLabel,
      message: addonData?.title,
      location: locationList,
    };
    setPopupProps(popupProp);
    setShowSuccessPopup(true);
  }; */

  const toggleSelectAll = (isSelected) => {
    const finalSelectedList = { ...setSellFastForward };
    let removedAddonSsrData = [...removedAddonSsr];
    finalSelectedList[tripId] = [];
    const addonKeyDataList = [];
    if (isSelected) {
      paxList.forEach((paxDetails) => {
        const updatedPaxDetails = { ...paxDetails };
        FastForwardApiObjs.forEach((ssrData) => {
          ssrData?.passengersSSRKey.forEach((paxKey) => {
            if (updatedPaxDetails.passengerKey === paxKey.passengerKey) {
              updatedPaxDetails.ssrKey = paxKey.ssrKey;
            }
          });

          let isSsrSold = false;
          let isBundle = false;

          if (takenSsr?.length > 0) {
            takenSsr?.forEach((takenSsrItem) => {
              if (takenSsrItem.originalSsrKey === updatedPaxDetails?.ssrKey) {
                isSsrSold = true;
              }
              if (takenSsrItem.bundleCode) {
                isBundle = true;
              }
            });
          }

          if (
            !isSsrSold ||
            (isSsrSold &&
              isBundle &&
              !(
                primBundleFare[tripIndex] &&
                primBundleFare[tripIndex].isSelected
              ))
          ) {
            const sellAddonItem = {
              ssrKey: updatedPaxDetails?.ssrKey,
              count: 1,
              note: '',
              passengerKey: updatedPaxDetails?.passengerKey,
            };
            finalSelectedList[tripIndex].push(sellAddonItem);
          } else {
            const keyObj = {
              passengerKey: updatedPaxDetails?.passengerKey,
              addonName: addonData?.categoryTitle,
            };
            addonKeyDataList.push(keyObj);
          }
          removedAddonSsrData = removedAddonSsrData.filter(
            (existingSsr) => existingSsr.ssrKey !== updatedPaxDetails?.ssrKey,
          );
        });
      });
    }
    const paxData = cloneDeep(paxList);
    setPaxList(paxData);
    // Old Code:
    // setAddonSelect((prev) => !prev);
    setAddonSelect(true);
    dispatch({
      type: addonActions.SET_SELL_FAST_FORWARD,
      payload: finalSelectedList,
    });
    dispatch({
      type: addonActions.REMOVE_ADDON_SSR,
      payload: removedAddonSsrData,
    });
    setTakenSsrData(false);
    if (addonKeyDataList.length > 0) {
      // Old Code:
      // getLocations();
      updateSelectedAddonData(
        tripIndex,
        setGetSelectedAddon,
        addonData,
        addonKeyDataList,
        dispatch,
        addonActions,
      );
    }
  };

  const updateSelectedAddon = () => {
    const addonKeyDataList = [];

    if (isSuper6Efare) {
      if (passengerDetails) {
        passengerDetails?.forEach((paxItem) => {
          const keyObj = {
            passengerKey: paxItem?.passengerKey,
            addonName: addonData?.title,
          };
          addonKeyDataList.push(keyObj);
        });
      }
    } else if (setSellFastForward) {
      setSellFastForward[tripId].forEach((ssrItem) => {
        const keyObj = {
          passengerKey: ssrItem?.passengerKey,
          addonName: addonData?.title,
        };
        addonKeyDataList.push(keyObj);
      });
    }

    updateSelectedAddonData(
      tripIndex,
      setGetSelectedAddon,
      addonData,
      addonKeyDataList,
      dispatch,
      addonActions,
    );
  };

  const updateSsrObjectList = (ssrObjList) => {
    const removedSsrObjList = [];

    const takenssr = addonData?.availableSSR[0]?.takenssr || [];
    const _price = addonData?.availableSSR[0]?.takenssr[0]?.price || 0;

    ssrObjList.forEach((ssrObj) => {
      const removedSsrObj = {
        passengerKey: ssrObj.passengerKey,
        journeyKey: ssrObj.journeyKey,
        ssrCode: ssrObj.ssrCode,
        segmentKey: ssrObj.segmentKey,
        action: takenssr?.length > 0 ? 'add' : 'remove',
        actualPrice: -_price,
      };
      removedSsrObjList.push(removedSsrObj);
    });
    eventService.update([], removedSsrObjList);

    if (takenssr.length > 0) {
      takenssr.forEach((ssrObj) => {
        const removedSsrObj = {
          passengerKey: ssrObj.passengerKey,
          journeyKey: segmentData.journeyKey,
          ssrCode: ssrObj.ssrCode,
          action: 'add',
          actualPrice: -_price,
        };
        removedSsrObjList.push(removedSsrObj);
      });
    }

    createEventForAddonModification(removedSsrObjList);
  };

  useEffect(() => {
    if (setSellFastForward && setSellFastForward[tripId] && isAddonSelect) {
      if (setSellFastForward[tripId]?.length > 0) {
        // Old Code:
        // getLocations();
        updateSelectedAddon();
      }
      const setFastForwardData = [];
      if (Object.keys(setSellFastForward).length > 0) {
        Object.keys(setSellFastForward).forEach((trip) => {
          setSellFastForward[trip].forEach((ssrItem) => {
            const sellAddonItem = {
              ssrKey: ssrItem?.ssrKey,
              count: 1,
              note: '',
              categoryName: addonData?.title,
              ssrCategory,
            };
            setFastForwardData.push(sellAddonItem);
          });
        });
      }

      let sellAddonData = [];
      if (sellAddonSsr && sellAddonSsr.length > 0) {
        sellAddonData = [...sellAddonSsr];
        sellAddonData = sellAddonData.filter(
          (addonItem) => addonItem?.categoryName !== addonData?.title,
        );
        setFastForwardData.forEach((ssrItem) => {
          sellAddonData.push(ssrItem);
        });

        let removedSsrData = [...sellAddonSsr];
        removedSsrData = removedSsrData.filter(
          (addonItem) => addonItem?.categoryName === addonData?.title,
        );

        if (removedSsrData?.length > 0) {
          const ssrObjList = getSsrObj(
            removedSsrData,
            getAddonData,
            ssrType.segment,
            ssrCategory,
            addonData?.title,
          );
          updateSsrObjectList(ssrObjList);
          // Old Code:
          // const removedSsrObjList = [];
          // ssrObjList.forEach((ssrObj) => {
          //   const removedSsrObj = {
          //     passengerKey: ssrObj.passengerKey,
          //     journeyKey: ssrObj.journeyKey,
          //     ssrCode: ssrObj.ssrCode,
          //     segmentKey: ssrObj.segmentKey,
          //   };
          //   removedSsrObjList.push(removedSsrObj);
          // });
          // eventService.update([], removedSsrObjList);
        }
      } else {
        sellAddonData = [...setFastForwardData];
      }

      dispatch({
        type: addonActions.SET_SELL_ADDON_SSR,
        payload: sellAddonData,
      });

      let ssrObjList = getSsrObj(
        sellAddonData,
        getAddonData,
        ssrType.journey,
        ssrCategory,
        addonData?.title,
      );

      const takenssr = addonData?.availableSSR[0]?.takenssr || [];

      ssrObjList = ssrObjList.map((_ssrObj) => {
        return {
          ..._ssrObj,
          actualPrice: takenssr.length > 0 ? 0 : _ssrObj.price,
        };
      });

      eventService.update(ssrObjList, []);
      createEventForAddonModification(ssrObjList);

      setAddonSubmit(false);
    }
  }, [setSellFastForward, isAddonSubmit]);

  useEffect(() => {
    if (setSellFastForward && setSellFastForward[tripId]) {
      if (setSellFastForward[tripId].length > 0) {
        setAddonSelect(true);
      } else {
        setAddonSelect(false);
        // Old Code:
        // setShowSuccessPopup(false);
      }
    } else {
      setAddonSelect(false);
      // Old Code:
      // setShowSuccessPopup(false);
    }
  }, [tripId, paxIndex, isAddonSubmit, addonData]);

  useEffect(() => {
    if (isSuper6Efare) {
      updateSelectedAddon();
    }
  }, [isSuper6Efare]);

  useEffect(() => {
    if (isSuper6Efare && setGetSelectedAddon?.length > 0) {
      updateSelectedAddon();
    }
  }, [setGetSelectedAddon]);

  useEffect(() => {
    setDisableCTA(isSsrs?.length < 1);
  }, [tripIndex, isSsrs]);

  useEffect(() => {
    setHideRemoveCTA(takenSsr?.length > 0 && !takenSsr?.[0]?.canBeRemoved);

    setSuper6Efare(
      segmentData?.productClass &&
        segmentData?.productClass === productClassCodes.super6e &&
        takenSsr?.length > 0,
    );

    setTakenSsrData(checkTakenSsr());
  }, [tripIndex, takenSsr]);

  const removeSelectedFastforward = () => {
    const sellFastForwardData = { ...setSellFastForward };
    let removedAddonSsrData = [...removedAddonSsr];

    if (sellAddonSsr && sellAddonSsr.length > 0) {
      let sellAddonData = [...sellAddonSsr];
      sellFastForwardData[tripIndex]?.forEach((removalSsr) => {
        sellAddonData = sellAddonData.filter(
          (existingSsr) => existingSsr.ssrKey !== removalSsr.ssrKey,
        );

        let isSsrSold = false;
        let isBundle = false;

        if (takenSsr?.length > 0) {
          takenSsr?.forEach((takenSsrItem) => {
            if (takenSsrItem.originalSsrKey === removalSsr.ssrKey) {
              isSsrSold = true;
            }
            if (takenSsrItem.bundleCode) {
              isBundle = true;
            }
          });
        }

        if (isSsrSold && !isBundle) {
          removedAddonSsrData = removedAddonSsrData.filter(
            (existingSsr) => existingSsr.ssrKey !== removalSsr.ssrKey,
          );
          const removalData = { ssrKey: removalSsr.ssrKey };
          removedAddonSsrData.push(removalData);
        }
      });

      // eslint-disable-next-line sonarjs/no-collapsible-if
      if (
        !sellFastForwardData[tripIndex] ||
        sellFastForwardData[tripIndex]?.length < 1
      ) {
        if (takenSsr?.length > 0) {
          takenSsr?.forEach((takenSsrItem) => {
            removedAddonSsrData = removedAddonSsrData.filter(
              (existingSsr) => existingSsr.ssrKey !== takenSsrItem.originalSsrKey,
            );
            const removalData = { ssrKey: takenSsrItem.originalSsrKey };
            removedAddonSsrData.push(removalData);
          });
        }
      }

      dispatch({
        type: addonActions.SET_SELL_ADDON_SSR,
        payload: sellAddonData,
      });

      const ssrObjList = getSsrObj(
        sellFastForwardData[tripIndex],
        getAddonData,
        ssrType.journey,
        ssrCategory,
        addonData?.title,
      );
      updateSsrObjectList(ssrObjList);
      // Old Code:
      // const removedSsrObjList = [];
      // ssrObjList.forEach((ssrObj) => {
      //   const removedSsrObj = {
      //     passengerKey: ssrObj.passengerKey,
      //     journeyKey: ssrObj.journeyKey,
      //     ssrCode: ssrObj.ssrCode,
      //     segmentKey: ssrObj.segmentKey,
      //   };
      //   removedSsrObjList.push(removedSsrObj);
      // });
      // eventService.update([], removedSsrObjList);
    } else if (takenSsr?.length > 0) {
      takenSsr?.forEach((takenSsrItemData) => {
        removedAddonSsrData = removedAddonSsrData.filter(
          (existingSsr) => existingSsr.ssrKey !== takenSsrItemData.originalSsrKey,
        );
        const removalData = { ssrKey: takenSsrItemData.originalSsrKey };
        removedAddonSsrData.push(removalData);
      });
    }
    dispatch({
      type: addonActions.REMOVE_ADDON_SSR,
      payload: removedAddonSsrData,
    });

    const ssrObjList = getSsrObj(
      removedAddonSsrData,
      getAddonData,
      ssrType.journey,
      ssrCategory,
      addonData?.title,
    );
    updateSsrObjectList(ssrObjList);
    // Old Code:
    // const removedSsrObjList = [];
    // ssrObjList.forEach((ssrObj) => {
    //   const removedSsrObj = {
    //     passengerKey: ssrObj.passengerKey,
    //     journeyKey: ssrObj.journeyKey,
    //     ssrCode: ssrObj.ssrCode,
    //     segmentKey: ssrObj.segmentKey,
    //   };
    //   removedSsrObjList.push(removedSsrObj);
    // });
    // eventService.update([], removedSsrObjList);

    if (
      setGetSelectedAddon &&
      setGetSelectedAddon[tripIndex].selectedAddone.length > 0
    ) {
      const selectedAddonData = { ...setGetSelectedAddon };
      sellFastForwardData[tripIndex]?.forEach((removalKeyObj) => {
        selectedAddonData[tripIndex].selectedAddone.forEach(
          (addonItem, index) => {
            if (
              addonItem?.passengerKey === removalKeyObj?.passengerKey &&
              addonItem?.addonName === addonData?.title
            ) {
              selectedAddonData[tripIndex].selectedAddone.splice(index, 1);
            }
          },
        );
      });

      if (takenSsr?.length > 0) {
        takenSsr?.forEach((takenSsrItem) => {
          selectedAddonData[tripIndex].selectedAddone.forEach(
            (addonItem, index) => {
              if (
                addonItem?.passengerKey === takenSsrItem?.passengerKey &&
                addonItem?.addonName === addonData?.title
              ) {
                selectedAddonData[tripIndex].selectedAddone.splice(index, 1);
              }
            },
          );
        });
      }

      dispatch({
        type: addonActions.SET_GET_SELECTED_ADDON,
        payload: selectedAddonData,
      });
    }

    sellFastForwardData[tripIndex] = [];
    dispatch({
      type: addonActions.SET_SELL_FAST_FORWARD,
      payload: sellFastForwardData,
    });

    setAddonSelect(false);
    // Old Code:
    // setShowSuccessPopup(false);
    setTakenSsrData(false);
  };
  const disableCTA = () => {
    return (
      primBundleFare[tripIndex]?.isSelected || isSuper6Efare || isDisableCTA
    );
  };
  const hideRemoveCTA = () => {
    if (primBundleFare[tripIndex]) {
      return primBundleFare[tripIndex].isSelected;
    }
    return isSuper6Efare || isHideRemoveCTA;
  };
  const addonSelect = () => {
    if (primBundleFare[tripIndex]?.isSelected || isSuper6Efare) {
      return true;
    }
    return isAddonSelect;
  };
  const isCheckboxVisible = () => {
    if (primBundleFare[tripIndex]) {
      return !primBundleFare[tripIndex].isSelected;
    }
    return !(isSuper6Efare || isDisableCTA || isHideRemoveCTA);
  };
  const addInfoLable = () => {
    let labelText = '';
    if (primBundleFare[tripIndex]?.isSelected) {
      labelText = configData?.includedAsPartOfBundleLabel?.replace(
        '{}',
        categoryTitleCodes?.prim,
      );
    }
    return labelText?.length ? labelText : null;
  };

  const props = {
    title: addonData?.title,
    discription: addonData?.description?.html,
    uptoLabel: '',
    discountLabel: '',
    addLabel: configData?.addLabel,
    addedLabel: configData?.addedLabel,
    removeLable: configData?.removeLabel,
    addInfoLable: addInfoLable(),
    addonType: ssrCategory,
    addonSelected: addonSelect() || checkTakenSsr(),
    selectedAddonName: '',
    selectedAddonPrice: 0,
    isInformationIcon: false,
    isCheckboxVisible: isCheckboxVisible(),
    isCheckboxSelected: isAddonSelect || checkTakenSsr(),
    fastForwardPrice: FastForwardPrice,
    onChangeHandler: () => (isAddonSelect || checkTakenSsr()
      ? removeSelectedFastforward()
      : toggleSelectAll(true)),
    isCheckboxId: `fast-forward-${tripId}-${passengerKey}`,
    isCheckboxLabel: addonData?.categoryDetails,
    selfSelectedAddobe: false,
    setAddonSelected: () => (isAddonSelect || isTakenSsrData
      ? removeSelectedFastforward()
      : toggleSelectAll(true)),
    setRemoveSelected: () => removeSelectedFastforward(),
    currencyIcon,
    disableCTA: disableCTA(),
    hideRemoveCTA: hideRemoveCTA(),
    setOpenSlider: () => setOpenSlider(true), // this open slider
    image: addonData?.image?._publishUrl,
    discountPer: loyaltyData?.discountPer,
    offLabel: addonData?.availableSlidePaneData[0]?.loyaltyOfferLabel,
  };

  const recommendedAddonDescPlural = configData?.addonDescPlural?.html
    ?.replace('{user}', passengerDetails[0]?.name?.first)
    ?.replace('{count}', passengerDetails.length - 1);
  const recommendedAddonDescSingular = configData?.addonDescSingular?.html
    ?.replace('{user}', passengerDetails[0]?.name?.first);

  const recommendedFastForwardProps = {
    addedLabel: configData.addedLabel,
    setRemoveSelected: () => removeSelectedFastforward(),
    title: addonData?.title,
    subTitle: passengerDetails?.length > 1 ? recommendedAddonDescPlural : recommendedAddonDescSingular,
    offeredPrice: FastForwardPrice,
    slashedPrice: FastForwardApiObj?.originalPrice || 0,
    disableCTA: false,
    hideRemoveCTA: hideRemoveCTA(),
    selfSelectedAddobe: false,
    setOpenSlider: () => setOpenSlider(true),
    currencyCode,
    addonSelected: addonSelect() || checkTakenSsr(),
    recomendedData,
    removeConfirmationPopup: sliderPaneConfigData?.removeCombo,
    addInfoLable: addInfoLable(),
    isTakenSSRInModifyFlow: getAddonData?.ssr?.[tripIndex]?.journeySSRs?.some(
      (sr) => sr.category === categoryCodes.ffwd,
    ) && isModifyFlow,
    eachLabel: configData?.eachLabel,
  };

  // close handler for slider
  const onCloseHandler = () => {
    if (isAddonSelect && isTakenSsrData) {
      removeSelectedFastforward();
    }
    setOpenSlider(false);
  };

  const onSelectHandler = () => {
    toggleSelectAll(true);
    setOpenSlider(false);
  };

  return (
    <>
      {isRecommended && <RecommendedCard {...recommendedFastForwardProps} />}
      {!isRecommended && <AddonCard {...props} />}
      {isOpenSlider && (
        <FastForwardSlidePane
          isOpen={isOpenSlider}
          onClose={onCloseHandler}
          addonData={addonData}
          segmentData={segmentData}
          onSelectHandler={onSelectHandler}
          disableCTA={disableCTA}
          fastforwardPrice={FastForwardPrice}
          currencyCode={currencyIcon}
          sliderPaneConfigData={sliderPaneConfigData}
        />
      )}
      {/* Old Code: {isShowSuccessPopup && <SuccessPopup {...popupProps} />} */}
    </>
  );
};

FastForward.propTypes = {
  segmentData: PropTypes.any,
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  passengerDetails: PropTypes.any,
  passengerKey: PropTypes.any,
  tripId: PropTypes.any,
  sliderPaneConfigData: PropTypes.any,
  isRecommended: PropTypes.bool,
  recomendedData: PropTypes.object,
  loyaltyData: PropTypes.object,
  isModifyFlow: PropTypes.string,
};

export default FastForward;
