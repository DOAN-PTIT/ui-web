import { getListOrders } from "@/action/order.action";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
}

const reducer = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getListOrders.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getListOrders.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(getListOrders.rejected, (state) => {
                state.isLoading = false
            })
    }
})

const orderReducer = reducer.reducer
export default orderReducer