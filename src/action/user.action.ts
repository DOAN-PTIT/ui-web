import apiClient from "@/service/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

let accessToken: any;
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("accessToken");
}

export const getUserProfile = createAsyncThunk(
    "user/getUserProfile",
    async () => {
        const url = "/user/profile"
        return await apiClient
            .get(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => res.data)
            .catch((error) => console.log(error));
    }
)