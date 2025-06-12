import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { COOKIE_KEYS } from 'skyplus-design-system-app/src/constants';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { useCustomEventListener } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import Toast from '../seatSelectionToast/SeatSelectionToast';
import { useSeatMapContext } from '../../store/seat-map-context';
import DestinationToggle from '../DestinationToggle';
import RecommendedSeats from '../RecommendedSeats';
import SeatTypes from '../SeatTypes';
import SeatMap from '../SeatMap';
import PassengerList from '../PassengerList';
import SeatsPlaceholder from '../SeatsPlaceholder/SeatsPlaceholder';
import PassengerTitle from '../PassengerTitle/PassengerTitle';
import SeatMessage from '../SeatMessage/SeatMessage';
import {
  SELL_SEAT_CUSTOM_EVENT,
  SEND_SELECTED_SEATS_INFO_TO_REVIEW_SUMMARY,
  FARE_SUMMARY_LOADING_EVENT,
  modificationPageTypes,
  webCheckInPageTypes,
  CONSTANTS,
  LOGIN_SUCCESS,
  LOYALTY_LOGIN_SUCCESS,
  localStorageKeys,
} from '../../constants';
import { pushAnalytic } from '../../utils/analyticEvents';
import {
  getSeatMapData,
  getSeatMainAemData,
  getSeatAdditionalAemData,
  postSellSeats,
  getSeatsRecommendations,
} from '../../services';
import {
  getSeatMapDetails,
  getPostSeatData,
  getSelectedSeatDetails,
  getReviewSummaryData,
  makePayment,
  checkSeatSelectedForAllPax,
  checkIsSeatAssignedToPax,
  getSelectedSeatsGroupedBySegments,
  getErrorCodeForMandatorySeat,
  getJourneySeatData,
  getFee,
} from '../../utils';
import { gtmPushAnalytic } from '../../utils/gtmEvents';
import ChceckinPopup from '../CheckinPopup/ChceckinPopup';

import './SeatSelectionApp.scss';
import LocalStorage from '../../utils/LocalStorage';
import AuthBannerLoyalty from '../AuthBannerLoyalty/AuthBannerLoyalty';

const SeatSelectionApp = ({ backHandler }) => {
  const seatMapPreviewWrapperRef = useRef(null);
  const [validSeats, setValidSeats] = useState([]);
  const [aircraftName, setAircraftName] = useState('');
  const [wingsData, setWingsData] = useState([]);
  const [exitRowData, setExitRowData] = useState([]);
  const [seatMapLayoutData, setSeatMapLayoutData] = useState({});
  const [error, setError] = useState(null);
  const [isSeatAssignedToPax, setIsSeatAssignedToPax] = useState(false);
  const [selectedPassengerSeat, setSelectedPassengerSeat] = useState(null);
  const [isSeatSelectedForPassenger, setIsSeatSelectedForPassenger] = useState(null);
  const [seatMapScrollRange, setSeatMapScrollRange] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaver, setIsSaver] = useState(true);
  const [isNext, setIsNext] = useState(false);
  const [isFlightHavingNext, setIsFlightHavingNext] = useState(false);
  const [showCheckinPopup, setShowCheckinPopup] = useState(false);

  const {
    updateSeatMainAemData,
    updateSeatAdditionalAemData,
    updateSeatMapData,
    updateJourneysDetail,
    updateSegmentData,
    seatMapData,
    segmentData,
    updatePassengerData,
    passengerData,
    selectedSeatMap,
    updateExtraSeatKeysData,
    journeysDetail,
    filters,
    updateFilters,
    updateCategory,
    updateSelectedSeatsList,
    getSelectedSegmentObj,
    seatMainAemData,
    seatAdditionalAemData,
    isModifyFlow,
    recommendedSeatsData,
    updateRecommendedSeatsData,
    addedRecommededSeats,
    category,
    pageloadStart,
    isCheckInFlow,
    updateLoyaltyData,
    loyalty,
    isLoyaltyEnabled,
    authUser,
    updateAuthUserCookie,
    fareData,
    updateCurrencyCode,
    restrictEventCall,
    selectedSeatsList
  } = useSeatMapContext();
  const {
    nextCtaPath,
    checkinPath,
    noSeatSelectionMessage,
    seatSelectionInfantMandatoryNote,
    seatSelectionbefore4HourDepatureMandatoryNote,
  } = seatMainAemData || {};
  const { mandatorySeatToaster, selectSeatNowCtaLabel, seatIncludedLabel } = seatAdditionalAemData || {};
  const webCheckInDataFromLocal = LocalStorage.getAsJson(
    localStorageKeys.c_p_d,
  );
  const isWebCheckInFlow = isCheckInFlow?.enable
    && webCheckInPageTypes.includes(isCheckInFlow.flowType);
  // recommended seats data destructing
  const newRecData = recommendedSeatsData?.data?.recommendationsBySegments;
  const loyaltyMessage = seatMainAemData?.seatPreBookingDiscountInfo?.html?.replace(
    /{discountPercentage}/g,
    loyalty?.discount?.[0]?.discountPer || 0,
  ) || ' ';
  const feesDetails = useMemo(() => {
    if (seatMapData) {
      const { data: { seatMaps } = {} } = seatMapData;
      const feeObj = {};
      seatMaps?.forEach((item) => {
        feeObj[item.seatMap.seatmapReference] = item.fees;
      });

      return feeObj;
    }

    return {};
  }, [seatMapData]);

  const updateAPIdata = (res) => {
    if (res.errors) {
      const aemError = getErrorMsgForCode(res?.errors?.Code);
      setError(aemError?.message);
    } else if (res.data) {
      const {
        filters: { femaleSeats = [] },
      } = res.data;
      gtmPushAnalytic({
        event: 'pageload',
        data: {
          originTime: pageloadStart,
          journeysDetail: res?.data?.journeysDetail,
          isModifyFlow: isModifyFlow.enable,
        },
      });
      pushAnalytic({
        data: {
          _event: 'pageload',
          isModifyFlow: isModifyFlow.enable,
          isWebCheckInFlow,
          femaleSeats: String(femaleSeats?.length || 0),
        },
        event: 'pageload',
      });
      if (isWebCheckInFlow && webCheckInDataFromLocal?.journeyKey) {
        const filteredJourneysDetail = res?.data?.journeysDetail.filter(
          (obj) => obj.journeyKey === webCheckInDataFromLocal.journeyKey,
        );
        res.data.journeysDetail = filteredJourneysDetail;
      }
      updateSeatMapData(res);
      updateJourneysDetail(res);
      updateSegmentData(res);
      updatePassengerData(res);
      updateExtraSeatKeysData(res);
      updateFilters(res);
      updateCategory(res);
      updateLoyaltyData(res);
      setIsSeatAssignedToPax(
        checkIsSeatAssignedToPax(res?.data?.journeysDetail),
      );
    }
  };

  const updateRecommendationsAPIData = (res) => {
    if (res.errors) {
      setError(res.errors.Message);
    } else if (res.data) {
      updateRecommendedSeatsData(res);
    }
  };

  const onHashChange = () => {
    const { hash } = window.location;
    if (hash?.toLowerCase().includes('addon')) {
      backHandler();
    }
  };

  useEffect(() => {
    const getApiAndAemData = async () => {
      // AEM graghQL service call
      setIsLoading(true);
      try {
        const resArr = await Promise.all([
          getSeatMainAemData(),
          getSeatAdditionalAemData(),
          getSeatMapData(),
        ]);
        const [
          { data: { seatMainByPath: { item: mainItem } = {} } = {} } = {},
          { data: { seatAdditionalByPath: { item } = {} } = {} } = {},
          apiRes,
        ] = resArr;
        updateSeatMainAemData(mainItem);
        updateSeatAdditionalAemData(item);
        updateAPIdata(apiRes);
        if (mainItem?.recommendedSeats) {
          const recoApiRes = await getSeatsRecommendations();
          updateRecommendationsAPIData(recoApiRes);
        }
      } catch (err) {
        const aemError = getErrorMsgForCode();
        setError(aemError?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getApiAndAemData();

    /** HANDLING BROWSER BACK BUTTON EVENT */
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.addEventListener(LOGIN_SUCCESS, updateAuthUserCookie);
    document.addEventListener(LOYALTY_LOGIN_SUCCESS, updateAuthUserCookie);
  }, []);

  useEffect(() => {
    const authUserCookie = Cookies.get(COOKIE_KEYS.USER, true, true);
    if (authUserCookie) {
      updateAuthUserCookie();
    }
  }, []);

  useEffect(() => {
    const JourneyDetails = LocalStorage.getAsJson('journeyReview');
    updateCurrencyCode(JourneyDetails?.bookingDetails?.currencyCode);
  }, []);

  useEffect(() => {
    const selectedSegment = getSelectedSegmentObj();
    if (Object.keys(selectedSegment).length) {
      const selectedList = getSelectedSeatDetails(
        selectedSegment?.passengerSegment,
      );
      updateSelectedSeatsList(selectedList);

      // Sending selected seats info to review/fare summary through custom event
      const dispatcheventReview = (config) => new CustomEvent(SEND_SELECTED_SEATS_INFO_TO_REVIEW_SUMMARY, config);
      const discountPercent = loyalty?.discount?.[0]?.discountPer;

      const combinedArray = seatMapData?.data?.filters?.xlSeatWithFreeMeal?.reduce((acc, item) => {
        const values = Object.values(item)[0].split(','); // split values by comma
        return acc.concat(values);
      }, []);
      const selectedSeatdesignator = validSeats?.find((item) => selectedSeatsList?.[0]?.seats?.includes(item.unitKey))?.designator;
      const details = getReviewSummaryData(
        journeysDetail,
        segmentData,
        feesDetails,
        discountPercent,
        combinedArray,
        selectedSeatdesignator,
        seatMapData,
        selectedSegment,
      );

      if (!restrictEventCall) {
        document.dispatchEvent(
          dispatcheventReview({
            bubbles: true,
            detail: details,
          }),
        );
      }
    }
  }, [journeysDetail, getSelectedSegmentObj, feesDetails, validSeats]);

  const loadFareSummary = (isFsLoading) => {
    const fareSummaryLoaderButtonEvent = (data) => new CustomEvent(FARE_SUMMARY_LOADING_EVENT, data);
    document.dispatchEvent(
      fareSummaryLoaderButtonEvent({
        bubbles: true,
        detail: { isLoading: isFsLoading },
      }),
    );
  };
  const sellSeatsApiCall = async (details = {}) => {
    const postSeatData = getPostSeatData(
      journeysDetail,
      segmentData,
      filters,
      aircraftName,
    );
    const selectedSeats = getSelectedSeatsGroupedBySegments(postSeatData);
    const reviewSummaryData = getReviewSummaryData(
      journeysDetail,
      segmentData,
      feesDetails,
    );
    const journeySeatData = getJourneySeatData({ journeysDetail, segmentData });

    try {
      loadFareSummary(true);

      const res = await postSellSeats(postSeatData);

      pushAnalytic({
        data: {
          journeysDetail,
          productDetails: reviewSummaryData,
          productInfo: selectedSeats,
          isModifyFlow: isModifyFlow.enable,
          isWebCheckInFlow,
          _event: 'clickNext',
          isFemaleSeat: String(Boolean(selectedSeats?.femaleSeat)),
        },
        event: 'seatDetails',
      });

      if (isWebCheckInFlow) {
        gtmPushAnalytic({
          event: 'seat_selection_checkIn',
          data: {
            journeysDetail,
            category,
            journeySeatData,
            isRecommendedSeat: addedRecommededSeats,
            productDetails: reviewSummaryData,
            isModifyFlow: isModifyFlow.enable,
            isWebCheckInFlow,
          },
        });
      } else {
        gtmPushAnalytic({
          event: 'clickNext',
          data: {
            journeysDetail,
            category,
            journeySeatData,
            isRecommendedSeat: addedRecommededSeats,
            productDetails: reviewSummaryData,
            isModifyFlow: isModifyFlow.enable,
            isWebCheckInFlow,
          },
        });
      }

      if (res?.errors) {
        const err = res?.errors?.code || res?.errors?.Code;
        const aemError = getErrorMsgForCode(err?.trim?.());
        setError(aemError?.message);
        return false;
      }

      const isPaymentRequired = res?.paymentRequired;
      const isModificationFlow = isModifyFlow?.enable
        && modificationPageTypes.includes(isModifyFlow.flowType);
      const nextPath = isWebCheckInFlow ? checkinPath : nextCtaPath;

      if (
        (isWebCheckInFlow && !isPaymentRequired)
        || isModificationFlow
        || !isPaymentRequired
      ) {
        window.location.href = nextPath;
      } else {
        makePayment(
          nextPath ? `${window.location.origin}${nextPath}` : '',
          details,
        );
      }
    } catch (err) {
      const aemError = getErrorMsgForCode();
      setError(aemError?.message);
    } finally {
      loadFareSummary(false);
    }

    return false;
  };

  const pushAdobeAnalytics = (_event, event) => {
    pushAnalytic({
      data: {
        journeysDetail,
        isModifyFlow: isModifyFlow.enable,
        isWebCheckInFlow,
        _event,
      },
      event,
    });
  };

  const checkIfSeatIsAlreadySelected = (pKey, sKey) => {
    let isSeatAlreadyAllocated = true;
    const segmentObject = journeysDetail?.filter(
      (obj) => obj?.journeyKey === webCheckInDataFromLocal?.journeyKey,
    )[0]?.segments || {};
    Object.keys(segmentObject)?.forEach((segmentKey) => {
      if (segmentKey === sKey) {
        const passengerSegment = segmentObject?.[segmentKey]?.passengerSegment || {};
        Object.keys(passengerSegment)?.forEach((paxkey) => {
          if (
            paxkey === pKey
            && passengerSegment?.[paxkey]?.seats.length === 0
          ) {
            isSeatAlreadyAllocated = false;
          }
        });
      }
    });
    return isSeatAlreadyAllocated;
  };

  const checkToSetMultiSegmentSeatMandatory = (is4HoursBeforeDeparture = false) => {
    let seatSelectionMandatory = false;
    let isInfantMandatory = false;
    let isBefore4Hr = false;
    let seatSelectedCount = 0;
    let totalSeats = 0;
    const postSeatData = getPostSeatData(journeysDetail, segmentData, filters);
    const selectedSeats = getSelectedSeatsGroupedBySegments(postSeatData);
    const checkinPostSeatData = postSeatData?.data?.seatRequests.filter(
      (obj) => obj.journeyKey === webCheckInDataFromLocal.journeyKey,
    );
    const segmentObject = journeysDetail.filter(
      (obj) => obj.journeyKey === webCheckInDataFromLocal.journeyKey,
    )[0]?.segments;
    if (Object.keys(segmentObject).length > 1) {
      webCheckInDataFromLocal.passengerKeys.forEach((paxKey) => {
        if (selectedSeats?.seatSelected) {
          const paxSeatDetailArray = checkinPostSeatData?.filter(
            (obj) => obj.passengerKey === paxKey,
          );
          if (
            paxSeatDetailArray.length > 0
            && paxSeatDetailArray.length < Object.keys(segmentObject).length
          ) {
            seatSelectionMandatory = true;
          }
        } else {
          Object.keys(segmentObject).forEach((segKey) => {
            totalSeats += 1;
            if (checkIfSeatIsAlreadySelected(paxKey, segKey)) {
              seatSelectedCount += 1;
            }
          });
        }
      });
      if (seatSelectedCount > 0 && seatSelectedCount < totalSeats) {
        seatSelectionMandatory = true;
      }
    }
    if (!seatSelectionMandatory) {
      const paxKeysToCheckin = webCheckInDataFromLocal?.passengerKeys;
      Object.keys(segmentObject).forEach((segmentKey) => {
        paxKeysToCheckin?.forEach((paxKey) => {
          const paxObject = segmentObject[segmentKey]?.passengerSegment[paxKey];
          if (
            paxObject?.hasInfant
            && checkinPostSeatData?.filter(
              (obj) => obj.segmentKey === segmentKey && obj.passengerKey === paxKey,
            ).length === 0 && !checkIfSeatIsAlreadySelected(paxKey, segmentKey)
          ) {
            seatSelectionMandatory = true;
            isInfantMandatory = true;
          }
        });
      });

      if (is4HoursBeforeDeparture) {
        seatSelectionMandatory = true;
        isBefore4Hr = true;
      }
    }
    return { seatSelectionMandatory, isInfantMandatory, isBefore4Hr };
  };

  const is4HoursBeforeDeparture = useMemo(() => {
    const journey = journeysDetail?.[0] ?? null;

    if (journey) {
      const currentTime = new Date();
      const timeOffset = currentTime.getTimezoneOffset();
      const departureTime = new Date(journey?.journeydetail?.utcdeparture);
      departureTime.setMinutes(departureTime.getMinutes() + timeOffset);
      currentTime.setMinutes(currentTime.getMinutes() + timeOffset);

      const diffInHours = (departureTime - currentTime) / (1000 * 60 * 60);
      return diffInHours <= 4;
    }

    return false;
  }, [journeysDetail]);

  const checkToOpenWebCheckin = () => {
    let seatSelectedForAllWebcheckinPax = true;
    const postSeatData = getPostSeatData(journeysDetail, segmentData, filters);
    const checkinPostSeatData = postSeatData?.data?.seatRequests.filter(
      (obj) => obj.journeyKey === webCheckInDataFromLocal.journeyKey,
    );
    if (checkinPostSeatData.length === 0) {
      let isAllSeatAlreadyAllocated = true;
      const segmentObject = journeysDetail.filter(
        (obj) => obj.journeyKey === webCheckInDataFromLocal.journeyKey,
      )[0]?.segments;
      Object.keys(segmentObject).forEach((segmentKey) => {
        const passengerSegment = segmentObject[segmentKey]?.passengerSegment;
        Object.keys(passengerSegment).forEach((paxkey) => {
          if (passengerSegment[paxkey]?.seats.length === 0
            && webCheckInDataFromLocal?.passengerKeys?.indexOf(paxkey) > -1) {
            isAllSeatAlreadyAllocated = false;
          }
        });
      });
      return !isAllSeatAlreadyAllocated;
    }
    const segmentKeys = journeysDetail.filter(
      (obj) => obj.journeyKey === webCheckInDataFromLocal.journeyKey,
    )[0]?.segmentKeys;

    if (
      webCheckInDataFromLocal?.passengerKeys
      && webCheckInDataFromLocal?.passengerKeys.length > 0
    ) {
      webCheckInDataFromLocal?.passengerKeys.forEach((paxkey) => {
        segmentKeys.forEach((segment) => {
          const seatSelectedArray = checkinPostSeatData.filter(
            (obj) => obj.segmentKey === segment && obj.passengerKey === paxkey,
          );
          if (
            seatSelectedArray.length === 0
            && !checkIfSeatIsAlreadySelected(paxkey, segment)
          ) {
            seatSelectedForAllWebcheckinPax = false;
          }
        });
      });
    }
    return !seatSelectedForAllWebcheckinPax;
  };

  const sellSeats = (details) => {
    /**
     * isMandatorySeat check
     * @returns discountReason split code for first encountered segment pax with unassigned seats
     */
    const { code, discountPercent, isExtraSeatsEmpty } = getErrorCodeForMandatorySeat(journeysDetail, segmentData);
    let errorMessage = 'Please select seat.';
    const isModificationFlow = isModifyFlow.enable || isCheckInFlow.enable;

    if (code) {
      setIsSaver(false);
      const { information: { html } = {} } = mandatorySeatToaster.find(
        (toast) => toast.code === code,
      );

      if (html) {
        errorMessage = html.replace(/{discountPercent}/g, `${discountPercent}`);
      }
    } else if (isModificationFlow && isSeatAssignedToPax && isExtraSeatsEmpty) {
      // seats mandatory for modify flow only if seat selected in booking flow
      errorMessage = 'Seat Selection is mandatory for passenger(s) who have booked Extra Seat(s).';
    }

    // no mandatory seats
    let isSellSeats = !code;

    // seats mandatory for modify flow only if seat/extraSeat selected in booking flow
    if (isModificationFlow && isSeatAssignedToPax && !isWebCheckInFlow) {
      const isSeatsEmpty = checkSeatSelectedForAllPax(segmentData);
      isSellSeats = !isSeatsEmpty;
    }

    if (
      isWebCheckInFlow
      && !details.skipCheckinPopup
      && checkToOpenWebCheckin()
    ) {
      pushAdobeAnalytics('click', 'Select an option  to proceed');
      const mandatoryCheckObject = checkToSetMultiSegmentSeatMandatory(is4HoursBeforeDeparture);
      if (mandatoryCheckObject?.seatSelectionMandatory) {
        let popupMessage = errorMessage;
        if (mandatoryCheckObject?.isInfantMandatory) {
          popupMessage = seatSelectionInfantMandatoryNote
            || 'Seat selection is mandatory for passenger(s) who is(are) tagged with an infant.';
        }

        if (mandatoryCheckObject?.isBefore4Hr) {
          popupMessage = seatSelectionbefore4HourDepatureMandatoryNote?.html
          || 'Check-in is not allowed within 3 hours of departure without a seat selection. Please select a seat to proceed';
        }
        setError(popupMessage);
        setIsSaver(false);
        return;
      }

      setShowCheckinPopup(true);
      return;
    }

    if (!isSellSeats) {
      setError(errorMessage);
    } else {
      // resetting error message for error issues
      setIsSaver(true);
      sellSeatsApiCall(details);
    }
  };

  const handleCloseCheckinPopup = () => {
    setShowCheckinPopup(false);
    pushAdobeAnalytics('click', 'Select Seat');
  };

  const handleSkipCheckinPopup = () => {
    setShowCheckinPopup(false);
    pushAdobeAnalytics('click', 'Skip Seat');
    sellSeats({ open: true, from: 'reviewSummary', skipCheckinPopup: true });
  };

  const checkIfUserHasSelectedNext = (
    isFlightHaveNext,
    mandatorySeatJourneyObject,
  ) => {
    let isNextEnabled = false;
    if (isFlightHaveNext && mandatorySeatJourneyObject.isSeatMandetory) {
      const fareType = mandatorySeatJourneyObject.reason.split(':');
      if (fareType.indexOf('BR') > -1 || fareType.indexOf('BC') > -1) {
        isNextEnabled = true;
      }
    }
    return isNextEnabled;
  };

  useCustomEventListener(SELL_SEAT_CUSTOM_EVENT, sellSeats);

  useEffect(() => {
    if (selectedSeatMap) {
      const {
        validSeatsData,
        aircraft,
        wingsData: thisWingsData,
        exitRowData: thisExitRowData,
        rowWithMostSeats,
        rowLayoutData,
        maxSeatsPerRow,
        seatColNames,
        isFlightHaveNext,
        journeyIndex,
      } = getSeatMapDetails(seatMapData, selectedSeatMap);

      setValidSeats(validSeatsData);
      setAircraftName(aircraft);
      setWingsData(thisWingsData);
      setExitRowData(thisExitRowData);
      setSeatMapLayoutData({
        rowLayoutData,
        seatColNames,
        rowWithMostSeats,
        maxSeatsPerRow,
      });
      setIsFlightHavingNext(isFlightHaveNext);
      setIsNext(
        checkIfUserHasSelectedNext(
          isFlightHaveNext,
          journeysDetail[journeyIndex]?.mandatorySeatJourneyList[0],
        ),
      );
    }
  }, [selectedSeatMap, seatMapData]);

  useEffect(() => {
    if (error) {
      pushAnalytic({
        data: {
          _event: 'warning',
          warning: true,
          isModifyFlow: isModifyFlow.enable,
          warningMessage: error,
          component: 'pageload',
        },
        event: 'warning',
      });
    }
  }, [error]);

  const seatMapNotAvailable = (className = '') => (
    <div className={`seat-not-available ${className}`}>
      <p>{noSeatSelectionMessage}</p>
    </div>
  );

  const setPreviewWrapperDimensions = useCallback(
    (width, height, scaleX, scaleY) => {
      seatMapPreviewWrapperRef.current.style.minWidth = `${width * scaleX}px`;
      seatMapPreviewWrapperRef.current.style.maxWidth = '80%';
      seatMapPreviewWrapperRef.current.style.height = `${height * scaleY}px`;
    },
    [],
  );

  const seatMapProps = {
    seatMapData: validSeats,
    wingsData,
    exitRowData,
    aircraftName,
    seatMapLayoutData,
    isModification: isModifyFlow.enable,
    isSeatAssignedToPax,
    selectedPassengerSeat,
    seatMapScrollRange,
    setSeatMapScrollRange,
    isNext,
    isFlightHavingNext,
  };

  const lowestSeatPrice = useMemo(() => {
    return validSeats.reduce((acc, item) => {
      const { amount } = getFee(fareData, item?.group);
      if (amount < acc) {
        return amount;
      }
      return acc;
    }, 0);
  }, [validSeats, fareData]);

  return (
    <>
      {isLoading && <SeatsPlaceholder />}
      {error
        && ReactDOM.createPortal(
          <Toast
            variation="notifi-variation--Error"
            mainToastWrapperClass="seat-selection--toast-wrapper"
            containerClass="seat-selection--toast"
            description={error}
            {...(!isSaver && {
              title: seatIncludedLabel,
              buttonLabel: selectSeatNowCtaLabel,
            })}
            onClose={() => {
              setError(null);
            }}
          />,
          document.body,
        )}
      {!isLoading && seatMapData && !!segmentData.length && (
        <section className="seat-selection-app">
          {(!isModifyFlow?.enable
            || !(
              isModifyFlow?.flowType
              === CONSTANTS.SEAT_SELECTION_MODIFY_PAGE_TYPE
            )) && (
            <div className="seat-selection-app-skyplus-addon-mf__head-back">
              <span
                onClick={backHandler}
                className="seat-selection-backToAddon"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    backHandler();
                  }
                }}
                tabIndex="0"
                role="button"
                aria-label="Back to Add-ons"
              >
                <i className="seat-selection-app-skyplus-accordion__icon icon-accordion-left-simple" />
                <button
                  type="button"
                  className="seat-selection-app-skyplus-addon-mf__head-back-btn link"
                  // eslint-disable-next-line i18next/no-literal-string
                >
                  Back to Add-ons
                </button>
              </span>
            </div>
          )}

          {isLoyaltyEnabled
            && authUser?.loyaltyMemberInfo?.FFN
            && loyalty?.discount?.[0]?.discountPer > 0 && (
              <div
                className="seat-selection-app-promotional-message pt-8"
                dangerouslySetInnerHTML={{ __html: loyaltyMessage }}
              />
          )}
          <DestinationToggle segments={segmentData} />
          <PassengerTitle />

          {seatMainAemData?.recommendedSeats
            && !isModifyFlow.enable
            && !!newRecData?.length
            && !!validSeats.length && (
              <RecommendedSeats
                passengers={passengerData}
                seatMapData={validSeats}
                fareDetails={feesDetails[selectedSeatMap]}
              />
          )}

          <PassengerList
            setSelectedPassengerSeat={setSelectedPassengerSeat}
            setIsSeatSelectedForPassenger={setIsSeatSelectedForPassenger}
            passengers={passengerData}
            fareDetails={feesDetails[selectedSeatMap]}
            validSeats={validSeats}
          />

          {!!validSeats.length && (
            <>
              <SeatTypes
                validSeats={validSeats}
                isNext={isNext}
                isFlightHavingNext={isFlightHavingNext}
                isModificationFlow={isModifyFlow.enable}
              />

              <div className="seat-map-preview">
                <div
                  className="seat-map-preview-wrapper"
                  ref={seatMapPreviewWrapperRef}
                >
                  <SeatMap
                    {...seatMapProps}
                    preview
                    setPreviewWrapperDimensions={setPreviewWrapperDimensions}
                  />
                </div>
              </div>

              <SeatMap {...seatMapProps} />
            </>
          )}

          {!validSeats.length && seatMapNotAvailable('units-not-available')}
          {!isSeatSelectedForPassenger && isNext && isFlightHavingNext && (
            <div className="seat-selection-mandatory">
              <p>
                <span className="icon-exclamationtriangle1" />
                {seatMainAemData?.seatSelectionMandatoryNote
                  || 'Seat selection is mandatory.'}
              </p>
            </div>
          )}
          <SeatMessage isSeatAssignedToPax={isSeatAssignedToPax} />
          <AuthBannerLoyalty />
        </section>
      )}
      {!isLoading
        && seatMapData
        && !segmentData.length
        && seatMapNotAvailable()}

      {showCheckinPopup && (
        <ChceckinPopup
          onClose={handleCloseCheckinPopup}
          setSelectedPassengerSeat={setSelectedPassengerSeat}
          setIsSeatSelectedForPassenger={setIsSeatSelectedForPassenger}
          passengers={passengerData}
          fareDetails={feesDetails[selectedSeatMap]}
          validSeats={validSeats}
          handleSkipCheckinPopup={handleSkipCheckinPopup}
          lowestSeatPrice={lowestSeatPrice.toString()}
        />
      )}
    </>
  );
};

SeatSelectionApp.propTypes = {
  backHandler: PropTypes.func.isRequired,
};

export default SeatSelectionApp;
