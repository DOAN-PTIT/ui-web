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
  const search = data.search || "";
  const url = `/shop/products/${shopId}?page=${page}&sortBy=CREATED_AT_DESC${search ? `&search=${search}` : ""}`;
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

export const getListProductFBShop = createAsyncThunk(
  "product/getListProductFBShop",
  async (data: any) => {
    const {access_token, fb_shop_id} = data
    const url = 
      `https://graph.facebook.com/v21.0/${fb_shop_id}/product_catalogs?fields=product_groups%7Bid%2Cretailer_id%2Cproduct_catalog%2Cproducts%7Bname%2Cdescription%2Cprice%2Cimage_url%2Curl%2Csale_price%2Cinventory%7D%2Cvariants%7D&access_token=${access_token}`;

    return await apiClient
      .get(url)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
)

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (data: any) => {
    const { shop_id, product_id } = data
    const url = `/shop/product/${shop_id}/product/${product_id}`;
    return await apiClient
      .get(url)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
)