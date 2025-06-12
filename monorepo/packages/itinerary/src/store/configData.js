import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginType: '',
  showCreditShell: false,
  enableNavOptions: false,
  showFeatureTempDelivery: true,
  isPartnerAirline: false,
  isLoading: false,
  toastProps: {
    show: false,
    props: {

    },
  },
};

const configDataSlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    updateConfigInfo: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        ...{ isLoading: action.payload },
      };
    },
    toggleToast: (state, action) => {
      return {
        ...state,
        ...{ toastProps: action.payload },
      };
    },
  },
});

export const { updateConfigInfo, setLoading, toggleToast } = configDataSlice.actions;
export default configDataSlice.reducer;
