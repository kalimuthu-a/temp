import React, { useState, useEffect } from 'react';
// Old Code:
// import SuccessPopup from 'skyplus-design-system-app/dist/des-system/SuccessPopup';
import PropTypes from 'prop-types';
import AddonCard from '../../common/AddonCard/AddonCard';
import SportsEquipmentSlidePane from './SportsEquipmentSlidePane';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { getSsrObj, updateSelectedAddonData } from '../../../functions/utils';
import eventService from '../../../services/event.service';
import { ssrType } from '../../../constants';
import { createEventForAddonModification } from '../../../functions';

const SportsEquipment = ({
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
      setGetSportsEquipment,
      tripIndex,
      setSellSportsEquipment,
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
  const [selectedSpeqItem, setSelectedSpeqitem] = useState(0);
  // Old Code:
  // const [popupProps, setPopupProps] = useState();
  // const [isShowSuccessPopup, setShowSuccessPopup] = useState(false);

  const takenSsrListData = () => {
    const takenSsrList = [];
    getAddonData?.ssr?.forEach((tripSsr, index) => {
      const journeySSRItem = tripSsr.journeySSRs.filter(
        (ssr) => ssr.category === ssrCategory,
      );

      journeySSRItem[0]?.takenssr?.forEach((takenSsrItem) => {
        if (!takenSsrList[index]) {
          takenSsrList[index] = [];
        }
        takenSsrList[index].push(takenSsrItem);
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
            if (removalList.indexOf(takenSsrItem.ssrKey) === -1) {
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

  const [isTakenSsrData, setTakenSsrData] = useState(checkTakenSsr());

  const removeSelectedAddon = () => {
    const sportsEquipmentData = { ...setGetSportsEquipment };
    const passengerIndex = paxIndex[tripIndex]?.paxIndex;
    const _paxIndex = paxIndex[tripIndex]?.paxIndex;
    const passenger = passengerDetails[_paxIndex];
    let removedSsrKey = '';

    if (sportsEquipmentData && sportsEquipmentData[tripIndex]) {
      Object.keys(sportsEquipmentData[tripIndex]).forEach((paxKey) => {
        if (sportsEquipmentData[tripIndex][paxKey].length > 0) {
          sportsEquipmentData[tripIndex][paxKey].forEach(
            (ssrKeyItem, index) => {
              addonData?.availableSSR[0]?.ssrs[0]?.passengersSSRKey.forEach(
                (item) => {
                  const newKey = ssrKeyItem.split('@@');
                  if (
                    item.ssrKey === newKey[0] &&
                    item.passengerKey ===
                      passengerDetails[passengerIndex]?.passengerKey
                  ) {
                    removedSsrKey = newKey[0];
                    sportsEquipmentData[tripIndex][paxKey].splice(index, 1);
                  }
                },
              );
            },
          );
        }
      });
    }

    dispatch({
      type: addonActions.SET_GET_SPORTSEQUIPMENT_ADDON_DATA,
      payload: sportsEquipmentData,
    });

    const selectedList = {};
    if (sportsEquipmentData && sportsEquipmentData[tripIndex]) {
      Object.keys(sportsEquipmentData[tripIndex]).forEach((pax) => {
        if (sportsEquipmentData[tripIndex][pax].length > 0) {
          if (!selectedList[tripIndex]) {
            selectedList[tripIndex] = [];
          }
          selectedList[tripIndex][pax] = sportsEquipmentData[tripIndex][pax];
        }
      });
    }
    dispatch({
      type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
      payload: selectedList,
    });

    const sellSportsEquipmentData = { ...setSellSportsEquipment };

    const removedSsrData = [];

    if (sellAddonSsr && sellAddonSsr.length > 0) {
      let sellAddonData = [...sellAddonSsr];
      sellAddonData = sellAddonData.filter(
        (existingSsr) => existingSsr.ssrKey !== removedSsrKey,
      );

      const removalSsr = { ssrKey: removedSsrKey };
      removedSsrData.push(removalSsr);

      dispatch({
        type: addonActions.SET_SELL_ADDON_SSR,
        payload: sellAddonData,
      });
    }

    if (removedSsrData?.length > 0) {
      const ssrObjList = getSsrObj(
        removedSsrData,
        getAddonData,
        ssrType.journey,
        ssrCategory,
        addonData?.title,
      );

      let removedSsrObjList = [];

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

      if (removedSsrObjList?.length > 0) {
        eventService.update([], removedSsrObjList);
        createEventForAddonModification(removedSsrObjList);
      }

      try {
        const alreadyPurchased = addonData?.availableSSR?.[0]?.takenssr?.find(
          (ts) => {
            return ts.passengerKey === passenger.passengerKey;
          },
        );

        if (alreadyPurchased) {
          removedSsrObjList = removedSsrObjList
            .filter((r) => Boolean(r.ssrCode))
            .map((r) => ({
              ...r,
              action: 'add',
              actualPrice:
                -alreadyPurchased.price * alreadyPurchased.takenCount,
            }));
        }

        createEventForAddonModification(removedSsrObjList);
      } catch (error) {
        // Error Handler
      }
    }

    if (
      setGetSelectedAddon &&
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

    sellSportsEquipmentData[tripIndex] = sellSportsEquipmentData[
      tripIndex
    ]?.filter((existingSsr) => existingSsr.ssrKey !== removedSsrKey);
    dispatch({
      type: addonActions.SET_SELL_SPORTSEQUIPMENT_ADDON_DATA,
      payload: sellSportsEquipmentData,
    });

    if (!isModifyFlow) {
      let removedAddonSsrData = [...removedAddonSsr];

      takenSsr?.forEach((takenSsrItem) => {
        if (
          takenSsrItem.passengerKey ===
          passengerDetails[passengerIndex]?.passengerKey
        ) {
          removedAddonSsrData = removedAddonSsrData.filter(
            (existingSsr) => existingSsr.ssrKey !== takenSsrItem.ssrKey,
          );
          const removalData = { ssrKey: takenSsrItem.ssrKey };
          removedAddonSsrData.push(removalData);
          setTakenSsrData(false);
        }
      });

      dispatch({
        type: addonActions.REMOVE_ADDON_SSR,
        payload: removedAddonSsrData,
      });

      const removedSportsEquipmentSsrData = [];

      dispatch({
        type: addonActions.REMOVED_SPORTSEQUIPMENT_ADDON_DATA,
        payload: removedSportsEquipmentSsrData,
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
    // image: addonData?.image,
    image: 'https://dummyimage.com/600x300/000/fff',
    disableCTA: isDisableCTA,
    hideRemoveCTA: isHideRemoveCTA,

    // New Props For Addon Component
    imageHeight: 200,
    chipColor: 'info',
    chipLabel: 'Add',
    imageText: 'Image Text',
    imageSubText: 'Image sub text',
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

    const locationItem = {
      from: segmentData?.journeydetail?.origin,
      to: segmentData?.journeydetail?.destination,
    };
    locationList.push(locationItem);

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
    const addonKeyDataList = [];
    setSellSportsEquipment[tripIndex].forEach((ssrItem) => {
      const keyObj = {
        passengerKey: ssrItem?.passengerKey,
        addonName: addonData?.title,
        ssrCode: addonData?.categoryBundleCode,
      };
      addonKeyDataList.push(keyObj);
    });

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
    if (
      setSellSportsEquipment &&
      setSellSportsEquipment[tripIndex] &&
      isAddonSubmit
    ) {
      if (setSellSportsEquipment[tripIndex]?.length > 0) {
        // Old Code:
        // getLocations();
        updateSelectedAddon();
      }
      const sellSportsEquipmentData = [];
      if (Object.keys(setSellSportsEquipment).length > 0) {
        Object.keys(setSellSportsEquipment).forEach((trip) => {
          setSellSportsEquipment[trip].forEach((ssrItem) => {
            let isSsrEqual = false;

            if (takenSsr?.length > 0) {
              takenSsr?.forEach((takenSsrItem) => {
                if (takenSsrItem.originalSsrKey === ssrItem.ssrKey) {
                  if (
                    parseInt(takenSsrItem.takenCount) ===
                    parseInt(ssrItem.count)
                  ) {
                    isSsrEqual = true;
                  }
                }
              });
            }

            if (!isSsrEqual) {
              const sellAddonItem = {
                ssrKey: ssrItem?.ssrKey,
                count: ssrItem?.count,
                note: ssrItem?.note,
                categoryName: addonData?.title,
                ssrCategory,
              };
              sellSportsEquipmentData.push(sellAddonItem);
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
        sellSportsEquipmentData.forEach((ssrItem) => {
          sellAddonData.push(ssrItem);
        });
      } else {
        sellAddonData = [...sellSportsEquipmentData];
      }

      dispatch({
        type: addonActions.SET_SELL_ADDON_SSR,
        payload: sellAddonData,
      });

      const ssrObjList = getSsrObj(
        sellAddonData,
        getAddonData,
        ssrType.journey,
        ssrCategory,
        addonData?.title,
      );

      eventService.update(ssrObjList, []);

      try {
        const takenSSR = addonData?.availableSSR?.[0]?.takenssr || [];
        const newPaxdata = ssrObjList.map((r) => r.passengerKey);

        const filteredSSR = ssrObjList.map((r) => {
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

        let removedInfo = [];

        takenSSR.forEach((ts) => {
          if (!newPaxdata.includes(ts.passengerKey)) {
            removedInfo.push({
              ...ts,
              action: 'add',
              actualPrice: -ts.price * ts.takenCount,
              journeyKey: segmentData.journeyKey,
            });
          }
        });

        createEventForAddonModification(filteredSSR);

        // Issue In sports Euipment Addon will removed once modification flow is completed
        removedInfo = [];
        createEventForAddonModification(removedInfo);
      } catch (error) {
        // Error Handler
      }

      if (!isModifyFlow) {
        let removedAddonSsrData = [...removedAddonSsr];

        takenSsr?.forEach((takenSsrItem) => {
          let isSsrEqual = false;
          setSellSportsEquipment[tripIndex]?.forEach((sellItem) => {
            if (takenSsrItem.originalSsrKey === sellItem.ssrKey) {
              if (
                parseInt(takenSsrItem.takenCount) === parseInt(sellItem.count)
              ) {
                isSsrEqual = true;
              }
            }
          });
          removedAddonSsrData = removedAddonSsrData.filter(
            (existingSsr) => existingSsr.ssrKey !== takenSsrItem.ssrKey,
          );
          if (!isSsrEqual) {
            const removalData = { ssrKey: takenSsrItem.ssrKey };
            removedAddonSsrData.push(removalData);

            setTakenSsrData(false);
          }
        });

        dispatch({
          type: addonActions.REMOVE_ADDON_SSR,
          payload: removedAddonSsrData,
        });

        const removedSportsEquipmentSsrData = [];

        dispatch({
          type: addonActions.REMOVED_SPORTSEQUIPMENT_ADDON_DATA,
          payload: removedSportsEquipmentSsrData,
        });
      }

      setAddonSubmit(false);
    }
  }, [setGetSportsEquipment, isAddonSubmit]);

  useEffect(() => {
    const passengerIndex = paxIndex[tripIndex]?.paxIndex;
    let isAddonAvailable = false;

    if (setGetSportsEquipment && setGetSportsEquipment[tripIndex]) {
      Object.keys(setGetSportsEquipment[tripIndex]).forEach((paxKey) => {
        if (setGetSportsEquipment[tripIndex][paxKey].length > 0) {
          setGetSportsEquipment[tripIndex][paxKey].forEach((ssrKeyItem) => {
            addonData?.availableSSR[0]?.ssrs[0]?.passengersSSRKey.forEach(
              (item) => {
                const newKey = ssrKeyItem.split('@@');
                if (
                  item.ssrKey === newKey[0] &&
                  item.passengerKey ===
                    passengerDetails[passengerIndex]?.passengerKey
                ) {
                  isAddonAvailable = true;
                  setSelectedSpeqitem(newKey[1]);
                }
              },
            );
          });
        }
      });
    }
    setTakenSsrData(checkTakenSsr());
    setAddonSelect(isAddonAvailable);
  }, [tripIndex, paxIndex, isAddonSubmit, addonData]);

  const SportsProps = {
    isOpen: isOpenSlider,
    overlayCustomClass: '',
    modalCustomClass: '',
    onClose: (e) => setOpenSlider(false),
    onSubmit: (e) => {
      setOpenSlider(false);
      setAddonSubmit(true);
    },
    passengerDetails,
    addonData,
    configData,
    ssrCategory,
    takenSsrList,
    isModifyFlow,
    sliderPaneConfigData,
  };

  let selectedItem = '';
  if (isAddonSelect || takenSsr?.length > 0) {
    const itemCount = selectedSpeqItem || takenSsr?.[0]?.takenCount;
    selectedItem = `${itemCount} ${itemCount > 1 ? 'Items' : 'Item'}`;
  }

  return (
    <>
      <AddonCard
        {...props}
        variation="withoutImage"
        selectedItem={selectedItem}
      />
      <SportsEquipmentSlidePane {...SportsProps} />
      {/* <>{isShowSuccessPopup && <SuccessPopup {...popupProps} />}</> */}
    </>
  );
};

SportsEquipment.propTypes = {
  segmentData: PropTypes.any,
  passengerDetails: PropTypes.any,
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  isModifyFlow: PropTypes.string,
  sliderPaneConfigData: PropTypes.object,
};

export default SportsEquipment;
