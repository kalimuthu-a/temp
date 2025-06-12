import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { FEECODE_MOCK, SSR_CODE_MOCK } from '../mock';
import { CONSTANTS } from '../constants';
// let localStoredData = localStorage.getItem("iti-data");
// localStoredData = localStoredData && JSON.parse(localStoredData);
// import {
//   MFDATA_MOCK_MAIN_BY_PATH,
//   MFDATA_MOCK_ADDITIONAL_BY_PATH,
//   MFDATA_MOCK_CONFIRMATION_DATA_BY_PATH,
//   MFDATA_MOCK_CONFIRMATION_ADDITIONAL_DATA_BY_PATH,
// } from '../mock/itineraryAEM';

const initialState = {
  itinerary: {},
  apiData: {},
  mfDatav2: null, // MFDATA_MOCK_MAIN_BY_PATH,
  mfConfirmationDatav2: null, // MFDATA_MOCK_CONFIRMATION_DATA_BY_PATH,
  mfAdditionalData: {},
  mfAdditionalDatav2: null, // MFDATA_MOCK_ADDITIONAL_BY_PATH,
  mfConfirmationAdditionalDatav2: null, // MFDATA_MOCK_CONFIRMATION_ADDITIONAL_DATA_BY_PATH,
  feeCodeListAbbreviation: FEECODE_MOCK, // [],
  ssrListAbbreviation: SSR_CODE_MOCK, // [],
  exploreCitiesData: [],
};

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    setItineraryDetails: (state, action) => {
      const auth_user = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
      const isLoggedInLoyaltyUser = auth_user?.loyaltyMemberInfo?.FFN;
      const apiDataTemp = action.payload.data;
      let isEarnFlow; let
        isBurnFlow;
      if (!window.disableLoyalty && apiDataTemp?.bookingDetails?.isRedeemTransaction) {
        isBurnFlow = true;
      } else if (!window.disableLoyalty) {
        isEarnFlow = true;
      }
      state = { // eslint-disable-line no-param-reassign
        ...state,
        ...{ apiData: action.payload.data, isBurnFlow, isEarnFlow },
      };
      return state;
    },
    setMfData: (state, action) => {
      state = { // eslint-disable-line no-param-reassign
        ...state,
        ...{ mfDatav2: action.payload.data, mfAdditionalDatav2: action.payload.mfAdditionalDatav2 },
      };
      return state;
    },
    setAbbreviationData: (state, action) => {
      state = { // eslint-disable-line no-param-reassign
        ...state,
        ...{
          feeCodeListAbbreviation: action.payload.feeCodeListAbbreviation,
          ssrListAbbreviation: action.payload.ssrListAbbreviation,
        },
      };
      return state;
    },
    setExploreCities: (state, action) => {
      state = { // eslint-disable-line no-param-reassign
        ...state,
        ...{ exploreCitiesData: action.payload.data },
      };
      return state;
    },
    setAuthInfo: (state, action) => {
      state = { // eslint-disable-line no-param-reassign
        ...state,
        ...action.payload,
      };
      return state;
    },
  },
});

export const { setItineraryDetails, setMfData, setAbbreviationData,
  setExploreCities, setAuthInfo } = itinerarySlice.actions;
export default itinerarySlice.reducer;
