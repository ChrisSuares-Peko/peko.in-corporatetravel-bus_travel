import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ProgressState {
    departmentAndEmployees: boolean;
    progress: string;
    holidays: boolean;
    hrSettings: boolean;
    setUpWps: boolean;
    showDashboard: boolean;
    isPurchased: boolean;
}

const initialState: ProgressState = {
    departmentAndEmployees: false,
    progress: '0%',
    holidays: false,
    hrSettings: false,
    setUpWps: false,
    showDashboard: false,
    isPurchased: false,
};

export const payrollAuthSlice = createSlice({
    name: 'payrollAuth',
    initialState,
    reducers: {
        setPayrollProgress: (state, action: PayloadAction<Partial<ProgressState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
    },
});

export const { setPayrollProgress } = payrollAuthSlice.actions;

export default payrollAuthSlice.reducer;
