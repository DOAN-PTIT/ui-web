import { getUserProfile } from "@/action/user.action";
import { createSlice } from "@reduxjs/toolkit";

const reducer = createSlice({
    name: 'user',
    initialState: {
        user: {
            access_token: "",
        },
        isLoading: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(getUserProfile.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const { setUser, setIsLoading } = reducer.actions
const userReducer = reducer.reducer
export default userReducer