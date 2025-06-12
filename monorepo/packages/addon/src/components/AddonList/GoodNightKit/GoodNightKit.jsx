import React, { useState, useEffect } from 'react';
// Old Code:
// import SuccessPopup from 'skyplus-design-system-app/dist/des-system/SuccessPopup';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import AddonCard from '../../common/AddonCard/AddonCard';
import GoodNightKitSlidePane from './GoodNightKitSlidePane';
import { AppContext } from '../../../context/AppContext';
import { getSsrObj, updateSelectedAddonData } from '../../../functions/utils';
import { ssrType } from '../../../constants/index';
import eventService from '../../../services/event.service';
import { addonActions } from '../../../store/addonActions';
import { createEventForAddonModification } from '../../../functions';

const GoodNightKit = ({
  segmentData,
  passengerDetails,
  addonData,
  configData,
  ssrCategory,
  passengerKey,
  isModifyFlow,
  sliderPaneConfigData,
}) => {
  const {
    state: {
      setGetGoodNight,
      tripIndex,
      setSellGoodNight,
      sellAddonSsr,
      paxIndex,
      setGetSelectedAddon,
      removedAddonSsr,
      getAddonData,
    },
    dispatch,
  } = React.useContext(AppContext);

  const [isAddonSelect, setAddonSelect] = useState(false);
  const [isAddonSubmit, setAddonSubmit] = useState(false);
  const [isOpenSlider, setOpenSlider] = useState(false);
  const [openedPopover, setOpenedPopover] = useState(false);
  // Old Code:
  // const [popupProps, setPopupProps] = useState();
  // const [isShowSuccessPopup, setShowSuccessPopup] = useState(false);
  const popoverId = `popover-goodnight-${passengerKey}`;
  /* Information Icon and popover content */
  const popoverProps = {
    placement: 'top',
    onMouseLeave: () => setOpenedPopover(!openedPopover),
    onMouseOver: () => setOpenedPopover(!openedPopover),
    onClick: () => setOpenedPopover(!openedPopover),
    onMouseEnter: () => setOpenedPopover(!openedPopover),
    targetElement: (
      <span
        className="addon-card__left__desc__title__icon icon-Info_24 icon-info_24 indigoIcon"
        id={popoverId}
        onClick={() => setOpenedPopover(!openedPopover)}
        onMouseOver={() => setOpenedPopover(!openedPopover)}
        onMouseLeave={() => setOpenedPopover(!openedPopover)}
      />
    ),
    content: addonData?.title,
    targetId: popoverId,
    openedPopover,
  };

  const takenSsrListData = () => {
    const takenSsrList = [];
    getAddonData?.ssr?.forEach((tripSsr, index) => {
      tripSsr?.segments.forEach((segment) => {
        const segmentSSRItem = segment.segmentSSRs.filter(
          (ssr) => ssr.category === ssrCategory,
        );

        segmentSSRItem[0]?.takenssr?.forEach((takenSsrItem) => {
          if (!takenSsrList[index]) {
            takenSsrList[index] = [];
          }
          takenSsrList[index].push(takenSsrItem);
        });
      });
    });
    return takenSsrList;
  };
  const takenSsrList = takenSsrListData();
  const takenSsr = takenSsrList[tripIndex] || [];
  const isSsrs = addonData?.availableSSR[0]?.ssrs || [];
  const [isDisableCTA, setDisableCTA] = useState(isSsrs?.length < 1);
  const [isHideRemoveCTA, setHideRemoveCTA] = useState(
    takenSsr?.length > 0 && !takenSsr?.[0]?.canBeRemoved,
  );

  const checkTakenSsr = () => {
    if (takenSsr?.length > 0) {
      let isDeleted = true;
      const passengerIndex = paxIndex[tripIndex]?.paxIndex;
      const removalList = [];
      removedAddonSsr?.forEach((removedItem) => {
        removalList.push(removedItem.ssrKey);
      });
      takenSsr?.forEach((takenSsrItem) => {
        if (
          takenSsrItem.passengerKey ===
          passengerDetails[passengerIndex]?.passengerKey
        ) {
          if (removalList?.length > 0) {
            if (removalList.indexOf(takenSsrItem.originalSsrKey) === -1) {
              isDeleted = false;
            }
          } else {
            isDeleted = false;
          }
        }
      });
      return !isDeleted;
    }
    return false;
  };

  const updateSsrObjectList = (ssrObjList) => {
    const removedSsrObjList = [];
    ssrObjList.forEach((ssrObj) => {
      const removedSsrObj = {
        passengerKey: ssrObj.passengerKey,
        journeyKey: ssrObj.journeyKey,
        ssrCode: ssrObj.ssrCode,
        segmentKey: ssrObj.segmentKey,
        action: 'remove',
      };
      removedSsrObjList.push(removedSsrObj);
    });
    eventService.update([], removedSsrObjList);
    createEventForAddonModification(removedSsrObjList);
  };
  const [isTakenSsrData, setTakenSsrData] = useState(checkTakenSsr());

  const removeSelectedAddon = () => {
    const gnKitData = { ...setGetGoodNight };
    const passengerIndex = paxIndex[tripIndex]?.paxIndex;

    if (gnKitData && gnKitData[tripIndex]) {
      Object.keys(gnKitData[tripIndex]).forEach((segment) => {
        Object.keys(gnKitData[tripIndex][segment]).forEach((paxKey) => {
          if (gnKitData[tripIndex][segment][paxKey].length > 0) {
            if (paxKey === passengerDetails[passengerIndex]?.passengerKey) {
              delete gnKitData[tripIndex][segment][paxKey];
            }
          }
        });
      });
    }
    dispatch({
      type: addonActions.SET_GET_GOODNIGHT_ADDON_DATA,
      payload: gnKitData,
    });

    const selectedList = {};
    if (gnKitData && gnKitData[tripIndex]) {
      Object.keys(gnKitData[tripIndex]).forEach((segment) => {
        Object.keys(gnKitData[tripIndex][segment]).forEach((paxKey) => {
          if (gnKitData[tripIndex][segment][paxKey].length > 0) {
            if (!selectedList[tripIndex]) {
              selectedList[tripIndex] = [];
            }
            if (!selectedList[tripIndex][segment]) {
              selectedList[tripIndex][segment] = {};
            }
            selectedList[tripIndex][segment][paxKey] =
              gnKitData[tripIndex][segment][paxKey];
          }
        });
      });
    }
    dispatch({
      type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
      payload: selectedList,
    });

    const sellGoodNightData = { ...setSellGoodNight };

    const removedSsrData = [];

    if (sellAddonSsr && sellAddonSsr.length > 0) {
      const sellAddonData = [...sellAddonSsr];
      sellGoodNightData[tripIndex]?.forEach((removalSsr) => {
        sellAddonData.forEach((existingSsr, index) => {
          if (
            existingSsr.ssrKey === removalSsr.ssrKey &&
            passengerDetails[passengerIndex]?.passengerKey ===
              removalSsr.passengerKey
          ) {
            removedSsrData.push(removalSsr);
            sellAddonData.splice(index, 1);
          }
        });
      });
      dispatch({
        type: addonActions.SET_SELL_ADDON_SSR,
        payload: sellAddonData,
      });
    }

    if (removedSsrData?.length > 0) {
      const ssrObjList = getSsrObj(
        removedSsrData,
        getAddonData,
        ssrType.segment,
        ssrCategory,
        addonData?.title,
      );
      updateSsrObjectList(ssrObjList);

      createEventForAddonModification(ssrObjList);

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

    if (
      setGetSelectedAddon &&
      setGetSelectedAddon[tripIndex] &&
      setGetSelectedAddon[tripIndex].selectedAddone.length > 0
    ) {
      const selectedAddonData = { ...setGetSelectedAddon };
      let i = 0;
      while (i < selectedAddonData[tripIndex].selectedAddone.length) {
        const addonItem = selectedAddonData[tripIndex].selectedAddone[i];
        if (
          addonItem?.passengerKey ===
            passengerDetails[passengerIndex]?.passengerKey &&
          addonItem?.addonName === addonData?.title
        ) {
          selectedAddonData[tripIndex].selectedAddone.splice(i, 1);
        } else {
          i += 1;
        }
      }
      dispatch({
        type: addonActions.SET_GET_SELECTED_ADDON,
        payload: selectedAddonData,
      });
    }

    sellGoodNightData[tripIndex] = sellGoodNightData[tripIndex]?.filter(
      (sellSsr) => sellSsr.passengerKey !== passengerDetails[passengerIndex]?.passengerKey,
    );
    dispatch({
      type: addonActions.SET_SELL_GOODNIGHT_ADDON_DATA,
      payload: sellGoodNightData,
    });

    if (!isModifyFlow) {
      let removedAddonSsrData = [...removedAddonSsr];

      takenSsr?.forEach((takenSsrItem) => {
        if (
          takenSsrItem.passengerKey ===
          passengerDetails[passengerIndex]?.passengerKey
        ) {
          removedAddonSsrData = removedAddonSsrData.filter(
            (existingSsr) => existingSsr.ssrKey !== takenSsrItem.originalSsrKey,
          );
          const removalData = { ssrKey: takenSsrItem.originalSsrKey };
          removedAddonSsrData.push(removalData);
          setTakenSsrData(false);
        }
      });

      dispatch({
        type: addonActions.REMOVE_ADDON_SSR,
        payload: removedAddonSsrData,
      });

      const ssrObjList = getSsrObj(
        removedAddonSsrData,
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

      const removedGoodNightSsrData = [];

      dispatch({
        type: addonActions.REMOVED_GOODNIGHT_ADDON_DATA,
        payload: removedGoodNightSsrData,
      });
    }

    setAddonSelect(false);
  };

  const props = {
    title: addonData?.title,
    discription: addonData?.description?.html,
    uptoLabel: '',
    discountLabel: '',
    addLabel: configData.addLabel,
    addedLabel: configData?.addedLabel,
    removeLable: configData?.removeLabel,
    addInfoLable: false,
    addonType: ssrCategory,
    addonSelected: isAddonSelect || isTakenSsrData,
    selectedAddonName: '',
    selectedAddonPrice: 0,
    isInformationIcon: true,
    popoverContent: popoverProps,
    isCheckboxVisible: false,
    isCheckboxSelected: false,
    isCheckboxId: '',
    isCheckboxLabel: '',
    selfSelectedAddobe: false,
    setAddonSelected: () => setAddonSelect(true),
    setRemoveSelected: () => {
      removeSelectedAddon();
    },
    setOpenSlider: () => setOpenSlider(true),
    image: addonData?.image?._publishUrl,
    disableCTA: isDisableCTA,
    hideRemoveCTA: isHideRemoveCTA,
  };

  useEffect(() => {
    setDisableCTA(isSsrs?.length < 1);
  }, [tripIndex, isSsrs]);

  useEffect(() => {
    setHideRemoveCTA(takenSsr?.length > 0 && !takenSsr?.[0]?.canBeRemoved);
    setTakenSsrData(checkTakenSsr());
  }, [tripIndex, takenSsr]);

  /* Old Code:
  const getLocations = () => {
    const locationList = [];
    const segmentTabData = Object.keys(setGetGoodNight[tripIndex]);
    segmentTabData.forEach((segmentTab) => {
      const locList = segmentTab.split('-');
      const locationItem = {
        from: locList[0],
        to: locList[1],
      };
      locationList.push(locationItem);
    });

    const popupProps = {
      title: configData?.serviceSuccessfullyAddedPopupLabel,
      message: addonData?.title,
      location: locationList,
    };
    setPopupProps(popupProps);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 5000);
  }; */

  const updateSelectedAddon = () => {
    let addonKeyDataList = [];
    setSellGoodNight[tripIndex].forEach((ssrItem) => {
      const keyObj = {
        passengerKey: ssrItem?.passengerKey,
        addonName: addonData?.title,
        ssrCode: addonData?.availableSlidePaneData?.[0]?.ssrList[0]?.ssrCode,
      };
      addonKeyDataList.push(keyObj);
    });

    addonKeyDataList = uniqBy(addonKeyDataList, 'passengerKey');

    updateSelectedAddonData(
      tripIndex,
      setGetSelectedAddon,
      addonData,
      addonKeyDataList,
      dispatch,
      addonActions,
    );
  };

  useEffect(() => {
    if (setSellGoodNight && setSellGoodNight[tripIndex] && isAddonSubmit) {
      if (setSellGoodNight[tripIndex]?.length > 0) {
        // Old Code:
        // getLocations();
        updateSelectedAddon();
      }
      const sellGoodNightData = [];

      if (Object.keys(setSellGoodNight).length > 0) {
        Object.keys(setSellGoodNight).forEach((trip) => {
          setSellGoodNight[trip].forEach((ssrItem) => {
            let isSsrSold = false;

            if (takenSsrList[trip]?.length > 0) {
              takenSsrList[trip].forEach((takenSsrItem) => {
                if (takenSsrItem.originalSsrKey === ssrItem.ssrKey) {
                  isSsrSold = true;
                }
              });
            }

            if (!isSsrSold) {
              const sellAddonItem = {
                ssrKey: ssrItem.ssrKey,
                count: 1,
                note: '',
                categoryName: addonData?.title,
                ssrCategory,
              };
              sellGoodNightData.push(sellAddonItem);
            }
          });
        });
      }

      let sellAddonData = [];
      if (sellAddonSsr && sellAddonSsr.length > 0) {
        sellAddonData = [...sellAddonSsr];
        sellAddonData = sellAddonData.filter(
          (addonItem) => addonItem?.categoryName !== addonData?.title,
        );
        sellGoodNightData.forEach((ssrItem) => {
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
        sellAddonData = [...sellGoodNightData];
      }

      dispatch({
        type: addonActions.SET_SELL_ADDON_SSR,
        payload: sellAddonData,
      });

      const ssrObjList = getSsrObj(
        sellAddonData,
        getAddonData,
        ssrType.segment,
        ssrCategory,
        addonData?.title,
      );

      eventService.update(ssrObjList, []);

      createEventForAddonModification(ssrObjList);

      if (!isModifyFlow) {
        let removedAddonSsrData = [...removedAddonSsr];

        takenSsr?.forEach((takenSsrItem) => {
          let isTakenssrDeleted = true;
          setSellGoodNight[tripIndex]?.forEach((sellItem) => {
            if (takenSsrItem.originalSsrKey === sellItem.ssrKey) {
              isTakenssrDeleted = false;
            }
          });
          removedAddonSsrData = removedAddonSsrData.filter(
            (existingSsr) => existingSsr.ssrKey !== takenSsrItem.originalSsrKey,
          );
          if (isTakenssrDeleted) {
            const removalData = { ssrKey: takenSsrItem.originalSsrKey };
            removedAddonSsrData.push(removalData);
            setTakenSsrData(false);
          }
        });

        dispatch({
          type: addonActions.REMOVE_ADDON_SSR,
          payload: removedAddonSsrData,
        });

        const ssrObjList = getSsrObj(
          removedAddonSsrData,
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

        const removedGoodNightSsrData = [];

        dispatch({
          type: addonActions.REMOVED_GOODNIGHT_ADDON_DATA,
          payload: removedGoodNightSsrData,
        });
      }

      setAddonSubmit(false);
    }
  }, [setSellGoodNight, isAddonSubmit]);

  useEffect(() => {
    const passengerIndex = paxIndex[tripIndex]?.paxIndex;
    let isAddonAvailable = false;

    if (setGetGoodNight && setGetGoodNight[tripIndex]) {
      Object.keys(setGetGoodNight[tripIndex]).forEach((segment) => {
        Object.keys(setGetGoodNight[tripIndex][segment]).forEach((paxKey) => {
          if (setGetGoodNight[tripIndex][segment][paxKey].length > 0) {
            setGetGoodNight[tripIndex][segment][paxKey].forEach(
              (ssrKeyItem) => {
                addonData?.availableSSR?.forEach((ssr) => {
                  ssr.ssrs?.forEach((ssrs) => {
                    ssrs.passengersSSRKey.forEach((item) => {
                      if (
                        item.ssrKey === ssrKeyItem &&
                        item.passengerKey ===
                          passengerDetails[passengerIndex]?.passengerKey
                      ) {
                        isAddonAvailable = true;
                      }
                    });
                  });
                });
              },
            );
          }
        });
      });
    }
    setTakenSsrData(checkTakenSsr());
    setAddonSelect(isAddonAvailable);
  }, [tripIndex, paxIndex, isAddonSubmit, addonData]);

  const gnKitProps = {
    isOpen: isOpenSlider,
    overlayCustomClass: '',
    modalCustomClass: '',
    title: addonData?.title,
    onClose: (e) => setOpenSlider(false),
    onSubmit: (e) => {
      setOpenSlider(false);
      setAddonSubmit(true);
    },
    segmentData: segmentData?.segments,
    passengerDetails,
    addonData,
    configData,
    ssrCategory,
    isModifyFlow,
    takenSsr,
    sliderPaneConfigData,
  };
  return (
    <>
      <AddonCard {...props} />
      <GoodNightKitSlidePane {...gnKitProps} />
      {/* Old Code: {isShowSuccessPopup && <SuccessPopup {...popupProps} />} */}
    </>
  );
};

GoodNightKit.propTypes = {
  segmentData: PropTypes.any,
  passengerDetails: PropTypes.any,
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  passengerKey: PropTypes.any,
  isModifyFlow: PropTypes.string,
  sliderPaneConfigData: PropTypes.object,
};

export default GoodNightKit;
