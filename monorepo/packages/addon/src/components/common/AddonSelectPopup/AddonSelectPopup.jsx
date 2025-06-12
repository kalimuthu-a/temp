import React, { useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import PropTypes from 'prop-types';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { disableBaggageRemoveButton } from '../../AddonList/ExcessBaggage/ExcessBaggageUtils';
import { categoryCodes, ssrType, tripType } from '../../../constants';
import eventService from '../../../services/event.service';
import { getSsrObj } from '../../../functions/utils';
import { getAddReviewSummaryData } from '../../../functions/mealUtils';
import { getSSRData } from '../../AddonContainer/CardContainer/CardContainer';

const AddonSelectPopup = ({ onAdd, onSkip, journeydetails, passengerDetails }) => {
  const [selectedTripArray, setSelectedTripArray] = useState([]);
  const [selectedPassengerArray, setSelectedPassengerArray] = useState([]);
  const [selectedAddonList, setSelectedAddonList] = useState([]);
  const [selectedAddonPaxKey, setSelectedAddonPaxKey] = useState('');

  const [tripArray, setTripArray] = useState([]);
  const [passengerArray, setPassengerArray] = useState([]);
  const [ssrCodeFor6EBar, setSsrCodeFor6EBar] = useState('');
  const [ssrCodeForGoodNight, setSsrCodeForGoodNight] = useState([]);
  const [ssrCodeForSportsEquipment, setSsrCodeForSportsEquipment] = useState([]);
  const [hidePassenger, setHidePassenger] = useState(false);
  const [isUnderProgress, setIsUnderProgress] = useState(false);
  const [closePopup, setClosePopup] = useState(false);
  const [newComibneAddons, setNewComibneAddons] = useState([]);
  const [currentTrip, setCurrentTrip] = useState({});
  const [currentCatagoryCode, setCurrentCatagoryCode] = useState('');
  const [isMealSelected, setIsMealSelected] = useState(false);

  const {
    state: {
      setGetBar,
      setSellBar,
      setGetSelectedAddon,
      sellAddonSsr,
      setGetGoodNight,
      setSellGoodNight,
      setGetSportsEquipment,
      setSellSportsEquipment,
      additionalBaggageData,
      excessBaggageData,
      removedAddonSsr,
      delayLostProtection,
      selectedMeals,
      takenMeals,
      totalMealsPriceCount,
      copyTotalMealsPriceCount,
      confirmedMeals,
      setSellFastForward,
      mlstBundleFare,
      primBundleFare,
      getAddonData,
      containerConfigData,
      getPassengerDetails,
      bundleMeals,
      ...state
    },
    dispatch,
  } = React.useContext(AppContext);

  const mfData = containerConfigData?.mfData?.data?.addOnsMainByPath?.item;
  const additionalData = containerConfigData?.configJson?.data?.addonAdditionalByPath?.item;
  const categoriesList = [...mfData.mainAddonsList, ...mfData.extaAddonsList];

  const getAddonTitle = (categoryCode) => {
    let title = '';
    categoriesList.forEach((item) => {
      if (categoryCode === item.categoryBundleCode) {
        title = item.title;
      }
    });
    return title;
  };

  const ONE_FOR_THE_SKIES = getAddonTitle(categoryCodes.bar); // 'One for the skies';
  const SLEEP_ESSENTIALS = getAddonTitle(categoryCodes.goodNight); // 'Sleep essentials';
  const ADD_SPORTS_EQUIPMENT = getAddonTitle(categoryCodes.speq); // 'Add Sports Equipment';
  const ADD_ADDITIONAL_BAGS = getAddonTitle(categoryCodes.abhf); // 'Add Additional Bags';
  const _6E_EATS = getAddonTitle(categoryCodes.meal); // '6E Eats';
  const BAGGAGE = getAddonTitle(categoryCodes.baggage); // 'Baggage';
  const FAST_FORWARD = getAddonTitle(categoryCodes.ffwd); // 'Fast Forward';
  const SEAT_AND_EAT = getAddonTitle(categoryCodes.mlst); // '6E Seat And  Eat';
  const _6E_PRIME = getAddonTitle(categoryCodes.prim); // '6E Prime';

  const getBundlePrice = (journeyKey, ssrCode) => {
    const bundleArray = getAddonData?.bundles;
    let totalBundlePrice = 0;
    bundleArray.forEach((bundle) => {
      if (bundle.bundleCode === ssrCode) {
        const newPricesByJourney = bundle.pricesByJourney.filter((obj) => obj.journeyKey === journeyKey);
        if (newPricesByJourney.length > 0) {
          totalBundlePrice = newPricesByJourney[0].totalPrice;
        }
      }
    });

    return totalBundlePrice;
  };

  useEffect(() => {
    dispatch({
      type: addonActions.SET_CONFIRMED_MEALS,
      payload: {
        meals: selectedMeals,
        priceAndCount: totalMealsPriceCount,
      },
    });
    if (currentCatagoryCode === categoryCodes.mlst || currentCatagoryCode === categoryCodes.prim) {
      dispatch({
        type: addonActions.SET_BUNDLE_MEALS,
        payload: {
          meals: selectedMeals,
          priceAndCount: copyTotalMealsPriceCount,
        },
      });

      try {
        if (currentCatagoryCode === categoryCodes.mlst) {
          const newAddonData = newComibneAddons.find((addonDetails) => {
            return addonDetails.categoryBundleCode === categoryCodes.mlst;
          });
          const addReviewSummaryData = getAddReviewSummaryData(
            selectedMeals,
            SEAT_AND_EAT,
            categoryCodes.mlst,
            newAddonData.availableBundlePriceByJourney.totalPrice,
            state.underTwelveHourFlight,
            {
              passengerDetails,
              currentTrip,
            },
          );
          const newAddReviewSummaryData = [];
          addReviewSummaryData.forEach((arsdata) => {
            const newArsData = JSON.parse(JSON.stringify(arsdata));
            newArsData.category = categoryCodes.mlst;
            newArsData.ssrCode = categoryCodes.mlst;
            newArsData.price = getBundlePrice(newArsData.journeyKey, categoryCodes.mlst);
            newAddReviewSummaryData.push(newArsData);
          });
          eventService.update(newAddReviewSummaryData, []);
        } else if (currentCatagoryCode === categoryCodes.prim) {
          const newAddonData = newComibneAddons.find((addonDetails) => {
            return addonDetails.categoryBundleCode === categoryCodes.prim;
          });
          const addReviewSummaryData = getAddReviewSummaryData(
            selectedMeals,
            _6E_PRIME,
            categoryCodes.prim,
            newAddonData.availableBundlePriceByJourney.totalPrice,
            state.underTwelveHourFlight,
            {
              passengerDetails,
              currentTrip,
            },
          );

          const newAddReviewSummaryData = [];
          addReviewSummaryData.forEach((arsdata) => {
            const newArsData = JSON.parse(JSON.stringify(arsdata));
            newArsData.category = categoryCodes.prim;
            newArsData.ssrCode = categoryCodes.prim;
            newArsData.price = getBundlePrice(newArsData.journeyKey, categoryCodes.prim);
            newAddReviewSummaryData.push(newArsData);
          });
          eventService.update(newAddReviewSummaryData, []);
        }
      } catch (e) {
        console.log(e);
      }
    } else if (isMealSelected) {
      const addReviewSummaryData = getAddReviewSummaryData(
        selectedMeals,
        _6E_EATS,
      );

      eventService.update(addReviewSummaryData, []);
    }
  }, [selectedMeals]);

  // TD: rectify with cloneDeep from lodash
  const createCopyOfSelectedAddon = () => {
    const newSetGetSelectedAddon = JSON.parse(JSON.stringify(setGetSelectedAddon));
    Object.keys(setGetSelectedAddon).forEach((key) => {
      newSetGetSelectedAddon[key].selectedAddone = JSON.parse(JSON.stringify(setGetSelectedAddon[key].selectedAddone));
    });
    return newSetGetSelectedAddon;
  };

  const _newSetGetSelectedAddon = createCopyOfSelectedAddon();

  const refineTripArray = (segmentArray) => {
    // if setGetBar/goodnight is having entry then remove domestic segments
    if (Object.keys(setGetBar).length > 0 || Object.keys(setGetGoodNight).length > 0) {
      const newSegmentArray = segmentArray.filter((obj) => obj.journeyType !== tripType.domestic);
      return ([...newSegmentArray]);
    }
    return [];
  };

  const getPassengersSSRKeywithSsrKey = (ssrkey, trip) => {
    const ssrsArray = trip.segmentSSRs.filter((obj) => obj.category === categoryCodes.bar);
    return (ssrsArray[0]?.ssrs.filter((obj) => obj.ssrCode === ssrkey) || []);
  };

  const getPaxSSRKeyForGoodNight = (ssrkey, trip) => {
    const passengerSsrArray = [];
    const ssrsArray = trip.segmentSSRs.filter((obj) => obj.category === categoryCodes.goodNight);
    const newSsrArray = ssrsArray[0]?.ssrs || [];
    ssrkey.forEach((ssrk) => {
      newSsrArray.forEach((ssr) => {
        if (ssr.ssrCode === ssrk) {
          passengerSsrArray.push(ssr);
        }
      });
    });
    return passengerSsrArray;
  };

  const getSelectedSectorAndSsrkey = (dataArray) => {
    let selectedSsrKey = [];
    let addonSegment = '';
    Object.keys(dataArray).forEach((dataArrayKey) => {
      Object.keys(dataArray[dataArrayKey]).forEach((segment) => {
        // setSelectedAddonSegment(segment);
        addonSegment = segment;
        Object.keys(dataArray[dataArrayKey][segment]).forEach((paxKey) => {
          selectedSsrKey = dataArray[dataArrayKey][segment][paxKey];
        });
      });
    });

    return { selectedSsrKey, addonSegment };
  };

  const checkToDisplayTripAndPassenger = (selectedAddonListArray) => {
    const onlyTripAddonCategoryCodeArray = [
      categoryCodes.ffwd,
      categoryCodes.mlst,
      categoryCodes.prim,
    ];

    const onlyTripAddonArray = [
      // 'Fast Forward',
      // '6E Seat And  Eat',
      // '6E Prime',
    ];

    onlyTripAddonCategoryCodeArray.forEach((cCode) => {
      categoriesList.forEach((item) => {
        if (cCode === item.categoryBundleCode) {
          onlyTripAddonArray.push(item.title);
        }
      });
    });

    let onlyTripAddonSelected = true;
    selectedAddonListArray.forEach((addon) => {
      if (onlyTripAddonArray.indexOf(addon.addonName) === -1) {
        onlyTripAddonSelected = false;
      }
    });

    return onlyTripAddonSelected;
  };

  useEffect(() => {
    let segmentArray = [];
    let selectedAddonListArray = [];
    let selectedTripIndex = 0;
    const barData = { ...setGetBar };
    const goodNightData = { ...setGetGoodNight };
    const addonSegment = '';
    journeydetails.forEach((journey) => {
      segmentArray = [...segmentArray, ...journey.segments];
    });

    Object.keys(setGetSelectedAddon).forEach((index) => {
      if (setGetSelectedAddon[index]?.selectedAddone.length >= 1) {
        selectedTripIndex = index;
        selectedAddonListArray = [...setGetSelectedAddon[index].selectedAddone];
        setSelectedAddonList([...selectedAddonListArray]);
      }
    });

    setSelectedAddonPaxKey(selectedAddonListArray[0].passengerKey);

    // refineTripArray([...segmentArray]);
    // set correct passengerIndex
    const passengerDetailsWithPaxIndex = [];
    passengerDetails.forEach((passenger, index) => {
      const pax = passenger;
      pax.paxIndex = index;
      passengerDetailsWithPaxIndex.push(pax);
    });
    setTripArray([...journeydetails]);
    if (journeydetails.length > 1) {
      setPassengerArray([...passengerDetailsWithPaxIndex]);
    } else {
      const newPassengerDetails = passengerDetailsWithPaxIndex
        .filter((obj) => obj.passengerKey !== selectedAddonListArray[0].passengerKey);
      setPassengerArray([...newPassengerDetails]);
    }

    selectedAddonListArray.forEach((addon) => {
      // incase 6EBars is already selected addon
      if (addon.addonName === ONE_FOR_THE_SKIES) {
        const selected6EbarData = getSelectedSectorAndSsrkey(barData);
        segmentArray.forEach((trip) => {
          const tripName = `${trip.segmentDetails?.origin}-${trip.segmentDetails?.destination}`;
          if (tripName === selected6EbarData.addonSegment) {
            const segmentSSRs = trip.segmentSSRs.filter((obj) => obj.category === categoryCodes.bar);
            const segmentSSRsArray = segmentSSRs[0]?.ssrs || [];
            segmentSSRsArray.forEach((ssr) => {
              ssr.passengersSSRKey.forEach((passengerSSR) => {
                if (passengerSSR.passengerKey === addon.passengerKey
                   && passengerSSR.ssrKey === selected6EbarData.selectedSsrKey[0]) {
                  setSsrCodeFor6EBar(ssr.ssrCode);
                }
              });
            });
          }
        });
      }
      // incase sleep essentials are already selected addon
      if (addon.addonName === SLEEP_ESSENTIALS) {
        const goodNightSelectedData = getSelectedSectorAndSsrkey(goodNightData);
        const ssrCodeArrayForGoodnight = [];
        segmentArray.forEach((trip) => {
          const tripName = `${trip.segmentDetails?.origin}-${trip.segmentDetails?.destination}`;
          if (tripName === goodNightSelectedData.addonSegment) {
            const segmentSSRs = trip.segmentSSRs.filter((obj) => obj.category === categoryCodes.goodNight);
            const segmentSSRsArray = segmentSSRs[0]?.ssrs || [];
            segmentSSRsArray.forEach((ssr) => {
              ssr.passengersSSRKey.forEach((passengerSSR) => {
                if (passengerSSR.passengerKey === addon.passengerKey
                ) {
                  goodNightSelectedData.selectedSsrKey.forEach((ssrKey) => {
                    if (passengerSSR.ssrKey === ssrKey) {
                      ssrCodeArrayForGoodnight.push(ssr.ssrCode);
                    }
                  });
                  setSsrCodeForGoodNight([...ssrCodeArrayForGoodnight]);
                }
              });
            });
          }
        });
      }

      // incase sleep essentials are already selected addon
      if (addon.addonName === ADD_SPORTS_EQUIPMENT) {
        setSsrCodeForSportsEquipment(addon.ssrCode);
      }

      // incase fast forward already selected addon
      let fastForwardCheckFlag = false;
      if (addon.addonName === FAST_FORWARD && !fastForwardCheckFlag) {
        fastForwardCheckFlag = true;
        if (checkToDisplayTripAndPassenger(selectedAddonListArray)) {
          setHidePassenger(true);
          const newTripArray = JSON.parse(JSON.stringify(journeydetails));
          newTripArray.splice(selectedTripIndex, 1);
          setTripArray([...newTripArray]);
        }
      }

      // incase seat and eat already selected addon
      let seatAndEatCheckFlag = false;
      if ((addon.addonName === SEAT_AND_EAT || addon.addonName === _6E_PRIME) && !seatAndEatCheckFlag) {
        seatAndEatCheckFlag = true;
        if (checkToDisplayTripAndPassenger(selectedAddonListArray)) {
          setHidePassenger(true);
          const newTripArray = JSON.parse(JSON.stringify(journeydetails));
          newTripArray.splice(selectedTripIndex, 1);
          setTripArray([...newTripArray]);
        }
      }
    });
  }, [journeydetails, passengerDetails, setGetSelectedAddon]);

  useEffect(() => {
    if (closePopup) {
      onAdd();
    }
  }, [closePopup]);

  const onChangeTripHandler = (item) => {
    if (typeof (item) === 'string' && item.toLowerCase() === 'all') {
      if (selectedTripArray.length > 0 && selectedTripArray.length === tripArray.length) {
        setSelectedTripArray([]);
      } else {
        setSelectedTripArray([...tripArray]);
      }
    } else {
      const cuurentTripArray = [...selectedTripArray];
      if (cuurentTripArray.indexOf(item) === -1) {
        cuurentTripArray.push(item);
      } else {
        cuurentTripArray.splice(cuurentTripArray.indexOf(item), 1);
      }
      setSelectedTripArray([...cuurentTripArray]);
    }
  };

  const onChangePassengerHandler = (item) => {
    if (typeof (item) === 'string' && item.toLowerCase() === 'all') {
      if (selectedPassengerArray.length > 0 && selectedPassengerArray.length === passengerArray.length) {
        setSelectedPassengerArray([]);
      } else {
        setSelectedPassengerArray([...passengerArray]);
      }
    } else {
      const cuurentPassengerArray = [...selectedPassengerArray];
      if (cuurentPassengerArray.indexOf(item) === -1) {
        cuurentPassengerArray.push(item);
      } else {
        cuurentPassengerArray.splice(cuurentPassengerArray.indexOf(item), 1);
      }
      setSelectedPassengerArray([...cuurentPassengerArray]);
    }
  };

  const barDataHandler = () => {
    const newBarData = { ...setGetBar };
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    const finalSellAddonData = { ...setSellBar };
    const newSellAddonSsr = [...sellAddonSsr];

    let segmentArray = [];
    selectedTripArray.forEach((journey) => {
      segmentArray = [...segmentArray, ...journey.segments];
    });

    const refinedSegmentArray = refineTripArray(segmentArray);

    refinedSegmentArray.forEach((trip) => {
      let i = 0;
      tripArray.forEach((tripData, index) => {
        tripData.segments.forEach((segmentData) => {
          if (segmentData.segmentKey === trip.segmentKey) {
            i = index;
          }
        });
      });
      const tripName = `${trip.segmentDetails?.origin}-${trip.segmentDetails?.destination}`;
      const passengersSSRKey = getPassengersSSRKeywithSsrKey(ssrCodeFor6EBar, trip);

      if (!newBarData[i]) {
        newBarData[i] = [];
        newBarData[i][tripName] = {};
      }

      selectedPassengerArray.forEach((passenger) => {
        passengersSSRKey[0].passengersSSRKey.forEach((paxSsr) => {
          if (passenger.passengerKey === paxSsr.passengerKey) {
            Object.keys(newBarData).forEach((barDataKey) => {
              Object.keys(newBarData[barDataKey]).forEach((segment) => {
                if (tripName === segment) {
                  if (!newBarData[barDataKey][segment][passenger.passengerKey]) {
                    newBarData[barDataKey][segment][passenger.passengerKey] = [paxSsr.ssrKey];
                    const sellAddonItem = {
                      ssrKey: paxSsr.ssrKey,
                      count: 1,
                      note: '',
                      passengerKey: passenger.passengerKey,
                    };

                    const sellAddonSsrItem = {
                      ssrKey: paxSsr.ssrKey,
                      count: 1,
                      note: '',
                    };

                    sellAddonSsr.push(sellAddonSsrItem);
                    if (!finalSellAddonData[i]) {
                      finalSellAddonData[i] = [];
                    }
                    finalSellAddonData[i].push(sellAddonItem);
                    newSellAddonSsr.push(sellAddonItem);

                    if (!newSetGetSelectedAddon[i]) {
                      newSetGetSelectedAddon[i].selectedAddone = [];
                    }
                    newSetGetSelectedAddon[i].selectedAddone.push(
                      { passengerKey: passenger.passengerKey,
                        addonName: ONE_FOR_THE_SKIES,
                      },
                    );
                  }
                }
              });
            });
          }
        });
      });
    });

    dispatch({
      type: addonActions.SET_GET_BAR_ADDON_DATA,
      payload: newBarData,
    });

    dispatch({
      type: addonActions.SET_SELL_BAR_ADDON_DATA,
      payload: finalSellAddonData,
    });

    dispatch({
      type: addonActions.SELECTED_BAR_ADDON_DATA,
      payload: newBarData,
    });
    try {
      const ssrObjList = getSsrObj(
        sellAddonSsr,
        getAddonData,
        ssrType.segment,
        categoryCodes.bar,
        ONE_FOR_THE_SKIES,
      );

      eventService.update(ssrObjList, []);
    } catch (e) {
      console.log(e);
    }
    return newSetGetSelectedAddon;
  };

  const sleepEssentialDataHandler = () => {
    const newGoodNightData = { ...setGetGoodNight };
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    const newSetSellGoodNight = { ...setSellGoodNight };
    const newSellAddonSsr = JSON.parse(JSON.stringify(sellAddonSsr));

    let segmentArray = [];
    selectedTripArray.forEach((journey) => {
      segmentArray = [...segmentArray, ...journey.segments];
    });

    const refinedSegmentArray = refineTripArray(segmentArray);
    refinedSegmentArray.forEach((trip) => {
      let i = 0;
      tripArray.forEach((tripData, index) => {
        tripData.segments.forEach((segmentData) => {
          if (segmentData.segmentKey === trip.segmentKey) {
            i = index;
          }
        });
      });
      const tripName = `${trip.segmentDetails?.origin}-${trip.segmentDetails?.destination}`;
      const passengersSSRKey = getPaxSSRKeyForGoodNight(ssrCodeForGoodNight, trip);

      if (!newGoodNightData[i]) {
        newGoodNightData[i] = [];
        newGoodNightData[i][tripName] = {};
      }

      selectedPassengerArray.forEach((passenger) => {
        passengersSSRKey.forEach((paxSsrKeyArray) => {
          paxSsrKeyArray.passengersSSRKey.forEach((paxSsr) => {
            if (passenger.passengerKey === paxSsr.passengerKey) {
              Object.keys(newGoodNightData).forEach((barDataKey) => {
                Object.keys(newGoodNightData[barDataKey]).forEach((segment) => {
                  if (tripName === segment) {
                    if (!newGoodNightData[barDataKey][segment][passenger.passengerKey] ||
                      newGoodNightData[barDataKey][segment][passenger.passengerKey].indexOf(paxSsr.ssrKey) === -1) {
                      if (!newGoodNightData[barDataKey][segment][passenger.passengerKey]) {
                        newGoodNightData[barDataKey][segment][passenger.passengerKey] = [paxSsr.ssrKey];
                      } else {
                        newGoodNightData[barDataKey][segment][passenger.passengerKey].push(paxSsr.ssrKey);
                      }
                      const sellAddonItem = {
                        ssrKey: paxSsr.ssrKey,
                        count: 1,
                        note: '',
                        passengerKey: passenger.passengerKey,
                      };

                      const sellAddonSsrItem = {
                        ssrKey: paxSsr.ssrKey,
                        count: 1,
                        note: '',
                      };
                      sellAddonSsr.push(sellAddonSsrItem);
                      if (!newSetSellGoodNight[i]) {
                        newSetSellGoodNight[i] = [];
                      }
                      newSetSellGoodNight[i].push(sellAddonItem);
                      newSellAddonSsr.push(sellAddonItem);
                      const isAlreadyEntryDone = newSetGetSelectedAddon[i].selectedAddone.filter(
                        (obj) => (obj.passengerKey === passenger.passengerKey) && (obj.addonName === SLEEP_ESSENTIALS),
                      ).length > 0;
                      if (!isAlreadyEntryDone) {
                        newSetGetSelectedAddon[i].selectedAddone.push(
                          { passengerKey: passenger.passengerKey,
                            addonName: SLEEP_ESSENTIALS,
                          },
                        );
                      }
                    }
                  }
                });
              });
            }
          });
        });
      });
    });

    dispatch({
      type: addonActions.SET_GET_GOODNIGHT_ADDON_DATA,
      payload: newGoodNightData,
    });

    dispatch({
      type: addonActions.SET_SELL_GOODNIGHT_ADDON_DATA,
      payload: newSetSellGoodNight,
    });

    dispatch({
      type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
      payload: newGoodNightData,
    });
    try {
      const ssrObjList = getSsrObj(
        sellAddonSsr,
        getAddonData,
        ssrType.segment,
        categoryCodes.goodNight,
        SLEEP_ESSENTIALS,
      );

      eventService.update(ssrObjList, []);
    } catch (e) {
      console.log(e);
    }
    return newSetGetSelectedAddon;
  };

  const sportsEquipmentDataHandler = () => {
    const newSetGetSportsEquipment = { ...setGetSportsEquipment };
    const newSetSellSportsEquipment = { ...setSellSportsEquipment };
    const newSellAddonSsr = JSON.parse(JSON.stringify(sellAddonSsr));
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    let count = 1;
    sellAddonSsr.forEach((sellAddonSsrData) => {
      if (sellAddonSsrData.categoryName === ADD_SPORTS_EQUIPMENT) {
        count = sellAddonSsrData.count;
      }
    });
    selectedTripArray.forEach((trip) => {
      const passengerSsrArray = trip.journeySSRs
        .filter((obj) => obj.category === ssrCodeForSportsEquipment)[0]
        .ssrs[0]?.passengersSSRKey || [];

      const index = tripArray.indexOf(trip);

      if (!newSetGetSportsEquipment[index]) {
        newSetGetSportsEquipment[index] = [];
      }

      if (!newSetSellSportsEquipment[index]) {
        newSetSellSportsEquipment[index] = [];
      }

      if (!newSetGetSelectedAddon[index]) {
        newSetGetSelectedAddon[index].selectedAddone = [];
      }

      selectedPassengerArray.forEach((passenger) => {
        passengerSsrArray.forEach((paxSsrKeyArray) => {
          if (passenger.passengerKey === paxSsrKeyArray.passengerKey) {
            if (Object.keys(newSetGetSportsEquipment[index])[0] !== passenger.passengerKey) {
              newSetGetSportsEquipment[index][passenger.passengerKey] = [(`${paxSsrKeyArray.ssrKey}@@${count}`)];

              const sellAddonItem = {
                ssrKey: paxSsrKeyArray.ssrKey,
                count,
                note: '',
                passengerKey: passenger.passengerKey,
              };

              const sellAddonSsrItem = {
                ssrKey: paxSsrKeyArray.ssrKey,
                count,
                note: '',
              };
              newSetSellSportsEquipment[index].push(sellAddonItem);
              sellAddonSsr.push(sellAddonSsrItem);

              newSetGetSelectedAddon[index].selectedAddone.push(
                { passengerKey: passenger.passengerKey,
                  addonName: ADD_SPORTS_EQUIPMENT,
                  ssrCode: ssrCodeForSportsEquipment,
                },
              );
            }
          }
        });
      });
    });

    dispatch({
      type: addonActions.SET_GET_SPORTSEQUIPMENT_ADDON_DATA,
      payload: newSetGetSportsEquipment,
    });

    dispatch({
      type: addonActions.SET_SELL_SPORTSEQUIPMENT_ADDON_DATA,
      payload: newSetSellSportsEquipment,
    });

    dispatch({
      type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
      payload: newSetGetSportsEquipment,
    });
    try {
      const ssrObjList = getSsrObj(
        sellAddonSsr,
        getAddonData,
        ssrType.journey,
        categoryCodes.speq,
        ADD_SPORTS_EQUIPMENT,
      );

      eventService.update(ssrObjList, []);
    } catch (e) {
      console.log(e);
    }
    return newSetGetSelectedAddon;
  };

  const baggageDataHandler = () => {
    const newExcessBaggageData = { ...excessBaggageData };
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    let domesticE = {};
    excessBaggageData.data.forEach((dataArray) => {
      dataArray.forEach((data) => {
        if (data.checked) {
          domesticE = JSON.parse(JSON.stringify(data.domesticE));
        }
      });
    });

    selectedTripArray.forEach((trip) => {
      const index = tripArray.indexOf(trip);
      const journeySSRsArray = trip.journeySSRs.filter((obj) => obj.category === categoryCodes.baggage);
      const passengersSSRKeyArray = (journeySSRsArray[0].ssrs
        .filter((obj) => obj.ssrCode === domesticE.ssrCode))[0]?.passengersSSRKey || [];

      selectedPassengerArray.forEach((passenger) => {
        passengersSSRKeyArray.forEach((paxSsr) => {
          if (passenger.passengerKey === paxSsr.passengerKey) {
            newExcessBaggageData.data[index].forEach((excessBaggage, i) => {
              if (excessBaggage.passengerKey === paxSsr.passengerKey && !excessBaggage.checked) {
                const newDomesticE = JSON.parse(JSON.stringify(domesticE));
                newDomesticE.ssrKey = paxSsr?.ssrKey;
                newExcessBaggageData.data[index][i].domestic = paxSsr.ssrKey;
                newExcessBaggageData.data[index][i].domesticE = newDomesticE;
                newExcessBaggageData.data[index][i].checked = true;

                if (!newSetGetSelectedAddon[index]) {
                  newSetGetSelectedAddon[index].selectedAddone = [];
                }
                newSetGetSelectedAddon[index].selectedAddone.push(
                  { passengerKey: passenger.passengerKey,
                    addonName: newDomesticE.name.trim(),
                    ssrCode: newDomesticE.ssrCode,
                    category: newDomesticE.name.toLowerCase().trim(),
                    price: newDomesticE.price,
                    name: newDomesticE.name,
                    journeyKey: trip.journeyKey,
                  },
                );
                const sellAddonItem = {
                  ssrKey: paxSsr?.ssrKey,
                  count: 1,
                  note: '',
                  passengerKey: paxSsr.passengerKey,
                  tripIndex: index,
                };
                sellAddonSsr.push(sellAddonItem);
              }
            });
          }
        });
      });

      dispatch({
        type: addonActions.UPDATE_EXCESS_BAGGAGE_FORM_DATA,
        payload: {
          tripIndex: index,
          excessBaggageData: {
            ...newExcessBaggageData,
            data: newExcessBaggageData?.data?.map((row) => row?.map((item) => disableBaggageRemoveButton(item, false))),
          },
        },
      });
    });

    try {
      const ssrObjList = getSsrObj(
        sellAddonSsr,
        getAddonData,
        ssrType.journey,
        categoryCodes.baggage,
        BAGGAGE,
      );

      eventService.update(ssrObjList, []);
    } catch (e) {
      console.log(e);
    }

    return newSetGetSelectedAddon;
  };

  const addAdditionalBagsDataHandler = () => {
    const newAdditionalBaggageData = JSON.parse(JSON.stringify(additionalBaggageData));
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    let baggageE = {};
    let categoryName = '';
    let additionalBag = 1;
    additionalBaggageData.data.forEach((dataArray) => {
      dataArray.forEach((data) => {
        if (data.checked) {
          categoryName = data.abhfCategoryssrCode;
          baggageE = JSON.parse(JSON.stringify(data.baggageE));
          additionalBag = data.additionalBag;
        }
      });
    });
    selectedTripArray.forEach((trip) => {
      const index = tripArray.indexOf(trip);
      const journeySSRsArray = trip.journeySSRs.filter((obj) => obj.category === categoryName);
      const passengersSSRKeyArray = (journeySSRsArray[0].ssrs
        .filter((obj) => obj.ssrCode === baggageE.ssrCode))[0]?.passengersSSRKey || [];

      selectedPassengerArray.forEach((passenger) => {
        passengersSSRKeyArray.forEach((paxSsr) => {
          if (passenger.passengerKey === paxSsr.passengerKey) {
            newAdditionalBaggageData.data[index].forEach((additionalBaggage, i) => {
              if (additionalBaggage.passengerKey === paxSsr.passengerKey && !additionalBaggage.checked) {
                const newBaggaeE = JSON.parse(JSON.stringify(baggageE));
                newBaggaeE.ssrKey = paxSsr?.ssrKey;
                newAdditionalBaggageData.data[index][i].baggageE = newBaggaeE;
                newAdditionalBaggageData.data[index][i].checked = true;
                newAdditionalBaggageData.data[index][i].addoncantBeRemoved = false;
                newAdditionalBaggageData.data[index][i].additionalBag = additionalBag;
                if (!newSetGetSelectedAddon[index]) {
                  newSetGetSelectedAddon[index].selectedAddone = [];
                }
                newSetGetSelectedAddon[index].selectedAddone.push(
                  { passengerKey: paxSsr.passengerKey,
                    addonName: newBaggaeE.analytxName.trim(),
                    ssrCode: newBaggaeE.ssrCode,
                    category: newBaggaeE.ssrCode,
                    price: newBaggaeE.price,
                    name: newBaggaeE.analytxName,
                    journeyKey: trip.journeyKey,
                    multiplier: additionalBag,
                  },
                );
                const sellAddonItem = {
                  ssrKey: paxSsr.ssrKey,
                  count: additionalBag,
                  note: '',
                  passengerKey: paxSsr.passengerKey,
                  tripIndex: index,
                };
                sellAddonSsr.push(sellAddonItem);
              }
            });
          }
        });
      });
      dispatch({
        type: addonActions.UPDATE_ADDITIONAL_BAGGAGE_FORM_DATA,
        payload: {
          tripIndex: index,
          delayLostProtection,
          additionalBaggageData: newAdditionalBaggageData,
        },
      });
    });

    try {
      const ssrObjList = getSsrObj(
        sellAddonSsr,
        getAddonData,
        ssrType.journey,
        categoryCodes.abhf,
        ADD_ADDITIONAL_BAGS,
      );

      eventService.update(ssrObjList, []);
    } catch (e) {
      console.log(e);
    }
    return newSetGetSelectedAddon;
  };

  const getFlatMealFromContextMeals = (contextMeals) => {
    const meals = [];
    for (const tripkey in contextMeals) {
      for (const segKey in contextMeals[tripkey]) {
        for (const passengerKey in contextMeals[tripkey][segKey]) {
          for (const item in contextMeals[tripkey][segKey][passengerKey]) {
            const mealItem =
              contextMeals[tripkey][segKey][passengerKey][item];

            meals.push({
              ...mealItem.meal,
              tripkey,
              journeyKey: mealItem.journeyKey,
              segmentKey: segKey,
              passengerKey,
              ssrCode: mealItem.meal.ssrCode,
              ssrCategory: mealItem.ssrCategory,
              takenSsrKey: mealItem.passengerSSRKey.takenSsrKey,
            });
          }
        }
      }
    }

    return meals;
  };

  const meal6eDataHandler = () => {
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    const tmeals = getFlatMealFromContextMeals(takenMeals);
    let selectedSegmentKey = '';
    let selectedPassengerKey = '';
    let selectedMealArray = [];
    setIsMealSelected(true);

    selectedMeals.forEach((selectedMeal) => {
      if (selectedMeal) {
        selectedSegmentKey = Object.keys(selectedMeal)[0];
        selectedPassengerKey = Object.keys(selectedMeal[selectedSegmentKey])[0];
        selectedMealArray = JSON.parse(JSON.stringify(selectedMeal[selectedSegmentKey][selectedPassengerKey]));
      }
    });

    selectedTripArray.forEach((journey) => {
      const i = tripArray.indexOf(journey);

      journey.segments.forEach((segment, segmentIndex) => {
        selectedPassengerArray.forEach((passenger) => {
          selectedMealArray.forEach((mealObject) => {
            let meal = {};
            if (segment.segmentKey === selectedSegmentKey) {
              meal = JSON.parse(JSON.stringify(mealObject.meal));
            } else {
              const { ssrCode } = mealObject.meal;
              const segmentSsr = segment.segmentSSRs.filter((obj) => obj.category === categoryCodes.meal);
              const mealSsr = segmentSsr[0].ssrs.filter((obj) => obj.ssrCode === ssrCode) || [];
              if (mealSsr.length > 0) {
                meal = JSON.parse(JSON.stringify(mealSsr[0]));
                meal.category = JSON.parse(JSON.stringify(mealObject.meal.category));
                meal.filterFields = JSON.parse(JSON.stringify(mealObject.meal.filterFields));
                meal.image = JSON.parse(JSON.stringify(mealObject.meal.image));
                meal.isAdded = mealObject.meal.isAdded;
                meal.preference = mealObject.meal.preference;
              } else {
                meal = {};
              }
            }

            if ((meal.ssrCode) &&
               ((passenger.passengerKey !== selectedPassengerKey) || (segment.segmentKey !== selectedSegmentKey))) {
              const notATakenMeal = tmeals.find(
                (_tmeals) => _tmeals.ssrCode === meal.ssrCode &&
                _tmeals.journeyKey === journey.journeyKey &&
                _tmeals.segmentKey === segment.segmentKey &&
                _tmeals.passengerKey === passenger.passengerKey,
              );
              dispatch({
                type: addonActions.SET_SELECTED_MEALS_FROM_POPUP,
                payload: {
                  meal,
                  isTaken: !!notATakenMeal,
                  segmentIndex,
                  passengerIndex: passenger.paxIndex,
                  passengerSSRKey: meal.passengersSSRKey[passenger.paxIndex],
                  segmentKey: segment.segmentKey,
                  journeyKey: journey.journeyKey,
                  ssrCategory: meal.ssrCode,
                  bundleTotalPrice: meal.price || null,
                  tripIndex: (i + 1),
                },
              });
            }
          });

          if (!newSetGetSelectedAddon[i]) {
            newSetGetSelectedAddon[i].selectedAddone = [];
          }
          newSetGetSelectedAddon[i].selectedAddone.push(
            { passengerKey: passenger.passengerKey,
              addonName: _6E_EATS,
              ssrCode: selectedMealArray[0]?.meal.ssrCode,
            },
          );
        });
      });
    });

    return newSetGetSelectedAddon;
  };

  const fastForwardDataHandler = () => {
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    const newSetSellFastForward = JSON.parse(JSON.stringify(setSellFastForward));
    const newJourneyData = [...journeydetails];
    const newSellAddonSsr = JSON.parse(JSON.stringify(sellAddonSsr));
    let selectedTripIndex = 0;
    Object.keys(newSetGetSelectedAddon).forEach((index) => {
      if (newSetGetSelectedAddon[index]?.selectedAddone.length >= 1) {
        selectedTripIndex = index;
      }
    });
    selectedTripArray.forEach((trip) => {
      let currentIndex = 0;
      newJourneyData.forEach((tripData, index) => {
        if (trip.journeyKey === tripData.journeyKey) {
          currentIndex = index;
        }
      });

      const journeySSR = trip.journeySSRs.filter((obj) => obj.category === categoryCodes.ffwd);
      const ffwdSsr = journeySSR[0].ssrs.filter((obj) => obj.ssrCode === categoryCodes.ffwd);
      const passengersSSRKeyArray = ffwdSsr[0]?.passengersSSRKey || [];

      passengersSSRKeyArray.forEach((passenger) => {
        const setSellFFWDItem = {
          ssrKey: passenger?.ssrKey,
          count: 1,
          note: '',
          passengerKey: passenger?.passengerKey,
        };
        newSellAddonSsr.push({
          ssrKey: passenger?.ssrKey,
          count: 1,
          note: '',
          categoryName: FAST_FORWARD,
          ssrCategory: categoryCodes.ffwd,
        });
        if (!newSetSellFastForward[currentIndex]) {
          newSetSellFastForward[currentIndex] = [];
        }
        newSetSellFastForward[currentIndex].push(setSellFFWDItem);
      });

      newSetGetSelectedAddon[currentIndex].selectedAddone =
           JSON.parse(JSON.stringify(newSetGetSelectedAddon[selectedTripIndex]?.selectedAddone));
    });
    dispatch({
      type: addonActions.SET_SELL_FAST_FORWARD,
      payload: newSetSellFastForward,
    });
    try {
      const ssrObjList = getSsrObj(
        newSetSellFastForward,
        getAddonData,
        ssrType.journey,
        categoryCodes.ffwd,
        FAST_FORWARD,
      );
      eventService.update(ssrObjList, []);
    } catch (e) {
      console.log(e);
    }

    return newSetGetSelectedAddon;
  };

  const checkAvailabilityOfSegmentSsrCode = (segmentArray, ssrCodeArray) => {
    let isAnySsrCodeAvailable = false;
    ssrCodeArray.forEach((ssrCode) => {
      segmentArray.forEach((segmentData) => {
        segmentData.segmentSSRs.forEach((ssrDataArray) => {
          const newwSsrDataArray = ssrDataArray.ssrs.filter((obj) => obj.ssrCode === ssrCode);
          if (newwSsrDataArray.length > 0) {
            isAnySsrCodeAvailable = true;
          }
        });
      });
    });

    return isAnySsrCodeAvailable;
  };

  const checkAvailabilityOfBundleSsrCode = (journeyKey, ssrCode, segments) => {
    const bundleArray = getAddonData?.bundles;
    const segmentSsrCodeArray = [];
    let isAnySsrCodeAvailable = false;
    bundleArray.forEach((bundle) => {
      if (bundle.bundleCode === ssrCode) {
        const newPricesByJourney = bundle.pricesByJourney.filter((obj) => obj.journeyKey === journeyKey);
        if (newPricesByJourney.length > 0) {
          isAnySsrCodeAvailable = true;
        }
        if (isAnySsrCodeAvailable) {
          let selectedSegmentKey = '';
          let selectedPassengerKey = '';
          let selectedMealArray = [];
          selectedMeals.forEach((selectedMeal) => {
            if (selectedMeal) {
              selectedSegmentKey = Object.keys(selectedMeal)[0];
              selectedPassengerKey = Object.keys(selectedMeal[selectedSegmentKey])[0];
              selectedMealArray = JSON.parse(JSON.stringify(selectedMeal[selectedSegmentKey][selectedPassengerKey]));
            }
          });
          selectedMealArray.forEach((mealData) => {
            segmentSsrCodeArray.push(mealData.meal.ssrCode);
          });
          isAnySsrCodeAvailable = checkAvailabilityOfSegmentSsrCode(segments, segmentSsrCodeArray);
        }
      }
    });

    return isAnySsrCodeAvailable;
  };

  const seatAndEatDataHandler = (bundleCode) => {
    const newSetGetSelectedAddon = createCopyOfSelectedAddon();
    const newJourneyData = [...journeydetails];
    const newSelectedMeals = JSON.parse(JSON.stringify(selectedMeals));
    let selectedTripIndex = 0;
    setCurrentCatagoryCode(bundleCode);
    Object.keys(newSetGetSelectedAddon).forEach((sTindex) => {
      if (newSetGetSelectedAddon[sTindex]?.selectedAddone.length >= 1) {
        selectedTripIndex = sTindex;
      }
    });

    selectedTripArray.forEach((trip) => {
      if (checkAvailabilityOfBundleSsrCode(trip.journeyKey, bundleCode, trip.segments)) {
        const passengerKeys = [];
        let currentIndex = 0;
        newJourneyData.forEach((tripData, index) => {
          if (trip.journeyKey === tripData.journeyKey) {
            currentIndex = index;
            setCurrentTrip(trip);
          }
        });
        const sliderPaneConfigData = containerConfigData?.configJson?.data?.addonAdditionalByPath
          ?.item;
        const addonsContainer = mfData;
        setNewComibneAddons(getSSRData(
          getAddonData,
          addonsContainer,
          sliderPaneConfigData,
          currentIndex,
          getPassengerDetails,
        ));
        const segment = trip.segments[0];
        const segmentSsr = trip.segments[0].segmentSSRs.filter((obj) => obj.category === categoryCodes.meal);
        const mealSsrs = segmentSsr[0]?.ssrs || [];
        passengerArray.forEach((passenger) => {
          newSelectedMeals.forEach((selectedMeal) => {
            if (selectedMeal) {
              Object.keys(selectedMeal).forEach((key) => {
                Object.keys(selectedMeal[key]).forEach((paxKey) => {
                  mealSsrs.forEach((mealData) => {
                    if (mealData.ssrCode === selectedMeal[key][paxKey][0].meal.ssrCode) {
                      let ssrCode = mealData.ssrCode;
                      let bundleTotal = mealData.price;

                      if(bundleCode === categoryCodes.mlst){
                        ssrCode = categoryCodes.mlst;
                      }
                      else if(bundleCode === categoryCodes.prim){
                        ssrCode = categoryCodes.prim;
                      }

                      bundleTotal = getBundlePrice(trip.journeyKey, ssrCode);

                      dispatch({
                        type: addonActions.SET_SELECTED_MEALS_FROM_POPUP,
                        payload: {
                          meal: mealData,
                          isTaken: false,
                          segmentIndex: 0,
                          passengerIndex: passenger.paxIndex,
                          passengerSSRKey: mealData.passengersSSRKey[passenger.paxIndex],
                          segmentKey: segment.segmentKey,
                          journeyKey: trip.journeyKey,
                          ssrCategory: ssrCode,
                          bundleTotalPrice: bundleTotal || null,
                          tripIndex: currentIndex + 1,
                        },
                      });
                    }
                  });
                });
              });
            }
          });

          passengerKeys.push({ keys: passenger.passengerKey });
        });

        newSetGetSelectedAddon[currentIndex].selectedAddone =
           JSON.parse(JSON.stringify(newSetGetSelectedAddon[selectedTripIndex]?.selectedAddone));
        if (bundleCode === categoryCodes.mlst) {
          dispatch({
            type: addonActions.MLST_BUNDLE_FARE_SELECTED,
            payload: {
              isSelected: true,
              journeyKey: trip.journeyKey,
              bundleCode,
              passengerKeys,
              title: SEAT_AND_EAT,
              tripIndex: (currentIndex + 1),
            },
          });
        } else if (bundleCode === categoryCodes.prim) {
          dispatch({
            type: addonActions.PRIM_BUNDLE_FARE_SELECTED,
            payload: {
              isSelected: true,
              journeyKey: trip.journeyKey,
              bundleCode,
              passengerKeys,
              title: _6E_PRIME,
              tripIndex: (currentIndex + 1),
            },
          });
        }
      }
    });

    return newSetGetSelectedAddon;
  };

  const addbuttonHandler = () => {
    if ((selectedTripArray.length === 0 || (!hidePassenger && selectedPassengerArray.length === 0))
       || isUnderProgress) {
      return;
    }
    setIsUnderProgress(true);
    let bundleCodeExecuted = false;
    let primeBundleCodeExecuted = false;
    const newSetGetSelectedAddonArray = [];
    selectedAddonList.forEach((addon) => {
      if (addon.addonName === ONE_FOR_THE_SKIES) {
        newSetGetSelectedAddonArray.push(barDataHandler());
      }
      if (addon.addonName === SLEEP_ESSENTIALS) {
        newSetGetSelectedAddonArray.push(sleepEssentialDataHandler());
      }

      if (addon.addonName === ADD_SPORTS_EQUIPMENT) {
        newSetGetSelectedAddonArray.push(sportsEquipmentDataHandler());
      }

      if (addon.addonName === BAGGAGE) {
        newSetGetSelectedAddonArray.push(baggageDataHandler());
      }

      if (addon.addonName === ADD_ADDITIONAL_BAGS) {
        newSetGetSelectedAddonArray.push(addAdditionalBagsDataHandler());
      }

      if (addon.addonName === _6E_EATS) {
        newSetGetSelectedAddonArray.push(meal6eDataHandler());
      }

      if (addon.addonName === FAST_FORWARD) {
        newSetGetSelectedAddonArray.push(fastForwardDataHandler());
      }

      if (addon.addonName === SEAT_AND_EAT && !bundleCodeExecuted) {
        bundleCodeExecuted = true;
        newSetGetSelectedAddonArray.push(seatAndEatDataHandler(categoryCodes.mlst));
      }

      if (addon.addonName === _6E_PRIME && !primeBundleCodeExecuted) {
        primeBundleCodeExecuted = true;
        newSetGetSelectedAddonArray.push(seatAndEatDataHandler(categoryCodes.prim));
      }
    });

    newSetGetSelectedAddonArray.forEach((data) => {
      Object.keys(data).forEach((key) => {
        data[key].selectedAddone.forEach((addonData) => {
          let isAlreadyAdded = false;
          _newSetGetSelectedAddon[key].selectedAddone.forEach((existingAddon) => {
            if (addonData.passengerKey === existingAddon.passengerKey
              && addonData.addonName === existingAddon.addonName) {
              isAlreadyAdded = true;
            }
          });
          if (!isAlreadyAdded) {
            _newSetGetSelectedAddon[key].selectedAddone.push(JSON.parse(JSON.stringify(addonData)));
          }
        });
      });
    });

    dispatch({
      type: addonActions.SET_GET_SELECTED_ADDON,
      payload: _newSetGetSelectedAddon,
    });

    dispatch({
      type: addonActions.SET_SELL_ADDON_SSR,
      payload: sellAddonSsr,
    });
    setClosePopup(true);
  };
  return (
    <div className="addon-select-popup">
      <div className="addon-select-popup__container">
        <div className="addon-select-popup__content">
          <div className="addon-select-popup__content__title">
            {additionalData?.replicateAddonsPopup?.replicateForReturnJourney
            || 'Replicate same Add ons for your return flight'}
          </div>
          <div className="addon-select-popup__content__main">
            <div className="addon-select-popup__content__trip">
              <div className="addon-select-popup__content__trip__title sh-8">
                {additionalData?.replicateAddonsPopup?.tripsLabel || 'Trips' }
              </div>
              <div className="addon-select-popup__content__trip__checkbox">
                {tripArray && tripArray.length > 1 && (
                <div className="checkbox">
                  <CheckBoxV2
                    name={uniq()}
                    id={uniq()}
                    checked={selectedTripArray.length > 0 && selectedTripArray.length === tripArray.length}
                    onChangeHandler={() => onChangeTripHandler('All')}
                    description={additionalData?.replicateAddonsPopup?.allLabel || 'All'}
                    containerClass="gap-6 addon-select-popup-checkbox"
                    key={uniq()}
                  />
                </div>
                )}
                {tripArray.map((item) => {
                  return (
                    <div className="checkbox">
                      <CheckBoxV2
                        name={uniq()}
                        id={uniq()}
                        checked={selectedTripArray.indexOf(item) > -1}
                        onChangeHandler={() => onChangeTripHandler(item)}
                        description={`${item.journeydetail?.origin}-${item.journeydetail?.destination}`}
                        containerClass="gap-6 addon-select-popup-checkbox"
                        key={uniq()}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {!hidePassenger && (
            <div className="addon-select-popup__content__passengers">
              <div className="addon-select-popup__content__passengers__title sh-8">
                {additionalData?.replicateAddonsPopup?.passengersLabel || 'Passengers' }
              </div>
              <div className="addon-select-popup__content__passengers__checkbox">
                {passengerArray && passengerArray.length > 1 && (
                <div className="checkbox">
                  <CheckBoxV2
                    name={uniq()}
                    id={uniq()}
                    checked={selectedPassengerArray.length > 0 && selectedPassengerArray.length === passengerArray.length}
                    onChangeHandler={() => onChangePassengerHandler('All')}
                    description={additionalData?.replicateAddonsPopup?.allLabel || 'All'}
                    containerClass="gap-6 addon-select-popup-checkbox"
                    key={uniq()}
                  />
                </div>
                )}
                {passengerArray.map((item) => {
                  return (
                    <div className="checkbox">
                      <CheckBoxV2
                        name={uniq()}
                        id={uniq()}
                        checked={selectedPassengerArray.indexOf(item) > -1}
                        onChangeHandler={() => onChangePassengerHandler(item)}
                        description={`${item.name?.first} ${item.name?.last}`}
                        containerClass="gap-6 addon-select-popup-checkbox"
                        key={uniq()}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            )}
          </div>
          <div className="addon-select-popup__content__button">
            <Button
              onClick={onSkip}
              className="skyplus-button--small skyplus-button--outline skyplus-button--outline-primary"
              type="button"
            >
              {additionalData?.replicateAddonsPopup?.secondaryCtaLabel || 'Skip' }

            </Button>
            <Button
              onClick={addbuttonHandler}
              type="button"
              className={`skyplus-button--small 
              skyplus-button--filled skyplus-button--filled-primary 
              ${(selectedTripArray.length === 0 || (!hidePassenger && selectedPassengerArray.length === 0) || isUnderProgress) ?
                'skyplus-button--disabled' : ''}`}
            >
              {additionalData?.replicateAddonsPopup?.ctaLabel || 'Add' }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

AddonSelectPopup.propTypes = {
  onAdd: PropTypes.func,
  onSkip: PropTypes.func,
  journeydetails: PropTypes.array,
  passengerDetails: PropTypes.array,
};

export default AddonSelectPopup;
