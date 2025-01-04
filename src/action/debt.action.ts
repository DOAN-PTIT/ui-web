import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";

export const fetchDebts = createAsyncThunk(
  "debt/fetchDebts",
  async (params: any) => {
    const { shop_id } = params;
    const url = `shop/${shop_id}/debts`;
    return await apiClient
      .get(url, { params })
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((error) => console.log(error));
  }
);

export const createDebt = createAsyncThunk(
  "debt/createDebt",
  async (params: any) => {
    const { shop_id, data } = params;
    console.log(params);
    const url = `shop/${shop_id}/debt/create`;
    return await apiClient
      .post(url, data)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((error) => console.log(error));
  }
);

export const updateDebt = createAsyncThunk(
  "debt/updateDebt",
  async (params: any) => {
    const { shop_id, data, id } = params;
    // const { debt_type, ...res } = data
    // res.deal_date = moment(res.deal_date).format("YYYY-MM-DD");
    // res.purchase_date = moment(res.purchase_date).format("YYYY-MM-DD");
    // res.money_must_pay = res.tota
    const url = `shop/${shop_id}/debt/${id}/update`;
    return await apiClient
      .post(url, data)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((error) => console.log(error));
  }
);

export const getDebtDetail = createAsyncThunk(
  "debt/getDebtDetail",
  async (params: any) => {
    const { shop_id, id } = params;
    const url = `shop/${shop_id}/debt/${id}`;
    return await apiClient
      .get(url)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((error) => console.log(error));
  }
);
