/* eslint-disable */
// import PropTypes from 'prop-types'
import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import TooltipPopover from 'skyplus-design-system-app/dist/des-system/TooltipPopover';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import {
  useCustomEventDispatcher,
  useCustomEventListener,
} from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import Shimmer from '../Shimmer';
import FareSummaryDetails from '../FareSummaryDetails';
import SwipeHandle from '../SwipeUpHandle';
import {
  getFareSummaryApiData,
  getFeeCodeMapping,
  getAEMData,
  getSsrCodeMapping,
} from '../../services';
import { useFareSummaryContext } from '../../store/fare-summary-context';
import { EVENTS, CONSTANTS, BROWSER_STORAGE_KEYS } from '../../constants';
import './FareSummary.scss';
import analyticEvents from '../../utils/analyticEvents';
import { deepCloneCustom } from '../../utils';
const journeyLevelSSRList = ['PROT', 'LBG', 'IFNR'];
const STEPLIST = {
  PE: 'pe',
  ADDON: 'add on',
  SEAT: 'seat-selection',
  PAYMENT: 'payment',
};

const getBookingContext = () => {
  const bookingctxVal = localStorage.getItem('bw_cntxt_val');
  try {
    const parsed = JSON.parse(bookingctxVal);
    return parsed || {};
  } catch (error) {
    return {};
  }
};

const FareSummary = () => {
  const {
    fareSummaryData,
    aemData,
    updateFareSummaryData,
    updateFeeCodeMapping,
    updateAEMData,
    updateSsrCodeMapping,
    ssrCodeMapping,
    updatePageType,  
  } = useFareSummaryContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [isEventDisable, setIsEventDisable] = useState(false);
  const [totalAmountFormatted, setTotalAmountFormatted] = useState(0);
  const [totalSlashedAmountFormatted, settotalSlashedAmountFormatted] =
    useState(0);
  const dispatchCustomEvent = useCustomEventDispatcher();
  const dispatchCustomEventUpdated = useCustomEventDispatcher();
  const [addonTotalAmount, setaddonTotalAmount] = useState(0);
  const [seatSelectTotalAmount, setSeatSelectTotalAmount] = useState(0);
  const [seatMapDataFromEvent, setSeatMapFromEvent] = useState({ data: {} });
  const [addonDataList, setAddOnDataList] = useState({}); // stores against journeykey ex: {"dfass":[{}]}
  const [seatList, setSeatList] = useState({}); // stores against journeykey ex: {"dfass":[{}]}
  const seatSSRIdentifier = ['SEAT', 'SEAT2', 'SATR', 'STBG', 'STWB', 'SNXT'];
  const currencyCode = fareSummaryData?.bookingDetails?.currencyCode;
  const [activeStep, setActiveStep] = useState(STEPLIST.PE);
  const [isNewPaymentBtnEnabled, setIsNewPaymentBtnEnabled] = useState(false);
  const [isNewButtonClicked, setIsNewButtonClicked] = useState(false);
  const [isSeatEventReceived, setIsSeatEventReceived] = useState(false);
  const [isEarnFlow, setIsEarnFlow] = useState(false);
  const [isBurnFlow, setIsBurnFlow] = useState(false);
  const [totalEarnPoints, setTotalEarnPoints] = useState(0);
  const [clickedButton, setClickedButton] = useState('');
  const [isModifyFlow, setIsModifyFlow] = useState({
    flowType: '',
    enable: false,
  });
  const [isCheckInFlow, setIsCheckInFlow] = useState({
    flowType: '',
    enable: false,
  });
  const [customMfToOpen, setCustomMfToOpen] = useState("");
  const aemMissOutFreeMealMsg = aemData?.missOutFreeMealMessage;
  const [eventBasedData,setEventBasedData] = useState({});

  const priceJourneywise =
    fareSummaryData?.priceBreakdown?.journeywiseList || [];

  const getPageTypeData = () => {
    try {
      const parsedPageTypeData = document
        .querySelector("div[data-component='mf-fare-summary-v2']")
        ?.getAttribute('data-page-type');
      if (!parsedPageTypeData) {
        console.error('data-page-type attribute not found');
        return { pageType: '', checkinPagetype: '' };
      }
      const pageType = [
        CONSTANTS.SEAT_SELECTION_MODIFY_PAGE_TYPE,
        CONSTANTS.SEAT_SELECTION_ADDON_CHECKIN,
        CONSTANTS.ADDON_SEAT_SELECTION_MODIFICATION,
      ].includes(parsedPageTypeData)
        ? parsedPageTypeData
        : '';
      const checkinPagetype = [
        CONSTANTS.SEAT_SELECTION_ADDON_CHECKIN,
        CONSTANTS.ADDON_CHECKIN,
      ].includes(parsedPageTypeData)
        ? parsedPageTypeData
        : '';
      return { pageType, checkinPagetype };
    } catch (e) {
      console.error('Error fetching data-page-type:', e);
      return { pageType: '', checkinPagetype: '' };
    }
  };

  const converSSRCodeObj = {};
  ssrCodeMapping?.forEach((itm) => {
    converSSRCodeObj[itm.ssrCode] = itm.name;
  });

  useEffect(() => {
    const { pageType, checkinPagetype } = getPageTypeData();
    if (pageType) {
      const type = {
        flowType: pageType,
        enable: true,
      };
      setIsModifyFlow({
        flowType: pageType,
        enable: true,
      });
      updatePageType(type);
    }

    if (checkinPagetype) {
       const type = {
         flowType: checkinPagetype,
         enable: true,
       };
      setIsCheckInFlow({
        flowType: checkinPagetype,
        enable: true,
      });
      updatePageType(type);
    }
  }, []);

  const [totalAmount, setTotalAmount] = useState('');
  const [showNegativeAmountToast, setShowNegativeAmountToast] = useState(false);
  const [isUmnr, setIsUmnr] = useState(false);

  // RNAS are the product class i.e only for saver fare type
  const showXlSeatFreeMealToSaverOnly = fareSummaryData?.journeysDetail?.every(item => CONSTANTS?.EXPRESS_CHECKOUT_FARE_TYPES.includes(item.productClass));

  const fareSummaryRef = useRef(null);
  // const addedToFareRef = useRef(null);

  const addonEventDataRef = useRef([]);

  const mountPhaseRef = useRef(false);
  const addonModificationEventHandlerRef = useRef();

  const fixFareSummaryAtBottom = () => {
    const elemHeight = fareSummaryRef.current.getBoundingClientRect().height;
    document.body.style.marginBottom = `${elemHeight}px`;
  };

  const [footerHeight, setFooterHeight] = useState(0);
  useEffect(() => {
    if (!fareSummaryRef?.current) {
      return;
    }

    // Create a ResizeObserver to monitor the footer's height
    const resizeObserver = new ResizeObserver(() => {
      const height = fareSummaryRef?.current?.clientHeight;
      setFooterHeight(height); // Update the state with the new height
    });
    // Start observing the footer element
    resizeObserver.observe(fareSummaryRef?.current);

    return () => {
      // Cleanup: Stop observing when the component unmounts
      resizeObserver.disconnect();
    };
  }, [fareSummaryRef]);

  useEffect(() => {
    if (footerHeight) {
      let domEvent = new CustomEvent(EVENTS.TRACK_DOM_CHANGE, {
        bubbles: true,
        detail: { footerHeight: footerHeight },
      });
      document.dispatchEvent(domEvent);
    }
  }, [footerHeight]);

  let expressCheckoutflag = fareSummaryData?.journeysDetail?.some((obj) =>
    CONSTANTS?.EXPRESS_CHECKOUT_FARE_TYPES?.includes(
      obj[CONSTANTS?.PRODUCT_CLASS_PROP_NAME],
    ),
  );

  /*
  const handleAddedToFare = (data) => {
    const numItems = addedToFareRef?.current?.querySelector('.num-of-items');
    const addedAmount = addedToFareRef?.current?.querySelector('.added-info__amount');
    if (numItems) {
      numItems.textContent = data?.numberOfItemsText;
    }
    if (addedAmount) {
      addedAmount.textContent = data?.addedAmount;
    }
    addedToFareRef?.current?.classList.add('added-to-fare--show');
    setTimeout(() => {
      addedToFareRef?.current?.classList.remove('added-to-fare--show');
    }, 6000);
  };
  */
  const handleDataEvent = (data) => {
    setIsEventLoading(data.isLoading);
    setIsEventDisable(data.isDisable);
  };

  const handleFareEventDataSplitUp= (details) => {
    setEventBasedData({ point: details?.point, amount: details?.amount, tax: details?.tax});
  }

  const [showHoverTooltip, setShowHoverTooltip] = useState(false);

  // useCustomEventListener(EVENTS.ADDED_TO_FARE, handleAddedToFare);
  useCustomEventListener(
    EVENTS.EVENT_FARE_SUMMARY_DATA_TRANSFER,
    handleDataEvent,
  );
  useCustomEventListener(
    EVENTS.EVENT_FARE_SUMMARY_FARE_SPLIT,
    handleFareEventDataSplitUp,
  );

  const constructAddonObjFromEventForModification = (event) => {
    if (window.pageType === CONSTANTS.PASSENGER_PAGETYPE) {
      return;
    }
    const dataFromEvent = event?.detail;
    setSeatSelectTotalAmount(0);
    let totalAmount = fareSummaryData?.priceBreakdown?.totalAmount || 0;
    if (window.pageType === CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN) {
      totalAmount = fareSummaryData?.priceBreakdown?.balanceDue || 0;
    }
    const arrayofddons = dataFromEvent?.data || [];
    arrayofddons.forEach((addon) => {
      const { journeyKey, passengerKey, action, segmentKey, ssrCode } = addon;
      if (action === 'remove') {
        const removeAddonIndex = addonEventDataRef.current.findIndex((item) => {
          return (
            item.journeyKey === journeyKey &&
            item.passengerKey === passengerKey &&
            item.ssrCode === ssrCode &&
            item.segmentKey === segmentKey
          );
        });
        if (removeAddonIndex >= -1) {
          addonEventDataRef.current.splice(removeAddonIndex, 1);
        }
      }

      if (action === 'add') {
        const removeAddonIndex = addonEventDataRef.current.findIndex((item) => {
          return (
            item.journeyKey === journeyKey &&
            item.passengerKey === passengerKey &&
            item.ssrCode === ssrCode &&
            item.segmentKey === segmentKey
          );
        });

        if (removeAddonIndex === -1) {
          addonEventDataRef.current.push(addon);
        } else {
          addonEventDataRef.current[removeAddonIndex] = {
            ...addonEventDataRef.current[removeAddonIndex],
            ...addon,
          };
        }
      }
    });
    let totalEarnPointTemp = fareSummaryData?.priceBreakdown?.totalPotentialPoints;
    let addonObj = deepCloneCustom(addonDataList);  // Deep clone to avoid reference issues
    // Remove meal voucher from addonObj when mealvocher come from event - START
    Object.keys(addonObj).forEach((key) => {
      const addonForThisJourney = addonObj[key]?.uiData;
      const addonForThisJourneyFromEvent = dataFromEvent?.data?.filter(
        (value) => value.journeyKey === key
      ) || [];
      const isMealVocherPresent = addonForThisJourneyFromEvent?.some(i=>i.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE);
      // Check if uiData exists for the current addon
      if (addonForThisJourney && isMealVocherPresent) {
        const index = addonForThisJourney.findIndex((item) => item.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE);
        // If item with the specific ssrCode is found, remove it
        if (index !== -1) {
          let removedData = addonForThisJourney.filter(item => ![CONSTANTS.MEAL_VOUCHER_SSRCODE,CONSTANTS.LoyaltyV].includes(item.ssrCode));
          // Deep clone the current addonObj[key] and update the uiData
          addonObj[key] = {
            ...addonObj[key],  // Spread existing properties to keep other data
            uiData: deepCloneCustom(removedData)  // Ensure uiData is deeply cloned
          };
        }
      } else {
        console.log(`No uiData found for key: ${key}`);
      }
    });
    // Remove meal voucher from addonObj when mealvocher come from event - END

    fareSummaryData?.journeysDetail?.forEach((jItem) => {
      if (!addonObj[jItem.journeyKey]) {
        addonObj[jItem.journeyKey] = { uiData: [], totalAddonJourneyAmount: 0 };
      }
      const addonForThisJourney = dataFromEvent?.data?.filter(
        (value) => value.journeyKey === jItem.journeyKey
      ) || [];
      
      // befor push we remove all the loyalty saving from the array
      // vocher details will be send fresh everytime, eventhough its not modified
      // addonObj[jItem.journeyKey].uiData = addonObj[jItem.journeyKey].uiData.filter((item) => item.ssrCode !== CONSTANTS.LoyaltyV);
      // now we push the loyalty saving
      addonForThisJourney?.forEach((aJItem) => {
        if (aJItem.price) {
          const itemTotal = Number(aJItem.price) * Number(aJItem.multiplier);
          totalAmount += aJItem.action === 'remove' ? -itemTotal : itemTotal;
        }
        if (aJItem.earnPoints) totalEarnPointTemp += Number(aJItem.earnPoints);
        const ssrFoundInArray = addonObj[jItem.journeyKey]?.uiData.findIndex(
          (i) => i.ssrCode === aJItem?.ssrCode && i.value === aJItem.price
        );
        if (ssrFoundInArray >= 0 && aJItem?.multiplier) {
          addonObj[jItem.journeyKey].uiData[ssrFoundInArray].multiplier +=
            Number(aJItem?.multiplier);
        } else {
          let isThisAddonPresentInOtherJourney = false;
          if (journeyLevelSSRList.includes(aJItem?.ssrCode)) {
            const currentJourneyIndexInEvent = Object.keys(
              addonForThisJourney
            ).findIndex((key) => key === jItem.journeyKey);
            Object.values(addonForThisJourney).forEach((item, index) => {
              if (index !== currentJourneyIndexInEvent) {
                item?.data?.forEach((adItem) => {
                  if (adItem?.ssrCode === aJItem) {
                    isThisAddonPresentInOtherJourney = true;
                  }
                });
              }
            });
          }
          if (isThisAddonPresentInOtherJourney) {
            totalAmount -= aJItem.price;
            return;
          }
          if(aJItem?.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE){
            totalAmount -= aJItem.price;
          }else if (aJItem?.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE) {
              totalAmount -= aJItem.price;
            }
          const discount =
            aJItem?.originalPrice && aJItem.price
              ? Number(aJItem?.originalPrice) - Number(aJItem.price)
              : 0;
          const multiplier = Number(aJItem?.multiplier ?? 1);
          const objD = {
            ssrCode: aJItem?.ssrCode,
            multiplier: multiplier,
            value: aJItem.price,
            name: aJItem.name,
            categoryName: aJItem.addonName,
            discountPercentage: aJItem.discountPercentage,
            Discount: discount,
            action: aJItem.action,
          };

          addonObj[jItem.journeyKey].uiData.push(objD);
          if(aJItem?.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE){
            addonObj[jItem.journeyKey].uiData.push({
              ssrCode: CONSTANTS.LoyaltyV,
              multiplier: multiplier,
              value: aJItem.price,
              name: aemData?.loyaltySaving,
              categoryName: aJItem.addonName,
              discountPercentage: 0,
              Discount: 0,
              action: aJItem.action,
            });
          }
        }
      });
    });

    let addonlisttemp = {...addonObj};
    let totalAddonamountFromApi = 0;
    let totalAddonamountFromEvent = 0;
    fareSummaryData?.journeysDetail?.forEach((jItem) => {
      const jKey = jItem.journeyKey;
      const dataManuEv = addonObj[jKey].uiData || [];
      console.log("--dataManuEv", dataManuEv);
      if (!addonlisttemp[jKey]) {
        addonlisttemp[jKey] = { uiData: [] };
      }
      dataManuEv.forEach((mI) => {
        if (mI?.action === 'remove') {
          let tempDaata = [];
          addonObj[jKey]?.uiData?.forEach((it) => {
            let rere = {...it};
            if (rere?.ssrCode === mI?.ssrCode && rere?.multiplier > 0) {
              rere.multiplier -= 1;
            }
            if (rere?.multiplier > 0) {
              tempDaata.push(rere);
            }
          });
          addonlisttemp[jKey].uiData = tempDaata;
        }
        // else {
        //   console.log("-----removed:::::",mI)
        //   if (addonlisttemp[jKey]?.uiData) {
        //     addonlisttemp[jKey].uiData.push(mI);
        //   } else {
        //     addonlisttemp[jKey] = {
        //       uiData: [mI],
        //     };
        //   }
        // }
      });
      let totalAmountByJourney = 0;
      addonlisttemp[jItem.journeyKey]?.uiData?.forEach((addonItem) => {
        let multiplier =  Number(addonItem?.multiplier ?? 0);;
        let _amountTemp = addonItem?.value;
        if(addonItem.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE){
          _amountTemp = -addonItem.value;
        }else if (addonItem.ssrCode === CONSTANTS.LoyaltyV) {
            _amountTemp = -(Math.abs(addonItem.value));
            multiplier = 1;
          } else  if (addonItem.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE) {
            _amountTemp = 0;
          }
        totalAmountByJourney += Number(_amountTemp) * multiplier;
      });
      totalAddonamountFromEvent += totalAmountByJourney;
       const currentJourneyPriceObj = priceJourneywise?.find(
        (pJItem) => pJItem?.journeyKey === jItem.journeyKey,
      );
      let currentJourneySSRAmount = currentJourneyPriceObj?.totalSSRPrice || 0;
      totalAmountByJourney -= currentJourneySSRAmount;
      if (addonlisttemp[jItem.journeyKey]) {
        if (addonlisttemp[jItem.journeyKey]?.totalAddonJourneyAmount) {
          addonlisttemp[jItem.journeyKey].totalAddonJourneyAmount =
            totalAmountByJourney;
        } else {
          addonlisttemp[jItem.journeyKey]['totalAddonJourneyAmount'] =
            totalAmountByJourney;
        }
      }
    });
    const _totalAmount = addonEventDataRef.current.reduce((acc, item) => {
      let _amount = item.price;
      if (item.hasOwnProperty('actualPrice')) {
        _amount = item.actualPrice;
      }

      if (item.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE) {
        _amount = -item.price;
      }else if (item.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE) {
        _amount = -item.price;
      }
      return acc + _amount;
    }, 0);
    let totalSendAmount = fareSummaryData?.priceBreakdown?.totalAmount || 0;
    if (window.pageType === CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN) {
      totalSendAmount = fareSummaryData?.priceBreakdown?.balanceDue || 0;
    }
    // totalSendAmount += _totalAmount;
    window.temp = fareSummaryData;
   
    let totalDiscount = 0;
    fareSummaryData?.priceBreakdown?.journeywiseList?.forEach((jItem) => {
      totalAddonamountFromApi += jItem.totalSSRPrice;
      totalDiscount += Number(jItem?.totalDiscount);
    });
    const totalSlashedAmountFormattedTemp =
      totalDiscount > 0 &&
      formatCurrency(totalSendAmount + totalDiscount, currencyCode, {
        minimumFractionDigits: 0,
      });
    totalSendAmount = totalSendAmount - totalAddonamountFromApi + totalAddonamountFromEvent;
    const totalAmountFormattedTemp =
    totalSendAmount &&
    formatCurrency(totalSendAmount, currencyCode, {
      minimumFractionDigits: 0,
    });

    setAddOnDataList(addonlisttemp);
    setTotalAmount(totalSendAmount);
    setTotalAmountFormatted(totalAmountFormattedTemp);
    settotalSlashedAmountFormatted(totalSlashedAmountFormattedTemp);
  };
  addonModificationEventHandlerRef.current = constructAddonObjFromEventForModification;
  const constructAddonObjFromEventData = (event) => {
    if(window.pageType !== CONSTANTS.PASSENGER_PAGETYPE){
      return;
    }
    console.log("--event data::::",event.detail)
    const dataFromEvent = event?.detail || {};
    const addonObj = {};
    let totalAmount = 0;
    let totalEarnPointTemp =
      fareSummaryData?.priceBreakdown?.totalPotentialPoints;
    fareSummaryData?.journeysDetail?.forEach((jItem, jIndex) => {
      if (!addonObj[jItem.journeyKey]) {
        addonObj[jItem.journeyKey] = { uiData: [], totalAddonJourneyAmount: 0 };
      }
      const addonForThisJourneyTemp = dataFromEvent[jItem.journeyKey]?.data || [];      
        let addonForThisJourney = [];
      addonForThisJourneyTemp.forEach((item)=>{
        if(item.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE){
          const isFoundIndex = addonForThisJourney.findIndex(
            (i) => i.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE ,
          );
          
          if (isFoundIndex != -1) {
            addonForThisJourney[isFoundIndex].multiplier += Number(
              item.multiplier || 1
            );
            addonForThisJourney[isFoundIndex].price += Number(item.price)
          }else{
            addonForThisJourney.push({...item});
          }
        }else {
          addonForThisJourney.push({...item});
        }
      });

      const currentJourneyPriceObj = priceJourneywise?.find(
        (pJItem) => pJItem?.journeyKey === jItem.journeyKey,
      );
      let currentJourneySSRAmount = currentJourneyPriceObj?.totalSSRPrice || 0;
      let primessramout = 0
      currentJourneyPriceObj?.ssrAmountList?.forEach(i => {
        if (i.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE) {
          primessramout -= (i.value * i.multiplier);
        } else if (i.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE) {
          primessramout -= i.value * 1;
        } else {
          primessramout += i.value * i.multiplier;
        }
      });
      console.log("--stage2::::",primessramout,currentJourneySSRAmount)
      currentJourneySSRAmount = primessramout;
      // if (currentJourneyPriceObj?.totalSSRPrice) {
      //   currentJourneySSRAmount = (customMfToOpen === "addon" || customMfToOpen === "" ) ?  0 :currentJourneyPriceObj?.totalSSRPrice;
      // }

      addonForThisJourney?.forEach((aJItem) => {
        if (aJItem.price){
          if (aJItem?.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE) {
            let amountPr =
              aJItem?.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE
                ? -aJItem?.price
                : aJItem.price;
            totalAmount += Number(amountPr) * Number(aJItem?.multiplier);
          } else if (aJItem?.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE) {
            let amountPr = aJItem?.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE
                ? -aJItem?.price
                : aJItem.price;
            totalAmount += Number(amountPr) * Number(1);
          } else {
            totalAmount += Number(aJItem?.price) * Number(aJItem?.multiplier);
          }
        }
        if (aJItem.earnPoints) totalEarnPointTemp += Number(aJItem.earnPoints);
        const ssrFoundInArray = addonObj[jItem.journeyKey]?.uiData.findIndex(
          (i) => i.ssrCode === aJItem?.ssrCode && i.value === aJItem.price,
        );
        if (ssrFoundInArray >= 0 && aJItem?.multiplier) {
          addonObj[jItem.journeyKey].uiData[ssrFoundInArray].multiplier +=
            Number(aJItem?.multiplier);
        } else {
          let isThisAddonPresentInOtherJourney = false;
          if (journeyLevelSSRList.includes(aJItem?.ssrCode)) {
            const currentJourneyIndexInEvent = Object.keys(
              dataFromEvent,
            ).findIndex((key) => key === jItem.journeyKey);
            Object.values(dataFromEvent).forEach((item, index) => {
              if (index !== currentJourneyIndexInEvent) {
                item?.data?.forEach((adItem) => {
                  if (adItem?.ssrCode === aJItem) {
                    isThisAddonPresentInOtherJourney = true;
                  }
                });
              }
            });
          }
          if (isThisAddonPresentInOtherJourney) {
            // if (jIndex > 0 && (aJItem?.ssrCode === 'PROT' || aJItem?.ssrCode === 'LBG' || aJItem?.ssrCode === 'IFNR')) {
            totalAmount -= aJItem.price;
            return;
          }
          const discount =
            aJItem?.originalPrice && aJItem.price
              ? Number(aJItem?.originalPrice) - Number(aJItem.price)
              : 0;
          const multiplier = Number(aJItem?.multiplier ?? 1);
          addonObj[jItem.journeyKey].uiData.push({
            ssrCode: aJItem?.ssrCode,
            multiplier: multiplier,
            value: aJItem.price,
            name: aJItem.name,
            categoryName: aJItem.addonName,
            discountPercentage: aJItem.discountPercentage,
            Discount: discount,
          });
          if(aJItem?.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE){
            addonObj[jItem.journeyKey].uiData.push({
              ssrCode: CONSTANTS.LoyaltyV,
              multiplier: 1,
              value: aJItem.price,
              name: aemData?.loyaltySaving,
              categoryName: aJItem.addonName,
              discountPercentage: 0,
              Discount: 0,
            });
          }
        }
      });
      totalAmount -= currentJourneySSRAmount;
      // since we are calculating the totalssr amount from event, we have to minus the ssramount
      // in the total which is coming from API
      let totalAmountByJourney = 0;
      addonObj[jItem.journeyKey]?.uiData?.forEach((addonItem) => {
        if(addonItem?.ssrCode == CONSTANTS.LoyaltyV)
        {
            return
        }
        const multiplier = addonItem.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE ? 1 : Number(addonItem?.multiplier ?? 1)
        let _amountTemp = addonItem?.value;
        if(addonItem.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE){
          _amountTemp = -addonItem.value;
        }else if (addonItem.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE) {
           _amountTemp = -addonItem.value;
         }
         
        totalAmountByJourney += Number(_amountTemp) * multiplier;
      });

      addonObj[jItem.journeyKey].totalAddonJourneyAmount =
        totalAmountByJourney - currentJourneySSRAmount;
    });
    setAddOnDataList(addonObj);
    setTotalEarnPoints(totalEarnPointTemp);
    if (window.pageType !== CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN) {
      setaddonTotalAmount(totalAmount);
    }
  };
  // eslint-disable-next-line no-unused-vars
  const constructAddonObjFromAPIData = (isRemoveSeatFromAPIResponse) => {
    const addOnObj = {};

    priceJourneywise?.forEach((jItemPrice) => {
      const ssrListperJourney = jItemPrice?.ssrAmountList || [];
      const opSsr = [];
      if (!addOnObj[jItemPrice.journeyKey]) {
        addOnObj[jItemPrice.journeyKey] = { uiData: [] };
      }
      ssrListperJourney?.forEach((ssItem) => {
        if (
          isRemoveSeatFromAPIResponse &&
          seatSSRIdentifier.includes(ssItem.ssrCode)
        )
          return;
        opSsr.push({
          ssrCode: ssItem.ssrCode,
          name: ssItem.ssrName,
          multiplier: ssItem?.multiplier,
          value: ssItem?.value,
        });
      });
      addOnObj[jItemPrice.journeyKey].uiData = [...opSsr];
    });
    setAddOnDataList(addOnObj);
    return addOnObj;
  };
  const createSeatListFromEvent = (event) => {
    if (window.pageType !== CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN) {
      setaddonTotalAmount(0);
    }

    addonEventDataRef.current = [];

    constructAddonObjFromAPIData(true);
    // whenever seatlist driven from event then we have to handle the removal of seat from ssrlist
    let totalEarnPointTemp =
      fareSummaryData?.priceBreakdown?.totalPotentialPoints;
    let dataFromEvent = event?.detail?.selectedSeatListByJourney || null;
    if (!dataFromEvent) {
      dataFromEvent = event?.detail || {};
    }
    const seatObj = {};
    let totalAmount = 0;
  const allSeats = Object.values(dataFromEvent || {}).flatMap(entry => entry?.seats ?? []);
  const selectedSegmentKey = Object.values(dataFromEvent)?.[0]?.segmentKey ?? null;
  const selectedSegmentCpmlMeals = Object.values(dataFromEvent)?.map(segment => segment?.[selectedSegmentKey]).find(obj => obj !== undefined).cpmlSeats || {};

  const selectedSegmentSeat = Object.values(dataFromEvent)
    .find(obj => obj?.hasOwnProperty(selectedSegmentKey))?.[selectedSegmentKey]?.selectedSeat ?? null;

    const hasXlSeatFreemeal = allSeats.map((item)=> item?.unitDesignator);
    const selectedSeatdesignator = Object.values(dataFromEvent).flatMap(entry => entry?.selectedSeatdesignator);
    Object.keys(dataFromEvent).forEach((kItem) => {
      seatObj[kItem] = {
        uiData: [],
        priceList: [],
        totalseatJourneyAmount: 0,
      };
      const apiJourneyPrice = fareSummaryData?.priceBreakdown?.journeywiseList;
      const currentJourneyPriceList = apiJourneyPrice?.find(
        (jItem) => jItem.journeyKey === kItem,
      );
      const ssrListForThisJourney =
        currentJourneyPriceList?.ssrAmountList || [];
      const taxListForThisJourney =
        currentJourneyPriceList?.taxAmountList || [];
      const seatSSRList = ssrListForThisJourney.filter((ssrItem) =>
        seatSSRIdentifier.includes(ssrItem.ssrCode),
      );
      const seatSSRListFromTax = taxListForThisJourney.filter((ssrItem) =>
        seatSSRIdentifier.includes(ssrItem.feeCode),
      );
      let totalSeatSSRAmountForThisJourney = 0;
      seatSSRList?.forEach((amI) => {
        totalSeatSSRAmountForThisJourney += amI.multiplier * amI.value;
      });
      seatSSRListFromTax?.forEach((amI) => {
        totalSeatSSRAmountForThisJourney += amI.multiplier || 1 * amI.value;
      });

      const valObj = dataFromEvent[kItem] || {};
      if (valObj?.seats?.length > 0) {
        valObj?.seats.forEach((item) => {
          seatObj[kItem].uiData.push(`${item.unitDesignator}-${item.type}`);
          try {
            if (item.price) totalAmount += Number(item.price);
            seatObj[kItem].totalseatJourneyAmount += Number(item.price);
            if (item.potentialPoints)
              totalEarnPointTemp += Number(item.potentialPoints);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        });
      }
      const isXlSeatSelected = selectedSeatdesignator?.map(item => valObj?.combinedArray?.includes(item)).every(exists => exists);
      const isPrevSeatCPML = selectedSegmentCpmlMeals?.includes(valObj?.selectedSeatdesignator) ?? false;

      const isCurrentSeatCPML = selectedSegmentSeat?.every(item => selectedSegmentCpmlMeals?.includes(item)) ?? false;

      if(selectedSegmentCpmlMeals?.length > 0 && isPrevSeatCPML && !isCurrentSeatCPML ){
        setShowHoverTooltip(true);
      }else{
        setShowHoverTooltip(false);
      }
      seatObj[kItem].totalseatJourneyAmount -= totalSeatSSRAmountForThisJourney;
      totalAmount -= totalSeatSSRAmountForThisJourney;
    });
    setSeatList(seatObj);
    setSeatSelectTotalAmount(totalAmount);
    setSeatMapFromEvent({ data: dataFromEvent });
    setIsSeatEventReceived(true);
    setTotalEarnPoints(totalEarnPointTemp);
  };
  const [isTravelAssistanceAdded, setIsTravelAssistanceAdded] = useState(false);

  const updateContextWithApiData = () => {
    Promise.all([
      getFareSummaryApiData(),
      getFeeCodeMapping(),
      getSsrCodeMapping(),
      getAEMData(),
    ])
      .then(
        ([
          fareSummaryRes,
          feeCodeMappingRes,
          ssrCodeMappingRes,
          aemDataRes,
        ]) => {
          updateFareSummaryData(fareSummaryRes);
          updateFeeCodeMapping(feeCodeMappingRes);
          updateSsrCodeMapping(ssrCodeMappingRes);
          updateAEMData(aemDataRes);
          setIsLoading(false);
        },
      )
      .catch((err) => {
        // TODO: Error handling,
        // TODO: show toaster message to the user,
        // TODO: send to analytics and kibana
        // eslint-disable-next-line no-console
        console.error(err);
      });
      setEventBasedData({});
  };

  const callFareSummaryAPIOnSectionChange = (cbFun) => {
    if (window.pageType === CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN){
      mountPhaseRef.current = true;
    }
    Promise.all([getFareSummaryApiData()]).then(([fareSummaryRes]) => {
      updateFareSummaryData(fareSummaryRes);
      calculateTotalAmount();
      constructAddonObjFromAPIData(true);
      // Resetting Seat selection event data - START
      setSeatList({});
      setSeatSelectTotalAmount(0);
      setSeatMapFromEvent({});
      setIsSeatEventReceived(false);
      setTotalEarnPoints(0);
      setEventBasedData({});
      if (cbFun) {
        cbFun();
      }

      setTimeout(() => {
        mountPhaseRef.current = false;
      } , 1000);
      // Resetting Seat selection event data - END
    });
  };

  const calculateTotalAmount = (totalAmountFromEvent = 0) => {
    if(mountPhaseRef.current){
       return;
       }
    let totalSendAmount = fareSummaryData?.priceBreakdown?.totalAmount || 0;
    if(window.pageType === CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN){
      totalSendAmount = fareSummaryData?.priceBreakdown?.balanceDue || 0;
    }

    totalSendAmount += Number(totalAmountFromEvent);
    window.temp = fareSummaryData;
    const totalAmountFormattedTemp =
      totalSendAmount &&
      formatCurrency(totalSendAmount, currencyCode, {
        minimumFractionDigits: 0,
      });
    let totalDiscount = 0;
    fareSummaryData?.priceBreakdown?.journeywiseList?.forEach((jItem) => {
      totalDiscount += Number(jItem?.totalDiscount);
    });
    const totalSlashedAmountFormattedTemp =
      totalDiscount > 0 &&
      formatCurrency(totalSendAmount + totalDiscount, currencyCode, {
        minimumFractionDigits: 0,
      });
      if (!(window.location.hash === "#addon" && window.pageType === CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN)) {
        setTotalAmount(totalSendAmount);
        settotalSlashedAmountFormatted(totalSlashedAmountFormattedTemp);
        setTotalAmountFormatted(totalAmountFormattedTemp);
      }
  };

  const getPassengerData = (e) => {
    const { eventData } = e?.detail;
    analyticEvents({
      data: {
        _event: eventData === 'seat' ? EVENTS.SKIP_SEAT : EVENTS.SKIP_PAYMENT,
        response: e?.detail?.formData,
        whatsappState: e?.detail?.whatsappState,
        stateData: e?.detail?.state,
        fareTypes: fareSummaryData?.configSettings?.FareConfig,
      },
      event: eventData === 'seat' ? 'Skip to Seat' : 'Skip to Payment',
    });
  };

  useEffect(() => {
    fixFareSummaryAtBottom();
    updateContextWithApiData();
    // commenting this to avoid multiple page load event call on passnger edit page
    // analyticEvents({
    //   data: {
    //     _event: 'pageload',
    //   },
    //   event: 'pageload',
    // });
    if (window.location.href.includes('#seat')) {
      setActiveStep(STEPLIST.SEAT);
    }
    document.addEventListener(
      EVENTS.LOYALTY_MEMBER_LOGIN_SUCCESS,
      callFareSummaryAPIOnSectionChange,
    );
    document.addEventListener(
      EVENTS.AUTH_LOGIN_SUCCESS,
      callFareSummaryAPIOnSectionChange,
    );
    document.addEventListener(
      EVENTS.AUTH_TOKEN_LOGOUT_SUCCESS,
      callFareSummaryAPIOnSectionChange,
    );
    document.addEventListener(EVENTS.PASSENGER_ADDED, navigateToPayment);
    const listener = (event) => addonModificationEventHandlerRef.current(event);
   document.addEventListener(
      EVENTS.EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER_MODIFICATION,
      listener);
    return () => {
      document.removeEventListener(
        EVENTS.LOYALTY_MEMBER_LOGIN_SUCCESS,
        callFareSummaryAPIOnSectionChange,
      );
      document.removeEventListener(
        EVENTS.AUTH_LOGIN_SUCCESS,
        callFareSummaryAPIOnSectionChange,
      );
      document.removeEventListener(
        EVENTS.AUTH_TOKEN_LOGOUT_SUCCESS,
        callFareSummaryAPIOnSectionChange,
      );
      document.removeEventListener(EVENTS.PASSENGER_ADDED, navigateToPayment);
    };
  }, []);

  useEffect(() => {
    if (fareSummaryData) {
      document.addEventListener('GET_PASSENGER_DATA', getPassengerData);
      if(fareSummaryData?.journeysDetail?.some(ele=>ele?.specialFareCode === CONSTANTS?.UMNR_LABEL)){
        setIsUmnr(true)
      }
    }

    return () => {
      document.removeEventListener('GET_PASSENGER_DATA', getPassengerData);
    };
  }, [fareSummaryData]);

  const navigateToPayment = (event) => {
    if (event?.detail?.isPassengerAdded) {
      callFareSummaryAPIOnSectionChange(
        makePayment(CONSTANTS.PAYMENT_PATH, {
          from: 'faresummary',
          mode: 'newpayment',
        }),
      );
    }
  };

  useEffect(() => {
    if (currencyCode) {
      calculateTotalAmount();
    }

    if (fareSummaryData) {
      constructAddonObjFromAPIData(false);
      document.addEventListener(
        EVENTS.EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER,
        constructAddonObjFromEventData,
      );

      document.addEventListener(
        EVENTS.EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER,
        createSeatListFromEvent,
      );
      const totalEarnPointsApi =
        fareSummaryData?.priceBreakdown?.totalPotentialPoints;
      setTotalEarnPoints(totalEarnPointsApi);
      const isCashpaywith =
        getBookingContext().payWith?.toLowerCase() ===
        CONSTANTS.PAYWITH_CASH_LOWER;
      const authUser =
        Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || {};
      const isLoyaltyUser = authUser?.loyaltyMemberInfo?.FFN;
      if (
        isCashpaywith &&
        !window.disableLoyalty &&
        isLoyaltyUser &&
        totalEarnPointsApi
      ) {
        // LOYAL-884 - As per this,we will not show Earn points in Faresummary footer
        // REmove later: setIsEarnFlow(true)
      } else if (
        !window.disableLoyalty &&
        isLoyaltyUser &&
        fareSummaryData?.bookingDetails?.isRedeemTransaction
      ) {
        setIsBurnFlow(true);
      }
    }
  }, [fareSummaryData]);

  useEffect(()=>{
    if (fareSummaryData) {
      dispatchCustomEventUpdated(EVENTS.REVIEW_SUMMARY_API_DATA, {
        fareSummaryData,
        ssrData: ssrCodeMapping
      });
    }
  },[fareSummaryData, ssrCodeMapping])

  const validateFreeMealSeat = (selectedSeat) => {
    let cpmlObj = {};
    if (selectedSeat?.xlSeatFreemeal) {
      cpmlObj = {
        ssrCode: CONSTANTS.CPML,
        value: 0,
        ssrName: CONSTANTS.CPML,
        multiplier: 1,
      };
    }
    return (Object.keys(cpmlObj).length > 0) ? cpmlObj : null;
  };

  const addCPMLFromXLSeatPage = (event) => {
    const temp = {...addonDataList};
    let dataFromEvent = event?.detail?.selectedSeatListByJourney || null;
    if (!dataFromEvent) {
      dataFromEvent = event?.detail || {};
    }
    Object.keys(dataFromEvent).forEach((kItem) => {
      const nofreeMealSSRs = temp[kItem]?.uiData.filter(ssrItem => ssrItem?.ssrCode !== CONSTANTS.CPML);
      temp[kItem].uiData = nofreeMealSSRs;
      const valObj = dataFromEvent[kItem] || {};
      if (valObj?.seats?.length > 0) {
        valObj?.seats.forEach((item) => {
          const selectedFreeMeal = validateFreeMealSeat(item);
          if (selectedFreeMeal && Object.keys(selectedFreeMeal).length) {
            const ssrLabel = converSSRCodeObj[selectedFreeMeal.ssrCode] || selectedFreeMeal.ssrName;
            const formattedAmount = formatCurrency(selectedFreeMeal?.value ?? 0, currencyCode, { minimumFractionDigits: 0 });
            const freeMealItem = {
              ssrName: ssrLabel,
              value: formattedAmount,
              ...selectedFreeMeal
            }
            temp[kItem]?.uiData.push(freeMealItem);
          }
        });
      }
    });
    setAddOnDataList(temp);
  }

  useEffect(() => {
    document.addEventListener(
      EVENTS.EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER,
      constructAddonObjFromEventData,
    );

    document.addEventListener(
      EVENTS.EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER,
      addCPMLFromXLSeatPage,
    )

    // document.addEventListener(
    //   EVENTS.EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER_MODIFICATION,
    //   constructAddonObjFromEventForModification);
  }, [addonDataList]);

  useEffect(() => {
    const totalAdditionalAmountFromEvent =
      seatSelectTotalAmount + addonTotalAmount;

    if(window.pageType === CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN){
      calculateTotalAmount(seatSelectTotalAmount);
    }else{
      calculateTotalAmount(totalAdditionalAmountFromEvent);
    }

  }, [seatSelectTotalAmount, addonTotalAmount]);

  const isNextButtonDisabled = isEventLoading || isEventDisable;

  const fareSummaryNextClickHandler = () => {
    setIsNewButtonClicked(false);
    setClickedButton('Next');
    dispatchCustomEvent(EVENTS?.ONCLICK_NEXT_FARE_SUMMARY_V2, {
      from: 'faresummary',
    });
  };

  const fareSummaryNextPaymentClickHandler = () => {
    setIsNewButtonClicked(true);
    setClickedButton('NextToPayment');
    dispatchCustomEvent(EVENTS?.ONCLICK_NEXT_FARE_SUMMARY_V2, {
      from: 'faresummary',
      mode: 'newpayment',
    });
  };

  const directToPayment = () => {
    setClickedButton('skipToPayment');
    dispatchCustomEvent(EVENTS.GET_PASSENGER_DATA_FROM_FARE, {
      toPath: 'payment',
    });
  };
  const handleActiveSectionChange = (detail) => {
    setCustomMfToOpen(detail?.mfToOpen);
    let activeTab = STEPLIST.PE;
    if (detail?.mfToOpen === EVENTS.EVENT_TOGGLE_SECTION_ACTION_ADDON) {
      activeTab = STEPLIST.ADDON;
    } else if (detail?.mfToOpen === EVENTS.EVENT_TOGGLE_SECTION_ACTION_SEAT) {
      activeTab = STEPLIST.SEAT;
    }
    setActiveStep(activeTab);
    if (activeStep !== activeTab) {
      callFareSummaryAPIOnSectionChange();
    }
  };

  useEffect(() => {
    const isNewPaymentEnabled =
      window.msdv2.enableNewPayment &&
      activeStep === EVENTS.EVENT_TOGGLE_SECTION_ACTION_SEAT;
    setIsNewPaymentBtnEnabled(isNewPaymentEnabled);
    if (isOpen) {
      // when active section changes, we need to close the slider if its opened
      setIsOpen(false);
    }
  }, [activeStep]);

  useCustomEventListener(EVENTS.MAKE_ME_EXPAND_V2, handleActiveSectionChange);

  const directToSeat = () => {
    setClickedButton('skipToSeat');
    dispatchCustomEvent(EVENTS.GET_PASSENGER_DATA_FROM_FARE, {
      toPath: 'seat',
    });
  };

  const getTravelAssistanceConfirmation = (event) => {
    setIsTravelAssistanceAdded(event?.detail?.isTravelAssistance);
  };

  useEffect(() => {
    window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
          window.location.reload();
      }
    });
  },[])

  useEffect(() => {
    document.addEventListener(
      'TRAVEL_ASSISTANCE_ADDED',
      getTravelAssistanceConfirmation,
    );

    return () => {
      document.removeEventListener(
        'TRAVEL_ASSISTANCE_ADDED',
        getTravelAssistanceConfirmation,
      );
    };
  }, []);

  const renderAmountSection = () => {
    let totalAmountFareLabel = aemData?.totalFareLabel || 'Total Fare';
    let refundAmountLabel = aemData?.refundAmount;
    if (window.pageType === CONSTANTS.ADD_ON_SEAT_SELECTION_CHECKIN) {
      totalAmountFareLabel =
        aemData?.totalPayableAmountLabel || 'Total Payable Amount';
      refundAmountLabel =
        aemData?.totalPayableAmountLabel || 'Total Payable Amount';
    }


    if (isEarnFlow) {
      const formattedPoints =
        totalEarnPoints && totalEarnPoints.toLocaleString();
      const milesLabel =
        aemData?.earnMilesLabel?.replace('{earningPoints}', formattedPoints) ||
        formattedPoints;
      return (
        <div className="total-fare__amount-content">
          <span className="total-fare__label">
            {`${totalAmount < 0 ? refundAmountLabel : totalAmountFareLabel} + ${aemData?.milesEarningLabel}`}
          </span>
          <h4 className="total-fare__amount">
            {totalAmountFormatted}
            {totalEarnPoints ? (
              <span className="h4 total-fare__amount--earnpoints">{` + ${milesLabel}`}</span>
            ) : null}
          </h4>
        </div>
      );
    } else if (isBurnFlow) {
      const totalPoints = eventBasedData?.point ? eventBasedData?.point : fareSummaryData?.priceBreakdown?.pointsBalanceDue;
      const formattedPoints = totalPoints && totalPoints.toLocaleString();
      const milesLabel = `${formattedPoints}`;
      const totalAmountFromEventSplitData =
      eventBasedData?.amount &&
      formatCurrency(eventBasedData?.amount, currencyCode, {
        minimumFractionDigits: 0,
      });
      let amout = totalAmountFormatted ? `+ ${totalAmountFormatted}` : '';
      if (totalAmountFromEventSplitData) {
        amout = `+ ${totalAmountFromEventSplitData}`;
      }


      return (
        <div className="total-fare__amount-content">
          <span className="total-fare__label">
            {` ${totalAmount < 0 ? refundAmountLabel : aemData?.totalMilesCashRequiredLabel || 'Total Fare'} `}
          </span>
          <h4 className="total-fare__amount">
          <Icon className="icon-bluechip-point" size="xs" />{`${milesLabel} ${amout}`}</h4>
        </div>
      );
    } else {
      return (
        <div className="total-fare__amount-content">
          <span className="total-fare__label">{totalAmount < 0 ? refundAmountLabel : totalAmountFareLabel}</span>
          <h4 className="total-fare__amount">{totalAmountFormatted}</h4>
        </div>
      );
    }
  };

  const getSessionToken = () => {
    try {
      const tokenObj = Cookies.get('auth_token', true);
      // eslint-disable-next-line no-console
      return tokenObj.token || '';
    } catch (error) {
      // eslint-disable-next-line no-console
      return '';
    }
  };

  const makePayment = (redirectUrl = '', details = {}) => {
    const token = getSessionToken();
    const dataToPass = {
      ...details,
      from: 'SeatMapApp',
      token,
      refUrl: `${window?.location?.origin}${redirectUrl}`,
    };
    const event = new CustomEvent(EVENTS.INITIATE_PAYMENT, {
      bubbles: true,
      detail: dataToPass,
    });
    document.dispatchEvent(event);
  };

  const actualAmount = String(totalAmountFormatted)?.replace(/[^0-9.-]+/g, '');

  const component = (
    <div className="fare-summary-app">
      <div className="fare-summary" ref={fareSummaryRef}>
        {/* <div className="added-to-fare d-flex" ref={addedToFareRef}>
          <div className="num-of-items">0 items</div>
          <div className="added-info">
            <span className="added-info__label">{aemData?.addedToFareLabel || 'Added to fare'}</span>
            <span className="added-info__amount">₹ 0</span>
          </div>
        </div> */}
        <div
          className={`action-wrapper flex-h-between ${
            window.location.pathname === CONSTANTS?.PASSENGER_PATHNAME && window.location.hash === '' && expressCheckoutflag ? 'express-checkout' : ''
          }`}
        >
          <SwipeHandle setOpen={setIsOpen} />
          {!isLoading ? (
            <>
              <div className="total-fare">
                {renderAmountSection()}
                <span className="total-fare__info">
                  {aemData?.convenienceFeeLabel || 'Zero convenience fee'}
                </span>
                {fareSummaryData?.priceBreakdown &&
                  Object.keys(fareSummaryData?.priceBreakdown).length > 0 && (
                    <button
                      type="button"
                      className="total-fare__details t-3"
                      onClick={() => setIsOpen(true)}
                    >
                      {aemData?.viewDetailsLabel || 'View Details'}
                    </button>
                  )}
              </div>

              <div className="fare-summary-actions">
                {showHoverTooltip && showXlSeatFreeMealToSaverOnly && (isModifyFlow?.enable || isCheckInFlow?.enable )&&
                <TooltipPopover
                description={aemMissOutFreeMealMsg || ""}
                infoIconClass="icon-info icon-warn"
                showHideArrow={true}
              />
                }
                {expressCheckoutflag &&
                  window.location.pathname === CONSTANTS?.PASSENGER_PATHNAME &&
                  window.location.hash === '' &&
                  !isUmnr && (
                    <Button
                      onClick={directToSeat}
                      disabled={
                        (!isNewButtonClicked && isNextButtonDisabled) ||
                        isTravelAssistanceAdded
                      }
                      loading={
                        !isNewButtonClicked &&
                        isEventLoading &&
                        clickedButton === 'skipToSeat'
                      }
                      containerClass="next-btn btn--skip-to-seat d-none"
                    >
                      {aemData?.skipToSeatLabel || 'Skip to Seat select'}
                    </Button>
                  )}

                {expressCheckoutflag &&
                  window.location.pathname === CONSTANTS?.PASSENGER_PATHNAME &&
                  window.location.hash === '' && (
                    <Button
                      onClick={directToPayment}
                      disabled={
                        (!isNewButtonClicked && isNextButtonDisabled) ||
                        isTravelAssistanceAdded
                      }
                      loading={
                        !isNewButtonClicked &&
                        isEventLoading &&
                        clickedButton === 'skipToPayment'
                      }
                      containerClass="next-btn btn--skip-to-payment d-none"
                    >
                      {aemData?.skipToPaymentLabel || 'Skip to Payment'}
                    </Button>
                  )}

                {!isNewPaymentBtnEnabled && (
                  <Button
                    onClick={fareSummaryNextClickHandler}
                    disabled={!isNewButtonClicked && isNextButtonDisabled}
                    loading={
                      !isNewButtonClicked &&
                      isEventLoading &&
                      clickedButton === 'Next'
                    }
                    containerClass="next-btn"
                  >
                    {aemData?.nextLabel || 'Next'}
                  </Button>
                )}
                {isNewPaymentBtnEnabled && (
                  <Button
                    onClick={fareSummaryNextPaymentClickHandler}
                    disabled={isNewButtonClicked && isNextButtonDisabled}
                    // disabled={true}
                    loading={
                      isNewButtonClicked &&
                      isEventLoading &&
                      clickedButton === 'NextToPayment'
                    }
                    containerClass="next-btn"
                  >
                    {Number(actualAmount) === 0
                      ? aemData?.nextLabel
                      : aemData?.newPaymentCtaLabel || 'Payment'}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Shimmer />
          )}
        </div>
      </div>
      {isOpen && (
        <FareSummaryDetails
          onClose={() => setIsOpen(false)}
          totalAmountFormatted={totalAmountFormatted}
          seatMapDataFromEvent={seatMapDataFromEvent}
          addonDataList={addonDataList}
          seatListObj={seatList || {}}
          totalSlashedAmountFormatted={totalSlashedAmountFormatted}
          isSeatEventReceived={isSeatEventReceived}
          isBurnFlow={isBurnFlow}
          isEarnFlow={isEarnFlow}
          eventBasedData={eventBasedData}
        />
      )}

      {showNegativeAmountToast && (
        <Toast
          infoIconClass="icon-info"
          variation="notifi-variation--error"
          containerClass="toast-example"
          autoDismissTimeer={5000}
          onClose={() => setShowNegativeAmountToast(false)}
          type="error"
          description={
            aemData?.negativeAmountError ??
            'You cannot select a seat or add-ons that are priced lower than those chosen during the booking journey.'
          }
        />
      )}
    </div>
  );

  return createPortal(component, document.body);
};

FareSummary.propTypes = {};

export default FareSummary;
