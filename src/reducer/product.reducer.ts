import { createSlice } from "@reduxjs/toolkit";
import { createProduct, getListProduct, getListProductFBShop } from "@/action/product.action";
import { Product } from "@/utils/type";

const productReducer = createSlice({
    name: 'product',
    initialState: {
        listProduct: {
            products: [] as Product[],
            totalCount: 0
        },
        productsFacebookShop: {
            products: [] as Product[],
            totalCount: 0
        },
        isLoading: false,
        createProduct: {} as any
    },
    reducers: {
        setListProduct: (state, action) => {
            state.listProduct = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getListProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getListProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listProduct = action.payload;
            })
            .addCase(getListProduct.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.createProduct = action.payload;
            })
            .addCase(createProduct.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getListProductFBShop.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getListProductFBShop.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productsFacebookShop = action.payload;
            })
            .addCase(getListProductFBShop.rejected, (state) => {
                state.isLoading = false;
            })
    }
})

export const { setListProduct, setIsLoading } = productReducer.actions;
export default productReducer.reducer;