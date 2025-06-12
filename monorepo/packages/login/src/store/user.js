import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDetails: (state, action) => {
      state.user = JSON.parse(JSON.stringify(action.payload.user));
    },
  },
});

export const { setDetails } = userSlice.actions;
export default userSlice.reducer;
