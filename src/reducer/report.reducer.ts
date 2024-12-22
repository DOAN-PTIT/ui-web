import { DisplayChart } from '@/utils/type';
import { getRevenueReport } from "@/action/report.action";
import { createSlice } from "@reduxjs/toolkit";

interface initialState {
    loading: boolean;
    year: number;
    month: number | null;
    displayType: DisplayChart;
}

const initialState: initialState = {
    loading: false,
    year: new Date().getFullYear(),
    month: new Date().getMonth() || null,
    displayType: "year"
}

const reducer = createSlice({
    name: "report",
    initialState,
    reducers: {
        selectYear: (state, action) => {
            state.year = action.payload
        },
        selectMoth: (state, action) => {
            state.month = action.payload
        },
        selectDisplayType: (state, action) => {
            state.displayType = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getRevenueReport.pending, (state) => {
                state.loading = true
            })
            .addCase(getRevenueReport.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(getRevenueReport.rejected, (state) => {
                state.loading = false
            })
    }
})

export const { selectYear, selectMoth, selectDisplayType } = reducer.actions
const reportReducer = reducer.reducer
export default reportReducer