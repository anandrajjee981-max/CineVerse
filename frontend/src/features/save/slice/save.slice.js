import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  saved: [],
  loading: false,
  error: null
};

const saveSlice = createSlice({
  name: "save",
  initialState,
  reducers: {
    fetchSaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },

  fetchSaveSuccess: (state, action) => {
  state.loading = false;
  state.saved = action.payload.save;   
},

    fetchSaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchSaveStart,
  fetchSaveSuccess,
  fetchSaveFailure
} = saveSlice.actions;

export default saveSlice.reducer;