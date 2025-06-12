import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import PropTypes from 'prop-types';

// Old Code:
// import PropTypes from 'prop-types';
// import Placeholder from 'skyplus-design-system-app/dist/des-system/Placeholder';
// import ExpandCollapse from '../../common/expandCollapse/expandCollapse';
// import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
// import BookingDetail from './BookingDetail/BookingDetails.jsx';
// import ContinueButton from './ContinueButton';
// import AnalyticHelper from '../../helpers/analyticHelper';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Carousel from 'skyplus-design-system-app/dist/des-system/Carousel';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { useCustomEventListener } from 'skyplus-design-system-app/src/functions/hooks/customEventHooks';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import {
  // FARE_TYPE,
  CONSTANTS,
  // buttonVariation,
  categoryCodes,
  mealVoucherLabel,
  productClassCodes,
  ssrCodes,
  LOGIN_SUCCESS, LOGOUT_SUCCESS, LOYALTY_LOGIN_SUCCESS } from '../../constants/index';

import { addonCookies } from '../../constants/cookies';
import { AppContext } from '../../context/AppContext';
import { addonActions } from '../../store/addonActions';
import { getTripCode, isUnaccompaniedMinorSearch, newAddonData } from '../../functions/utils';
import useSuper6EFare from '../../hooks/useSuper6EFare';
import { getSSRData } from './CardContainer/CardContainer';
import DisplayJournies from './DisplayJournies/DisplayJournies';
import DisplayPassenger from './DisplayPassenger/DisplayPassenger';
import { removeSoldSsrForTiffinPrimMlst } from './RemoveSoldSsrUtils';
import {
  sellBundleDataForPrimMlst,
  sellMealDataForTiffinPrimMlst,
  mergeCouponCodes,
  handelTakenSSRkeyRemoval,
  removeDuplicatesBySsrKey,
} from './SellDataUtils';
import { setTakenMealsData } from './TakenSsrUtil';
import { createEventForAddonModification, flightSrrAddon, passengerPost, sellSSRs } from '../../functions/index';
import eventService from '../../services/event.service';
import Tiffin from '../AddonList/Tiffin/Tiffin';
import Prime from '../AddonList/Prime';
import SeatAndEat from '../AddonList/SeatAndEat/SeatAndEat';
import AddOnListMapper from '../AddonList/AddOnListMapper';
import FastForward from '../AddonList/FastForward';
import LostBaggageProtectionMapper from '../AddonList/LostBaggageProtection/LostBaggageProtectionMapper';
import Shimmer from '../common/Shimmer/Shimmer';
import AddonSelectPopup from '../common/AddonSelectPopup/AddonSelectPopup';
import AddSameAmenities from './AddSameAmenitiesUtil';
import { LOCATION_HASHES } from '../../constants/analytic';
import AddonCard from '../common/AddonCard/AddonCard';
// comment - old code
// import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
// import BookingDetail from './BookingDetail/BookingDetails.jsx';
// import ContinueButton from './ContinueButton';
import LoyaltyLoginSignUp from './DisplayLoyaltyMember/LoyaltyLoginSignUp';
import MemberContainer from './MemberContainer/MemberContainer';

const AddonContainer = ({ isModifyFlow }) => {
  const {
    state: {
      addonInitialState,
      containerConfigData,
      getFlightSearch,
      getAddonData,
      getFlightSell,
      getTrips,
      getTokenAddon,
      getTripIndex,
      getJourneyKey,
      getFareAvailabilityKey,
      getPassengerDetails,
      getSsrs,
      tripIndex,
      paxIndex,
      sellAddonSsr,
      upSellPopup,
      isAddonExpanded,
      isAddonEnableChange,
      isAddonSubmitted,
      setAddonError,
      setAddonIsLoading,
      removedAddonSsr,
      isPassengerPostRequired,
      page,
      isInternationalFlight,
      setGetSelectedAddon,
      setGetSportsEquipment,
      selectedSportsEquipment,
      setSellSportsEquipment,
      setGetBar,
      setSellBar,
      excessBaggageData,
      additionalBaggageData,
      additionalBaggageFormData,
      setGetGoodNight,
      setSellGoodNight,
      isAddonChangeFlow,
      isAddonNextFare,
      addonNextFareType,
      istravelAssistanceAddedFromPE,
      ssrMealCouponRemoveRequest,
      ...state
    },
    dispatch,
  } = useContext(AppContext);

useSuper6EFare();

  const [isExpanded, setIsExpanded] = useState(false);
  const [elligibleTripsForPopup, setElligibleTripsForPopup] = useState([]);
  const [checkAmenities, setCheckAmenities] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAddonPopupEnabled, setIsAddonPopupEnabled] = useState(false);
  const [isAddonPopupResponded, setIsAddonPopupResponded] = useState(false);
  const [addonErrorData, setAddonErrorData] = useState({
    active: false,
    message: '',
  });
  const [isChangeFlow, setIsChangeFlow] = useState(false);
  // Old Code:
  // const [isChange, setIsChange] = useState(false);
  // const [defaultVariation, setDefaultVariation] = useState(
  //   buttonVariation.default,
  // );
  // const [totalAmount, setTotalAmount] = React.useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(setAddonIsLoading);
  const [paxDetailsCommon, setPaxDetailsCommon] = useState([]);
  const [paxDetailsPayload, setPaxDetailsPayload] = useState({});
  const [openMadatoryMessageToast, setOpenMadatoryMessageToast] = useState(false);
  const [isOpenSlider, setOpenSlider] = useState(false);
  const [isOpenPrime, setIsOpenPrime] = useState(false);
  const [isVoucherSelected, setIsVoucherSelected] = useState({ meal: false, prime: false });
  const [voucherToggle, setVoucherToggle] = useState(false);
  const [isAddonDataProcessed, setIsAddonDataProcessed] = useState(false);
  const [isMobile] = useIsMobile();

  const [cookies] = useCookies();

  const mfData = containerConfigData?.mfData?.data?.addOnsMainByPath?.item;
  const sliderConfiData = containerConfigData?.configJson?.data?.addonAdditionalByPath?.item.sliderConfiguration;
  const additionSliderData = containerConfigData?.configJson?.data?.addonAdditionalByPath?.item;

  const [fareCat, setFareCategory] = useState(null);
  const [nextCarouselData, setNextCarouselData] = useState(null);
  const [isNextFare, setIsNextFare] = useState(false);
  const { fareType } = mfData || {};
  const [isMealWithCoupon, setMealWithCoupon] = useState([]);
  const loyaltyLoggedInData = Cookies.get('auth_user', true, true);

  const [totalEarnPoints, setTotalEarnPoints] = useState(0);
  const [totalBurnPoints, setTotalBurnPoints] = useState(0);
  const [extraSeatKeys, setExtraSeatKeys] = useState([]);
  const [openMemberBenifit, setOpenMemberBenifit] = useState(false);

  useEffect(() => {
    if (getAddonData) {
      setIsAddonDataProcessed(false);
      const aemMealData =
        containerConfigData?.configJson?.data?.addonAdditionalByPath?.item.sliderConfiguration.find(
          (addon) => {
            return addon.categoryBundleCode === categoryCodes.meal;
          },
        );
      const takenMealsData = setTakenMealsData(
        getAddonData.ssr,
        aemMealData.ssrList,
        getAddonData.bundles,
      );
      if (!isEmpty(takenMealsData)) {
        dispatch({
          type: addonActions.SET_TAKEN_MEALS,
          payload: {
            meals: [...takenMealsData.takenMeals],
            totalMealsPriceCountTaken: takenMealsData.totalMealsPriceCountTaken,
          },
        });

        dispatch({
          type: addonActions.SET_CONFIRMED_MEALS,
          payload: {
            meals: [...takenMealsData.takenMeals],
            priceAndCount: takenMealsData.totalMealsPriceCount,
          },
        });

        dispatch({
          type: addonActions.MLST_BUNDLE_FARE_TAKEN,
          payload: takenMealsData.mlstBundleFareTakenSsrData,
        });

        dispatch({
          type: addonActions.PRIM_BUNDLE_FARE_TAKEN,
          payload: takenMealsData.primBundleFareTakenSsrData,
        });

        dispatch({
          type: addonActions.SEAT_ADDED_TAKEN,
          payload: takenMealsData.seatAddedTakenSsrData,
        });
      }
      setTimeout(() => setIsAddonDataProcessed(true), 0);
    }
  }, [getAddonData]);

  useEffect(() => {
    const modalContent = document.querySelector('.skyplus-addon-mf__modal-button .skyplus-button--medium');
    if (modalContent) {
      modalContent.setAttribute('tabindex', '0');
      modalContent?.focus();
    }
  }, []);

  const paxDetailEvent = () => {
    const dataToPass = {
      from: 'AddonApp',
      mfToOpen: CONSTANTS.EVENT_TOGGLE_SECTION_ACTION_PAX_EDIT,
    };
    const event = new CustomEvent(CONSTANTS.MAKE_ME_EXPAND_V2, {
      bubbles: true,
      detail: dataToPass,
    });
    // dispatching event to catch the event in passengerdetails component and toggle the addon
    document.dispatchEvent(event);
    // Old Code:
    // window.location.hash = LOCATION_HASHES.PASSENGER_SECTION;
  };

  const backRedirect = () => {
    const airportCode = getTripCode(getAddonData);
    eventService.updateAnalytics(
      page,
      getPassengerDetails.length,
      mfData?.backToPassengerDetails || 'Back to Passenger Details',
      isModifyFlow,
      airportCode,
      isMobile,
      true,
    );

    paxDetailEvent();
    dispatch({
      type: addonActions.IS_ADDON_EXPANDED,
      payload: false,
    });
    dispatch({
      type: addonActions.IS_ADDON_ENABLE_CHANGE,
      payload: true,
    });
  };

  useEffect(() => {
    // Uncomment the below code for local/develop purpose
    // flightSrrAddon(dispatch, page || 'passenger-edit', isMobile, isModifyFlow);

    /* Old Code:
    document.addEventListener(CONSTANTS.ADD_PASSENGER_PAYLOAD, (event) => {
      if (event && event.bubbles && event.detail && event.detail.payload) {
        setPaxDetailsPayload(event?.detail?.payload);
        const paxDetailFromPE = event?.detail?.payload?.passengers;
        if (paxDetailFromPE && paxDetailFromPE.length > 0) {
          setPaxDetailsCommon(paxDetailFromPE);
          dispatch({
            type: addonActions.GET_PASSENGER_DATA,
            payload: paxDetailFromPE,
          });
          dispatch({
            type: addonActions.IS_PASSENGER_POST_REQUIRED,
            payload: true,
          });
        }

        if (event?.detail?.wheelchairSSRList?.length > 0) {
          let sellAddonData = [];
          if (sellAddonSsr && sellAddonSsr.length > 0) {
            sellAddonData = [...sellAddonSsr];
            let newUniqueData = [];
            sellAddonData.forEach((existingSsr) => {
              newUniqueData = event?.detail?.wheelchairSSRList.filter(
                (newSsr) => newSsr.ssrKey !== existingSsr.ssrKey,
              );
            });

            newUniqueData.forEach((ssrItem) => {
              sellAddonData.push(ssrItem);
            });
          } else {
            sellAddonData = [...event?.detail?.wheelchairSSRList];
          }

          dispatch({
            type: addonActions.SET_SELL_ADDON_SSR,
            payload: sellAddonData,
          });
        }

        if (event?.detail?.istravelAssistanceSelected !== null) {
          dispatch({
            type: addonActions.ADD_TRAVEL_ASSISTANCE_FROM_PE,
            payload: event?.detail?.istravelAssistanceSelected,
          });
        }
      }
    }); */

    const hasParam = window.location.hash?.substring(1);
    if (hasParam.includes(LOCATION_HASHES.ADDON)) {
      dispatch({
        type: addonActions.IS_ADDON_EXPANDED,
        payload: true,
      });
      dispatch({
        type: addonActions.IS_ADDON_ENABLE_CHANGE,
        payload: false,
      });

      const headerTitleUpdateEvent = (data) => new CustomEvent(CONSTANTS.HEADER_CONTENT_UPDATE_EVENT, data);
      document.dispatchEvent(
        headerTitleUpdateEvent({
          bubbles: true,
          detail: { title: mfData?.addOnsLabel, onClickBack: backRedirect },
        }),
      );

      eventService.reset();
      dispatch({ type: addonActions.UNMOUNT_ADDONCONTAINER });

      const authToken = cookies[addonCookies.AUTH_TOKEN];
      if (authToken && authToken?.token && !isModifyFlow) {
        flightSrrAddon(dispatch, page, isMobile, isModifyFlow);
      }
    }

    document.addEventListener(CONSTANTS.MAKE_ME_EXPAND_V2, (event) => {
      if (event?.detail?.mfToOpen === CONSTANTS.EVENT_TOGGLE_SECTION_ACTION_ADDON) {
        dispatch({
          type: addonActions.IS_ADDON_EXPANDED,
          payload: true,
        });
        dispatch({
          type: addonActions.IS_ADDON_ENABLE_CHANGE,
          payload: false,
        });

        const headerTitleUpdateEvent = (data) => new CustomEvent(CONSTANTS.HEADER_CONTENT_UPDATE_EVENT, data);
        document.dispatchEvent(
          headerTitleUpdateEvent({
            bubbles: true,
            detail: { title: mfData?.addOnsLabel, onClickBack: backRedirect },
          }),
        );

        eventService.reset();
        dispatch({ type: addonActions.UNMOUNT_ADDONCONTAINER });

        const authToken = cookies[addonCookies.AUTH_TOKEN];
        if (authToken && authToken?.token) {
          flightSrrAddon(dispatch, page, isMobile, isModifyFlow);
        }

        if (event && event.bubbles && event.detail && event.detail.payload) {
          setPaxDetailsPayload(event?.detail?.payload);
          const paxDetailFromPE = event?.detail?.payload?.passengers;
          if (paxDetailFromPE && paxDetailFromPE.length > 0) {
            setPaxDetailsCommon(paxDetailFromPE);
            dispatch({
              type: addonActions.GET_PASSENGER_DATA,
              payload: paxDetailFromPE,
            });
            dispatch({
              type: addonActions.IS_PASSENGER_POST_REQUIRED,
              payload: true,
            });
          }
        }

        if (event && event.bubbles && event.detail) {
          if (event?.detail?.wheelchairSSRList?.length > 0) {
            let sellAddonData = [];
            if (sellAddonSsr && sellAddonSsr.length > 0) {
              sellAddonData = [...sellAddonSsr];
              let newUniqueData = [];
              sellAddonData.forEach((existingSsr) => {
                newUniqueData = event?.detail?.wheelchairSSRList.filter(
                  (newSsr) => newSsr.ssrKey !== existingSsr.ssrKey,
                );
              });

              newUniqueData.forEach((ssrItem) => {
                sellAddonData.push(ssrItem);
              });
            } else {
              sellAddonData = [...(event?.detail?.wheelchairSSRList || [])];
            }

            dispatch({
              type: addonActions.SET_SELL_ADDON_SSR,
              payload: sellAddonData,
            });
          }
          dispatch({
            type: addonActions.ADD_TRAVEL_ASSISTANCE_FROM_PE,
            payload: event?.detail?.travelAssistance || false,
          });

          dispatch({
            type: addonActions.ADD_ZERO_CANCELLATION_FROM_PE,
            payload: event?.detail?.zeroCancellation || false,
          });
        }
      } else {
        dispatch({
          type: addonActions.IS_ADDON_EXPANDED,
          payload: false,
        });
        dispatch({
          type: addonActions.IS_ADDON_ENABLE_CHANGE,
          payload: true,
        });
      }
    });

    // TD:: Santhosh => Moved from CardContainer
    // return () => {
    //   eventService.reset();
    //   dispatch({ type: addonActions.UNMOUNT_ADDONCONTAINER });
    // };
  }, []);

  // Old Code:
  // const dispatchLoadingEvent = (config) => new CustomEvent(CONSTANTS.EVENT_PASSENGEREDIT_TOGGLE_LOADING, config);

  function formatCouponExpiry(couponCode) {
    const parts = couponCode.split('|');
    const datePart = parts[1]; // e.g., '31052025'

    if (!datePart || datePart.length !== 8) return null;

    const day = datePart.slice(0, 2);
    const month = datePart.slice(2, 4);
    const year = datePart.slice(4, 8);

    return `${year}-${month}-${day}T23:59:59`;
  }
  
const pushRedeemedMealSSRObjects = () => {
  const ssrObjList = [];
  const ssrObjListModify = [];
  const eventSummaryData = eventService.get()
  const filtered = [] 
  const modifyVocherRemove =[];
  Object.values(eventSummaryData).forEach((item)=>{
    if(item.category === categoryCodes.mealVoucher){
      filtered.push({...item,...{action: 'remove'}})
    }
  });
  
  eventService.update([], filtered);
  state.mealVoucherData?.forEach(
    ({ JourneyKey: journeyKey, PassengerKey: passengerKey, SsrDetails }) => {
      SsrDetails?.forEach((takenSSR) => {
        const findIndex = ssrObjList?.findIndex(i=> i.journeyKey === journeyKey &&
           i.passengerKey === passengerKey && i.segmentKey === takenSSR?.SegmentKey);
          // const findIndexModify = ssrObjListModify?.findIndex(i=> i.journeyKey === journeyKey && i.segmentKey === takenSSR?.SegmentKey);
           const findIndexModify = ssrObjListModify?.findIndex(i=> i.journeyKey === journeyKey);
           if(findIndex > -1){
            ssrObjList[findIndex].multiplier +=1;
            ssrObjList[findIndex].price += Number(takenSSR?.Price || 0);
           }else {
            let obj = {
              addonName: mealVoucherLabel,
              passengerKey,
              multiplier: 1,
              ssrCode: categoryCodes?.mealVoucher,
              price: Number(takenSSR.Price ?? 0),
              journeyKey,
              name: mealVoucherLabel,
              category: categoryCodes?.mealVoucher,
              segmentKey: takenSSR?.SegmentKey || '',
              earnPoints: 0,
              discountPercentage: 0,
              originalPrice: 0,
              action: 'add',
            }
              ssrObjList.push(obj);
      }

        if (findIndexModify > -1) {
          ssrObjListModify[findIndexModify].multiplier += 1;
          ssrObjListModify[findIndexModify].price += Number(takenSSR?.Price || 0);
        } else {
          let obj = {
            addonName: mealVoucherLabel,
            passengerKey,
            multiplier: 1,
            ssrCode: categoryCodes?.mealVoucher,
            price: Number(takenSSR.Price ?? 0),
            journeyKey,
            name: mealVoucherLabel,
            category: categoryCodes?.mealVoucher,
            segmentKey: '',// takenSSR?.SegmentKey || '',
            earnPoints: 0,
            discountPercentage: 0,
            originalPrice: 0,
            action: 'add',
          }
          ssrObjListModify.push(obj);
        }

      });
    },
  );
    
  eventService.update(ssrObjList, []);
  if(ssrObjListModify?.length < 1){ 
    // below code used to reset mealvocher if its empty so from faresummary resets
    const activeJourneyKey = getAddonData?.ssr[tripIndex]?.journeyKey;
    ssrObjListModify.push({
      addonName: mealVoucherLabel,
      passengerKey: '',
      multiplier: 1,
      ssrCode: categoryCodes?.mealVoucher,
      price: 0,
      journeyKey: activeJourneyKey,
      name: mealVoucherLabel,
      category: categoryCodes?.mealVoucher,
      segmentKey: '',
      action: 'remove',
      purpose: 'remove all vocher if incase its empty vocher fareMF will reset vocher if vocher in event'
    })
  }

  createEventForAddonModification(ssrObjListModify, []);
};

  useEffect(()=>{
    pushRedeemedMealSSRObjects()
  },[state.mealVoucherData])
 
  const getRedeemCoupons = () => {
    if (!getAddonData?.ssr || !getAddonData?.Loyalty?.redeemCoupons) return;
    const couponCodes = [
      {
        name: 'Meal Voucher',
        category: 'Meal',
        couponCode: [],
        seriesId: 111371,
        discountType: null,
        discountValue: 0,
        expiryDate: '',
        couponLeft: 0,
        journeyKey: '',
      },
    ];
    const mealTempData = [];
    getAddonData.ssr.forEach((journey, index) => {
      const paxTempData = [];
      const couponsAppliedInJourney = getAddonData.Loyalty.redeemCoupons.filter(
        (coupon) => coupon.journeyKey === journey.journeyKey,
      );

      couponsAppliedInJourney.forEach((applied) => {
        paxTempData.push({
          keys: applied?.passengerKey,
          couponcode: applied?.couponCode,
        });
      });

      if (state?.primBundleFare?.[index]) {
        dispatch({
          type: addonActions.PRIM_BUNDLE_FARE_SELECTED,
          payload: {
            isSelected: state.primBundleFare?.[index]?.isSelected,
            journeyKey: state.primBundleFare?.[index]?.journeyKey,
            bundleCode: state.primBundleFare[index]?.bundleCode,
            passengerKeys: state.primBundleFare[index]?.passengerKeys,
            title: state.primBundleFare[index]?.title,
            passengerKeysWithCoupon: paxTempData,
            tripIndex: index + 1,
          },
        });
      } else if (couponsAppliedInJourney.length > 0) {
        couponsAppliedInJourney.forEach((applied) => {
          const expiryDate = formatCouponExpiry(applied?.couponCode);
          mealTempData.push({
            keys: applied?.passengerKey,
            couponcode: applied?.couponCode,
            ssrKey: applied.ssrKey,
            bundleCode: categoryCodes.meal,
            journeyKey: applied?.journeyKey,
          });
          couponCodes[0].couponCode.push(applied?.couponCode);
          couponCodes[0].journeyKey = applied.journeyKey;
          if (expiryDate) {
            couponCodes[0].expiryDate = expiryDate;
          }
        });
      }
    });
    if (couponCodes[0].couponCode.length > 0) {
    setMealWithCoupon(mealTempData);

      couponCodes[0].couponLeft = couponCodes[0].couponCode.length;
      dispatch({
        type: addonActions.SET_REDEEM_COUPON_DATA,
        payload: {
          redeemCoupon: couponCodes,
        },
      });
    }
  };

  const onHashChange = (e) => {
    const { hash } = window.location;
    const oldUrl = e?.oldURL?.split('#')[1];
    if (!hash) {
      backRedirect();
    } else if (hash === '#seat' && oldUrl !== '') {
      const dataToPass = {
        from: 'AddonApp',
        mfToOpen: CONSTANTS.EVENT_TOGGLE_SECTION_ACTION_SEAT,
      };
      const event = new CustomEvent(CONSTANTS.MAKE_ME_EXPAND_V2, {
        bubbles: true,
        detail: dataToPass,
      });
      // dispatching event to catch the event in passengerdetails component and toggle the addon
      document.dispatchEvent(event);
    }
  };

  useEffect(() => {
    /** HANDLING BROWSER BACK BUTTON EVENT */
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (isModifyFlow) {
      /* Old Code:
      const dataToPass = {
        from: 'addonApp',
        isLoading: false,
      };
      setTimeout(() => {
        document.dispatchEvent(
          dispatchLoadingEvent({
            bubbles: true,
            detail: { ...dataToPass },
          }),
        );
      }, 1000); */

      dispatch({
        type: addonActions.IS_ADDON_EXPANDED,
        payload: true,
      });
      dispatch({
        type: addonActions.IS_ADDON_ENABLE_CHANGE,
        payload: false,
      });

      eventService.reset();
      dispatch({ type: addonActions.UNMOUNT_ADDONCONTAINER });

      const authToken = cookies[addonCookies.AUTH_TOKEN];
      if (authToken && authToken?.token) {
        flightSrrAddon(dispatch, page, isMobile, isModifyFlow);
      }
    }
  }, [isModifyFlow]);

  useEffect(() => {
    if (
      document.getElementById('__addon__microapp__dev-only') &&
      getAddonData
    ) {
      const paxDetailFromPE = getAddonData?.Passengers;
      if (paxDetailFromPE && paxDetailFromPE.length > 0) {
        setPaxDetailsCommon(paxDetailFromPE);
        dispatch({
          type: addonActions.GET_PASSENGER_DATA,
          payload: paxDetailFromPE,
        });
      }
      if (
        document
          .querySelector('.main-addon-container')
          ?.classList.contains('d-none')
      ) {
        document
          .querySelector('.main-addon-container')
          .classList.remove('d-none');
      }
      dispatch({
        type: addonActions.IS_ADDON_EXPANDED,
        payload: true,
      });
      dispatch({
        type: addonActions.IS_ADDON_ENABLE_CHANGE,
        payload: false,
      });
    }
  }, [!paxDetailsCommon, getAddonData]);

  // TD:
  // React.useEffect(() => {
  //   if (document.getElementById('__addon__microapp__dev-only')) {
  //     flightSrrAddon(dispatch, page);
  //   }
  // }, []);

  // TD: Update sellAddonSsr as deep clone.
  const onChangeHandler = () => {
    setIsChecked(!isChecked);
    AddSameAmenities(
      addonActions,
      isChecked,
      setGetSelectedAddon,
      sellAddonSsr,
      setGetSportsEquipment,
      setSellSportsEquipment,
      additionalBaggageData,
      setGetBar,
      setGetGoodNight,
      state.confirmedMeals,
      getAddonData,
      tripIndex,
      categoryCodes,
      excessBaggageData,
      newAddonData,
      dispatch,
      state.totalMealsPriceCount,
      mfData,
    );
  };

  const setTripIndex = (newTripIndex) => {
    const paxIndexNew = [];
    if (!paxIndexNew[newTripIndex]) {
      paxIndexNew[newTripIndex] = [];
    }
    paxIndexNew[newTripIndex] = {
      paxIndex: 0,
    };

    dispatch({
      type: addonActions.SET_TRIP_INDEX,
      payload: { paxIndexNew, tripIndex: newTripIndex },
    });
  };

  const getAllMandatorySegmentPath = () => {
    const compareArry = [];
    const eachTrip = getAddonData?.ssr[tripIndex];
    // Old Code:
    // getAddonData?.ssr?.forEach((eachTrip, tripIdx) => {
    eachTrip.segments.forEach((eachSegment) => {
      return eachSegment.segmentSSRs?.forEach((eachssr) => {
        if (eachssr.category === categoryCodes.meal && eachssr.isMandatory) {
          // Old Code:
          // compareArry.push(`${tripIdx}.${eachSegment.segmentKey}`);
          compareArry.push(`${tripIndex}.${eachSegment.segmentKey}`);
        }
      });
    });
    // Old Code:
    // });

    return compareArry;
  };

  const checkMissingMandatoryMealSelection = () => {
    const compareArry = getAllMandatorySegmentPath();
    const totalNumOfPax = getAddonData.Passengers.length;

    return compareArry?.some((trueString) => {
      const trueObj = get(state.confirmedMeals, trueString);

      if (trueObj) {
        const arrayOfKey = Object.keys(trueObj);

        return (
          arrayOfKey.filter((key) => {
            return !!trueObj[key];
          }).length !== totalNumOfPax
        );
      }
      return true;
    });
  };

  const flexiSuper6ECorpMandatoryMeal = () => {
    // Old Code:
    // const isMandatoryWarning = getAddonData?.ssr?.some((eachTrip) => {
    const eachTrip = getAddonData?.ssr[tripIndex];
    const isMandatoryWarning = eachTrip.segments.some((eachSegment) => {
      return eachSegment.segmentSSRs?.some((eachssr) => {
        let ssrCheck = false;

        if (eachTrip?.productClass === productClassCodes.super6e) {
          // super6e
          const hasCpmlTakenSsr = eachssr.takenssr.some((takenItem) => {
            return takenItem.ssrCode === ssrCodes.cpml;
          });

          ssrCheck =
              eachssr.category === categoryCodes.meal && hasCpmlTakenSsr
                ? false
                : eachssr.isMandatory;
        } else if (
          eachTrip?.productClass === productClassCodes.flexi ||
            eachTrip?.productClass === productClassCodes.corp
        ) {
          // Flexi or Corp
          ssrCheck =
              eachssr.category === categoryCodes.meal && eachssr.isMandatory;
        }

        return ssrCheck;
      });
    });
    // Old Code:
    // });

    if (isMandatoryWarning) {
      return checkMissingMandatoryMealSelection();
    }
    return false;
  };

  // Old Code:
  // const getFareTypeMandatoryMessage = () => {
  //   const fareDetails = mfData?.fareType?.find(
  //     (fare) => {
  //       return fare?.productClass === getAddonData?.ssr[tripIndex]?.productClass;
  //     },
  //   );
  //   return mfData.selectIncludedSsrInFareDescription?.replace(
  //     '{}',
  //     fareDetails?.fareLabel,
  //   );
  // };

  const continueLabel = useMemo(() => {
    let continueLabelText = mfData?.nextSectionLabel || 'Next';
    const isUnaccompaniedMinor = isUnaccompaniedMinorSearch(getPassengerDetails);

    if (isUnaccompaniedMinor) {
      continueLabelText =
        mfData?.continueToPaymentCtaLabel || 'Continue to Payment';
    } else if (isModifyFlow) {
      if (isModifyFlow === CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
        continueLabelText = mfData?.nextSectionLabel;
      } else {
        continueLabelText = mfData?.modificationContinueCtaLabel || 'Continue';
      }
    }

    return continueLabelText;
  }, [isModifyFlow]);

  const submitFormHandler = async () => {
    // Uncomment the below code for local/develop purpose
    // const authToken = { token: 'test' } || cookies[addonCookies.AUTH_TOKEN];
    const authToken = cookies[addonCookies.AUTH_TOKEN];
    setVoucherToggle(false);
    setIsAddonDataProcessed(false);
    if (authToken && authToken?.token) {
      dispatch({
        type: addonActions.IS_ADDON_SUBMITTED,
        payload: true,
      });

      const paxPayload = cloneDeep(paxDetailsPayload);
      const paxPayLoadFinal = {
        passengers: paxPayload.passengers,
        extraSeatKeys,
      };
      let passengerPostResponse;

      if (isPassengerPostRequired) {
        passengerPostResponse = await passengerPost(
          {
            data: paxPayLoadFinal,
            errors: null,
          },
          dispatch,
          page,
          isModifyFlow,
          state.loggedInLoyaltyUser,
        );
      }

      if (passengerPostResponse?.data?.success || !isPassengerPostRequired) {
        const sellBundlePostData = sellBundleDataForPrimMlst(state);
        // Remove categoryName and ssrCategory from Post Request.
        const sellSsrPostData = sellAddonSsr.map(
          ({ categoryName, ssrCategory, ...ssr }) => ssr,
        );

        const mealData = mergeCouponCodes(
          state.confirmedMeals,
          state.mealVoucherData,
        );

        const tiffinPrimeSeatandeatSellArry = sellMealDataForTiffinPrimMlst(
          mealData,
          voucherToggle,
          state.mealVoucherData,
        );
        const sellSsrTiffinPrimeSeatandeat = tiffinPrimeSeatandeatSellArry.map(
          ({ ssrCategory, ...ssr }) => ssr,
        );

        const tiffinPrimSeatandeatRemoveSsrArry =
          removeSoldSsrForTiffinPrimMlst(
            state.confirmedMeals,
            state.takenMeals,
            sellBundlePostData,
          );

        const removeSoldSsrTiffinPrimSeatandeat =
          tiffinPrimSeatandeatRemoveSsrArry.map((item) => {
            return { ssrRemoveKeys: item.takenSsrKey };
          });

        const sellSsrPostDataSSRs = sellSsrPostData.map(({ ssrKey }) => ssrKey);
        let ssrRemoveRequest = [];

        removedAddonSsr?.forEach((ssr) => {
          if (!sellSsrPostDataSSRs.includes(ssr.ssrKey)) {
            ssrRemoveRequest.push({ ssrRemoveKeys: ssr.ssrKey });
          }
        });
        // When user apply voucher to already sold meal then we need to pass taken ssr to remove request
        const { takenSsrKeysWithCoupon, takenSellSsrMealKeysWithoutCoupon } =
          handelTakenSSRkeyRemoval(
            mealData,
            getAddonData?.Loyalty?.redeemCoupons,
            state.mealVoucherData,
          );
        const sellSSrPostKeys = removeDuplicatesBySsrKey([
          ...sellSsrTiffinPrimeSeatandeat,
          ...takenSellSsrMealKeysWithoutCoupon,
        ]);
        // checking and removing any duplicate removeSsrKeys
        const removeDuplicateKeys = (arr) => {
          const key = new Set();
          return arr.filter((item) => {
            if (key.has(item.ssrRemoveKeys)) return false;
            key.add(item.ssrRemoveKeys);
            return true;
          });
        };
        const ssrRemoveKeys = removeDuplicateKeys([
          ...ssrRemoveRequest,
          ...removeSoldSsrTiffinPrimSeatandeat,
          ...ssrMealCouponRemoveRequest,
          ...takenSsrKeysWithCoupon,
        ]);
        ssrRemoveRequest = ssrRemoveKeys;
      
        sellSSRs({
          isMobile,
          getAddonData,
          sellAddonSsr: sellSsrPostData,
          sellMealSsr: sellSSrPostKeys,
          sellBundle: sellBundlePostData,
          getPassengerDetails,
          dispatch,
          authToken,
          ssrRemoveRequest,
          mfData,
          page,
          analyticsSellAddonSSR: [
            ...sellAddonSsr,
            ...tiffinPrimeSeatandeatSellArry,
            ...sellBundlePostData,
          ],
          isInternational: isInternationalFlight,
          continueLabel,
          isModifyFlow,
          isBackFlow: false,
          totalEarnPoints,
          totalBurnPoints,
        });
      } else {
        // Old Code:
        // setDefaultVariation(buttonVariation.default);
        // Error scenario's are handled in passengerPost and sellSSRs api
      }
    } else {
      const refreshTokenEvent = (eventData) => new CustomEvent(CONSTANTS.REFRESH_TOKEN_V2, eventData);

      document.dispatchEvent(
        refreshTokenEvent({
          bubbles: true,
          detail: {
            type: 'sessiontimout',
            status: 'show',
            doPageReloadAfterAPI: true,
          },
        }),
      );
    }
  };

  const onLoginSuccess = async () => {
    dispatch({
      type: addonActions.SET_IS_AUTHENTICATED,
      payload: true,
    });
    dispatch({
      type: addonActions.SET_LOGGED_USER,
      payload: Cookies.get('auth_user', true, true),
    });

    // TD: Update after api respoce available
    if (!window.disableLoyalty && loyaltyLoggedInData?.loyaltyMemberInfo?.FFN) {
      flightSrrAddon(dispatch, page || 'passenger-edit', isMobile, isModifyFlow);
    }
  };

  const onLogoutSuccess = async () => {
    dispatch({
      type: addonActions.SET_IS_AUTHENTICATED,
      payload: false,
    });
  };

  useEffect(() => {
    document.addEventListener(LOGIN_SUCCESS, onLoginSuccess);
    document.addEventListener(LOGOUT_SUCCESS, onLogoutSuccess);
    document.addEventListener(LOYALTY_LOGIN_SUCCESS, onLoginSuccess);

    const obj = localStorage.getItem('journeyReview');
    const parsedObj = JSON.parse(obj) || {};
    setExtraSeatKeys(parsedObj?.extraSeatKeys || []);
    setTotalEarnPoints(parsedObj?.priceBreakdown?.totalPotentialPoints || 0);
    setTotalBurnPoints(parsedObj?.priceBreakdown?.pointsBalanceDue || 0);
  }, []);

  useEffect(() => {
    if (upSellPopup.submitAddon) {
      submitFormHandler();
    }
  }, [upSellPopup]);

  const handleClick = () => {
    /* Old Code:
    if (flexiSuper6ECorpMandatoryMeal()) {
      return setOpenMadatoryMessageToast(true);
    } */
    // upSellPopup if no any action Taken
    /* Old Code:
    if (upSellPopup?.actionTakenLB === false) {
      dispatch({
        type: addonActions.SET_UPSELL_POPUP_DATA,
        payload: { showLBUpsellPopup: true, actionTakenLB: true },
      });
      return;
    }

    if (upSellPopup?.actionTakenTA === false) {
      dispatch({
        type: addonActions.SET_UPSELL_POPUP_DATA,
        payload: { showTAUpsellPopup: true, actionTakenTA: true },
      });
      return;
    } */

    submitFormHandler();
  };

  const handleSkipPopup = () => {
    setIsAddonPopupEnabled(false);
    setIsAddonPopupResponded(true);
  };

  const handleAddPopup = () => {
    setIsAddonPopupEnabled(false);
    setIsAddonPopupResponded(true);
  };

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

  const checkIfPopupEnabled = (enablePopupForArray, selectedAddon) => {
    return enablePopupForArray.some((addonName) => {
      return selectedAddon.find((addon) => {
        if (addon.addonName === getAddonTitle(categoryCodes.meal)) {
          let segmentSelectedCount = 0;
          state.selectedMeals.forEach((mealData) => {
            if (mealData) {
              const keyArray = Object.keys(mealData);
              getAddonData?.ssr[tripIndex]?.segments.forEach((seg) => {
                if (keyArray.indexOf(seg.segmentKey) > -1) {
                  segmentSelectedCount += 1;
                }
              });
            }
          });
          return segmentSelectedCount === 1;
        }
        // if (addon.addonName === '6E Eat') {
        //   let isAllSegmentSelected = true;
        //   state.selectedMeals.forEach((mealData) => {
        //     if (mealData) {
        //       const keyArray = Object.keys(mealData);
        //       getAddonData?.ssr[tripIndex]?.segments.forEach((seg) => {
        //         if (keyArray.indexOf(seg.segmentKey) === -1) {
        //           isAllSegmentSelected = false;
        //         }
        //       });
        //     }
        //   });
        //   return isAllSegmentSelected;
        // }
        return addon.addonName === addonName;
      });
    });
  };

  const checkIfOnePassengerSelected = (selectedAddon, onlyTripAddonArray) => {
    if (selectedAddon.length === 1) {
      return true;
    }
    const firstPassengerKey = selectedAddon[0].passengerKey;
    let allSame = true;
    selectedAddon.forEach((item) => {
      if (item.passengerKey !== firstPassengerKey && onlyTripAddonArray.indexOf(item.addonName) === -1) {
        allSame = false;
      }
    });

    return allSame;
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

  const checkAvailabilityOfJourneySsrCode = (trip, ssrCodeArray) => {
    let isAnySsrCodeAvailable = false;
    ssrCodeArray.forEach((ssrCode) => {
      trip.journeySSRs.forEach((journeySsr) => {
        const newwSsrDataArray = journeySsr.ssrs.filter((obj) => obj.ssrCode === ssrCode);
        if (newwSsrDataArray.length > 0) {
          isAnySsrCodeAvailable = true;
        }
      });
    });

    return isAnySsrCodeAvailable;
  };

  const checkAvailabilityOfBundleSsrCode = (journeyKey, ssrCodeArray, segments) => {
    const bundleArray = getAddonData?.bundles;
    let isAnySsrCodeAvailable = false;
    const segmentSsrCodeArray = [];
    bundleArray.forEach((bundle) => {
      if (bundle.bundleCode === ssrCodeArray[0]) {
        const newPricesByJourney = bundle.pricesByJourney.filter((obj) => obj.journeyKey === journeyKey);
        if (newPricesByJourney.length > 0) {
          isAnySsrCodeAvailable = true;
        }
        if (isAnySsrCodeAvailable) {
          let selectedSegmentKey = '';
          let selectedPassengerKey = '';
          let selectedMealArray = [];
          state.selectedMeals.forEach((selectedMeal) => {
            if (selectedMeal) {
              [selectedSegmentKey] = Object.keys(selectedMeal);
              [selectedPassengerKey] = Object.keys(selectedMeal[selectedSegmentKey]);
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

  const refineTripForPopup = (selectedAddon, tripArray) => {
    const newTripArray = [];
    selectedAddon.forEach((addon) => {
      tripArray.forEach((trip) => {
        const isNextTrip = !!((trip?.productClass === productClassCodes.next
          || trip?.productClass === productClassCodes.nextPlus));
        if (newTripArray.indexOf(trip) === -1 && !isNextTrip) {
          const segmentSsrCodeArray = [];
          const journeySsrCodeArray = [];
          const bundleSsrCodeArray = [];
          if (getAddonTitle(categoryCodes.meal) === addon.addonName) {
            let selectedMealArray = [];

            state.selectedMeals.forEach((selectedMeal) => {
              if (selectedMeal) {
                const [selectedSegmentKey] = Object.keys(selectedMeal);
                const [selectedPassengerKey] = Object.keys(selectedMeal[selectedSegmentKey]);

                try {
                  if (selectedMeal[selectedSegmentKey] && selectedMeal[selectedSegmentKey][selectedPassengerKey]) {
                    selectedMealArray = JSON.parse(
                      JSON.stringify(selectedMeal[selectedSegmentKey][selectedPassengerKey]),
                    );
                  } else {
                    selectedMealArray = [];
                  }
                } catch {
                  selectedMealArray = [];
                }
              }
            });
            selectedMealArray.forEach((mealData) => {
              segmentSsrCodeArray.push(mealData.meal.ssrCode);
            });
          }
          if (getAddonTitle(categoryCodes.bar) === addon.addonName) {
            segmentSsrCodeArray.push(addon.ssrCode);
          }
          if (getAddonTitle(categoryCodes.goodNight) === addon.addonName) {
            const goodNightSelectedData = getSelectedSectorAndSsrkey(setGetGoodNight);
            const segmentArray = trip.segments;
            segmentArray.forEach((segment) => {
              const tripName = `${segment.segmentDetails?.origin}-${segment.segmentDetails?.destination}`;
              if (tripName === goodNightSelectedData.addonSegment) {
                const segmentSSRs = segment.segmentSSRs.filter((obj) => obj.category === categoryCodes.goodNight);
                const segmentSSRsArray = segmentSSRs[0]?.ssrs || [];
                segmentSSRsArray.forEach((ssr) => {
                  ssr.passengersSSRKey.forEach((passengerSSR) => {
                    if (passengerSSR.passengerKey === addon.passengerKey
                    ) {
                      goodNightSelectedData.selectedSsrKey.forEach((ssrKey) => {
                        if (passengerSSR.ssrKey === ssrKey) {
                          segmentSsrCodeArray.push(ssr.ssrCode);
                        }
                      });
                    }
                  });
                });
              }
            });
          }
          if (getAddonTitle(categoryCodes.baggage) === addon.addonName
        || getAddonTitle(categoryCodes.abhf) === addon.addonName
      || getAddonTitle(categoryCodes.speq) === addon.addonName) {
            journeySsrCodeArray.push(addon.ssrCode);
          }

          if (getAddonTitle(categoryCodes.ffwd) === addon.addonName) {
            journeySsrCodeArray.push(categoryCodes.ffwd);
          }

          if (getAddonTitle(categoryCodes.mlst) === addon.addonName
          && bundleSsrCodeArray.indexOf(categoryCodes.mlst) === -1) {
            bundleSsrCodeArray.push(categoryCodes.mlst);
          }

          if (getAddonTitle(categoryCodes.prim) === addon.addonName
          && bundleSsrCodeArray.indexOf(categoryCodes.prim) === -1) {
            bundleSsrCodeArray.push(categoryCodes.prim);
          }

          if (checkAvailabilityOfSegmentSsrCode(trip.segments, segmentSsrCodeArray)
            || checkAvailabilityOfJourneySsrCode(trip, journeySsrCodeArray)
          || checkAvailabilityOfBundleSsrCode(trip.journeyKey, bundleSsrCodeArray, trip.segments)) {
            newTripArray.push(trip);
          }
        }
      });
    });

    setElligibleTripsForPopup([...newTripArray]);
    return newTripArray;
  };

  const checkAndOpenAddonPopup = () => {
    // comment for local testing
    if (isChangeFlow || isModifyFlow || isNextFare
      || (getAddonData?.ssr.length <= 1 && getPassengerDetails.length <= 1)) {
      return false;
    }

    const enablePopupCategoryCodeArray = [
      categoryCodes.meal,
      categoryCodes.goodNight,
      categoryCodes.speq,
      categoryCodes.bar,
      categoryCodes.baggage,
      categoryCodes.abhf,
      categoryCodes.ffwd,
      categoryCodes.mlst,
      categoryCodes.prim,
    ];

    const onlyTripAddonCategoryCodeArray = [
      categoryCodes.ffwd,
      categoryCodes.mlst,
      categoryCodes.prim,
    ];
    const enablePopupForArray = [
      // '6E Eats',
      // 'Sleep essentials',
      // 'Add Sports Equipment',
      // 'One for the skies',
      // 'Excess Baggage',
      // 'Baggage',
      // 'Add Additional Bags',
      // 'Fast Forward',
      // '6E Seat And  Eat',
      // '6E Prime',
    ];
    const onlyTripAddonArray = [
      // 'Fast Forward',
      // '6E Seat And  Eat',
      // '6E Prime',
    ];

    enablePopupCategoryCodeArray.forEach((categoryCode) => {
      categoriesList.forEach((item) => {
        if (categoryCode === item.categoryBundleCode) {
          enablePopupForArray.push(item.title);
        }
      });
    });

    onlyTripAddonCategoryCodeArray.forEach((cCode) => {
      categoriesList.forEach((item) => {
        if (cCode === item.categoryBundleCode) {
          onlyTripAddonArray.push(item.title);
        }
      });
    });

    let isPopupOpen = false;
    let count = 0;
    let selectedAddon = [];
    if (!isAddonPopupResponded) {
      Object.keys(setGetSelectedAddon).forEach((index) => {
        if (setGetSelectedAddon[index]?.selectedAddone.length >= 1) {
          count += 1;
          selectedAddon = [...setGetSelectedAddon[index].selectedAddone];
        }
      });

      const newTripArray = refineTripForPopup(selectedAddon, getAddonData?.ssr);
      if (newTripArray.length === 0) {
        return false;
      }
      if (newTripArray.length === 1 && getPassengerDetails.length <= 1) {
        return false;
      }

      let onlyBundleSelected = true;
      const totalTripsLength = getAddonData?.ssr?.length || 1;
      selectedAddon.forEach((addon) => {
        if (onlyTripAddonArray.indexOf(addon.addonName) === -1) {
          onlyBundleSelected = false;
        }
      });
      if ((!onlyBundleSelected || totalTripsLength > 1) && count === 1 &&
          checkIfOnePassengerSelected(selectedAddon, onlyTripAddonArray)) {
        isPopupOpen = checkIfPopupEnabled(enablePopupForArray, selectedAddon);
      }

      setIsAddonPopupEnabled(isPopupOpen);
    }
    return isPopupOpen;
  };

  const handleNext = () => {
    if (!isExpanded) {
      return;
    }
    if (!window.location.hash?.toLowerCase()?.includes('seat')) {
      window.location.hash = 'addon';
    }
    // Uncomment the below code for WEB-48
    if (checkAndOpenAddonPopup()) {
      return;
    }
    if (flexiSuper6ECorpMandatoryMeal()) {
      setOpenMadatoryMessageToast(true);
      return;
    }
    const totalTripsLength = getAddonData?.ssr?.length || 1;

    if (window.pageType === CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
      handleClick();
      return;
    }

    if (tripIndex < (totalTripsLength - 1)) {
      setTripIndex(tripIndex + 1);
    } else {
      handleClick();
    }
  };

  useCustomEventListener(CONSTANTS.ONCLICK_NEXT_FARE_SUMMARY_V2, handleNext);

  useCustomEventListener('REVIEW_SUMMARY_API_DATA', (event) => {
    setExtraSeatKeys(event?.fareSummaryData?.extraSeatKeys || []);
    setTotalEarnPoints(event?.fareSummaryData?.priceBreakdown?.totalPotentialPoints || 0);
    setTotalBurnPoints(event?.fareSummaryData?.priceBreakdown?.pointsBalanceDue || 0);
  });

  /* Old Code:
  const mainCardContainer = () => {
    const passengerDetail = getPassengerDetails ?? [];

    const pIndex = get(paxIndex, [tripIndex, paxIndex], 0);
    const passenger = passengerDetail[pIndex] ?? {};

    return (
      <CardContainer
        getAddonData={getAddonData}
        sliderPaneConfigData={
          containerConfigData?.configJson?.data?.addonAdditionalByPath
            ?.item
        }
        addonsContainer={mfData}
        passengerDetails={passengerDetail}
        key={passenger.passengerKey}
        passengerKey={passenger.passengerKey}
        passenger={passenger}
        tripId={tripIndex}
        isModifyFlow={isModifyFlow}
      />
    );
  }; */

  React.useEffect(() => {
    const newPaxDetails = cloneDeep(paxDetailsPayload);
    newPaxDetails.passengers = cloneDeep(getPassengerDetails);
    setPaxDetailsPayload(newPaxDetails);
  }, [getPassengerDetails]);

  React.useEffect(() => {
    // added below code to handle when user reload page when in addon section.
    // there will not be any passenger data, hence we have redirect user to passengerpage
    // once we move passengerpost to passenger-edit MF then we can remove below code.
    if (!getPassengerDetails?.[0]?.name?.first && getTrips?.ssr?.length > 0) {
      backRedirect();
    }
  }, [getPassengerDetails, getTrips]);

  React.useEffect(() => {
    setIsExpanded(isAddonExpanded);
  }, [isAddonExpanded]);

  React.useEffect(() => {
    setIsSubmitted(isAddonSubmitted || isSubmitted);
    /* Old Code:
    if (isAddonSubmitted) {
      setDefaultVariation(buttonVariation.loading);
    } else {
      setDefaultVariation(buttonVariation.default);
    } */

    const fareSummaryLoaderButtonEvent = (data) => new CustomEvent(CONSTANTS.EVENT_FARE_SUMMARY_DATA_TRANSFER, data);
    document.dispatchEvent(
      fareSummaryLoaderButtonEvent({
        bubbles: true,
        detail: { isLoading: isAddonSubmitted },
      }),
    );
  }, [isAddonSubmitted]);

  /* Old Code:
  React.useEffect(() => {
    setIsChange(isAddonEnableChange);
  }, [isAddonEnableChange]); */

  React.useEffect(() => {
    setIsChangeFlow(isAddonChangeFlow);
  }, [isAddonChangeFlow]);

  React.useEffect(() => {
    setIsNextFare(isAddonNextFare);
  }, [isAddonNextFare]);

  React.useEffect(() => {
    setAddonErrorData(setAddonError);
  }, [setAddonError]);

  React.useEffect(() => {
    /* Enable for redirection:
    if (!setAddonIsLoading) {
      if (isModifyFlow) {
        const isPNRAvailable = getAddonData?.bookingDetails?.recordLocator;

        if (!isPNRAvailable) {
          location.href = location.origin;
        } else {
          setIsLoading(setAddonIsLoading);
        }
      } else {
        setIsLoading(setAddonIsLoading);
      }
    } else {
      setIsLoading(setAddonIsLoading);
    } */
    setIsLoading(setAddonIsLoading);

    const fareSummaryLoaderButtonEvent = (data) => new CustomEvent(CONSTANTS.EVENT_FARE_SUMMARY_DATA_TRANSFER, data);
    document.dispatchEvent(
      fareSummaryLoaderButtonEvent({
        bubbles: true,
        detail: { isLoading: setAddonIsLoading },
      }),
    );
  }, [setAddonIsLoading]);

  /* Old Code:
  const handleChangeExpand = () => {
    AnalyticHelper.onClickChange(page);
  }; */

  const errorToastCloseHandler = () => {
    dispatch({
      type: addonActions.SET_ADDON_ERROR,
      payload: {
        active: false,
        message: '',
      },
    });
  };

  const assignSummaryAmount = () => {
    const reviewSummaryAmountField = document.getElementById(
      'review-summary-totalAmountContent',
    );
    if (reviewSummaryAmountField) {
      // onload of the page- we will pick amount from review summary html
      //  otherwise the content wil be updated through event
      // setTotalAmount(reviewSummaryAmountField.textContent);
    }
  };

  useEffect(() => {
    assignSummaryAmount();
    document.addEventListener(
      CONSTANTS.EVENT_REVIEWSUMMARY_DATA_CHANGE,
      assignSummaryAmount,
    );

    return () => {
      document.removeEventListener(
        CONSTANTS.EVENT_REVIEWSUMMARY_DATA_CHANGE,
        assignSummaryAmount,
      );
    };
  }, []);
  /* Old Code:
  const onClickViewDetails = () => {
    const dataToPass = {
      sliderKey: 'flight',
      from: 'addon',
    };

    document.dispatchEvent(
      new CustomEvent(CONSTANTS.EVENT_REVIEWSUMMARY_OPENSLIDER, {
        detail: dataToPass,
      }),
    );
  }; */

  const getFareType = () => {
    const fareDetails = mfData?.fareType?.find(
      (fare) => {
        return fare?.productClass === getAddonData?.ssr[tripIndex]?.productClass;
      },
    );

    return fareDetails?.fareLabel;
  };

  const getFareTypeDetails = () => {
    const addonsContainer = mfData;
    return addonsContainer?.fareType?.find(
      (fare) => {
        return (
          fare?.productClass === getAddonData?.ssr[tripIndex]?.productClass
        );
      },
    );
  };

  const getAddon = (addon) => {
    const segmentData = getAddonData?.ssr[tripIndex];
    const addonsContainer = mfData;
    const sliderPaneConfigData = containerConfigData?.configJson?.data?.addonAdditionalByPath
      ?.item;
    const passengerDetail = getPassengerDetails ?? [];
    const pIndex = get(paxIndex, [tripIndex, paxIndex], 0);
    const passenger = passengerDetail[pIndex] ?? {};
    const fareDetails = getFareTypeDetails();

    if (getAddonData) {
      const newComibneAddons = getSSRData(
        getAddonData,
        addonsContainer,
        sliderPaneConfigData,
        tripIndex,
        getPassengerDetails,
      );

      const addonData = newComibneAddons.find((addonDetails) => {
        return addonDetails.categoryBundleCode === addon.categoryBundleCode;
      });

      switch (addon.categoryBundleCode) {
        case categoryCodes.prim: {
          if (!state.mlstBundleFare[tripIndex]?.isSelected && addonData) {
            if (Object.keys(addonData).length < 1) {
              return null;
            }
            return (
              <Prime
                segmentData={segmentData}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={categoryCodes.prim}
              // TD: - we can keep this as 0 also or first passenger key from the list
                passengerKey={passenger.passengerKey}
                passengerDetails={passengerDetail}
                tripId={tripIndex}
                selectedPax={passengerDetail[paxIndex[tripIndex].paxIndex]}
                fareDetails={fareDetails}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
                recomendedData={addon}
                isRecommended
                isOpenPrime={isOpenPrime}
                setIsOpenPrime={setIsOpenPrime}
                setOpenMemberBenifit={setOpenMemberBenifit}
              />
            );
          }
          return null;
        }
        case categoryCodes.mlst: {
          if (!state.primBundleFare[tripIndex]?.isSelected && addonData) {
            return (
              <SeatAndEat
                segmentData={segmentData}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={categoryCodes.mlst}
                passengerKey={passenger.passengerKey}
                passengerDetails={passengerDetail}
                tripId={tripIndex}
                selectedPax={passengerDetail[paxIndex[tripIndex].paxIndex]}
                fareDetails={fareDetails}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
                recomendedData={addon}
                isRecommended
              />
            );
          }
          return null;
        }
        case categoryCodes.meal: {
          if (isOpenSlider) {
            return (
              <Tiffin
                segmentData={segmentData}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={categoryCodes.meal}
                passengerKey={passenger.passengerKey}
                passengerDetails={passengerDetail}
                tripId={tripIndex}
                selectedPax={passengerDetail[paxIndex[tripIndex].paxIndex]}
                fareDetails={fareDetails}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
                isMainCard
                onClose={() => setOpenSlider(false)}
                recomendedData={addon}
              />
            );
          }
          return null;
        }
        case categoryCodes.prot:
        case categoryCodes.ifnr: {
          if (addonData) {
            return (
              <AddOnListMapper
                ssrCategory={addon.categoryBundleCode}
                addonData={addonData}
                configData={addonsContainer}
                passengerDetails={passengerDetail}
                paxIndex={paxIndex}
                passengerKey={passenger.passengerKey}
                tripId={tripIndex}
                segmentData={segmentData}
                sliderPaneConfigData={sliderPaneConfigData}
                isRecommended
                recomendedData={addon}
                isModifyFlow={isModifyFlow}
              />
            );
          }
          return null;
        }
        case categoryCodes.brb: {
          if (addonData) {
            return (
              <LostBaggageProtectionMapper
                ssrCategory={categoryCodes.brb}
                addonData={addonData}
                configData={addonsContainer}
                passengerDetails={passengerDetail}
                paxIndex={paxIndex}
                passengerKey={passenger.passengerKey}
                tripId={tripIndex}
                segmentData={segmentData}
                sliderPaneConfigData={sliderPaneConfigData}
                isRecommended
                recomendedData={addon}
                isModifyFlow={isModifyFlow}
              />
            );
          }
          return null;
        }
        case categoryCodes.ffwd: {
          if (addonData) {
            return (
              <FastForward
                segmentData={segmentData}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={categoryCodes.ffwd}
                passengerDetails={passengerDetail}
                paxIndex={paxIndex}
                passengerKey={passenger.passengerKey}
                tripId={tripIndex}
              // key={key}
                sliderPaneConfigData={sliderPaneConfigData}
                isRecommended
                recomendedData={addon}
                isModifyFlow={isModifyFlow}
              />
            );
          }
          return null;
        }
        default:
          return null;
      }
    }
    return null;
  };

  // TD: for later reference
  // let saverCategory = [categoryCodes.mlst, categoryCodes.prim, categoryCodes.ffwd];
  // if (state.mlstBundleFare[tripIndex]?.isSelected) {
  //   saverCategory = [categoryCodes.mlst, categoryCodes.ffwd];
  // } else if (state.primBundleFare[tripIndex]?.isSelected) {
  //   saverCategory = [categoryCodes.prim, categoryCodes.ffwd];
  // }
  // const super6ECategory = [
  //   categoryCodes.prot,
  //   categoryCodes.ifnr,
  //   categoryCodes.brb,
  // ];
  // const flexiFareCategory = [categoryCodes.ffwd, categoryCodes.brb, categoryCodes.prot];
  // let fareCategory = saverCategory;
  // if (getFareType() === FARE_TYPE.SUPER_6E) {
  //   fareCategory = super6ECategory;
  // } else if (getFareType() === FARE_TYPE.FLEXI_FARE) {
  //   fareCategory = flexiFareCategory;
  // }

  const fareCategoryData = () => {
    let fareCategory = [];
    let whatsIncludedData = [];
    fareType?.forEach((fType) => {
      if (fType.productClass === getAddonData?.ssr[tripIndex]?.productClass) {
        fareCategory = fType.recomendedData
          ? [...fType.recomendedData,
          ] : [];

        whatsIncludedData = fType.whatsIncludedData
          ? [...fType.whatsIncludedData,
          ] : [];
      }
    });
    fareCategory = fareCategory.filter((f) => f);

    let categoryCode = null;
    if (state.mlstBundleFare[tripIndex]?.isSelected) {
      categoryCode = categoryCodes.prim;
    } else if (state.primBundleFare[tripIndex]?.isSelected) {
      categoryCode = categoryCodes.mlst;
    } else if (istravelAssistanceAddedFromPE) {
      categoryCode = categoryCodes.prot;
    }
    const fareFilterData = fareCategory.filter((category) => category.categoryBundleCode !== categoryCode);

    const carouselData = [];
    fareFilterData?.forEach((category) => {
      if (getAddon(category)) {
        carouselData.push(category);
      }
    });
    setFareCategory(carouselData);

    const nextCarouselList = [];
    whatsIncludedData?.forEach((addon) => {
      const carouselItem = {
        title: addon?.title,
        addonSelected: true,
        imageText: addon?.title,
        disableCTA: true,
        hideRemoveCTA: true,
        addedLabel: `${mfData?.addedLabel}`,
        image: addon?.tileImage?._publishUrl,
      };

      nextCarouselList.push(carouselItem);
    });
    setNextCarouselData(nextCarouselList);
  };

  useEffect(() => {
    if (getAddonData) {
      fareCategoryData();
      if ((getAddonData?.ssr[tripIndex]?.productClass === productClassCodes.next
        || getAddonData?.ssr[tripIndex]?.productClass === productClassCodes.nextPlus) && !window.disableProjectNext) {
        dispatch({
          type: addonActions.IS_ADDON_NEXT_FARE,
          payload: true,
        });
        dispatch({
          type: addonActions.ADDON_NEXT_FARE_TYPE,
          payload: getAddonData?.ssr[tripIndex]?.productClass,
        });
      } else {
        dispatch({
          type: addonActions.IS_ADDON_NEXT_FARE,
          payload: false,
        });
        dispatch({
          type: addonActions.ADDON_NEXT_FARE_TYPE,
          payload: '',
        });
      }

      if (!window.disableLoyalty && state?.loggedInUser?.loyaltyMemberInfo?.FFN) {
        dispatch({
          type: addonActions.SET_ISLOYALTY_FLOW,
          payload: true,
        });
      }
    }
  }, [getAddonData]);

  useEffect(() => {
    fareCategoryData();
    if ((getAddonData?.ssr[tripIndex]?.productClass === productClassCodes.next
      || getAddonData?.ssr[tripIndex]?.productClass === productClassCodes.nextPlus) && !window.disableProjectNext) {
      dispatch({
        type: addonActions.IS_ADDON_NEXT_FARE,
        payload: true,
      });
      dispatch({
        type: addonActions.ADDON_NEXT_FARE_TYPE,
        payload: getAddonData?.ssr[tripIndex]?.productClass,
      });
    } else {
      dispatch({
        type: addonActions.IS_ADDON_NEXT_FARE,
        payload: false,
      });
      dispatch({
        type: addonActions.ADDON_NEXT_FARE_TYPE,
        payload: '',
      });
    }

    if (!window.disableLoyalty && state?.loggedInUser?.loyaltyMemberInfo?.FFN) {
      dispatch({
        type: addonActions.SET_ISLOYALTY_FLOW,
        payload: true,
      });
    }
  }, [
    state.mlstBundleFare[tripIndex]?.isSelected,
    state.primBundleFare[tripIndex]?.isSelected,
    tripIndex, istravelAssistanceAddedFromPE,
  ]);

  useEffect(
    () => {
      if (isAddonDataProcessed) getRedeemCoupons();
    },
    [isAddonDataProcessed],
  );

  const chipData = mfData?.fareType.find((fType) => fType.productClass === addonNextFareType);

  let showMemberContainer = mfData?.memberBenefitsDetails?.length
    && state.loggedInLoyaltyUser
    && (getAddonData?.Loyalty?.coupons?.length
      || getAddonData?.Loyalty?.redeemCoupons?.length);
  if (isModifyFlow && !(getAddonData?.Loyalty?.coupons?.length > 0)) {
    showMemberContainer = false;
  }

  return (
    <>
      {/* Do not use "In6e2" class for any styling.
      <div className="In6e2">
        {isModifyFlow && (
          <div
            className="passenger-edit-backbutton-placeholder"
            style={{ height: '21px' }}
          />
        )}
        {!isExpanded ? (
          <ExpandCollapse
            title={`2. ${mfData.addonstitle}`}
            actionButtonHandler={handleChangeExpand}
            isChange={isChange}
            isSubmitted={isSubmitted}
            mfData={mfData}
          />
        ) : (
          <>
            {isLoading && <Placeholder className="addon-shimmer" />}
            {!isLoading && (
              <div
                className={`main-addon-container ${
                  isModifyFlow ? 'addon--modifyflow' : 'addon--bookingflow'
                }`}
              >
                <ErrorBoundary>
                  <div className="row">
                    <div className="col-12">
                      <div className="row main-addon-container__container">
                        <div className="col-3 col-lg-3 col-md-3 main-addon-container__left">
                          <BookingDetail
                            configData={containerConfigData}
                            addonsContainer={mfData}
                            getAddonData={getAddonData}
                            setTripIndex={setTripIndex}
                            passengerDetails={
                              getPassengerDetails && getPassengerDetails.length
                                ? getPassengerDetails
                                : null
                            }
                            paxIndex={paxIndex}
                          />
                        </div>
                        <div className="col-9 col-lg-9 col-md-9 main-addon-container__right">
                          {mainCardConatiner()}
                          {openMadatoryMessageToast && (
                            <Toast
                              onClose={() => setOpenMadatoryMessageToast(false)}
                              containerClass=""
                              variation="notifi-variation--info"
                              description={getFareTypeMandatoryMessage()}
                            />
                          )}
                          <div className="continue-cta-container">
                            <div className="d-flex justify-content-end ">
                              <ContinueButton
                                label={continueLabel}
                                onClick={handleClick}
                                variation={defaultVariation}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 addon-continue-mobile">
                      <div className="addon-continue-mobile__left">
                        <span className="addon-continue-mobile__left--price">
                          {totalAmount}
                        </span>
                        <span
                          className="addon-continue-mobile__left--details"
                          onClick={onClickViewDetails}
                        >
                          {mfData?.viewDetailsLabel || `View Details`}
                        </span>
                      </div>
                      <div className="addon-continue-mobile__right">
                        <ContinueButton
                          label={continueLabel}
                          onClick={handleClick}
                          variation={defaultVariation}
                        />
                      </div>
                    </div>
                  </div>
                </ErrorBoundary>
              </div>
            )}

            {addonErrorData && addonErrorData?.active && (
              <Toast
                onClose={() => errorToastCloseHandler()}
                containerClass="addon-toast--error"
                variation="notifi-variation--error"
                description={addonErrorData?.message}
                title="Error"
              />
            )}
          </>
        )}
      </div> */}
      { isExpanded && (
        <>
          <div className="skyplus-addon-mf">
            {
          isLoading ? (
            <div className="skyplus-addon-mf__container">
              <div className="skyplus-addon-mf__shimmer">
                <Shimmer />
              </div>
            </div>
          ) : (
            <div className="skyplus-addon-mf__container">
              <div className="skyplus-addon-mf__head">
                {!isModifyFlow && !isMobile && (
                <div className="skyplus-addon-mf__head-back">
                  <button
                    type="button"
                    className="skyplus-accordion__icon icon-accordion-left-simple"
                    onClick={() => backRedirect()}
                    aria-label="Go back"
                  />
                  <button
                    type="button"
                    onClick={() => backRedirect()}
                    className="skyplus-addon-mf__head-back-btn link"
                  >
                    {mfData?.backToPassengerDetails || 'Back to Passenger Details'}
                  </button>
                </div>
                )}
                <DisplayJournies setTripIndex={setTripIndex} journeydetails={getAddonData?.ssr ?? []} />
                <div className="skyplus-addon-mf__head-title">
                  <h3 className="h0">
                    {mfData?.addOnsLabel}
                    {isNextFare
                      ?
                        <span className="skyplus-addon-mf__next-label">{chipData?.fareLabel}</span>
                      : `(${getFareType()})`}
                  </h3>
                  <h2
                    className="skyplus-addon-mf__sub-heading"
                    dangerouslySetInnerHTML={{
                      __html: !state.loggedInLoyaltyUser
                        ?
                        mfData?.description?.html
                        :
                        mfData?.loyaltyMemberBenefitsDescription?.html?.replace(
                          '{number}',
                          getAddonData?.Loyalty?.discount?.[0]?.discountPer,
                        ),
                    }}
                  />
                  {/* TD: {getAddon('MLST')} */}
                </div>
              </div>

              <div className="skyplus-addon-mf__content">
                {/* Old Code: {mainCardContainer()} */}
                { isNextFare && nextCarouselData?.length > 0 && (
                  <div
                    className="skyplus-addon-mf__carousel next-carousel"
                  >
                    <Carousel
                      title={mfData?.whatsIncludedLabel || 'What’s included'}
                      carouselData={nextCarouselData}
                      customClass="NextAddon"
                      isNextCarousel
                      ariaLabelNext="Next addon slide"
                      ariaLabelPrev="Previous addon slide"
                    >
                      {nextCarouselData.map((addon) => <AddonCard {...addon} />)}
                    </Carousel>
                  </div>
                )}
                { fareCat?.length > 0 && (
                  <div
                    className="skyplus-addon-mf__carousel addon-carousel"
                  >
                    <Carousel
                      title={mfData?.recommendedLabel}
                      carouselData={fareCat}
                      customClass="Addon"
                      isAddonCarousel
                      ariaLabelNext="Next addon slide"
                      ariaLabelPrev="Previous addon slide"
                      navArrowPos="inline"
                    >
                      {fareCat.map((category) => getAddon(category))}
                    </Carousel>
                  </div>
                )}
                <h4 className="skyplus-addon-mf__pax-title h4">{mfData?.selectAddOnsForAllPassenger}</h4>
                <DisplayPassenger
                  passengerDetails={getPassengerDetails ?? []}
                  containerConfigData={containerConfigData}
                  isModifyFlow={isModifyFlow}
                  isChangeFlow={isChangeFlow}
                  isNextFare={isNextFare}
                  onChangeHandler={onChangeHandler}
                  setCheckAmenities={setCheckAmenities}
                  checkAmenities={checkAmenities}
                  isChecked={isChecked}
                  sellAddonSsr={sellAddonSsr}
                  setIsChecked={setIsChecked}
                  fareCategory={fareCat}
                />

                {/* Loyalty Member login / Signup / Registartion Component  */}
                {!window.disableLoyalty && !loyaltyLoggedInData?.loyaltyMemberInfo?.FFN &&
                <LoyaltyLoginSignUp mfData={mfData} {...state} />}

                <div className={`skyplus-loyalty-addon-mf ${!showMemberContainer ? 'd-none' : ''}`}>
                  <MemberContainer
                    getAddonData={getAddonData}
                    mfData={mfData}
                    categoryCodes={categoryCodes}
                    tripIndex={tripIndex}
                    passengerDetails={getPassengerDetails ?? []}
                    bundleData={getAddonData?.bundles}
                    sliderConfiData={sliderConfiData}
                    additionSliderData={additionSliderData}
                    isChangeFlow={isChangeFlow}
                    isModifyFlow={isModifyFlow}
                    isVoucherSelected={isVoucherSelected}
                    setIsVoucherSelected={setIsVoucherSelected}
                    setVoucherToggle={setVoucherToggle}
                    isOpenSlider={isOpenSlider}
                    setOpenSlider={setOpenSlider}
                    isMealWithCoupon={isMealWithCoupon}
                    isOpenPrime={isOpenPrime}
                    setIsOpenPrime={setIsOpenPrime}
                    setOpenMemberBenifit={setOpenMemberBenifit}
                    openMemberBenifit={openMemberBenifit}
                  />
                </div>
                {openMadatoryMessageToast && (
                  // Old Code:
                  // <Toast
                  //   onClose={() => setOpenMadatoryMessageToast(false)}
                  //   containerClass=""
                  //   variation="notifi-variation--Information"
                  //   description={getFareTypeMandatoryMessage()}
                  // />
                  <ModalComponent modalWrapperClass="skyplus-addon-mf__modal">
                    <Heading
                      heading="h7"
                      mobileHeading="h8"
                    >
                      {mfData?.selectSnackPopup?.heading}
                    </Heading>
                    <div
                      className="body-small-regular skyplus-addon-mf__modal-content mt-4"
                      dangerouslySetInnerHTML={{
                        __html: mfData?.selectSnackPopup?.description?.html?.replace('{fareType}', getFareType()),
                      }}
                    />
                    <Button
                      variant="outline"
                      color="primary"
                      size="medium"
                      onClick={() => {
                        setOpenSlider(true);
                        setOpenMadatoryMessageToast(false);
                      }}
                      containerClass="mt-12 skyplus-addon-mf__modal-button"
                    >
                      {mfData?.selectSnackPopup?.ctaLabel}
                    </Button>
                  </ModalComponent>
                )}
                {/* Uncomment the below code for WEB-48 */}
                {isAddonPopupEnabled && (
                <AddonSelectPopup
                  journeydetails={elligibleTripsForPopup}
                  passengerDetails={getPassengerDetails ?? []}
                  onAdd={handleAddPopup}
                  onSkip={handleSkipPopup}
                />
                )}
              </div>
              {isOpenSlider && getAddon({ categoryBundleCode: categoryCodes.meal })}
              {/* Uncomment the below code for local/develop purpose */}
              {/* <div className="skyplus-addon-mf__footer">
                <div className="skyplus-addon-mf__footer-container">
                  <div className="skyplus-addon-mf__footer-fare">
                    <h5 className="body-small-regular">TOTAL FARE</h5>
                    <h4 className="h4">₹00,000</h4>
                    <h5 className="body-small-regular">Zero Convenience Fee</h5>
                  </div>
                  <div className="skyplus-addon-mf__footer-button">
                    <Button variant="filled" color="primary" size="medium" onClick={handleNext}>
                      {continueLabel}
                    </Button>
                  </div>
                </div>
              </div> */}
              </div>
            )}
          </div>
          {addonErrorData && addonErrorData?.active && (
            <Toast
              onClose={() => errorToastCloseHandler()}
              containerClass="addon-toast--error"
              variation="notifi-variation--error"
              description={addonErrorData?.message}
              title="Error"
            />
          )}
        </>
      )}
    </>
  );
};

AddonContainer.propTypes = {
  isModifyFlow: PropTypes.string,
};

export default AddonContainer;
