import { getCurrentShop } from "@/action/shop.action";
import { createSlice } from "@reduxjs/toolkit";

const reducer = createSlice({
    name: 'shop',
    initialState: {
        shop: {
            fb_shop_id: "",
            id: 0,
            name: "",
        },
        isLoading: false
    },
    reducers: {
        setShop: (state, action) => {
            state.shop = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentShop.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCurrentShop.fulfilled, (state, action) => {
                state.isLoading = false
                state.shop = action.payload
            })
            .addCase(getCurrentShop.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const { setShop, setIsLoading } = reducer.actions
const shopReducer = reducer.reducer
export default shopReducer