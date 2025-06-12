import { useState, useMemo, useContext, createContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { COOKIE_KEYS } from 'skyplus-design-system-app/src/constants';

import { PASSENGER_TYPE } from '../constants';

const defaultState = {
  restrictEventCall: true,
};
const SeatMapContext = createContext(defaultState);

const getJourneysDetail = (apiData) => {
  const {
    data: { journeysDetail, extraSeatKeys },
  } = apiData;
  return journeysDetail?.map(({ journeyKey, segments, mandatorySeatJourneyList, productClass, journeydetail }) => ({
    journeyKey,
    segmentKeys: segments?.map(({ segmentKey }) => (segmentKey)),
    segments: segments.reduce((acc, seg) => ({ ...acc, [seg.segmentKey]: seg }), {}),
    seatMapRefs: segments?.map(({ seatmapReference }) => (seatmapReference)),
    mandatorySeatJourneyList,
    extraSeatKeys,
    journeydetail,
    productClass,
  }));
};

const getSegmentDetails = (apiData) => {
  const segmentsResult = [];
  const {
    data: { journeysDetail },
  } = apiData;
  journeysDetail?.forEach(({ segments }) => {
    segments?.forEach(({ segmentDetails, segmentKey, seatmapReference, passengerSegment }) => {
      segmentsResult.push({ ...segmentDetails, segmentKey, seatmapReference, passengerSegment });
    });
  });

  return segmentsResult;
};

const getPassengerData = (apiData) => {
  const {
    data: { passengers },
  } = apiData;
  return passengers;
};

const getExtraSeatKeysData = (apiData) => {
  const {
    data: { extraSeatKeys },
  } = apiData;
  return extraSeatKeys;
};

export const SeatMapContextProvider = ({ children }) => {
  const [seatMainAemData, setSeatMainAemData] = useState(null);
  const [seatAdditionalAemData, setSeatAdditionalAemData] = useState(null);
  const [seatMapData, setSeatMapData] = useState(null);
  const [journeysDetail, setJourneysDetail] = useState(null);
  const [segmentData, setSegmentData] = useState([]);
  const [selectedSeatTypes, setSelectedSeatTypes] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [passengerData, setPassengerData] = useState([]);
  const [selectedSeatMap, setSelectedSeatMap] = useState(null);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [fareData, setFareData] = useState(null);
  const [selectedSeatsList, setSelectedSeatsList] = useState([]);
  const [extraSeatKeysData, setExtraSeatKeysData] = useState([]);
  const [recommendedSeatsData, setRecommendedSeatsData] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [removeRecSeats, setRemoveRecSeats] = useState(false);
  const [isModifyFlow, setIsModifyFlow] = useState({
    flowType: '',
    enable: false,
  });
  const [isCheckInFlow, setIsCheckInFlow] = useState({
    flowType: '',
    enable: false,
  });
  const [filters, setFilters] = useState(null);
  const [category, setCategory] = useState(null);
  const [addedRecommededSeats, setAddedRecommededSeats] = useState({});
  const [pageloadStart, setPageloadStart] = useState(null);
  const [loyalty, setLoyalty] = useState(null);
  const isLoyaltyEnabled = !(window.disableLoyalty ?? true);
  const [authUser, setAuthUser] = useState(Cookies.get(COOKIE_KEYS.USER, true, true) || false);
  const [currencyCode, setCurrencyCode] = useState(null);
  const [restrictEventCall, setRestrictEventCall] = useState(true);
  const updateAuthUserCookie = () => {
    try {
      setAuthUser(Cookies.get(COOKIE_KEYS.USER, true, true));
    } catch (e) {
      setAuthUser(Cookies.get(COOKIE_KEYS.USER));
    }
  };

  const updateCurrencyCode = (data) => {
    setCurrencyCode(data);
  };

  const updateFilters = (apiData) => {
    setFilters(apiData?.data?.filters);
  };

  const updateCategory = (apiData) => {
    setCategory(apiData?.data?.category);
  };

  const updateLoyaltyData = (apiData) => {
    setLoyalty(apiData?.data?.loyalty);
  };

  const updateRecommendedSeatsData = (apiData) => {
    setRecommendedSeatsData(apiData);
  };

  const updateSeatMainAemData = (apiData) => {
    setSeatMainAemData(apiData);
  };

  const updateSeatAdditionalAemData = (apiData) => {
    setSeatAdditionalAemData(apiData);
  };

  const updateSeatMapData = (apiData) => {
    setSeatMapData(apiData);
  };

  const updateJourneysDetail = (apiData) => {
    const journeysData = getJourneysDetail(apiData);
    setJourneysDetail(journeysData);
  };

  const updateSegmentData = (apiData) => {
    const segments = getSegmentDetails(apiData);
    setSegmentData(segments);
  };

  const setSeatProps = (selectedBtns) => {
    setSelectedSeatTypes(selectedBtns);
  };

  const updateSelectedSegment = (segmentKey, disable) => {
    setRestrictEventCall(disable);
    setSelectedSegment(segmentKey);
  };

  const updateSelectedSeatMap = (seatMapRef) => {
    setSelectedSeatMap(seatMapRef);
  };

  const updatePassengerData = (apiData) => {
    const passengers = getPassengerData(apiData);
    setPassengerData(passengers);
  };

  const updatePassengerSelected = (passenger) => {
    setSelectedPassenger(passenger);
  };

  const getSelectedSegmentObj = useCallback(
    () => segmentData?.find(({ segmentKey }) => segmentKey === selectedSegment) || {},
    [segmentData, selectedSegment],
  );

  const updateFareData = (fareObj) => {
    setFareData(fareObj);
  };

  const updateSelectedSeatsList = (selectedList) => {
    setRestrictEventCall(false);
    setSelectedSeatsList(selectedList);
  };

  const updateExtraSeatKeysData = (apiData) => {
    const extraSeatKeys = getExtraSeatKeysData(apiData);
    setExtraSeatKeysData(extraSeatKeys);
  };

  const isSoloFemalePassenger = useMemo(
    () => {
      if ((isModifyFlow.enable || isCheckInFlow.enable) && !!passengerData?.length && (passengerData?.length < 10)) {
        // female passengers with one male (adult / senior citizen) max with at least one couple having same last names
        const { maleCount, femaleCount, femaleLastNames, maleLastNames } = passengerData.reduce((acc, passenger) => {
          const { passengerTypeCode, info, name } = passenger;
          const isAdult = passengerTypeCode?.toUpperCase() === PASSENGER_TYPE.ADULT;
          const isFemale = Number(info?.gender) === 2;
          const isMale = Number(info?.gender) === 1;
          let countObj = acc;

          if (!isAdult) {
            return countObj;
          }

          if (isFemale) {
            countObj = {
              ...countObj,
              femaleCount: countObj.femaleCount + 1,
              femaleLastNames: [...acc.femaleLastNames, name?.last],
            };
          }

          if (isMale) {
            countObj = {
              ...countObj,
              maleCount: countObj.maleCount + 1,
              maleLastNames: [...acc.maleLastNames, name?.last],
            };
          }

          return countObj;
        }, { femaleCount: 0, maleCount: 0, femaleLastNames: [], maleLastNames: [] });

        if (maleCount > 1) {
          return false;
        }

        if (!!femaleLastNames?.length && (maleLastNames?.length === 1)) {
          return femaleLastNames.some((lastName) => lastName.toLowerCase() === maleLastNames[0].toLowerCase());
        }

        return !!femaleCount && !maleCount;
      }

      return false;
    },
    [passengerData, isModifyFlow.enable, isCheckInFlow.enable],
  );

  const femalePassengerCount = useMemo(
    () => {
      if ((isModifyFlow.enable || isCheckInFlow.enable) && !!passengerData?.length && (passengerData?.length < 10)) {
        const { femaleCount } = passengerData.reduce((acc, passenger) => {
          const { passengerTypeCode, info } = passenger;
          const isAdult = passengerTypeCode?.toUpperCase() === PASSENGER_TYPE.ADULT;
          const isFemale = Number(info?.gender) === 2;
          let countObj = acc;

          if (!isAdult) {
            return countObj;
          }

          if (isFemale) {
            countObj = {
              ...countObj,
              femaleCount: countObj.femaleCount + 1,
            };
          }

          return countObj;
        }, { femaleCount: 0 });

        return femaleCount;
      }

      return 0;
    },
    [passengerData, isModifyFlow.enable, isCheckInFlow.enable],
  );

  const storeData = useMemo(
    () => ({
      seatMainAemData,
      seatAdditionalAemData,
      journeysDetail,
      seatMapData,
      segmentData,
      selectedSegment,
      passengerData,
      selectedSeatTypes,
      selectedPassenger,
      selectedSeatMap,
      fareData,
      selectedSeatsList,
      extraSeatKeysData,
      isSoloFemalePassenger,
      femalePassengerCount,
      currencyCode,
      restrictEventCall,
      updateCurrencyCode,
      setSegmentData,
      updateSeatMainAemData,
      updateSeatAdditionalAemData,
      updateSeatMapData,
      updateJourneysDetail,
      updateSegmentData,
      updateSelectedSegment,
      setSeatProps,
      updatePassengerData,
      updatePassengerSelected,
      updateSelectedSeatMap,
      getSelectedSegmentObj,
      updateFareData,
      updateSelectedSeatsList,
      updateExtraSeatKeysData,
      updateRecommendedSeatsData,
      recommendedSeatsData,
      setRecommendedSeatsData,
      selectedSeatId,
      setSelectedSeatId,
      removeRecSeats,
      setRemoveRecSeats,
      isModifyFlow,
      setIsModifyFlow,
      isCheckInFlow,
      setIsCheckInFlow,
      category,
      filters,
      updateFilters,
      updateCategory,
      addedRecommededSeats,
      setAddedRecommededSeats,
      setPageloadStart,
      pageloadStart,
      updateLoyaltyData,
      loyalty,
      isLoyaltyEnabled,
      authUser,
      updateAuthUserCookie,
    }),
    [
      seatMainAemData,
      seatAdditionalAemData,
      seatMapData,
      journeysDetail,
      segmentData,
      selectedSegment,
      passengerData,
      selectedSeatTypes,
      selectedPassenger,
      fareData,
      selectedSeatsList,
      extraSeatKeysData,
      isSoloFemalePassenger,
      femalePassengerCount,
      currencyCode,
      updateCurrencyCode,
      setSegmentData,
      updateSeatMainAemData,
      updateSeatAdditionalAemData,
      updateSeatMapData,
      updateJourneysDetail,
      updateSegmentData,
      updateSelectedSegment,
      setSeatProps,
      updatePassengerData,
      updatePassengerSelected,
      updateSelectedSeatMap,
      getSelectedSegmentObj,
      updateFareData,
      updateSelectedSeatsList,
      updateExtraSeatKeysData,
      updateRecommendedSeatsData,
      recommendedSeatsData,
      setRecommendedSeatsData,
      selectedSeatId,
      setSelectedSeatId,
      removeRecSeats,
      setRemoveRecSeats,
      isModifyFlow,
      setIsModifyFlow,
      isCheckInFlow,
      setIsCheckInFlow,
      category,
      filters,
      updateFilters,
      updateCategory,
      addedRecommededSeats,
      setAddedRecommededSeats,
      setPageloadStart,
      pageloadStart,
      updateLoyaltyData,
      loyalty,
      isLoyaltyEnabled,
      authUser,
      updateAuthUserCookie,
      restrictEventCall,
    ],
  );

  return (
    <SeatMapContext.Provider value={storeData}>
      {children}
    </SeatMapContext.Provider>
  );
};
export function useSeatMapContext() {
  const context = useContext(SeatMapContext);
  if (context === undefined) {
    throw new Error('SeatMapContext is used outside the context provider');
  }
  return context;
}

SeatMapContextProvider.propTypes = {
  children: PropTypes.any,
};
export default SeatMapContext;
