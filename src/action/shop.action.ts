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