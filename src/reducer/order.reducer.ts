import { getListOrders } from "@/action/order.action";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    createOrder: {
        delivery_company: "",
        discount_percent: 0,
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
                discount_percent: 0,
                tracking_number: "",
                delivery_cost: 0,
                total_cost: 0,
                surcharge: 0,
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
    }
})

export const { createOrder } = reducer.actions
const orderReducer = reducer.reducer
export default orderReducer