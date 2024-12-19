import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createPurchase = createAsyncThunk(
  "purchase/createPurchase",
  async (params: any) => {
    const { shop_id, data } = params;
    const url = `/shop/${shop_id}/purchase/create`;
    return await apiClient
      .post(url, data)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.log(err));
  }
);

export const updatePurchase = createAsyncThunk(
  "purchase/updatePurchase",
  async (params: any) => {
    const { shop_id, id, data } = params;
    const url = `/shop/${shop_id}/purchase/${id}/update`;
    return await apiClient
      .post(url, data)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.log(err));
  }
);
