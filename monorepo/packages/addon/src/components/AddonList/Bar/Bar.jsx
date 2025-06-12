import React, { useState, useEffect } from 'react';
// Old Code:
// import SuccessPopup from 'skyplus-design-system-app/dist/des-system/SuccessPopup';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import BarSlidePane from './BarSlidePane';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { getSsrObj, updateSelectedAddonData } from '../../../functions/utils';
import { ssrType } from '../../../constants/index';
import eventService from '../../../services/event.service';
import AddonCard from '../../common/AddonCard/AddonCard';
import { createEventForAddonModification } from '../../../functions';

const Bar = ({
  segmentData,
  passengerDetails,
  addonData,
  configData,
  ssrCategory,
  isModifyFlow,
  sliderPaneConfigData,
}) => {
  const {
    state: {
      setGetBar,
      tripIndex,
      setSellBar,
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
  // Old Code:
  // const [popupProps, setPopupProps] = useState();
  // const [isShowSuccessPopup, setShowSuccessPopup] = useState(false);

  const takenSsrListData = () => {
    const takenSsrList = [];
    getAddonData?.ssr?.forEach((tripSsr, index) => {
      tripSsr?.segments.forEach((segment) => {
        const segmentSSRItem = segment.segmentSSRs.filter(
          (ssr) => ssr.category === ssrCategory,
        );

        const segmentDetils = `${segment?.segmentDetails.origin}-${segment?.segmentDetails.destination}`;

        segmentSSRItem[0]?.takenssr?.forEach((takenSsrItem) => {
          const takenSSR = takenSsrItem;
          if (!takenSsrList[index]) {
            takenSsrList[index] = [];
          }
          takenSSR.segmentData = segmentDetils;
          takenSsrList[index].push(takenSSR);
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
    const barData = { ...setGetBar };
    const passengerIndex = paxIndex[tripIndex]?.paxIndex;

    if (barData && barData[tripIndex]) {
      Object.keys(barData[tripIndex]).forEach((segment) => {
        Object.keys(barData[tripIndex][segment]).forEach((paxKey) => {
          if (barData[tripIndex][segment][paxKey].length > 0) {
            barData[tripIndex][segment][paxKey].forEach((ssrKeyItem, index) => {
              addonData?.availableSSR?.forEach((ssr) => {
                ssr.ssrs?.forEach((ssrs) => {
                  ssrs.passengersSSRKey.forEach((item) => {
                    if (
                      item.ssrKey === ssrKeyItem &&
                      item.passengerKey ===
                        passengerDetails[passengerIndex]?.passengerKey
                    ) {
                      barData[tripIndex][segment][paxKey].splice(index, 1);
                    }
                  });
                });
              });
            });
          }
        });
      });
    }
    dispatch({
      type: addonActions.SET_GET_BAR_ADDON_DATA,
      payload: barData,
    });

    const selectedList = {};
    if (barData && barData[tripIndex]) {
      Object.keys(barData[tripIndex]).forEach((segment) => {
        Object.keys(barData[tripIndex][segment]).forEach((paxKey) => {
          if (barData[tripIndex][segment][paxKey].length > 0) {
            if (!selectedList[tripIndex]) {
              selectedList[tripIndex] = [];
            }
            if (!selectedList[tripIndex][segment]) {
              selectedList[tripIndex][segment] = {};
            }
            selectedList[tripIndex][segment][paxKey] =
              barData[tripIndex][segment][paxKey];
          }
        });
      });
    }
    dispatch({
      type: addonActions.SELECTED_BAR_ADDON_DATA,
      payload: selectedList,
    });

    const sellBarData = { ...setSellBar };

    const removedSsrData = [];

    if (sellAddonSsr && sellAddonSsr.length > 0) {
      const sellAddonData = [...sellAddonSsr];
      sellBarData[tripIndex].forEach((removalSsr) => {
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
      selectedAddonData[tripIndex].selectedAddone.forEach(
        (addonItem, index) => {
          if (
            addonItem?.passengerKey ===
              passengerDetails[passengerIndex]?.passengerKey &&
            addonItem?.addonName === addonData?.title
          ) {
            selectedAddonData[tripIndex].selectedAddone.splice(index, 1);
          }
        },
      );
      dispatch({
        type: addonActions.SET_GET_SELECTED_ADDON,
        payload: selectedAddonData,
      });
    }

    sellBarData[tripIndex] = sellBarData[tripIndex]?.filter(
      (sellSsr) => sellSsr.passengerKey !== passengerDetails[passengerIndex]?.passengerKey,
    );
    dispatch({
      type: addonActions.SET_SELL_BAR_ADDON_DATA,
      payload: sellBarData,
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

      const removedBarSsrData = [];

      dispatch({
        type: addonActions.REMOVED_BAR_ADDON_DATA,
        payload: removedBarSsrData,
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
    isInformationIcon: false,
    isCheckboxVisible: false,
    isCheckboxSelected: false,
    isCheckboxId: '',
    isCheckboxLabel: addonData?.categoryDetails,
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
    setHideRemoveCTA(takenSsr?.length > 0 && !takenSsr[0]?.canBeRemoved);
    setTakenSsrData(checkTakenSsr());
  }, [tripIndex, takenSsr]);

  /* Old Code:
  const getLocations = () => {
    const locationList = [];
    const segmentTabData = Object.keys(setGetBar[tripIndex]);
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
    setSellBar[tripIndex].forEach((ssrItem) => {
      const keyObj = {
        passengerKey: ssrItem?.passengerKey,
        addonName: addonData?.title,
        ssrCode: addonData?.availableSSR?.[0]?.ssrs[0]?.ssrCode,
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
    if (setSellBar && setSellBar[tripIndex] && isAddonSubmit) {
      if (setSellBar[tripIndex]?.length > 0) {
        // Old Code:
        // getLocations();
        updateSelectedAddon();
      }
      const sellBarData = [];
      if (Object.keys(setSellBar).length > 0) {
        Object.keys(setSellBar).forEach((trip) => {
          setSellBar[trip].forEach((ssrItem) => {
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
              sellBarData.push(sellAddonItem);
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
        sellBarData.forEach((ssrItem) => {
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
        sellAddonData = [...sellBarData];
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
          setSellBar[tripIndex]?.forEach((sellItem) => {
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

        const ssrObjectList = getSsrObj(
          removedAddonSsrData,
          getAddonData,
          ssrType.segment,
          ssrCategory,
          addonData?.title,
        );
        updateSsrObjectList(ssrObjectList);
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

        const removedBarSsrData = [];

        dispatch({
          type: addonActions.REMOVED_BAR_ADDON_DATA,
          payload: removedBarSsrData,
        });
      }

      setAddonSubmit(false);
    }
  }, [setSellBar, isAddonSubmit]);

  useEffect(() => {
    const passengerIndex = paxIndex[tripIndex]?.paxIndex;
    let isAddonAvailable = false;

    if (setGetBar && setGetBar[tripIndex]) {
      Object.keys(setGetBar[tripIndex]).forEach((segment) => {
        Object.keys(setGetBar[tripIndex][segment]).forEach((paxKey) => {
          if (setGetBar[tripIndex][segment][paxKey].length > 0) {
            setGetBar[tripIndex][segment][paxKey].forEach((ssrKeyItem) => {
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
            });
          }
        });
      });
    }
    setTakenSsrData(checkTakenSsr());
    setAddonSelect(isAddonAvailable);
  }, [tripIndex, paxIndex, isAddonSubmit, addonData]);

  const BarProps = {
    isOpen: isOpenSlider,
    overlayCustomClass: '',
    modalCustomClass: '',
    onClose: () => setOpenSlider(false),
    onSubmit: () => {
      setOpenSlider(false);
      setAddonSubmit(true);
    },
    segmentData: segmentData?.segments,
    passengerDetails,
    addonData,
    configData,
    ssrCategory,
    takenSsrList,
    isModifyFlow,
    sliderPaneConfigData,
  };
  return (
    <>
      <AddonCard {...props} />
      <BarSlidePane {...BarProps} />
      {/* Old Code: {isShowSuccessPopup && <SuccessPopup {...popupProps} />} */}
    </>
  );
};

Bar.propTypes = {
  segmentData: PropTypes.any,
  passengerDetails: PropTypes.any,
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  isModifyFlow: PropTypes.string,
  sliderPaneConfigData: PropTypes.object,
};

export default Bar;
