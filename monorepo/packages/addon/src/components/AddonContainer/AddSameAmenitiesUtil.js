import cloneDeep from 'lodash/cloneDeep';
import { getSsrObj } from '../../functions/utils';
import { ssrType } from '../../constants';
import eventService from '../../services/event.service';
import { getAddReviewSummaryData } from '../../functions/mealUtils';

let newGetAddonData;
let additionalBagTitle;
let baggageDataTitle;
let SportsEquipementTitle;
let GdSleepTitle;
let oneForSkyTitle;
let _6E_EATS;
const getAddonTitle = (listOfTotalAddon, categoryCodes) => {
  listOfTotalAddon?.forEach((addonList) => {
    if (addonList?.categoryBundleCode === categoryCodes?.abhf) {
      additionalBagTitle = addonList?.title;
    } else if (addonList?.categoryBundleCode === categoryCodes?.baggage) {
      baggageDataTitle = addonList?.title;
    } else if (addonList?.categoryBundleCode === categoryCodes.speq) {
      SportsEquipementTitle = addonList?.title;
    } else if (addonList?.categoryBundleCode === categoryCodes.goodNight) {
      GdSleepTitle = addonList?.title;
    } else if (addonList?.categoryBundleCode === categoryCodes.bar) {
      oneForSkyTitle = addonList?.title;
    } else if (addonList?.categoryBundleCode === categoryCodes.meal) {
      _6E_EATS = addonList?.title;
    }
  });
};
// Function to update sellAddonSrr Data.
const updateSellAddonSsrData = (
  sellAddonSsrlist,
  getAddonData,
  tripIndex,
  sellAddonSsr,
  categoryCodes,
) => {
  getAddonData?.ssr[tripIndex]?.journeySSRs?.forEach((journeySsrList) => {
    sellAddonSsr?.forEach((sellAddonList) => {
      if (sellAddonList?.ssrCategory === categoryCodes?.speq
       || sellAddonList?.ssrCategory === categoryCodes?.abhf ||
      sellAddonList?.ssrCategory === categoryCodes?.baggage
      ) {
        const ssrkey = sellAddonList?.ssrKey;
        journeySsrList?.ssrs?.forEach((ssrsList) => {
          ssrsList?.passengersSSRKey?.forEach((paxKey, index) => {
            if (index > 0 && ssrkey === ssrsList?.passengersSSRKey[0]?.ssrKey) {
              const newAddonList = { ...sellAddonList };
              newAddonList.ssrKey = paxKey?.ssrKey;
              newAddonList.passengerKey = paxKey?.passengerKey;
              sellAddonSsrlist.push(newAddonList);
            }
          });
        });
      }
    });
  });
};

const sportsEquipmentSliderData = (
  index,
  ssrsList,
  finalSsrkeyList,
  segmentList,
  finalDataSrrList,
  setGetSportsEquipment,
  tripIndex,
  sellAddonSsrlist,
  categoryCodes,
) => {
  const selectedSsrkey = ssrsList?.passengersSSRKey[0]?.passengerKey;
  const selectedData = setGetSportsEquipment[tripIndex][selectedSsrkey][0]?.split('@@')[1];
  const pax = ssrsList.passengersSSRKey[index]?.passengerKey;
  const ssrKey = ssrsList.passengersSSRKey[index]?.ssrKey;
  const finalListObj = cloneDeep(finalSsrkeyList[tripIndex][0]);
  const segmentListData = segmentList;
  finalListObj.passengerKey = pax;
  finalListObj.ssrKey = ssrKey;
  segmentListData[tripIndex][pax] = [`${ssrKey}@@${selectedData}`];
  finalSsrkeyList[tripIndex].push({ ...finalListObj });
  const ssrObjList = getSsrObj(
    sellAddonSsrlist,
    newGetAddonData,
    ssrType.journey,
    categoryCodes.speq,
    SportsEquipementTitle,
  );
  eventService.update(ssrObjList, []);
};

// Bundle Addon Function
const bundleSliderData = (
  newBundleData,
  segmentSSRsList,
  ssrsList,
  index,
  sellAddonSsrlist,
  categoryCodes,
  tripIndex,
  finalSellAddonData,
) => {
  const finalSellAddonDetails = finalSellAddonData;
  if (
    categoryCodes?.bar === segmentSSRsList?.category ||
    categoryCodes?.goodNight === segmentSSRsList?.category) {
    Object.keys(newBundleData).forEach((bundleDataKey) => {
      Object.keys(newBundleData[bundleDataKey]).forEach((segment) => {
        const selectedPassengerKey = ssrsList?.passengersSSRKey[0]?.passengerKey;
        const newBundleDataSegment = newBundleData[bundleDataKey][segment];
        Object.values(newBundleDataSegment[selectedPassengerKey])?.forEach((ssrKeysData) => {
          if (ssrKeysData === ssrsList?.passengersSSRKey[0]?.ssrKey) {
            const pacskey = ssrsList?.passengersSSRKey[index]?.passengerKey;
            const selectedPacKey = ssrsList?.passengersSSRKey[0]?.passengerKey;
            const sellAddonItem = {
              ssrKey: ssrsList?.passengersSSRKey[index]?.ssrKey,
              count: 1,
              note: '',
              passengerKey: ssrsList?.passengersSSRKey[index]?.passengerKey,
            };
            if (!finalSellAddonDetails[tripIndex]) {
              finalSellAddonDetails[tripIndex] = [];
            }
            finalSellAddonDetails[tripIndex].push(sellAddonItem);
            if (!newBundleDataSegment[pacskey]) {
              newBundleDataSegment[pacskey] = [ssrsList?.passengersSSRKey[index]?.ssrKey];
              sellAddonSsrlist.push(sellAddonItem);
            } else if (newBundleDataSegment[pacskey]?.length < newBundleDataSegment[selectedPacKey]?.length) {
              newBundleDataSegment[pacskey]?.push(ssrsList?.passengersSSRKey[index]?.ssrKey);
              sellAddonSsrlist.push(sellAddonItem);
            }
          }
        });
      });
    });
  } else if (categoryCodes?.meal === segmentSSRsList?.category) {
    const bundleDataList = newBundleData[tripIndex];
    if (bundleDataList) {
      Object.keys(bundleDataList).forEach((bundleDataKey) => {
        const selectedPassengerKey = ssrsList?.passengersSSRKey[0]?.passengerKey;
        const newBundleDataSegment = bundleDataList[bundleDataKey];
        Object.values(newBundleDataSegment[selectedPassengerKey])
          ?.forEach((passengerData) => {
            const pacskey = ssrsList?.passengersSSRKey[index]?.passengerKey;
            if (passengerData?.passengerSSRKey?.ssrKey === ssrsList?.passengersSSRKey[0]?.ssrKey) {
              const passengerDetails = cloneDeep(passengerData);
              const selectedPacKey = ssrsList?.passengersSSRKey[0]?.passengerKey;
              passengerDetails.passengerSSRKey.passengerKey = ssrsList?.passengersSSRKey[index]?.passengerKey;
              passengerDetails.passengerSSRKey.ssrKey = ssrsList?.passengersSSRKey[index]?.ssrKey;
              if (!newBundleDataSegment[pacskey]) {
                newBundleDataSegment[pacskey] = [passengerDetails];
              } else if (newBundleDataSegment[pacskey]?.length < newBundleDataSegment[selectedPacKey]?.length) {
                newBundleDataSegment[pacskey]?.push(passengerDetails);
              }
            }
          });
      });
    }
  }
};

const updatejourneySSRList = (
  journeySSRsList,
  AddonDataSsr,
  tempAddon,
  newSelectedAddonData,
  segmentList,
  finalSsrkeyList,
  additionalBagNewState,
  excessBagNewState,
  categoryCodes,
  setGetSportsEquipment,
  tripIndex,
  sellAddonSsrlist,
) => {
  const finalDataSrrList = [];
  const tempAddonData = tempAddon;
  const additionalBagNewStates = additionalBagNewState;
  const excessBagNewStates = excessBagNewState;
  journeySSRsList?.ssrs?.forEach((ssrsList) => {
    for (let index = 1; index < ssrsList?.passengersSSRKey?.length; index += 1) {
      if (tempAddonData?.ssrCode === ssrsList?.ssrCode) {
        tempAddonData.passengerKey = ssrsList?.passengersSSRKey[index]?.passengerKey;
        tempAddonData.journeyKey = AddonDataSsr?.journeyKey;
        newSelectedAddonData.push({
          ...tempAddonData,
        });
      }

      if (categoryCodes?.speq === journeySSRsList?.category && Object.keys(segmentList).length > 0) {
        sportsEquipmentSliderData(
          index,
          ssrsList,
          finalSsrkeyList,
          segmentList,
          finalDataSrrList,
          setGetSportsEquipment,
          tripIndex,
          sellAddonSsrlist,
          categoryCodes,
        );
      } else if (categoryCodes?.abhf === journeySSRsList?.category &&
        additionalBagNewStates[tripIndex][0].additionalBag) {
        const { baggageE } = cloneDeep(additionalBagNewStates[tripIndex][0]);
        baggageE.ssrKey = ssrsList?.passengersSSRKey[index]?.ssrKey;
        additionalBagNewStates[tripIndex][index].additionalBag = additionalBagNewStates[tripIndex][0].additionalBag;
        additionalBagNewStates[tripIndex][index].checked = additionalBagNewStates[tripIndex][0].checked;
        additionalBagNewStates[tripIndex][index].addoncantBeRemoved = false;
        additionalBagNewStates[tripIndex][index].baggageE = baggageE;
        const ssrObjList = getSsrObj(
          sellAddonSsrlist,
          newGetAddonData,
          ssrType.journey,
          categoryCodes.abhf,
          additionalBagTitle,
        );
        eventService.update(ssrObjList, []);
      } else if (categoryCodes?.baggage === journeySSRsList?.category && excessBagNewStates[tripIndex][0].checked) {
        const { domesticE } = cloneDeep(excessBagNewStates[tripIndex][0]);
        if (excessBagNewStates[tripIndex][0]?.domestic === ssrsList?.passengersSSRKey[0]?.ssrKey) {
          domesticE.ssrKey = ssrsList?.passengersSSRKey[index]?.ssrKey;
          excessBagNewStates[tripIndex][index].checked = excessBagNewStates[tripIndex][0].checked;
          excessBagNewStates[tripIndex][index].domestic = ssrsList?.passengersSSRKey[index]?.ssrKey;
          excessBagNewStates[tripIndex][index].domesticE = excessBagNewStates[tripIndex][0].domesticE;
          excessBagNewStates[tripIndex][index].domesticE = domesticE;
          const ssrObjList = getSsrObj(
            sellAddonSsrlist,
            newGetAddonData,
            ssrType.journey,
            categoryCodes.baggage,
            baggageDataTitle,
          );
          eventService.update(ssrObjList, []);
        } else if (excessBagNewStates[tripIndex][0]?.international === ssrsList?.passengersSSRKey[0]?.ssrKey) {
          excessBagNewStates[tripIndex][index].checked = excessBagNewStates[tripIndex][0].checked;
          excessBagNewStates[tripIndex][index].international = ssrsList?.passengersSSRKey[index]?.ssrKey;
          excessBagNewStates[tripIndex][index].internationalE = excessBagNewStates[tripIndex][0].internationalE;
          excessBagNewStates[tripIndex][index].passengerKey = ssrsList?.passengersSSRKey[index]?.passengerKey;
        }
      }
    }
  });
};

// Function to update segmentList
const updateSegmentSSRList = (
  segmentSsrList,
  AddonDataSsr,
  tempAddon,
  newSelectedAddonData,
  newBarData,
  gnKitData,
  sellAddonSsrlist,
  categoryCodes,
  selectedMealData,
  tripIndex,
  finalSellAddonData,
  newSetSellGoodNight,
) => {
  const temproryAddon = tempAddon;
  segmentSsrList?.segmentSSRs?.forEach((segmentSSRsList) => {
    segmentSSRsList?.ssrs?.forEach((ssrsList) => {
      for (let index = 1; index < ssrsList?.passengersSSRKey?.length; index += 1) {
        if (temproryAddon?.ssrCode === ssrsList?.ssrCode) {
          temproryAddon.passengerKey = ssrsList?.passengersSSRKey[index]?.passengerKey;
          temproryAddon.journeyKey = AddonDataSsr?.journeyKey;
          newSelectedAddonData.push({
            ...temproryAddon,
          });
        }
        if (categoryCodes?.bar === segmentSSRsList?.category) {
          bundleSliderData(
            newBarData,
            segmentSSRsList,
            ssrsList,
            index,
            sellAddonSsrlist,
            categoryCodes,
            tripIndex,
            finalSellAddonData,
          );
        } else if (categoryCodes?.goodNight === segmentSSRsList?.category) {
          bundleSliderData(
            gnKitData,
            segmentSSRsList,
            ssrsList,
            index,
            sellAddonSsrlist,
            categoryCodes,
            tripIndex,
            newSetSellGoodNight,
          );
        } else if (categoryCodes?.meal === segmentSSRsList?.category) {
          bundleSliderData(
            selectedMealData,
            segmentSSRsList,
            ssrsList,
            index,
            sellAddonSsrlist,
            categoryCodes,
            tripIndex,
          );
        }
      }
    });
  });
};

// Add Same Amenites Function
const AddSameAmenities = (
  addonActions,
  isChecked,
  setGetSelectedAddon,
  sellAddonSsr,
  setGetSportsEquipment,
  setSellSportsEquipment,
  additionalBaggageData,
  setGetBar,
  setGetGoodNight,
  confirmedMeals,
  getAddonData,
  tripIndex,
  categoryCodes,
  excessBaggageData,
  newAddonData,
  dispatch,
  totalMealsPriceCount,
  mfData,
  setSellBar,
  setSellGoodNight,
) => {
  const categoriesList = [...mfData.mainAddonsList, ...mfData.extaAddonsList];
  getAddonTitle(categoriesList, categoryCodes);
  if (!isChecked) {
    const newSelectedAddonData = [];
    let newSetGetSelectedAddon = { ...setGetSelectedAddon };
    const sellAddonSsrlist = cloneDeep(sellAddonSsr);
    const segmentList = { ...setGetSportsEquipment };
    const finalSsrkeyList = { ...setSellSportsEquipment };
    const additionalBagNewState = cloneDeep(additionalBaggageData?.data) || [];
    const excessBagNewState = cloneDeep(excessBaggageData?.data) || [];
    const newBarData = { ...setGetBar };
    const gnKitData = { ...setGetGoodNight };
    const finalSellAddonData = { ...setSellBar };
    const newSetSellGoodNight = { ...setSellGoodNight };
    const selectedMealData = cloneDeep(confirmedMeals);
    // const totalPriceCount = cloneDeep(totalMealsPriceCount); // un-used code.
    newGetAddonData = cloneDeep(getAddonData);
    updateSellAddonSsrData(
      sellAddonSsrlist,
      getAddonData,
      tripIndex,
      sellAddonSsr,
      categoryCodes,
    );
    if (typeof setGetSelectedAddon === 'object') {
      newSetGetSelectedAddon = Object.keys(setGetSelectedAddon).map((key) => setGetSelectedAddon[key]);
    }
    setGetSelectedAddon[tripIndex]?.selectedAddone?.forEach((addonData) => {
      if (addonData?.ssrCode === categoryCodes?.speq ||
          addonData?.category === categoryCodes?.abhf ||
          addonData?.category === categoryCodes?.baggage) {
        getAddonData?.ssr[tripIndex]?.journeySSRs?.forEach((journeySSRsList) => {
          const tempAddon = { ...addonData };
          updatejourneySSRList(
            journeySSRsList,
            getAddonData?.ssr[tripIndex],
            tempAddon,
            newSelectedAddonData,
            segmentList,
            finalSsrkeyList,
            additionalBagNewState,
            excessBagNewState,
            categoryCodes,
            setGetSportsEquipment,
            tripIndex,
            sellAddonSsrlist,
          );
        });
      } else {
        getAddonData?.ssr[tripIndex]?.segments?.forEach((segmentSSRsList) => {
          const tempAddon = { ...addonData };
          updateSegmentSSRList(
            segmentSSRsList,
            getAddonData?.ssr[tripIndex],
            tempAddon,
            newSelectedAddonData,
            newBarData,
            gnKitData,
            sellAddonSsrlist,
            categoryCodes,
            selectedMealData,
            tripIndex,
            finalSellAddonData,
            newSetSellGoodNight,
          );
        });
      }
    });

    dispatch({
      type: addonActions.SET_SELL_ADDON_SSR,
      payload: sellAddonSsrlist,
    });

    const newSetGetAddonData = [...newSetGetSelectedAddon[tripIndex].selectedAddone, ...newSelectedAddonData];
    newSetGetSelectedAddon[tripIndex].selectedAddone = newSetGetAddonData;

    dispatch({
      type: addonActions.SET_GET_SELECTED_ADDON,
      payload: newSetGetSelectedAddon,
    });

    dispatch({
      type: addonActions.SET_GET_SPORTSEQUIPMENT_ADDON_DATA,
      payload: segmentList,
    });

    dispatch({
      type: addonActions.SET_SELL_SPORTSEQUIPMENT_ADDON_DATA,
      payload: finalSsrkeyList,
    });

    dispatch({
      type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
      payload: segmentList,
    });

    const _additionalBaggageData = {
      ...additionalBaggageData,
      data: additionalBagNewState,
    };

    const _excessBaggageData = {
      ...excessBaggageData,
      data: excessBagNewState,
    };

    dispatch({
      type: addonActions.UPDATE_ADDITIONAL_BAGGAGE_FORM_DATA,
      payload: {
        tripIndex,
        additionalBaggageData: _additionalBaggageData,
      },
    });

    const { abhf } = categoryCodes.abhf;
    const { baggage } = categoryCodes.baggage;

    dispatch({
      type: addonActions.PREPARE_ADDITIONAL_BAGGAGE_DATA,
      payload: {
        newAddOnData: newSetGetSelectedAddon,
        categoryName: additionalBagTitle,
        removedAddonSsr: [],
        abhf,
        tripIndex,
      },
    });

    dispatch({
      type: addonActions.UPDATE_EXCESS_BAGGAGE_FORM_DATA,
      payload: {
        tripIndex,
        excessBaggageData: _excessBaggageData,
      },
    });

    dispatch({
      type: addonActions.PREPARE_EXCESS_BAGGAGE_DATA,
      payload: {
        newAddOnData: newSetGetSelectedAddon,
        categoryName: baggageDataTitle,
        removedAddonSsr: [],
        baggage,
        tripIndex,
      },
    });

    // // Bar data
    dispatch({
      type: addonActions.SET_GET_BAR_ADDON_DATA,
      payload: newBarData,
    });

    dispatch({
      type: addonActions.SET_SELL_BAR_ADDON_DATA,
      payload: finalSellAddonData,
    });

    // // Sleep Data
    dispatch({
      type: addonActions.SET_GET_GOODNIGHT_ADDON_DATA,
      payload: gnKitData,
    });

    dispatch({
      type: addonActions.SET_SELL_GOODNIGHT_ADDON_DATA,
      payload: newSetSellGoodNight,
    });

    dispatch({
      type: addonActions.SELECTED_BAR_ADDON_DATA,
      payload: newBarData,
    });

    dispatch({
      type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
      payload: gnKitData,
    });

    let ssrObjList;
    // one for sky
    ssrObjList = getSsrObj(
      sellAddonSsrlist,
      newGetAddonData,
      ssrType.segment,
      categoryCodes.bar,
      oneForSkyTitle,
    );
    eventService.update(ssrObjList, []);

    // good night sleep
    ssrObjList = getSsrObj(
      sellAddonSsrlist,
      newGetAddonData,
      ssrType.segment,
      categoryCodes.goodNight,
      GdSleepTitle,
    );
    eventService.update(ssrObjList, []);

    // Tiffin Data
    dispatch({
      type: addonActions.SET_CONFIRMED_MEALS,
      payload: {
        meals: selectedMealData,
        priceAndCount: totalMealsPriceCount,
      },
    });

    dispatch({
      type: addonActions.SET_BUNDLE_MEALS,
      payload: {
        meals: selectedMealData,
        priceAndCount: totalMealsPriceCount,
      },
    });

    const addReviewSummaryData = getAddReviewSummaryData(
      selectedMealData,
      _6E_EATS,
    );
    eventService.update(addReviewSummaryData, []);

    const selectedMealAddonData = cloneDeep(selectedMealData[tripIndex]);
    if (selectedMealAddonData) {
      Object.keys(selectedMealAddonData)?.forEach((journeyKey) => {
        Object.keys(selectedMealAddonData[journeyKey])?.forEach((passengerObject) => {
          Object.values(selectedMealAddonData[journeyKey][passengerObject])?.forEach((paxItem) => {
            dispatch({
              type: addonActions.SET_SELECTED_MEALS,
              payload: {
                meal: paxItem?.meal,
                isTaken: paxItem?.isTaken,
                segmentIndex: paxItem?.segmentIndex,
                passengerIndex: paxItem?.passengerIndex,
                passengerSSRKey: paxItem?.meal?.passengersSSRKey[paxItem?.passengerIndex],
                segmentKey: paxItem?.segmentKey,
                journeyKey: paxItem?.journeyKey,
                ssrCategory: paxItem?.meal?.ssrCode,
                bundleTotalPrice: paxItem?.meal?.price || null,
              },
            });
          });
        });
      });
    }
  }
};

export default AddSameAmenities;
