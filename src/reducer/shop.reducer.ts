import { getCurrentShop, getListShopUser } from "@/action/shop.action";
import { Supplier } from "@/utils/type";
import { createSlice } from "@reduxjs/toolkit";

const reducer = createSlice({
    name: 'shop',
    initialState: {
        shop: {
            fb_shop_id: "",
            id: 0,
            name: "",
            avatar: "",
            suppliers: [] as Supplier[],
            shop_delivery_company: [],
        },
        user: {
            employees: [{
                id: '',
                name: '',
                avatar:'',
                email: '',
                phone_number: '',
            }]

        },
        isLoading: false,
        collapsed: false
    },
    reducers: {
        setShop: (state, action) => {
            state.shop = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        handleCollapsed: (state, action) => {
            state.collapsed = action.payload
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
            .addCase(getListShopUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getListShopUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(getListShopUser.rejected, (state) => {
                state.isLoading = false
            })

    }
})

export const { setShop, setIsLoading, handleCollapsed } = reducer.actions
const shopReducer = reducer.reducer
export default shopReducer