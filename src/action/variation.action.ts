import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createVariation = createAsyncThunk(
  "variation/createVariation",
  async (variation: any, { rejectWithValue }) => {
    const { shop_id, product_id, ...res } = variation;
    const url = `/shop/${shop_id}/${product_id}/variation`;


    return await apiClient
      .post(url, res)
      .then((res) => res.data)
      .catch((error) => rejectWithValue(error.response.data));
  }
);
