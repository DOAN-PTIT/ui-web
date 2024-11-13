import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

let accessToken: any;
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("accessToken");
}

export const getListProduct = createAsyncThunk(
  "product/getListProduct",
  async (data: any) => {
  const {shopId, page} = data
  const url = `/shop/products/${shopId}?page=${page}&sortBy=CREATED_AT_DESC`;
    return await apiClient
      .post(url)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data: any) => {
    const {shopId, ...res} = data
    const url = `/shop/create-product/${shopId}`;
    return await apiClient
      .post(url, res, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
)
