import { getListOrders, updateOrder } from "@/action/order.action";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    createOrder: {
        delivery_company: "",
        total_discount: 0,
        tracking_number: "",
        delivery_cost: 0,
        total_cost: 0,
        surcharge: 0,
    } as any
}

const reducer = createSlice({
    name: "order",
    initialState,
    reducers: {
        createOrder: (state, action) => {
            const defaultOrder = {
                delivery_company: "",
                total_discount: 0,
                tracking_number: "",
                delivery_cost: action.payload.delivery_cost_shop || 0,
                total_cost: action.payload.total_cost || 0,
                surcharge: action.payload.surcharge || 0,
            }
            state.createOrder = { ...defaultOrder, ...action.payload }
        }
    },
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
            .addCase(updateOrder.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateOrder.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(updateOrder.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const { createOrder } = reducer.actions
const orderReducer = reducer.reducer
export default orderReducer