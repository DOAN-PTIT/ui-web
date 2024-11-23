import { createVariation } from "@/action/variation.action";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  variations: [],
  variation: {},
  loading: false,
  error: null,
};

const reducer = createSlice({
  name: "variation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVariation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVariation.fulfilled, (state, action) => {
        state.loading = false;
        state.variation = action.payload;
      })
      .addCase(createVariation.rejected, (state, action) => {
        state.loading = false;
        (state.error as any) = action.payload;
      });
  },
});

const variationReducer = reducer.reducer;
export default variationReducer;
