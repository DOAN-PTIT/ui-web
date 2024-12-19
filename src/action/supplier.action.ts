import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListSupplier = createAsyncThunk(
  "supplier/getListSupplier",
  async (params: any) => {
    const url = `shop/${params.shopId}/suppliers`;
    return await apiClient
      .get(url)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
        return [];
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

export const updateSupplier = createAsyncThunk(
    "supplier/updateSupplier",
    async (params: any) => {
        const url = `shop/${params.shopId}/supplier/${params.supplierId}/update`;
        return await apiClient
        .post(url, params.data)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
    }
)
