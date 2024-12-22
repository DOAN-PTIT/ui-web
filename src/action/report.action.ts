import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getRevenueReport = createAsyncThunk(
    "report/getRevenueReport",
    async (params: any) => {
        const {shop_id, year, month} = params
        const url = `shop/${shop_id}/revenue-stats?year=${year}${month ? `&month=${month} ` : ""}`
        return await apiClient.get(url)
        .then(res => {
            return res.data
        })
        .catch(error => {
            console.log(error);
        })
    }
)