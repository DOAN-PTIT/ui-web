import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListOrders = createAsyncThunk(
  "order/getListOrders",
  async (params: { page: number; page_size: number; shop_id: number }) => {
    const url = `shop/${params.shop_id}/orders`;
    return await apiClient
      .get(url, { params })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
);
