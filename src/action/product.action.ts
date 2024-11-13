import { getHostName } from "@/utils/tools";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let accessToken: any;
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("accessToken");
}
console.log(accessToken);

export const getListProduct = createAsyncThunk(
  "product/getListProduct",
  async (data: any) => {
  const {shopId, page} = data    
  const url = `${getHostName()}/shop/products/${shopId}`;
    return await axios
      .post(url, _, {
        withCredentials: true,
        params: {
          page: page,
          sortBy: "CREATED_AT_ASC"
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data: any) => {
    const {shopId, ...res} = data
    const url = `${getHostName()}/shop/create-product/${shopId}`;
    return await axios
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
