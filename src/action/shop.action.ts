import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCurrentShop = createAsyncThunk(
    "shop/getCurrentShop",
    async (data: any) => {
        const { shopId } = data
        const url = `/shop/${shopId}`;
        return await apiClient
        .get(url)
        .then((res) => res.data)
        .catch((error) => console.log(error));
    }
)

export const getListShopUser = createAsyncThunk(
    "shop/getListShopUser",
    async (params: any) => {
        const { shopId } = params
        const url = `/shop/${shopId}/employees?page=1&sortBy=CREATED_AT_ASC`;
        return await apiClient
        .get(url)
        .then((res) => res.data)
        .catch((error) => console.log(error)); 
    }
)