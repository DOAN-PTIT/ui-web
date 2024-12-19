import { fetchDebts, getDebtDetail, updateDebt } from "@/action/debt.action";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
}

const reducer = createSlice({
    name: "debt",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDebts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDebts.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchDebts.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(getDebtDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDebtDetail.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getDebtDetail.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(updateDebt.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDebt.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateDebt.rejected, (state, action) => {
                state.loading = false;
            })
    }
})

const debtReducer = reducer.reducer;
export default debtReducer;