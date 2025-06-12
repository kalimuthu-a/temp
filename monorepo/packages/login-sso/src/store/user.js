import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDetails: (state, action) => {
      return {
        ...state,
        user: action.payload.user,
      };
    },
  },
});

export const { setDetails } = userSlice.actions;
export default userSlice.reducer;
