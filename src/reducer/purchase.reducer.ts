import { createPurchase } from "@/action/purchase.action";
import { createSlice } from "@reduxjs/toolkit";

const reducer = createSlice({
  name: "purchase",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPurchase.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPurchase.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPurchase.rejected, (state) => {
        state.loading = false;
      });
  },
});

const purchaseReducer = reducer.reducer;
export default purchaseReducer;
