import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  expiresInMS: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      return {
        ...state,
        token: action.payload.token,
        expiresInMS: action.payload.expiresInMS,
      };
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
