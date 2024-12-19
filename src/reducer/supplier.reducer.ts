import { getListSupplier, updateSupplier } from "@/action/supplier.action";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
}

const reducer = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        setSupplierLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getListSupplier.pending, (state) => {
            state.loading = true;
        })
        .addCase(getListSupplier.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(getListSupplier.rejected, (state) => {
            state.loading = false;
        })
        .addCase(updateSupplier.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateSupplier.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateSupplier.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const { setSupplierLoading } = reducer.actions;
const supplierReducer = reducer.reducer;
export default supplierReducer;